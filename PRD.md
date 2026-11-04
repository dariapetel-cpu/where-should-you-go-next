# Product Requirements Document

## What Kind of Traveler Are You?

**Version:** 2.0 — revised after requirements review  
**Date:** November 4, 2026  
**Status:** Awaiting approval; implementation has not started  
**Audience:** University students  
**Language:** English for all presentation content, documentation, chart labels, and meaningful source comments

## 1. Project overview

Create a premium, playful interactive travel personality presentation using HTML, CSS, and JavaScript, with a meaningful offline Python analysis component. The experience contains **16 slides** and **seven quiz questions**. Participants receive one of four profiles: **The Planner**, **The Adventurer**, **The Relaxer**, or **The Food Explorer**.

The first result screen immediately reveals the personality, personalized destination, and an explanation grounded in the participant's actual answers. It also offers review, export, and replay. Later slides add sourced travel facts, a reproducible Python-generated chart, and practical takeaways, before a final personalized result recap.

The design should resemble a professionally art-directed interactive Canva-style travel presentation: cohesive pastel colors, expressive typography, layered compositions, dimensional travel illustrations, and one impressive, genuinely three-dimensional suitcase. Canva is a quality reference; use an original composition and properly licensed assets.

Python validates browser-exported responses, resolves export revisions, independently calculates profiles, and produces a chart and aggregate data. The browser quiz works without Python running, an application backend, external APIs, or internet access. A local static file server is used for the offline demonstration.

**Current scope of work:** Revise this PRD only. No application code, assets, additional documents, or repository scaffolding are to be created until approval.

## 2. Objectives and scope

| Objective | Success measure |
| --- | --- |
| Meet the assignment | 16 slides, seven questions, four profiles, destination matches, real 3D animation, interaction, progress, Python, and required GitHub evidence. |
| Deliver visual quality | Approved title, quiz, and result compositions; cohesive assets; all slides pass a visual review at demonstration sizes. |
| Provide immediate value | The first result shows the profile and destination together, supported by one or two actual choices. |
| Make participation engaging | Seven distinct question compositions with consistent accessible controls; no scoring labels before results. |
| Enable a reliable live demo | Offline operation, session recovery, deterministic results, local assets, and a rehearsed demonstration. |
| Demonstrate Python meaningfully | A browser export can be analyzed with one documented command, producing verifiable chart and summary outputs. |
| Show iteration | Prompt records, screenshots, testing evidence, and at least three substantive documented improvements. |

Target timing: approximately 3–5 minutes for an individual quiz and 6–8 minutes for the main classroom presentation. Allow a separate 1–2 minute Python workflow demonstration if the course permits; time both during rehearsal rather than promising an untested duration.

In scope: desktop-first presentation with usable narrow layouts, local assets, accessible navigation, quiz state and recovery, results, anonymous export, offline analysis, and documentation. Out of scope: bookings, live prices, accounts, databases, remote analytics, live audience polling, and runtime AI generation. Results are entertainment and reflection, not a validated psychological assessment.

## 3. Target audience

University students may have varied English proficiency, travel experience, budgets, and access needs. Use concise, familiar English, inclusive scenarios, and nonjudgmental profile descriptions. Do not imply that a profile is better than another or that a recommended international destination is affordable for every student.

Lecturers and classmates should be able to assess the frontend interactions, visual design, Python contribution, reproducibility, and documented LLM-assisted iteration. The team must be able to launch, explain, and reset the demonstration with minimal setup.

## 4. Slide-by-slide plan

### Shared interaction rules

Every slide includes Back/Next controls, a labeled slide overview, a visible “Slide X of 16” counter, and a thin visual slide-progress bar. Quiz slides additionally have seven labeled progress segments and “Question X of 7 · Y answered.” Distinguish current position from completed answers; never imply that visiting a question completes it.

The seven quiz screens share clickable single-select answer cards, explicit Next, a Back button, visible focus, and saved selections. Selecting an answer never auto-advances. Required answers gate forward movement. Overview navigation may revisit unlocked slides but cannot bypass unanswered quiz questions or reveal results early. Slides 12–16 unlock when all answers are complete.

