> **Current Paris integration:** the supplied Eiffel Tower GLB now loads through local Three.js with an artistic silver finish and original supporting street details. This is a **partial, browser-unverified preview**: animated people and vehicles are missing. Rathaus is documented as an unused night-lighting reference and is never shown as Paris. Tokyo still lacks a licensed street asset and remains explicitly incomplete.

# Where Should You Go Next? — isolated editorial prototype

This review prototype implements **slides 4–6 only**, plus a destination-result preview. The existing `/index.html` presentation, including slides 1–3 and 7–12, is unchanged. No slides 13–16 or complete new results flow have been implemented.

## Preview

From the project root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://localhost:8000/prototype/** and hard-refresh. The original presentation remains at **http://localhost:8000/**. Stop the server with Ctrl+C. If port 8000 is occupied, use 8001 in both the command and URL. No npm installation or build is needed.

## Review the interactions

1. **Slide 4 — vacation:** the actual WebGL airplane flies into its resting pose. Move the pointer over it or drag it. Browse vacation scenes with arrows or swipe the description area, then explicitly select one; previewing alone does not answer the question. Direct radio choices are also available.
2. **Slide 5 — interests:** select food, art, outdoors or evening life. The city marker changes. Drag the model through a full rotation, move the pointer for subtle parallax, or focus the scene and use arrow keys. Home or Reset view restores the pose.
3. **Slide 6 — pace:** pack a day-plan into a real open suitcase using its dotted handle. Click/tap a choice or activate its handle with Enter/Space for the equivalent action. Each item represents one approved pace answer; canceled and outside drops change nothing.
4. **Result preview:** see the ranked destination, contribution-based explanation, three example attractions and a three-day outline. Change days by click or tab-arrow keys. Expand **Sample answers & scoring details** to inspect or change the four demonstration inputs and see all twelve destination scores.

The requested suitcase treatment changes the visual mechanism of PRD slide 6, which proposed a calendar. Its question remains **“What is your holiday rhythm?”** and the four answers remain **Slow and spacious / Balanced days / See and do a lot / Leave room for spontaneity**. It does not substitute the later packing question.

## What the preview does and does not claim

`catalog.json` contains the exact seven-question vocabulary, weights, fifteen-destination affinities and tie priorities from PRD 3.1. Only the first three questions are implemented as slides. The four remaining answers are **explicitly labeled editable sample fixtures**, not silently inferred answers. The preview combines those fixtures with the actual three choices and uses the full deterministic ranking.

The attractions are a small illustrative content set, three per destination. Interest changes their order; pace changes required/optional stops, companions change planning notes, and a low-budget choice changes entry suggestions to surrounding-area exploration. This is a **draft outline**, not the full source-reviewed twelve-activity-per-destination itinerary system specified for later milestones. It does not validate dates, travel times, prices, booking availability or accessibility. The source link points to the destination's official guide. Guide URLs/general themes were reviewed November 5, 2026; complete attraction-level sourcing remains a release gate.

Source starting points are recorded per destination in `catalog.json` and in PRD section 6. No external images, fonts, models or runtime APIs are loaded. The miniature city is illustrative, not a replica of the recommended destination.

## Isolation and progress

The prototype writes only `travel-edit.getaway.prototype.v1` in this tab's `sessionStorage`. It does not read, convert, overwrite or clear `travel-edit.quiz.v1` or the future `travel-edit.getaway.v2` key. Reload offers Resume or Start prototype again. Starting fresh affects only the prototype. Storage failure leaves the in-memory experience usable. No responses are uploaded or exported as real participant records.

The prototype has its own Back, overview, progress and browser-history handling. Unanswered questions gate forward movement. The legacy presentation's navigation and saved-progress behavior remain unchanged.

## 3D and performance

The prototype reads the existing renderer and models without modifying their source or shared materials. Its scene director adds airplane entrance motion, 550 ms object-arrival transitions, damped pointer response, unrestricted city drag rotation and a real day-plan mesh entering the suitcase. Suitcase materials are locally overridden to terracotta, teal and linen.

One WebGL context, a 512 px shadow map, pixel ratio capped at 1.5, approximately 30 fps while animating, cached base meshes and fewer than 50,000 visible triangles keep the intended workload bounded. Rendering stops after settling, in the background, and on the text-based result preview. Reduced motion skips the airplane entrance and pointer motion; explicit keyboard poses and selection feedback remain usable. A WebGL failure exposes a message and preserves the full question/result workflow.

These are implementation limits, **not a measured Intel MacBook Air 2020 benchmark**. Final frame pacing, thermal behavior, GPU appearance and memory stability require testing on that device.

## Tests

From the project root:

```sh
node --test tests/*.test.cjs
python3 tests/check_foundation.py
python3 tests/check_prototype.py
```

Recorded for this increment: **61 Node tests passed**, both Python static checks passed, all twelve application/browser-test JavaScript files passed syntax checks, and whitespace checks passed. New tests cover:

