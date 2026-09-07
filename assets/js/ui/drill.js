/**
 * Drill screen — one sentence, one gap, immediate feedback.
 *
 * This is where the spaced-repetition loop is felt: a missed item is pushed
 * back into the current queue a few cards later (the lapse queue) as well as
 * being demoted two Leitner boxes, so it returns both within minutes and
 * within days.
 */
(function (CPE) {
  'use strict';
  const { el, matches, haptic } = CPE.util;

  let state = null;

  function meter() {
    const wrap = el('div.drill-meter');
    for (let i = 0; i < state.planned; i++) {
      const pip = el('i');
      if (i < state.done.length) pip.classList.add(state.done[i] ? 'is-done' : 'is-bad');
      wrap.appendChild(pip);
    }
    return wrap;
  }

  function sentenceNode(item, input) {
    const p = el('div.drill-card__s');
    item.s.split(/\{1\}/).forEach((chunk, i) => {
      if (i > 0) p.appendChild(input);
      if (chunk) p.appendChild(document.createTextNode(chunk));
    });
    return p;
  }

  function finish() {
    const total = state.answered;
    const right = state.right;
    CPE.store.logAnswers(total, right);
    CPE.store.flush();
    state.result = {
      score: right,
      total,
      wrongKeys: state.wrongKeys,
      wrongWords: state.wrongWords,
      title: state.mode === 'practice' ? 'Práctica de errores'
        : state.onlyWeak ? 'Repaso de fallos' : 'Entrenamiento rápido',
      kind: 'drill',
      mode: state.mode
    };
    CPE.app.showResult();
  }

  /**
   * The two small buttons that put the learner in charge of the mistake book.
   * "Aprendido" retires the word from mistake practice for good; "Aún no"
   * keeps it in circulation. Nothing else in the app can retire a word.
   */
  function verdictRow(word, onDone) {
    const row = el('div.verdict');
    const info = CPE.words.info(word);
    const hint = CPE.words.looksLearned(word)
      ? 'Llevás ' + info.streak + ' aciertos seguidos con esta palabra.'
      : '¿Ya dominás «' + word + '»?';

    const yes = el('button.verdict__btn.verdict__btn--yes', { type: 'button' }, 'Aprendido');
    const no = el('button.verdict__btn', { type: 'button' }, 'Aún no');

    yes.onclick = () => {
      CPE.words.setLearned(word, true);
      CPE.util.haptic('good');
      CPE.toast('«' + word + '» no volverá a la práctica de errores', 'good');
      row.replaceChildren(el('span.verdict__done', { text: '✓ Marcada como aprendida' }));
      if (onDone) onDone(true);
    };
    no.onclick = () => {
      CPE.words.setLearned(word, false);
      CPE.util.haptic('tap');
      CPE.toast('Seguirá apareciendo hasta que la domines');
      row.replaceChildren(el('span.verdict__done', { text: '↻ Sigue en práctica' }));
      if (onDone) onDone(false);
    };

    row.appendChild(el('span.verdict__q', { text: hint }));
    row.appendChild(yes);
    row.appendChild(no);
    return row;
  }

  function step() {
    const host = state.host;
    host.innerHTML = '';

    if (!state.queue.length) { finish(); return; }

    const item = state.queue[0];
    const wrap = el('div.drill-wrap');
    wrap.appendChild(meter());

    const input = el('input.gap__input', {
      type: 'text',
      autocapitalize: 'characters',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      enterkeyhint: 'done',
      'aria-label': 'Respuesta',
      placeholder: '·····'
    });

    const card = el('div.card.drill-card', null,
      el('span.drill-card__pat', { text: item.p }),
      sentenceNode(item, input),
      el('div.drill-card__src', { text: 'Origen: ' + item.src })
    );
    wrap.appendChild(card);

    const feedback = el('div', { style: 'margin-top:12px' });
    wrap.appendChild(feedback);

    const primary = el('button.btn.btn--primary.btn--block', { type: 'button' }, 'Comprobar');
    const actions = el('div.drill-actions', null, primary);
    wrap.appendChild(actions);
    host.appendChild(wrap);

    let graded = false;

    function advance() {
      state.queue.shift();
      step();
    }

    function grade() {
      if (graded) { advance(); return; }
      graded = true;

      const given = input.value.trim();
      const ok = matches(given, item);
      input.value = given.toUpperCase();
      input.readOnly = true;
      input.style.color = ok ? 'var(--good)' : '#FF8792';
      input.style.background = ok ? 'var(--good-soft)' : 'var(--bad-soft)';
      input.style.borderBottomColor = ok ? 'var(--good)' : 'var(--bad)';

      CPE.srs.grade(item.k, ok);
      CPE.words.grade(item.a, ok);
      state.answered += 1;
      state.done.push(ok);
      if (ok) {
        state.right += 1;
      } else {
        state.wrongKeys.push(item.k);
        state.wrongWords.push(item.a);
        /* Lapse queue: bring it back three cards later, once. */
        if (!item.__repeated) {
          const clone = Object.assign({}, item, { __repeated: true });
          state.queue.splice(Math.min(4, state.queue.length), 0, clone);
        }
      }

      haptic(ok ? 'good' : 'bad');

      feedback.appendChild(el('div.explain.' + (ok ? 'is-right' : 'is-wrong'), null,
        el('div.explain__head', null,
          el('span.explain__key', { text: item.a }),
          el('span.explain__pat', { text: item.p }),
          ok ? el('span.chip.chip--good', { text: '¡Bien!' })
             : el('span.chip.chip--bad', { text: given ? 'Pusiste: ' + given.toUpperCase() : 'Sin responder' })
        ),
        el('div.explain__txt', { text: item.tip })
      ));

      /* En la práctica de errores, cada palabra la retira el propio alumno. */
      if (CPE.words.isTracked(item.a)) {
        feedback.appendChild(verdictRow(item.a, (learned) => {
          if (!learned) return;
          state.queue = state.queue.filter((q, i) => i === 0 || q.a !== item.a);
        }));
      }

      primary.textContent = state.queue.length > 1 ? 'Siguiente' : 'Terminar';
      primary.focus();
    }

    primary.addEventListener('click', grade);
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { ev.preventDefault(); grade(); }
    });

    setTimeout(() => input.focus(), 60);
  }

  function render(host, params) {
    const o = params || {};
    const n = o.n || 15;

    /* Dos fuentes de cola: el algoritmo de siempre, o —cuando venimos de la
       práctica de errores— varias frases distintas por palabra fallada. */
    const queue = o.words && o.words.length
      ? CPE.content.practiceQueue(o.words, { perWord: o.perWord || 3, max: n })
      : CPE.content.pickDrills(n, { onlyWeak: o.onlyWeak, keys: o.keys });

    state = {
      host,
      queue,
      planned: queue.length,
      done: [],
      answered: 0,
      right: 0,
      wrongKeys: [],
      wrongWords: [],
      onlyWeak: !!o.onlyWeak,
      mode: o.words && o.words.length ? 'practice' : 'drill',
      result: null
    };

    if (!queue.length) {
      host.innerHTML = '';
      host.appendChild(el('div.empty', null,
        el('div.empty__icon', { html: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }),
        el('div.h3', { text: 'Nada pendiente' }),
        el('div.muted', { text: 'No hay huecos que repasar ahora mismo. Probá con un examen completo.' }),
        el('button.btn.btn--primary', { type: 'button', style: 'margin-top:10px', onclick: () => CPE.app.startCloze() }, 'Hacer un texto')
      ));
      return;
    }

    step();
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.drill = {
    render,
    title: 'Entrenamiento',
    immersive: true,
    getResult: () => (state ? state.result : null)
  };
}(window.CPE));