| # | Title and content | Composition | Interaction and behavior |
| --- | --- | --- | --- |
| 1 | **What Kind of Traveler Are You?** Title and “Seven questions. Your next travel inspiration.” | Oversized cream-and-ink typography on the left; hero 3D suitcase on the right; layered sky, soft cloud shapes, and restrained ticket details. | Start opens slide 2. Suitcase supports gentle pointer tilt and drag rotation. Motion control and Resume/Start Fresh appear when a recoverable session exists. |
| 2 | **Same Trip, Different Priorities** Introduce structure, discovery, downtime, and food without profile names. | Four staggered illustrated postcards around a small route motif. | Selecting a card reveals a brief travel scenario. Keyboard activation works identically; exploration does not affect scoring. |
| 3 | **Choose Your Travel Mood** Explain that preferences can mix and there are no right answers. | A wide editorial collage of passport, compass, cafe cup, and beach chair, with three short reassuring statements. | A “Surprise me” control cycles through four prepared inspirational captions without changing quiz state. Profile labels and score mappings remain hidden. |
| 4 | **Your Boarding Pass** Explain seven questions, editable answers, immediate result, and optional export. | Three-step boarding-pass composition: choose, discover, explore. | Start Quiz opens Q1. State that choices are kept in this tab for recovery, no account is needed, and nothing is uploaded automatically. |
| 5 | **Q1 — A Free Day Abroad** “You have a free day in a new city. What sounds best?” | Large city-map illustration on the left and a tidy 2×2 answer-card grid on the right. | Select landmarks, exploration, quiet time, or a market. Selected card gets a checkmark and border; the map gains a decorative pin unrelated to scoring. |
| 6 | **Q2 — Before You Leave** “What do you enjoy doing before a trip?” | Open-suitcase 2D illustration above a row of four packing-tag answer cards; wrap to 2×2 on shorter/narrower screens. | Select itinerary, unusual activities, free time, or food research. A small decorative item appears in the suitcase after selection; no dragging is required. |
| 7 | **Q3 — A Change of Plans** “Your original plan falls through. What do you do?” | A route-change ticket at the top with four broad stacked answer cards. | Select a backup, new opportunity, a break, or a cafe/market. A short route-line transition acknowledges selection. |
| 8 | **Q4 — Your Perfect Morning** “How would you begin a day away?” | Warm sunrise gradient and four illustrated window-shaped cards in a 2×2 layout. | Select a planned attraction, new route, slow breakfast, or local specialty. Selected window receives a static sun accent; no essential hover content. |
| 9 | **Q5 — One Small Treat** “You have room in your budget for one extra experience. Which do you choose?” | Cream travel-voucher layout with four equal-size experience tiles and small dimensional icons. | Select cultural visit, outdoor activity, peaceful garden, or cooking workshop. No displayed prices or affordability promises. |
| 10 | **Q6 — Your Group Role** “What role do you naturally take on a group trip?” | Illustrated group conversation on one side; four equal chat-style answer cards on the other. | Select organizer, detour suggester, rest advocate, or food discoverer. Checkmark and plain text identify selection. |
| 11 | **Q7 — The Best Memory** “Which memory would you most like to bring home?” | Four memory postcards on a restrained scrapbook background; slight decorative rotations must not tilt readable answer text. | Select planned sights, a new experience, feeling refreshed, or a dish. “Reveal My Trip” becomes available after all seven answers. |
| 12 | **Your Travel Match** Immediately show personality, destination, actual-answer explanation, and a three-activity sample day. | Hero destination postcard beside a prominent profile title and compact explanation; supporting score details are expandable. | Reveal lasts at most 700 ms and is immediate with reduced motion. Review Answers, Export Response, Play Again, and Continue are available. Scores and profile mappings become visible only now. |
| 13 | **Travel Preferences, Revealed** Three verified facts on planning, rest, and food motivations. | Three polished editorial fact cards with readable attribution and a source-details panel. | Click or use keyboard to reveal facts; source details include title, publisher, date, and URL. Prewritten fact content works offline. |
| 14 | **Our Travel Snapshot** Python-generated distribution chart, table, sample size, and one supported observation. | Large chart on cream with a small “Export → Analyze → Chart” explainer and dataset badge. | Toggle chart/table presentation; table remains accessible. “How was this made?” reveals the prepared workflow. Clearly say the chart is a snapshot, not live audience polling. |
| 15 | **Plan a Trip Together** One practical tip for each traveler type. | Four compact illustrated tip cards, with the user's profile highlighted by label and border. | Select another profile to compare its tip with yours. Prompt: “Which preference would your travel partner add?” Exploration does not alter results. |
| 16 | **Your Next Adventure Starts Here** Final recap of the profile, destination, personalized explanation, and best planning tip. | A clean destination postcard with a small static suitcase signature and spacious closing composition. | Review Answers, Export Response, and Play Again. Optional Return to Chart. End the presentation on this personalized screen. |

The complete destination recommendation is delivered on slide 12; slide 16 is a concise recap, not a delayed reward. Slides 13–15 add learning and discussion without withholding the result.

## 5. Quiz content, scoring, and personalization

### Seven-question answer matrix

Each question contains exactly one option mapped to each profile. The following mappings are implementation data, never shown as labels or profile-colored hints on quiz cards. Rotate option order by a fixed per-question arrangement; keep it stable across visits and recovery. All options within a question receive equal visual weight.

| Question | Planner | Adventurer | Relaxer | Food Explorer |
| --- | --- | --- | --- | --- |
| Q1 | Follow a route of saved landmarks. | Explore an unfamiliar neighborhood. | Find a quiet spot and take it slow. | Visit a market and taste something new. |
| Q2 | Build a simple daily itinerary. | Look for an unusual activity to try. | Leave plenty of unscheduled time. | Save local dishes and places to eat. |
| Q3 | Choose a backup from my saved list. | Follow an unexpected opportunity. | Take a break and reset the day. | Find a nearby cafe or food market. |
| Q4 | Start early with a planned attraction. | Set out on a new trail or route. | Enjoy a slow breakfast and a view. | Try a local breakfast specialty. |
| Q5 | Join a guided cultural visit. | Try a new outdoor activity. | Spend time in a peaceful garden. | Take a local cooking workshop. |
| Q6 | Organize the route and meeting times. | Suggest a spontaneous detour. | Make sure everyone has time to rest. | Help the group discover local food. |
| Q7 | Seeing the places I hoped to visit. | Doing something I had never tried. | Feeling rested and refreshed. | Discovering a dish I want to make again. |

### Deterministic scoring and tie rule