- Exact PRD labels, weights and affinities; full-ranking equivalence over all 16,384 answer combinations.
- Neutral flexible budget, selected-answer explanations and pace-dependent days.
- Preview versus commit, gated navigation, packing cancellation/drop, fixture isolation, revisions and recovery.
- Legacy namespace preservation, loading failure and invalid stored state.
- Flight entrance/idle behavior, free city rotation, keyboard/reset, reduced motion, context recovery, visibility and narrow-camera framing/triangle limits.

UI tests use a minimal DOM adapter; scene tests execute real model geometry with a renderer adapter. They do not establish real browser/GPU success.

For real browser checks, open **http://localhost:8000/prototype/checks.html** in a separate active tab and click Run checks. It exercises real GPU pixels, input/result flow and layouts at five sizes, temporarily preserving/restoring that tab's prototype session. It checks that existing storage namespaces remain unchanged.

**Unverified:** the environment denied local server binding with `PermissionError: Operation not permitted`. Browser checks could not run here. No browser screenshot or GPU/target-laptop performance result is claimed. Manually review touch gestures, keyboard activation, screen readers, 200% zoom and all three sample slides on the target MacBook. The preview may scroll vertically on mobile/zoom; text should never clip.

## Files and scope

- `index.html`, `prototype.css`: three sample screens and one isolated preview.
- `app.js`: prototype-only selection, navigation, recovery and fixture controls.
- `matcher.js`, `catalog.json`: exact PRD ranking and clearly limited preview content.
- `scenes.js`: one-context scene director using existing geometry/renderer.
- `checks.html`, `checks.js`: actual-browser check page.

No application backend, new seven-slide quiz, Python analytics, travel-card export, full results flow, commit, push or deployment was added. Work awaits review.


## Immersive destination revision (current review milestone)

PRD **3.1**, catalog **getaway-2.0.0** now contains the approved fifteen destinations. The seven questions, weights, affinity interpretation, tie-breaking algorithm and storage key are unchanged. Seven retained destinations keep their affinities; Iceland keeps the former Reykjavík ratings. Other new destinations have explicit editorial rows. Existing prototype answers are recovered and recomputed, never migrated into legacy quiz storage.

Four actual WebGL environments are implemented: **Paris, Tokyo, Bali and Swiss Alps**. The other eleven destinations keep functional fallback results. The final sixteen-slide experience, full activity database, exports and Python analytics are still future work.

### Exact scene URLs

Run `python3 -m http.server 8000 --bind 127.0.0.1` in the project root, then open:

- http://127.0.0.1:8000/prototype/destinations.html?scene=paris
- http://127.0.0.1:8000/prototype/destinations.html?scene=tokyo
- http://127.0.0.1:8000/prototype/destinations.html?scene=bali
- http://127.0.0.1:8000/prototype/destinations.html?scene=swiss-alps

The gallery uses disclosed demonstration answers and never reads or writes saved quiz progress. Each sample initially uses that destination's primary-affinity answers, which genuinely win in the matching engine. Close with **Match details** or Escape to edit all seven demonstration answers, choose any of fifteen destinations, or reopen the scene. The calculated best match is reported separately from the destination being explored.

For a quiz-connected Paris result, open http://127.0.0.1:8000/prototype/ and choose **City break → Art and history → Balanced days**. Leave the four default sample answers unchanged. Paris opens automatically. The result details page also has **Enter my destination** and the two ranked alternatives. The four editable fixture answers remain disclosed; this is not a completed seven-question quiz.

### Controls and personalization

Move the pointer for parallax, drag the canvas to look, focus the canvas and use arrow keys, or press Home/Reset view. Select a numbered marker or its labeled attraction button to move closer and see the activity. Open **Three days, your way** for the personalized plan. Alternatives never change answers or the primary match. Pause motion stops ambient motion; OS reduced motion also skips arrival animation and uses immediate deliberate camera changes. Touch dragging remains available without ambient animation.

Activities vary by interest; vacation, dream experience and packing affect day ordering; pace changes daily density; companions, budget and packing add answer-specific priorities. Regional plans disclose transfer or seasonal-access limitations. Recommendations remain draft suggestions; see [sources and content limitations](SOURCES.md).

### Architecture and budgets

- `destination-models.js`: fifteen-entry registry, four procedural scene builders, static material batching and ambient transforms. Eleven entries describe their future environment and expose fallback status.
- `destination-renderer.js`: local WebGL 2 lighting, atmospheric fog, emissive signs and a 512px shadow map, reusing the original renderer without changing it.
- `destination-experience.js`: full-viewport accessible modal, projected marker controls, entrance/camera interpolation, touch/keyboard input, motion preferences, context recovery, scene disposal and alternatives.
- `destination-content.js`: pure deterministic personalization, independent of destination scoring.
- `destination-gallery.js`: read-only direct preview URLs; no progress storage.
- `catalog-audit.json`: synthetic exhaustive counts and winning witnesses, not participant data.

Scene complexity: Paris **2,054 triangles / 27 batches**; Tokyo **3,114 / 32**; Bali **4,242 / 49**; Swiss Alps **1,994 / 25**. Shadows add a depth pass. DPR is capped at 1.5, animation at 30 fps, hidden tabs pause, reduced-motion scenes render on demand, and scene switches dispose previous GPU buffers. The question renderer is paused on the result step. No remote assets or model downloads are required; source links need internet only if opened.

