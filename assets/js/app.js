/**
 * Application shell: routing, session orchestration and boot.
 *
 * There is no framework here on purpose. The whole app has to survive being
 * opened from a home-screen icon in aeroplane mode, so every byte is either
 * precached by the service worker or not needed at all.
 */
(function (CPE) {
  'use strict';
  const { $, $$, el } = CPE.util;

  const IMMERSIVE = { cloze: true, drill: true, result: true };
  const TABS = { home: 'home', library: 'library', stats: 'stats', settings: 'settings' };

  let current = null;
  const stack = [];

  /* ------------------------------------------------------------- Routing --- */

  function setChrome(name) {
    const app = $('#app');
    const screen = CPE.ui[name];

    app.setAttribute('data-immersive', IMMERSIVE[name] ? '1' : '0');
    app.setAttribute('data-can-back', stack.length ? '1' : '0');

    const title = $('#topbarTitle');
    if (name === 'home') title.innerHTML = 'Cloze<span>C2</span>';
    else title.textContent = (screen && screen.title) || '';

    $$('.tab[data-go]').forEach((tab) => {
      tab.classList.toggle('is-active', TABS[tab.dataset.go] === name);
    });
  }

  function go(name, params, opts) {
    const screen = CPE.ui[name];
    if (!screen) return;

    if (current && !(opts && opts.replace) && current !== name) stack.push({ name: current });
    if (name === 'home') stack.length = 0;

    $$('.screen').forEach((s) => s.classList.remove('is-active'));
    const host = $('#screen-' + name);
    host.classList.add('is-active');

    current = name;
    setChrome(name);
    refreshStreakPill();
    screen.render(host, params || {});
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function back() {
    const prev = stack.pop();
    go(prev ? prev.name : 'home', null, { replace: true });
  }

  /* ------------------------------------------------------------ Sessions --- */

  function startCloze(passage) {
    go('cloze', { passage: passage || CPE.content.pickPassage() });
  }

  function startDrill(opts) {
    go('drill', opts || { n: 15 });
  }

  /** Practice built from the mistake book: several contexts per missed word. */
  function startPractice(words, perWord) {
    const list = words && words.length ? words : CPE.words.pending().map((r) => r.w);
    if (!list.length) { CPE.toast('No hay palabras pendientes. ¡Bien ahí!', 'good'); return; }
    startDrill({
      words: list,
      perWord: perWord || 3,
      n: Math.min(30, Math.max(6, list.length * (perWord || 3)))
    });
  }

  /** Practice built from skill keys: the Puntos débiles screen feeds this. */
  function startWeakPractice(keys, perKey) {
    const list = keys && keys.length ? keys : CPE.srs.troubleKeys(CPE.content.allKeys());
    if (!list.length) { CPE.toast('No hay puntos débiles pendientes. ¡Bien ahí!', 'good'); return; }
    startDrill({
      keyPractice: list,
      perKey: perKey || 3,
      n: Math.min(30, Math.max(6, list.length * (perKey || 3)))
    });
  }

  /**
   * The smart session: mistakes first (that is where the marks are), then any
   * overdue pattern, and only then a fresh exam text.
   */
  function startSmart() {
    const pending = CPE.words.pending();
    if (pending.length >= 3) { startPractice(pending.slice(0, 6).map((r) => r.w)); return; }

    const keys = CPE.content.allKeys();
    const weak = CPE.srs.weakKeys(keys);
    if (weak.length >= 5) startDrill({ n: Math.min(12, weak.length), onlyWeak: true });
    else startCloze();
  }

  function showResult() {
    const from = current;
    const result = (CPE.ui[from] && CPE.ui[from].getResult && CPE.ui[from].getResult()) || null;
    stack.length = 0;
    go('result', { result }, { replace: true });
  }

  /* ---------------------------------------------------------------- Boot --- */

  /** The ring stroke references url(#emberGrad); the gradient must exist in the DOM. */
  function injectDefs() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = '<defs><linearGradient id="emberGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FF9A3D"/><stop offset="1" stop-color="#EE4A00"/>' +
      '</linearGradient></defs>';
    document.body.insertBefore(svg, document.body.firstChild);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    /* Relative path so the app also works from a project subdirectory on Pages. */
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* offline install is best-effort */ });
    });
  }

  function wireChrome() {
    $('#btnBack').addEventListener('click', back);

    $$('.tab[data-go]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.go;
        CPE.util.haptic('tap');
        if (target === 'smart') { startSmart(); return; }
        stack.length = 0;
        go(target, null, { replace: true });
      });
    });

    /* Android hardware back / browser back closes the sheet first, then routes. */
    window.addEventListener('popstate', () => {
      if (!$('#sheet').hidden) { CPE.sheet.close(); return; }
      back();
    });
  }

  function refreshStreakPill() {
    $('#streakCount').textContent = String(CPE.store.liveStreak());
  }

  /** Home-screen shortcuts land on ./?go=smart or ./?go=weak. */
  function openDeepLink() {
    const target = new URLSearchParams(location.search).get('go');
    if (target === 'smart') startSmart();
    else if (target === 'weak') go('mistakes');
  }

  function boot() {
    CPE.store.load();
    injectDefs();
    CPE.sync.init();
    CPE.applyTextScale(CPE.store.get('settings').textScale);
    wireChrome();
    refreshStreakPill();
    go('home');
    openDeepLink();
    registerServiceWorker();
  }

  CPE.app = {
    go, back, startCloze, startDrill, startSmart, startPractice, startWeakPractice,
    showResult, boot, refreshStreakPill
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}(window.CPE));