1. Each selected answer adds one point to its mapped profile. Seven complete answers total seven points. Recompute from the answer set after every edit; never increment points on repeated clicks.
2. The profile with the greatest count wins.
3. If profiles tie for the greatest count, use this fixed question priority: **Q7, Q1, Q5, Q4, Q2, Q3, Q6**. Select the profile of the first answer in that order that belongs to the tied set. Every tied profile has at least one answer, so this always resolves the tie.
4. Q7 is prioritized because it directly asks which outcome the participant values most; Q1 then considers the ideal free day, followed by Q5's preferred extra experience. This is a transparent editorial rule for a playful quiz, not a scientific weighting claim.
5. Show tie disclosure in result details, naming the actual deciding question: “Two styles tied. Your answer to ‘The Best Memory’ selected The Adventurer.” Use “Three styles tied” when appropriate. Do not call this the most recently edited preference.
6. Show counts such as “Planner: 3 of 7” after reveal. Do not imply confidence probabilities. Preserve the fixed rule in versioned shared data used by JavaScript and Python.

No extra question is added. Hiding labels reduces priming, but the intuitive choices still make this a transparent entertainment quiz rather than a blind assessment.

### Profiles and destination recommendations

These are proposed educational matches. Verify destination descriptions and suggested experiences before release; do not claim current availability, prices, safety conditions, or universal affordability.

| Profile | Profile message | Destination | Base sample day and tip |
| --- | --- | --- | --- |
| The Planner | “You enjoy turning ideas into a clear, satisfying itinerary.” | Kyoto, Japan | Temple visit, planned neighborhood walk, garden visit. Group nearby stops and leave buffer time. |
| The Adventurer | “You enjoy discovery, variety, and trying something new.” | Queenstown, New Zealand | Scenic walk, lake outing, suitable supervised outdoor experience. Match activities to ability and conditions. |
| The Relaxer | “You value a comfortable pace and time to recharge.” | The Algarve, Portugal | Leisurely breakfast, time by the coast, sunset stroll. Choose one main activity and keep the rest flexible. |
| The Food Explorer | “You connect with a place through its flavors and food traditions.” | Bologna, Italy | Market visit, cooking workshop, regional meal. Check dietary options and leave breaks between food stops. |

Personalization must go beyond a profile label:

- Use one or two actual selected answers mapped to the winning profile, chosen in the fixed question-priority order. Example: “You chose a local breakfast and a cooking workshop, so your trip puts food discovery first.” Quote or accurately paraphrase only choices the participant selected.
- Keep the destination profile-based and state this honestly. Do not imply that budget, travel dates, or location were analyzed.
- Tailor one of the three activities using Q4's morning preference. Each destination's content includes four vetted morning variants: planned cultural start, exploratory walk, leisurely scenic breakfast, and local-food breakfast. The other two activities follow the profile's base itinerary.
- Store explanation fragments and activity variants in shared content rather than generating them with an external service. Both result screens update when answers change.

## 6. Visual design system and quality gate

### Art direction

Use a cohesive soft-clay travel world with layered paper details. Cream reading surfaces, pastel sky layers, dimensional objects, subtle dotted routes, and carefully placed postcards should create depth. Avoid generic full-screen bullet slides, random emoji art, unrelated stock illustrations, and decorating every empty space.

| Element | Specification |
| --- | --- |
| Pink | `#F9DCE7` for warm panels and accents. |
| Lavender | `#E7DFF7` for secondary surfaces. |
| Sky blue | `#DDEFFA` for airy backgrounds. |
| Cream | `#FFF8EE` as the main warm neutral; white may be used sparingly for highlights. |
| Primary ink | `#29243D` for readable copy. |
| Action purple | `#6240A5` for primary buttons and focus accents; verify final contrast pairings. |
| Typography | Locally bundled Fredoka for expressive headings and Nunito Sans for readable body copy, subject to license verification. Limit weights and use system fallbacks. |
| Desktop sizes | Hero 56–80 px, slide titles 36–48 px, body/answers 22–28 px, secondary labels 16–18 px. Scale fluidly without shrinking important copy to fit. |
| Layout grid | 12-column desktop grid, 48–72 px outer margins where space permits, 24–32 px gaps, 8 px spacing scale. |
| Shapes | 20–28 px card corners, pill buttons, restrained ticket cutouts. |
| Shadows | Broad low-opacity lavender-gray contact shadows; one consistent light direction. Avoid heavy black shadows. |
| Layering | Background atmosphere, midground paper/routes, foreground objects/cards. Keep text in uncluttered reading zones. |
| Text density | One main idea per slide; roughly 25–60 words except questions, results, source details, and accessible data. |
| States | Distinct default, hover, keyboard focus, selected, disabled, and error states. Selected answers use a checkmark, border, and text/state semantics. |

### Required visual approval checkpoint

After implementation is authorized, first prepare representative title, question, and result compositions, plus an illustration style sample, for visual review before styling every slide. This checkpoint is part of the proposed process and is not authorization to create those artifacts now.

Visual review must confirm hierarchy, font consistency, coherent object materials, balanced negative space, readable contrast, polished control states, and a recognizable shared design across varied layouts. Inspect all 16 slides together as a contact sheet and individually at desktop sizes. At 1280×720, essential default-zoom content must fit without scrolling; at high zoom and narrow widths, allow vertical scrolling rather than clipping.

### Actual 3D versus 2D artwork

**Actual animated 3D:** The hero suitcase is a real mesh scene rendered in a canvas using a locally bundled Three.js module. Geometry, camera perspective, lighting, and rotation expose real depth. Do not substitute a flat image with a tilt transform and call it the 3D feature.

**2D illustrations:** Passport, compass, food, beach chair, map, and the open-suitcase illustration on Q2 are static raster or vector assets rendered in a matching dimensional style. They may fade or move slightly, but those effects do not constitute 3D geometry. The final-slide suitcase signature and fallback poster are also 2D.

