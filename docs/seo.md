# SEO- und Mehrsprachigkeits-Referenz

Dieses Dokument beschreibt die technische Umsetzung von Suchmaschinenoptimierung (SEO) und mehrsprachiger Indexierung der Zackisch-Marketing-Website (`website/`).

Stand: Oktober 2026. Next.js 16.3.4 (`output: "export"`, rein statisches HTML), bereitgestellt über Cloudflare Pages.

---

## Sprach- und Regionsarchitektur

| Pfad | Sprache | hreflang | Zielgruppe |
| --- | --- | --- | --- |
| `/de-de` | Deutsch | `de-DE` | Deutschsprachige Nutzer in Deutschland |
| `/de-en` | Englisch | `en-DE` | Englischsprachige Nutzer in Deutschland |

- **Schema:** Pfadsegment `{region}-{sprache}` (`de-de`, `de-en`). Standardisierte BCP-47-Codes (`de-DE`, `en-DE`) in `hreflang` und `og:locale`.
- **Konfiguration:** `DEFAULT_LOCALE = "de-de"`, `ALL_LOCALES = ["de-de", "de-en"]` in [`lib/regions.ts`](../website/lib/regions.ts).
- Routing erfolgt vollständig über das Next.js-Pfadsegment `[locale]`.

---

## Statischer Export und Plattform-Rahmenbedingungen

Die Website nutzt `output: "export"` in `next.config.ts` zur Erzeugung statischer HTML-Dateien:

- **Robots und Sitemap:** Statische Bereitstellung über `public/robots.txt` und `public/sitemap.xml`.
- **Server-Header und Weiterleitungen:** Primäre Weiterleitungen (wie der Einstieg von `/` auf `/de-de`) werden über Cloudflare Pages `public/_redirects` (`/ /de-de 301`) ausgeführt.
- **Wurzel-HTML-Attribut:** `<html lang="de">` im Root-Layout definiert. Suchmaschinen werten primär die seitenspezifischen `hreflang`-Verlinkungen und `og:locale` aus.

---

## Routenübersicht und Metadaten-Status

| Route | Indexiert | Canonical gesetzt | hreflang | OG-Locale | noindex |
| --- | --- | --- | --- | --- | --- |
| `/de-de` | Ja | Ja | Ja | `de_DE` | Nein |
| `/de-en` | Ja | Ja | Ja | `en_US` | Nein |
| `/de-de/privacy-policy` | Ja | Ja | Ja | `de_DE` | Nein |
| `/de-en/privacy-policy` | Ja | Ja | Ja | `en_US` | Nein |
| `/de-de/legal-notice` | Ja | Ja | Ja | `de_DE` | Nein |
| `/de-en/legal-notice` | Ja | Ja | Ja | `en_US` | Nein |
| `/de-de/gtc` | Ja | Ja | Ja | `de_DE` | Nein |
| `/de-en/gtc` | Ja | Ja | Ja | `en_US` | Nein |
| `/_not-found` (404) | Nein | Nein | Nein | — | Ja (`noindex` gesetzt) |
| `/` | 301 → `/de-de` | — | — | — | — |

Rechtliche Seiten (Impressum, Datenschutzerklärung, AGB) sind indexiert. Sie stärken E-E-A-T-Signale und führen verknüpfte `alternates.languages`-Hreflang-Tags sowie `openGraph.url` über [`lib/legal.ts`](../website/lib/legal.ts).

---

## Metadaten-Implementierung

### Root-Layout – [`app/layout.tsx`](../website/app/layout.tsx)

- `metadataBase`: `https://www.zackisch.com`
- `title.default`: Deutscher Titel als Standard (`"Zackisch: Bestellen und Bezahlen per QR-Code"`)
- `title.template`: `"Zackisch: %s"`
- `openGraph.locale`: `"de_DE"`
- `openGraph.images`: `/og_image.png`
- `twitter.card`: `"summary_large_image"`
- `viewport.themeColor`: `"#000000"`
- `icons.icon` / `icons.apple`: `/icon.png`

### Startseite pro Sprache – [`app/[locale]/page.tsx`](../website/app/%5Blocale%5D/page.tsx)

- `title.absolute`: Lokalisierter Meta-Titel (`t.metaTitle`)
- `description`: Lokalisierte Beschreibung (`t.metaDescription`)
- `openGraph.url`: Kanonische Sprach-URL (`https://www.zackisch.com/{locale}`)
- `openGraph.locale`: Dynamisch `de_DE` bzw. `en_US`
- `robots.index / follow`: `true`
- `alternates.canonical`: `https://www.zackisch.com/{locale}`
- `alternates.languages`:
  - `"de-DE"` → `https://www.zackisch.com/de-de`
  - `"en-DE"` → `https://www.zackisch.com/de-en`
  - `"x-default"` → `https://www.zackisch.com/de-de`

### Rechtliche Seiten – [`lib/legal.ts`](../website/lib/legal.ts)

Zentraler Helfer `legalMetadata(locale, kind)` für alle Rechtstexte. Definiert `title`, `description`, `robots` (index/follow), `alternates.canonical`, `alternates.languages` (`de-DE`, `en-DE`, `x-default`), `openGraph` mit URL und `twitter`.

### 404-Fehlerseite – [`app/not-found.tsx`](../website/app/not-found.tsx)

Server-Komponente mit statischen Metadaten: `title: "Seite nicht gefunden"`, `robots: { index: false, follow: false }`.

---

## Sitemap und Robots

- **`public/robots.txt`**: Erlaubt allen Suchmaschinen-Crawlern den Zugriff und verweist auf `https://www.zackisch.com/sitemap.xml`.
- **`public/sitemap.xml`**: Pflegt die kanonischen Routen `/de-de` und `/de-en` mit `xhtml:link`-Alternate-Tags.
- **`public/_redirects`**: Cloudflare-Pages-Regelwerk mit `/ /de-de 301` für den sofortigen Server-Redirect der Wurzel-URL.

---

## Strukturierte Daten (JSON-LD)

Inline `<script type="application/ld+json">` im `@graph`-Format auf der Startseite ([`app/[locale]/page.tsx`](../website/app/%5Blocale%5D/page.tsx)):

| Schema-Typ | `@id` | Inhalt |
| --- | --- | --- |
| `Organization` | `#organization` | `name`, `url`, `logo`, `sameAs` |
| `SoftwareApplication` | `#application` | `applicationCategory: "BusinessApplication"`, Gebührenstruktur |
| `WebSite` | `#website` | `url`, `name`, `publisher`, `inLanguage` |
| `FAQPage` | `#faq` | Vollständige FAQ-Fragen und Antworten für Rich Results |

---

## Übersetzungsinfrastruktur

| Datei | Zweck |
| --- | --- |
| [`lib/translations.ts`](../website/lib/translations.ts) | Hauptobjekt `{ de, en }` – führt Landingpage- und Rechtstexte zusammen |
| [`lib/landing-translations.ts`](../website/lib/landing-translations.ts) | Texte der Startseite und FAQ-Einträge |
| [`lib/legal-translations.ts`](../website/lib/legal-translations.ts) | Titel und Beschreibungen rechtlicher Seiten |
| [`lib/i18n.ts`](../website/lib/i18n.ts) | `useTranslation()`-Hook zur sprachabhängigen Bereitstellung |
| [`lib/regions.ts`](../website/lib/regions.ts) | Register unterstützter Sprach- und Regionskombinationen |
