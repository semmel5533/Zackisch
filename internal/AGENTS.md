# Team Dashboard: agent rules

Visual contract: follow `../DESIGN.md`, Base UI primitives, Zackisch wrappers and canonical tokens, with League Spartan for UI. Existing layouts are not the redesign reference. Preserve the application-specific functional and security rules below.

Inherit `../AGENTS.md`. Scope: `internal/`; public hostname `internal.zackisch.com`, product name **Team Dashboard**. Keep existing business, order, team, regional admin, partner-ledger, newsletter, email-log, 2FA and audit workflows functional while extending tickets. Maintain strict server-verified staff roles, permissions and region scopes; no broad implicit admin shortcuts. Protect member onboarding, OTP flow, time limits, audit redaction, newsletter unsubscribe compliance and real-payment data.

Ticket replies and internal notes MUST have separate typed operations and backend authorization, not just toggles. Test malicious cross-region ticket IDs, replay, attachment access and accidental note disclosure. Support assignment, queue filtering, status and auditable mutations. Keep interfaces compact and keyboard-operable; ensure destructive actions are confirmed and reversible where possible. No internal dashboards/indexing or sensitive logs exposed publicly. Read the security, operations, recovery and release sections in `../AGENTS.md` before touching these flows.

## Shared workflow and release rules

Inherit `../AGENTS.md`: work on main, mandatory current German/EU legal research for every change, Mobbin references and Impeccable for every UI change, Base UI, Playwright verification, reviewed incremental commits and per-package SemVer. Follow `../DESIGN.md` as the only visual specification. Only free commercially usable real internet stock photos; never AI-generated photography. Product image regions remain explicit text placeholders until actual screenshots exist.

All brand media and fonts are hosted only by `www/public/brand/`; this application uses `https://zackisch.com/brand/...` (www may use its own relative URL). Preserve the payment/POS, privacy, permission, backup and legal contracts in the root instructions. No production/provider effects without required explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
