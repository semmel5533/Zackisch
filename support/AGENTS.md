# Support app: agent rules

Visual contract: follow `../DESIGN.md`, Base UI primitives, Zackisch wrappers and canonical tokens, with League Spartan for UI. Existing layouts are not the redesign reference. Preserve the application-specific functional and security rules below.

Inherit `../AGENTS.md`. Scope: `support/`; Cloudflare Workers/vinext, Next.js 16, React, Tailwind, Base UI and `next-intl`. Use shared `../app/convex` only. Public regional knowledge-base content at `/de-de` and `/de-en` is readable without login and crawlable where appropriate. Private `/tickets` routes require the existing account's secure identity, verified business ownership and a region match; no second user store. Ensure deep links retain locale and return safely after login.

Each article has verified current UI steps, prerequisites, check result, troubleshooting, ownership and update policy. Search handles synonyms, spelling variants, empty results and keyboard navigation. Ticket thread, attachments and notifications are private; customer queries must never include team-only notes. Validate rich text, file type/size, rate limits, spam and cross-tenant access. Test authenticated cross-subdomain transitions, revocation and open redirects, plus noindex of ticket URLs.

## Shared workflow and release rules

Inherit `../AGENTS.md`: work on main, mandatory current German/EU legal research for every change, Mobbin references and Impeccable for every UI change, Base UI, Playwright verification, reviewed incremental commits and per-package SemVer. Follow `../DESIGN.md` as the only visual specification. Only free commercially usable real internet stock photos; never AI-generated photography. Product image regions remain explicit text placeholders until actual screenshots exist.

All brand media and fonts are hosted only by `root/public/brand/`; this application uses `https://zackisch.com/brand/...` (root may use its own relative URL). Preserve the payment/POS, privacy, permission, backup and legal contracts in the root instructions. No production/provider effects without required explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