### Hero suitcase specification

- **Geometry:** Rounded rectangular hard-shell body with visible depth, recessed seam, molded vertical ribs, telescoping handle, side handle, four small wheels, luggage tag, and two restrained travel stickers. Bevel edges so highlights look soft. Use original procedural geometry or a licensed locally bundled model.
- **Materials:** Matte blush-pink shell, approximate roughness 0.65 and metalness 0; lavender trim with slightly higher roughness; cream handles; dark plum rubber wheels; satin silver handle rails with approximate metalness 0.7 and roughness 0.3. Stickers are flat paper-like surfaces. Tune these starting values to the approved visual sample.
- **Lighting:** Large soft key from upper front-left, weaker cool fill from the right, subtle warm rim from behind, and a soft ground/contact shadow. Keep highlights broad and readable, with no dramatic black recesses or reflective environment dependency.
- **Camera:** Perspective view around 35–40 degrees field of view, suitcase initially turned about 20 degrees to reveal front and side. Keep the entire handle and wheels inside the canvas at supported sizes.
- **Idle motion:** An approximately 8-second eased oscillation of yaw by ±8 degrees and roll by ±2 degrees, plus a slow vertical float no greater than about 8 screen pixels at desktop size. No continuous full spins or abrupt reversals.
- **Pointer response:** Hover adds a restrained tilt capped at ±5 degrees. Horizontal drag rotates within ±30 degrees of the resting angle; release eases back over approximately 600 ms. Restrict drag capture to the suitcase canvas; never block page scrolling elsewhere.
- **Keyboard/touch equivalent:** Provide labeled Rotate Left, Rotate Right, and Reset View controls. Drag is optional decoration, never required to advance. On touch, keep the rotation bounded and allow vertical scrolling.
- **Motion control:** A persistent Motion On/Off button stops idle motion, pointer tilt, and animated transitions when off. Respect reduced-motion preference by default. Manual rotation controls may change orientation instantly in reduced-motion mode.
- **Lifecycle and fallback:** Animate only while the hero is visible and the page is active. Handle unavailable WebGL or context loss by showing a matching local poster. Quiz controls must load and work independently of scene loading; scene failure must not block Start.
- **Performance budget:** Target smooth motion on the demonstration laptop, cap device pixel ratio at 1.5, keep the scene approximately below 50,000 triangles, and aim for no more than 3 MB of suitcase-specific assets. Verify actual performance rather than treating these estimates as proof.

Slide transitions use coordinated opacity and small translations over 300–450 ms. Card feedback uses 150–220 ms. Avoid long staggered text reveals, flashing, autoplay sound, and animation that blocks input. Reduced-motion mode replaces movement with immediate updates or brief opacity changes.

## 7. Functional requirements and session reliability

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | Render all 16 English slides with varied, coherent layouts and local assets. | P0 |
| FR-02 | Provide Back/Next, overview, visual slide progress, and quiz completion segments. | P0 |
| FR-03 | Support keyboard, pointer, and touch answer selection without auto-advance. Native radio navigation must not trigger slide shortcuts. | P0 |
| FR-04 | Preserve answers, allow revision, gate unanswered questions, and hide scores/profile labels until reveal. | P0 |
| FR-05 | Apply deterministic scoring, tie rules, answer-based explanations, and morning-activity personalization. | P0 |
| FR-06 | Immediately show destination and profile on slide 12; keep slide 16 synchronized. | P0 |
| FR-07 | Provide review, export, and replay on both result screens. Replay confirmation clears the old attempt and opens Q1 with a new ID. | P0 |
| FR-08 | Save and recover the current tab session, including answers and export revision state. | P0 |
| FR-09 | Implement real 3D suitcase animation, optional manipulation, motion controls, and static fallback. | P0 |
| FR-10 | Export only completed responses on explicit action; perform no automatic upload. | P0 |
| FR-11 | Display Python-generated chart and data, sample size, provenance, and snapshot disclosure. | P0 |
| FR-12 | Provide verified facts, source details, accessible content, and reliable offline operation. | P0 |
| FR-13 | Rehearse and document the main presentation and Python demonstration. | P0 |
| FR-14 | Offer fullscreen with graceful fallback when unsupported. | P1 |
| FR-15 | Optional downloadable visual result postcard. | P2 |

P0 is required for acceptance, P1 is polish after core completion, and P2 is optional.

### Session recovery

Use `sessionStorage` for the current tab. Save a versioned record after meaningful answer changes and navigation: quiz/schema versions, response ID, revision, answer map, current slide, reveal state, and motion preference. Recompute scores on recovery; do not trust stored derived results. Saving is local, not a network submission.

On reload, offer **Resume Quiz** and **Start Fresh**. Validate versions, question IDs, option IDs, and reachable slide position before recovery. Corrupt or incompatible state must show a brief explanation and offer a clean restart rather than crash. Incomplete recovered sessions cannot resume into results. Store no names or personal identifiers.

Handle disabled or full storage gracefully: retain in-memory operation and show a nonblocking notice that refresh recovery is unavailable. Explain that recovery is for this tab and does not promise persistence after the tab is closed. Replay/Start Fresh clears the quiz record, creates a new response ID, and preserves only the motion preference if available.

### Navigation and revision behavior

Hidden slides must not remain focusable or exposed as active content to assistive technology. Focus the heading after navigation. A blocked forward action explains “Choose one answer to continue.” Serialize transitions so rapid clicks cannot skip validation or leave overlapping slides.

