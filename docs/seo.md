# SEO & multilingual indexing reference

This document describes the current SEO and i18n search indexing implementation of the zakkig marketing website (`website/`). It is a source-grounded state reference for agents and developers — not a wish list. Update this file when the implementation changes.

Last verified: 2026-09-23. Next.js 16.3.4 (`output: "export"`, fully static HTML), deployed on Cloudflare Pages.

---

## Locale architecture

| Locale path | Language | hreflang | Target audience |
|-------------|----------|----------|-----------------|
| `/de-de` | German | `de-DE` | German-speaking users in Germany |
| `/de-en` | English | `en-DE` | English-speaking users in Germany |

- Locale scheme: custom `{region}-{lang}` path segment (`de-de`, `de-en`). BCP 47 codes (`de-DE`, `en-DE`) are used in hreflang and OG locale — no crawl errors.
- `DEFAULT_LOCALE = "de-de"`, `ALL_LOCALES = ["de-de", "de-en"]`, defined in [`lib/regions.ts`](../website/lib/regions.ts).
- No `i18n` config block in [`next.config.ts`](../website/next.config.ts) — routing handled entirely via the `[locale]` path segment, which is the correct pattern for `output: "export"`.

---

## Static export constraints

The website uses `output: "export"` in `next.config.ts`, producing flat static HTML. This has several SEO implications agents must understand:

- **No dynamic `app/sitemap.ts` or `app/robots.ts`** — use `public/sitemap.xml` and `public/robots.txt` for these.
- **No server-side headers, redirects, or rewrites at build time** — all redirects run through Cloudflare Pages `public/_redirects`.
- **`<html lang>` is hardcoded to `"de"` in the root layout** — nested `[locale]/layout.tsx` cannot override the `<html>` tag in static export. This is a known limitation. Google primarily evaluates hreflang links and `og:locale`, both of which are correctly set per locale.
- **Root `/` is handled by Cloudflare Pages `_redirects`** (`/ /de-de 301`) so Googlebot receives a real 301 instead of a JS spinner. The JS fallback in [`app/page.tsx`](../website/app/page.tsx) still runs for users with cookie or localStorage locale preferences arriving after the redirect.

---

## Route inventory and metadata status

| Route | Indexed | Canonical set | hreflang | OG locale | noindex |
|-------|---------|--------------|----------|-----------|---------|
| `/de-de` | Yes | Yes | Yes | `de_DE` | No |
| `/de-en` | Yes | Yes | Yes | `en_US` | No |
| `/de-de/privacy-policy` | Yes | Yes | Yes | `de_DE` | No |
| `/de-en/privacy-policy` | Yes | Yes | Yes | `en_US` | No |
| `/de-de/legal-notice` | Yes | Yes | Yes | `de_DE` | No |
| `/de-en/legal-notice` | Yes | Yes | Yes | `en_US` | No |
| `/de-de/gtc` | Yes | Yes | Yes | `de_DE` | No |
| `/de-en/gtc` | Yes | Yes | Yes | `en_US` | No |
| `/de-de/privacy` | redirect | — | — | — | — |
| `/de-en/privacy` | redirect | — | — | — | — |
| `/de-de/legal` | redirect | — | — | — | — |
| `/de-en/legal` | redirect | — | — | — | — |
| `/_not-found` (404) | No | No | No | — | Yes (noindex in metadata) |
| `/` | 301 → `/de-de` | — | — | — | — |

Legal pages (Impressum, Datenschutzerklärung, AGB) are indexed. They contain substantial content (~18 KB each), support E-E-A-T trust signals in the German market, and are commonly searched by name. All indexed legal pages carry `alternates.languages` hreflang tags and `openGraph.url` via [`lib/legal.ts`](../website/lib/legal.ts).

---

## Metadata implementation

### Root layout — [`app/layout.tsx`](../website/app/layout.tsx)

- `metadataBase`: `https://www.zakkig.com`
- `title.default`: German title as fallback (`"zakkig: Bestellen und Bezahlen per QR-Code"`)
- `title.template`: `"zakkig: %s"`
- `openGraph.locale`: `"de_DE"` (fallback; overridden per locale in page-level metadata)
- `openGraph.images`: `/og_image.png`
- `twitter.card`: `"summary_large_image"`
- `viewport.themeColor`: `"#000000"`
- `icons.icon` / `icons.apple`: `/icon.png`
- **Known limitation:** `<html lang="de">` is hardcoded and cannot be dynamically set per locale in static export mode. Google uses hreflang and og:locale as primary language signals; this is documented as an architectural constraint.

### Homepage per locale — [`app/[locale]/page.tsx`](../website/app/%5Blocale%5D/page.tsx)

