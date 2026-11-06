# Product Requirements Document

## Where Should You Go Next? – Find Your Perfect Getaway

**Version:** 3.1 — fifteen-destination immersive revision; seven questions unchanged from 3.0

**Date:** November 5, 2026

**Status:** New product direction approved; this detailed specification awaits approval before implementation

**Audience:** University students and university assessors

**Language:** English throughout the presentation, documentation, source-facing explanations, exports and Python outputs

**Current authorized change:** PRD.md only. Preserve the existing application, assets, tests, documentation, saved-progress mechanisms and Git state. No implementation, commit or push in this planning step.

## 1. Overview and objectives

Build a sixteen-slide, editorial travel experience that turns seven choices into a personalized getaway: a destination, three relevant attractions, a three-day itinerary, two alternatives, and a final travel card. The central promise is **travel inspiration based on expressed preferences**, not a psychological diagnosis, guaranteed affordability, a booking service, or an objectively perfect destination.

Use the existing HTML, CSS and JavaScript application and genuine native WebGL 2 renderer. Large, borderless travel objects, responsive movement, expressive typography, varied input methods and restrained cinematic transitions should make the experience feel like an interactive travel magazine. Retain the presentation format and the ease of a classroom demonstration.

A deterministic, versioned matching system ranks **twelve curated destinations**. Every recommendation can be explained from the actual answers. No runtime LLM, external recommendation API, geolocation, login, analytics upload or application backend is required. A local static HTTP server serves the presentation offline.

Python makes a separate, meaningful contribution: independently validate and recompute exported matches, resolve edited/duplicate attempts, analyze destination distributions and question sensitivity, and generate a chart plus accessible data. Demonstrate the browser-export-to-Python pipeline without requiring Python analysis to be running during the presentation.

| Objective | Measurable outcome |
| --- | --- |
| Complete university presentation | Exactly 16 English slides, seven distinct interactive questions, actual animated 3D, visible progress, Python analysis, documentation and iterative evidence. |
| Clear personalized value | Slide 12 names the destination immediately and gives two answer-grounded reasons; slides 13–16 expand the same result. |
| Explainable recommendations | Fixed catalog, integer scoring, explicit tie-breaking and JavaScript/Python parity. |
| Visual variety | Seven genuinely different input patterns; large objects appear in editorial space rather than repeated bordered canvas cards. |
| Reliable demonstration | Offline runtime, editable answers, validated recovery, explicit export, fallback behavior and rehearsed reset. |
| Preserve investment | Extend the existing renderer, models, navigation, recovery and test architecture; migrate safely instead of restarting the project. |

Target a 4–6 minute participant journey and a separate 1–2 minute analysis demonstration. These are rehearsal targets, not measured timings. The latest direction replaces the four personality profiles as the principal outcome; their old scoring system remains intact in the existing code until an approved migration. Do not require the new design to keep old profile labels or the previous fixed profile-to-destination mapping.

## 2. Audience, scope and product boundaries

Students may have different English proficiency, budgets, mobility needs and travel experience. Use short familiar phrases, equal prominence for all choices and no judgment about spending or companions. No recommendation may imply that selecting family, solo or a particular packing item establishes age, income, ability or identity.

In scope: sixteen slides, seven single-choice questions with varied interaction methods, twelve curated destinations, personalized activities and itineraries, two ranked alternatives, a downloadable/printable travel card, explicit response export, recovery, offline assets, analysis and assessment evidence.

Out of scope: booking, payment, live prices, real-time opening hours, route optimization, flight planning, visa advice, safety guarantees, live audience polling, automatic uploads and AI-generated runtime itineraries. The quiz does not ask origin, dates, total trip budget or accessibility requirements; it must not claim to have considered them. “Perfect getaway” is the title, not a certainty claim.

## 3. Current implementation and migration inventory

### Inspected baseline

The current working tree contains twelve implemented slides, including a complete **legacy personality quiz** and the resumed slides 4–6 visual sample. Existing functionality includes native WebGL objects, navigation, slide/question progress, seven original questions, four profile results, editable answers, explicit JSON export, versioned tab recovery, reduced motion and replay.

Files already available include `index.html`, `css/styles.css`, `css/quiz.css`, `css/sample.css`, `js/app.js`, `js/scene-core.js`, `js/travel-models.js`, `js/travel-scenes.js`, `js/quiz-core.js`, `js/quiz-ui.js`, `js/sample-interactions.js`, `data/quiz-v1.json`, tests, README and prompt records 01–07. There is no implemented analysis directory or Python product workflow. The Python static test script and static HTTP server are **not** the assignment's meaningful analysis component.

The latest recorded baseline has 47 passing Node tests, including exhaustive legacy scoring, plus static/syntax checks. Browser visual testing was blocked by the environment's socket permissions; final GPU appearance, target-laptop performance, screen-reader checks and cross-browser coverage are not established. Those results validate the old implementation only, not this new specification.

### Existing slide disposition

| Existing slide / ID | Current implementation | Required work in the new flow |
| --- | --- | --- |
| 1 / `welcome` | Interactive pink suitcase and original personality title | Retain mesh/opening behavior. Replace title and onboarding copy; extend pointer/touch treatment and remove the framed-stage visual treatment after review. |
| 2 / `priorities` | Four explorable 3D preference objects | Retain unscored exploration mechanics and reusable objects. Recompose into a borderless editorial onboarding scene; no hidden quiz answer may be assigned here. |
| 3 / `mood` | Globe, four captions and Surprise me | Retain unscored interaction. Add concise new-flow guidance and Start; this absorbs the previous boarding instructions. |
| 4 / `boarding` | Sky/cream airplane departure sample | Reuse airplane/materials/spring input for new Q1, vacation type. Old boarding screen is no longer a separate slide. |
| 5 / `q1` | Peach city model and route-stop answers | Reuse city/marker interaction for new Q2, interests. Replace answer meanings and IDs under the new version. |
| 6 / `q2` | Mint backpack with draggable packing ideas | Move the reusable model and drag enhancement to **new slide 9/Q6**. New slide 6/Q3 needs a travel-calendar pace interaction. |
| 7 / `q3` | Compass and changed-plans answers | Replace content with new Q4, companions; create an interactive seating scene. Retain useful geometry and accessible selection infrastructure. |
| 8 / `q4` | Morning cup/sun and window cards | Replace with new Q5, budget style; create a piggy-bank scene and four-position control. Keep old model available for activity/food visuals. |
| 9 / `q5` | Experience vouchers and passport/compass | Replace with the migrated backpack Q6. Preserve legacy source/history; do not delete reusable assets. |
| 10 / `q6` | Group figures and group-role answers | Replace with new Q7, dream experience, using photo/3D scene selection. Figures may be reused for companions. |
| 11 / `q7` | Best-memory question | Convert to the destination-matching sequence. The new seventh question is on slide 10. |
| 12 / `match` | Four-profile destination result and one-day sample | Retain result/review/export scaffolding. Replace result data, explanation, hero treatment and links to the personalized follow-up slides. |
| 13–16 | Not present in application markup | Build attractions, three-day itinerary, two alternatives, and final travel card/restart. |

All new matching data, matching animation, fifteen complete destination content bundles, three-day composition, alternatives, travel-card export and Python analysis are unfinished. Some reusable mechanisms exist; none of the new sixteen-slide flow is accepted merely because an old slide has similar content.

### Preservation and versioning requirements