Review Answers returns to Q1 with selections intact. After initial completion, show a Return to Results control on question slides. Edits immediately recompute both result screens; reviewing without edits leaves the response revision unchanged.

## 8. Technology stack

| Layer | Technology and responsibility |
| --- | --- |
| Structure | Semantic HTML5 for slides, forms, buttons, headings, and result regions. |
| Styling | CSS3 for design tokens, responsive grids, visual states, and transitions. |
| Behavior | Vanilla JavaScript modules for state, scoring, personalization, storage, and export. |
| Actual 3D | A pinned local Three.js module and local scene assets; no CDN or remote environment maps. |
| Shared definitions | Versioned local JSON for questions, option mappings, fixed tie priority, profiles, activity variants, and sources. |
| Analysis | Python 3, standard-library JSON/CSV/argument parsing, and Matplotlib. |
| Serving | Static HTTP server for local presentation; no application API or database. |
| Optional hosting | Static hosting such as GitHub Pages after acceptance. |
| Documentation | Git/GitHub, English Markdown, screenshots, prompt logs, credits, and improvement history. |

Separate scoring, rendering, persistence, export, and 3D code. Pin tested dependencies and document their versions and licenses. Load all required assets locally. The phrase “no backend” means no application server logic; local HTTP serving is still required for modules and JSON loading. Double-clicking the HTML file is not the supported launch method.

## 9. Python analysis, export revisions, and demonstration

### Meaningful contribution

Python must independently validate and score exported answer sets, select the latest valid revision per attempt, deduplicate repeated exports, calculate four-profile totals and percentages, and generate a chart, CSV, summary JSON, and validation report. This is separate from using Python to serve static files.

### Export contract

Each JSON export contains only `schema_version`, `quiz_version`, a random per-attempt `response_id`, positive integer `revision`, seven stable question/option pairs, computed profile counts, winning `profile_id`, and `data_origin` (`participant` or `synthetic`). Exclude names, emails, location, IP addresses, exact timestamps, fingerprints, and free text. Counts must be nonnegative integers and sum to seven.

- A new attempt begins at revision 1. Every actual answer change, including the initial selection of an unanswered question, increments revision; clicking the already selected option does not. Revisions can have gaps in exported files and do not represent question numbers.
- Export is enabled only for complete answers. Export filenames include response ID and revision, for example `traveler-<id>-r8.json`.
- Re-exporting unchanged answers preserves the same ID, revision, and content. Export itself does not increment revision.
- Editing answers preserves the attempt ID and increments revision. Session recovery preserves both. Replay creates a new ID and resets revision state.
- Browser-derived scores are included for verification; Python must recompute and reject mismatches.

### Revision resolution and validation

1. Parse records and validate field types, supported versions, origin, all seven unique questions, allowed choices, and derived results. Booleans must not be accepted as integer counts or revisions.
2. Collapse semantically identical records with the same `(response_id, revision)`; JSON formatting and answer ordering do not create distinct records.
3. Conflicting content under the same ID and revision quarantines that entire attempt and is reported. Never silently choose one conflicting record.
4. For an unambiguous attempt, select the highest valid revision and report lower valid revisions as superseded. Report invalid higher revisions explicitly; if using an earlier valid revision, identify that fallback in the validation report.
5. Reject mixed quiz versions or mixed participant/synthetic origins for a single published chart. Record duplicate, superseded, invalid, quarantined, and accepted counts separately with defined units (records versus attempts).
6. Count each selected attempt once. Include zero-count profiles. Percentages use accepted attempts as the denominator; explain rounding where displayed totals differ slightly from 100%.
7. Exit with an error if no accepted attempts remain. Do not overwrite previously published assets with an empty or partially written result.

The chart describes **quiz attempts**, not verified unique people: retakes have new IDs. Do not claim respondent uniqueness without collecting identity data. A class sample is a convenience sample and cannot represent all university students.

### Output and publication contract

The planned analysis command writes `profile-distribution.png`, `profile-summary.csv`, `summary.json`, and `validation-report.json` to a chosen output directory. Summary metadata includes quiz version, dataset origin, accepted attempt count, profile counts, percentages, and validation totals. The bar chart uses a zero baseline, English labels, count labels, and a dataset badge.

A `--publish` option validates the completed output and copies the matching chart and summary together to `assets/generated/`. Prepare temporary files and replace published artifacts only after successful generation. Include a common analysis identifier in output metadata and the chart caption to detect mismatched assets. The web slide must show an understandable fallback if either asset is missing or mismatched.

Default demonstration data: a committed deterministic synthetic fixture with **20 unique accepted attempts**, expected final distribution **5 Planner, 5 Adventurer, 5 Relaxer, 5 Food Explorer**. Include tied answer sets and superseded/repeated exports while retaining these final totals. Keep malformed/conflicting test fixtures in a separate test folder. Label the slide “Illustrative sample data — not a survey.” Never mix real exports into this fixture.

### Planned commands and live demonstration

The following are command specifications to implement and verify later; these scripts do not exist yet:

```text
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r analysis/requirements.txt
python analysis/analyze_responses.py --input analysis/sample_responses --output analysis/output --publish
python -m http.server 8000
```

The README must include Windows equivalents and the exact tested environment. Dependencies are installed before the offline demo. Open `http://localhost:8000` in the browser. A static hosting deployment can serve the same prepared assets without Python installed.

Required rehearsal sequence:

