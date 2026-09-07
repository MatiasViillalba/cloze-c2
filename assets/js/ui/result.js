/**
 * Result screen — the moment that decides whether the next session happens.
 *
 * It reports a Cambridge-style band rather than a bare percentage, names the
 * patterns that were missed, and offers the single most useful next action:
 * drilling those exact patterns straight away.
 */
(function (CPE) {
  'use strict';
  const { el, pct } = CPE.util;

  function render(host, params) {
    const r = (params && params.result) || { score: 0, total: 0, wrongKeys: [], title: '', kind: 'cloze' };
    const band = CPE.srs.band(r.score, r.total);
    const percentage = pct(r.score, r.total);
    const unique = r.wrongKeys.filter((k, i, a) => a.indexOf(k) === i);

    host.innerHTML = '';

    const hero = el('div.card.card--hero.result-hero' + (band.g === 'A' ? '.halo' : ''), null,
      el('div.result-grade', { text: band.g }),
      el('div.result-score', { text: r.score + ' / ' + r.total + '  ·  ' + percentage + '%' }),
      el('div.result-note', { text: band.note })
    );
    host.appendChild(hero);

    host.appendChild(el('div.eyebrow', { text: r.title || 'Sesión terminada' }));

    /* --- Missed patterns -------------------------------------------------- */
    if (unique.length) {
      host.appendChild(el('div.muted', { text: 'Estos patrones vuelven a aparecer automáticamente hasta que los domines:', style: 'margin-bottom:10px' }));
      const list = el('div.weak-list');
      unique.forEach((k) => {
        const s = CPE.content.skillMeta(k);
        const rec = CPE.store.get('skills')[k] || { box: 0 };
        const pips = el('div.weak__box');
        for (let i = 0; i < 5; i++) pips.appendChild(el('i.weak__pip' + (i < rec.box ? '.is-on' : '')));
        list.appendChild(el('div.weak', null,
          el('div.weak__word', { text: s.a }),
          el('div.weak__pat', { text: s.p }),
          pips
        ));
      });
      host.appendChild(list);
    } else {
      host.appendChild(el('div.card', null,
        el('div.h3', { text: 'Sin fallos en esta sesión' }),
        el('div.muted', { text: 'Perfecto. Los patrones suben de caja y volverán a aparecer más adelante para consolidarse.' })
      ));
    }

    /* --- Next actions ----------------------------------------------------- */
    const actions = el('div.result-actions');
    if (unique.length) {
      actions.appendChild(el('button.btn.btn--primary.btn--block', {
        type: 'button',
        onclick: () => CPE.app.startDrill({ n: Math.max(8, unique.length * 2), keys: unique })
      }, 'Practicar estos patrones ahora'));
    }
    actions.appendChild(el('button.btn.btn--ghost.btn--block', {
      type: 'button',
      onclick: () => (r.kind === 'cloze' ? CPE.app.startCloze() : CPE.app.startDrill({ n: 15 }))
    }, r.kind === 'cloze' ? 'Otro texto' : 'Otra ronda'));
    actions.appendChild(el('button.btn.btn--quiet.btn--block', {
      type: 'button',
      onclick: () => CPE.app.go('home')
    }, 'Volver al inicio'));
    host.appendChild(actions);

    /* --- Session footer --------------------------------------------------- */
    const ov = CPE.srs.overview(CPE.content.allKeys());
    host.appendChild(el('div.tiles', { style: 'margin-top:18px' },
      el('div.tile', null, el('b', { text: ov.readiness + '%' }), el('span', { text: 'hacia Grade A' })),
      el('div.tile', null, el('b', { text: String(CPE.store.liveStreak()) }), el('span', { text: 'días seguidos' })),
      el('div.tile', null, el('b', { text: String(CPE.store.todayCount()) }), el('span', { text: 'huecos hoy' }))
    ));
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.result = { render, title: 'Resultado', immersive: true };
}(window.CPE));
