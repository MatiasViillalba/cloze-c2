/**
 * Cross-device sync.
 *
 * The learner state in store.js lives in localStorage, which is per browser and
 * per device: a week of study on the phone is invisible to the laptop. This
 * module lifts that same record into a single row in the cloud, keyed by a
 * 16-character sync code the learner carries between devices. No account, no
 * password, no login screen — the code *is* the identity.
 *
 * Three properties matter more than anything else here:
 *
 *   1. It must never lose work. Every sync is pull -> merge -> push, and the
 *      merge is a true union, so a session done on the phone in aeroplane mode
 *      still lands once that phone comes back online.
 *   2. It must be safe to run twice. `mergeStates` is idempotent and
 *      order-independent (max on counters, newest-wins on decisions), so
 *      re-merging the same pair of states changes nothing.
 *   3. It must never block studying. Every call is fire-and-forget; offline
 *      simply leaves the record dirty and retries at the next opportunity.
 */
(function (CPE) {
  'use strict';

  const META_KEY = 'cpe.cloze.sync.v1';

  /* Crockford base32: no I, L, O or U, so a code cannot be misread aloud and
     cannot accidentally spell anything. 16 chars = 80 bits. */
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const CODE_LEN = 16;

  const PUSH_DEBOUNCE = 4000;    /* a burst of eight graded gaps is one push */
  const PULL_MIN_GAP = 45000;    /* don't re-pull on every tab focus */

  let meta = { code: null, rev: 0, lastAt: 0, dirty: false };
  let phase = 'off';             /* off | idle | syncing | error */
  let lastError = null;
  let running = null;
  let pushTimer = null;
  let applying = false;
  const listeners = [];

  const clone = (o) => JSON.parse(JSON.stringify(o));

  /* ------------------------------------------------------------- Config --- */

  function config() {
    const c = CPE.SYNC_CONFIG || {};
    const url = String(c.url || '').trim().replace(/\/+$/, '');
    const key = String(c.anonKey || '').trim();
    return url && key ? { url, key } : null;
  }

  const configured = () => !!config();
  const enabled = () => !!(config() && meta.code);

  /* --------------------------------------------------------------- Code --- */

  /** 16 random base32 characters, from the CSPRNG when there is one. */
  function generateCode() {
    const n = new Uint8Array(CODE_LEN);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(n);
    else for (let i = 0; i < CODE_LEN; i++) n[i] = Math.floor(Math.random() * 256);
    let out = '';
    for (let i = 0; i < CODE_LEN; i++) out += ALPHABET[n[i] % ALPHABET.length];
    return out;
  }

  /** Accepts what a human types: spaces, dashes, lowercase, l/I for 1, O for 0. */
  function normalizeCode(input) {
    return String(input == null ? '' : input)
      .toUpperCase()
      .replace(/[ILU]/g, '1')
      .replace(/O/g, '0')
      .replace(/[^0-9A-Z]/g, '')
      .slice(0, CODE_LEN);
  }

  const validCode = (c) => normalizeCode(c).length === CODE_LEN;

  /** Display form: XXXX-XXXX-XXXX-XXXX. */
  const formatCode = (c) => normalizeCode(c).replace(/(.{4})(?=.)/g, '$1-');

  /* --------------------------------------------------------------- Meta --- */

  function loadMeta() {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.code) {
          meta = {
            code: normalizeCode(parsed.code),
            rev: Number(parsed.rev) || 0,
            lastAt: Number(parsed.lastAt) || 0,
            dirty: !!parsed.dirty
          };
        }
      }
    } catch (err) { /* private mode: sync stays session-only */ }
    phase = enabled() ? 'idle' : 'off';
    return meta;
  }

  function saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta)); }
    catch (err) { /* nothing to do: the code still works for this session */ }
  }

  /* ------------------------------------------------------------- Status --- */

  function status() {
    return {
      configured: configured(),
      enabled: enabled(),
      phase,
      code: meta.code,
      pretty: meta.code ? formatCode(meta.code) : null,
      lastAt: meta.lastAt,
      dirty: meta.dirty,
      error: lastError
    };
  }

  function emit() {
    const s = status();
    listeners.forEach((fn) => { try { fn(s); } catch (err) { /* a repaint must not break sync */ } });
  }

  function setPhase(next, error) {
    phase = next;
    lastError = error || null;
    emit();
  }

  const subscribe = (fn) => { listeners.push(fn); return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  }; };

  /* -------------------------------------------------------------- Merge --- */

  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
  const maxOf = (a, b) => Math.max(num(a), num(b));

  /**
   * Union of two maps. A key only one side knows is still passed through `fn`,
   * against itself: that normalises its shape to exactly what a two-sided merge
   * produces, which is what makes merging twice a genuine no-op rather than one
   * that quietly adds a key and triggers a pointless upload.
   */
  function mergeMap(a, b, fn) {
    const out = {};
    const src = a || {};
    const other = b || {};
    Object.keys(src).forEach((k) => { out[k] = fn(src[k], src[k]); });
    Object.keys(other).forEach((k) => {
      out[k] = Object.prototype.hasOwnProperty.call(src, k)
        ? fn(src[k], other[k])
        : fn(other[k], other[k]);
    });
    return out;
  }

  /**
   * Picks the record that was touched last. Ties break on a stable value rather
   * than on argument order, so merge(a, b) and merge(b, a) agree — which is
   * what lets two devices converge without a coordinator.
   */
  function newer(a, b, stamp, tiebreak) {
    const ta = num(a[stamp]);
    const tb = num(b[stamp]);
    if (ta !== tb) return ta > tb ? a : b;
    const va = num(a[tiebreak]);
    const vb = num(b[tiebreak]);
    return va >= vb ? a : b;
  }

  /* Leitner box, due date and streak describe a *decision* taken at a moment in
     time, so the most recent one wins outright. The tallies underneath are
     monotonic, so they take the max: that is idempotent, which matters far more
     here than being exact — adding them would double-count every re-sync. */
  function mergeSkill(a, b) {
    const n = newer(a, b, 'last', 'box');
    return {
      box: num(n.box),
      due: num(n.due),
      streak: num(n.streak),
      last: maxOf(a.last, b.last),
      seen: maxOf(a.seen, b.seen),
      right: maxOf(a.right, b.right),
      wrong: maxOf(a.wrong, b.wrong)
    };
  }

  function mergeWord(a, b) {
    const n = newer(a, b, 'lastAt', 'right');
    const firsts = [num(a.firstAt), num(b.firstAt)].filter(Boolean);
    return {
      w: n.w || a.w || b.w,
      wrong: maxOf(a.wrong, b.wrong),
      right: maxOf(a.right, b.right),
      streak: num(n.streak),
      learned: !!n.learned,
      mark: n.mark || null,
      firstAt: firsts.length ? Math.min.apply(null, firsts) : 0,
      lastAt: maxOf(a.lastAt, b.lastAt)
    };
  }

  function mergeExercise(a, b) {
    const n = newer(a, b, 'lastAt', 'best');
    return {
      attempts: maxOf(a.attempts, b.attempts),
      best: maxOf(a.best, b.best),
      lastScore: num(n.lastScore),
      total: num(n.total) || num(a.total) || num(b.total),
      lastAt: maxOf(a.lastAt, b.lastAt)
    };
  }

  const mergeMark = (a, b) => clone(newer(a, b, 'at', 'at'));

  const mergeDay = (a, b) => ({ items: maxOf(a.items, b.items), right: maxOf(a.right, b.right) });

  /** Day keys are ISO-ish, so a plain string compare is a date compare. */
  function mergeStreak(a, b) {
    const sa = a || {};
    const sb = b || {};
    if (!sa.lastDay) return clone(sb);
    if (!sb.lastDay) return clone(sa);
    const lastDay = sa.lastDay >= sb.lastDay ? sa.lastDay : sb.lastDay;
    const count = sa.lastDay === sb.lastDay
      ? maxOf(sa.count, sb.count)
      : num((sa.lastDay > sb.lastDay ? sa : sb).count);
    return { count, best: Math.max(num(sa.best), num(sb.best), count), lastDay };
  }

  /**
   * Fuses two learner states into one that is missing nothing from either.
   * Commutative and idempotent by construction: mergeStates(x, x) === x, and
   * the argument order never changes the result.
   */
  function mergeStates(a, b) {
    if (!a) return clone(b);
    if (!b) return clone(a);

    const recent = num(a.updatedAt) >= num(b.updatedAt) ? a : b;
    const out = clone(recent);

    out.v = a.v || b.v;
    const created = [num(a.createdAt), num(b.createdAt)].filter(Boolean);
    out.createdAt = created.length ? Math.min.apply(null, created) : Date.now();
    out.updatedAt = maxOf(a.updatedAt, b.updatedAt);

    /* Settings are a preference, not an achievement: the last screen the
       learner actually touched wins, key by key. */
    const older = recent === a ? b : a;
    out.settings = Object.assign({}, older.settings || {}, recent.settings || {});

    out.skills = mergeMap(a.skills, b.skills, mergeSkill);
    out.words = mergeMap(a.words, b.words, mergeWord);
    out.marks = mergeMap(a.marks, b.marks, mergeMark);
    out.exercises = mergeMap(a.exercises, b.exercises, mergeExercise);
    out.history = mergeMap(a.history, b.history, mergeDay);
    out.streak = mergeStreak(a.streak, b.streak);

    /* Totals are derived, so rebuild them from the merged calendar — and never
       let them shrink below what either device already believed. */
    let items = 0;
    let right = 0;
    Object.keys(out.history).forEach((day) => {
      items += num(out.history[day].items);
      right += num(out.history[day].right);
    });
    out.totals = {
      items: Math.max(items, num((a.totals || {}).items), num((b.totals || {}).items)),
      right: Math.max(right, num((a.totals || {}).right), num((b.totals || {}).right)),
      sessions: maxOf((a.totals || {}).sessions, (b.totals || {}).sessions)
    };

    return out;
  }

  /* ---------------------------------------------------------- Transport --- */

  async function rpc(name, body, opts) {
    const c = config();
    if (!c) throw new Error('sin configurar');
    const res = await fetch(c.url + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: c.key,
        Authorization: 'Bearer ' + c.key
      },
      body: JSON.stringify(body),
      keepalive: !!(opts && opts.keepalive)
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error('HTTP ' + res.status + (detail ? ' · ' + detail.slice(0, 120) : ''));
    }
    return res.json();
  }

  const pull = () => rpc('sync_pull', { p_code: meta.code });

  const push = (payload, rev, opts) =>
    rpc('sync_push', { p_code: meta.code, p_payload: payload, p_rev: rev }, opts);

  /* --------------------------------------------------------------- Loop --- */

  /**
   * Swaps the merged state in — but only if the local record is still exactly
   * what we based that merge on. A learner who answers a gap while a push is in
   * flight must not have the answer overwritten by a payload that predates it;
   * `store.flush` will have marked us dirty, so it goes up on the next pass.
   */
  function applyLocal(next, expected) {
    if (JSON.stringify(CPE.store.get()) !== expected) return false;
    applying = true;
    try { CPE.store.replace(next); }
    finally { applying = false; }
    return true;
  }

  async function cycle(opts) {
    /* Two attempts: one for the happy path, one for the case where another
       device wrote between our pull and our push. */
    for (let attempt = 0; attempt < 2; attempt++) {
      const answer = await pull();
      const rev = num(answer && answer.rev);
      const remote = (answer && answer.payload) || null;

      /* Even with nothing to merge against, the state goes through the merge:
         it is what puts every record in canonical form. Uploading a raw local
         record instead would make the *next* sync see a difference that is not
         really there, and spend a revision saying nothing. */
      const before = JSON.stringify(CPE.store.get());
      const merged = mergeStates(JSON.parse(before), remote || JSON.parse(before));
      const mergedText = JSON.stringify(merged);

      /* What the cloud knows that we did not. */
      let local = before;
      if (mergedText !== before && applyLocal(merged, before)) local = mergedText;

      /* Nothing of ours is missing up there: stop, and don't burn a revision. */
      if (remote && mergedText === JSON.stringify(remote)) {
        return { rev, pushed: false, clean: applyLocal(merged, local) };
      }

      const res = await push(merged, rev, opts);

      if (!res || !res.conflict) {
        /* Leave the local copy byte-identical to the one now in the cloud, so
           the next pass has genuinely nothing to say. `clean` is false when a
           gap was answered mid-flight: that answer is newer than what we just
           uploaded, so the device is still carrying something. */
        const clean = applyLocal(merged, local);
        return { rev: num(res && res.rev), pushed: true, clean };
      }
      /* Conflict: loop round, merge on top of whatever the other device wrote
         and try again. The merge being idempotent is what makes that safe. */
    }

    throw new Error('conflicto de escritura');
  }

  /**
   * One sync pass. Concurrent callers share the in-flight promise, so a tab
   * regaining focus while a push is already going out costs nothing.
   */
  function run(opts) {
    if (!enabled()) return Promise.resolve(null);
    if (running) return running;

    if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
    setPhase('syncing');

    running = cycle(opts)
      .then((res) => {
        meta.rev = res.rev;
        meta.lastAt = Date.now();
        meta.dirty = !res.clean;
        saveMeta();
        setPhase('idle');
        if (meta.dirty) schedulePush();
        return res;
      })
      .catch((err) => {
        /* Offline is the normal case, not a failure worth shouting about: the
           record stays dirty and the next trigger picks it up. */
        meta.dirty = true;
        saveMeta();
        setPhase('error', navigator.onLine === false ? 'Sin conexión' : (err && err.message) || 'Error');
        if (opts && opts.loud) throw err;
        return null;
      })
      .then((res) => { running = null; return res; }, (err) => { running = null; throw err; });

    return running;
  }

  function schedulePush() {
    if (!enabled() || pushTimer) return;
    pushTimer = setTimeout(() => { pushTimer = null; run(); }, PUSH_DEBOUNCE);
  }

  function onLocalChange() {
    if (applying || !enabled()) return;
    if (!meta.dirty) { meta.dirty = true; saveMeta(); emit(); }
    schedulePush();
  }

  /* ------------------------------------------------------------ Control --- */

  /** Starts a brand-new cloud record from whatever this device already has. */
  function create() {
    if (!configured()) return Promise.reject(new Error('sin configurar'));
    meta = { code: generateCode(), rev: 0, lastAt: 0, dirty: true };
    saveMeta();
    setPhase('syncing');
    return run({ loud: true });
  }

  /** Joins the record an existing code points at, folding it into this device. */
  function link(input) {
    if (!configured()) return Promise.reject(new Error('sin configurar'));
    if (!validCode(input)) return Promise.reject(new Error('El código tiene que ser de 16 caracteres'));
    meta = { code: normalizeCode(input), rev: 0, lastAt: 0, dirty: true };
    saveMeta();
    setPhase('syncing');
    return run({ loud: true });
  }

  /** Stops syncing this device. The cloud record and the local data both stay. */
  function unlink() {
    if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
    meta = { code: null, rev: 0, lastAt: 0, dirty: false };
    try { localStorage.removeItem(META_KEY); } catch (err) { /* ignore */ }
    setPhase('off');
  }

  /* ---------------------------------------------------------------- Init --- */

  function init() {
    loadMeta();
    if (CPE.store.onChange) CPE.store.onChange(onLocalChange);

    window.addEventListener('online', () => { if (meta.dirty) run(); });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        /* Leaving the app is the moment a session most needs to be saved, and
           `keepalive` is what lets the request outlive the page. */
        if (meta.dirty && enabled() && !running) run({ keepalive: true });
        return;
      }
      if (enabled() && (meta.dirty || Date.now() - meta.lastAt > PULL_MIN_GAP)) run();
    });

    window.addEventListener('pagehide', () => {
      if (meta.dirty && enabled() && !running) run({ keepalive: true });
    });

    if (enabled()) run();
  }

  CPE.sync = {
    init, run, create, link, unlink, status, subscribe,
    mergeStates, formatCode, normalizeCode, validCode, generateCode,
    configured, enabled, CODE_LEN
  };
}(window.CPE));
