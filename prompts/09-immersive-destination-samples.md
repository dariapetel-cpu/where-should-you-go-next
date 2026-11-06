# 09 — Immersive destination architecture and fifteen-destination revision

Date: November 5, 2026. This record distinguishes actual user wording from reconstructed implementation summaries.

## Purpose

Turn the isolated destination preview into an arrival experience, preserving the original presentation and seven-question matching contract. Provide four visual samples before extending the remaining destinations.

## Earlier request — reconstructed summary, not a transcript

The user clarified that Paris was only an example: every recommended destination must eventually have its own full-viewport interactive WebGL environment, recognizable scenery, atmosphere, camera entrance, attractions and answer-personalized itinerary. The requested first samples were Paris, Bali and Swiss Alps, with other destinations retaining fallbacks. Inspection found that Bali and Swiss Alps were not in the twelve-entry 3.0 catalog. The assistant offered either external visual demos or equivalent existing destinations. The user rejected both options and explicitly revised the catalog and sample scope below.

## Catalog revision — verbatim user prompt

> Neither option. I want to expand the final quiz to 15 destinations: Paris, Rome, Barcelona, London, Amsterdam, Lisbon, Tokyo, Kyoto, New York, Bali, Bangkok, Greek Islands, Swiss Alps, Iceland, and Queenstown. Update the PRD and matching catalog accordingly, preserving the seven questions and existing functionality. For now, implement only four immersive 3D destination samples: Paris, Tokyo, Bali, and Swiss Alps. The remaining 11 destinations should retain functional fallback result screens until their 3D scenes are built. Do not modify the original presentation or commit or push to GitHub. Continue with this revised plan.

## Findings and decisions — reconstructed implementation summary

- The old twelve-entry catalog did not match the user's final collection. PRD 3.1 and `getaway-2.0.0` now explicitly list the approved fifteen. Algarve, Bologna, Prague and Seoul are removed; Reykjavík becomes the Iceland entry with its existing affinities and a Reykjavík-based draft itinerary. Seven retained destinations preserve their affinities.
- Questions, answer IDs, weights, flexible-budget neutrality, maximum score and deterministic tie-breaking remain unchanged. The catalog changes; the matching algorithm does not. Existing prototype answer recovery remains compatible and recomputes results. Legacy progress is never read or overwritten.
- Full-viewport modal environments are isolated under `prototype/`. The original slides, root HTML/CSS/JavaScript, legacy data and previous work are preserved.
- A fifteen-entry registry defines four ready environments and eleven planned fallback entries. One destination renderer is active at a time. It reuses the existing mesh pipeline without modifying the original renderer.
- Paris uses ironwork, river glints, mansard roofs and a café; Tokyo uses vertical signs, a temple frontage, a crossing and river; Bali uses beach, palms, waves and temple-inspired roofs; Swiss Alps uses angular snowy peaks, water, chalets and clouds. These are original WebGL geometry, not CSS or flat illustrations. Scenery is compressed and illustrative.
- Arrival, pointer parallax, drag exploration, keyboard camera controls, physical marker geometry and equivalent labeled buttons share one controller. Reduced motion stops ambient animation and uses immediate deliberate view changes. Context loss and WebGL absence leave activity and itinerary controls usable.
- Destination ranking and activity personalization are separate pure operations. Same-winner answer sets can produce different activities/day priorities. Alternative browsing does not alter the winner, answer revision or saved state.
- A read-only gallery supplies exact scene URLs. All seven gallery answers are explicitly demonstration inputs. The quiz prototype still collects only the first three real choices and discloses four editable fixtures.

## Resulting changes

Updated `PRD.md`, `prototype/catalog.json`, prototype result integration, README files and tests. Added destination models, renderer, controller, personalization, styles, gallery, browser checks, source record and exhaustive catalog audit. No additional presentation slides, final export flow or Python analytics were implemented in this increment.

## Verification and limitations

- 69 Node tests pass, including the independent full-ranking comparison over 16,384 combinations. All fifteen destinations win: 453–1,625 combinations each, with 1,406 top-score ties. These synthetic enumeration counts are not participant statistics. Witnesses/counts are in `prototype/catalog-audit.json`.
- New regression coverage includes mesh/index/triangle budgets, unique scene geometry, marker projection, arrival and pointer camera changes, attraction focus, fallback transitions, renderer disposal, reduced-motion keyboard/touch behavior, context loss/restore, background pause and same-destination personalization.
- Both Python static checks pass. These are QA checks, not the planned meaningful Python analytics workflow.
- Chrome tab enumeration worked, but creating and attaching tabs both failed with `Cannot read properties of undefined (reading 'timeoutMs')`. Browser screenshots and GPU visual checks were not completed. User-run real GPU checks are provided at `/prototype/destination-checks.html`.
- Real target-laptop performance, physical touch, 200% zoom, screen-reader review and Chrome/Safari visual inspection remain open. Geometry budgets are measured; actual frame pacing is not.
- Official-source checks and unavailable pages are documented in `prototype/SOURCES.md`. Activity suggestions are draft, geographically grouped editorial content, not verified bookings or the final independently verified activity database.

## Review boundary

Stop for the user's visual review of Paris, Tokyo, Bali and Swiss Alps. The remaining eleven immersive environments are intentionally unfinished. No commit or push was made. The original presentation remains intact.

## Resumption — November 6, 2026

### Verbatim user prompt

> Continue exactly where you stopped before the usage limit. First inspect the current files and Git status to determine what was actually completed. Do not restart or overwrite completed work. Finish any remaining tasks from the approved 15-destination plan, focusing on the four immersive 3D sample environments: Paris, Tokyo, Bali and Swiss Alps. Verify the destination matching engine, interactive camera movement, attraction markers, animations, itinerary personalization and fallback results for the other 11 destinations. Run all regression tests. Provide direct local preview URLs for all four scenes and explain how I can switch between them without retaking the quiz. If no destination selector exists, add a clearly labeled prototype-only selector that does not alter the real quiz scoring. Preserve the original presentation and existing questions. Do not commit or push to GitHub. Stop after completing and testing the sample, and wait for my visual feedback.

### Reconstructed implementation and verification summary

Inspected Git status and current files before editing. The catalog, four scenes, fallback support, personalization, previous tests and documentation were already saved. Kept that work. An existing selector was available behind the gallery's scene modal; added an explicitly labeled **Prototype-only scene preview** selector inside the scene viewer so all fifteen destinations can be switched directly. Each option identifies 3D or fallback readiness. The calculated primary match and all answers remain unchanged. Added a regression test covering switches across all fifteen destinations, original ranking preservation and cleanup. Corrected Tokyo's documented batch count to 32.

Final resumed checks: **70/70 Node tests pass**, both Python static checks pass (including gallery/check-page asset validation), all ten prototype JavaScript files pass syntax checking, and `git diff --check` passes. Hash comparison confirms original presentation HTML, shared JavaScript/CSS and legacy question data were unchanged from the resumption baseline. Chrome automation still fails on tab creation with the `timeoutMs` error. The static server attempt also fails under this session's restrictions with `PermissionError: Operation not permitted`; HTTP retrieval is similarly blocked. No claim of successful browser/GPU verification or a running server is made. The user should launch the documented server locally and inspect the four direct scene URLs. No commit or push was made.
