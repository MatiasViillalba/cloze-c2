/**
 * Spaced repetition over *grammar skills*, not over sentences.
 *
 * A "skill" is one target word bound to one pattern — WHAT as a nominal
 * relative, AS in a fronted concessive, TO in an inverted second conditional.
 * Every gap in the app declares the skill it exercises, so a word missed inside
 * one passage comes back inside a different passage and a different drill until
 * it is genuinely automatic.
 *
 * Leitner boxes 0..5. Answer right -> promote; answer wrong -> demote two boxes
 * and requeue inside the current session (the "lapse queue"), which is what
 * makes a mistake resurface within minutes as well as within days.
 */
(function (CPE) {
  'use strict';

  const DAY = 86400000;
  const INTERVALS = [0, 1, 2, 4, 9, 21];   /* days, indexed by box */
  const MAX_BOX = 5;
  const MASTER_BOX = 4;                    /* box 4+ counts as mastered */

  function record(key) {
    const skills = CPE.store.get('skills');
    if (!skills[key]) {
      skills[key] = { box: 0, seen: 0, right: 0, wrong: 0, due: 0, last: 0, streak: 0 };
    }
    return skills[key];
  }

  /** Grades one answer and returns the updated skill record. */
  function grade(key, correct) {
    let rec;
    CPE.store.update(() => {
      rec = record(key);
      rec.seen += 1;
      rec.last = Date.now();
      if (correct) {
        rec.right += 1;
        rec.streak += 1;
        rec.box = Math.min(MAX_BOX, rec.box + 1);
      } else {
        rec.wrong += 1;
        rec.streak = 0;
        rec.box = Math.max(0, rec.box - 2);
      }
      rec.due = Date.now() + INTERVALS[rec.box] * DAY;
    });
    return rec;
  }

  const isDue = (rec, now) => !rec || rec.seen === 0 || rec.due <= (now || Date.now());

  /** Lower score = more urgent. Unseen skills sit just behind overdue lapses. */
  function urgency(key, now) {
    const rec = CPE.store.get('skills')[key];
    const t = now || Date.now();
    if (!rec || rec.seen === 0) return 1.5;
    const overdue = (t - rec.due) / DAY;
    const accuracy = rec.right / Math.max(1, rec.seen);
    return rec.box - Math.min(4, Math.max(0, overdue)) * 0.6 + accuracy * 1.2;
  }

  function dueKeys(allKeys, now) {
    const t = now || Date.now();
    const skills = CPE.store.get('skills');
    return allKeys.filter((k) => isDue(skills[k], t));
  }

  /** Skills the learner has actually got wrong, worst first. */
  function weakKeys(allKeys, limit) {
    const skills = CPE.store.get('skills');
    const scored = allKeys
      .filter((k) => skills[k] && skills[k].wrong > 0 && skills[k].box < MASTER_BOX)
      .map((k) => ({ k, u: urgency(k) }))
      .sort((a, b) => a.u - b.u)
      .map((x) => x.k);
    return limit ? scored.slice(0, limit) : scored;
  }

  /**
   * Every trouble spot, worst first: any skill actually attempted that has been
   * missed at least once or is still sitting at 0% accuracy. Skills the learner
   * has personally marked "Aprendido" drop out; everything else stays until
   * they say so. This is what the Puntos débiles screen lists.
   */
  function troubleKeys(allKeys) {
    const skills = CPE.store.get('skills');
    return allKeys
      .filter((k) => {
        const rec = skills[k];
        if (!rec || rec.seen === 0) return false;
        if (CPE.words.skillLearned(k)) return false;
        return rec.wrong > 0 || rec.right === 0;
      })
      .map((k) => {
        const rec = skills[k];
        return { k, acc: Math.round((rec.right / rec.seen) * 100), rec };
      })
      .sort((a, b) => a.acc - b.acc || b.rec.wrong - a.rec.wrong)
      .map((x) => x.k);
  }

  /** Ranks any key list by urgency so a session always starts where it hurts. */
  function rank(keys) {
    const now = Date.now();
    return keys
      .map((k) => ({ k, u: urgency(k, now) }))
      .sort((a, b) => a.u - b.u)
      .map((x) => x.k);
  }

  /**
   * Overall readiness — the number in the ring.
   *
   * A bare `mastered / total` never moves: the bank holds hundreds of patterns
   * and box 4 takes a week of correct answers, so the ring sat at 0% for the
   * first fortnight, which is exactly when motivation matters most. The score
   * is therefore a composite of the three things a Grade A actually needs:
   *
   *   cobertura  45%  how much of the bank you have attempted at all
   *   solidez    40%  how high in the Leitner boxes what you have seen sits
   *   precisión  15%  your hit rate across every answer ever given
   *
   * Every one of them has to be near the ceiling to reach 90, which is where
   * Grade A starts — but the needle moves from the very first session.
   */
  function overview(allKeys) {
    const skills = CPE.store.get('skills');
    const boxes = [0, 0, 0, 0, 0, 0];
    let mastered = 0, seen = 0, right = 0, attempts = 0, strength = 0;

    allKeys.forEach((k) => {
      const rec = skills[k];
      if (!rec || rec.seen === 0) { boxes[0] += 1; return; }
      boxes[rec.box] += 1;
      seen += 1;
      right += rec.right;
      attempts += rec.seen;
      strength += Math.min(1, rec.box / MASTER_BOX);
      if (rec.box >= MASTER_BOX) mastered += 1;
    });

    const total = allKeys.length;
    const coverage = total ? seen / total : 0;
    const solidity = seen ? strength / seen : 0;
    const accuracy = attempts ? right / attempts : 0;
    const readiness = Math.round(100 * (0.45 * coverage + 0.40 * solidity + 0.15 * accuracy));

    return {
      total,
      seen,
      mastered,
      boxes,
      accuracy: Math.round(accuracy * 100),
      coverage: Math.round(coverage * 100),
      solidity: Math.round(solidity * 100),
      readiness,
      grade: projected(readiness),
      due: dueKeys(allKeys).length
    };
  }

  /** The band the current readiness would put you in on exam day. */
  function projected(readiness) {
    if (readiness >= 90) return { g: 'A', label: 'Grade A' };
    if (readiness >= 78) return { g: 'B', label: 'Grade B' };
    if (readiness >= 65) return { g: 'C', label: 'Grade C' };
    if (readiness >= 45) return { g: 'C1', label: 'Nivel C1' };
    return { g: '—', label: 'En construcción' };
  }

  /** Cambridge-style band for a single exercise score. */
  function band(score, total) {
    const p = total ? (score / total) * 100 : 0;
    if (p >= 90) return { g: 'A', label: 'Grade A', note: 'Nivel de sobresaliente. Así se aprueba con A.' };
    if (p >= 78) return { g: 'B', label: 'Grade B', note: 'Muy cerca de la A: pulí los patrones que fallaste.' };
    if (p >= 65) return { g: 'C', label: 'Grade C', note: 'Aprobado. Repetí este texto tras repasar los fallos.' };
    if (p >= 50) return { g: 'C1', label: 'Nivel C1', note: 'Todavía por debajo del C2. Volvé a los patrones marcados.' };
    return { g: '—', label: 'Sin banda', note: 'Repasá las explicaciones y volvé a intentarlo: se domina repitiendo.' };
  }

  CPE.srs = {
    INTERVALS, MAX_BOX, MASTER_BOX,
    grade, isDue, urgency, dueKeys, weakKeys, troubleKeys, rank, overview, band, record, projected
  };
}(window.CPE));