- `title.absolute`: locale-specific (`t.metaTitle`)
- `description`: locale-specific (`t.metaDescription`)
- `openGraph.url`: canonical locale URL (e.g. `https://www.zakkig.com/de-de`)
- `openGraph.locale`: `"de_DE"` or `"en_US"` dynamically
- `robots.index / follow`: `true`
- `alternates.canonical`: `https://www.zakkig.com/{locale}`
- `alternates.languages`:
  - `"de-DE"` → `https://www.zakkig.com/de-de`
  - `"en-DE"` → `https://www.zakkig.com/de-en`
  - `"x-default"` → `https://www.zakkig.com/de-de`

### Legal pages — [`lib/legal.ts`](../website/lib/legal.ts)

Shared `legalMetadata(locale, kind)` helper used by all legal page routes. Provides `title`, `description`, `robots` (index/follow), `alternates.canonical`, `alternates.languages` (hreflang for `de-DE`, `en-DE`, `x-default`), `openGraph` with `url`, and `twitter`.

### 404 page — [`app/not-found.tsx`](../website/app/not-found.tsx)

Server component (no `"use client"`). Metadata: `title: "Seite nicht gefunden"`, `robots: { index: false, follow: false }`. Text is always German (`translations.de`) since the 404 has no locale context from the URL.

---

## Sitemap and robots

- **`public/robots.txt`**: allows all crawlers, references `https://www.zakkig.com/sitemap.xml`.
- **`public/sitemap.xml`**: hand-maintained static file. Contains `/de-de` and `/de-en` with correct `xhtml:link` alternate hreflang tags and `<lastmod>`. Legal pages are correctly excluded (noindexed). **Must be updated manually if new indexable routes are added.**
- **`public/_redirects`**: Cloudflare Pages redirect rules. Includes `/ /de-de 301` (root server-side redirect for Googlebot), legal alias redirects, and common German shortcut paths (`/impressum`, `/datenschutz`, `/agb`, `/terms`).

---

## Structured data (JSON-LD)

Inline `<script type="application/ld+json">` in `@graph` format on the homepage only ([`app/[locale]/page.tsx`](../website/app/%5Blocale%5D/page.tsx)):

| Schema type | `@id` | Notes |
|-------------|-------|-------|
| `Organization` | `#organization` | `name`, `url`, `logo`, `sameAs` (MARS) |
| `SoftwareApplication` | `#application` | `applicationCategory: "BusinessApplication"`, `offers.description` clarifies the 2% fee model |
| `WebSite` | `#website` | `url`, `name`, `publisher`, `inLanguage` (locale-dynamic) |
| `FAQPage` | `#faq` | All 13 FAQ questions and answers from `landing-translations.ts`; locale-specific |

The `FAQPage` schema makes the FAQ section eligible for Google Rich Results (expandable Q&A directly in search results).

---

## i18n translation structure

| File | Purpose |
|------|---------|
| [`lib/translations.ts`](../website/lib/translations.ts) | Master `{ de, en }` object — merges landing and legal translations and adds top-level SEO and shared UI keys |
| [`lib/landing-translations.ts`](../website/lib/landing-translations.ts) | All landing page UI copy (~100 keys per locale), including all FAQ question/answer pairs |
| [`lib/legal-translations.ts`](../website/lib/legal-translations.ts) | Legal page titles, descriptions, `openGraphLocale` per locale |
| [`lib/i18n.ts`](../website/lib/i18n.ts) | `useTranslation()` hook — client-side path-based locale detection |
| [`lib/regions.ts`](../website/lib/regions.ts) | Locale/region registry and `parseLocale()` |

Metadata keys: `metaTitle`, `metaDescription` in `translations.ts`; `legalTitle`, `privacyTitle`, `gtcTitle`, and corresponding `*Description` and `*Url` keys in `legal-translations.ts`.

OG title and description always reuse `metaTitle` / `metaDescription` — no separate `ogTitle` / `ogDescription` keys exist.

---

## OG image

A single shared static file `public/og_image.png` is used for all pages and locales. No locale-specific or dynamically generated OG images exist. `public/icon.png` is used as favicon and Apple touch icon.

---

## Known gaps and future improvements

| ID | Gap | Impact | Location |
|----|-----|--------|----------|
| G1 | `<html lang="de">` hardcoded — English pages at `/de-en` ship with wrong lang attribute | Accessibility (screen readers); low SEO impact since hreflang is correct | `app/layout.tsx:59` — architectural constraint of static export |
| G2 | Sitemap is hand-maintained with no automated `<lastmod>` updates | May cause stale crawl signals if content changes frequently | `public/sitemap.xml` |
| G3 | Legal `*Description` values are short (21–44 chars) | Thin OG share preview text for social shares of legal pages (low priority — pages are noindexed) | `lib/legal-translations.ts` |
| G4 | No locale-specific OG images | Same image for all locales/pages | `public/og_image.png` |
| G5 | `Organization` JSON-LD lacks `contactPoint`, `email`, or postal `address` | Richer knowledge graph; optional | `app/[locale]/page.tsx` |
