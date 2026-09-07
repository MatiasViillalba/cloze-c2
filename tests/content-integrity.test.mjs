/**
 * Content integrity.
 *
 * A broken exercise is worse than a missing one: it teaches the wrong answer.
 * These checks run over the entire bank and are the gate for adding material.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApp } from './harness.mjs';

const CPE = loadApp();
const { passages, drills } = CPE.content;

test('the bank is fully loaded', () => {
  assert.ok(passages.length >= 48, `expected 48+ passages, got ${passages.length}`);
  assert.ok(drills.length >= 300, `expected 300+ drills, got ${drills.length}`);
});

test('every passage has exactly eight gaps', () => {
  passages.forEach((p) => {
    assert.equal(p.gaps.length, 8, `${p.id} (${p.title}) has ${p.gaps.length} gaps`);
  });
});

test('gap markers in the text match the declared answer key', () => {
  passages.forEach((p) => {
    const markers = [...p.text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
    assert.deepEqual(
      markers,
      p.gaps.map((g) => g.n),
      `${p.id}: markers in the prose do not line up with gaps[]`
    );
    markers.forEach((m, i) => {
      assert.equal(m, i + 1, `${p.id}: marker ${m} is out of sequence`);
    });
  });
});

test('every drill has exactly one gap marker', () => {
  drills.forEach((d) => {
    const markers = [...d.s.matchAll(/\{1\}/g)];
    assert.equal(markers.length, 1, `${d.id} has ${markers.length} markers`);
  });
});

test('identifiers are unique', () => {
  const seen = new Set();
  [...passages, ...drills].forEach((item) => {
    assert.ok(!seen.has(item.id), `duplicate id: ${item.id}`);
    seen.add(item.id);
  });
});

test('every item declares a skill key, a pattern and an explanation', () => {
  passages.forEach((p) => {
    p.gaps.forEach((g) => {
      assert.ok(g.k, `${p.id}#${g.n}: missing skill key`);
      assert.ok(g.p, `${p.id}#${g.n}: missing pattern label`);
      assert.ok(g.tip && g.tip.length > 20, `${p.id}#${g.n}: explanation too short`);
      assert.equal(g.a, g.a.toUpperCase(), `${p.id}#${g.n}: answer must be upper case`);
    });
  });
  drills.forEach((d) => {
    assert.ok(d.k && d.p && d.tip && d.src, `${d.id}: missing metadata`);
  });
});

test('answers are single words, as the exam requires', () => {
  const check = (answer, where) => {
    assert.ok(!/\s/.test(answer), `${where}: "${answer}" is more than one word`);
  };
  passages.forEach((p) => p.gaps.forEach((g) => check(g.a, `${p.id}#${g.n}`)));
  drills.forEach((d) => check(d.a, d.id));
});

test('no skill is registered without an exercise behind it', () => {
  const orphans = CPE.content.allKeys().filter((k) => {
    const s = CPE.content.skills[k];
    return s.passages.length === 0 && s.drills.length === 0;
  });
  assert.deepEqual(orphans, [], `orphan skills: ${orphans.join(', ')}`);
});

test('accepted alternatives never duplicate the canonical answer', () => {
  const check = (item, where) => {
    (item.alt || []).forEach((a) => {
      assert.notEqual(
        CPE.util.norm(a),
        CPE.util.norm(item.a),
        `${where}: alternative "${a}" repeats the answer`
      );
    });
  };
  passages.forEach((p) => p.gaps.forEach((g) => check(g, `${p.id}#${g.n}`)));
  drills.forEach((d) => check(d, d.id));
});

test('the canonical answer always grades as correct', () => {
  passages.forEach((p) => {
    p.gaps.forEach((g) => {
      assert.ok(CPE.util.matches(g.a, g), `${p.id}#${g.n}: own answer rejected`);
      assert.ok(CPE.util.matches(g.a.toLowerCase(), g), `${p.id}#${g.n}: lower case rejected`);
      assert.ok(CPE.util.matches('  ' + g.a + ' ', g), `${p.id}#${g.n}: padded answer rejected`);
    });
  });
  drills.forEach((d) => {
    assert.ok(CPE.util.matches(d.a, d), `${d.id}: own answer rejected`);
  });
});