1. Before class, run the sample analysis, confirm 20 accepted attempts and the expected counts, and verify slide 14 against the CSV/table.
2. Disconnect internet access, launch the static server, and complete the quiz. Show the immediate profile and destination.
3. Export a completed participant response, copy it from Downloads into an ignored local input directory, and run the analyzer on that directory with a separate output path **without `--publish`**.
4. Show the validation report and generated chart for that one attempt; explain that a single attempt demonstrates the pipeline, not a survey finding.
5. Edit one answer, export the newer revision into the same input directory, and rerun. Show that the accepted attempt count remains one and the latest valid revision determines its result.
6. Return to the presentation. Explain that the bundled class/sample chart changes only after an explicit successful publication and reload. Keep the synthetic demonstration assets intact.

Keep the prepared chart available if a terminal demonstration cannot be completed. Document the interruption and use recorded command/output evidence; do not imply that analysis ran live when it did not.

### Privacy

Export and sharing are optional and explicit. No quiz answer is automatically uploaded. Ignore raw participant files in Git, agree on their deletion period before collecting them, and commit only synthetic fixtures and approved aggregate artifacts. The UI states that recovery is local to the browser tab and that exported files contain choices but no requested identifying information.

## 10. Verified travel facts and local content

Slide 13 requires three engaging, verified claims: one about planning/anticipation, one about rest/travel pace, and one about food as a travel motivation. These are research themes, **not facts approved for publication**.

Before content approval, create a source record for each claim with exact proposed wording, supporting passage or finding, publisher/author, source title, URL, publication date if available, access date, and limitations. Prefer original research or a clearly documented survey over unsourced travel blogs. Statistics must identify the sample, population, geography, and timeframe; avoid extrapolating to university students without evidence. Use a supported qualitative statement when a numerical claim would mislead.

Write each fact as approximately 20–35 words plus a concise attribution. Put full references in the source panel and `docs/SOURCES.md`. Verify destination descriptions and all morning variants through appropriate destination or cultural sources. Record verification status; do not ship placeholder claims. If one theme lacks sound evidence, replace it with another supported travel-preference topic and document the change.

Bundle the approved text, attribution, and source metadata locally. Opening an external source URL is optional and may require internet; viewing the presentation does not. Do not bundle copyrighted source articles without permission. Local fonts, illustration assets, textures, 3D dependencies, fallback posters, and chart outputs require recorded licenses/credits and no runtime CDN dependency.

## 11. Accessibility, responsive layout, and offline behavior

- Target relevant WCAG 2.2 AA practices: semantic headings, native radio groups with legends, named controls, visible focus, and logical tab order.
- Set page language to English. Use short, readable copy and consistent profile names.
- Verify contrast: at least 4.5:1 for normal text, 3:1 for large text, and appropriate contrast for meaningful control boundaries and indicators.
- Make answer cards fully clickable without duplicating radio focus targets. Announce selected state and validation. Do not use color alone.
- Expose labeled progress with current and maximum values. Announce result updates politely; do not announce every decorative animation.
- Give informative images meaningful alternative text and decorative assets empty alternatives. Describe the suitcase briefly; its manipulation is optional.
- Make fact reveals, source panels, profile comparisons, recovery prompts, and replay confirmation keyboard accessible. Restore focus when closing a panel.
- Provide a data table and short text summary for the chart. Chart/table toggling must not remove access to the underlying values.
- Honor reduced motion and pause controls; ensure full functionality without animation or WebGL.
- Use approximately 44×44 CSS pixel targets and sufficient spacing. No essential interaction depends on hover, drag, or fine pointer precision.
- Verify default-zoom desktop layouts at 1280×720, 1440×900, and 1920×1080. At 768 px and 390 px widths, stack layouts and allow scrolling with readable controls and no horizontal overflow.
- At 200% zoom, preserve all content and controls using reflow and vertical scrolling. Do not scale the whole presentation into illegible text.
- The complete prepared demo must work without internet after setup. Test with browser cache disabled to prove local assets are sufficient. No external requests should be necessary for the core experience.

## 12. Acceptance criteria

| ID | Acceptance criterion |
| --- | --- |
| AC-01 | All 16 slides and project text are in English and follow the revised outline. |
| AC-02 | Seven questions have four single-select options each, varied compositions, stable order, and no profile/score disclosure before results. |
| AC-03 | Visual slide progress, seven-step question progress, Back/Next, overview, and answer revision work without bypassing completion rules. |
| AC-04 | Known sets produce all four profiles; two-way and three-way ties follow the specified priority and name the deciding question correctly. |
| AC-05 | Slide 12 immediately shows profile, destination, accurate answer-based explanation, three activities including the Q4 variant, and review/export/replay. Slide 16 stays consistent. |
| AC-06 | Approved representative compositions and all-slide review confirm cohesive premium styling, readable text, varied layouts, and consistent illustrations. |
| AC-07 | The suitcase uses actual 3D geometry with specified details, materials, lighting, bounded motion, optional manipulation, and a working local poster fallback. |
| AC-08 | Motion toggle, reduced-motion setting, off-screen suspension, and WebGL failure do not impair navigation or quiz completion. |
| AC-09 | Reload restores validated state through Resume; Start Fresh, corrupted data, incompatible versions, and unavailable storage behave as specified. |
| AC-10 | Unchanged re-exports preserve ID/revision; edits increase revision; replay changes ID. All exports contain only specified fields. |
| AC-11 | Python independently verifies scoring, resolves revisions, reports invalid/duplicate/conflicting data, and reproduces 20 accepted synthetic attempts with 5 per profile. |
| AC-12 | Generated chart, CSV, JSON, and accessible table agree; publication cannot replace good assets after failed analysis. Dataset and attempt-count labeling are explicit. |
| AC-13 | A real browser export and edited revision can be analyzed offline as one attempt using the documented commands. |
| AC-14 | Three fact cards and destination/activity content have verified source records; no unsupported statistics or placeholder claims ship. |
| AC-15 | Keyboard completion, screen-reader checks, contrast, focus, 200% zoom, desktop sizes, and narrow reflow pass. |
| AC-16 | The full local demo works offline with cache disabled, no missing assets, and no required external request or analysis process. |
| AC-17 | A timed rehearsal, Python walkthrough, and failure-recovery rehearsal are recorded; significant defects are resolved. |
| AC-18 | GitHub includes README screenshots, PRD, source, Python, prompt records, sources/credits, tests, and at least three evidenced improvements. |

