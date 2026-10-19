# `@zackisch/design-system`

> **DESIGN DIRECTION: PENDING OWNER DECISION**
>
> All prior prescriptive visual specifications (`docs/design-system.md`), Golden Screen scorecards, and auto-populated visual acceptance matrices have been purged as part of the Clean Design Reset (`docs/design-reset-deletion-ledger.md`).
>
> Do **not** treat the current CSS token values in `src/styles/tokens.css` as permanent design law. A unified Base UI design system will be finalized in Phase 2 only after the repository owner explicitly approves one of the six researched design concepts (`R1`/`R2`/`R3` for `root/` and `A1`/`A2`/`A3` for `app/`).

## Preserved Brand & Technical Invariants

1. **Canonical Brand Marks:** The original SVG brand assets hosted in `root/public/` (`brand_mark.svg`, `word_mark.svg`, `combination_mark.svg`) and the `Poppins` brand wordmark remain intact and are resolved via `BRAND_ASSETS` / `resolveBrandAsset`.
2. **Base UI Foundation:** Interactive primitives (`Dialog`, `Accordion`, `Tabs`, `Select`, `Switch`, `Popover`, `Tooltip`, `ToastProvider`) wrap `@base-ui/react` to guarantee keyboard navigation, focus management, and ARIA semantics (WCAG 2.2 AA).
3. **Live Exports Preserved During Phase 1:** All existing component and utility exports in `src/index.ts` remain buildable so `root/`, `app/`, `support/`, and `internal/` continue to compile and pass tests while awaiting owner design sign-off.
