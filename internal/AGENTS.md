# Team Dashboard — agent rules

Inherit `../AGENTS.md`. Scope: `internal/`; public hostname `internal.zackisch.com`, product name **Team Dashboard**. Keep existing organization, order, team, regional admin, partner-ledger, newsletter, email-log, 2FA and audit workflows functional while extending tickets. Maintain strict server-verified staff roles, permissions and region scopes; no broad implicit admin shortcuts. Protect member onboarding, OTP flow, time limits, audit redaction, newsletter unsubscribe compliance and real-payment data.

Ticket replies and internal notes MUST have separate typed operations and backend authorization, not just toggles. Test malicious cross-region ticket IDs, replay, attachment access and accidental note disclosure. Support assignment, queue filtering, status and auditable mutations. Keep interfaces compact and keyboard-operable; ensure destructive actions are confirmed and reversible where possible. No internal dashboards/indexing or sensitive logs exposed publicly. Read `../docs/operations.md` and `../docs/security.md` before touching these flows.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.
