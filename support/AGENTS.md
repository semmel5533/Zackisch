# Support app — agent rules

Inherit `../AGENTS.md`. Scope: `support/`; Cloudflare Workers/vinext, Next.js 16, React, Tailwind, Base UI and `next-intl`. Use shared `../app/convex` only. Public regional knowledge-base content at `/de-de` and `/de-en` is readable without login and crawlable where appropriate. Private `/tickets` routes require the existing account's secure identity, verified business ownership and a region match; no second user store. Ensure deep links retain locale and return safely after login.

Each article has verified current UI steps, prerequisites, check result, troubleshooting, ownership and update policy. Search handles synonyms, spelling variants, empty results and keyboard navigation. Ticket thread, attachments and notifications are private; customer queries must never include team-only notes. Validate rich text, file type/size, rate limits, spam and cross-tenant access. Test authenticated cross-subdomain transitions, revocation and open redirects, plus noindex of ticket URLs.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.
