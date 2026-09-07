/**
 * Small DOM + language helpers shared by every screen.
 * Deliberately dependency-free: the whole app must run from cache, offline.
 */
(function (CPE) {
  'use strict';

  /* ---------------------------------------------------------------- DOM --- */

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /**
   * Minimal hyperscript: `el('button.btn.btn--primary', { onclick: fn }, 'Go')`.
   * `attrs` is always the second argument (pass null when there is none) so the
   * child list never has to be disambiguated from it.
   */
  function el(spec, attrs, ...children) {
    const parts = String(spec).split(/(?=[.#])/);
    const node = document.createElement(parts.shift() || 'div');
    parts.forEach((p) => {
      if (p[0] === '.') node.classList.add(p.slice(1));
      else node.id = p.slice(1);
    });
    Object.keys(attrs || {}).forEach((k) => {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    children.flat(4).forEach((c) => {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* ----------------------------------------------------------- Language --- */

  /** Normalises a learner answer: trims, lowercases, strips punctuation/accents. */
  function norm(s) {
    return String(s == null ? '' : s)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[‘’ʼ]/g, "'")
      .toLowerCase()
      .replace(/[^a-z0-9'\- ]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  /** Accepts the canonical answer plus any declared alternatives. */
  function matches(input, gap) {
    const given = norm(input);
    if (!given) return false;
    if (given === norm(gap.a)) return true;
    return (gap.alt || []).some((alt) => norm(alt) === given);
  }

  /* ------------------------------------------------------------- Random --- */

  /** Mulberry32 — deterministic PRNG so a given day always shuffles the same. */
  function rng(seed) {
    let t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rand) {
    const a = arr.slice();
    const r = rand || Math.random;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  const sample = (arr, n, rand) => shuffle(arr, rand).slice(0, n);

  /* --------------------------------------------------------------- Time --- */

  const DAY = 86400000;

  /** Local calendar day key, e.g. "2026-09-06". */
  function dayKey(ts) {
    const d = ts ? new Date(ts) : new Date();
    const p = (n) => (n < 10 ? '0' + n : '' + n);
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function daysBetween(aKey, bKey) {
    const a = new Date(aKey + 'T00:00:00');
    const b = new Date(bKey + 'T00:00:00');
    return Math.round((b - a) / DAY);
  }

  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  /* ------------------------------------------------------------ Haptics --- */

  /**
   * iOS Safari ignores navigator.vibrate, so this is a no-op there; it still
   * gives Android installs a bit of physicality and costs nothing.
   */
  function haptic(kind) {
    if (!CPE.store || !CPE.store.get('settings').haptics) return;
    if (!navigator.vibrate) return;
    const map = { tap: 8, good: [10, 40, 14], bad: [26, 50, 26], win: [12, 40, 12, 40, 24] };
    try { navigator.vibrate(map[kind] || 8); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------- Text size --- */

  /* One notch per tap on the A buttons in Ajustes, within sane bounds. */
  const SCALE_MIN = 0.78;
  const SCALE_MAX = 1.5;
  const SCALE_STEP = 0.06;

  /** Writes the reading scale onto <html>; everything readable derives from it. */
  function applyTextScale(scale) {
    const v = clamp(Number(scale) || 1, SCALE_MIN, SCALE_MAX);
    document.documentElement.style.setProperty('--read-scale', String(v));
    return v;
  }

  CPE.applyTextScale = applyTextScale;
  CPE.util = {
    $, $$, el, esc, norm, matches, rng, shuffle, sample, dayKey, daysBetween,
    pct, clamp, haptic, applyTextScale, DAY,
    SCALE_MIN, SCALE_MAX, SCALE_STEP
  };
}(window.CPE));
