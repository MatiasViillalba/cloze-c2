/**
 * Content registry.
 *
 * Data files call `CPE.content.registerPassages([...])` / `registerDrills([...])`
 * as plain scripts — no modules, no fetch — so the whole bank is present the
 * instant the shell paints, with or without a network.
 *
 * Two complementary formats:
 *   passage — a full Cambridge Part 2 text with eight numbered gaps
 *   drill   — one sentence, one gap: fast, adaptive, SRS-driven reps
 * Both attach every gap to a skill key (`k`), which is what the scheduler
 * actually tracks.
 */
(function (CPE) {
  'use strict';

  const passages = [];
  const drills = [];
  const skills = Object.create(null);   /* key -> { k, a, p, passages:[], drills:[] } */

  const slug = (s) => String(s).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 46);

  function touchSkill(key, answer, pattern) {
    if (!skills[key]) skills[key] = { k: key, a: answer, p: pattern, passages: [], drills: [] };
    return skills[key];
  }

  function keyFor(item) {
    return item.k || slug(item.a + '-' + (item.p || ''));
  }

  function registerPassages(list) {
    list.forEach((p) => {
      p.gaps.forEach((g) => {
        g.k = keyFor(g);
        g.a = String(g.a).toUpperCase();
        touchSkill(g.k, g.a, g.p).passages.push(p.id);
      });
      p.keys = p.gaps.map((g) => g.k);
      passages.push(p);
    });
  }

  function registerDrills(list) {
    list.forEach((d) => {
      d.k = keyFor(d);
      d.a = String(d.a).toUpperCase();
      touchSkill(d.k, d.a, d.p).drills.push(d.id);
      drills.push(d);
    });
  }

  const allKeys = () => Object.keys(skills);
  const skillMeta = (k) => skills[k] || { k, a: '?', p: '' };
  const passageById = (id) => passages.filter((p) => p.id === id)[0];
  const drillById = (id) => drills.filter((d) => d.id === id)[0];

  /* ------------------------------------------------------------ Picking --- */

  /**
   * Chooses the passage that covers the most urgent skills, with a mild penalty
   * for texts already completed so the rotation keeps moving.
   */
  function pickPassage(opts) {
    const o = opts || {};
    const done = CPE.store.get('exercises');
    const now = Date.now();
    let best = null, bestScore = -Infinity;

    passages.forEach((p) => {
      if (o.exclude && o.exclude.indexOf(p.id) !== -1) return;
      let score = 0;
      p.keys.forEach((k) => { score += 2.2 - CPE.srs.urgency(k, now); });
      const rec = done[p.id];
      if (rec) {
        score -= 2.6 * rec.attempts;
        if (rec.best >= 8) score -= 3;
        const restedDays = (now - rec.lastAt) / CPE.util.DAY;
        score += Math.min(4, restedDays * 0.35);
      } else {
        score += 1.4;
      }
      score += Math.random() * 0.8;      /* keeps consecutive picks from feeling scripted */
      if (score > bestScore) { bestScore = score; best = p; }
    });

    return best || passages[0];
  }

  /**
   * Builds a drill queue: overdue and weak skills first, then unseen material,
   * then variety. One item per skill so a single session never grinds.
   */
  function pickDrills(n, opts) {
    const o = opts || {};
    const count = n || 12;
    const byKey = Object.create(null);
    drills.forEach((d) => {
      (byKey[d.k] || (byKey[d.k] = [])).push(d);
    });

    let keys = Object.keys(byKey);
    if (o.onlyWeak) keys = CPE.srs.weakKeys(keys);
    if (o.keys) keys = keys.filter((k) => o.keys.indexOf(k) !== -1);
    keys = CPE.srs.rank(keys);

    const out = [];
    for (let i = 0; i < keys.length && out.length < count; i++) {
      const pool = byKey[keys[i]];
      out.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return CPE.util.shuffle(out);
  }

  /** Every skill the learner has fumbled at least once, worst first. */
  const weakSkills = (limit) => CPE.srs.weakKeys(allKeys(), limit).map(skillMeta);

  function stats() {
    return {
      passages: passages.length,
      drills: drills.length,
      gaps: passages.reduce((n, p) => n + p.gaps.length, 0) + drills.length,
      skills: allKeys().length
    };
  }

  CPE.content = {
    passages, drills, skills,
    registerPassages, registerDrills,
    allKeys, skillMeta, passageById, drillById,
    pickPassage, pickDrills, weakSkills, stats, slug
  };
}(window.CPE));
