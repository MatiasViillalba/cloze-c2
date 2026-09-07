/**
 * Settings screen.
 *
 * Deliberately harmless: there is nothing on this screen that can destroy
 * months of progress with a mis-tap. No export, no import, no reset — the
 * study data simply lives on the device.
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

    host.appendChild(el('div.eyebrow', { text: 'Errores' }));
    const wc = CPE.words.counts();
    host.appendChild(el('div.set-list', null,
      el('button.set-row', { type: 'button', onclick: () => CPE.app.go('mistakes') },
        el('div.set-row__t', null,
          el('b', { text: 'Mis palabras falladas' }),
          el('span', { text: wc.pending + ' en práctica · ' + wc.learned + ' marcadas como aprendidas' })
        ),
        el('span.chip.chip--ember', { text: 'Abrir' })
      )
    ));

    /* Sin exportar, importar ni borrar: un toque accidental no puede tirar
       abajo el progreso de meses. Los datos viven en este dispositivo. */

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
