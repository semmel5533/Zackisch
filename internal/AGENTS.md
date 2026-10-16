# Team Dashboard — agent rules

Inherit `../AGENTS.md`. Scope: `internal/`; public hostname `internal.zackisch.com`, product name **Team Dashboard**. Uses `@zackisch/design-system` (Base UI, Poppins tokens) and loads brand assets exclusively from `https://zackisch.com/*`. Enforce `robots: { index: false, follow: false }` across all routes. Keep existing business, order, team, regional admin, partner-ledger, newsletter, email-log, 2FA and audit workflows functional.

Maintain strict server-verified staff session tokens; `requireTeamPermission` mandates valid cryptographic sessions and checks role-based permissions (`tickets:view`, `tickets:note`) and regional boundaries. Never trust unverified client emails. Ticket replies and internal notes MUST have separate typed operations and backend authorization, not just toggles. Test malicious cross-region ticket IDs, replay, attachment access and accidental note disclosure. Support assignment, queue filtering, status and auditable mutations. Keep interfaces compact and keyboard-operable; ensure destructive actions are confirmed and reversible where possible. Read `../docs/operations.md` and `../docs/security.md` before touching these flows.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