- This PRD edit changes no application behavior. Existing uncommitted work must remain intact.
- After approval, retain `data/quiz-v1.json` and the legacy scoring tests as historical/compatibility fixtures. Introduce a separate versioned destination catalog and matcher rather than silently changing v1 semantics.
- New question IDs are semantic (`vacation`, `interests`, `pace`, `companions`, `budget`, `packing`, `dream`); do not reinterpret old `q1`–`q7` values.
- Use a new storage key, such as `travel-edit.getaway.v2`, and export schema 2. Never overwrite `travel-edit.quiz.v1` when starting the new experience.
- If only a legacy session exists, explain that the questions have changed. Offer **Start new getaway** and, for a complete valid legacy attempt, **Download previous response**. Preserve the legacy record until the user explicitly clears it; partial old progress stays recoverable through a labeled **Continue previous quiz** link to a retained `legacy.html` entry with its compatible v1 UI/rules. Create that compatibility entry only during the approved migration, not this PRD edit. Do not falsely offer to resume an old answer set into the new questions.
- Current-version sessions resume normally. Restart affects only the active new attempt. Handle old numeric/hash links through explicit redirects to the intro or recovery screen, not by guessing a new question from an old slide number.

## 4. Complete sixteen-slide experience

Every slide has a consistent Back/Next location, an accessible overview and “Slide X of 16” progress. Questions have a separate completion indicator: “Question X of 7 · Y answered.” Selection does not auto-advance. A choice is required before moving beyond that question. The overview and history cannot bypass incomplete answers.

Each screen has one headline, one brief instruction, one visually obvious interaction and one primary forward action. Secondary actions and explanatory text use a consistent quieter treatment. Contextual source and scoring details stay expandable.

| # | Screen and concise content | Editorial composition / actual 3D hero | Input, feedback and forward action |
| --- | --- | --- | --- |
| 1 | **Where Should You Go Next?** Subtitle: “Find Your Perfect Getaway.” Instruction: “Open a world of possibilities.” | Oversized title across warm cream; large borderless suitcase overlapping the composition, with real lid/interior geometry and contact shadow. | Pointer-responsive pose, touch drag, keyboard pose/open controls. Primary **Begin the journey** opens the suitcase and proceeds, without requiring an extra exploratory click. Resume appears only when applicable. |
| 2 | **Follow your curiosity.** “Explore a travel mood.” | Spacious travel-magazine spread; one enlarged selected object, with compact selectors for ocean, city, outdoors and culture. | Selecting a mood swaps the hero object and a short caption. All exploration is unscored. **Keep exploring**. |
| 3 | **Your next escape starts here.** “Seven choices. Make them yours.” | Airy globe/passport onboarding, three short labels: choose, match, explore. | A guided pointer/touch/keyboard demonstration with a skip-equivalent Start action. Explain editable answers, local tab recovery and optional download in a compact disclosure. **Find my getaway** opens Q1. |
| 4 | **What kind of escape calls you?** “Choose your vacation scene.” | Sky-blue airplane above a horizontal carousel of four dimensional scenes: coast, city, outdoors, culture. Large object extends beyond the scene layout without a canvas border. | Swipe/drag previews; only **Select this scene** or an equivalent radio selection commits. Previous/Next scene buttons and keyboard radio choices provide alternatives to dragging. Main **Continue** requires a selected scene. |
| 5 | **What draws you in?** “Choose the stop you would visit first.” | Peach miniature destination district: market, gallery, trail and evening venue. Four labeled DOM hotspots sit alongside the 3D scene, never as inaccessible canvas-only text. | Choose a map stop; a real 3D marker and a short caption acknowledge it. Native radio options remain available in a compact route list. **Continue**. |
| 6 | **What is your holiday rhythm?** “Choose the day that feels right.” | Butter/cream three-dimensional desk calendar; four distinct day patterns on a timeline, with open space, balanced stops, busy stops or flexible anchors. | Select one calendar pattern. The same illustrative day rearranges to demonstrate the pace; the question does not collect travel dates. Native radio/timeline controls; **Continue**. |
| 7 | **Who is coming along?** “Choose your travel company.” | Coral editorial spread with a dimensional hotel lounge or train-table scene; seating silhouettes expand from one to a group. | Select a seating arrangement: solo, partner, friends, family. Tap/click or keyboard; no drag required and no inferred ages. **Continue**. |
| 8 | **How would you like to spend?** “Choose a budget style.” | Mint piggy bank, coins and a large four-stop horizontal rail; no currency counter, fake price quote or implied financial precision. | A discrete four-position range input with labeled buttons: value, comfort, splurge, flexible. Arrow/Home/End keys work; initial visual position is explicitly unselected until a user choice. Coin movement acknowledges the choice. **Continue**. |
| 9 | **What goes in first?** “Pack one travel essential.” | Warm cream/backpack hero with sky/coral packing items arranged as objects, not another answer-card grid. | Drag one item into the bag or select/activate it: camera, walking shoes, book, food journal. Exactly one choice; changing it replaces the prior item. Cancel/outside drop changes nothing. **Continue**. |
| 10 | **Which moment would you bring home?** “Choose your dream experience.” | Large photographic/3D editorial postcards for sunset coast, iconic landmark, mountain view and a local feast; licensed local photos are explicitly 2D behind genuine 3D objects. | Select a photo postcard; a scene aperture expands and a check/label marks the choice. Keyboard selection is equivalent. **Find my match** appears enabled when all seven are complete. |
| 11 | **Finding your kind of getaway.** “Your choices, brought together.” | A short object-led sequence: packed item → route line → destination silhouette. A readable three-step status accompanies the visuals. | Calculate synchronously before the animation; say “Comparing your preferences”, not “Searching live flights” or “Using AI”. 1.2–1.8 seconds maximum, **Show my match now** always available, immediate for reduced motion. Proceed exactly once; no artificial network wait. |
| 12 | **Your next stop: [destination].** “Here’s why it fits.” | Full-viewport destination environment with recognizable scenery, floating city/region name, compact answer-grounded reasons and a trade-off. The shared scene supports attraction focus and a collapsible itinerary; no article-style final reveal. | Show destination and explanation immediately. Expand **Why this match?** for contributions/ties. **Explore your highlights** is primary; Review answers and Export response are secondary. |
| 13 | **Three places, picked for you.** “Explore your highlights.” | Three local attraction stops around one landmark/food/nature object; the first highlight is expanded by default. | Select a stop for its verified description, relevance, source and accessibility-information link. Three deterministic personalized attractions; no booking actions. **See my three days**. |
| 14 | **Three days, your way.** “Choose a day to explore.” | Editorial day tabs or a foldout route calendar; one day visible with a sculpted route/transport object. | Select Day 1/2/3. Display curated activities, breaks and optional alternatives at the selected pace. Accessible complete-itinerary text is available. **Explore alternatives**. |
| 15 | **Two more ways to get away.** “Compare your next-best matches.” | Two equally prominent, distinct destination objects in opposing color fields; compact comparable facts and reasons. | Rank 2 and rank 3, never duplicates or random substitutes. Select each to expand “What fits / What differs”. Comparison does not replace the primary match or mutate quiz answers. **Make my travel card**. |
| 16 | **Your next chapter: [destination].** “Keep your getaway inspiration.” | Clean personalized travel card with destination hero, two reasons, three highlights and a compact three-day outline; print/download preview matches the text version. | Primary **Save travel card**, secondary Export response, Review answers and **Start a new getaway**. Restart requires confirmation and creates a new attempt. A quiet **Project insights** control opens Python evidence without adding a seventeenth slide. |

