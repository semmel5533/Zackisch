# Merchant, staff and guest app: agent rules

Visual contract: follow `../DESIGN.md`, Base UI primitives, Zackisch wrappers and canonical tokens, with Lexend for UI. Existing layouts are not the redesign reference. Preserve the application-specific functional and security rules below.

Inherit `../AGENTS.md`. Scope: `app/` including the **sole** `app/convex/` backend. This application powers owners, staff tablets and guests. Maintain separate privileges; never let guest routes serialize internal org/Stripe/fee/tax data. All mutations go via the vetted Next.js Server Action boundary and must be checked again in Convex. Protect the existing `checkoutPricing`, payment/webhook status, 001-999 order-number behavior, staff terminal session cookies and live order state machine unless proven change is required and tests are updated.

The setup wizard is persistent and validates actual readiness from server-side facts (not local checkbox state). Show required versus optional steps, safe return/resume, direct edit links, Stripe status, test order status, QR scan and print validation and a safe pause path. Test tablet pairing across reload/logout/expiry and invalid token. Keep existing POS manual-reconciliation guidance visible. Public table and pickup QR URLs remain correct; do not leak credentials in QR payloads. Maintain responsive container-aware dashboard layout, readable numbers, accessibility and reliable offline/error handling. Run Convex unit/integration and payment negative tests before every release.

## Shared workflow and release rules

Inherit `../AGENTS.md`: work on main, mandatory current German/EU legal research for every change, Mobbin references and Impeccable for every UI change, Base UI, Playwright verification, reviewed incremental commits and per-package SemVer. Follow `../DESIGN.md` as the only visual specification. Only free commercially usable real internet stock photos; never AI-generated photography. Product image regions remain explicit text placeholders until actual screenshots exist.

All brand media and fonts are hosted only by `www/public/brand/`; this application uses `https://zackisch.com/brand/...` (www may use its own relative URL). Preserve the payment/POS, privacy, permission, backup and legal contracts in the root instructions. No production/provider effects without required explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
