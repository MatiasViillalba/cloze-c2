/**
 * Persistent learner state.
 *
 * Everything lives in a single localStorage record so a session survives an
 * app kill, a reboot or a week offline. Writes are debounced because the cloze
 * screen grades eight gaps in a single burst.
 */
(function (CPE) {
  'use strict';

  const KEY = 'cpe.cloze.state.v1';
  const SCHEMA = 1;

  function blank() {
    return {
      v: SCHEMA,
      createdAt: Date.now(),
      settings: {
        haptics: true,
        autoAdvance: true,
        showTips: true,
        instantFeedback: false,
        dailyGoal: 24,
        textSize: 'm'
      },
      skills: {},              /* key -> { box, seen, right, wrong, due, last, streak } */
      exercises: {},           /* id  -> { attempts, best, lastScore, lastAt } */
      history: {},             /* dayKey -> { items, right } */
      streak: { count: 0, best: 0, lastDay: null },
      totals: { items: 0, right: 0, sessions: 0 }
    };
  }

  let state = blank();
  let saveTimer = null;
  let available = true;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.v === SCHEMA) {
          state = Object.assign(blank(), parsed);
          state.settings = Object.assign(blank().settings, parsed.settings || {});
        }
      }
    } catch (err) {
      /* Private mode or a corrupted record: fall back to an in-memory session. */
      available = false;
      state = blank();
    }
    return state;
  }

  function flush() {
    saveTimer = null;
    if (!available) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      available = false;
    }
  }

  function save() {
    if (saveTimer) return;
    saveTimer = setTimeout(flush, 220);
  }

  const get = (k) => (k ? state[k] : state);

  function update(fn) {
    fn(state);
    save();
    return state;
  }

  /* --------------------------------------------------------- Daily beat --- */

  /**
   * Records `n` graded answers for today and rolls the streak forward.
   * A streak survives a same-day repeat and a next-day return; anything longer
   * resets it to 1.
   */
  function logAnswers(items, right) {
    const today = CPE.util.dayKey();
    update((s) => {
      const day = s.history[today] || { items: 0, right: 0 };
      day.items += items;
      day.right += right;
      s.history[today] = day;
      s.totals.items += items;
      s.totals.right += right;

      if (s.streak.lastDay !== today) {
        const gap = s.streak.lastDay ? CPE.util.daysBetween(s.streak.lastDay, today) : 999;
        s.streak.count = gap === 1 ? s.streak.count + 1 : 1;
        s.streak.lastDay = today;
        s.streak.best = Math.max(s.streak.best || 0, s.streak.count);
      }
    });
  }

  const todayCount = () => (state.history[CPE.util.dayKey()] || { items: 0 }).items;

  /** A streak is only "live" if it was fed today or yesterday. */
  function liveStreak() {
    const last = state.streak.lastDay;
    if (!last) return 0;
    const gap = CPE.util.daysBetween(last, CPE.util.dayKey());
    return gap <= 1 ? state.streak.count : 0;
  }

  /* --------------------------------------------------------- Exercises --- */

  function logExercise(id, score, total) {
    update((s) => {
      const rec = s.exercises[id] || { attempts: 0, best: 0, lastScore: 0, lastAt: 0 };
      rec.attempts += 1;
      rec.lastScore = score;
      rec.lastAt = Date.now();
      rec.total = total;
      rec.best = Math.max(rec.best, score);
      s.exercises[id] = rec;
      s.totals.sessions += 1;
    });
  }

  /* ------------------------------------------------------- Import/Export --- */

  const exportJSON = () => JSON.stringify(state, null, 2);

  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || parsed.v !== SCHEMA) throw new Error('Formato no reconocido');
    state = Object.assign(blank(), parsed);
    flush();
    return state;
  }

  function reset() {
    state = blank();
    flush();
  }

  CPE.store = {
    load, save, flush, get, update, reset,
    logAnswers, logExercise, todayCount, liveStreak,
    exportJSON, importJSON,
    get available() { return available; }
  };
}(window.CPE));
