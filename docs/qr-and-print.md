# QR signage, encoding and print design

## Goals and constraints

QR signs must work for independent German venues using standard A4 home printers, economical sticker/lamination and optional commercial printing. The goal is a reliably scannable **ordering entry point**, not a showcase of stylistic QR distortions. The QR must encode the exact canonical order URL to the correct venue and table/pickup endpoint. It must never contain secret staff pairing/admin token, customer credentials or payment data. URL data should be stable, short enough for a robust code and correctly HTTPS.

## Visual anatomy

Recommended print layout, from top to bottom:

1. Small Zackisch symbol/wordmark, no oversized software branding that eclipses the venue.
2. Clear imperative: **`Hier bestellen & bezahlen`** or **`Für Abholung bestellen`**.
3. Large central **true encoded black QR on white solid background**, no image cutting into modules.
4. Very clear venue and table: **`Tisch 04`** (or `Abholung`); table names must use existing max-character constraints in app, verified at server boundary.
5. Support line: `Scannen. Auswählen. Bezahlen.` or short instruction on how to use phone camera; if a guest prefers personal service, this remains available.
6. Human-readable URL fallback or compact domain/path that actually resolves to same valid destination (validate before publishing).

Typography and hierarchy should survive grayscale printing, no bleed through laminated table stand and restaurant lighting. Keep venue branding customizations bounded so contrast, quiet zone and scanner performance remain safe. Do not place a QR logo inside the code unless scan quality and correction level are individually tested for all printed sizes. Prefer untouched QR matrix.

## Technical QR specification

- Encode with a tested standards-compliant library such as the current `@lglab/react-qr-code` only if its output passes independent decoder testing; SVG/vector output preferred for printing. Avoid rasterized low-res screenshot as final print artifact.
- **Quiet zone:** a minimum of four modules (4× module width) blank around the entire QR matrix, as recommended by QR symbology guidance. Never overlay decorative border, logo, or text inside this area.
- Strong contrast: black/dark modules on pure white; no inverted, transparent or photo-background QR for standard printable templates. Preserve module geometry with integer-scale rendering; no rounded or stylized dots unless separately scan-validated.
- Print-at-actual-size option; defined layout sizes and margins. Generate properly sized A4 grid sheets, single-code A6 or small tabletop layout, and a printer-ready vector/PDF alternative. Explicit page-size and actual-size instructions; keep cut guides outside safety margin.
- PDF embedding must retain vector quality or sufficient device-resolution raster. Report color mode and paper size rather than pretending automatic printer profile management.
- Do not route QR through opaque redirect/analytics links unless privacy/legal and availability impacts are reviewed.
- Stable table identifier must map to stored eligible table for correct organization. Offboarded/paused tables display safe explanatory content; stale QR never silently redirects to unrelated tenant.

## Printable variants

| Variant | Target | Required fields | Validation |
| --- | --- | --- | --- |
| Home A4 sheet | Owner prints and cuts 2–8 codes | Table name per card, full quiet zone, cut margins | No clipped rows; 100% scale; test typical browsers |
| A6 table stand | One table / reusable sleeve | Clear heading, generous QR, table label, fallback | Phone scanning from common seated distance in varied light |
| Pickup counter sign | Counter or window | Pickup-specific endpoint, no table number | Independent correct pickup menu |
| Professional press template | Digital printer | Bleed/safe zone separate from QR, vector and instructions | Contrast/scanner validation on proof |
| Accessibility fallback | Guest unable to scan | Human-readable URL and staff help | Actual working URL without scanner |

## Implementation steps and automated tests

- Separate QR payload creation from presentation and print/export. Central helper returns canonical URL for organization/table/pickup. Server checks table existence and business mode state.
- Unit tests for URL encoding, locale/region-aware public routes, table/pickup distinction, character bounds and sanitization.
- Generate sample print output for 1, 2, 4, 8+ tables and edge cases with long venue name and max table label. Compare expected number of codes and identifiers.
- Export print variants; independent decoder rescans from rendered page or photo, validating **exact decoded URLs**. Manual physical tests on inexpensive A4 grayscale printer and multiple actual phone camera apps, old tablets, glare/poor lighting, and A6 press proof.
- Link directly from setup wizard and help tutorials, explain printing at actual size and best placement away from spills/reflections. Explicitly ask owner to scan **every code at its actual table** before live launch.

## QR documentation and marketing consistency

The QR poster for guests should emphasize the guest action, not the merchant percentage fee. Marketing site can show a real QR example but may not pretend a decorative demo code is live. Any rebrand affecting printed output must update actual generator, support screenshots, print templates and testing fixtures in one release.

Sources: https://www.qrcode.com/en/howto/code.html ; https://www.gs1.org/standards/barcodes/2d ; https://www.w3.org/WAI/WCAG22/ .
