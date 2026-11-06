# Product Requirements Document

## Where Should You Go Next? — Find Your Perfect Getaway

**Version:** 4.1 — final implementation and submission baseline
**Date:** November 6, 2026
**Status:** Final sixteen-slide presentation committed and pushed to GitHub. Automated tests passed. Three real browser screenshots are included. Additional browser/device review remains pending.
**Audience:** University students and assessors. All documents, interface content and analysis outputs are English.

This specification records the delivered scope. It supersedes the incomplete-status and proposed implementation sections in [the preserved version 3 planning history](docs/PRD-v3-history.md). The seven approved questions, destination affinities and matching rules are unchanged. The latest instruction prioritizes a complete presentation and existing cinematic imagery over continued isolated 3D asset work.

## Overview and objectives

Deliver one coherent sixteen-slide browser journey from curiosity to an explainable destination recommendation, three relevant attractions, a personalized three-day itinerary, two alternatives and a travel card. The entry point is `getaway.html`. Preserve the original twelve-slide presentation and isolated prototypes as historical work, including their saved progress. HTML, CSS and JavaScript run locally without a backend, login or paid API. Python independently validates and analyzes explicitly exported answers.

The experience is travel inspiration, not a psychological assessment, booking service, live price comparison, optimized route or guarantee of suitability. Target a 4–6 minute classroom journey plus a separate two-minute Python demonstration; these are rehearsal targets, not measured timings.

## Sixteen-slide plan and delivered interaction

| Slide | Purpose | Interaction and visual composition |
| --- | --- | --- |
| 1 | Where should you go next? | Editorial opening, actual WebGL suitcase, pointer rotation and click-to-open hinge; Begin action. |
| 2 | Follow your curiosity | Four unscored mood controls, changing globe and caption. |
| 3 | Make it yours | Enlarged WebGL passport, three-step onboarding, expandable scoring/privacy explanation. |
| 4 | Vacation type | Airplane flies into position; four direct image-card radio choices. No carousel or secondary selection controls. |
| 5 | Interests | Four route stops alongside a rotating miniature destination scene. |
| 6 | Pace | Four distinct day patterns; centered four-column desktop calendar, two columns on mobile. |
| 7 | Companions | Visual seat groups and people-themed 3D object. |
| 8 | Budget | Four-stop slider, collapsed alternative radio choices, spending-style feedback. No live prices. |
| 9 | Packing | Drag a selected essential to the suitcase area or choose it with native controls. Cancel/outside drop must not score. |
| 10 | Dream experience | Four cinematic postcard choices with visible selection. |
| 11 | Matching | Brief visual matching transition; immediate reveal action; no fake network or AI operation. |
| 12 | Destination reveal | Full-screen local artwork, destination name, two actual-answer reasons, expandable score/trade-off/tie explanation. Optional Eiffel 3D study for Paris. |
| 13 | Attractions | Three selectable local areas with activity recommendation and official destination reference. |
| 14 | Three-day itinerary | Keyboard-accessible day tabs, area-based plans, company/budget/packing preferences, expandable complete itinerary. |
| 15 | Alternatives | Next two ranked destinations, distinct imagery and personalized highlights. Winner remains unchanged. |
| 16 | Travel card | Editorial personalized takeaway, PNG card, printable HTML itinerary, response export, prominent Restart Quiz confirmation and Python insights. |

## Functional requirements

Seven single-choice questions; no default answer is silently scored. Forward navigation and chapter access require previous answers. Back navigation and answer revisions remain available. Native controls provide alternatives to dragging; image cards select directly. Scoring is hidden until reveal. The matching screen can be skipped immediately.

Use tab-local namespace `travel-edit.getaway.complete.v1`, schema `getaway-16-v1`. Validate saved shape, answers, revision and reachable slide. Reload offers recovery; invalid records are ignored with feedback; denied storage does not block the quiz. Restart creates a new attempt and resets only this namespace. Legacy and prototype storage are never overwritten.

Explicit JSON export contains no name, email, location, timestamp or user agent. Attempt IDs are random; repeated unchanged exports are identical. Actual answer changes increment the revision and invalidate the prior reveal. The next reveal/export recomputes from current answers. Download is the only transfer; there are no analytics uploads.

## Questions and fixed answer mappings

Each row retains A/B/C/D order. Budget is a preference, not a numeric cost estimate.

