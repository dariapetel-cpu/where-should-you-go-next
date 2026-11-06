# Where Should You Go Next? — Find Your Perfect Getaway

A complete sixteen-slide English travel presentation: seven interactive choices, fifteen curated destinations, personalized discoveries, a three-day itinerary, alternatives and a downloadable travel card.

## Preview the complete presentation

Requirements: Python 3 for the local server and analysis; a modern browser. Node.js is needed only to run the automated JavaScript tests. No npm or pip installation is required.

Clone the repository once, then run from its root (if already downloaded, open Terminal in that folder instead):

```sh
git clone https://github.com/dariapetel-cpu/where-should-you-go-next.git
cd where-should-you-go-next
python3 -m http.server 8000 --bind 127.0.0.1
```

**Main submission entry point: [getaway.html](getaway.html).** Open **http://127.0.0.1:8000/getaway.html**. Keep Terminal running; stop the server with Control-C. Do not double-click the HTML file: local JSON and module loading require HTTP. No install, account, API key or internet connection is needed for the presentation. Official tourism reference links require internet.

Opening the server root or `index.html` launches the **final sixteen-slide destination presentation**, retained as development evidence. It is not the final submission entry point. `prototype/` contains earlier experiments; the final app reuses its catalog, matcher and local Three.js runtime. A GitHub repository file page displays source, not a running app; use the local server above. No hosted deployment is claimed.

**Publication status:** The final presentation has been committed and pushed to GitHub.

## The complete journey

| Slides | Experience |
| --- | --- |
| 1–3 | Opening 3D suitcase, unscored globe moods and onboarding. |
| 4 | Four large, directly selectable image cards and a genuine 3D airplane arrival. |
| 5 | Interest route choices and a miniature WebGL scene. |
| 6 | Pace as four visual day patterns. |
| 7 | Travel companions as seating groups. |
| 8 | Budget slider with equivalent buttons in a collapsed accessibility alternative. |
| 9 | Drag a travel essential into the packing area, or select it by keyboard. |
| 10 | Dream-experience photo-style postcards. |
| 11 | Short matching transition with an immediate reveal option. |
| 12 | Destination, two reasons from actual answers, trade-off and score explanation. |
| 13 | Three personalized attraction recommendations with official destination references. |
| 14 | Three-day itinerary with day tabs and expandable complete plan. |
| 15 | Two ranked alternatives; exploring them does not change the winner. |
| 16 | Travel card, PNG download, printable HTML itinerary, response export, Python insights and restart. |

Destinations: Paris, Rome, Barcelona, London, Amsterdam, Lisbon, Tokyo, Kyoto, New York, Bali, Bangkok, Greek Islands, Swiss Alps, Iceland and Queenstown. All are reachable through the unchanged deterministic matcher.

The seven questions cover vacation type, interests, pace, companions, spending style, packing and dream experience. All are single-choice, revisable and mapped to the fixed catalog in [PRD.md](PRD.md). A weighted integer score ranks destinations; ties use a fixed preference order and stable ID, never randomness. Two users with the same destination can receive different activities and itinerary priorities because interests, pace, packing, companions and budget influence the plan. All fifteen destinations are reachable.

Use Back/Continue or Chapters. Unanswered questions gate forward navigation. Native radio options, buttons and slider work with the keyboard. Left/Right navigate when focus is outside interactive controls. Itinerary tabs support Left/Right/Home/End. Move over the WebGL objects or drag on touch; arrow keys rotate the focused object and Home resets it. Open the first suitcase by clicking it. Motion off and system reduced motion suppress animated movement. All scoring is hidden until the reveal.

Reload offers Resume or Start fresh. The full experience uses its own `sessionStorage` key, `travel-edit.getaway.complete.v1`; it does not overwrite legacy or prototype answers. This is tab recovery, not permanent cloud storage. Blocked storage leaves the presentation usable. Restart asks once before resetting this journey.

## Visuals and source transparency

The complete presentation uses the **existing generated destination artwork**, locally compressed into four JPEG atlases (about 3.8 MB total), then cropped into individual destinations in the browser. These are photorealistic **AI-generated illustrations**, not documentary photographs or exact street reconstructions. Local layered gradients, pointer parallax, entrance motion and readable translucent editorial panels complete the treatment. No image-generation or paid service is called at runtime.

