<#
.SYNOPSIS
    Builds the project's commit history in a single run.

.DESCRIPTION
    The repository is committed in the order it was actually constructed:
    tokens before components, engine before interface, content before the
    screens that render it, documentation last. Each commit carries a
    Conventional Commits subject and a body explaining the decision behind it.

    The script is idempotent. If the repository already has commits it stops and
    leaves them alone, so it is safe to call from publish.ps1.

.PARAMETER Name
    Author name for the history. Defaults to the existing git config.

.PARAMETER Email
    Author email. This must match a verified email on the GitHub account for the
    commits to appear on the contribution graph.

.PARAMETER Branch
    Branch to build the history on. Defaults to main.

.EXAMPLE
    pwsh -File scripts/seed-history.ps1
#>

[CmdletBinding()]
param(
    [string] $Name   = 'MatiasViillalba',
    [string] $Email  = 'mativillalbba@gmail.com',
    [string] $Branch = 'main',
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)
Push-Location $repoRoot

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $Arguments)
    $output = & git @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed:`n$output"
    }
    return $output
}

# Windows PowerShell turns a native command's stderr into a terminating error
# while $ErrorActionPreference is 'Stop', so probes that are *expected* to fail
# have to run with it relaxed.
function Test-GitSucceeds {
    param([string[]] $Arguments)
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & git @Arguments 2>&1 | Out-Null
        return ($LASTEXITCODE -eq 0)
    } finally {
        $ErrorActionPreference = $previous
    }
}

# --- Repository ------------------------------------------------------------

if (-not (Test-Path (Join-Path $repoRoot '.git'))) {
    Write-Host 'Initialising repository...'
    Invoke-Git init --quiet | Out-Null
    Invoke-Git symbolic-ref HEAD "refs/heads/$Branch" | Out-Null
}

if ($Name)  { Invoke-Git config user.name  $Name  | Out-Null }
if ($Email) { Invoke-Git config user.email $Email | Out-Null }

# Windows checkouts otherwise commit CRLF into text files.
Invoke-Git config core.autocrlf false | Out-Null

if ((Test-GitSucceeds @('rev-parse', '--verify', 'HEAD')) -and -not $Force) {
    $count = (& git rev-list --count HEAD).Trim()
    Write-Host "Repository already has $count commit(s); nothing to do."
    Pop-Location
    return
}

# --- The history -----------------------------------------------------------

function New-Step {
    param([string] $Subject, [string] $Body, [string[]] $Paths)
    [pscustomobject]@{ Subject = $Subject; Body = $Body; Paths = $Paths }
}

$steps = @(
    New-Step 'chore: initialise the repository with ignore rules' `
        'Keeps node_modules and editor noise out of a project that otherwise ships exactly what it serves.' `
        @('.gitignore')

    New-Step 'chore: add the MIT licence' `
        'Permissive licence so the exercise bank can be reused and adapted freely.' `
        @('LICENSE')

    New-Step 'chore: add npm scripts for tests, linting and local serving' `
        'No runtime dependencies. jsdom is a dev dependency used only by the interface smoke test.' `
        @('package.json')

    New-Step 'feat(design): introduce the Ember dark colour token system' `
        'Near-black canvas with a high-energy orange accent. Every surface, radius, easing curve and type stack derives from these custom properties so no component invents a value of its own.' `
        @('assets/css/tokens.css')

    New-Step 'feat(design): lay out the app frame, chrome and ambient canvas' `
        'Sticky top bar and tab bar with iOS safe-area padding, plus three slowly drifting blurred blobs that give the background depth without touching the main thread.' `
        @('assets/css/base.css')

    New-Step 'feat(design): build the component library' `
        'Cards, buttons, chips, progress rings and the inline gap input that the whole exam screen is built from. The gap input is set at 16px so Safari does not zoom on focus.' `
        @('assets/css/components.css')

    New-Step 'feat(design): add the per-screen layouts' `
        'Home, exam, drill, result, library, progress and settings. Exam prose is set in a serif at an adjustable reading size; the interface stays on the system stack.' `
        @('assets/css/screens.css')

    New-Step 'feat(design): define the motion vocabulary' `
        'Entrances, staggering, the shake on a wrong answer and the halo on a Grade A result. Everything collapses to nothing under prefers-reduced-motion.' `
        @('assets/css/animations.css')

    New-Step 'feat: add the application shell' `
        'Seven empty screen containers, the tab bar and the sheet. Every asset path is relative so the app also works from a GitHub Pages project subdirectory.' `
        @('index.html')

    New-Step 'feat: stamp the build identity used as the cache namespace' `
        'Bumping BUILD invalidates every cached asset on the device, which is the entire update mechanism for an app with no build step.' `
        @('assets/js/version.js')

    New-Step 'feat(core): add DOM and language helpers' `
        'A small hyperscript helper, a deterministic PRNG and the answer normaliser that makes grading forgiving about case, spacing and typographic apostrophes without accepting the wrong word.' `
        @('assets/js/core/util.js')

    New-Step 'feat(core): persist learner state across sessions' `
        'A single versioned localStorage record holding skills, exercise history, streak and settings. Writes are debounced because grading a passage updates eight skills at once, and a blocked storage API degrades to memory rather than throwing.' `
        @('assets/js/core/store.js')

    New-Step 'feat(srs): implement Leitner scheduling over grammar patterns' `
        'Six boxes on 0/1/2/4/9/21-day intervals. A correct answer promotes one box; a miss demotes two, because a pattern that looked settled and collapsed needs the short loop again. Mastery is box 4, and readiness is pattern coverage rather than raw accuracy.' `
        @('assets/js/core/srs.js')

    New-Step 'feat(content): add the exercise registry and selection engine' `
        'Data files self-register as plain scripts, which keeps the whole bank available the moment the shell paints. Indexing by skill key is what lets a word missed in one passage return inside a different one.' `
        @('assets/js/core/content.js')

    New-Step 'feat(content): add passage bank 01 - collocation and phrasal verbs' `
        'Six C2 passages covering restore TO, at the EXPENSE of, take OFF, gain GROUND, lose patience WITH, set UP/APART and the perfect participle clause.' `
        @('assets/js/data/passages-01.js')

    New-Step 'feat(content): add passage bank 02 - reference words and quantifiers' `
        'Six passages on be + to-infinitive, distributive EVERY, correlative EITHER/OR, causative get, and the dependent prepositions of the travel and careers register.' `
        @('assets/js/data/passages-02.js')

    New-Step 'feat(content): add passage bank 03 - cause, consequence and articles' `
        'Six passages on prevent FROM, THUS + participle, spend time + gerund, steer CLEAR of, and the perfect and past perfect in extended narrative.' `
        @('assets/js/data/passages-03.js')

    New-Step 'feat(content): add passage bank 04 - pseudo-clefts and formal relatives' `
        'Six passages built around WHAT as a pseudo-cleft subject, preposition + which, of LITTLE value, by no MEANS and the idiomatic quantifiers the exam favours.' `
        @('assets/js/data/passages-04.js')

    New-Step 'feat(content): add passage bank 05 - travel, nature and heritage' `
        'Six passages on from which, both of which, of which, island hopping, run AGROUND and the verb + adverb combinations of descriptive prose.' `
        @('assets/js/data/passages-05.js')

    New-Step 'feat(content): add passage bank 06 - reference, substitution and first inversions' `
        'Six passages introducing NOWHERE inversion, Had + subject + participle, Be that as it MAY and the way IN which, alongside former/latter reference.' `
        @('assets/js/data/passages-06.js')

    New-Step 'feat(content): add passage bank 07 - negative inversion and fronted concession' `
        'Six argumentative passages on HOWEVER + adjective, Were + subject + to-infinitive, So + adjective + auxiliary + subject, Not until + inversion and Only when + inversion. This is the material that separates a Grade C from a Grade A.' `
        @('assets/js/data/passages-07.js')

    New-Step 'feat(content): add passage bank 08 - the Grade A structures in full' `
        'Six passages on Only by + gerund, Never before + inversion, Much as + concession, in the absence of which, and adjective + as + subject + verb.' `
        @('assets/js/data/passages-08.js')

    New-Step 'feat(content): add drill bank 01 - idioms and dependent prepositions' `
        'A hundred single-gap sentences reinforcing the collocations and phrasal verbs from the first passage banks, plus the source texts they came from.' `
        @('assets/js/data/drills-01.js')

    New-Step 'feat(content): add drill bank 02 - abstract registers' `
        'A hundred sentences across relationships, cognition, the third sector, therapy, food and language history, each bound to the same skill keys as the passages.' `
        @('assets/js/data/drills-02.js')

    New-Step 'feat(content): add drill bank 03 - inversion and concession drills' `
        'A hundred sentences drilling the structures that decide the top band: negative inversion, inverted conditionals, fronted concessives and prepositional relatives.' `
        @('assets/js/data/drills-03.js')

    New-Step 'feat(ui): add toasts and the bottom sheet' `
        'The two pieces of transient chrome every other screen borrows.' `
        @('assets/js/ui/toast.js')

    New-Step 'feat(ui): build the home dashboard' `
        'Answers one question: what should this learner do in the next ten minutes. A readiness ring, a daily goal, four actions and the weak-pattern strip that makes mistakes impossible to ignore.' `
        @('assets/js/ui/home.js')

    New-Step 'feat(ui): implement the Open Cloze exam screen' `
        'Renders a passage as running prose with inline inputs, exactly as the paper presents it, and defers grading until asked. Each gap is then annotated with the pattern it was testing and why the answer is what it is.' `
        @('assets/js/ui/cloze.js')

    New-Step 'feat(ui): implement the drill screen with an in-session lapse queue' `
        'Day-scale intervals are not enough on their own: a miss at nine in the evening that returns tomorrow is forgotten first. A missed drill is therefore requeued three cards later as well as being demoted two boxes.' `
        @('assets/js/ui/drill.js')

    New-Step 'feat(ui): report Cambridge bands on the result screen' `
        'A band rather than a bare percentage, the patterns that were missed by name, and the single most useful next action: drilling those exact patterns immediately.' `
        @('assets/js/ui/result.js')

    New-Step 'feat(ui): add the passage library with progress filters' `
        'The smart session decides for you; this exists for the days you want to decide for yourself, or to hunt down the one text you keep failing.' `
        @('assets/js/ui/library.js')

    New-Step 'feat(ui): visualise progress, streaks and pattern accuracy' `
        'A twelve-week activity heatmap, the Leitner box distribution and every practised pattern ranked worst-first, which is the only ordering that changes behaviour.' `
        @('assets/js/ui/stats.js')

    New-Step 'feat(ui): add settings with progress export and import' `
        'Progress lives in localStorage, which a browser is entitled to clear. Export and import are first-class here rather than a hidden extra, and private-browsing mode is reported instead of failing silently.' `
        @('assets/js/ui/settings.js')

    New-Step 'feat: wire routing, sessions and application boot' `
        'Screen routing with a back stack, immersive mode for the exam screens, manifest shortcut handling and the SVG gradient definition the progress ring strokes itself with.' `
        @('assets/js/app.js')

    New-Step 'feat(pwa): declare the web app manifest' `
        'Standalone display, relative start_url and scope so the app installs correctly from a project subdirectory, plus shortcuts for the smart session and the mistake review.' `
        @('manifest.webmanifest')

    New-Step 'feat(pwa): cache the full asset graph for offline study' `
        'Precaches all 27 assets on install and serves cache-first. Each asset is added individually so one 404 cannot abandon the whole precache, which is the usual cause of a PWA that only sometimes works offline.' `
        @('sw.js')

    New-Step 'feat(pwa): generate the opaque PNG icon set' `
        'iOS will not use an SVG for a home-screen icon and handles transparency poorly, so the icons are painted with System.Drawing and saved fully opaque.' `
        @('scripts/make-icons.ps1')

    New-Step 'feat(pwa): add the generated app icons' `
        'Manifest icons at 192 and 512, a maskable variant with extra safe area, and the 180x180 apple-touch-icon that iOS actually reads.' `
        @('icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png')

    New-Step 'build: add a dependency-free static server for local testing' `
        'A service worker will not register over file://, so offline behaviour can only be exercised from a real origin.' `
        @('scripts/serve.mjs')

    New-Step 'build: parse every shipped script in one command' `
        'With no build step a syntax error would otherwise surface on the device. This walks the exact list the service worker precaches.' `
        @('scripts/check-syntax.mjs')

    New-Step 'test: add a harness that boots the app under Node' `
        'Evaluates the shipped browser scripts as function bodies in the current realm, deliberately avoiding node:vm so structural assertions are not defeated by cross-realm prototypes.' `
        @('tests/harness.mjs')

    New-Step 'test: verify gap markers match the declared answer keys' `
        'A broken exercise is worse than a missing one: it teaches the wrong answer. Checks gap counts, marker sequencing, unique ids, single-word answers and that every canonical answer grades as correct.' `
        @('tests/content-integrity.test.mjs')

    New-Step 'test: hold the scheduler to its promises' `
        'Promotion, two-box demotion, box clamping, due dates, weak-skill ranking, readiness and the Cambridge band thresholds.' `
        @('tests/srs.test.mjs')

    New-Step 'test: walk the whole interface end to end in jsdom' `
        'Boots the real index.html, visits every screen, sits a full exam answering half of it correctly and asserts the scheduler reacted. Skips cleanly when jsdom is absent so the unit suite still runs on a bare checkout.' `
        @('tests/ui-smoke.test.mjs')

    New-Step 'docs: write the project README with the iPhone install flow' `
        'Explains what the bank contains, how the scheduler behaves and the exact Safari steps to install the app to the home screen.' `
        @('README.md')

    New-Step 'docs: describe the architecture and boot sequence' `
        'Why there is no framework, how the script order forms the only dependency graph, and what happens between the first byte and the home screen.' `
        @('docs/architecture.md')

    New-Step 'docs: document the spaced repetition scheduler' `
        'Boxes, intervals, the asymmetric demotion, the lapse queue, the urgency formula and why readiness measures coverage rather than accuracy.' `
        @('docs/srs-algorithm.md')

    New-Step 'docs: specify the content model and its invariants' `
        'The passage and drill formats, the nine rules the integrity suite enforces, and how to add material without fragmenting the skill index.' `
        @('docs/content-model.md')

    New-Step 'docs: record the Ember design system' `
        'Tokens, the two type families and their separate jobs, the motion vocabulary, and the iOS-specific details that make the inline gap input usable.' `
        @('docs/design-system.md')

    New-Step 'docs: document the iOS home-screen installation flow' `
        'The install steps, how to verify offline behaviour, which meta tags do what, and the real limits of iOS that are better known in advance than discovered.' `
        @('docs/ios-installation.md')

    New-Step 'docs: explain the GitHub Pages deployment' `
        'Why every path in the project is relative, how to configure Pages, and what to verify once it is live.' `
        @('docs/deployment.md')

    New-Step 'docs: audit contrast, touch targets and motion' `
        'Measured contrast ratios, the rule that colour never carries meaning alone, keyboard flow and what is still outstanding.' `
        @('docs/accessibility.md')

    New-Step 'docs: record the performance budget and cache strategy' `
        'Measured asset sizes, why two thirds of the payload is content rather than code, and the reasoning behind cache-first with no revalidation.' `
        @('docs/performance.md')

    New-Step 'docs: outline what version 1.1 should tackle' `
        'Timed mode, per-passage error review, a second bank over the same skill keys, and the things deliberately left out of scope.' `
        @('docs/roadmap.md')

    New-Step 'ci: verify content and deploy to GitHub Pages' `
        'Parses every shipped script and runs the unit suite before publishing, so a broken exercise cannot reach the device.' `
        @('.github/workflows/deploy-pages.yml')

    New-Step 'chore(release): add the 1.0.0 changelog' `
        'Records the first release: 48 passages, 300 drills, 555 tracked patterns and full offline support.' `
        @('CHANGELOG.md')

    New-Step 'build: script the repository history' `
        'Commits the project in the order it was constructed, one logical unit at a time, so the log reads as a build rather than a dump.' `
        @('scripts/seed-history.ps1', 'scripts/seed-history.sh')

    New-Step 'build: publish the repository in a single command' `
        'Creates the history if needed, configures the remote and pushes every commit at once.' `
        @('scripts/publish.ps1', 'scripts/publish.sh')
)

# --- Commit ----------------------------------------------------------------

Write-Host ("Building {0} commits on {1}..." -f $steps.Count, $Branch)

$made = 0
foreach ($step in $steps) {
    $existing = @($step.Paths | Where-Object { Test-Path (Join-Path $repoRoot $_) })
    if ($existing.Count -eq 0) {
        Write-Warning ("skipped (no files): {0}" -f $step.Subject)
        continue
    }

    Invoke-Git add -- @existing | Out-Null

    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Warning ("skipped (nothing staged): {0}" -f $step.Subject)
        continue
    }

    Invoke-Git commit -m $step.Subject -m $step.Body | Out-Null
    $made++
    Write-Host ("  [{0,2}] {1}" -f $made, $step.Subject)
}

# Anything not claimed by a step above still belongs in the release.
# Passed as an array: a bare -A would bind to this function's own -Arguments.
Invoke-Git @('add', '--all') | Out-Null
& git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    Invoke-Git commit -m 'chore: add remaining project files' -m 'Sweeps up anything not claimed by an earlier step so the working tree is clean.' | Out-Null
    $made++
    Write-Host ("  [{0,2}] chore: add remaining project files" -f $made)
}

Test-GitSucceeds @('tag', '-a', 'v1.0.0', '-m', 'Cloze C2 1.0.0') | Out-Null

Write-Host ''
Write-Host ("Done: {0} commits on {1}." -f $made, $Branch)
Pop-Location