| Question ID / slide | A | B | C | D | Weight |
| --- | --- | --- | --- | --- | --- |
| `vacation` / 4 | Coast and beach | City break | Nature and outdoors | Culture and heritage | 5 |
| `interests` / 5 | Food and markets | Art and history | Outdoor exploration | Music and evening life | 4 |
| `pace` / 6 | Slow and spacious | Balanced days | See and do a lot | Leave room for spontaneity | 2 |
| `companions` / 7 | On my own | With a partner | With friends | With family | 1 |
| `budget` / 8 | Keep costs low | Mid-range comfort | Room to splurge | Flexible / not sure | 3 |
| `packing` / 9 | Camera | Walking shoes | A book | Food journal | 1 |
| `dream` / 10 | A sunset by the sea | An iconic cultural landmark | A mountain or nature panorama | A memorable local feast | 4 |

## Fifteen-destination catalog and deterministic scoring

Paris, Rome, Barcelona, London, Amsterdam, Lisbon, Tokyo, Kyoto, New York, Bali, Bangkok, Greek Islands, Swiss Alps, Iceland and Queenstown. Greek Islands uses Naxos as its itinerary base; Swiss Alps uses Zermatt. Each destination has local artwork, three areas, twelve authored activity candidates, alternative support and a complete itinerary.

Each affinity pair below is primary/secondary: primary = 3, secondary = 1, others = 0. Budget D always receives neutral affinity 2. Contribution = question weight × affinity; score is the sum (theoretical maximum 60). Rank by descending score, then selected affinities in order vacation → dream → interests → budget → pace → companions → packing, then ascending stable destination ID. No random tie-breaking. Catalog version `getaway-2.0.0`; matcher version `1.0.0`.

| Destination ID | Vacation | Interests | Pace | Companions | Budget | Packing | Dream |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `paris` | B/D | B/A | B/C | B/A | C/B | A/C | B/D |
| `rome` | D/B | B/A | C/B | D/B | B/A | B/A | B/D |
| `barcelona` | A/B | D/A | C/D | C/B | B/C | A/D | A/B |
| `london` | B/D | B/D | B/C | A/D | C/B | B/A | B/D |
| `amsterdam` | B/D | B/D | D/B | A/C | B/C | A/B | B/D |
| `lisbon` | B/A | A/D | D/B | B/C | A/B | A/D | A/D |
| `tokyo` | B/D | D/A | C/D | C/A | B/C | D/A | D/B |
| `kyoto` | D/C | B/A | B/A | A/B | B/C | A/B | B/C |
| `new-york` | B/D | D/B | C/B | A/C | C/B | A/D | B/D |
| `bali` | A/C | C/A | A/B | B/D | B/A | C/A | A/C |
| `bangkok` | D/B | A/D | D/C | C/A | A/B | D/B | D/B |
| `greek-islands` | A/D | A/B | A/D | D/B | B/C | C/A | A/D |
| `swiss-alps` | C/D | C/B | B/A | D/B | C/B | B/A | C/B |
| `iceland` | C/B | C/B | D/B | A/B | C/B | B/A | C/B |
| `queenstown` | C/A | C/D | C/B | C/B | C/B | B/A | C/A |

All 16,384 answer combinations are tested; all fifteen destinations can win. Independent Python and JavaScript agree on the entire ordered ranking, including scores, for every combination. Reveal quotes the two strongest actual answer contributions. Trade-off uses the weakest non-neutral affinity, with a fixed preference order. Ties are disclosed.

### Personalization

Destination ranking is separate from itinerary generation. `data/getaway-content.json` provides 180 original activity suggestions (four interest categories in each of three areas per destination). Interest selects the primary activity; packing influences secondary activity and personal pauses; pace controls two versus three stops and optional discovery; companions and budget produce practical notes. Vacation, dream, interests and packing determine area order through a stable weighted editorial rule in `js/getaway-content.js`. This is the delivered simpler content rule, replacing the earlier proposed per-activity seven-dimensional rating matrix. It does not alter destination scoring.

Same destination with different interests produces different activity recommendations. Geography is grouped by area instead of promising timed travel routes. Regional transfer notes flag Bali, mountain access and Arrowtown. Suggestions do not assert verified prices, accessibility or opening times. Official tourism references are linked; live verification of individual suggestions remains a follow-up, not a completed research claim.

## Visual design system and rendering

Editorial typography uses Georgia for large expressive headlines and local Avenir/Segoe UI fallbacks for readable controls; no font hotlinks. Dark readable ink with coordinated coral, turquoise, sunshine yellow, sky blue, warm pink, rich green and lavender question backgrounds; cream and warm gold support the ending. Spacious layouts, large borderless heroes, photo-style postcards, calendar rhythms, seating patterns and compact translucent result panels provide variation. Desktop two-column questions become stacked mobile layouts; overflow remains scrollable rather than clipped.

