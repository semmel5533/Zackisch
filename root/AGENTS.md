# Root marketing site — agent rules

Inherit `../AGENTS.md`. Scope: `root/` (`package.json` name `root`, public `zackisch.com`). Deploy with a verified Next.js/vinext Cloudflare Workers build, retaining pre-rendered/static output where appropriate. Do not enable unnecessary request-time rendering; no direct server secrets or private Convex data in generated HTML. Follow `../docs/brand-content.md`, `../docs/design-system.md`, `../docs/localization-and-compliance.md`.

Prioritize the German owner decision journey: what Zackisch is, why the existing POS remains, how DIY onboarding works, compatible personal devices, cost/third-party fees, prerequisites, examples, and registration. Include real licensed photography of diverse hospitality contexts with documented asset provenance and descriptive alt text. Never fabricate testimonials or performance statistics; do not copy competitors' layouts. All visible language and regional links use `next-intl` keys. Static routes `/de-de` and `/de-en` need canonical, hreflang, sitemap, noindex for private paths and accurate legal disclosure. Only mention completed product features on live copy. Test build, 320px/mobile, keyboard, contrast, reduced motion and link integrity.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.