Slide 11 is a transitional screen, not a replacement for real computation. Its animation never blocks results if WebGL fails. Re-entering it after a match has been revealed offers immediate Continue rather than rerunning a mandatory delay. Answer changes cancel any pending reveal callback before recomputing.

## 5. Question contract and answer vocabulary

Each question is single-select with four options. Different interaction methods are views of the same explicit answer state. Hovering, scrolling a carousel, previewing a calendar, rotating an object or comparing destinations does not count as an answer.

| ID / slide | A | B | C | D | Matching weight |
| --- | --- | --- | --- | --- | --- |
| `vacation` / 4 | Coast and beach | City break | Nature and outdoors | Culture and heritage | 5 |
| `interests` / 5 | Food and markets | Art and history | Outdoor exploration | Music and evening life | 4 |
| `pace` / 6 | Slow and spacious | Balanced days | See and do a lot | Leave room for spontaneity | 2 |
| `companions` / 7 | On my own | With a partner | With friends | With family | 1 |
| `budget` / 8 | Keep costs low | Mid-range comfort | Room to splurge | Flexible / not sure | 3 |
| `packing` / 9 | Camera | Walking shoes | A book | Food journal | 1 |
| `dream` / 10 | A sunset by the sea | An iconic cultural landmark | A mountain or nature panorama | A memorable local feast | 4 |

Stable option IDs combine the question and letter, such as `vacation.a`; letters are internal identifiers, not score hints. Preserve published order within a version. Show literal descriptive labels to users. The budget question describes a spending preference, **not a declared amount or a guarantee about a destination's total cost**. Flexible is a real selected answer; it is not a missing value.

The strongest evidence is vacation type, interests and dream experience. Packing and companions are weaker secondary signals, so a symbolic object or group label cannot outweigh the user's explicit interests. Some questions overlap intentionally; explain that this is an editorial preference model, not statistically independent psychological measurement.

## 6. Curated catalog and deterministic matching

### Catalog size and content status

Use the following **fifteen** destinations in catalog version `getaway-2.0.0`, approved in the destination-scene revision. This replaces the former twelve-entry collection; retain the seven questions, weights and deterministic tie rules. Describe results as “best fit in our collection”, not worldwide optimization. Existing prototype answers remain valid and are recomputed against the new catalog; never reuse cached winners. Legacy personality progress stays untouched.

The source pages below are official starting points for attraction verification. The 3.0 sources were reviewed during planning; the 3.1 checks and retrieval limitations are recorded in `prototype/SOURCES.md`. A listed URL alone does not mean every attraction was verified. The scoring affinities are **proposed editorial ratings**, not measurements or claims made by those tourism organizations. They require human content review before release. A source homepage is not sufficient evidence for an attraction's current price, hours or accessibility.

