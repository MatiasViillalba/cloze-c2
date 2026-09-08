/**
 * The sync round trip, driven against a stand-in for the database.
 *
 * The merge itself is covered in sync.test.mjs. What is exercised here is the
 * part that only shows up with two devices and one row between them: that a
 * fresh device inherits a history it never had, that studying on either side
 * reaches the other, that a redundant sync writes nothing, and that a write
 * landing underneath one of them is retried instead of lost.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApp } from './harness.mjs';

const CODE = 'K7M29QX4BD3F8VTR';
const CONFIG = { url: 'https://stand-in.test', anonKey: 'anon-key' };

/** The whole database: one row per sync code, exactly as Postgres holds it. */
const db = new Map();
let calls = { pull: 0, push: 0 };
/** Runs once, just before the next push lands — to simulate the other device. */
let interfere = null;

globalThis.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  const name = String(url).split('/rpc/')[1];
  let payload;

  if (name === 'sync_pull') {
    calls.pull += 1;
    const row = db.get(body.p_code);
    payload = row ? { rev: row.rev, payload: row.payload } : { rev: 0, payload: null };
  } else if (name === 'sync_push') {
    calls.push += 1;
    if (interfere) { const fn = interfere; interfere = null; fn(); }
    const row = db.get(body.p_code);
    if (!row) {
      db.set(body.p_code, { rev: 1, payload: body.p_payload });
      payload = { rev: 1, conflict: false };
    } else if (row.rev === body.p_rev) {
      row.rev += 1;
      row.payload = body.p_payload;
      payload = { rev: row.rev, conflict: false };
    } else {
      payload = { rev: row.rev, conflict: true };
    }
  } else {
    return { ok: false, status: 404, text: async () => 'no such function' };
  }

  return { ok: true, status: 200, json: async () => payload };
};

/** A device: its own CPE namespace, its own in-memory store. */
function device() {
  const CPE = loadApp();
  CPE.SYNC_CONFIG = CONFIG;
  CPE.store.load();
  CPE.store.reset();
  return CPE;
}

/**
 * Answers `n` gaps on a skill, the way a real session would. A word only
 * enters the mistake book by being missed, so the first answer is the miss.
 */
function study(CPE, key, n, correct) {
  CPE.words.miss(key.toUpperCase());
  for (let i = 0; i < n; i++) {
    CPE.srs.grade(key, correct);
    CPE.words.grade(key.toUpperCase(), correct);
  }
  CPE.store.logAnswers(n, correct ? n : 0);
  CPE.store.flush();
}

test('a second device inherits the first one\'s progress', async () => {
  db.clear();
  const phone = device();
  study(phone, 'whereby', 18, true);
  await phone.sync.link(CODE);

  assert.equal(db.get(CODE).rev, 1, 'the first push creates the row');

  const laptop = device();
  assert.equal(laptop.store.get('totals').items, 0, 'starts from nothing');

  await laptop.sync.link(CODE);

  assert.equal(laptop.store.get('totals').items, 18);
  assert.equal(laptop.store.get('skills').whereby.seen, 18);
  assert.ok(laptop.words.isTracked('WHEREBY'));
  assert.equal(laptop.sync.status().enabled, true);
});

test('progress made on either device reaches the other', async () => {
  db.clear();
  const phone = device();
  study(phone, 'hence', 10, true);
  await phone.sync.link(CODE);

  const laptop = device();
  await laptop.sync.link(CODE);

  study(laptop, 'albeit', 6, false);
  await laptop.sync.run();
  await phone.sync.run();

  assert.equal(phone.store.get('skills').albeit.seen, 6, 'the laptop session reached the phone');
  assert.equal(phone.store.get('skills').hence.seen, 10, 'and its own work is still there');
  assert.ok(phone.words.isTracked('ALBEIT'));
});

