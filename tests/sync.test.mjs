/**
 * Merge behaviour.
 *
 * The promise made to the learner is that syncing can never cost them work.
 * These tests hold the merge to it: nothing disappears, the same merge run
 * twice changes nothing, and the order of the two devices never matters.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApp } from './harness.mjs';

const CPE = loadApp();
const { mergeStates } = CPE.sync;

const clone = (o) => JSON.parse(JSON.stringify(o));

/** A learner state shaped exactly like store.js writes it. */
function state(over) {
  return Object.assign({
    v: 1,
    createdAt: 1000,
    updatedAt: 2000,
    settings: { dailyGoal: 24, textScale: 1 },
    skills: {},
    words: {},
    marks: {},
    exercises: {},
    history: {},
    streak: { count: 0, best: 0, lastDay: null },
    totals: { items: 0, right: 0, sessions: 0 }
  }, over);
}

test('an empty device inherits everything from the one that has studied', () => {
  const phone = state({
    updatedAt: 5000,
    skills: { 'take-granted': { box: 3, seen: 4, right: 3, wrong: 1, due: 900, last: 800, streak: 2 } },
    words: { WHEREBY: { w: 'WHEREBY', wrong: 2, right: 1, streak: 0, learned: false, firstAt: 10, lastAt: 700 } },
    exercises: { 'p-01': { attempts: 2, best: 7, lastScore: 7, total: 8, lastAt: 700 } },
    history: { '2026-09-07': { items: 18, right: 14 } },
    streak: { count: 3, best: 3, lastDay: '2026-09-07' },
    totals: { items: 18, right: 14, sessions: 2 }
  });
  const laptop = state({ updatedAt: 0 });

  const merged = mergeStates(laptop, phone);

  assert.deepEqual(merged.skills, phone.skills);
  /* `mark` is normalised in, so compare the fields the learner would notice. */
  assert.deepEqual(merged.words.WHEREBY, Object.assign({ mark: null }, phone.words.WHEREBY));
  assert.deepEqual(merged.history, phone.history);
  assert.equal(merged.totals.items, 18);
  assert.equal(merged.streak.count, 3);
});

test('the merge is commutative: neither device is privileged', () => {
  const a = state({
    updatedAt: 5000,
    skills: { k: { box: 4, seen: 9, right: 8, wrong: 1, due: 300, last: 900, streak: 4 } },
    history: { '2026-09-06': { items: 10, right: 8 } },
    streak: { count: 2, best: 2, lastDay: '2026-09-06' }
  });
  const b = state({
    updatedAt: 4000,
    skills: { k: { box: 1, seen: 5, right: 2, wrong: 3, due: 100, last: 400, streak: 0 } },
    history: { '2026-09-07': { items: 6, right: 6 } },
    streak: { count: 1, best: 5, lastDay: '2026-09-07' }
  });

  assert.deepEqual(mergeStates(a, b), mergeStates(b, a));
});

test('merging twice changes nothing', () => {
  const a = state({
    updatedAt: 5000,
    skills: { k: { box: 2, seen: 6, right: 4, wrong: 2, due: 50, last: 500, streak: 1 } },
    words: { YET: { w: 'YET', wrong: 3, right: 1, streak: 0, learned: false, firstAt: 5, lastAt: 400 } },
    history: { '2026-09-06': { items: 12, right: 9 } },
    totals: { items: 12, right: 9, sessions: 1 }
  });
  const b = state({
    updatedAt: 6000,
    skills: { k: { box: 3, seen: 8, right: 6, wrong: 2, due: 80, last: 700, streak: 2 } },
    history: { '2026-09-06': { items: 4, right: 4 }, '2026-09-07': { items: 9, right: 7 } },
    totals: { items: 13, right: 11, sessions: 3 }
  });

  const once = mergeStates(a, b);
  assert.deepEqual(mergeStates(once, clone(once)), once, 'idempotent on itself');
  assert.deepEqual(mergeStates(once, b), once, 're-merging a side already folded in');
  assert.deepEqual(mergeStates(once, a), once);
});

test('counters take the max, so a re-sync never double-counts a day', () => {
  const a = state({ history: { '2026-09-07': { items: 18, right: 14 } } });
  const b = state({ history: { '2026-09-07': { items: 18, right: 14 } } });
  const merged = mergeStates(a, b);
  assert.deepEqual(merged.history['2026-09-07'], { items: 18, right: 14 });
  assert.equal(merged.totals.items, 18, 'the same day seen twice is still one day');
});

test('the most recent Leitner decision wins, but the tallies survive', () => {
  const older = state({
    skills: { k: { box: 5, seen: 20, right: 19, wrong: 1, due: 100, last: 100, streak: 9 } }
  });
  const newer = state({
    skills: { k: { box: 3, seen: 12, right: 9, wrong: 3, due: 999, last: 900, streak: 0 } }
  });

  const rec = mergeStates(older, newer).skills.k;
  assert.equal(rec.box, 3, 'a lapse on the newer device must not be undone by the older one');
  assert.equal(rec.due, 999);
  assert.equal(rec.seen, 20, 'work done on the older device is still work done');
  assert.equal(rec.wrong, 3);
});

