# Rathaus HDRI — lighting reference only, not displayed

Inspected November 6, 2026.

- Local original: `rathaus_4k.exr`; 23,900,825 bytes.
- SHA-256: `b1a1b60f324ea0b648ff0a216ef5ea1cf06560c159c4c169db4ff21d1fef4732`.
- Source: https://polyhaven.com/a/rathaus
- Author identified on the asset page: Greg Zaal.
- License: CC0 1.0, as identified on the asset page and https://polyhaven.com/license.
- Legal code: https://creativecommons.org/publicdomain/zero/1.0/legalcode
- Acquisition: user supplied this local file under the corresponding asset name. No comparison against a publisher-provided checksum was possible.

The OpenEXR header identifies scanline storage, PIZ compression, and a 4096 × 2048 data window, suitable in shape for an equirectangular HDR environment. This verifies the header, not successful decoding of every pixel. Poly Haven describes Rathaus as an overcast European square at night with artificial lighting; its metadata does not identify it as Paris.

## Decision

The image is **not used as a Paris backdrop**, is not downloaded by the browser, and is not counted in the active scene download budget. Its night lighting also conflicts with the requested golden-hour scene, so it is kept as an unused lighting reference. Converting it to an LDR WebP backdrop would discard dynamic range and would not resolve the geographic mismatch. No such derivative was created.

The native macOS `sips` inspection attempt could not decode this EXR and terminated with a format exception. No suitable local EXR conversion utility was found. A future HDR-lighting experiment would require a verified decoder and a suitably downsampled HDR environment; it must still never display Rathaus as Paris. The current Paris preview uses an original, non-photographic reflection-light rig with warm directional light instead.

The original EXR was not modified.
