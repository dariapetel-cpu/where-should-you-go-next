# 11 — Imported Eiffel Tower integration and Rathaus review

Date: November 6, 2026.

## User request — verbatim

> I have placed environment.glb and rathaus_4k.exr in prototype/assets/paris/. The Three.js runtime is already installed. Please take over the remaining technical work. Inspect both assets, verify their compatibility and provenance, convert the EXR to the required backdrop format if appropriate, and integrate the Eiffel Tower model with a silver metallic finish and subtle sparkle. The Rathaus HDRI may not depict Paris, so use it for lighting only if suitable, not as a misleading Paris city backdrop. Build a recognizable, richly detailed Paris environment with buildings, cafes, pedestrians, lighting and interactive attractions. Then improve Tokyo to the same visual standard using properly licensed assets. Work autonomously, preserve all existing quiz logic and original slides, run tests, and provide preview URLs. Do not commit or push to GitHub. If an essential asset is unavailable, identify it clearly rather than claiming the scene is complete. Stop for my visual review after Paris and Tokyo.

## Findings and decisions — reconstructed summary

The tower GLB is unchanged from the acquired file: 86,230 triangles, 40 materials, 34 embedded images and no external asset URIs. PNG/JPEG header checks identify a maximum texture edge of 1,000 pixels. It needs runtime scaling, supporting scenery and interactive anchors; it is not a finished city environment.

Rathaus is a 4096×2048 scanline PIZ OpenEXR. Poly Haven identifies Greg Zaal, CC0, and night-time European-square lighting. It is not a verified Paris location. Kept the original as an unused, documented lighting reference; did not convert or display it as a Paris backdrop. Its night conditions conflict with the desired golden-hour view. The native `sips` image utility failed to decode the format, and no suitable conversion tool was available. Original EXR bytes remain untouched.

External asset downloads still fail DNS resolution. No licensed Tokyo street package or animated human/vehicle models are available. Those requirements are explicitly unfinished rather than replaced with new crude stand-ins.

## Changes

- Paris imports the supplied tower through Three.js and applies an artistic silver metal treatment to ironwork, preserving original textures and nonmetal materials. The real monument's color is not claimed to be silver.
- Added project-authored supporting architecture and props: mansard roofs, dormers, balcony ironwork, arched storefronts, café sign/awning/furniture, lamps, bicycle, instanced foliage, river study and bridge. These are code-authored supporting art, not falsely attributed downloaded models.
- Added gentle foliage motion and low-intensity highlights located on actual tower vertices, respecting reduced motion. Cached static shadows and batched supporting geometry.
- Kept a clearly labeled partial-preview path distinct from final asset review. Missing-asset notices and stale-load protections remain. Quiz scoring, answers, original slides, Bali and Swiss Alps models are preserved.
- Added CPU tests using the installed Three.js and GLTFLoader against an in-memory geometry-only copy of the supplied asset. Source files are never rewritten by tests. Browser GPU checks now require the imported Paris renderer, rather than accepting the original blockout.

## Verification and outstanding work

77 Node tests pass, including matching, state, scene controls and real imported geometry checks. The composed geometry measures 106,720 triangles and 63 mesh objects; real GPU draw calls and frame pacing remain unmeasured. Both Python static checks and JavaScript syntax checks pass. Protected-file hashes confirm the original slides, quiz/matcher/catalog, legacy models and supplied GLB/EXR are unchanged.

The final-readiness asset audit intentionally reports Paris as not yet reviewed and Tokyo assets missing. Browser automation still fails on tab creation with `Cannot read properties of undefined (reading 'timeoutMs')`, so no rendered visual approval or screenshot is claimed. Paris still lacks animated people/traffic. Tokyo has not reached the requested standard because its essential licensed scene assets are unavailable. No commit or push was made.
