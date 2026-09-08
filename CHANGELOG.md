# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] — 2026-09-08

### Added

- **Sincronización entre dispositivos.** El progreso deja de vivir atado a un
  navegador: se sube a una fila de Postgres identificada por un código de 16
  caracteres, y el celular y la computadora se mantienen al día solos. Sin
  cuenta, sin contraseña y sin login: el código es la identidad.
- **Sección Sincronización en Ajustes.** Crear un código, vincular con uno
  existente, ver el estado de la última subida, sincronizar a mano y desvincular
  el dispositivo (que no borra nada, ni local ni en la nube).
- **Fusión sin pérdida.** Cada sincronización es bajar → fusionar → subir. La
  fusión es idempotente y conmutativa, así que sincronizar dos veces no duplica
  nada y ningún dispositivo tiene prioridad sobre el otro. Una sesión hecha en
  modo avión sube sola al recuperar la señal.
- **`scripts/supabase-setup.sql` y `docs/sync.md`** con la puesta en marcha
  completa, el modelo de amenazas y las reglas de fusión.

### Changed

- El registro de estado lleva `updatedAt`, y `store` avisa a quien escuche cada
  vez que se escribe: es lo que dispara la subida.

## [1.2.0] — 2026-09-07

### Added

- **Pantalla Puntos débiles.** Todo lo que la app detecta como flojo — palabras,
  chunks, colocaciones, modismos, phrasal verbs y estructuras — agrupado por
  tipo, del peor al mejor, con su porcentaje y sus contextos disponibles.
  Incluye "Practicar todos estos puntos débiles" y práctica por grupo.
- **Ejercicios random desde Progreso.** Un botón que toma todos los patrones al
  0% o con errores, los mezcla al azar y los saca en contextos distintos.
- **Práctica por patrón, no solo por palabra.** Se puede retirar `TAKE` en "take
  for granted" sin retirar `TAKE` en todos lados.

### Changed

- **Los botones se quedan pintados.** "Aprendido" queda en verde y "Aún no" en
  rojo hasta que el alumno cambie de opinión, en la práctica y en las dos listas.
- **Tamaño del texto continuo.** Las dos A de Ajustes ahora suben o bajan un
  paso por toque (78%–150%) en vez de tres tallas fijas, con muestra en vivo, y
  la escala afecta a textos de examen, ejercicios y explicaciones.

## [1.1.0] — 2026-09-07

### Added

- **Mistake book.** Every word missed anywhere in the app is tracked by the word
  itself, not only by its pattern, and gets its own screen (*Mis errores*).
- **Practice in many contexts.** Practising a missed word draws several
  *different* sentences for it — its own drills plus the sentence around that
  word in every exam passage that contains it. No sentence repeats in a session.
- **"Aprendido" / "Aún no".** Two small buttons, shown after grading and on the
  mistake screen, are the only way a word leaves practice. "Aprendido" retires
  it; "Aún no" keeps it coming back. Failing it again puts it straight back.
- **324 new drills** (624 in total, 231 distinct target words): particles and
  prepositions, fixed expressions and grammar words, each written three times in
  unrelated sentences.

### Changed

- **The readiness ring actually moves.** "% hacia Grade A" is now a composite of
  coverage (45%), Leitner solidity (40%) and accuracy (15%) instead of
  `mastered / total`, which sat at 0% for the first fortnight. The Progreso
  screen shows the three ingredients.
- The smart session now starts with mistake practice when there are words
  pending.

### Removed

- Export, import and reset progress from Ajustes: nothing on that screen can
  destroy months of study with a mis-tap any more.

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
