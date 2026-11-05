# What Kind of Traveler Are You?

A playful, English-language travel presentation for university students. The current opening chapter contains **three interactive slides with genuine WebGL 2 objects**. The project uses HTML, CSS, and JavaScript and needs no build step, npm installation, CDN, or external service to run.

## Preview locally

Open Terminal and run:

```sh
cd /Users/dariapetel/Desktop/codex-practice
python3 -m http.server 8000 --bind 127.0.0.1
```

Keep that terminal open, then visit **http://localhost:8000/** in Chrome, Edge, Firefox, or Safari with WebGL 2 support. If an earlier version is cached, refresh with **Command+Shift+R** on Mac or **Ctrl+Shift+R** on Windows/Linux. Stop the server with Ctrl+C when finished.

If port 8000 is already used by this project's server, reuse its URL. Otherwise choose another port, such as `8001`, in both the command and URL. Python serves static files only; the later quiz-analysis component is not implemented yet. Use HTTP serving for the supported preview workflow.

## Try the three slides

| Slide | Main interaction |
| --- | --- |
| **What kind of traveler are you?** | Move the mouse over the suitcase for a bounded tilt. Click it, or use **Open my suitcase**, to open its hinged lid and reveal packed objects. Click the suitcase again to close it. Rotate Left/Right and Reset offer keyboard-accessible view controls. After opening, the primary button continues to slide 2. |
| **What draws you in?** | Select a 3D folded map, compass, chair, or coffee cup. The object responds, its card becomes selected, and a short scenario appears. **Explore this mood** carries the selection to slide 3. These are unscored exploratory choices. |
| **Let curiosity pick.** | **Surprise me** spins the globe and cycles through four moods, changing the globe color, companion object, and text. **Start again** returns to slide 1. |

Back/Next and the grid-shaped overview button provide navigation. Left/Right and Home/End work when focus is outside interactive controls. Native buttons work with Tab, Enter, and Space. Escape closes the overview. Progress accurately shows the three available slides.

**Motion off** stops ambient motion, pointer tilt, and animated transitions; clicks still update the object state immediately. System reduced-motion settings take precedence. Touch users can tap the same controls without needing hover or drag.

## What makes the visuals actual 3D?

The suitcase, its hinged lid, contents, map, compass, chair, cup, and globe are mesh geometry rendered by the GPU. They use perspective projection, surface normals, rounded edges, material roughness/metalness, GGX-based studio lighting, and a depth-map shadow pass with filtered edges. Opening the suitcase changes the lid's world transform and exposes physical interior geometry.

The implementation uses a small original **native WebGL 2 renderer**, rather than Three.js. This preserves the locally implemented 3D work and avoids the library-download failure encountered during the first redesign session. The underlying rendering approach follows the browser's [WebGL lighting APIs](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL). The initial renderer availability and shader compilation are checked at runtime.

The visible slides no longer use the earlier flat travel artwork. Historical SVG illustrations remain in `assets/illustrations/` but are not used as 3D substitutes; only the favicon remains linked. If WebGL is unavailable or the context is lost, an explicit message appears and the ordinary slide controls remain usable. A fallback is not presented as a successful 3D rendering.

Only the active slide renders; rendering pauses when the browser tab is hidden. Canvases cap pixel density at 1.5. The suitcase uses 30,592 triangles, and the other scenes remain below 50,000 triangles each. Opening the suitcase also adjusts camera framing to keep its lid visible on narrow canvases.

## Tests and verification

With Python 3 and Node.js installed, run:

```sh
python3 tests/check_foundation.py
node --check js/scene-core.js
node --check js/travel-models.js
node --check js/travel-scenes.js
node --check js/app.js
node --check tests/browser-checks.js
node --test tests/foundation.test.cjs tests/geometry.test.cjs tests/scenes.test.cjs
```

**Recorded on November 5, 2026:** 30 Node tests passed, along with JavaScript syntax, static structure, local-asset, and selected contrast checks. The Node tests cover interface behavior through a DOM adapter, real geometry/matrix calculations, and scene lifecycle through a renderer adapter. They do not compile shaders on a browser GPU.

Temporary CPU rasterizations of the actual model geometry were inspected to check framing and mesh surfaces. That inspection caught and corrected open-lid clipping and continent triangles intersecting the globe. These were model previews, not browser screenshots or confirmation of final GPU lighting.

### Real-browser check page

With the server running, open **http://localhost:8000/tests/browser-checks.html** and click **Run browser checks**. Keep the tab active. It exercises the real presentation, reads GPU pixels, checks opening/rotation/selection/mood changes, tests context-loss recovery, and checks layout overflow at five viewport sizes. The report appears on the page and can be copied. No data is uploaded and no project files are modified.

**Verification limit:** the browser automation tool failed before navigating or inspecting the page during this session. The browser suite is supplied but has not been recorded as passing. GPU output, full rendered layouts, and cross-browser behavior still need that run. The local server launch and HTTP readiness request were also denied by the session’s socket permissions. No preview server remains running; start it in your own terminal using the command above.

Also manually review:

- Pointer tilt, native keyboard activation, Escape, focus restoration, and screen-reader announcements.
- All three slides at 1280×720, 1440×900, 1920×1080, 768 px and 390 px widths, and 200% browser zoom.
- An offline reload with the local server running.
- Whether the final materials, lighting, type, and motion meet the intended visual quality.

## Scope and files

Exactly three presentation slides are implemented. No quiz questions, scoring, results, response export/recovery, Python analytics, additional slides, commit, push, or deployment were added in this redesign.

| File | Responsibility |
| --- | --- |
| `index.html` | English content, three slides, accessible controls, and six canvases. |
| `css/styles.css` | Pastel design system, distinct layouts, responsive rules, and motion settings. |
| `js/app.js` | Navigation, feedback, suitcase controls, preference selection, and mood flow. |
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

The prior planning records and PRD were preserved. Browser screenshots should be added after real-browser visual review; none are claimed here.
