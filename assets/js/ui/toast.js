/** Transient feedback: toasts and the bottom sheet. */
(function (CPE) {
  'use strict';
  const { $, el } = CPE.util;

  function toast(message, kind) {
    const host = $('#toastHost');
    if (!host) return;
    const node = el('div.toast', { text: message });
    if (kind) node.classList.add('toast--' + kind);
    host.appendChild(node);
    setTimeout(() => {
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 200);
    }, 2200);
  }

  const sheet = {
    open(content) {
      const wrap = $('#sheet');
      const body = $('#sheetBody');
      body.innerHTML = '';
      body.appendChild(content);
      wrap.hidden = false;
      wrap.querySelector('[data-close]').onclick = sheet.close;
    },
    close() { $('#sheet').hidden = true; }
  };

  CPE.toast = toast;
  CPE.sheet = sheet;
}(window.CPE));