The destination backgrounds are **2.5D image presentations, not fifteen complete navigable 3D environments**. Actual WebGL geometry is retained for onboarding and question heroes. Paris additionally offers the previously imported CC0 Eiffel Tower in an optional Three.js viewer with its silver finish and supporting scenery; this remains an architectural study, not a verified complete Paris street simulation. The original prototype's four scenes remain available and unchanged. Its separate high-quality model audit still flags an unreviewed Paris package and missing Tokyo GLB/backdrop assets; the complete presentation does not depend on that unfinished Tokyo model package. Rathaus EXR is preserved and unused, so it is never presented as Paris scenery.

Artwork layout, origin and checksums: [asset manifest](assets/destinations/manifest.json). Existing model/runtime sources: [prototype sources](prototype/SOURCES.md), [Eiffel provenance](prototype/assets/paris/eiffel-tower-provenance.md). Full-size original PNGs are preserved. These illustrations may contain inaccurate architectural details. Activity suggestions cite destination tourism references; they are editorial plans, not verified opening hours, bookings, prices, accessibility guarantees or route optimization.

## Offline Python demonstration

Python performs real work beyond serving the site: independent scoring, export validation, duplicate/revision resolution and SVG/CSV/JSON summary generation. It uses only Python's standard library.

1. Finish the quiz and click **Export response**. Save participant exports in `analysis/local_input/` (create it first). These private input/output locations are ignored by Git. Run `mkdir -p analysis/local_input` before saving files there.
2. Analyze them locally:

```sh
python3 analysis/analyze_responses.py --input analysis/local_input --output analysis/local_output --origin participant
```

3. Open `analysis/local_output/chart.svg` in a browser. Compare `counts.csv` and `summary.json`. Export a changed answer under the same attempt ID, rerun, and observe that only the highest valid revision counts. Conflicting highest revisions are excluded and reported; invalid files are reported. A run with no valid attempts preserves the previous output.

For a repeatable classroom demonstration without real participant data:

```sh
python3 analysis/generate_fixtures.py
python3 analysis/analyze_responses.py --input analysis/sample_responses --output assets/generated/getaway-demo --origin synthetic
```

The included 30 synthetic attempts produce two matches per destination. The final slide's **Project insights** displays that prepared chart and an accessible data table; it is not a live poll. Running the analyzer is separate from the browser: no backend or Python process is needed during the slides. Output files are individually replaced atomically after validation; publication of all three files is not a single transaction. Do not mix synthetic and participant exports or place real response data in public assets.

## Tests and verification

```sh
node --test tests/*.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
python3 tests/check_foundation.py
python3 tests/check_prototype.py
python3 tests/check_getaway.py
```

Use a current Node.js installation for tests. This workspace used the Node executable bundled with the Codex environment; it is not an application dependency.

The final run passed **93 Node tests and four Python analysis tests**, plus all three static check scripts. Automated coverage includes all 16,384 answer combinations, independent Python/JavaScript full-ranking parity, fifteen reachable winners, seven-question gating, recovery, answer changes, revision-aware exports, sixteen-slide DOM flow, packing drop/cancel, range input, itinerary keyboard tabs, alternatives and legacy regressions. DOM tests use a test double, **not a browser**. Static tests validate assets and markup. They do not establish rendered contrast, touch behavior, GPU rendering or performance.

The user reported that the complete sixteen-slide presentation was working after the reveal fix. That is user-reported functional review, not an independently recorded browser test. The assistant could list a real Chrome tab at slide 16, but tab inspection/capture failed with `Cannot read properties of undefined (reading 'timeoutMs')`. Earlier server/headless-browser attempts were blocked by the environment. No automated browser pass, screenshots, rendered contrast audit, screen-reader verification or measured target-laptop FPS is claimed.

See [the final review record and rehearsal checklist](docs/submission-review.md). Before submission, record browser/device details and check keyboard navigation, reduced motion, mobile layout, offline behavior, result reveal/recovery and all downloads. This can be a short manual rehearsal; do not mark unperformed checks as passed.

## Screenshots — required submission evidence

**No real browser screenshots are currently available in this repository.** Generated destination artwork is not screenshot evidence. Please capture these seven PNGs from the running app and save them in `docs/screenshots/`:

