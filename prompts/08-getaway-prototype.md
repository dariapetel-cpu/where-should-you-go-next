# Approved PRD 3.0 — isolated slides 4–6 prototype

Date: November 5, 2026. The user prompt below is preserved verbatim. All implementation descriptions are reconstructed summaries of this session, not exact assistant transcripts.

## User request — verbatim

```text
I approve PRD.md version 3.0 as the planning baseline. Now implement ONLY a polished, functional prototype of slides 4–6 plus an isolated destination-result preview, following the new Where Should You Go Next concept. Use a premium Editorial Travel style: borderless large WebGL 3D objects, cinematic travel visuals, editorial typography, balanced Mediterranean blue, coral, cream, teal and terracotta colors, dynamic pointer-following rotation, touch interaction and immersive object-led transitions. Slide 4 should feature an airplane that flies across the screen and introduces the first question. Slide 5 should feature a freely rotating miniature destination scene with interactive choices. Slide 6 should feature an interactive suitcase with draggable travel items. Keep the exact questions and answer mappings defined in PRD.md version 3.0. Preserve all existing slides outside the prototype, existing progress and navigation behavior, and do not overwrite legacy quiz progress with the new quiz schema. The destination-result preview should demonstrate the new scoring approach and personalized destination, attractions and three-day itinerary without prematurely implementing the entire results flow. Ensure keyboard accessibility, reduced-motion support, responsive layouts and reasonable performance on an Intel MacBook Air 2020. Add and run regression tests. Do not modify slides 1–3 or 7–12. Do not implement slides 13–16. Do not commit or push to GitHub. At the end, explain exactly what changed, what was tested, how to preview the sample locally, and wait for my approval.
```

## Purpose and scope decisions

Implement the sample in a new `/prototype/` entry point instead of modifying the working legacy presentation. Read the existing WebGL renderer/model files as dependencies, with no source changes. Keep PRD.md unchanged.

The user requested a suitcase for slide 6, while PRD 3.0 assigned that slide the pace question with a calendar metaphor. Preserve the approved pace wording/mapping and render draggable **day-plan items** entering the suitcase. Do not relabel packing preferences as pace answers or move the actual packing question forward.

The destination result needs seven answers, but only three question slides are in scope. Supply the four unimplemented answers through a clearly disclosed, editable **sample fixture panel**. Do not invent participant answers or implement slides 7–10 under another name. The result is labeled an isolated preview, and no response is exported as real participant data.

## Resulting implementation

- Slide 4: a large borderless airplane enters the scene; vacation carousel preview and explicit commit remain separate, with direct radio alternatives.
- Slide 5: miniature city geometry supports full drag rotation, pointer parallax and keyboard/reset. Selecting an interest moves its 3D marker.
- Slide 6: an open terracotta/teal suitcase accepts one day-plan item by drag/drop, tap/click, native radio selection or keyboard handle activation. Canceled drops have no effect.
- Result preview: exact twelve-destination ranking, answer/fixture-aware reasons, a trade-off, sample attractions, day tabs and pace-aware itinerary outline. Expandable fixtures and ranking make the demonstration transparent.
- Editorial composition: large serif headlines, mixed Mediterranean blue/peach/cream scenes, borderless canvases, high-contrast actions and compact, consistent navigation.
- Separate storage namespace with validation and resume/start-fresh. Legacy storage is never read, migrated or overwritten. Existing presentation code and slide markup remain unchanged.

The new matcher implements every matrix row, weight, budget-flex exception and lexicographic tie rule in PRD 3.0. The full content production system remains deferred: preview attractions and itinerary outlines do not claim current prices, access, booking availability, route feasibility or complete content validation.

## Refinement and verification

- Added a deterministic independent full-ranking check for all 16,384 answer combinations; all twelve destinations are reachable.
- Added prototype DOM integration tests for committing versus previewing, answer gates, fixture changes, day selection, packing cancellation/drop, revisions and recovery.
- Added renderer-adapter tests using actual geometry for flight entrance, idle suspension, city orbit, reduced motion, keyboard/reset, context loss and viewport framing.
- Verified legacy storage sentinels survive prototype edits and fresh start.
- Cached airplane/city/suitcase bases, used one renderer with a 512 px shadow map, retained the 1.5 DPR cap and stopped RAF after settling/backgrounding/result entry.
- Refined compact-height layouts and supplied an actual-browser GPU/layout test page.

**Results:** 61 Node tests passed, both Python static-check scripts passed, twelve JavaScript syntax checks passed, and whitespace checks passed. The legacy application files and PRD were compared with a pre-task hash snapshot and preserved.

**Limits:** the environment denied the static server socket bind. The real-browser suite, rendered visual polish, physical touch, screen readers, 200% zoom, and Intel MacBook Air 2020 performance could not be confirmed here. No screenshot or measured frame-rate claim was fabricated. The Python scripts used here are test tooling, not the later meaningful Python analysis component.

## Local review and next gate

Serve the project root using `python3 -m http.server 8000 --bind 127.0.0.1`; open `http://localhost:8000/prototype/`. The existing presentation stays at `/`. Open `/prototype/checks.html` in a separate active tab for browser tests. See [prototype/README.md](../prototype/README.md) for controls, content limitations and exact test commands.

No slides 13–16, complete results flow, commit, push or deployment were implemented. Wait for review before extending the approved direction.