| Stable ID | Destination / itinerary base | Primary source starting point |
| --- | --- | --- |
| `paris` | Paris, France | [Official guide](https://parisjetaime.com/eng/) |
| `rome` | Rome, Italy | [Official guide](https://www.turismoroma.it/en) |
| `barcelona` | Barcelona, Spain | [Official guide](https://thisisbarcelona.com/) |
| `london` | London, United Kingdom | [Official guide](https://www.visitlondon.com/) |
| `amsterdam` | Amsterdam, The Netherlands | [Official guide](https://www.iamsterdam.com/en/see-and-do) |
| `lisbon` | Lisbon, Portugal | [Official guide](https://www.visitlisboa.com/?lang=en) |
| `tokyo` | Tokyo, Japan | [Official guide](https://www.gotokyo.org/en/story/walks-and-tours/best-of-tokyo/index.html) |
| `kyoto` | Kyoto, Japan | [Official guide](https://www.japan.travel/en/destinations/kansai/kyoto/) |
| `new-york` | New York, United States | [Official guide](https://www.nyctourism.com/) |
| `bali` | Bali, Indonesia / Sanur and a separate Ubud day; allow road transfers | [Official guide](https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/bali) |
| `bangkok` | Bangkok, Thailand | [Official guide](https://www.tourismthailand.org/Destinations/Provinces/Bangkok/219) |
| `greek-islands` | Greek Islands, Greece / Naxos only; no island hopping | [Official guide](https://www.visitgreece.gr/islands/cyclades/naxos/) |
| `swiss-alps` | Swiss Alps, Switzerland / Zermatt; alpine access is seasonal | [Official guide](https://www.myswitzerland.com/en-us/destinations/lake-stelli/) |
| `iceland` | Iceland, Iceland / Reykjavík base; distant scenery is illustrative | [Official guide](https://visitreykjavik.is/) |
| `queenstown` | Queenstown, New Zealand | [Official guide](https://www.queenstownnz.co.nz/things-to-do/outdoor-activities/walking-and-hiking/) |

### Complete affinity specification

For each cell below, `A/B` means **3 points of affinity for option A, 1 for option B, and 0 for the other options**. Multiply the selected affinity by the question weight in section 5. Every cell is explicit; no inferred regional defaults or random bonuses are allowed.

Exception: selecting **budget D (flexible)** gives affinity **2 for every destination**, overriding that column's default zero. It therefore contributes the same six points to all destinations and does not advantage one. Budget A–C ratings describe the proposed local experience package (free/low-spend emphasis, comfort mix or special paid experiences), not verified comparative accommodation/flight prices. Never display a destination as “cheap” based on this matrix.

| Destination | Vacation | Interests | Pace | Companions | Budget | Packing | Dream |
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

The seven retained destinations keep their existing affinities. New destinations have explicit editorial ratings above; Iceland retains the former Reykjavík affinities. The JavaScript audit enumerates all 16,384 answer combinations: all fifteen destinations win, with 453–1,625 wins each and 1,406 top-score ties. Per-destination counts and witnesses are in `prototype/catalog-audit.json`. Independent Python parity remains pending. These are editorial package preferences, not comparative price facts or participant statistics. Algorithm version remains `1.0.0`; the changed collection is catalog `getaway-2.0.0`. Existing answer storage is compatible because question IDs and options are unchanged.

### Ranking algorithm

1. Validate that all seven questions have one allowed answer and that catalog, schema and matching versions are supported. Do not rank an incomplete set as a final result.
2. For destination `d`, compute integer contribution `c(d,q) = weight(q) × affinity(d,q,selected_option)`.
3. Compute `score(d) = sum(c(d,q))`. The theoretical maximum is **60**, from weights totaling 20 and affinity maximum 3. Flexible budget contributes 6, not 9. Do not divide by a candidate's personal maximum or round before ranking.
4. Sort descending by total score. For tied totals, compare selected affinity lexicographically in the fixed priority **vacation → dream → interests → budget → pace → companions → packing**; higher affinity wins at the first difference.
5. If the entire comparison tuple ties, sort by stable destination ID using ascending ASCII order. This is an explicit editorial fallback, not a better fit. Never use JSON insertion order, locale-dependent name sorting, click timing or randomness.
6. Rank 1 is the primary destination; ranks 2 and 3 are the two alternatives. All three must be distinct, from the same immutable catalog and answer revision. Equal scores remain visible as ties in expanded details even when ordered by the rule.
7. Recompute from the complete answer map after an edit; never accumulate points from repeated events. Results, attractions, itinerary, alternatives and travel card are derived from the same answer revision.

Example arithmetic: for `lisbon` with answers vacation B, interests A, pace D, companions B, budget A, packing A and dream A, contributions are `15 + 12 + 6 + 3 + 9 + 3 + 12 = 60`. This example explains the formula, not an independent claim of travel suitability. Selecting budget D changes its budget contribution to 6, yielding 57. An already-selected answer or an unchanged export never adds points.

### Explanation and trade-off rules

- Select the winner's two largest positive contributions, breaking equal contributions by the same question priority. Quote or faithfully paraphrase the actual selected answer and explain which local content feature it supports.
- If fewer than two contributions are positive, give the available supported reason and state that the collection is a limited fit; never fabricate a second reason.
- The trade-off uses the lowest-affinity selected answer with affinity below 3, prioritizing vacation, budget, dream, interests, pace, companions, packing on a tie. Budget D is neutral and excluded from trade-offs. If none exists, explain the catalog's limitation instead of inventing a mismatch.
- A tied result must disclose the actual deciding criterion or, if necessary, the stable catalog-order fallback. Do not say the last changed answer broke the tie unless the rule actually selected it.
- Expanded details show all seven contributions and the ranked destination totals. Display points, not “97% accurate” or a probability of satisfaction. No fit percentage is required.
- Alternative explanations use the same selected answers, describe one strength and one difference, and disclose an equal total where relevant. Inspecting an alternative never overwrites the primary result.

## 7. Attractions and three-day itinerary personalization

Each destination needs a locally stored, human-reviewed content bundle before release: display name/country/base, short description, 3D scene/fallback IDs, at least **12 distinct activity records**, sufficient geography-clustered three-day templates, source records and supported explanation fragments. A content build must fail if a required bundle is incomplete; do not quietly remove a destination from a versioned catalog at runtime.

An activity record includes stable ID, title, short summary, destination ID, area/cluster, affinity tags for all seven questions, duration band, spend band (`free`, `low`, `paid`, `premium`, `unknown`), indoor/outdoor flag, effort description, source URLs and reviewed date. Record verified accessibility information or “Check venue accessibility”; never infer access from a model/icon or a family label. Dates, availability and prices are not live.

### Deterministic selection

Use the same weighted affinity formula for eligible activities, with explicit per-activity ratings in the content data and stable activity-ID ties. Destination ranking and activity ranking are separate: a strong activity score must not change the destination winner after reveal.

- **Interests and dream:** prioritize relevant highlights and at least one suitable anchor experience when verified content supports it.
- **Vacation type:** influences environment and area clusters, such as coastal, urban or heritage-focused choices.
- **Pace:** controls required stops per day: slow = 2, balanced = 3, active = 3 plus one clearly optional stop, spontaneous = 2 anchors plus one optional nearby choice. No tightly timed, guaranteed transit schedule.
- **Companions:** adjusts explanatory copy and selects reviewed activity variants that accommodate that group. Do not infer children from “family” or prescribe strenuous activity based on “friends”.
- **Budget:** low-spend packages prioritize verified free/low activities, at most one optional paid activity across three days, and no premium activities. Comfort allows a mixed package; splurge may highlight a premium optional experience without requiring it. Flexible applies no spending filter. `unknown` cost cannot be represented as low-spend.
- **Packing:** a low-weight tiebreaking preference for photo opportunities, walking, reading/rest or food exploration; it is not an equipment adequacy assessment.

Select a pre-reviewed, geographically coherent three-day template that can accommodate the selected pace and spending constraints, maximizing the sum of its eligible activity scores; break template ties by ID. Fill its ordered slots from the associated local cluster, highest activity score then ID, without repeating an activity across required slots. Include breaks and a nearby indoor/rest alternative where reviewed content exists. No unverified cross-region day trips or speculative minute-by-minute travel times.

Slide 13 shows the three highest-ranked distinct required activities from the resulting plan, sorted by activity score/ID; those highlights therefore actually appear on slide 14. Slide 14 opens Day 1 by default, remembers the selected day only as UI state and includes all three days in its text alternative. Viewing days is not a quiz revision.

Content validation must ensure every destination can supply every pace/budget combination. If a filtered plan cannot be fulfilled, block publication and fix the bundle; at runtime, show an honest content-unavailable state with retry/review/export rather than inventing activities. Content drafts are inspiration, not confirmed reservations or a statement that three days covers every destination.

## 8. Editorial Travel visual system

### Composition and typography

Adopt **Editorial Travel**: oversized headlines, expressive but readable typography, confident whitespace, destination typography as a visual element, and one large object leading each scene. Aim for a premium travel-magazine spread combined with a responsive website, rather than repeating boxed slides.

- Dominant hero occupies roughly 45–60% of desktop composition, with adequate text space. Canvas edges blend into the slide background; do not surround each model with a rounded container or visible frame.
- Use layered depth through genuine geometry, contact shadows and object overlap. Decorative overlap must not obstruct copy, focus rings, controls or viewport edges.
- Prefer a locally licensed editorial serif/display face with a clean sans-serif body, at most two families and two weights each. Existing system fonts remain a functional fallback; bundle approved font files and licenses later. Do not copy proprietary fonts from the laptop.
- Desktop title range 48–76 px, question headings 34–48 px, primary option text 18–22 px, body 16–20 px. Avoid meaningful 8–10 px captions. Scale fluidly; permit vertical scrolling at zoom/narrow widths instead of shrinking text to illegibility.
- Keep one instruction, usually under twelve words. Detailed scoring, privacy, sources, Python evidence and activity limitations belong in accessible expandable panels. All essential selection meaning remains visible without hover.
- Use object-led compositions, route lists, calendar slots, seating arrangements, a discrete slider, packing and postcards. Variations are behavioral, not just changing the color of the same four cards.

### Balanced color palette

| Role | Proposed color | Usage |
| --- | --- | --- |
| Warm cream | `#FFF8EE` | Primary neutral and breathing room |
| Sky blue | `#DDEFF7` | Departure / vacation / transport |
| Coral | `#EDA08A` | City energy and companions accents |
| Peach | `#F7DDC9` | Food, interests and cultural scenes |
| Butter yellow | `#F3E3A2` | Pace/calendar and warm highlights |
| Mint | `#DDEBDC` | Budget, rest and nature |
| Lavender | `#E5DDF1` | Secondary accent and selected dreamy scenes, not universal background |
| Primary ink | `#24333D` | Text on pale surfaces |
| Deep blue / terracotta / forest | `#285B73` / `#904632` / `#326552` | Accessible actions and labels matched to slide palette |

Vibrancy comes from contrast between scene palettes, scale and selective saturated object details, not neon surfaces. Keep controls in consistent locations and selected states semantic. Verify final rendered contrast, including gradients, rather than relying only on token pairs. Do not encode an answer's score or destination in its color.

### Genuine 3D and cinematic motion

Keep the original native WebGL 2 approach unless a measured requirement justifies a replacement after review; Three.js is optional, not a new dependency requirement. Meshes must have volume, depth, normals, appropriate roughness/metalness and actual perspective changes. Photos, SVG routes, texture decals and fallback posters are 2D assets and must be documented as such.

Use coherent studio lighting: broad warm key above/front-left, cooler weaker fill, restrained rim, soft contact shadows. Matte ceramic/fabric/plastic bodies contrast with satin or metallic details. Avoid glossy materials everywhere, harsh black shadows and different lighting styles per object.

Every main object in the final sixteen-slide flow supports pointer response without requiring a click. Scope the initial implementation checkpoint to representative scenes before extending all slides:

- Pointer maps to bounded yaw/pitch, approximately ±14°/±8°, plus at most 8–12 px equivalent scene parallax. Use a stable critically damped spring and reset gently on leave.
- Touch uses captured direct dragging on the object surface; outside the surface retain page scrolling. Ignore canceled gestures and never let a view gesture select an answer accidentally.
- Arrow controls or equivalent named buttons provide the same view changes; Home/Reset returns to the initial pose. Hover is not required to understand or complete a question.
- Reduced motion and Motion off disable pointer-following, ambient movement and cinematic transitions. Explicit selections/keyboard poses update immediately. No forced animation, flashing or parallax remains.
- Use 350–650 ms object-led transitions: airplane banks toward the next composition, a city marker becomes a calendar accent, a packed keepsake leads into matching. Reuse object transforms or lightweight overlays; do not require simultaneous expensive scenes. Text fades/moves by at most 12–20 px and becomes readable promptly.
- Queue at most one transition; repeated input cannot skip gates, duplicate answers or create stale results. After completion, focus the new heading. Motion must never delay activation of essential controls.
- Ambient drift is subtle and short-lived or demand-driven. Stop when settled, offscreen or hidden; do not run a permanent decorative loop just to appear animated.

## 9. Functional behavior, progress, recovery and exports

### Navigation and state

Use semantic slide IDs for the new flow, not a blind reuse of old numeric question IDs. Maintain exactly one visible, non-inert slide. A question unlocks only when all earlier questions are answered. Previous unlocked questions remain editable. Slides 11–16 unlock only after seven valid choices.

Store canonical answers separately from UI state such as carousel preview, selected itinerary day, expanded attraction and object angle. Only a committed answer change increments the response revision. An input control may display a preview, but Next remains gated until a real selection exists. A fresh budget slider must not silently submit its centered thumb value.

After completion, Review answers returns to Q1 with selections intact; every question offers Return to results. Changes synchronously recompute the entire personalized chain and invalidate outdated download URLs/render caches. A matching animation tied to an earlier revision must not reveal an old result. Editing does not silently change the attempt ID.

New-session storage retains schema/quiz/catalog/matcher versions, random response ID, positive revision, answer map, semantic current slide, revealed state and motion preference. Validate types, allowed fields/options and reachability on resume; recompute all derived data. Do not trust stored ranking totals. Offer Resume / Start fresh; corrupt or unsupported records get an explanation and a clean-start option. Storage denial/quota failure permits in-memory use and explicit download, with a nonblocking refresh-recovery notice.

New attempts begin at revision 1; every actual answer change, including a first choice, increments it. Seven initial choices therefore produce revision 8. A no-op click, scene preview, card download, alternate comparison or response export leaves the revision unchanged. Restart confirmation produces a new random ID and resets answers/reveal while retaining motion preference if available.

### Schema 2 response export

Export only a complete answer set and only on explicit activation from slides 12 or 16. Use JSON with exactly these fields:

- `schema_version: 2`, `quiz_version`, `catalog_version`, `matcher_version`.
- Random per-attempt `response_id`, positive integer `revision`, `data_origin` (`participant` or deliberate test-only `synthetic`).
- `answers`: seven unique `{question_id, option_id}` pairs in canonical question order.
- `ranking`: all fifteen `{destination_id, score}` records in deterministic rank order.
- `primary_destination_id`, `alternative_destination_ids` (two ordered distinct IDs).

Exclude names, email, origin/location, IP, exact timestamps, free text and device fingerprints. The ID identifies an attempt, not a unique person. Default user exports cannot label themselves synthetic. Do not export inferred sensitive traits or raw browser storage.

Repeated exports of an unchanged attempt are byte-stable under canonical serialization. Keep the existing ignored naming pattern `traveler-<id>-r<revision>.json` so new private responses do not accidentally become trackable. Proposed travel-card files contain no response ID by default and are separate from analysis exports. Document browser download failure and preserve the state when a download is blocked.

### Final travel card

Generate an accessible, locally rendered HTML/print view and a local PNG download from the same derived result. Include destination, two reasons, three highlights and compact Day 1–3 summary; long text wraps and never truncates essential content. No public sharing endpoint is required. A printable/text fallback must remain available if image generation/download fails. All assets used for rendering must be local and licensed so export is not blocked by cross-origin canvas restrictions.

## 10. Meaningful offline Python integration

### Responsibilities and shared data

The analyzer independently reads versioned question/catalog/content JSON and recomputes the fifteen-destination ranking using the exact integer algorithm. It must not import the browser's computed winner as truth or execute JavaScript. Keep the catalog immutable for a published version; changes to affinities or tie rules require a new matcher/catalog version and explicit compatibility handling.

Python validates exports, resolves revisions, produces a horizontal destination-count chart, accessible CSV and JSON summary, and a validation report. Add a small **matching audit** reporting which destinations can win across all 16,384 answer sets and how often changing each question changes the winning destination. This is model sensitivity, not evidence about real travelers or the population.

### Record and revision rules

1. Reject unknown fields, malformed JSON, wrong types, boolean-as-integer values, unsupported versions, missing/duplicate question IDs, unknown answers/destinations, and any mismatch between recomputed ranking and exported fields.
2. Deduplicate semantically identical `(response_id, revision)` records regardless of whitespace or answer ordering.
3. Conflicting valid records with the same ID/revision quarantine the entire attempt. Do not silently pick one.
4. Select the highest valid revision per unambiguous attempt. Report superseded records and invalid higher revisions. If an earlier valid revision is used after a later invalid one, explicitly report that fallback.
5. Reject mixed version tuples or mixed participant/synthetic origin in a published aggregate. Legacy schema 1 may have a separate validator, but must never be combined with new destination data.
6. Count accepted attempts, not verified unique students. Include all fifteen destinations, including zeros. Report records versus attempts as distinct units, and explain percentage rounding.
7. With zero accepted attempts or failed validation/publication, exit unsuccessfully and retain the previous known-good output bundle.

Generate outputs into a temporary versioned bundle, validate chart/table/metadata consistency, then publish atomically by replacing a single manifest pointer. The browser verifies the bundle ID/version across chart and summary; on missing/mismatched assets show a clear unavailable state and keep the quiz working.

### Demonstration and assessment placement

Keep the required slide order unchanged. Slide 16's **Project insights** opens an accessible modal/panel with the pre-generated chart, equivalent table, attempt count, origin badge, version and “Prepared snapshot — not live polling.” It is secondary assessment evidence, not a seventeenth slide and not a replacement for the travel card. A dedicated local analysis report may also be opened from README.

Planned commands, to be implemented and verified later:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r analysis/requirements.txt
.venv/bin/python analysis/generate_fixtures.py --catalog data/getaway-catalog-v1.json --output analysis/sample_responses
.venv/bin/python analysis/analyze_responses.py --input analysis/sample_responses --output assets/generated/getaway-demo --origin synthetic
.venv/bin/python analysis/audit_matcher.py --catalog data/getaway-catalog-v1.json --output analysis/local_output/audit
```

Use standard-library JSON/CSV validation and pinned Matplotlib for charting; install dependencies before the offline demonstration. Document Windows equivalents if tested. These paths/commands are a plan, not claims that the files exist.

Create a deterministic synthetic fixture with **30 accepted attempts**, two witness answer sets per destination, plus separately labeled duplicate/revision/conflict cases. First verify that every destination is reachable; if the proposed catalog fails that gate, revise and reapprove the ratings/version before defining the balanced fixture. Do not invent equal production statistics. The balanced fixture is test data, not real student preferences; sensitivity enumeration has its own unbalanced true totals.

Live demonstration: export one completed browser attempt, change an answer and export again, place both files in an ignored private input folder, analyze as `participant` into an ignored private output folder, and show that the pair resolves to one latest valid attempt. Explain any unchanged winner through changed contributions. Never copy participant responses or aggregates into committed synthetic demo assets without an explicit publication decision.

## 11. Content verification, local assets and offline behavior

For each attraction, factual destination statement and itinerary assumption, record title, publisher, exact URL, publication/update date when available, retrieval/review date, supported claim and local paraphrase. Prefer official tourism boards, venue operators and public authorities. Clearly distinguish source-backed descriptions from editorial affinity ratings and suggested combinations.

Do not ship unverified statistics, exact costs, travel times, opening hours or accessibility promises. Record short geographic/interest facts within attraction details so the university presentation remains informative without inserting a separate facts slide. An external source link may require internet; the locally stored content needed for the demonstration may not.

Use locally packaged models/procedural code, textures, licensed photos, fonts and fallback posters. Record origin, license and attribution for every asset, including generated assets. Never present a generated image as a real documentary photograph. No CDN, remote font, API or analysis request is required at runtime. Service workers are optional; local HTTP plus local assets is the supported baseline and must work with cache disabled while internet is disconnected. Browser DevTools Offline can block localhost too; document the distinction.

## 12. Accessibility and responsive behavior

Target WCAG 2.2 AA practices and verify with actual keyboard and screen-reader use; do not claim certification from automated checks alone.

- Native radio/select/range/button semantics under every custom visual interaction. Label the active choice and instructions; use checkmarks/text as well as color. Dragging always has a click/tap/keyboard equivalent.
- Range control has four explicit values and `aria-valuetext`; keyboard input never triggers slide shortcuts. A separate unselected state prevents accidental commitment of a default value.
- Scored choices are not canvas-only hotspots. Provide equivalent DOM controls, accessible names and source descriptions. Decorative canvas content can be hidden from screen readers; meaningful object manipulation gets named controls.
- Keyboard completion from introduction to saved-card fallback, including modal escape/focus return, carousel preview/commit, slider, packing, attraction tabs, day tabs, alternative details and replay cancellation.
- Focus the new slide heading after navigation, announce concise result/selection status, and keep hidden slides inert. Announce matching once, not every animation frame.
- Text contrast at least 4.5:1 for normal text and 3:1 for large text; focus and meaningful UI boundaries at least 3:1. Minimum intended touch targets 44×44 CSS px.
- Respect system reduced motion and persistent app motion setting. No autoplay audio, flashing, forced drag or hover-only instructions.
- At 1280×720 and normal zoom, primary question/result content and navigation fit without vertical scrolling. Expanded details may scroll. At 200% zoom, 768 px/tablet and 390 px/mobile, allow orderly vertical reflow; never crop text or trap page scrolling inside a hero.
- WebGL unavailable/context loss shows a genuine labeled 2D fallback or text representation and preserves every quiz operation. Do not claim successful 3D rendering when the fallback is active.

## 13. Performance and reliability constraints

Primary reference device: an older Intel MacBook Air with 8 GB RAM, plugged in for a consistent benchmark. Record model/year, OS, browser version, viewport, power conditions and measured results; targets below are not yet proven.

| Area | Target / required behavior |
| --- | --- |
| Interactive load | Core slide controls usable within 2 seconds from a local server on the demo laptop; load heavy objects progressively. |
| Animation | Target a steady 30 fps during pointer/transition motion; prefer consistent frame pacing over 60 fps. Measure slow frames and input latency during a 10-minute run. |
| Scene budget | Prefer one active renderer/canvas for the new flow; preserve existing assets but pause hidden contexts. At most one full-resolution scene renders except a bounded transition. |
| Geometry | Target at most 50,000 visible triangles and 80 draw calls per active scene; simplify complex landmarks. |
| Shadows/effects | One shadow-casting key light, 512–1024 shadow map, no bloom, depth-of-field, realtime reflections or multi-pass postprocessing by default. |
| Pixel/texture budget | Device pixel ratio cap 1.5, adaptive reduction toward 1.0 if sustained frames exceed 40 ms. Textures normally at most 1024 px; preserve readable UI outside canvas. |
| Assets | First-slide runtime transfer target under 3 MB; complete local demo target under 20 MB excluding tests and screenshots. Track actual sizes. |
| Idle behavior | Stop RAF when settled, slide hidden or tab hidden; resume with bounded time steps. Avoid repeated geometry/buffer creation on pointer events. |
| Input | No main-thread task over 100 ms caused by matching; compute 15×7 integer contributions synchronously, outside the animation loop. |
| Longevity | Ten-minute navigation/replay/resize loop has no monotonic growth of graphics resources or listeners; dispose of replaced resources and revoke download URLs. |
| Quality fallback | Reduce DPR/shadows/decoration before compromising labels or interactions. If rendering still fails, fall back gracefully. |

Precompute/reuse procedural meshes, bound all pointer poses, and test geometry against camera/viewport limits. Large objects must not clip when the suitcase opens, an item packs, a pointer reaches its extreme, or a mobile canvas changes aspect. Remove hidden meshes from active rendering, not merely from CSS visibility.

## 14. Technology and file architecture

Retain buildless HTML/CSS/JavaScript and existing modules wherever practical. Do not introduce a framework, backend or remote service to solve a static quiz. Extend the existing pure-rule/browser-bridge separation. New matching rules should accept explicit configuration and state so Node and Python parity tests can inspect them.

Proposed additions after approval:

- Versioned question/matcher definition and `data/getaway-catalog-v1.json`, with the exact matrix, weights, tie order and content version references.
- Destination activity/itinerary bundles and verified source/asset records.
- A new pure destination matcher; UI adapters for the seven interactions and derived result screens.
- Schema-2 recovery/export and a separate legacy compatibility path; preserve old data and rule fixtures.
- Shared scene controller with question/destination-specific models, progressive loading, adaptive quality and fallbacks.
- Python analyzer, matcher audit, synthetic fixtures and generated bundle manifest.
- Tests and documentation additions; use the existing prompts sequence rather than renaming earlier records.

File names may follow existing conventions, but behavior and version boundaries are mandatory. Store content as data, not duplicated prose in JavaScript and Python. A future migration may move code into modules; it must retain a runnable checkpoint and avoid deleting working behavior before its replacement is tested.

## 15. Acceptance criteria

| ID | Required evidence |
| --- | --- |
| AC-01 | Exactly sixteen English slides follow section 4; questions occupy 4–10, matching 11, and destination reveal 12. |
| AC-02 | All seven input methods are visually and behaviorally distinct, single-select, editable and keyboard/touch usable. Preview gestures do not score. |
| AC-03 | Catalog contains fifteen reviewed destinations with complete local content and immutable version IDs; source-backed claims are distinguished from editorial ratings. |
| AC-04 | Every complete answer set has one deterministic rank order, primary and two unique alternatives; scoring/ties follow section 6 exactly. |
| AC-05 | JavaScript and Python agree for all 16,384 answer sets, including ranking totals, tie order and alternatives. Reachability/sensitivity report is reviewed. |
| AC-06 | Slide 12 immediately displays the destination, two supported reasons or an honest limited-fit explanation, and a valid trade-off/tie disclosure. |
| AC-07 | Three attraction highlights occur in the coherent three-day plan; pace, interests, budget and companions influence content as specified. No repeated required activity or invented travel time. |
| AC-08 | Slides 12–16 and downloaded card reflect the same answer revision after any edit. Alternative comparison does not alter the primary. |
| AC-09 | Matching animation is skippable, never exceeds 1.8 seconds, bypasses motion under reduced motion and cannot reveal stale results. |
| AC-10 | Large borderless main objects use actual 3D geometry, bounded pointer/touch/keyboard poses, coherent materials and unclipped framing. |
| AC-11 | Legacy records are preserved and never reinterpreted as new answers. Current-session resume, corrupt state, blocked storage and restart work. |
| AC-12 | Exports have the exact schema; unchanged exports are stable, edits increase revision and restart changes attempt ID. Private data stays out of Git. |
| AC-13 | Python independently verifies rankings, resolves revisions/conflicts and produces matching chart/CSV/JSON/report with explicit provenance. A real edited export demonstrates one accepted attempt. |
| AC-14 | Project insights shows the prepared chart and equivalent table without adding a slide or implying live polling. Failed publication leaves usable prior output. |
| AC-15 | Keyboard/screen-reader, contrast, focus, reduced motion, desktop/mobile and 200% zoom checks pass; unavailable 3D does not prevent completion. |
| AC-16 | Offline runtime and repeated-demo recovery pass; measured target-laptop results meet or explicitly resolve section 13 performance targets. |
| AC-17 | Final travel card downloads locally with matching text/print fallback; no automatic sharing or account requirement. |
| AC-18 | README screenshots, PRD, source, Python, prompt history, sources/licenses, tests and actual improvement records are ready for assessment. |

## 16. Testing plan

### Rules and data

Exhaustively enumerate the four options of each of seven questions (4^7 = 16,384). Compare complete rankings in JavaScript and Python, not only the winner. Test maximum scores, budget-flex neutrality, each tie criterion and final ID tie, data reorder invariance, unknown options, missing answers, non-integer affinities and version changes. Assert fifteen unique ranked IDs and alternatives equal to ranks 2/3.

Generate per-destination winning witnesses and sensitivity counts; inspect concentration without forcing equal outcomes. Check every explanation against actual selected answers and contribution ordering. Validate all fifteen content bundles against pace/budget constraints, sources, geography, required activity uniqueness and highlight/itinerary consistency.

### Interaction and session regression

Exercise every option through its intended interaction plus a non-drag keyboard alternative. Test carousel preview versus commit, untouched budget slider, slider keyboard steps, canceled/off-target packing, drag followed by keyboard input, rapid choices and repeated no-op selections. Ensure history/overview gates and arrow-key exclusions remain correct.

Test partial and completed reloads, answer changes after reveal, return to results, all result-screen updates, replay confirm/cancel, malformed or quota-blocked storage, legacy-session preservation and unavailable compatible content. Cancel timers on navigation/edit/unload; matching cannot run twice or announce a result for an obsolete revision.

### Export and Python

Test canonical serialization, repeat exports, edited revisions, identity reset, duplicate records, conflicting same-revision records, invalid highest revisions and explicit fallback, mixed origin/version rejection, unexpected fields, booleans as numbers and zero accepted attempts. Check chart labels and zero bars, CSV/table totals, manifest consistency, deterministic statistics and failed/interrupted publication. Keep validation errors free of unnecessary participant payloads.

Test the 24-attempt synthetic fixture only after witness coverage passes. Separately run the real browser export → edited export → local Python → one accepted latest attempt workflow. Do not describe a fixture-only test as proof of the real download path.

### Visual, accessibility, graphics and performance

Review a sixteen-slide contact sheet and each slide at 1280×720, 1440×900 and 1920×1080, then 768/390 px widths and 200% zoom. Cover all destination heroes and longest titles/reasons. Check pointer extremes, opening/packing poses, object swaps, DPR changes, texture failures, WebGL absence and context restoration.

Complete by keyboard and with VoiceOver or NVDA. Verify native radio/range semantics, dialog and tab focus, source access, result announcements and card/table alternatives. Measure contrast in rendered states, not only CSS tokens.

Run actual browser GPU/layout checks in available Chrome, Safari, Firefox and Edge; record versions and untested browsers. Measure the reference laptop's frame pacing, first-use delay, memory/resource stability and offline behavior. Automated Node adapters and geometric projection tests are valuable but are not browser screenshots, shader compilation or a performance benchmark.

Ask at least three peers to complete the flow and report unclear actions, layout fatigue, result plausibility and explanation quality. Record concrete changes and retest. Rehearse the browser presentation and separate Python demonstration with a fallback local result/report.

## 17. Prioritized checklist and implementation milestones

All items below concern the new direction; checked legacy features are not automatically accepted for v3.

### P0 — Required

- [ ] Approve this detailed PRD and matrix; preserve a runnable legacy checkpoint.
- [ ] Finalize destination/activity evidence, geographic templates and licenses; complete content validation.
- [ ] Implement new versioned schema, pure matcher, legacy-session handling and exhaustive parity tests.
- [ ] Review representative Editorial Travel intro, question and destination reveal compositions with real 3D.
- [ ] Adapt onboarding and implement seven distinct scored interactions without losing accessibility.
- [ ] Implement matching, reveal, attractions, three days, alternatives and synchronized final card.
- [ ] Preserve navigation, revision semantics, recovery, explicit export and restart behavior.
- [ ] Extend pointer/touch/keyboard motion, resource limits and fallbacks to all final main objects.
- [ ] Implement Python validation, audit, revision resolution, chart publication and insights panel.
- [ ] Complete browser, accessibility, offline, performance and peer-review checks.
- [ ] Update README/screenshots, prompt history, improvement/source/test records and demonstration guide.

### P1 — Polish

- [ ] Refine transitions after reference-device performance passes.
- [ ] Add optional fullscreen with normal-window fallback.
- [ ] Publish a static preview only if separately authorized.

### P2 — Optional

- [ ] Add alternative travel-card visual themes; no extra quiz questions or accounts.
- [ ] Add a downloadable full itinerary PDF only after core local card/text export works.

| Milestone | Deliverable / exit condition |
| --- | --- |
| G0 — Planning approval | Detailed sixteen-slide flow, question semantics, matrix and migration scope accepted. No code changes in this milestone. |
| G1 — Content and rules | Twelve complete reviewed bundles, versioned definitions, reachability audit and exhaustive JavaScript/Python ranking parity. |
| G2 — Editorial sample | Representative intro, two unlike question interactions and destination reveal reviewed with real GPU output and target-laptop measurements. Preserve existing sample assets as reusable work. |
| G3 — Complete frontend | All sixteen slides, seven inputs, personalized result chain, compatibility/recovery, export/card/restart and fallbacks work. |
| G4 — Analysis and integration | Browser export/revision demonstration, synthetic outputs, sensitivity audit and insights chart/table verified offline. |
| G5 — Submission readiness | Browser/accessibility/performance issues resolved or explicitly accepted, peer improvements recorded, screenshots and README complete, timed rehearsal successful. |

Perform implementation in reviewable increments. A later approval to implement a named milestone does not authorize committing, pushing, publishing or expanding unrelated scope unless the user requests it.

## 18. README, GitHub and prompt documentation requirements

The eventual GitHub repository includes README.md with screenshots, this PRD, frontend source/local assets, versioned content, Python source and pinned dependencies, reproducible synthetic fixtures, automated tests, a `prompts/` folder and an evidenced improvement log. Preserve current source/history and existing records; do not fabricate commits or rewrite historical prompt transcripts to match the new product name.

README must explain:

- New title, audience, exact sixteen-slide flow, supported features and honest implementation status.
- Tested static launch command (`python3 -m http.server 8000 --bind 127.0.0.1` from the project), URL, hard refresh, stop command and port-conflict fallback. State that HTTP serving is distinct from Python analytics.
- All seven interactions and keyboard/touch alternatives, motion control, recovery, legacy-session handling, review and restart.
- Catalog size, weights, affinity/tie rules, budget limitations, explanation/itinerary logic and the absence of runtime AI or live booking data.
- Exact tested Python setup/fixture/analysis/audit commands, expected totals, provenance, revised-response demonstration and offline dependency preparation.
- Local asset/source/license map; real geometry versus 2D photos/fallbacks; browser and performance limitations with measured evidence.
- Privacy, ignored participant inputs/outputs, schema versions and the distinction between attempts and people.
- Links to PRD, prompt chronology, sources, tests, demo guide and improvement records.

Include at least seven captioned screenshots: new title, two distinct questions, destination reveal, three-day itinerary, final travel card, and Python chart/insights. Screenshots must come from the actual implementation after review; never label mockups or CPU model previews as browser screenshots. Add mobile evidence where useful.

After implementation is authorized, append a new numbered prompt record after current records 01–07. Preserve the user's new-direction request verbatim where accessible; label reconstructed assistant summaries explicitly. Record purpose, key decisions, source review, rejected alternatives, actual files changed, tests and human review. The 3.0 planning-only restriction is historical. The approved 3.1 milestone authorizes isolated prototype implementation and its documentation; the original presentation remains protected.

Maintain at least three substantive, evidenced improvements spanning design, interaction or reliability, with problem, change, verification and before/after evidence. Preserve earlier work as dated legacy evidence. A future `docs/TESTING.md` should map acceptance criteria to test/environment/results; `docs/DEMO.md` should contain timed browser/Python/offline/failure walkthroughs; `docs/SOURCES.md` should track claims and asset licenses.

## 19. Approval boundary and remaining uncertainties

The user approved 3.0 as the planning baseline and then authorized the 3.1 fifteen-destination catalog and four immersive samples. Remaining scenes await visual approval. Editorial affinities and activity content still require human suitability review before final release.

Source checks support general destination themes; the full attraction inventories, licensed assets, all budget/pace templates, implementation parity/reachability regression and target-laptop rendering still require implementation-stage validation. Existing test successes do not establish those new requirements. The new scoring intentionally changes semantics, so silent conversion of old saved answers is prohibited.

**Current completion:** PRD.md revised only. Preserve the current app and all working features until implementation is approved. Do not implement, commit, push or publish as part of this revision. Summarize the plan and wait for approval.


## 20. Approved immersive destination revision — version 3.1

The user expanded the final collection to fifteen destinations and requested four quality samples: Paris, Tokyo, Bali and Swiss Alps. This supersedes the twelve-destination scope of 3.0, without changing the sixteen-slide structure, seven questions, options, weights, tie rules or legacy presentation. Only the isolated prototype is extended in this milestone. Slides 13–16 are not implemented as separate slides.

### Reusable scene contract

Every catalog ID has a scene registry entry: readiness (immersive or fallback), palette, atmosphere, environmental motion, landmark concept, camera entrance and marker anchors. The shared controller owns one active WebGL renderer, navigation, camera interpolation, projection of accessible marker buttons, reduced motion, context recovery and disposal. Models are procedural indexed geometry with materials and lighting, not flat SVG or CSS illustrations. Four entries supply geometry now; the other eleven remain selectable with working textual results and itinerary. Scene comparison never changes answers or the primary winner.

Full-viewport destination scenes sit behind floating editorial titles and compact translucent panels. Arrival moves the camera into the environment; pointer movement creates bounded parallax, dragging changes the view, arrow keys explore and Home resets. At least three physical 3D markers have equivalent labeled buttons. Selecting one moves the camera and reveals its activity. A collapsible three-day plan and the two ranked alternatives remain available. Avoid flashing signs or forced motion; reduced motion stops ambient animation and makes deliberate view changes immediate.

| Destination | Environment / atmosphere / ambient movement | Status this milestone |
| --- | --- | --- |
| Paris | Eiffel ironwork, Seine, mansard streets and café terrace; apricot sunset, moving river glints | Immersive sample |
| Tokyo | Lantern temple frontage and vertical city signs, crossing; indigo night, slow sign illumination | Immersive sample |
| Bali | Palm-lined beach, ocean and temple-inspired roofs; turquoise morning, waves and palm sway | Immersive sample |
| Swiss Alps | Angular snowy peaks, lake and timber chalets; cool clear daylight, drifting clouds | Immersive sample |
| Rome | Roman arches, stone lanes; golden afternoon, fountain ripples | Fallback pending 3D |
| Barcelona | Architectural spires and coastal promenade; coral daylight, sea movement | Fallback pending 3D |
| London | Clock tower and Thames; blue-grey dusk, river and clouds | Fallback pending 3D |
| Amsterdam | Canal houses and bridges; soft morning, canal ripples | Fallback pending 3D |
| Lisbon | Tiled façades and sloping streets; terracotta afternoon, clouds | Fallback pending 3D |
| Kyoto | Temple roofs and gardens; jade dawn, drifting leaves | Fallback pending 3D |
| New York | Layered skyline and park; cobalt evening, distant traffic | Fallback pending 3D |
| Bangkok | Temple roofs and riverfront; warm evening, river lights | Fallback pending 3D |
| Greek Islands | Naxos lanes and coast; white and Aegean blue, water | Fallback pending 3D |
| Iceland | Volcanic landscape and waterfall motifs; slate sky, mist | Fallback pending 3D |
| Queenstown | Lake, mountain range and town; teal daylight, clouds | Fallback pending 3D |

### Personalization and content truth

Scene appearance identifies the destination; activities and day priorities depend on actual answers, not the scene ID alone. Deterministically prioritize interest, pace, budget, packing, companions, dream and vacation preferences; show the selected answer labels in explanation details. Group each day geographically and disclose transfers for regional destinations. In this three-question prototype, four editable fixture answers remain prominently disclosed. Direct scene URLs are labeled sample previews, never claimed as a user's quiz match. Do not portray compressed scenic compositions as geographic replicas or real itineraries as verified bookings. Full twelve-activity-per-destination authoring, current access/price verification and Python parity remain release gates.

### Milestone acceptance and regression checklist

- [ ] Exactly fifteen catalog entries; all fifteen reachable across 16,384 combinations; original seven question mappings unchanged.
- [ ] Four distinct full-viewport WebGL environments with arrival, pointer/drag/keyboard controls, attraction focus and reduced motion.
- [ ] Eleven functional fallbacks; alternative navigation and return to primary preserve answers and revision.
- [ ] Same destination with different interests/pace/packing yields changed activity priorities and itinerary.
- [ ] No writes to legacy progress; existing prototype answers survive catalog update and recompute safely.
- [ ] Context loss, blocked WebGL, small screens, keyboard, 200% zoom, reduced motion and background pause checked.
- [ ] Cap DPR at 1.5, animation at 30 fps, one active destination renderer; no large models, remote assets, bloom or expensive APIs. Verify actual Intel MacBook Air performance before claiming the target achieved.
- [ ] Document exact local URLs, sources, limitations, test evidence and real user prompt. Stop for visual approval before remaining eleven environments.

Python analysis must read catalog `getaway-2.0.0`, independently recompute all fifteen ranks and include zero-count destinations in its chart. Synthetic balanced demonstration data requires thirty attempts (two winning witnesses per destination). The offline export-and-analyze workflow in section 11 remains the final requirement; a static preview server is not the analytics component.
