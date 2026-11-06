# Eiffel Tower — provenance and license record

Inspected November 6, 2026. This record applies to the unmodified file `environment.glb` currently stored in this directory. It does not license any future Paris street assets.

- Source supplied by the user: https://3dmr.eu/model/4/2
- Source title: Eiffel Tower (Revision 2), 3D Model Repository.
- Repository contributor / revision uploader: **n42k**; revision date March 22, 2018.
- Original source linked by the repository: https://www.blendswap.com/blends/view/67944
- Original creator: **not independently verified**. The linked BlendSwap page could not be retrieved during this inspection. Contributor credit is not represented as original authorship.
- Source-declared license: **CC0 1.0 Universal Public Domain Dedication** (`CC0-1.0`). The repository explicitly applies this dedication to the model.
- License deed: https://creativecommons.org/publicdomain/zero/1.0/
- Legal code: https://creativecommons.org/publicdomain/zero/1.0/legalcode
- Acquisition: user reported downloading this model from the repository and saving it at the current path. No independent comparison against the remote binary was performed.
- SHA-256: `a6aee356284b359398691360b3aee135fc4e97381b0868c173d0fb871cf1f29b`
- File size: **10,712,864 bytes** (approximately 10.22 MiB).

## Read-only technical inspection

The file has a GLB version 2 header and matching declared/file lengths. Its JSON and binary chunks parse correctly; buffer-view ranges fit the embedded binary buffer. The glTF asset declares version 2.0 and generator `obj2gltf`.

- 9 meshes / 9 nodes; 43 mesh primitives; 86,230 triangles across the stored meshes.
- 40 materials and 34 embedded PNG/JPEG images/textures.
- No external image or buffer URIs; no required extensions.
- No animation clips and no `attraction_0`, `attraction_1`, or `attraction_2` nodes.
- Local geometry bounds are approximately X −60.30 to 60.30, Y 0 to 300.00, Z −60.61 to 60.61; nodes have no additional transforms. Scale/framing integration is still needed for the current small-coordinate scene.
- Image pixel dimensions and actual rendered visual quality were not verified in this inspection.

The model's size and triangle count fit the current per-scene limits by themselves, but leave only part of the budget for street scenery and the backdrop. Mesh primitives are not a measured final draw-call count. This structural inspection is not a full glTF validator run or GPU test.

## Integration status

This is an acquired Eiffel Tower asset, not a completed Paris environment. The backdrop, street composition, attraction anchors, environmental animation, material/performance review and browser visual approval remain outstanding. Keep the Paris package status `awaiting-assets`; do not mark it reviewed merely because the checksum and source license are recorded.

The original binary was not modified, renamed or optimized.


## Subsequent integration inspection — November 6, 2026

Read-only PNG/JPEG header inspection found 34 embedded images with a maximum edge of 1,000 pixels; none exceed the 2K runtime limit. The original GLB checksum is unchanged. Runtime code scales the imported tower to 7.8 scene units and gives ironwork an artistic silver finish while retaining stone/entrance/window materials. This is a requested artistic treatment, not a claim about the monument's real paint color. The authored street is separate code; no new geometry was written into this GLB.
