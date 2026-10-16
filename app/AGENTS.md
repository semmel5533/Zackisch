# Merchant, staff and guest app — agent rules

Inherit `../AGENTS.md`. Scope: `app/` including the **sole** `app/convex/` backend. This application powers owners, staff tablets and guests. Maintain separate privileges; never let guest routes serialize internal org/Stripe/fee/tax data. All mutations go via the vetted Next.js Server Action boundary and must be checked again in Convex. Protect the existing `checkoutPricing`, payment/webhook status, 001-999 order-number behavior, staff terminal session cookies and live order state machine unless proven change is required and tests are updated.

The setup wizard is persistent and validates actual readiness from server-side facts (not local checkbox state). Show required versus optional steps, safe return/resume, direct edit links, Stripe status, test order status, QR scan and print validation and a safe pause path. All UI primitives and shared components are imported from `@zackisch/design-system`. Brand assets must not be stored in `app/public/`; import them via `BRAND_ASSETS` pointing to `https://zackisch.com/*`. Test tablet pairing across reload/logout/expiry and invalid token. Keep existing POS manual-reconciliation guidance visible. Public table and pickup QR URLs remain correct; do not leak credentials in QR payloads. Maintain responsive container-aware dashboard layout, readable numbers, accessibility and reliable offline/error handling. Run Convex unit/integration and payment negative tests before every release.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.

## Merchant-owned payments and POS boundary

Prefer verified Stripe Connect Direct Charges owned by each restaurant's connected merchant account with Stripe-owned processing fees and connected-account negative-balance allocation, embedded Stripe onboarding and required Stripe agreement transparency. Reject platform-owned charge fallback when merchant processing fails. Zackisch charges 2% of the eligible captured restaurant order subtotal excluding voluntary tips **including any applicable VAT on Zackisch's own service fee**, with Stripe fees separate. The restaurant owes the guest a lawful fiscal receipt/invoice according to the applicable law; Zackisch's success document is only a non-fiscal order/payment confirmation. Record each already-paid order **once** in the restaurant's existing POS with auditable staff confirmation. Consult `../docs/payments-and-stripe.md`, `../docs/guest-confirmation-and-pos.md`, and `../docs/tax-invoicing-and-fiscalization.md` (from an app folder) or `docs/...` (from repository root). Sandbox account/payment flow may be structurally refactored; never modify real money or assert TSE exemption without independent approval.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
