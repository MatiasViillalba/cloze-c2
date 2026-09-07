# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-09-06

First release. An installable, offline-first trainer for the Open Cloze section
of the Cambridge C2 Proficiency exam.

### Added

**Content**
- 48 original C2 passages in Cambridge Part 2 format, eight gaps each (384 gaps).
- 300 single-gap drill sentences.
- 555 distinct grammar patterns, each with a Spanish explanation of why the
  answer is what it is: negative inversion, fronted concessives, inverted
  conditionals, prepositional relatives, collocations and phrasal verbs.

**Learning engine**
- Leitner scheduling over grammar patterns rather than over words, so `WHAT` as
  a nominal relative and `WHAT` in a pseudo-cleft are tracked separately.
- Six boxes with 0/1/2/4/9/21-day intervals; a correct answer promotes one box,
  a miss demotes two.
- In-session lapse queue: a missed drill returns three cards later.
- Urgency-based selection for both drills and full passages.
- Cambridge-style bands (A / B / C / C1) instead of bare percentages.
- Grade A readiness metric based on pattern coverage, not on raw accuracy.

**Interface**
- Seven screens: home dashboard, exam, drill, result, library, progress, settings.
- Inline gap inputs rendered inside running prose, tuned for iOS Safari
  (16px minimum font size, autocorrect and autocapitalisation disabled,
  Enter advances to the next gap).
- Progress screen with a twelve-week activity heatmap, Leitner distribution and
  a per-pattern accuracy table.
- Ember design system: near-black canvas, high-energy orange, system typography
  for the interface and a serif for exam prose.
- Adjustable reading size, daily goal and streak tracking.
- Progress export and import as JSON.

**Platform**
- Full offline support: the service worker precaches the entire 27-file asset
  graph on install and serves cache-first.
- Installable to the iOS home screen with a standalone display mode, safe-area
  handling and an opaque 180×180 touch icon.
- Manifest shortcuts for the smart session and the mistake review.

**Tooling**
- 31 tests covering content integrity, scheduler behaviour and a full
  end-to-end interface walkthrough in jsdom.
- Dependency-free static server and syntax checker.
- PowerShell icon generator.
- GitHub Pages deployment workflow.

[1.0.0]: https://github.com/MatiasViillalba/cloze-c2/releases/tag/v1.0.0
