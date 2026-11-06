> **Latest asset work:** Paris now integrates the supplied Eiffel Tower GLB with a silver finish and original street details. It is a partial preview, not visually verified; animated people/traffic are missing. Rathaus is kept as an unused lighting reference. Tokyo remains blocked on licensed artwork. See [current preview instructions and limitations](prototype/README.md#imported-eiffel-tower-and-rathaus-decision--november-6-2026).

> **Current destination milestone:** PRD 3.1 expands the isolated prototype to fifteen destinations. Paris, Tokyo, Bali and Swiss Alps have immersive WebGL samples; eleven destinations retain fallback results. The original presentation is unchanged. Start with [the scene preview instructions](prototype/README.md#exact-scene-urls) and [source/review limitations](prototype/SOURCES.md). No commit or push is part of this milestone.

# Where Should You Go Next? – Find Your Perfect Getaway

## Approved PRD 3.0 prototype

The new concept has an isolated **slides 4–6 + destination preview** at **http://localhost:8000/prototype/**. Start the local server with the command below, then open that URL. The existing twelve-slide presentation remains at `/` and its code, progress and navigation are preserved.

The prototype adds airplane flight, a freely rotating city, and a suitcase packing interaction for the exact approved **pace** question. Its result combines your three choices with four explicitly labeled editable sample answers, using the exact twelve-destination PRD ranking. It demonstrates attractions and a three-day outline without implementing the remaining result slides.

See [prototype instructions and limitations](prototype/README.md), [browser checks](prototype/checks.html), and [development record](prompts/08-getaway-prototype.md). **61 Node tests passed**, including all existing regressions and the new exhaustive ranking tests. Browser/GPU/layout and Intel MacBook Air performance remain unverified because this session could not bind a local server socket. Nothing was committed or pushed.

The sections below document the preserved legacy presentation and its preceding sample iteration.

A playful, English-language travel presentation for university students. The current review milestone contains **twelve interactive slides with genuine WebGL 2 objects**, including the complete seven-question quiz and personalized result. The project uses HTML, CSS, and JavaScript and needs no build step, npm installation, CDN, or external service to run.

## Preview locally

Open Terminal and run:

```sh
cd /Users/dariapetel/Desktop/codex-practice
python3 -m http.server 8000 --bind 127.0.0.1
```

Keep that terminal open, then visit **http://localhost:8000/** in Chrome, Edge, Firefox, or Safari with WebGL 2 support. If an earlier version is cached, refresh with **Command+Shift+R** on Mac or **Ctrl+Shift+R** on Windows/Linux. Stop the server with Ctrl+C when finished.

If port 8000 is already used by this project's server, reuse its URL. Otherwise choose another port, such as `8001`, in both the command and URL. Python serves static files only; the later quiz-analysis component is not implemented yet. Use HTTP serving for the supported preview workflow.

## Review sample: redesigned slides 4–6

The latest iteration changes only the boarding pass and the first two quiz questions. Existing answers and saved sessions remain compatible; quiz data, scoring, PRD, slides 1–3, and slides 7–12 are preserved.

- **Slide 4:** a large sculpted airplane in sky blue and warm cream. Move the pointer over it, drag on touch, or use arrow keys when the object is focused. Start continues to Q1.
- **Slide 5 / Q1:** a peach miniature city with four route stops. Select a neighborhood, market, saved landmark, or quiet corner; a real 3D marker identifies your choice.
- **Slide 6 / Q2:** a mint backpack with four packing ideas. Drag an item by its dotted handle into the backpack, click/tap the item, or activate its handle by keyboard. A matching 3D keepsake packs into the bag. Canceled drops do not change the answer.

The three main objects follow pointer movement with a bounded, critically damped spring. Touch uses direct dragging; arrow keys provide an equivalent view control, and Home/activation resets it. Reduced motion disables pointer-driven animation and displays keyboard/selection changes immediately. Rendering stops after settling and while the tab is hidden; there are no additional WebGL contexts or external assets. Performance on the target Intel MacBook Air still needs a browser rehearsal.

To jump to the sample, open **http://localhost:8000/#boarding** or choose slide 4 from the overview. Q2 remains gated until Q1 is answered. If a saved-session dialog appears, choose Resume to keep it; then navigate to slide 4. Nothing in this redesign resets stored progress automatically.

## Try the presentation

| Slide | Main interaction |
| --- | --- |
| **What kind of traveler are you?** | Move the mouse over the suitcase for a bounded tilt. Click it, or use **Open my suitcase**, to open its hinged lid and reveal packed objects. Click the suitcase again to close it. Rotate Left/Right and Reset offer keyboard-accessible view controls. After opening, the primary button continues to slide 2. |
| **What draws you in?** | Select a 3D folded map, compass, chair, or coffee cup. The object responds, its card becomes selected, and a short scenario appears. **Explore this mood** carries the selection to slide 3. These are unscored exploratory choices. |
| **Let curiosity pick.** | **Surprise me** spins the globe and cycles through four moods, changing the globe color, companion object, and text. **Next** continues to your boarding pass. |
| **4 — Your boarding pass** | A pointer-responsive 3D airplane introduces the journey. Start opens the quiz; exploring the airplane does not affect answers. |
| **5–11 — Seven choices** | The first two questions use city route stops and draggable packing items. Later questions retain route tickets, sunrise windows, vouchers, conversation cards, and memory postcards. All choices retain native radio selection; Next advances explicitly. |
| **12 — Your travel match** | Immediately see your personality, destination, reasons quoting your own choices, and a three-activity sample day. Review answers, export JSON, or confirm a fresh replay. Scores, tie disclosure, and sources are expandable. |

Back/Next and the grid-shaped overview button provide navigation. Left/Right and Home/End work when focus is outside interactive controls. Native buttons work with Tab, Enter, and Space. Escape closes the overview. Progress accurately shows twelve available slides. The overview unlocks quiz questions in order; keyboard shortcuts and browser history cannot bypass unanswered questions.

**Motion off** stops ambient motion, pointer tilt, and animated transitions; clicks still update the object state immediately. System reduced-motion settings take precedence. Touch users can tap the same controls without needing hover or drag.

## Quiz, recovery, and export

Seven choices add one point each. Ties use Q7, Q1, Q5, Q4, Q2, Q3, then Q6. Choice order is fixed per question and scores remain hidden until results. Results quote one or two of your selected answers and tailor the first activity to your morning preference. This is a playful reflection, not a scientific personality assessment.

Reloading offers **Resume quiz** or **Start fresh**. Answers, current slide, motion setting, attempt ID, and revision are stored only in `sessionStorage` for this tab. Closing the tab may lose recovery. Invalid records offer a clean restart; blocked storage leaves the quiz usable with a notice.

**Export response** requests a local JSON download only after completion. Nothing is uploaded automatically. Repeated unchanged exports have identical content; answer changes preserve the attempt ID and increase the revision. Replay creates a new attempt. Keep participant downloads private and outside Git. See [the shared data contract and destination sources](data/README.md).

The later Python analyzer will read `data/quiz-v1.json`, recompute exported scores, resolve revisions, and generate the chart. The analyzer and chart slide are not implemented in this milestone. Static HTTP serving is separate from that meaningful Python component.

## What makes the visuals actual 3D?

The suitcase, its hinged lid, contents, map, compass, chair, cup, and globe are mesh geometry rendered by the GPU. They use perspective projection, surface normals, rounded edges, material roughness/metalness, GGX-based studio lighting, and a depth-map shadow pass with filtered edges. Opening the suitcase changes the lid's world transform and exposes physical interior geometry.

The implementation uses a small original **native WebGL 2 renderer**, rather than Three.js. This preserves the locally implemented 3D work and avoids the library-download failure encountered during the first redesign session. The underlying rendering approach follows the browser's [WebGL lighting APIs](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL). The initial renderer availability and shader compilation are checked at runtime.

The visible slides no longer use the earlier flat travel artwork. Historical SVG illustrations remain in `assets/illustrations/` but are not used as 3D substitutes; only the favicon remains linked. If WebGL is unavailable or the context is lost, an explicit message appears and the ordinary slide controls remain usable. A fallback is not presented as a successful 3D rendering.

The new slides share one movable canvas and renderer, adding only one context to the six existing opening canvases. The sample adds a sculpted airplane, miniature city, and fabric-style backpack. Later compositions retain their compass, cup, figures, keepsakes, and globe. Pointer input changes the sample models’ actual transforms; later slides retain their existing button rotation. Every composition stays below 50,000 triangles, with projected framing checked through a full turn.

Only the active slide renders; rendering pauses when the browser tab is hidden. Canvases cap pixel density at 1.5. The suitcase uses 30,592 triangles, and the other scenes remain below 50,000 triangles each. Opening the suitcase also adjusts camera framing to keep its lid visible on narrow canvases.

## Tests and verification

With Python 3 and Node.js installed, run:

```sh
python3 tests/check_foundation.py
node --test tests/*.test.cjs
```

For syntax checks, run `node --check` on each file in `js/` and on `tests/browser-checks.js`.

**Latest resumed sample verification, November 5, 2026:** 47 Node tests passed, including exhaustive scoring over all **16,384** possible answer sets; static structure, local assets, selected contrast, JavaScript syntax, and Git whitespace checks passed. New checks cover bounded pointer springs, touch contact/cancellation, reduced motion, keyboard poses, packing drag/drop, no-op revisions, saved-session compatibility, and mesh framing at pointer extremes throughout packing. Integration checks execute the actual shell and quiz UI through a minimal DOM adapter. Geometry checks execute real mesh and projection code; lifecycle checks use a renderer adapter. These do not replace real browser rendering or compile GPU shaders.

The first three slide sections and `css/styles.css` were compared with approved commit `11a67cf` and remain unchanged. PRD.md and previous numbered planning records were preserved.

### Real-browser check page

With the server running, open **http://localhost:8000/tests/browser-checks.html** and click **Run browser checks**. Keep the tab active. Use a separate tab. It temporarily replaces that tab’s saved session and restores it afterward. It reads GPU pixels, checks the opening interactions and all seven quiz scenes, tests answer gating/revision, sample pointer/keyboard poses and packing activation, and context-loss recovery, and checks all twelve layouts at five viewport sizes. The report appears on the page and can be copied. No data is uploaded and no project files are modified.

**Verification limit:** this session denied the local server’s socket bind (`Operation not permitted`). No local preview server could be started, so the browser suite, final GPU appearance, responsive layouts, and cross-browser behavior remain unverified here. Start the server in your terminal and run the browser page before accepting the visual milestone. No screenshot is claimed.

Also manually review:

- Pointer tilt, native keyboard activation, Escape, focus restoration, and screen-reader announcements.
- All twelve slides at 1280×720, 1440×900, 1920×1080, 768 px and 390 px widths, and 200% browser zoom.
- Reload halfway through the quiz, resume, revise an answer, and compare two exported revisions.
- An offline reload with the local server running; result sources open externally only when online.
- Whether the final materials, lighting, type, and motion meet the intended visual quality.

## Scope and files

Slides 1–12 are implemented. This is the quiz portion of PRD milestones M2/M3, not completion of their full-product exit criteria. Slides 13–16 (verified facts, Python snapshot, group tips, recap), Python analytics, bundled display fonts, and final screenshots remain planned. No commit, push, or deployment was performed.

| File | Responsibility |
| --- | --- |
| `index.html` | English content, twelve slides, accessible controls, and seven canvases. |
| `css/styles.css`, `css/quiz.css`, `css/sample.css` | Preserved opening and quiz designs, plus scoped sample styles for slides 4–6. |
| `js/app.js` | Navigation, feedback, suitcase controls, preference selection, and mood flow. |
| `js/sample-interactions.js` | Optional packing drag/drop enhancement backed by the existing radio answers. |
| `js/quiz-core.js`, `js/quiz-ui.js` | Deterministic rules, radio interactions, results, recovery, and export. |
| `data/quiz-v1.json` | Shared versioned questions, mappings, destination content, and source references for JavaScript and future Python. |
| `js/scene-core.js` | WebGL 2 renderer, mesh generation, transforms, lighting, shadows, and explicit diagnostic readback. |
| `js/travel-models.js` | Procedural suitcase and other travel-object geometry. |
| `js/travel-scenes.js` | Visible-scene lifecycle, bounded pointer input, motion, framing, and context fallback/recovery. |
| `tests/` | Static, interaction, geometry, lifecycle, and real-browser checks. |

All runtime scripts are local. Typography uses local system fonts with sans-serif and serif fallbacks; the PRD's Fredoka/Nunito Sans files are not yet bundled. Rendering can therefore vary slightly between operating systems. No proprietary system-font files have been copied into the project.

## University documentation

- [PRD.md](PRD.md) — preserved full-product requirements, including historical approval wording.
- [Planning process](prompts/README.md) — initial request, critical review, and PRD revision.
- [Milestone 1](prompts/04-development-milestone-1.md) — historical record of the first implementation.
- [3D visual redesign](prompts/05-3d-visual-redesign.md) — original request, interruption/resumption, changes, evidence, and remaining review checks.
- [Milestone 2: quiz journey](prompts/06-development-milestone-2.md) — scope, actual prompt, decisions, implementation, and test evidence.

- [Slides 4–6 sample redesign](prompts/07-slides-4-6-redesign.md) — visual direction, interrupted/resumed work, interactions, preservation checks, and verification limits.

The prior planning records and PRD were preserved. Browser screenshots should be added after real-browser visual review; none are claimed here.
