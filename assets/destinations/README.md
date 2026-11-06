# Destination artwork provenance

The images in this folder were generated with OpenAI image generation during this project session on November 6, 2026. They are original AI-generated illustrative assets, not photographs, third-party CC0 images, verified architectural reconstructions or evidence of real conditions. No external image hotlinks are used. The completion pass reused these existing outputs; it did not generate new artwork.

`manifest.json` records origin, tile order, file sizes and SHA-256 checksums. Each numbered atlas has four tiles in top-left, top-right, bottom-left, bottom-right order:

| Atlas | Tiles |
| --- | --- |
| 0 | Paris, Rome, Barcelona, London |
| 1 | Amsterdam, Lisbon, Tokyo, Kyoto |
| 2 | New York, Bali, Bangkok, Greek Islands |
| 3 | Swiss Alps, Iceland, Queenstown, airplane wing |

PNG files are preserved originals. JPEGs are local format/quality derivatives produced with macOS `sips` at quality 88. The application loads these four JPEGs and crops individual tiles using browser canvas; it never displays the whole atlas as one destination. `travel-atlas.png` is an earlier preserved sixteen-tile draft and is not loaded by the final presentation.

Generation brief summary (reconstructed, not an exact prompt transcript): cinematic, photorealistic travel scenes with recognizable destination identity, rich lighting, foreground/middle/background composition and no labels, assembled into ordered atlas grids. Sources were tool-generated outputs, not downloaded photographic sources. Generated imagery may contain inaccurate details; the interface and README disclose its illustrative origin. Existing Eiffel/Three.js licensing remains documented separately in `prototype/`.
