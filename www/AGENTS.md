# Public marketing site (www): agent rules

Visual contract: follow `../DESIGN.md`, Base UI primitives, Zackisch wrappers and canonical tokens, with League Spartan for UI. Existing layouts are not the redesign reference. Preserve the application-specific functional and security rules below.

Scope: `www/`, deployed as a static export (`out/`) to Cloudflare Pages without Cloudflare Workers or vinext. Prioritize the German owner decision journey: what Zackisch is, why the existing POS remains, how DIY onboarding works, compatible personal devices, cost/third-party fees, prerequisites, examples, and registration. Include real licensed photography of diverse hospitality contexts with documented asset provenance and descriptive alt text. Never fabricate testimonials or performance statistics; do not copy competitors' layouts. All visible language, metadata, structured-data and regional links use typed locale configuration maps (`localeConfigs`) and localized dictionary keys without inline locale ternary branching, keeping the i18n architecture clean and extensible for additional languages. Static routes `/de-de` and `/de-en` need canonical, hreflang, sitemap, noindex for private paths and accurate legal disclosure; `/` auto-selects `de-de` or `de-en` from browser language preferences and defaults to `de-de` (`defaultLocale`) when undetermined or unsupported. Only mention completed product features on live copy. Test build, 320px/mobile, keyboard, contrast, reduced motion and link integrity.

## Shared workflow and release rules

Inherit `../AGENTS.md`: work on main, mandatory current German/EU legal research for every change, Mobbin references and Impeccable for every UI change, Base UI, Playwright verification, reviewed incremental commits and per-package SemVer. Follow `../DESIGN.md` as the only visual specification. Only free commercially usable real internet stock photos; never AI-generated photography. Product image regions remain explicit text placeholders until actual screenshots exist.

All brand media and fonts are hosted only by `www/public/brand/`; this application uses `https://zackisch.com/brand/...` (www may use its own relative URL). Preserve the payment/POS, privacy, permission, backup and legal contracts in the root instructions. No production/provider effects without required explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Search and generative discovery

Keep server-rendered product facts concise, accurate and discoverable through real internal links. Maintain per-page title/description, canonical and reciprocal language alternates, crawlable assets, sitemap/robots, localized Open Graph and Twitter metadata with a working social image. Structured data must match visible verified facts; never publish sample addresses, invented ratings, prices or affiliations as schema facts. Follow current official Google Search Central and Bing Webmaster guidance for SEO and generative discovery; no hidden keyword/AI instruction stuffing or unsupported special-file promises. Test rendered head, JSON-LD and asset responses. Local crawlability is not live indexing: check production CDN/robots, verified webmaster properties and URL inspection after authorized deployment. Do not deploy or claim indexing from a local check.

## Public navigation behavior

Homepage section jumps use clean URLs, smooth scrolling and destination focus, with instant reduced-motion behavior. They gain only an underline on hover. Other-page links have a persistent optically centered Phosphor arrow without hover underlining. Other hosts, including subdomains and sources, open a new tab with noopener/noreferrer and localized accessible notice; same-host pages remain in the same tab. Brand-logo and mailto links retain their specific treatments. Registration CTAs share 19px text and 56px minimum height; compact header, mobile drawer and footer pills use 17px text and 48px minimum height.

A single coherent public heading, short standalone label or comma-separated heading omits its terminal full stop. Multi-sentence prose and legal text retain appropriate punctuation. Pricing and contact are homepage sections; the personal contact block is left-aligned. Branded 404s choose English only for /de-en paths, otherwise German; their language switch returns to the selected homepage. Valid routes preserve their slug when switching language.
