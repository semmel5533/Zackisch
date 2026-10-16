# Root marketing site — agent rules

Inherit `../AGENTS.md`. Scope: `root/` (`package.json` name `root`, public `zackisch.com`). Build with Next.js static export (`output: "export"`). This application serves as the single canonical host for all Zackisch brand assets under `public/` (`brand_mark`, `combination_mark`, `word_mark`, icons, and OpenGraph images) consumed across the ecosystem via `@zackisch/design-system`. Follow `../docs/brand-content.md`, `../docs/design-system.md`, `../docs/localization-and-compliance.md`.

Prioritize the German owner decision journey: what Zackisch is, why the existing POS remains, how DIY onboarding works, compatible personal devices, cost/third-party fees, prerequisites, examples, and registration. All UI components must use `@zackisch/design-system`. Never fabricate testimonials or performance statistics; do not copy competitors' layouts. All visible language and regional links use `next-intl` keys. Static routes `/de-de` and `/de-en` need canonical, hreflang, sitemap, and accurate legal disclosure. Only mention completed product features on live copy. Test build, 320px/mobile, keyboard, contrast, reduced motion and link integrity.

## Legal, payment and privacy guardrails

Follow root `AGENTS.md` and canonical `docs/germany-legal-and-regulatory.md`, `docs/privacy-and-data-governance.md`, and `docs/legal-pages-consents-and-contracts.md`. If this application handles checkout, Stripe, merchant registration, tax receipts or billing, also follow `docs/payments-and-stripe.md` and `docs/tax-invoicing-and-fiscalization.md`. Never assume a draft agreement is approved, or publish an unverified legal guarantee. Original Poppins-based wordmark and logo assets remain authoritative.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
