# Root marketing site — agent rules

Visual contract: follow `../DESIGN.md`, Base UI primitives, Zackisch wrappers and canonical tokens, with League Spartan for UI. Existing layouts are not the redesign reference. Preserve the application-specific functional and security rules below.

Prioritize the German owner decision journey: what Zackisch is, why the existing POS remains, how DIY onboarding works, compatible personal devices, cost/third-party fees, prerequisites, examples, and registration. Include real licensed photography of diverse hospitality contexts with documented asset provenance and descriptive alt text. Never fabricate testimonials or performance statistics; do not copy competitors' layouts. All visible language and regional links use `next-intl` keys. Static routes `/de-de` and `/de-en` need canonical, hreflang, sitemap, noindex for private paths and accurate legal disclosure. Only mention completed product features on live copy. Test build, 320px/mobile, keyboard, contrast, reduced motion and link integrity.

## Shared workflow and release rules

Inherit `../AGENTS.md`: work on main, mandatory current German/EU legal research for every change, Mobbin references and Impeccable for every UI change, Base UI, Playwright verification, reviewed incremental commits and per-package SemVer. Follow `../DESIGN.md` as the only visual specification. Only free commercially usable real internet stock photos; never AI-generated photography. Product image regions remain explicit text placeholders until actual screenshots exist.

All brand media and fonts are hosted only by `root/public/brand/`; this application uses `https://zackisch.com/brand/...` (root may use its own relative URL). Preserve the payment/POS, privacy, permission, backup and legal contracts in the root instructions. No production/provider effects without required explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
