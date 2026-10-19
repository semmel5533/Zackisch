# Zackisch — repository-wide agent and engineering rules

Scope: the complete repository. Read the nested `AGENTS.md` in `root/`, `app/`, `support/` and `internal/` before touching that application. The README files are German; this file, nested AGENTS files and the remaining `docs/*.md` are English. The final documentation describes only verified current functionality; speculative or temporary implementation plans belong in issues or external delivery workbooks, not repository documentation.

## Product invariants

Zackisch supplements, rather than replaces, the existing hospitality POS. Guests may use optional mobile QR ordering and payment without app installation or account registration. Owner self-service, transparent usage-linked 2% fee plus payment-provider fees, use of compatible existing devices, manual POS recording and graceful fallback are non-negotiable. Preserve and test current checkout, financial ledgers, staff processing, account permissions, partners and newsletter functions. Never claim uninterrupted service, certified compliance or zero total cost without proof.

## Canonical topology

- `root/` (`name: root`): static/public `zackisch.com`.
- `app/` (`name: app`): `app.zackisch.com`, merchant, guest, staff, sole Convex project under `app/convex/`.
- `support/` (`name: support`): `support.zackisch.com`, public localized help and private tickets.
- `internal/` (`name: internal`): `internal.zackisch.com`, Team Dashboard for authorized Zackisch personnel.
- `docs/`: canonical English technical, brand and operational documentation.

No second Convex project or database. Do not create more global packages than the actual implementation can justify. Maintain clear dependencies: UI -> validated application boundary -> authenticated/authorized domain operation -> Convex persistence/provider integration. Business rules, pricing and ownership checks belong on trusted server boundaries; a client business ID, region ID or menu price is never authority. All client-triggered Convex mutations must follow the established Next.js Server Action boundary; exceptions require security-reviewed architecture decision and tests.

## Framework and UI

Before changing Next.js code, read version-matched guidance from installed `node_modules/next/dist/docs/` and verify that APIs work with Cloudflare Workers/vinext. Follow the active Next.js 16 `proxy.ts` convention where applicable, not obsolete middleware guidance. Prefer ESM, strict TypeScript, narrow domain modules and explicit contracts.

All UI screens across `internal`, `support`, and `app` are built exclusively with the Astryx Design System (`@astryxdesign/core`, `@stylexjs/stylex`, `@astryxdesign/theme-neutral`). Layout, containers, forms, typography, and navigation use pure Astryx components (`AppShell`, `TopNav`, `SideNav`, `Layout`, `Card`, `VStack`, `HStack`, `Grid`, `Heading`, `Text`, `Badge`, `Button`, `TextInput`, `TextArea`, `Selector`, `CheckboxInput`, `Table`, `Divider`, `Icon`). Theming is managed via `lib/zackisch-theme.tsx` extending the neutral theme with Zackisch monochrome palette, slightly rounded corners (`radius: { base: 4, multiplier: 1 }`), Poppins for headings/body, and Inter tabular numbers for prices/metrics.

Use Astryx built-in semantic icon names where supported; for external iconography use Phosphor icons (`@phosphor-icons/react`) passed to Astryx's `<Icon icon={PhosphorIcon} size="sm" />`. Never put icons on inline form error messages. Visual storytelling leverages curated free-to-use stock imagery. All visible UI strings, ARIA text, notices and localized links use `next-intl` keys or localized dictionary lookups; do not hardcode German/English strings in components. Region and language are distinct concepts: `/de-de` and `/de-en` on public sites, server-authoritative business region elsewhere.

Maintain predictable interaction: explicit action labels, keyboard focus, logical tab order, clearly visible validation, proper empty/loading/error/offline states, WCAG 2.2 AA objective, responsive container-aware dashboards. Never modify real checkout disclosure or button wording solely for styling without testing applicable consumer purchase requirements.

## Security and data integrity

Use defense in depth across Cloudflare request boundaries, application actions, Convex queries/mutations/actions, storage and outbound calls. Verify actor, tenant/business, region, resource ownership and action in **every** sensitive operation. Separate customer-visible ticket messages from employee-only notes at the authorization and query layers, not only with a CSS toggle. Staff pairing credentials, ops sessions, account recovery and cross-subdomain sign-in require separate scopes, strict expiry, secure HttpOnly cookies when appropriate, token rotation/revocation, CSRF/Origin controls, rate limits and verified logout. Do not indiscriminately share browser cookies across all subdomains.