test('a sync with nothing new to say writes nothing', async () => {
  db.clear();
  const phone = device();
  study(phone, 'thereby', 4, true);
  await phone.sync.link(CODE);

  const revAfterFirst = db.get(CODE).rev;
  calls = { pull: 0, push: 0 };

  await phone.sync.run();
  await phone.sync.run();

  assert.equal(db.get(CODE).rev, revAfterFirst, 'an idle sync must not burn revisions');
  assert.equal(calls.push, 0, 'and must not even send a push');
  assert.equal(calls.pull, 2);
});

test('a write that lands underneath a push is merged, not lost', async () => {
  db.clear();
  const phone = device();
  study(phone, 'lest', 5, true);
  await phone.sync.link(CODE);

  const laptop = device();
  await laptop.sync.link(CODE);
  study(laptop, 'notwithstanding', 3, false);

  /* The phone slips a session in between the laptop's pull and its push. */
  interfere = () => {
    const row = db.get(CODE);
    const sneaked = JSON.parse(JSON.stringify(row.payload));
    sneaked.skills.owing = { box: 1, seen: 7, right: 7, wrong: 0, due: 0, last: Date.now(), streak: 7 };
    sneaked.updatedAt = Date.now() + 1000;
    db.set(CODE, { rev: row.rev + 1, payload: sneaked });
  };

  await laptop.sync.run();

  const stored = db.get(CODE).payload;
  assert.equal(stored.skills.owing.seen, 7, 'the interfering write survived');
  assert.equal(stored.skills.notwithstanding.seen, 3, 'and so did the one that hit the conflict');
  assert.equal(laptop.store.get('skills').owing.seen, 7, 'the loser of the race caught up locally');
  assert.equal(laptop.sync.status().dirty, false);
});

test('an answer given while a push is in flight is not overwritten by it', async () => {
  db.clear();
  const phone = device();
  study(phone, 'albeit', 4, true);
  await phone.sync.link(CODE);

  /* The learner keeps studying while the upload is still on the wire. */
  interfere = () => study(phone, 'albeit', 1, false);
  study(phone, 'albeit', 2, true);
  await phone.sync.run();

  assert.equal(phone.store.get('skills').albeit.seen, 7, 'the mid-flight answer survived');
  assert.equal(phone.sync.status().dirty, true, 'and is still owed to the cloud');

  interfere = null;
  await phone.sync.run();
  assert.equal(db.get(CODE).payload.skills.albeit.seen, 7, 'the next pass carried it up');
  assert.equal(phone.sync.status().dirty, false);
  phone.sync.unlink();               /* clears the pending retry timer */
});

test('an unreachable server leaves the session pending, never lost', async () => {
  db.clear();
  const phone = device();
  study(phone, 'insofar', 9, true);
  await phone.sync.link(CODE);

  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('network down'); };

  study(phone, 'insofar', 2, false);
  await phone.sync.run();

  assert.equal(phone.sync.status().phase, 'error');
  assert.equal(phone.sync.status().dirty, true, 'the pending flag is what makes the retry happen');
  assert.equal(phone.store.get('skills').insofar.seen, 11, 'nothing local was touched');

  globalThis.fetch = realFetch;
  await phone.sync.run();

  assert.equal(phone.sync.status().dirty, false);
  assert.equal(db.get(CODE).payload.skills.insofar.seen, 11, 'the offline session went up on the retry');
});

test('unlinking stops syncing without touching either copy', async () => {
  db.clear();
  const phone = device();
  study(phone, 'howsoever', 5, true);
  await phone.sync.link(CODE);

  phone.sync.unlink();
  assert.equal(phone.sync.status().enabled, false);

  study(phone, 'howsoever', 5, true);
  await phone.sync.run();

  assert.equal(db.get(CODE).payload.skills.howsoever.seen, 5, 'the cloud copy stopped where it was');
  assert.equal(phone.store.get('skills').howsoever.seen, 10, 'local study carried on regardless');
});
