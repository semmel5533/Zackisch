# Merchant, staff and guest app — agent rules

Inherit `../AGENTS.md`. Scope: `app/` including the **sole** `app/convex/` backend. This application powers owners, staff tablets and guests. Maintain separate privileges; never let guest routes serialize internal org/Stripe/fee/tax data. All mutations go via the vetted Next.js Server Action boundary and must be checked again in Convex. Protect the existing `checkoutPricing`, payment/webhook status, 001-999 order-number behavior, staff terminal session cookies and live order state machine unless proven change is required and tests are updated.

The setup wizard is persistent and validates actual readiness from server-side facts (not local checkbox state). Show required versus optional steps, safe return/resume, direct edit links, Stripe status, test order status, QR scan and print validation and a safe pause path. Test tablet pairing across reload/logout/expiry and invalid token. Keep existing POS manual-reconciliation guidance visible. Public table and pickup QR URLs remain correct; do not leak credentials in QR payloads. Maintain responsive container-aware dashboard layout, readable numbers, accessibility and reliable offline/error handling. Run Convex unit/integration and payment negative tests before every release.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.

## Merchant-owned payments and POS boundary

Prefer verified Stripe Connect Direct Charges owned by each restaurant's connected merchant account with Stripe-owned processing fees and connected-account negative-balance allocation, embedded Stripe onboarding and required Stripe agreement transparency. Reject platform-owned charge fallback when merchant processing fails. Zackisch charges 2% of the eligible captured restaurant order subtotal excluding voluntary tips **including any applicable VAT on Zackisch's own service fee**, with Stripe fees separate. The restaurant owes the guest a lawful fiscal receipt/invoice according to the applicable law; Zackisch's success document is only a non-fiscal order/payment confirmation. Record each already-paid order **once** in the restaurant's existing POS with auditable staff confirmation. Consult `../docs/payments-and-stripe.md`, `../docs/guest-confirmation-and-pos.md`, and `../docs/tax-invoicing-and-fiscalization.md` (from an app folder) or `docs/...` (from repository root). Sandbox account/payment flow may be structurally refactored; never modify real money or assert TSE exemption without independent approval.

<!-- ASTRYX:START -->
Astryx v0.7.1 · 168 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — Template-first search, never build screens from scratch:
1. When implementing or adapting ANY feature, screen, modal, or section, ALWAYS check templates first:
   - Run `astryx template --list` or `astryx search "<use-case>"` (e.g. login, settings, dashboard, dialog, sheet, form).
   - Scaffold or inspect the template: `astryx template <name> <path>` or `astryx template <Block>`.
   - Adapt its proven composition, frame, gap, and padding; replace the domain content.
2. Read component DOs and DONTs and props before using any component:
   - Run `astryx component <Name>` (e.g. `astryx component Button`, `astryx component Card`, `astryx component TextInput`).

STRICT ASTRYX COMPOSITION & DOS/DONTS RULES:
- Pure Astryx Composition: All screens across `app/` must be composed exclusively from native Astryx components (`AppShell`, `TopNav`, `SideNav`, `Layout`, `Card`, `VStack`, `HStack`, `Grid`, `Heading`, `Text`, `Badge`, `Button`, `TextInput`, `TextArea`, `CheckboxInput`, `SegmentedControl`, `Dialog`, `BottomSheet`, `Table`, `Divider`, `Icon`).
- Zero Arbitrary Custom Styling: No custom CSS, no rogue utility classes, no inline styles (`style={{ ... }}`). Spacing and layout adjustments are only permitted when strictly justified.
- Component DOs and DONTs Compliance:
  - At most ONE primary action button (`variant="primary"`) per screen or modal view. Secondary actions must be `secondary` or `ghost`.
  - Destructive actions require explicit confirmation dialogs or double-action safeguards (`variant="destructive"`).
  - Form controls MUST always have accessible labels (`label="..."`, or `isLabelHidden` if visually redundant, but never unlabelled).
  - Never wrap disabled components in Tooltips; use the built-in `disabledMessage` prop on buttons/actions instead.
  - Use `SegmentedControl` (or `Selector`) for mutually exclusive choices with 2-5 options (e.g. tip percentages, tabs, views), never loose custom button groups.
  - Spacing and alignment alone create visual grouping — do NOT wrap everything in cards. Use `Card` only for discrete, reorderable items.
  - Dense data = rows (`Table`, `List/Item`), not card-wrapped lists. `Badge` = counts and statuses only.
  - Style with component props first, then theme tokens (`var(--color-*|--spacing-*|--radius-*)`).
  - Palettes and custom colors go through the theme (`lib/zackisch-theme.tsx`), never `:root` overrides.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw `<div>`/`<span>`, imported `.css`/`@apply`, or hardcoded/arbitrary value (`bg-[#fff]`, `p-[13px]`) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands, API reference, integration authoring
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
