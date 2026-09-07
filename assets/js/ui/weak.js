/**
 * Puntos débiles.
 *
 * Everything the app has watched the learner get wrong, at the finest grain it
 * knows: not just the word, but the word *in a pattern* — TAKE in "take for
 * granted", AS in a fronted concessive, OFF in "take off". Grouped by what kind
 * of thing it is (modismo, phrasal verb, colocación, expresión fija…) because
 * that is how the learner experiences the weakness.
 *
 * Each row carries the same two buttons as the mistake book, and they stay
 * coloured — green for "Aprendido", red for "Aún no" — until the learner
 * changes their mind.
 */
(function (CPE) {
  'use strict';
  const { el } = CPE.util;

  function practise(keys, perKey) {
    if (!keys.length) { CPE.toast('No hay puntos débiles pendientes', 'good'); return; }
    CPE.app.startWeakPractice(keys, perKey);
  }

  /** The verdict pair. Coloured by whatever the learner last decided. */
  function verdict(k, onChange) {
    const mark = CPE.words.skillMark(k);
    const row = el('div.verdict.verdict--tight');

    const yes = el('button.verdict__btn.verdict__btn--yes' + (mark === 'yes' ? '.is-on' : ''), {
      type: 'button',
      'aria-pressed': mark === 'yes' ? 'true' : 'false'
    }, 'Aprendido');

    const no = el('button.verdict__btn.verdict__btn--no' + (mark === 'no' ? '.is-on' : ''), {
      type: 'button',
      'aria-pressed': mark === 'no' ? 'true' : 'false'
    }, 'Aún no');

    yes.onclick = () => {
      CPE.words.setSkillLearned(k, true);
      CPE.util.haptic('good');
      CPE.toast('Punto débil dominado. Sale de la práctica.', 'good');
      onChange();
    };
    no.onclick = () => {
      CPE.words.setSkillLearned(k, false);
      CPE.util.haptic('tap');
      CPE.toast('Seguirá apareciendo hasta que lo domines');
      onChange();
    };

    row.appendChild(yes);
    row.appendChild(no);
    return row;
  }

  function skillRow(k, onChange) {
    const meta = CPE.content.skillMeta(k);
    const rec = CPE.store.get('skills')[k] || { seen: 0, right: 0, wrong: 0 };
    const acc = rec.seen ? Math.round((rec.right / rec.seen) * 100) : 0;
    const tier = acc >= 80 ? 'hi' : acc >= 50 ? 'mid' : 'lo';
    const contexts = CPE.content.contextsFor(meta.a).length;
    const mark = CPE.words.skillMark(k);

    const row = el('div.mistake' + (mark ? '.is-' + mark : ''));
    row.appendChild(el('div.mistake__head', null,
      el('button.mistake__word', {
        type: 'button',
        title: 'Practicar solo este punto débil',
        onclick: () => practise([k], Math.min(6, Math.max(3, contexts)))
      }, meta.a),
      el('div.mistake__meta', null,
        el('span.mistake__acc', { 'data-t': tier, text: acc + '%' }),
        el('span.dot', { text: '·' }),
        el('span', { text: rec.wrong + ' fallo' + (rec.wrong === 1 ? '' : 's') + ' de ' + rec.seen }),
        el('span.dot', { text: '·' }),
        el('span', { text: contexts + ' contextos' })
      )
    ));
    row.appendChild(el('div.mistake__pat', { text: meta.p }));
    row.appendChild(verdict(k, onChange));
    return row;
  }

  function render(host) {
    const all = CPE.content.allKeys();
    const trouble = CPE.srs.troubleKeys(all);
    const again = () => render(host);

    /* Group by kind: modismos, phrasal verbs, colocaciones, chunks… */
    const groups = Object.create(null);
    trouble.forEach((k) => {
      const t = CPE.content.typeOf(CPE.content.skillMeta(k).p);
      (groups[t.id] || (groups[t.id] = { type: t, keys: [] })).keys.push(k);
    });

    /* Anything already retired, so it can be brought back. */
    const retired = all.filter((k) => CPE.words.skillLearned(k));

    host.innerHTML = '';
    const frag = el('div.stagger');

    frag.appendChild(el('div.card.card--hero', { style: '--i:0' },
      el('div.hero__grade', { text: 'Puntos débiles' }),
      el('div.hero__title', { text: trouble.length + (trouble.length === 1 ? ' punto' : ' puntos') }),
      el('div.hero__sub', {
        text: trouble.length
          ? 'Todo lo que fallaste o todavía tenés al 0%: palabras, chunks, colocaciones, modismos y estructuras. Vuelven hasta que los marques como aprendidos.'
          : 'Nada pendiente. Todo lo que practicaste está por encima del 0% y sin fallos abiertos.'
      }),
      trouble.length ? el('button.btn.btn--primary.btn--block', {
        type: 'button', style: 'margin-top:14px',
        onclick: () => practise(trouble)
      }, 'Practicar todos estos puntos débiles') : null,
      trouble.length > 6 ? el('button.btn.btn--ghost.btn--block', {
        type: 'button', style: 'margin-top:8px',
        onclick: () => practise(CPE.util.shuffle(trouble).slice(0, 8), 2)
      }, 'Sesión random de 8 puntos débiles') : null
    ));

    CPE.content.TYPES.forEach((t) => {
      const g = groups[t.id];
      if (!g) return;
      frag.appendChild(el('div.row.row--between.eyebrow', null,
        el('span', { text: t.label + ' (' + g.keys.length + ')' }),
        el('button.chip.chip--ember', {
          type: 'button',
          onclick: () => practise(g.keys)
        }, 'Practicar')
      ));
      const list = el('div.mistake-list');
      g.keys.forEach((k) => list.appendChild(skillRow(k, again)));
      frag.appendChild(list);
    });

    if (retired.length) {
      frag.appendChild(el('div.eyebrow', { text: 'Dominados por vos (' + retired.length + ')' }));
      const list = el('div.mistake-list');
      retired.forEach((k) => list.appendChild(skillRow(k, again)));
      frag.appendChild(list);
    }

    if (!trouble.length && !retired.length) {
      frag.appendChild(el('div.empty', null,
        el('div.empty__icon', { html: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }),
        el('div.h3', { text: 'Sin puntos débiles todavía' }),
        el('div.muted', { text: 'Hacé una sesión y acá vas a ver cada fallo agrupado por tipo, con su botón de aprendido.' }),
        el('button.btn.btn--primary', { type: 'button', style: 'margin-top:10px', onclick: () => CPE.app.startSmart() }, 'Empezar una sesión')
      ));
    }

    host.appendChild(frag);
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.weak = { render, title: 'Puntos débiles' };
}(window.CPE));
