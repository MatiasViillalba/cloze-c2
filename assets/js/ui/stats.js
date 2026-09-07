/**
 * Progress screen.
 *
 * Three questions, three answers: how close am I to a Grade A (the ring), am I
 * actually turning up (the heatmap), and which patterns are still costing me
 * marks (the Leitner distribution and the skill table).
 */
(function (CPE) {
  'use strict';
  const { el, dayKey, daysBetween, pct } = CPE.util;

  const BOX_LABELS = ['Sin ver', 'Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Dominado'];

  /** 12 weeks of activity, oldest column first, Monday at the top. */
  function heatmap() {
    const history = CPE.store.get('history');
    const grid = el('div.heat');
    const today = new Date();
    const days = 84;

    /* Pad so the first column starts on a Monday. */
    const start = new Date(today.getTime() - (days - 1) * 86400000);
    const lead = (start.getDay() + 6) % 7;
    for (let i = 0; i < lead; i++) grid.appendChild(el('i', { 'data-l': '0' }));

    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const key = dayKey(d.getTime());
      const items = (history[key] || { items: 0 }).items;
      const level = items === 0 ? 0 : items < 8 ? 1 : items < 20 ? 2 : items < 40 ? 3 : 4;
      grid.appendChild(el('i', { 'data-l': String(level), title: key + ': ' + items }));
    }
    return grid;
  }

  /** One ingredient of the readiness score, with the weight it carries. */
  function mixRow(label, note, value, weight) {
    return el('div.mix__row', null,
      el('div.mix__lab', null,
        el('b', { text: label }),
        el('span', { text: note })
      ),
      el('div.bar.bar--thin', null, el('div.bar__fill', { style: 'width:' + value + '%' })),
      el('div.mix__n', { text: value + '%' }),
      el('div.mix__w', { text: weight + '%' })
    );
  }

  function boxChart(ov) {
    const wrap = el('div.box-bars');
    const max = Math.max(1, Math.max.apply(null, ov.boxes));
    ov.boxes.forEach((n, i) => {
      wrap.appendChild(el('div.box-bar', null,
        el('div.box-bar__lab', { text: BOX_LABELS[i] }),
        el('div.bar.bar--thin', null, el('div.bar__fill', { style: 'width:' + pct(n, max) + '%' })),
        el('div.box-bar__n', { text: String(n) })
      ));
    });
    return wrap;
  }

  function skillTable() {
    const skills = CPE.store.get('skills');
    const rows = Object.keys(skills)
      .filter((k) => skills[k].seen > 0)
      .map((k) => {
        const rec = skills[k];
        const meta = CPE.content.skillMeta(k);
        return { k, meta, acc: Math.round((rec.right / rec.seen) * 100), seen: rec.seen };
      })
      .sort((a, b) => a.acc - b.acc || b.seen - a.seen);

    if (!rows.length) {
      return el('div.card', null,
        el('div.h3', { text: 'Todavía sin datos' }),
        el('div.muted', { text: 'Hacé una sesión y acá vas a ver cada patrón con tu porcentaje de acierto, del peor al mejor.' })
      );
    }

    const list = el('div.skill-list');
    rows.forEach((r) => {
      const tier = r.acc >= 80 ? 'hi' : r.acc >= 55 ? 'mid' : 'lo';
      list.appendChild(el('div.skill', null,
        el('div.skill__w', { text: r.meta.a }),
        el('div.skill__p', { text: r.meta.p }),
        el('div.skill__acc', { 'data-t': tier, text: r.acc + '%' })
      ));
    });
    return list;
  }

  function render(host) {
    const keys = CPE.content.allKeys();
    const ov = CPE.srs.overview(keys);
    const totals = CPE.store.get('totals');
    const streak = CPE.store.get('streak');

    host.innerHTML = '';
    const frag = el('div.stagger');

    frag.appendChild(el('div.card.card--hero', { style: '--i:0' },
      el('div.hero', null,
        el('div.hero__copy', null,
          el('div.hero__grade', { text: 'Preparación para el CPE' }),
          el('div.hero__title', { text: ov.grade.label }),
          el('div.hero__sub', { text: ov.readiness + '% del camino al Grade A. La banda A empieza en 90%.' })
        ),
        CPE.ui.ring(ov.readiness)
      ),
      /* De qué está hecho ese porcentaje, para que no sea un número mágico. */
      el('div.mix', null,
        mixRow('Cobertura', 'patrones ya vistos (' + ov.seen + '/' + ov.total + ')', ov.coverage, 45),
        mixRow('Solidez', 'cuán alto están en las cajas de repaso', ov.solidity, 40),
        mixRow('Precisión', 'aciertos sobre todo lo respondido', ov.accuracy, 15)
      )
    ));

    const wc = CPE.words.counts();
    frag.appendChild(el('div.tiles', { style: '--i:1; margin-top:12px' },
      el('div.tile', null, el('b', { text: String(ov.mastered) }), el('span', { text: 'patrones dominados' })),
      el('div.tile', null, el('b', { text: String(totals.items) }), el('span', { text: 'huecos resueltos' })),
      el('div.tile', null, el('b', { text: String(streak.best || 0) }), el('span', { text: 'mejor racha' }))
    ));

    frag.appendChild(el('div.tiles', { style: '--i:1; margin-top:10px' },
      el('button.tile.tile--tap', { type: 'button', onclick: () => CPE.app.go('mistakes') },
        el('b', { text: String(wc.pending) }), el('span', { text: 'palabras a practicar' })),
      el('div.tile', null, el('b', { text: String(wc.learned) }), el('span', { text: 'marcadas aprendidas' })),
      el('div.tile', null, el('b', { text: String(ov.due) }), el('span', { text: 'a repasar hoy' }))
    ));

    frag.appendChild(el('div.eyebrow', { style: '--i:2', text: 'Constancia (12 semanas)' }));
    frag.appendChild(el('div.card', { style: '--i:3' }, heatmap()));

    frag.appendChild(el('div.eyebrow', { style: '--i:4', text: 'Reparto por caja' }));
    frag.appendChild(el('div.card', { style: '--i:5' },
      boxChart(ov),
      el('div.tiny', { style: 'margin-top:10px', text: 'Acertar sube un patrón de caja; fallar lo baja dos. Cuanto más alta la caja, más tarda en volver a aparecer.' })
    ));

    frag.appendChild(el('div.eyebrow', { style: '--i:6', text: 'Patrones, del peor al mejor' }));
    frag.appendChild(skillTable());

    host.appendChild(frag);
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.stats = { render, title: 'Progreso' };
}(window.CPE));
