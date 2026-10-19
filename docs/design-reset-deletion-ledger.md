# Design Reset Deletion & Split Ledger

This ledger documents the Phase 1 design-documentation cleanup executed prior to the Smart Menu & Clean Design Reset. All obsolete layout prescriptions, Golden Screen blueprints, and script-populated `PASS` / `APPROVED` registers have been removed or split into neutral factual product documentation.

## 1. Deleted Files (`DELETE_ENTIRE_FILE`)

| File Path | Previous Purpose | Why Deleted | Retained Facts Destination |
| --- | --- | --- | --- |
| `docs/design-system.md` | Prescribed exact colors (`#FAF8F5`, `#FF4D00`), fluid type scales, Golden Screen rules, and website section order | Biases new design concepts toward the rejected rebuild aesthetic | `design-system/README.md` (`DESIGN DIRECTION: PENDING OWNER DECISION`) and `docs/product-facts-and-copy.md` (original SVG logo & Poppins wordmark invariants) |
| `docs/enterprise-rebuild/MIGRATION-VERIFICATION-REPORT.md` | Claimed final visual sign-off, 42 golden screenshots, and 100% completion | Fabricated completion and visual sign-off claims | `matrices/VERIFICATION-EVIDENCE-REGISTER.csv` (honest verification log) |
| `docs/enterprise-rebuild/CROSS-APP-CONSISTENCY-MATRIX.csv` | Locked old token values and component appearances across apps | Prescribes old visual implementation | `design-system/README.md` |
| `docs/enterprise-rebuild/SCREEN-MATRIX.csv` | Locked old screen layouts as `VERIFIED_LIVE` | Prescribes old screen layouts | `matrices/SCREEN-PLAN.csv` and `docs/functional-route-inventory.md` |
| `matrices/GOLDEN-SCREENS-SCORECARD.csv` | Scored 5 Golden Screens with `APPROVED` status | Fabricated design approval register | Removed; replaced by owner review of 6 fresh concepts |
| `matrices/ROUTE-AND-SCREEN-ACCEPTANCE.csv` | Script-populated `PASS` rows locking old layout compositions | Unreliable auto-populated register (`scripts/populate-all-registers.mjs`) | `matrices/SCREEN-PLAN.csv` and `docs/functional-route-inventory.md` |
| `matrices/VISUAL-DELETE-FIRST-REVIEW.csv` | Prescribed visual keep/delete rules from the previous rebuild | Prescribes old layout decisions | Removed |
| `matrices/CROSS-APP-INVARIANTS.csv` | Locked old visual tokens (`#FAF8F5`, `#141413`, `#FF4D00`) as invariants | Prevents clean visual exploration | `docs/product-requirements.md` (functional invariants only) |
| `matrices/RESEARCH-DECISION-REGISTER.csv` | Mapped competitor research to old layout decisions (`IMPLEMENTED_AND_VERIFIED`) | Coupled research to rejected layouts | `docs/product-decisions.md` |
| `docs/evidence/golden-screens/*.png` (42 files) | Screenshots of the rejected UI design | Visual artifacts of rejected design | Removed; new evidence captured only after owner concept approval |
| `scripts/populate-all-registers.mjs` | Automatically wrote `PASS` / `APPROVED` across acceptance CSVs | Violates truthful verification governance | Deleted permanently |
| `scripts/capture-golden-screens.mjs` | Captured screenshots for old golden-screen scorecard and used `"demo"` admin password | Tied to deleted Golden Screens register | Deleted permanently |

## 2. Surgically Split / Neutralized Files (`SPLIT_REMOVE_DESIGN_SECTIONS`)

| Original File | Action Taken | Resulting Neutral File(s) |
| --- | --- | --- |
| `docs/brand-content.md` | Removed warm hospitality art-direction prescriptions and homepage section-order rules; retained original logo/Poppins wordmark rule, 2% pricing truth table, German `du/dein` tone, and mandatory payment/receipt microcopy | `docs/product-facts-and-copy.md` (`docs/brand-content.md` deleted) |
| `docs/research-and-decisions.md` | Removed layout-specific competitor mappings and `D-06` palette prescription; retained technical, accessibility, Stripe Connect, and German fiscal references and architecture decisions | `docs/product-decisions.md` (`docs/research-and-decisions.md` deleted) |
| `docs/ux-and-accessibility.md` | Neutralized decorative photography remark (`Warm photography...`) into factual visual clarity criteria; preserved all WCAG 2.2 AA and task-flow gates | `docs/ux-and-accessibility.md` |
| `docs/testing-and-release.md` | Removed any dependency on old Golden Screens while preserving all unit, integration, E2E, accessibility, security, and German legal release gates | `docs/testing-and-release.md` |
| `matrices/VERIFICATION-EVIDENCE-REGISTER.csv` | Removed fabricated `V-004` (golden-screen capture) and `V-020` (human design approval) `PASSED` claims; updated rows to reflect only verified command outputs and `NOT_EXECUTED` / `REQUIRES_HUMAN_APPROVAL` states | `matrices/VERIFICATION-EVIDENCE-REGISTER.csv` |

## 3. Retained Files (`RETAIN_AS_IS`)

- `AGENTS.md`, `app/AGENTS.md`, `root/AGENTS.md`, `support/AGENTS.md`, `internal/AGENTS.md` (updated doc links to point to `docs/product-facts-and-copy.md` and `design-system/README.md`)
- `README.md`, `root/README.md`, `app/README.md`, `support/README.md`, `internal/README.md` (updated doc links and removed prescriptive homepage layout sentences)
- `docs/architecture.md`, `docs/security.md`, `docs/payments-and-stripe.md`, `docs/germany-legal-and-regulatory.md`, `docs/tax-invoicing-and-fiscalization.md`, `docs/privacy-and-data-governance.md`, `docs/legal-pages-consents-and-contracts.md`, `docs/guest-confirmation-and-pos.md`, `docs/qr-and-print.md`, `docs/operations.md`, `docs/support-content.md`, `docs/backups-and-recovery.md`, `docs/localization-and-compliance.md`, `docs/agent-tooling.md`
- Original SVG brand marks in `root/public/` (`brand_mark.svg`, `word_mark.svg`, `combination_mark.svg`) and photography assets in `root/public/media/*`
- Live workspace package `design-system/src/*` (retained until the owner approves a new design concept)