| Filename | Capture exactly |
| --- | --- |
| `01-opening.png` | Slide 1, title and actual 3D suitcase visible. |
| `02-question-selection.png` | Slide 4 with one answer visibly selected, enabled Continue and progress visible. |
| `03-destination-result.png` | Slide 12 with recommended destination and the two personalized reasons visible. |
| `04-attractions.png` | Slide 13 with one selected attraction and its detail panel. |
| `05-three-day-itinerary.png` | Slide 14 with the complete-itinerary section expanded; a full-page screenshot is acceptable. |
| `06-personalized-ending.png` | Slide 16 showing the personalized travel card and Restart Quiz button. |
| `07-python-insights.png` | The final slide's Project insights dialog showing the synthetic chart and table, after running the documented Python demo. |

Use a consistent desktop viewport, ideally 1440×900 or 1280×800. Capture actual browser output, with no developer tools or unrelated personal information. Do not recreate screens in an image generator. A mobile screenshot is optional additional evidence. Once the files exist, embed them here with descriptive alt text; no broken placeholder image links are included. [Capture checklist](docs/screenshots/README.md).

## Development process and assignment alignment

[The chronological development index](prompts/README.md) links the original planning request, critical review, revision, implementation milestones, visual iterations, bug fix, final polish and submission preparation. Records distinguish exact available user prompts from reconstructed summaries. Historical records are preserved as evidence, not rewritten to imply later work was already complete. [Archived PRD](docs/PRD-v3-history.md) and [legacy development README](docs/legacy-development.md) retain earlier decisions.

The original concept was “What Kind of Traveler Are You?” with four personality profiles. The user explicitly approved the later “Where Should You Go Next?” concept with fifteen destinations; the legacy implementation preserves the earlier profiles. The final app retains English content, at least twelve slides (sixteen delivered), seven questions, genuine 3D elements, navigation/progress, personalized results and meaningful offline Python analysis. The original request also mentioned travel-preference facts: the final synthetic chart is demonstration data, **not verified travel-preference research**. If the instructor still requires those facts or the original four-profile output, that needs confirmation against the official rubric. No separate instructor rubric was found in the project.

## Final visual implementation

Question layouts vary across a panoramic choice strip, route selection, calendar, seating tickets, spending rail, packing desk and postcard wall. The enlarged passport supports onboarding. Result artwork uses restrained pointer perspective, a slow 1.2% camera push-in and a faint masked edge layer; the extra image layer is disabled on small screens. Short title/recommendation/attraction entrances do not delay controls. Reduced-motion settings disable these effects. The editorial ending emphasizes the personalized takeaway and existing Restart Quiz confirmation.

The reveal reliability fix treats the foreground layer as optional and updates navigation only after result rendering succeeds. Regression tests cover both reveal buttons, automatic reveal, saved-session recovery and interrupted-render retry. Reload in the same tab and choose Resume to preserve an existing attempt.

## Project structure and preserved work

- `getaway.html`, `css/getaway.css`, `js/getaway*.js`: complete presentation and isolated state.
- `prototype/catalog.json`, `prototype/matcher.js`: approved, unchanged seven-question matching contract.
- `data/getaway-content.json`: 180 editorial activity options across 45 destination areas.
- `assets/destinations/`: preserved artwork, compressed runtime copies and provenance.
- `analysis/`: independent validator/analyzer and synthetic demonstration fixtures.
- `tests/`: regression, full-flow, static and Python tests.
- `PRD.md`: current delivered specification and known limitations.
- `prompts/`: actual request history and clearly labeled implementation summaries.
- `index.html`: preserved legacy twelve-slide personality presentation.
- `prototype/`: preserved earlier isolated work and 3D experiments.
- `docs/legacy-development.md`, `docs/PRD-v3-history.md`: previous README and planning baseline retained for assessment.

## Submission hygiene and remaining items

`.gitignore` excludes private response/output directories, personal downloads, `.Rhistory`, Python caches, environments, dependencies, temporary/log files, local credentials and browser-test artifacts. Synthetic fixtures and the prepared synthetic chart remain includable. Existing source artwork and third-party license/provenance records are intentionally retained; do not remove runtime dependencies simply because they live in `prototype/`. Ignore rules do not remove already tracked files; review the actual staged diff before committing.

Remaining submission steps: add the seven real screenshots, finish the documented browser rehearsal, check any official rubric differences, then commit and push only with authorization. No commit or push is part of this preparation. Current Git history ends at the approved opening-slide redesign; later iterations are documented locally and await publication.
