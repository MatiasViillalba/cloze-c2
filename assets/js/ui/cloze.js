/**
 * Open Cloze screen — the exam itself.
 *
 * A passage is rendered as running prose with inline inputs, exactly as the
 * paper presents it. Grading is deferred until the learner asks for it (as in
 * the exam), after which every gap is annotated with the pattern it was
 * testing and a Spanish explanation of why the answer is what it is.
 */
(function (CPE) {
  'use strict';
  const { el, matches, haptic, pct } = CPE.util;

  let state = null;

  /* ------------------------------------------------------------ Building --- */

  function gapNode(gap) {
    const input = el('input.gap__input', {
      type: 'text',
      inputmode: 'text',
      autocapitalize: 'characters',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      enterkeyhint: 'next',
      'aria-label': 'Hueco ' + gap.n,
      placeholder: '·····',
      'data-n': gap.n
    });

    input.addEventListener('input', () => {
      state.answers[gap.n] = input.value;
      updateProgress();
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      const next = state.host.querySelector('.gap__input[data-n="' + (gap.n + 1) + '"]');
      if (next) next.focus();
      else input.blur();
    });

    const wrap = el('span.gap', { 'data-gap': gap.n },
      el('span.gap__num', { text: String(gap.n) }),
      input
    );
    return wrap;
  }

  function passageNode(passage) {
    const container = el('div.passage', { 'data-selectable': true });

    passage.text.split(/\n\n+/).forEach((para, pi) => {
      const p = el('p' + (pi === 0 ? '.passage__lead' : ''));
      /* Split on the {n} markers, keeping the numbers. */
      para.split(/\{(\d+)\}/).forEach((chunk, i) => {
        if (i % 2 === 1) {
          const gap = passage.gaps[Number(chunk) - 1];
          p.appendChild(gapNode(gap));
        } else if (chunk) {
          p.appendChild(document.createTextNode(chunk));
        }
      });
      container.appendChild(p);
    });

    return container;
  }

  function updateProgress() {
    if (!state) return;
    const filled = state.passage.gaps.filter((g) => (state.answers[g.n] || '').trim()).length;
    const total = state.passage.gaps.length;
    state.bar.style.width = pct(filled, total) + '%';
    state.counter.textContent = filled + '/' + total;
    state.submit.disabled = state.checked ? false : filled === 0;
  }

  /* ------------------------------------------------------------- Grading --- */

  function explain(gap, given, ok) {
    return el('div.explain.' + (ok ? 'is-right' : 'is-wrong'), null,
      el('div.explain__head', null,
        el('span.explain__key', { text: gap.n + '. ' + gap.a }),
        el('span.explain__pat', { text: gap.p }),
        ok ? el('span.chip.chip--good', { text: 'Correcto' })
           : el('span.chip.chip--bad', { text: given ? 'Pusiste: ' + given.toUpperCase() : 'Sin responder' })
      ),
      el('div.explain__txt', { text: gap.tip })
    );
  }

  function check() {
    if (state.checked) { CPE.app.showResult(); return; }

    let score = 0;
    const wrongKeys = [];

    state.passage.gaps.forEach((gap) => {
      const given = (state.answers[gap.n] || '').trim();
      const ok = matches(given, gap);
      if (ok) score += 1; else wrongKeys.push(gap.k);

      CPE.srs.grade(gap.k, ok);

      const wrap = state.host.querySelector('[data-gap="' + gap.n + '"]');
      const input = wrap.querySelector('input');
      wrap.classList.add(ok ? 'is-right' : 'is-wrong');
      input.value = given.toUpperCase();
      input.readOnly = true;
      if (!ok) wrap.appendChild(el('span.gap__fix', { text: gap.a }));
    });

    const total = state.passage.gaps.length;
    CPE.store.logAnswers(total, score);
    CPE.store.logExercise(state.passage.id, score, total);
    CPE.store.flush();

    haptic(score === total ? 'win' : score >= total * 0.75 ? 'good' : 'bad');

    /* Inline review under the passage. */
    const review = el('div.review-list');
    review.appendChild(el('div.eyebrow', { text: 'Corrección y patrones', style: 'margin-top:6px' }));
    state.passage.gaps.forEach((gap) => {
      const given = (state.answers[gap.n] || '').trim();
      review.appendChild(explain(gap, given, matches(given, gap)));
    });
    state.reviewHost.appendChild(review);

    state.checked = true;
    state.submit.textContent = 'Ver resultado';
    state.submit.disabled = false;
    state.result = { score, total, wrongKeys, id: state.passage.id, title: state.passage.title, kind: 'cloze' };

    if (review.scrollIntoView) review.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* --------------------------------------------------------------- Hints --- */

  function openHints() {
    const body = el('div');
    body.appendChild(el('div.h2', { text: 'Pistas', style: 'margin-bottom:4px' }));
    body.appendChild(el('div.muted', { text: 'Solo el tipo de estructura de cada hueco: la palabra la ponés vos.', style: 'margin-bottom:14px' }));
    state.passage.gaps.forEach((gap) => {
      body.appendChild(el('div.explain', { style: 'margin-bottom:8px' },
        el('div.explain__head', null,
          el('span.explain__key', { text: 'Hueco ' + gap.n }),
          el('span.explain__pat', { text: gap.p })
        )
      ));
    });
    CPE.sheet.open(body);
  }

  /* -------------------------------------------------------------- Render --- */

  function render(host, params) {
    const passage = (params && params.passage) || CPE.content.pickPassage();
    host.innerHTML = '';

    state = { passage, answers: {}, checked: false, host, result: null };

    const rec = CPE.store.get('exercises')[passage.id];

    host.appendChild(el('div.ex-head', null,
      el('div.ex-head__meta', null,
        el('span.chip.chip--ember', { text: 'Open Cloze · Part 2' }),
        el('span.chip', { text: passage.gaps.length + ' huecos' }),
        rec ? el('span.chip', { text: 'Mejor: ' + rec.best + '/' + passage.gaps.length }) : null
      ),
      el('div.ex-head__title', { text: passage.title }),
      el('div.ex-head__brief', { text: passage.brief })
    ));

    const bar = el('div.bar__fill', { style: 'width:0%' });
    const counter = el('b', { text: '0/' + passage.gaps.length });
    host.appendChild(el('div.ex-progress', null,
      el('div.bar', null, bar),
      counter
    ));

    host.appendChild(passageNode(passage));

    host.appendChild(el('div.ex-tools', null,
      el('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: openHints }, 'Pistas'),
      el('button.btn.btn--ghost.btn--sm', {
        type: 'button',
        onclick: () => CPE.app.go('cloze', { passage })
      }, 'Reiniciar')
    ));

    const reviewHost = el('div');
    host.appendChild(reviewHost);

    const submit = el('button.btn.btn--primary.btn--block', { type: 'button', disabled: true, onclick: check }, 'Corregir');
    host.appendChild(el('div.ex-actions', null, submit));

    state.bar = bar;
    state.counter = counter;
    state.submit = submit;
    state.reviewHost = reviewHost;

    updateProgress();
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.cloze = {
    render,
    title: 'Open Cloze',
    immersive: true,
    getResult: () => (state ? state.result : null)
  };
}(window.CPE));
