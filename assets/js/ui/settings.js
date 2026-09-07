/**
 * Settings screen.
 *
 * Progress lives in localStorage, which a browser is entitled to clear. Export
 * and import are therefore first-class here rather than a hidden extra.
 */
(function (CPE) {
  'use strict';
  const { el } = CPE.util;

  function toggleRow(title, sub, key) {
    const settings = CPE.store.get('settings');
    const sw = el('div.switch' + (settings[key] ? '.is-on' : ''));
    const row = el('button.set-row', { type: 'button' },
      el('div.set-row__t', null, el('b', { text: title }), el('span', { text: sub })),
      sw
    );
    row.onclick = () => {
      CPE.store.update((s) => { s.settings[key] = !s.settings[key]; });
      sw.classList.toggle('is-on');
      CPE.store.flush();
    };
    return row;
  }

  function segRow(title, sub, key, options, onChange) {
    const settings = CPE.store.get('settings');
    const seg = el('div.seg');
    options.forEach((opt) => {
      const b = el('button' + (settings[key] === opt.value ? '.is-active' : ''), { type: 'button', text: opt.label });
      b.onclick = () => {
        CPE.store.update((s) => { s.settings[key] = opt.value; });
        CPE.store.flush();
        Array.prototype.forEach.call(seg.children, (c) => c.classList.remove('is-active'));
        b.classList.add('is-active');
        if (onChange) onChange(opt.value);
      };
      seg.appendChild(b);
    });
    return el('div.set-row', null,
      el('div.set-row__t', null, el('b', { text: title }), el('span', { text: sub })),
      seg
    );
  }

  function exportProgress() {
    const data = CPE.store.exportJSON();
    const name = 'cloze-c2-progreso-' + CPE.util.dayKey() + '.json';

    /* A Blob download works in Safari on iOS 13+; if it is blocked, fall back
       to putting the JSON on screen so it can be copied by hand. */
    try {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = el('a', { href: url, download: name });
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
      CPE.toast('Progreso exportado', 'good');
    } catch (err) {
      const body = el('div', null,
        el('div.h2', { text: 'Copiá este texto' }),
        el('div.muted', { style: 'margin:8px 0 12px', text: 'Guardalo en Notas. Podés restaurarlo desde "Importar progreso".' }),
        el('textarea', {
          'data-selectable': true,
          readonly: true,
          style: 'width:100%;height:220px;background:var(--surface-sunken);color:var(--fg-soft);border:1px solid var(--line);border-radius:12px;padding:10px;font-family:var(--font-mono);font-size:12px'
        }, data)
      );
      CPE.sheet.open(body);
    }
  }

  function importProgress() {
    const area = el('textarea', {
      placeholder: 'Pegá acá el JSON exportado…',
      'data-selectable': true,
      style: 'width:100%;height:180px;background:var(--surface-sunken);color:var(--fg-soft);border:1px solid var(--line);border-radius:12px;padding:10px;font-family:var(--font-mono);font-size:12px'
    });
    const body = el('div', null,
      el('div.h2', { text: 'Importar progreso' }),
      el('div.muted', { style: 'margin:8px 0 12px', text: 'Esto reemplaza por completo el progreso actual del dispositivo.' }),
      area,
      el('button.btn.btn--primary.btn--block', {
        type: 'button',
        style: 'margin-top:12px',
        onclick: () => {
          try {
            CPE.store.importJSON(area.value);
            CPE.sheet.close();
            CPE.toast('Progreso restaurado', 'good');
            CPE.app.go('home');
          } catch (err) {
            CPE.toast('No se pudo leer ese archivo', 'bad');
          }
        }
      }, 'Restaurar')
    );
    CPE.sheet.open(body);
  }

  function confirmReset() {
    const body = el('div', null,
      el('div.h2', { text: '¿Borrar todo el progreso?' }),
      el('div.muted', { style: 'margin:8px 0 16px', text: 'Se pierden la racha, las estadísticas y las cajas de repetición espaciada. Los ejercicios siguen intactos.' }),
      el('button.btn.btn--danger.btn--block', {
        type: 'button',
        onclick: () => {
          CPE.store.reset();
          CPE.sheet.close();
          CPE.toast('Progreso borrado');
          CPE.app.go('home');
        }
      }, 'Sí, borrar todo'),
      el('button.btn.btn--quiet.btn--block', { type: 'button', style: 'margin-top:6px', onclick: CPE.sheet.close }, 'Cancelar')
    );
    CPE.sheet.open(body);
  }

  function render(host) {
    const stats = CPE.content.stats();
    host.innerHTML = '';

    host.appendChild(el('div.eyebrow', { text: 'Estudio', style: 'margin-top:14px' }));
    host.appendChild(el('div.set-list', null,
      segRow('Objetivo diario', 'Huecos por día para mantener la racha', 'dailyGoal', [
        { label: '12', value: 12 }, { label: '24', value: 24 }, { label: '40', value: 40 }
      ]),
      toggleRow('Mostrar pistas', 'Activa el botón de pistas dentro de los textos', 'showTips'),
      toggleRow('Vibración', 'Respuesta háptica al corregir (Android; iOS la ignora)', 'haptics')
    ));

    host.appendChild(el('div.eyebrow', { text: 'Lectura' }));
    host.appendChild(el('div.set-list', null,
      segRow('Tamaño del texto', 'Afecta a los textos de examen', 'textSize', [
        { label: 'A', value: 's' }, { label: 'A', value: 'm' }, { label: 'A', value: 'l' }
      ], (v) => document.documentElement.setAttribute('data-textsize', v))
    ));

    host.appendChild(el('div.eyebrow', { text: 'Tus datos' }));
    const dataList = el('div.set-list');
    const exportRow = el('button.set-row', { type: 'button', onclick: exportProgress },
      el('div.set-row__t', null, el('b', { text: 'Exportar progreso' }), el('span', { text: 'Guardá una copia antes de cambiar de teléfono' })),
      el('span.chip.chip--ember', { text: 'JSON' })
    );
    const importRow = el('button.set-row', { type: 'button', onclick: importProgress },
      el('div.set-row__t', null, el('b', { text: 'Importar progreso' }), el('span', { text: 'Restaurar desde una copia' })),
      el('span.chip', { text: 'Pegar' })
    );
    const resetRow = el('button.set-row', { type: 'button', onclick: confirmReset },
      el('div.set-row__t', null, el('b', { text: 'Borrar progreso' }), el('span', { text: 'Empezar de cero' })),
      el('span.chip.chip--bad', { text: 'Borrar' })
    );
    dataList.appendChild(exportRow);
    dataList.appendChild(importRow);
    dataList.appendChild(resetRow);
    host.appendChild(dataList);

    if (!CPE.store.available) {
      host.appendChild(el('div.card', { style: 'margin-top:12px;border-color:rgba(255,197,49,.35)' },
        el('div.h3', { text: 'Modo privado detectado' }),
        el('div.muted', { text: 'Este navegador no deja guardar datos, así que el progreso se pierde al cerrar. Instalá la app en la pantalla de inicio para que se conserve.' })
      ));
    }

    host.appendChild(el('div.about', null,
      el('div.about__logo', { text: 'C2' }),
      el('div.h3', { text: CPE.APP_NAME }),
      el('div.tiny', { style: 'margin-top:4px', text: 'v' + CPE.VERSION + ' · build ' + CPE.BUILD }),
      el('div.tiny', { style: 'margin-top:8px', text: stats.passages + ' textos · ' + stats.drills + ' ejercicios rápidos · ' + stats.gaps + ' huecos · ' + stats.skills + ' patrones' }),
      el('div.tiny', { style: 'margin-top:8px', text: 'Funciona sin conexión. Todo tu progreso se queda en este dispositivo.' })
    ));
  }

  CPE.ui = CPE.ui || {};
  CPE.ui.settings = { render, title: 'Ajustes' };
}(window.CPE));