## 13. Prioritized implementation checklist

### P0 — Required

- [ ] Obtain approval for this revised PRD before implementation.
- [ ] Finalize English copy, verify travel facts/destinations, and record sources.
- [ ] Prepare and review title/question/result compositions and illustration treatment.
- [ ] Define shared question data, fixed tie priority, explanation fragments, and morning variants.
- [ ] Build the 16-slide shell, visual progress, gating, and accessible navigation.
- [ ] Implement quiz selection, scoring, immediate results, review, and replay.
- [ ] Implement session validation/recovery and versioned export revisions.
- [ ] Build and review the real 3D suitcase, motion controls, and fallback.
- [ ] Apply varied question compositions and cohesive locally bundled assets.
- [ ] Implement Python validation, revision resolution, chart generation, and safe publication.
- [ ] Create deterministic synthetic fixtures, integrate chart/table, and verify expected totals.
- [ ] Complete interaction, accessibility, performance, responsive, and offline testing.
- [ ] Rehearse main flow, exported-response analysis, and recovery scenarios.
- [ ] Finish README, screenshots, prompts, improvement log, test evidence, and credits.

### P1 — Polish

- [ ] Add fullscreen support with normal-window fallback.
- [ ] Refine minor motion and decorative details after core acceptance passes.
- [ ] Publish a static preview if required by the course.

### P2 — Optional

- [ ] Add a downloadable result postcard after all P0 requirements pass.

## 14. Implementation milestones

Estimates are planning ranges for a small student team; adjust to course deadlines after approval.

| Milestone | Indicative effort | Exit condition |
| --- | --- | --- |
| M0 — PRD approval | Review session | Scope, scoring, 3D direction, and workflow approved. |
| M1 — Content and art direction | 1–2 days | Verified content, source records, representative compositions, and asset plan reviewed. |
| M2 — Functional experience | 1–2 days | All slides, scoring, results, progress, revision, and recovery operate correctly. |
| M3 — Visual and 3D production | 2–3 days | Cohesive final layouts, actual suitcase scene, controls, fallback, and local assets. |
| M4 — Python workflow | 1–2 days | Revision-aware validation, reproducible fixtures, chart publication, and browser-export demo. |
| M5 — Verification and iteration | 1–2 days | Acceptance tests pass; peer feedback addressed; offline and recovery rehearsals succeed. |
| M6 — Submission readiness | Half to one day | GitHub documentation, screenshots, prompt history, improvements, and final timed rehearsal complete. |

## 15. Testing plan

### Scoring and personalization

- Test unanimous results for each profile, mixed answers, and two-way/three-way ties.
- Include ties where Q7 belongs to the tied set and where it does not; verify later priority entries decide correctly.
- Exhaustively compare JavaScript and Python across all **16,384** seven-answer combinations using shared fixtures or a parity runner; assert one winner and seven total points for every complete set.
- Verify repeated selection adds nothing, editing removes the old contribution, and display order does not affect scoring.
- Verify explanations only cite selected answers and every profile's four morning variants render correctly.
- Confirm scores, profile labels, and profile-coded hints remain hidden during the initial quiz.

### Interaction and recovery

- Test every slide action, fact reveal, comparison, chart/table view, overview lock, Back/Next, review, result return, and replay cancellation/confirmation.
- Test rapid repeated navigation and selections during transitions.
- Reload from an unanswered question, a partially completed quiz, results, and an edited result. Verify IDs, revisions, selections, and result consistency.
- Test storage denied, quota exceeded, malformed state, incompatible versions, and invalid saved slide positions.
- Ensure keyboard radio arrows never trigger slide navigation; test focus after every panel and slide change.

### Export and Python

- Run the complete browser export → Python → chart workflow and repeat after an answer edit.
- Test unchanged repeated exports, revision gaps, multiple valid revisions, conflicting same-revision records, and invalid newest revision with an explicit fallback report.
- Test malformed JSON, unknown fields according to the schema policy, wrong types, booleans as counts, missing/duplicate questions, unknown options, score mismatch, mixed origins/versions, zero accepted attempts, and zero-count profiles. Define the schema to reject unexpected fields rather than silently retaining them.
- Confirm the synthetic fixture yields 20 accepted attempts and 5 per profile after deduplication/revision selection.
- Check totals, rounding, output metadata, chart labels, and CSV/table parity. Run identical inputs twice to verify identical statistics.
- Simulate failed analysis and interrupted publication; prior usable assets must remain intact or the UI must identify a mismatched pair clearly. Test missing-chart and mismatched-summary fallback.

### Visual, 3D, accessibility, and performance

