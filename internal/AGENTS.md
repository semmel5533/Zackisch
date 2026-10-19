# Team Dashboard — agent rules

Inherit `../AGENTS.md`. Scope: `internal/`; public hostname `internal.zackisch.com`, product name **Team Dashboard**. Keep existing business, order, team, regional admin, partner-ledger, newsletter, email-log, 2FA and audit workflows functional while extending tickets. Maintain strict server-verified staff roles, permissions and region scopes; no broad implicit admin shortcuts. Protect member onboarding, OTP flow, time limits, audit redaction, newsletter unsubscribe compliance and real-payment data.

Ticket replies and internal notes MUST have separate typed operations and backend authorization, not just toggles. Test malicious cross-region ticket IDs, replay, attachment access and accidental note disclosure. Support assignment, queue filtering, status and auditable mutations. Keep interfaces compact and keyboard-operable; ensure destructive actions are confirmed and reversible where possible. No internal dashboards/indexing or sensitive logs exposed publicly. Read `../docs/operations.md` and `../docs/security.md` before touching these flows.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.

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
- Pure Astryx Composition: All screens across `internal/` must be composed exclusively from native Astryx components (`AppShell`, `TopNav`, `SideNav`, `Layout`, `Card`, `VStack`, `HStack`, `Grid`, `Heading`, `Text`, `Badge`, `Button`, `TextInput`, `TextArea`, `CheckboxInput`, `SegmentedControl`, `Dialog`, `BottomSheet`, `Table`, `Divider`, `Icon`).
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

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
