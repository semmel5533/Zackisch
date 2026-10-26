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

All four applications use `DESIGN.md` as their sole visual specification. Build accessible interaction with `@base-ui/react` and focused Zackisch wrappers using the canonical design tokens. Use semantic native HTML where appropriate. Inter is the only UI and reading typeface; tabular numbers are required for prices and metrics. The decorative Zackisch font is a display prototype for short reviewed accents, never functional UI or the official logo. Use the unchanged official Combination Mark and Brand Mark SVG masters under `assets/zackisch/brand/`.

Read the installed Base UI API before using a primitive. Token-backed CSS, CSS Modules or Tailwind are permitted; do not introduce a second theme or component library. Match composition, density and controls to the guest, owner, staff, support or internal task. Preserve behavior while replacing legacy components incrementally; remove old dependencies only after their consumers are migrated and tested.

Use the existing Phosphor icon set for functional icons where needed; supplied doodles and mascots follow the placement rules in `DESIGN.md`. Never put icons on inline form error messages. Use actual licensed photography with documented provenance. Guest headers prioritize the venue identity. Physical QR cards have no venue name or logo, one small official Zackisch Combination Mark, a true scannable QR, table/pickup identity and the personal-service alternative. Follow the 92 × 135 mm, four-per-A4 and duplex rules in `DESIGN.md`; verify actual QR payloads and physical printing separately.

All visible UI strings, ARIA text, notices and localized links use `next-intl` keys or localized dictionary lookups; do not hardcode German/English strings in components. Region and language are distinct concepts: `/de-de` and `/de-en` on public sites, server-authoritative business region elsewhere.

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

`DESIGN.md` is the normative visual contract, not evidence of implementation or legal approval. Keep verified current product behavior in README files and technical documentation. Keep migration plans, baseline logs, screenshots and approval evidence outside the product repository. Preserve security, payment, fiscal, session, backup and release contracts when updating visual instructions.

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

## UI interaction checks

- Use one dominant primary action per task area or modal; navigation uses links.
- Confirm destructive actions with explicit consequences and action labels.
- Provide visible labels, associated descriptions and persistent inline errors; retain input after failure.
- Use radios or a segmented control for mutually exclusive choices, checkboxes for independent choices, and tables for dense comparisons.
- Verify keyboard navigation, focus trapping/return, disabled/loading behavior, touch targets, reduced motion, reflow and contrast.
- Show payment success only after authoritative server confirmation. Keep POS recording separate from preparation state.
- Do not install Hallmark without explicit approval and source review; if approved, use only custom/bespoke critique against `DESIGN.md`.
