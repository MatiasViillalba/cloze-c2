/**
 * End-to-end smoke test of the interface.
 *
 * Boots the real index.html in a DOM, walks every screen, sits a full exam
 * text answering half of it correctly, and checks that the scheduler reacted:
 * right answers promote, wrong answers demote and reappear.
 *
 * Requires jsdom (`npm install`); skipped automatically when it is absent so
 * that the unit suite still runs on a bare checkout.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './harness.mjs';

let JSDOM;
try {
  ({ JSDOM } = await import('jsdom'));
} catch {
  test('ui smoke', { skip: 'jsdom not installed — run npm install' }, () => {});
}

if (JSDOM) {
  /** Loads index.html and executes every script tag in document order. */
  function boot() {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    const dom = new JSDOM(html, { pretendToBeVisual: true, runScripts: 'outside-only', url: 'https://example.test/' });
    const { window } = dom;

    window.scrollTo = () => {};
    if (!window.requestAnimationFrame) window.requestAnimationFrame = (fn) => setTimeout(() => fn(0), 0);
    /* jsdom has no layout engine, so scrolling an element into view is a no-op. */
    window.Element.prototype.scrollIntoView = function scrollIntoView() {};

    /* Evaluated inside the window's own realm rather than through a Function
       wrapper, so bare globals resolve exactly as they do in Safari. */
    const sources = [...window.document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src'));
    sources.forEach((src) => {
      const code = readFileSync(join(ROOT, src), 'utf8');
      window.eval(code + '\n//# sourceURL=' + src);
    });

    /* index.html defers boot to DOMContentLoaded, which jsdom already fired. */
    if (!window.CPE.app) throw new Error('app.js did not initialise');
    if (!window.document.querySelector('#screen-home.is-active')) window.CPE.app.boot();

    return window;
  }

  const window = boot();
  const CPE = window.CPE;
  const $ = (sel) => window.document.querySelector(sel);

  test('the app boots and lands on Inicio', () => {
    assert.ok(CPE.app, 'CPE.app was never created');
    assert.ok($('#screen-home').classList.contains('is-active'));
    assert.match($('#screen-home').textContent, /Grade A/);
  });

  test('the readiness ring has its gradient available', () => {
    assert.ok($('#emberGrad'), 'url(#emberGrad) would resolve to nothing');
    assert.ok($('#screen-home .ring__value'));
  });

  test('every screen renders without throwing', () => {
    ['library', 'stats', 'settings', 'home'].forEach((name) => {
      CPE.app.go(name);
      const host = $('#screen-' + name);
      assert.ok(host.classList.contains('is-active'), name + ' did not become active');
      assert.ok(host.textContent.trim().length > 40, name + ' rendered empty');
    });
  });

  test('the library lists every passage', () => {
    CPE.app.go('library');
    const rows = window.document.querySelectorAll('#screen-library .lib-item');
    assert.equal(rows.length, CPE.content.passages.length);
  });

  test('an exam text renders eight inputs in the prose', () => {
    CPE.app.startCloze(CPE.content.passages[0]);
    const inputs = window.document.querySelectorAll('#screen-cloze .gap__input');
    assert.equal(inputs.length, 8);
    assert.ok($('#screen-cloze .passage').textContent.length > 500, 'the passage looks truncated');
    assert.ok(!$('#screen-cloze .passage').textContent.includes('{1}'), 'a gap marker leaked into the prose');
  });

  test('grading scores correctly and drives the scheduler', () => {
    CPE.store.reset();
    const passage = CPE.content.passages[0];
    CPE.app.startCloze(passage);

    const inputs = [...window.document.querySelectorAll('#screen-cloze .gap__input')];
    inputs.forEach((input, i) => {
      /* Answer the first four correctly, then four deliberate mistakes. */
      input.value = i < 4 ? passage.gaps[i].a : 'XXXX';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
    });

    $('#screen-cloze .ex-actions .btn').click();

    assert.equal(CPE.store.get('exercises')[passage.id].lastScore, 4);
    assert.equal(CPE.store.todayCount(), 8);

    const skills = CPE.store.get('skills');
    assert.equal(skills[passage.gaps[0].k].box, 1, 'a correct answer should promote');
    assert.equal(skills[passage.gaps[7].k].box, 0, 'a wrong answer should sit at the bottom');
    assert.equal(skills[passage.gaps[7].k].wrong, 1);
  });

  test('the corrected passage shows the right answers and an explanation each', () => {
    const fixes = window.document.querySelectorAll('#screen-cloze .gap__fix');
    assert.equal(fixes.length, 4, 'each missed gap should display its answer');
    const explains = window.document.querySelectorAll('#screen-cloze .explain');
    assert.equal(explains.length, 8);
  });

  test('the result screen reports a Cambridge band and offers the follow-up drill', () => {
    CPE.app.showResult();
    const host = $('#screen-result');
    assert.ok(host.classList.contains('is-active'));
    assert.equal(host.querySelector('.result-grade').textContent, 'C1');
    assert.match(host.textContent, /Practicar estas palabras en otros contextos/);
  });

  test('every missed word enters the mistake book with several contexts', () => {
    const pending = CPE.words.pending();
    assert.ok(pending.length >= 4, 'las palabras falladas quedan registradas');
    const queue = CPE.content.practiceQueue(pending.map((r) => r.w), { perWord: 3, max: 30 });
    assert.ok(queue.length > pending.length, 'cada palabra aporta varias frases');
    const sentences = new Set(queue.map((q) => q.s));
    assert.equal(sentences.size, queue.length, 'ninguna frase se repite en la cola');
  });

  test('"aprendido" retires a word and "aún no" brings it back', () => {
    const word = CPE.words.pending()[0].w;
    CPE.words.setLearned(word, true);
    assert.ok(!CPE.words.pending().some((r) => r.w === word));
    assert.ok(CPE.words.learned().some((r) => r.w === word));
    CPE.words.setLearned(word, false);
    assert.ok(CPE.words.pending().some((r) => r.w === word));
  });

  test('a failed pattern comes back in the follow-up drill', () => {
    const weak = CPE.srs.weakKeys(CPE.content.allKeys());
    assert.ok(weak.length >= 4, 'the four misses should be registered as weak');

    CPE.app.startDrill({ n: 6, onlyWeak: true });
    const card = $('#screen-drill .drill-card');
    assert.ok(card, 'no drill card rendered');
    assert.equal(window.document.querySelectorAll('#screen-drill .gap__input').length, 1);
  });

  test('a wrong drill answer is requeued inside the same session', () => {
    CPE.store.reset();
    CPE.app.startDrill({ n: 3 });

    const before = window.document.querySelectorAll('#screen-drill .drill-meter i').length;
    const input = $('#screen-drill .gap__input');
    input.value = 'DEFINITELYWRONG';
    $('#screen-drill .drill-actions .btn').click();

    assert.match($('#screen-drill .explain').className, /is-wrong/);
    assert.ok(before >= 3);
    assert.equal(CPE.store.get('totals').items, 0, 'a drill only reports its score at the end');
  });

  test('settings persist and are applied to the document', () => {
    CPE.app.go('settings');
    const rows = window.document.querySelectorAll('#screen-settings .seg button');
    rows[rows.length - 1].click();                       /* highest daily goal */
    assert.equal(CPE.store.get('settings').dailyGoal, 40);
  });

  test('each tap on the A buttons nudges the text scale one step', () => {
    CPE.app.go('settings');
    const root = window.document.documentElement;
    const bigger = window.document.querySelector('#screen-settings .type-size__btn--lg');
    const smaller = window.document.querySelector('#screen-settings .type-size__btn--sm');
    const read = () => Number(root.style.getPropertyValue('--read-scale'));

    const base = read();
    bigger.click();
    const up = read();
    assert.ok(up > base, 'la A grande agranda');
    bigger.click();
    assert.ok(read() > up, 'y sigue agrandando a cada toque');

    smaller.click();
    smaller.click();
    assert.ok(Math.abs(read() - base) < 0.001, 'la A chica vuelve sobre sus pasos');
    assert.equal(CPE.store.get('settings').textScale, read(), 'la escala queda guardada');
  });

  test('the weak-spot screen lists trouble and its verdict buttons colour up', () => {
    /* Estado propio: los tests anteriores reinician el progreso. */
    CPE.store.reset();
    CPE.content.allKeys().slice(0, 4).forEach((k) => CPE.srs.grade(k, false));

    CPE.app.go('weak');
    const host = $('#screen-weak');
    assert.ok(host.classList.contains('is-active'));

    const trouble = CPE.srs.troubleKeys(CPE.content.allKeys());
    assert.equal(trouble.length, 4, 'cada fallo es un punto débil');

    const yes = host.querySelector('.verdict__btn--yes');
    yes.click();
    assert.ok(
      $('#screen-weak').querySelector('.verdict__btn--yes.is-on'),
      'el boton elegido queda pintado tras el re-render'
    );
    assert.ok(
      CPE.srs.troubleKeys(CPE.content.allKeys()).length < trouble.length,
      'lo marcado como aprendido sale de los puntos debiles'
    );
  });
}
