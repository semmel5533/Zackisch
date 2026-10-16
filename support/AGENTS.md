# Support app — agent rules

Inherit `../AGENTS.md`. Scope: `support/`; Cloudflare Workers/vinext, Next.js 16, React 19, Tailwind CSS 4, `@zackisch/design-system` (Base UI, Poppins tokens), and `next-intl`. Use shared `../app/convex` only. Brand assets are loaded exclusively from `https://zackisch.com/*`. Public knowledge-base content (`/de-de` and `/de-en`, categories, articles) is fully server-rendered (SSR) with dynamic `generateMetadata`, `generateStaticParams`, Breadcrumb/Article JSON-LD, and an automated `sitemap.ts` containing all 98 localized pages.

Private `/tickets` routes enforce `robots: { index: false, follow: false }` and require an authenticated session token validated against `supportSessions`; never trust client email query parameters. Ensure deep links retain locale and return safely after login. Each article has verified current UI steps, prerequisites, check result, troubleshooting, ownership and update policy without unsubstantiated setup time claims. Search is interactive and client-side via `SupportSearch`. Ticket threads, attachments and notifications are private; customer queries must never include team-only notes. Validate rich text, file type/size, rate limits, spam and cross-tenant access.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.
