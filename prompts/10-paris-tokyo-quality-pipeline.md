# 10 — Paris and Tokyo visual-quality overhaul: asset pipeline, incomplete artwork

Date: November 6, 2026.

## User feedback — verbatim excerpts

> The current scenes look like extremely primitive low-poly blockouts, not recognizable vacation destinations.

> Stop relying exclusively on simplistic procedural geometry.

> If asset downloading is unavailable, implement the scene structure and clearly identify missing assets instead of replacing recognizable landmarks with crude geometric substitutes.

> Then fully upgrade ONLY Paris and Tokyo as the first two high-quality visual samples.

## Request summary — reconstructed, not an exact transcript

The user rejected the four procedural scenes and requested a substantial change in rendering approach. Paris should have an accurate Eiffel Tower, Haussmann streets, café furniture and urban life; Tokyo should have dense, recognizable night streets, readable Japanese signage, pedestrians, vehicles and reflections. Use licensed detailed models, optimized local GLB assets, textures and layered backgrounds; retain genuine 3D camera interaction and environmental motion. Preserve the quiz, matching, itinerary, alternatives and other two scenes. No commit or push; review Paris/Tokyo before further scene work.

## Inspection and decisions — reconstructed implementation summary

The existing shader renderer only handled simple untextured procedural meshes. There was no glTF loader, texture pipeline, detailed model library or photographic asset collection. External download probing failed with DNS resolution errors. Official Three.js r170 loader source was inspected through web browsing; its module dependencies are recorded for local installation. Eiffel Tower download pages declaring CC0 were researched as candidates only. No candidate was downloaded, visually inspected, approved or attributed as an installed asset.

Following the explicit unavailable-download instruction, implemented scene structure rather than inventing another landmark approximation:

- `prototype/destination-assets.js`: local-only manifest paths, license/provenance readiness and missing-file gate.
- `prototype/destination-quality.js`: optional local Three.js/glTF backend with PBR material textures, tone mapping, lighting, shadows, environmental animation clips and authored attraction anchors. Uses existing camera/controller state; it does not change matching.
- `prototype/assets/quality-manifest.json`: Paris/Tokyo deliverables, camera/light settings, animation names, asset budgets and explicit missing provenance. Both packages remain `awaiting-assets`.
- `prototype/install_quality_runtime.py`: operator-run pinned MIT runtime installer, no artwork downloading and no overwrite of existing runtime files.
- `prototype/audit_quality_assets.py`: local files, provenance/license, checksum, GLB header and download-size audit. Its failure is expected until assets are present.
- Existing controller: explicit incomplete-upgrade notice, asynchronous generation checks and disposal to prevent a late load replacing a newly selected scene. It keeps the existing blockout functional while assets are unavailable.
- `prototype/assets/README.md`: detailed scene art requirements, local file contract, license research, missing assets, budgets and visual acceptance gates.

The original model builders, including Bali and Swiss Alps, were not changed. The matching engine, catalog/questions and original presentation remain unchanged. This is a prepared loading architecture, **not a completed or visually verified art upgrade**. Three.js and the actual Paris/Tokyo assets are still missing; the new backend has not run against real scene assets or a GPU in this environment. LOD authoring, actual draw-call profiling, detailed sign/content review and visual approval remain open.

## Verification

75 Node regression tests pass. New tests verify missing-assets honesty, local-path restrictions, reviewed-file failures, continued original preview functionality and asynchronous scene-switch safety. Both Python static checks and JavaScript syntax checks pass. Protected-file hashes confirm original presentation, questions, matcher, catalog and all four procedural scene builders are unchanged. The quality-asset audit intentionally fails and lists missing runtime, models, backgrounds and license records. It must not be counted as a passed readiness check.

No commit or push was made. The requested visual success criterion remains unmet until appropriate local assets can be acquired, integrated and visually tested.