- Review title, all seven question layouts, all four profiles, fact cards, chart, and final recap; inspect both contact sheet and full-size views.
- Check desktop sizes, 768 px and 390 px widths, and 200% zoom. Inspect long answer text and source details for clipping.
- Verify suitcase geometry, material coherence, shadows, bounds, drag reset, keyboard controls, motion off, reduced motion, inactive tab suspension, WebGL failure, and context loss.
- Test current stable Chrome, Edge, Firefox, and Safari where available; record exact tested versions and any coverage gap.
- Complete the experience by keyboard and with VoiceOver or NVDA spot checks. Measure contrast and verify focus, radio labels, errors, progress, result announcements, and chart table.
- Target first-slide controls usable within two seconds on the demo laptop with local serving; load 3D progressively. Record frame behavior, asset sizes, and any noticeable delays.

### Live demonstration and peer review

- Install dependencies in advance, then disconnect internet and disable browser cache. Confirm no CDN, font, image, module, or data dependency breaks the demo.
- Rehearse the main presentation and separate Python walkthrough with timing, export file handling, revised answers, and return to the browser.
- Rehearse reload recovery and 3D fallback; keep a known-good synthetic chart and local assets ready.
- Ask at least three peers to complete the quiz. Record confusing wording, repeated-layout fatigue, unclear progress, result relevance, and perceived visual quality. Document actual changes and retest them.

## 16. GitHub documentation requirements

Planned repository contents after implementation; none are created by this PRD revision:

```text
README.md
PRD.md
index.html
css/styles.css
js/app.js
js/quiz.js
js/session.js
js/export.js
js/suitcase.js
data/quiz-config.json
data/travel-facts.json
assets/illustrations/
assets/fonts/
assets/3d/
assets/vendor/
assets/generated/
analysis/analyze_responses.py
analysis/requirements.txt
analysis/sample_responses/
analysis/output/
tests/
prompts/README.md
prompts/01-planning.md
prompts/02-review-and-revision.md
prompts/03-design-and-implementation.md
prompts/04-analysis-and-testing.md
docs/screenshots/
docs/IMPROVEMENTS.md
docs/TESTING.md
docs/DEMO.md
docs/SOURCES.md
.gitignore
```

### README

Include purpose, audience, features, stack, exact tested setup commands, static launch URL, optional hosted link, repository map, quiz/tie explanation, recovery behavior, Python commands and expected sample totals, and the distinction between real 3D and 2D artwork. Explain that the live browser needs no analysis process and that offline setup requires local dependencies installed beforehand.

Include at least six captioned screenshots: title/3D scene, two contrasting quiz layouts, immediate result/destination, Python chart, and final recap. Link the PRD, demo guide, prompt history, source/asset credits, test report, and improvement log. Document limitations honestly, including sample provenance and non-unique attempt counts.

### Prompt records and iterative improvements

Record material LLM interactions in English, including the original request, critical review, and this revision request. Include date, prompt, response or labeled summary, tool/model if known, human review, accepted/rejected suggestions, and validation. Do not invent missing interactions or expose secrets/personal data.

Maintain at least three substantive improvement entries with issue, evidence, change, verification, and commit or before/after screenshot. This PRD revision can be documented as a planning iteration, but implementation must also record actual visual, functional, or usability improvements. Preserve meaningful Git history rather than fabricating an iteration sequence after completion.

### Evidence and privacy

`docs/DEMO.md` contains timed browser and Python walkthroughs, expected outputs, offline preparation, recovery steps, and fallback procedure. `docs/TESTING.md` records environments, acceptance status, results, and unresolved issues. `docs/SOURCES.md` records fact/destination verification, asset/font licenses, local dependency versions, and generated-asset provenance.

Ignore virtual environments, caches, secrets, local participant input directories, and participant-derived output directories. Commit reproducible synthetic fixtures and demo aggregates. Do not publish raw participant exports. All project documents remain in English.

## 17. Review resolutions and approval checkpoint

| Review weakness | Revision |
| --- | --- |
| Unfinished facts | Defined verification records, credible-source criteria, local citations, and a release gate. |
| Vague premium design | Added layout/type/material specifications, representative composition review, and all-slide visual QA. |
| Underdefined 3D | Specified actual mesh rendering, materials, lighting, geometry, motion, controls, performance, and fallback. |
| Repetitive quiz screens | Defined seven distinct compositions with consistent controls and equal answer prominence. |
| Delayed destination | Moved full recommendation to the immediate result; final slide is a recap. |
| Limited personalization | Added selected-answer reasoning and destination-specific morning variants. |
| Profile priming | Removed profile introductions before the quiz and hid scoring/labels until reveal. |
| Arbitrary/unclear ties | Defined explicit question priority, rationale, and truthful deciding-question disclosure. |
| Disconnected Python chart | Required a browser-export and revision demonstration, reproducible fixture, and explicit snapshot labeling. |
| Ambiguous edited exports | Defined attempt IDs, revision increments, deduplication, latest-valid resolution, and conflicts. |
| Weak demo recovery | Promoted session recovery and timed rehearsals to P0; added offline and failure tests. |
| Numeric-only progress | Added visual slide bar and seven-step completion indicator with accessible labels. |

Remaining approval decisions are the overall visual direction, proposed destination matches, fixed tie rule, and revised scope. Facts and assets must still be researched or produced after approval; this document does not claim that those implementation gates have already passed.

**Approval checkpoint:** Review this revised plan. No application implementation or additional file creation begins until approval.
