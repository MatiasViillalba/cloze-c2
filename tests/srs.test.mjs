/**
 * Scheduler behaviour.
 *
 * The promise made to the learner is simple: a word you get wrong comes back.
 * These tests hold the scheduler to it.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApp } from './harness.mjs';

const CPE = loadApp();
CPE.store.load();          /* no localStorage in Node: falls back to memory */

const KEY = 'test-skill';

function reset() {
  CPE.store.reset();
}

test('a correct answer promotes one box, a wrong answer demotes two', () => {
  reset();
  CPE.srs.grade(KEY, true);
  CPE.srs.grade(KEY, true);
  CPE.srs.grade(KEY, true);
  assert.equal(CPE.store.get('skills')[KEY].box, 3);

  CPE.srs.grade(KEY, false);
  assert.equal(CPE.store.get('skills')[KEY].box, 1, 'a lapse must cost two boxes');
});

test('boxes are clamped at both ends', () => {
  reset();
  for (let i = 0; i < 12; i++) CPE.srs.grade(KEY, true);
  assert.equal(CPE.store.get('skills')[KEY].box, CPE.srs.MAX_BOX);

  for (let i = 0; i < 12; i++) CPE.srs.grade(KEY, false);
  assert.equal(CPE.store.get('skills')[KEY].box, 0);
});

test('a freshly failed skill is due immediately', () => {
  reset();
  CPE.srs.grade(KEY, false);
  const rec = CPE.store.get('skills')[KEY];
  assert.ok(CPE.srs.isDue(rec), 'box 0 has a zero-day interval, so it is due now');
});

test('a mastered skill is not due for weeks', () => {
  reset();
  for (let i = 0; i < 6; i++) CPE.srs.grade(KEY, true);
  const rec = CPE.store.get('skills')[KEY];
  assert.ok(!CPE.srs.isDue(rec), 'box 5 must not come back the same day');
  const days = (rec.due - Date.now()) / 86400000;
  assert.ok(days > 20, `expected a 21-day interval, got ${days.toFixed(1)}`);
});

test('unseen skills count as due so nothing is skipped forever', () => {
  reset();
  const all = CPE.content.allKeys();
  assert.equal(CPE.srs.dueKeys(all).length, all.length);
});

test('weak skills are the ones actually failed, worst first', () => {
  reset();
  CPE.srs.grade('a', false);
  CPE.srs.grade('b', true);
  CPE.srs.grade('c', false);
  const weak = CPE.srs.weakKeys(['a', 'b', 'c']);
  assert.ok(weak.includes('a') && weak.includes('c'));
  assert.ok(!weak.includes('b'), 'a skill answered correctly is not weak');
});

test('readiness reflects mastery, not attempts', () => {
  reset();
  const keys = ['k1', 'k2', 'k3', 'k4'];
  for (let i = 0; i < 4; i++) CPE.srs.grade('k1', true);   /* box 4: mastered */
  CPE.srs.grade('k2', true);                                /* box 1 */
  const ov = CPE.srs.overview(keys);
  assert.equal(ov.mastered, 1);
  assert.equal(ov.total, 4);
  assert.equal(ov.readiness, 25);
});

test('bands follow the Cambridge thresholds', () => {
  assert.equal(CPE.srs.band(8, 8).g, 'A');
  assert.equal(CPE.srs.band(7, 8).g, 'B');
  assert.equal(CPE.srs.band(6, 8).g, 'C');
  assert.equal(CPE.srs.band(4, 8).g, 'C1');
  assert.equal(CPE.srs.band(2, 8).g, '—');
});

test('a session is recorded against today and feeds the streak', () => {
  reset();
  CPE.store.logAnswers(8, 6);
  assert.equal(CPE.store.todayCount(), 8);
  assert.equal(CPE.store.get('totals').right, 6);
  assert.equal(CPE.store.liveStreak(), 1);

  CPE.store.logAnswers(4, 4);
  assert.equal(CPE.store.todayCount(), 12);
  assert.equal(CPE.store.liveStreak(), 1, 'two sessions on one day is still one day');
});

test('answer normalisation is forgiving about case, spacing and apostrophes', () => {
  const gap = { a: "EVERYONE'S", alt: [] };
  assert.ok(CPE.util.matches("everyone's", gap));
  assert.ok(CPE.util.matches('  EVERYONE’S  ', gap), 'curly apostrophes must match');
  assert.ok(!CPE.util.matches('everyone', gap));
});