test('a word marked learned on one device stays learned on both', () => {
  const marked = state({
    words: { HENCE: { w: 'HENCE', wrong: 2, right: 4, streak: 3, learned: true, mark: 'yes', firstAt: 10, lastAt: 900 } }
  });
  const stale = state({
    words: { HENCE: { w: 'HENCE', wrong: 2, right: 2, streak: 1, learned: false, mark: null, firstAt: 10, lastAt: 300 } }
  });

  assert.equal(mergeStates(stale, marked).words.HENCE.learned, true);
  assert.equal(mergeStates(marked, stale).words.HENCE.mark, 'yes');
});

test('a fresh miss on one device re-opens a word retired on the other', () => {
  const retired = state({
    words: { WHEREBY: { w: 'WHEREBY', wrong: 1, right: 3, streak: 3, learned: true, mark: 'yes', firstAt: 10, lastAt: 400 } }
  });
  const missed = state({
    words: { WHEREBY: { w: 'WHEREBY', wrong: 2, right: 3, streak: 0, learned: false, mark: null, firstAt: 10, lastAt: 800 } }
  });

  const rec = mergeStates(retired, missed).words.WHEREBY;
  assert.equal(rec.learned, false, 'the newer verdict is the true one');
  assert.equal(rec.wrong, 2);
});

test('the day streak follows the later calendar day', () => {
  const a = state({ streak: { count: 7, best: 7, lastDay: '2026-09-05' } });
  const b = state({ streak: { count: 2, best: 4, lastDay: '2026-09-07' } });
  const merged = mergeStates(a, b);
  assert.equal(merged.streak.lastDay, '2026-09-07');
  assert.equal(merged.streak.count, 2);
  assert.equal(merged.streak.best, 7, 'a personal best is never lowered');
});

test('the best score of an exercise survives a worse retry elsewhere', () => {
  const good = state({ exercises: { 'p-02': { attempts: 3, best: 8, lastScore: 8, total: 8, lastAt: 200 } } });
  const bad = state({ exercises: { 'p-02': { attempts: 1, best: 4, lastScore: 4, total: 8, lastAt: 900 } } });
  const rec = mergeStates(good, bad).exercises['p-02'];
  assert.equal(rec.best, 8);
  assert.equal(rec.attempts, 3);
  assert.equal(rec.lastScore, 4, 'the newest attempt is still the newest attempt');
});

test('settings follow the device that was touched last', () => {
  const a = state({ updatedAt: 100, settings: { dailyGoal: 12, textScale: 1, haptics: true } });
  const b = state({ updatedAt: 900, settings: { dailyGoal: 40, textScale: 1.2 } });
  const merged = mergeStates(a, b);
  assert.equal(merged.settings.dailyGoal, 40);
  assert.equal(merged.settings.textScale, 1.2);
  assert.equal(merged.settings.haptics, true, 'a key only the older device knew is kept');
});

test('a sync code is 16 characters and survives being typed by a human', () => {
  const code = CPE.sync.generateCode();
  assert.equal(code.length, 16);
  assert.ok(CPE.sync.validCode(code));

  const pretty = CPE.sync.formatCode(code);
  assert.equal(pretty, code.replace(/(.{4})(?=.)/g, '$1-'));
  assert.equal(CPE.sync.normalizeCode(pretty.toLowerCase()), code, 'dashes and case are noise');
  assert.equal(CPE.sync.normalizeCode(' ' + pretty + ' '), code);
});

test('lookalike characters are folded, not rejected', () => {
  /* The alphabet has no I, L, O or U precisely so that these are unambiguous. */
  assert.equal(CPE.sync.normalizeCode('OIL0000000000000'), '0110000000000000');
  assert.equal(CPE.sync.validCode('ABCD-EFGH-JKMN-PQRS'), true);
  assert.equal(CPE.sync.validCode('ABCD-EFGH'), false, 'a short code is not a code');
});

test('the store hands merged state back without restamping it', () => {
  CPE.store.load();
  CPE.store.reset();

  const merged = state({ updatedAt: 4242, totals: { items: 30, right: 25, sessions: 4 } });
  CPE.store.replace(merged);

  assert.equal(CPE.store.get().updatedAt, 4242, 'the uploaded copy and the local copy must stay identical');
  assert.equal(CPE.store.get('totals').items, 30);
});

test('a local write stamps updatedAt and notifies the sync layer', () => {
  CPE.store.load();
  CPE.store.reset();

  let seen = 0;
  CPE.store.onChange(() => { seen += 1; });

  /* reset() has just stamped "now"; back-date it so the assertion is not a
     race against the millisecond clock. */
  CPE.store.get().updatedAt = 1;
  const before = 1;
  CPE.store.update((s) => { s.totals.items += 1; });
  CPE.store.flush();

  assert.equal(seen, 1);
  assert.ok(CPE.store.get().updatedAt > before, 'the newer device has to be identifiable');
});