Never trust browser totals or order IDs; reconstruct price from canonical menu data and enforce payment/webhook idempotency. No secrets, OTPs, token URLs, customer PII, sensitive attachments or Stripe accounting fields in public responses/logs. Use structured redacted logging and auditable privileged actions. Strict allowed MIME types, scan/size limits and private access policies for uploaded files; sanitize rich text and prevent stored XSS. Validate SSRF, IDOR, CSRF, origin, replay, abuse/resource exhaustion, Stripe signature verification, retention and data deletion. **Do not call any system 100% secure.** Consult `docs/security.md`.

## Germany legal, fiscal and Stripe constraints

Read `docs/germany-legal-and-regulatory.md`, `docs/payments-and-stripe.md`, `docs/tax-invoicing-and-fiscalization.md`, `docs/privacy-and-data-governance.md` and `docs/legal-pages-consents-and-contracts.md` for any change involving payment, company legal content, personal data, tax, menus, receipts, merchant signup, guest purchase, tickets, analytics, retention or invoices. No approved lawyer opinion can be inferred from technical tests. Require evidence of seller/merchant-of-record identity, checkout button and price disclosure, Stripe account capability, 2% tax treatment, refunds, accounting and effective contract version. German food/drink VAT, fiscalization and e-invoice requirements are not interchangeable with Zackisch's B2B invoice obligations. Do not store card PAN/CVC, identification docs or secrets. Never create a new payment charge type as an invisible refactor.


## Quality and architecture

Keep files focused; splitting a file beyond roughly 1,000 lines is normally preferable if it reduces actual conceptual complexity. Do not add shallow wrappers or branches merely to make the file count smaller. Make state machines explicit for checkout, ticket handling, pairing and wizard progress. Use stable clear names, not historical product names. Reuse existing helpers only when their actual responsibility matches. Make related database updates atomic where supported, externally retried effects idempotent, and avoid unnecessary sequential calls. Review dependency supply chain, Cloudflare runtime compatibility and destructive behavior before installation or upgrade.

For every substantive change add/adjust unit, integration and E2E coverage; include negative permission tests, mobile/print/a11y flows and provider failure handling. Run actual builds/tests and report failures, never infer success from source reading. Follow `docs/testing-and-release.md` and the current release gates. Production DNS, destructive migrations/restores, genuine payments, broadcast email, secrets and deployment require explicit human authorization.

## Documentation and maintenance


## Commits and Semantic Versioning — preserve repository convention

- Commit messages: English, 100% lowercase, past-tense action, concise technical scope, no terminal punctuation, no emoji, no Conventional Commit prefix; join related actions with `and`.
- Examples: `added support ticket replies on internal and updated authorization tests`; `updated qr print templates on app and corrected locale links`.
- Commit identity: `Selim Eser <semmel5533@gmail.com>` as specified by repository owner; verify configured identity.
- Independent versions per `root`, `app`, `support`, `internal` in both package and lockfile. Apply patch for bug fixes/refactors/text/styling, minor for features/routes/schema. Evaluate all affected packages before **each** commit.
- Never advance to `1.0.0` or another MAJOR without explicit project-owner approval. Do not treat the broad release assignment as that approval.

## Agent operating procedure

Read before editing, map dependencies, implement in small reversible changes, validate affected code and cross-app contracts, run security/quality checks again after fixes, sync docs, then commit. Seek human action only for an actually necessary permission, credential, legal sign-off, production cutover or irreversible action; work autonomously on other tasks. Keep operational status and audit evidence outside the current-state docs.

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
- Pure Astryx Composition: All screens across `app/`, `internal/`, and `support/` must be composed exclusively from native Astryx components (`AppShell`, `TopNav`, `SideNav`, `Layout`, `Card`, `VStack`, `HStack`, `Grid`, `Heading`, `Text`, `Badge`, `Button`, `TextInput`, `TextArea`, `CheckboxInput`, `SegmentedControl`, `Dialog`, `BottomSheet`, `Table`, `Divider`, `Icon`).
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
- SELF-CHECK: re-read the file; replace any raw `<div>`/`<span>`, imported `.css`/`@apply`, or hardcoded `#hex`/`px` with the component or a token.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands, API reference, integration authoring
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->
