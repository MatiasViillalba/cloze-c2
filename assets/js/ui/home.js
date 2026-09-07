/**
 * Home screen — the daily dashboard.
 *
 * One question drives the whole layout: what should this learner do in the
 * next ten minutes? The readiness ring answers "how close am I to a Grade A",
 * the action list answers "what do I press", and the weak-skill strip makes
 * the mistakes impossible to look away from.
 */
(function (CPE) {
  'use strict';
  const { el, pct, clamp } = CPE.util;

  /** Reusable progress ring. Returns a node; `value` is 0..100. */
  function ring(value, caption) {
    const R = 46;
    const C = 2 * Math.PI * R;
    const v = clamp(value, 0, 100);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 108 108');

    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('class', 'ring__track');
    track.setAttribute('cx', '54'); track.setAttribute('cy', '54'); track.setAttribute('r', String(R));

    const arc = document.createElementNS(svgNS, 'circle');
    arc.setAttribute('class', 'ring__value');
    arc.setAttribute('cx', '54'); arc.setAttribute('cy', '54'); arc.setAttribute('r', String(R));
    arc.setAttribute('stroke-dasharray', String(C));
    arc.setAttribute('stroke-dashoffset', String(C));

    svg.appendChild(track);
    svg.appendChild(arc);

    const wrap = el('div.ring', null,
      svg,
      el('div.ring__label', null,
        el('div.ring__num', { text: v + '%' }),
        el('div.ring__cap', { text: caption || 'Grade A' })
      )
    );

    /* Animate on the next frame so the transition actually runs. */
    requestAnimationFrame(() => {
      arc.setAttribute('stroke-dashoffset', String(C - (C * v) / 100));
    });
    return wrap;
  }

  function icon(path) {
    const svg = `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
    return el('span.action__ico', { html: svg });
  }

  const ICONS = {
    bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor"/>',
    exam: '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12h7M9 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    redo: '<path d="M4 12a8 8 0 1 1 2.3 5.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M4 6v5h5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    cards: '<rect x="3" y="6" width="14" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 3h11a3 3 0 0 1 3 3v10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
  };

  function action(opts) {
    return el('button.action' + (opts.primary ? '.action--primary' : ''), { type: 'button', onclick: opts.onclick },
      icon(opts.icon),
      el('div.action__txt', null,
        el('b', { text: opts.title }),
        el('span', { text: opts.sub })
      ),
      opts.badge ? el('span.action__badge', { text: String(opts.badge) }) : null
    );
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 6) return 'Madrugando';
    if (h < 13) return 'Buen día';
    if (h < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  function render(host) {
    const keys = CPE.content.allKeys();
    const ov = CPE.srs.overview(keys);
    const store = CPE.store;
    const done = store.todayCount();
    const goal = store.get('settings').dailyGoal;
    const weak = CPE.content.weakSkills(5);
    const totals = store.get('totals');

    host.innerHTML = '';
    const frag = el('div.stagger', null);

    /* --- Hero ------------------------------------------------------------ */
    const hero = el('div.card.card--hero', { style: '--i:0' },
      el('div.hero', null,
        el('div.hero__copy', null,
          el('div.hero__grade', { text: greeting() }),
          el('div.hero__title', { text: ov.readiness >= 90 ? 'Estás en nivel Grade A' : 'Camino al Grade A' }),
          el('div.hero__sub', {
            text: ov.seen === 0
              ? 'Empezá por una sesión inteligente: la app elige por vos y aprende de tus fallos.'
              : ov.mastered + ' de ' + ov.total + ' patrones dominados · ' + ov.accuracy + '% de acierto histórico'
          })
        ),
        ring(ov.readiness)
      ),
      el('div.goal', null,
        el('div.goal__head', null,
          el('b', { text: 'Objetivo de hoy' }),
          el('span', { text: done + ' / ' + goal })
        ),
        el('div.bar', null, el('div.bar__fill', { style: 'width:' + Math.min(100, pct(done, goal)) + '%' }))
      )
    );
    frag.appendChild(hero);

    /* --- Actions --------------------------------------------------------- */
    const actions = el('div.actions', { style: '--i:1' },
      action({
        primary: true,
        icon: ICONS.bolt,
        title: 'Sesión inteligente',
        sub: 'Un texto completo + repaso de lo que fallaste',
        onclick: () => CPE.app.startSmart()
      }),
      action({
        icon: ICONS.exam,
        title: 'Examen: Open Cloze',
        sub: 'Un texto de 8 huecos, formato Cambridge Part 2',
        onclick: () => CPE.app.startCloze()
      }),
      action({
        icon: ICONS.cards,
        title: 'Entrenamiento rápido',
        sub: '15 huecos sueltos, elegidos por el algoritmo',
        onclick: () => CPE.app.startDrill({ n: 15 })
      }),
      action({
        icon: ICONS.redo,
        title: 'Repaso de fallos',
        sub: weak.length ? 'Solo los patrones que fallaste' : 'Todavía no tenés fallos registrados',
        badge: weak.length ? CPE.srs.weakKeys(keys).length : 0,
        onclick: () => {
          if (!CPE.srs.weakKeys(keys).length) { CPE.toast('Sin fallos pendientes. ¡Seguí así!', 'good'); return; }
          CPE.app.startDrill({ n: 15, onlyWeak: true });
        }
      })
    );
    frag.appendChild(actions);

    /* --- Tiles ----------------------------------------------------------- */
    frag.appendChild(el('div.eyebrow', { style: '--i:2', text: 'Tu progreso' }));
    frag.appendChild(el('div.tiles', { style: '--i:3' },
      el('div.tile', null, el('b', { text: String(store.liveStreak()) }), el('span', { text: 'días de racha' })),
      el('div.tile', null, el('b', { text: String(totals.items) }), el('span', { text: 'huecos resueltos' })),
      el('div.tile', null, el('b', { text: ov.due + '' }), el('span', { text: 'a repasar hoy' }))
    ));

    /* --- Weak skills ----------------------------------------------------- */
    if (weak.length) {
      frag.appendChild(el('div.eyebrow', { style: '--i:4', text: 'Puntos débiles' }));
      const list = el('div.weak-list', { style: '--i:5' });
      weak.forEach((s) => {
        const rec = CPE.store.get('skills')[s.k] || { box: 0 };
        const pips = el('div.weak__box');
        for (let i = 0; i < 5; i++) {
          pips.appendChild(el('i.weak__pip' + (i < rec.box ? '.is-on' : '')));
        }
        list.appendChild(el('div.weak', null,
          el('div.weak__word', { text: s.a }),
          el('div.weak__pat', { text: s.p }),
          pips
        ));
      });
      frag.appendChild(list);
    }

    /* --- Library teaser -------------------------------------------------- */
    const stats = CPE.content.stats();
    frag.appendChild(el('div.card.card--tap', {
      style: '--i:6; margin-top:14px', onclick: () => CPE.app.go('library')
    },
      el('div.row.row--between', null,
        el('div.grow', null,
          el('div.h3', { text: 'Biblioteca completa' }),
          el('div.muted', { text: stats.passages + ' textos · ' + stats.gaps + ' huecos · ' + stats.skills + ' patrones' })
        ),
        el('span.chip.chip--ember', { text: 'Ver' })
      )
    ));

    host.appendChild(frag);
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.ring = ring;
  CPE.ui.home = { render, title: 'Cloze<span>C2</span>' };
}(window.CPE));
