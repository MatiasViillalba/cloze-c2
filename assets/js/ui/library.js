/**
 * Library screen — every passage in the bank, with its own progress.
 *
 * The smart session decides for you; this screen exists for the days when you
 * want to decide for yourself, or to hunt down the one text you keep failing.
 */
(function (CPE) {
  'use strict';
  const { el } = CPE.util;

  const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'todo', label: 'Sin hacer' },
    { id: 'weak', label: 'A mejorar' },
    { id: 'done', label: 'Dominados' }
  ];

  let active = 'all';

  function statusOf(passage) {
    const rec = CPE.store.get('exercises')[passage.id];
    if (!rec) return 'todo';
    return rec.best >= passage.gaps.length - 1 ? 'done' : 'weak';
  }

  function item(passage, index) {
    const rec = CPE.store.get('exercises')[passage.id];
    const status = statusOf(passage);

    return el('button.lib-item' + (status === 'done' ? '.is-done' : ''), {
      type: 'button',
      onclick: () => CPE.app.go('cloze', { passage })
    },
      el('div.lib-item__n', { text: status === 'done' ? '✓' : String(index + 1) }),
      el('div.lib-item__b', null,
        el('b', { text: passage.title }),
        el('span', { text: passage.focus })
      ),
      rec ? el('div.lib-item__score', { text: rec.best + '/' + passage.gaps.length }) : null
    );
  }

  function render(host) {
    host.innerHTML = '';

    host.appendChild(el('div.eyebrow', { text: 'Biblioteca', style: 'margin-top:14px' }));
    host.appendChild(el('div.muted', {
      text: CPE.content.passages.length + ' textos originales de nivel C2, cada uno con 8 huecos y explicación de cada patrón.',
      style: 'margin-bottom:14px'
    }));

    const listHost = el('div.lib-list');

    const filters = el('div.filters');
    FILTERS.forEach((f) => {
      const btn = el('button.filter' + (f.id === active ? '.is-active' : ''), { type: 'button', text: f.label });
      btn.onclick = () => {
        active = f.id;
        render(host);
      };
      filters.appendChild(btn);
    });
    host.appendChild(filters);
    host.appendChild(listHost);

    const rows = CPE.content.passages.filter((p) => active === 'all' || statusOf(p) === active);

    if (!rows.length) {
      listHost.appendChild(el('div.empty', null,
        el('div.empty__icon', { html: '<svg viewBox="0 0 24 24"><path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>' }),
        el('div.h3', { text: 'Nada por acá' }),
        el('div.muted', { text: active === 'done' ? 'Todavía no dominaste ningún texto por completo. Es cuestión de repetir.' : 'No hay textos en esta categoría.' })
      ));
      return;
    }

    rows.forEach((p, i) => listHost.appendChild(item(p, CPE.content.passages.indexOf(p))));
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.library = { render, title: 'Textos' };
}(window.CPE));