### Verification and remaining review

Current increment: **70 Node tests**, including independent complete rankings for all 16,384 answer sets, all fifteen winning destinations, real mesh budgets, camera/controller behavior, reduced motion, touch-style event sequences, context loss, resource disposal, fallback content, same-destination personalization and legacy progress isolation. Both Python static checks also pass. These Python checks are quality tools, **not** the future analytics component.

User-run GPU checks: http://127.0.0.1:8000/prototype/destination-checks.html. Press **Run browser checks** in a foreground tab. This checks real WebGL readback, attraction camera pixel changes, all fallback plans and horizontal overflow at the current viewport. Existing question checks remain at `/prototype/checks.html`.

Browser automation could enumerate Chrome tabs but both opening and attaching failed with `Cannot read properties of undefined (reading 'timeoutMs')`. No actual browser/GPU screenshots or visual quality claims are recorded. This session could not reach a local server either. Real Chrome/Safari rendering, physical touch, 390px/mobile reflow, 200% zoom, screen-reader behavior and Intel MacBook Air frame pacing need manual review. The structural/controller tests do not substitute for those checks.

Remaining: visual approval of these four samples, then eleven additional environments; final attraction-level verification and activity authoring; complete sixteen-slide flow and offline Python analytics. No commit or push was made.


### Resumed sample review — November 6, 2026

The saved four-scene implementation was inspected and preserved. The scene viewer now includes a **Prototype-only scene preview** selector listing all fifteen destinations, with **3D** or **fallback** labels. Switch directly between Paris, Tokyo, Bali and Swiss Alps without closing the viewer or retaking the quiz. This selector changes only the scene being viewed: answers, ranking, primary match and stored progress remain unchanged. The gallery selector is explicitly labeled the same way. The original presentation and questions remain untouched.

Resumed verification: all 70 regression tests, both static checks, ten JavaScript syntax checks and whitespace checks pass. A hash comparison verifies that the original presentation HTML, shared JavaScript/CSS and legacy data were preserved. A fresh browser attempt still failed with the `timeoutMs` error. Starting the local static server in this session was blocked by `PermissionError: Operation not permitted`; please run the command in your own terminal. No server is left running by this session.


## Imported Eiffel Tower and Rathaus decision — November 6, 2026

Paris now takes the `paris-landmark` integration path. It loads the user's actual GLB and composes it with original project-authored limestone façades, zinc mansard roofs, dormers, balcony railings, arched shopfronts, a café sign/awning and terrace furniture, lamps, a bicycle, instanced leaf cards, a river study and footbridge. These supporting assets are authored code; no downloaded street or people pack is claimed. The artistic silver material keeps the original tower geometry and texture detail, leaves nonmetal materials intact, and uses a generated reflection-light rig with warm directional light. Small highlights are sampled from actual tower vertices and freeze when motion is off. Original asset bytes remain unchanged.

The actual tower has 86,230 triangles, 40 materials and 34 embedded textures (largest edge 1,000 pixels). The composed scene has **106,720 triangles and 63 mesh objects** in the CPU test; material groups can produce additional draw calls. Real GPU draw calls/frame pacing are not measured. Static shadows are cached after their first render. The texture/PBR/lighting result still requires browser visual review.

`rathaus_4k.exr` is a 4096×2048 PIZ-compressed OpenEXR night-square environment attributed to Greg Zaal / Poly Haven, CC0. It is recorded locally but never requested at runtime. Neither a misleading Paris backdrop nor an LDR conversion was created. Its night conditions are unsuitable for the intended golden-hour environment, and the available native image utility could not decode it. See [Rathaus provenance](assets/paris/rathaus-provenance.md).

Preview Paris at http://127.0.0.1:8000/prototype/destinations.html?scene=paris after starting `python3 -m http.server 8000 --bind 127.0.0.1` from the project root. Wait for the **PARIS ASSET PREVIEW** notice: the initial old blockout is a loading fallback, not the imported scene. If loading fails, the notice reports the actual error. Use the prototype-only selector to switch destinations without altering quiz answers. Tokyo remains available at http://127.0.0.1:8000/prototype/destinations.html?scene=tokyo, explicitly labeled incomplete.

The browser GPU checks at `/prototype/destination-checks.html` now require the imported Paris backend to activate; passing the old blockout is no longer accepted as a Paris asset test. The current session could not run these because browser tab creation still fails with `timeoutMs`.

**Validation:** 77 Node tests pass, including parsing the real tower geometry through the installed GLTFLoader (with textures omitted only in the in-memory CPU test), scale/material preservation, finite geometry, triangle budget and reduced-motion highlights. This CPU test is not a rendered screenshot or a full image decode. Both Python static checks pass. The quality audit continues to fail final readiness: Paris is a partial preview, Tokyo assets are absent. Missing animated pedestrian/vehicle assets and the high-quality Tokyo environment must be obtained before claiming both scenes complete.