Reuse generated photorealistic destination illustrations as four locally compressed JPEG atlases, about 3.8 MB total. Browser canvas crops them into individual WebP tiles. Original PNGs and checksum/provenance manifest remain local. Images are clearly identified as **AI-generated inspired artwork, not documentary photography**. Atmospheric overlays, pointer parallax and entrance animations provide a cinematic 2.5D destination treatment. This does not claim fifteen navigable WebGL environments.

Actual native WebGL meshes remain for opening/question objects with perspective, lighting, shadows and pointer/keyboard controls. The opening suitcase has pastel shell, metallic fittings and a hinged opening; pointer movement eases to bounded rotations. The airplane makes an entrance on slide 4. The optional Paris viewer retains the imported CC0 Eiffel Tower with silver artistic material and supporting scenery. Rathaus EXR remains unused. Earlier four 3D destination prototypes remain preserved; their visual limitations are not represented as resolved by this release.

## Technology stack

HTML5 provides the sixteen semantic slide sections; CSS handles responsive layouts, editorial styling and reduced-motion-aware effects; plain JavaScript handles navigation, input, tab recovery and downloads. The existing native WebGL 2 renderer powers shared travel-object heroes. Locally vendored Three.js r170 and its GLTF loader support the optional imported Eiffel viewer. Local JPEG atlases are cropped with browser Canvas 2D. Python 3 standard-library scripts independently validate and analyze exports; Node.js runs the JavaScript tests. No bundler, npm installation, pip packages, application backend or runtime recommendation service is required.

## Accessibility and performance

English document language, labeled native controls, semantic headings, slide focus on navigation, visible focus indicators, 44 px controls, a skip link, progress semantics, live selection feedback, modal dialogs and keyboard equivalents. Day tabs implement roving focus and arrow/Home/End navigation. Information is available in text independent of WebGL. Failed WebGL does not block answering. System reduced motion takes precedence over the application toggle.

Use one shared main WebGL context, DPR cap 1.5, 512 px hero shadows and bounded movement. Rendering stops once settled and while hidden; the optional Paris viewer loads on demand and disposes when closed. It uses a 30 fps scheduling ceiling and local assets. No expensive runtime APIs or model downloads from remote hosts. Target Intel MacBook Air 2020 / 8 GB RAM; actual FPS, thermal behavior, touch ergonomics, screen-reader output and rendered contrast remain unmeasured until browser rehearsal.

## Python integration and export contract

Python standard library only. `analysis/analyze_responses.py` reads explicit schema-v2 exports, validates exact versioned fields and canonical answers, independently recomputes all rankings, and rejects tampering. No backend is involved. Group by response ID, use highest valid revision, deduplicate exact copies, quarantine conflicting latest revisions and report invalid files. Invalid higher revisions do not replace valid lower ones and are reported. Reject empty accepted sets without replacing prior output.

Generate `chart.svg`, `counts.csv` and `summary.json`. SVG has a textual title/description; the presentation includes an accessible data table. Each artifact is atomically replaced after validation, but the three-file bundle is not one transaction. Keep participant inputs/outputs in Git-ignored `analysis/local_input` and `analysis/local_output`.

`analysis/generate_fixtures.py` supplies 30 explicitly synthetic responses, two per destination. The final slide displays this prepared dataset, not real student behavior or live polling. Use the README commands to demonstrate browser export → Python validation → chart. Static server use alone does not count as the Python contribution.

## Acceptance criteria and prioritized checklist

- [x] P0: Sixteen English slides and seven fixed question mappings; no dead-end result flow.
- [x] P0: Fifteen reachable destinations with imagery, three recommended areas, personalized three-day plans and alternatives.
- [x] P0: Deterministic scoring, explainable reasons, revisable answers, separate validated recovery and explicit exports.
- [x] P0: Offline local assets and no backend/API requirement.
- [x] P0: Meaningful independently tested Python workflow with synthetic demonstration chart.
- [x] P1: Varied inputs, genuine hero WebGL, image parallax, reduced-motion support and keyboard equivalents.
- [x] P1: Regression tests, actual implementation documentation and preserved historical work.
- [ ] P1: Real-browser visual/GPU verification, target-laptop rehearsal, mobile and assistive-technology checks.
- [ ] P1: Actual browser screenshots for GitHub assessment documentation.
- [ ] P2: Fifteen detailed navigable 3D environments; intentionally deferred in favor of complete cinematic image results.
- [ ] P2: Venue-level research, accessibility verification and richer activity metadata; no claim of completion.

## Milestones and testing plan

