> **Updated status:** Paris has a loadable `partial-preview` using the supplied tower plus original authored street code. This is separate from final `reviewed` readiness. No photographic Paris backdrop is required for this path; Rathaus is an unused reference, never a displayed backdrop. Tokyo still awaits its full licensed asset package. The original requirements below remain final-scene targets, not a claim that these deliverables exist.

# Paris / Tokyo asset pipeline — incomplete visual upgrade

The existing blockouts are explicitly **not approved quality**. Network/DNS restrictions prevented downloading detailed assets and the Three.js runtime during this session. No new procedural landmark substitutes were created. Bali and Swiss Alps have not been redesigned.

## Rendering strategy

Use reviewed, locally bundled glTF 2.0 environments with PBR base-color, normal, roughness and emissive textures; actual foreground geometry and multiple depth layers; and a local equirectangular background for distant sky/city context. The background must never replace the navigable environment. The optional Three.js r170 backend supplies color management, ACES tone mapping, hemisphere/key lights, soft shadows, fog, embedded material textures and authored animation clips. The existing controller retains camera arrival, pointer/drag/keyboard, projected markers, itinerary, ranking and state isolation.

The implementation is an **untested-in-browser asset-loading structure**, not a completed visual overhaul. Asset readiness is currently false for both scenes. The existing renderer stays available with a prominent incomplete-upgrade notice. Only a complete reviewed package activates the glTF backend. Returning from an async load to a different scene disposes the unused asset and does not overwrite the active scene.

## Required local deliverables

| Package | Missing artwork | Acceptance before review |
| --- | --- | --- |
| `paris/environment.glb` | Accurate Eiffel silhouette, real arches/lattice; Haussmann buildings, balconies, café furniture, trees, lamps, bicycles, pedestrians, subtle traffic | An unmistakable Paris street with titles hidden; realistic proportions, architectural detail and foreground/middle/background depth |
| `paris/backdrop.webp` | Licensed golden-hour sky / distant Paris context, equirectangular | Warm lighting consistent with the modeled street, no duplicated foreground tower or baked-in UI |
| `tokyo/environment.glb` | Detailed Shibuya/Shinjuku-inspired storefronts, billboards, readable Japanese signs, crossing, vehicles, pedestrians and street-level clutter | Unmistakable Tokyo with titles hidden, visually dense street at eye level, balanced lit shopfronts and dark surfaces |
| `tokyo/backdrop.webp` | Licensed night skyline/sky context, equirectangular | Supports distant depth without replacing the street model |
| `../vendor/three/` | Pinned Three.js r170 module, GLTFLoader, BufferGeometryUtils, MIT license | All dependencies local; no runtime CDN requests |

Do not mark assets reviewed based only on a download-page thumbnail or license label. Inspect actual geometry, UVs, textures, silhouette, animation and provenance first. The Eiffel candidates below are research leads, **not selected, downloaded or verified artwork**:

- [3D Model Repository Eiffel Tower](https://3dmr.eu/model/4/2): repository declares CC0 and identifies its original BlendSwap source. Requires geometry/provenance/quality inspection.
- [Grab3D Eiffel Tower](https://grab3d.com/models/buildings/eiffel-tower/): page declares CC0 and describes arches/lattice. Its stylized treatment may not satisfy the requested realism; inspect before selection.
- Tokyo street asset selection remains unresolved. No paid or redistribution-restricted package is approved. Japanese signs must be reviewed for readability and context; do not substitute random glyphs.

## Package contract

Export self-contained GLB files with embedded WebP/JPEG/PNG textures. No external URLs. Use reusable glTF meshes / `EXT_mesh_gpu_instancing`, baked ambient occlusion and roughness variation rather than extra lights. Texture edge <= 2048 (1024 for small props). Initially use uncompressed mesh buffers; Draco/Meshopt/KTX2 decoders are **not bundled or configured**. Keep each environment plus backdrop <= 18 MB, visible geometry <= 180k triangles and <= 120 draw calls. These are budgets, not achieved measurements. LOD authoring and real target-laptop profiling remain required before accepting any package.

Author the street and its actors as one composed environment, in the existing scene's coordinates (ground Y=0, focal area around origin, camera near [7,4,12]). Provide three empty named nodes `attraction_0`, `attraction_1`, `attraction_2` at the exact interactive locations. Marker positions are read from these nodes, never inferred from a generic shape. Paris anchors correspond to Eiffel Tower, Seine riverbanks and Montmartre café; Tokyo to Asakusa, Shibuya and Sumida riverfront. These are separate locations in reality: design a deliberately compressed travel diorama, label that limitation, or author scene-to-scene camera cuts during final content review. Do not imply geographic adjacency.

Include the exact animation clips declared in `quality-manifest.json`: Paris `pedestrian_walk`, `traffic_loop`; Tokyo `pedestrian_crossing`, `traffic_loop`, `sign_cycle`. Keep signs readable, with slow luminance changes and no flashing. The mixer uses the controller's accumulated time, pauses with motion off / hidden tabs, and does not catch up on resume. Textures and materials supply neon/road reflections; no costly screen-space reflections or bloom pipeline is implemented.

Fill each asset's author, primary source URL, license, local license_file and SHA-256 fields. Preserve license files under that scene's directory. Set scene status to `reviewed` only after human visual/license inspection. Run `python3 prototype/audit_quality_assets.py`; it must report READY before claiming the new quality is available. The manifest deliberately contains null provenance for missing artwork rather than invented attribution.

## Runtime installation

When network access is available, run `python3 prototype/install_quality_runtime.py`. This downloads pinned Three.js r170 files and its MIT license only. It never downloads unreviewed artwork and does not overwrite existing files. Supply reviewed assets separately, then run the audit. The original four scene previews remain functional throughout.

## Visual acceptance still required

Check both scenes with titles hidden, camera arrival, all marker focus positions, foreground occlusion, reflections/materials, readable Japanese signs, motion off, all viewport sizes and 200% zoom. Measure frame time and memory on the Intel MacBook Air. Test rapid scene changes while loading, missing texture/GLB, context loss and fallback results. Do not claim visual success from unit tests or an asset manifest.