1. Preserve and audit existing application, matching catalog, art and previous progress — completed.
2. Connect complete 16-slide flow, question interactions and isolated state — completed.
3. Integrate existing art and all destination content, results and downloads — completed in code.
4. Add independent offline analysis, synthetic chart, automated regression coverage and documentation — completed.
5. Live visual acceptance and classroom rehearsal — pending environment access/user review; no commit or push.

Run all commands in README. Current automated coverage: 93 Node tests, four Python analysis tests, legacy/prototype static checks, and full-presentation static checks. Include exhaustive cross-language ranking parity; complete DOM progression, editing/recovery, range and drag cancellation, itinerary tabs, alternatives and export revision tests. DOM doubles do not establish browser rendering. Validate full flow at desktop/mobile widths, offline, with reduced motion and keyboard only; verify PNG/HTML/JSON downloads, optional imported-model loading, readability and responsiveness on the target laptop. Recheck tests after changes.

The user reported the entire presentation working after the reveal fix. This is user-reported functional review, not systematic browser verification. Assistant tab inspection/capture failed with a browser-tool error; earlier local server/headless-browser attempts were blocked. No assistant browser pass or FPS measurement is claimed. The outstanding manual checks and screenshot capture list are recorded in [the submission review](docs/submission-review.md) and README. Automated failures must be fixed; environment limitations must be reported explicitly.

## GitHub and assessment documentation

Repository retains README, PRD, HTML/CSS/JavaScript, local asset provenance/licenses, Python source, tests, synthetic fixtures and chronological `prompts/` records. README identifies the complete preview URL, controls, analysis commands, checks, genuine 3D versus image treatment and known limitations. Historical PRD/README are preserved in `docs/`. Record exact user prompts only where accessible and label all reconstructed summaries. Add real screenshots after browser rehearsal, never invented screenshots or claims. Ignore private quiz responses, dependencies, virtual environments, caches and temporary files. No commit or push until the user authorizes it.

## Visual revision — November 6, 2026

Keep all sixteen slides and the matching contract. Successive questions use coral, turquoise, sunshine yellow, sky blue, warm pink, green and lavender with dark readable accents. Questions are the focal point; desktop layouts alternate panoramic, reversed split, centered calendar, seating, spending rail, packing and postcard compositions. Mobile layouts stack and preserve native input access. The passport on slide 3 is scaled 3.3× in the shared mesh renderer. Slide 4 has exactly one four-choice answer surface.

Destination results reuse local imagery with a faint masked edge layer, restrained differential pointer movement, bounded perspective, a slow 1.2% push-in over twelve seconds and limited atmospheric-light cycles. The additional image layer is disabled on mobile. Titles, recommendations and attraction panels enter briefly without delaying controls. The final slide uses an editorial travel card and an obvious Restart Quiz button. This lightweight approximate depth treatment does not infer real geometry. Strongly opaque information panels remain readable. Both system and application reduced motion disable the cinematic transforms. No new assets are required. The existing renderer and all legacy work are preserved; browser visual acceptance remains pending.

## Final submission requirements and evidence

The main assessment entry point is **`getaway.html`**, served through the README local-server command. `index.html` remains the earlier twelve-slide personality presentation; it is intentionally not redirected or removed. Opening the server root therefore does not show the final experience. GitHub Pages or another hosted deployment is not part of the current delivery.

README includes portable setup instructions, the complete flow, seven question topics, fifteen destinations, explainable personalization, Python input/output steps, privacy, limitations and development chronology. The prompts index organizes the available records and distinguishes verbatim prompts from summaries. Tests currently pass: 93 Node, four Python and three static check scripts, including the result-transition regressions.

Seven real screenshots are still required: opening, selected vacation question, destination result, attraction details, expanded itinerary, personalized ending and synthetic Python insights. Exact filenames and capture instructions are in README and `docs/screenshots/README.md`. No screenshot assets or browser passes are fabricated.

The supplied assignment requirements are available through the original user prompt; no separate official rubric is stored here. The user approved changing the principal result from four profiles to fifteen destinations. The synthetic analysis chart is not factual travel-preference research; the final flow does not supply a separate verified preference-fact segment. Confirm those differences if the instructor's rubric retains the original requirements. Fully modeled destination worlds are not required by the approved final 2.5D direction.

Private data, local histories, credentials, temporary files and test artifacts are excluded by `.gitignore`; synthetic evidence, runtime source assets and provenance remain includable. Final code and later development records are not yet committed/pushed. Submission publication requires a reviewed commit and authorized push after screenshots/rehearsal; this preparation does neither.
