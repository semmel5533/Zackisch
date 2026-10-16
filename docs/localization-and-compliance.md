# Localization, SEO, privacy and legal review boundaries

## Market and language routing

Start country is **Deutschland** (`de`) with German (`de-de`) and English (`de-en`) locale variants. The country label is shown as its endonym in selectors even in English UI. Do not translate a legal business region based solely on preferred UI language. Region and language are distinct and should be represented as separate typed concepts in source. Public `root` and `support` routes follow `/{country}-{language}`. Merchant and internal apps retain region in verified session/organization/admin assignment rather than trusting a URL query. DACH expansion needs explicit tax/contract/payment readiness.

## Text and navigation

All user-visible strings, including errors, ARIA labels, email templates, QR print labels, and URL fragments that need localization, use `next-intl` keys. Avoid language hardcoding and ternary URL generation in TSX. Missing keys are caught at build/test time. Both locales have the same factual completeness, not just a translated hero. Respect number/currency and date formatting (`Intl`) and actual taxable amounts. Support links from wizard resolve to the matching regional article.

## SEO surfaces

- Marketing homepage/content and public help articles: valid canonical, hreflang, Open Graph preview, semantics, schema.org only for facts genuinely supported by page content and applicable schema policy.
- `sitemap.xml` per public app covers only indexable canonical URLs, updated automatically when help articles are published.
- `robots.txt` and indexing directives exclude private owner dashboard, team routes, support ticket threads, tokens/links and payment success paths. `robots.txt` is not an access-control boundary; private data must still require authorization.
- Hreflang for `de-DE`, `en-DE`, appropriate `x-default`; avoid unsupported countries or fictitious locations in SEO metadata.
- Product screenshots and photographs have correct alt text and legal rights, not stuffed keywords. Legal pages maintain precise host/canonical scope.

## Germany legal and compliance checks (not legal advice)

The legal/compliance owner must assess all relevant German and EU rules against the **actual contractual party and ordering flow**; engineering provides testable implementations but cannot self-certify legality. Key checks:

1. **Consumer purchase and payment:** review BGB §312j and its applicability to the actual restaurant/guest transaction, including final order button wording, material pre-contract info, accepted payment types, total and any delivery restrictions. Source: https://www.gesetze-im-internet.de/bgb/__312j.html .
2. **E-commerce accessibility:** BFSG came into force for relevant services on 28 June 2025; e-commerce may be covered, with relevant microenterprise service exceptions under §3(3). Determine whose service and employee/revenue counts matter, whether the exemption applies and whether additional consumer experience obligations remain. Independent engineering target: WCAG 2.2 AA regardless of uncertain exemption. Source: https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/E-Commerce/online-shops_node.html .
3. **European accessibility standard:** check current harmonized EN 301 549 version versus any newer standard publication. Publication and harmonization are not equivalent; never state compliance merely because a document was updated.
4. **Data protection:** GDPR lawful bases, transparency, retention, processor agreements, cross-border providers/subprocessors, cookies and analytics consent where required, subject access/deletion, exports, support attachments, logs, backups and incident notification.
5. **Provider contracts:** Stripe Connect platform/connected account flows, merchant financial onboarding, availability of supported payment methods, refund/chargeback policy, PSP fees and payment terms.
6. **Restaurant/legal duties:** fiscal bookkeeping, KassenSichV/TSE applicability of actual POS setup, digital vs manual revenue entry, receipt requirements, applicable product food/allergen/additive information and consumer notices.
7. **Website legal:** correct Impressum/Anbieterkennzeichnung, current Datenschutzhinweise, AGB/contract terms, newsletter double opt-in/unsubscribe and any commercial claims or testimonials.
8. **Print/legal brand assets:** real usage rights of photographs, model releases, typography and original icons, accessibility of fallback QR instructions.

## Content approval and proof

Engineering logs precise implementation evidence (screens, automated tests, verified Stripe calls) but final legal review requires an authorized legal professional for specific business operations. Do not claim compliance certification, audited security or an SLA without independently valid evidence. Keep current published contract copy consistent across website, app, support and invoices.

## Germany legal and payment references

For the binding design and engineering decisions for German checkout, tax, fiscalization, contracts, legal pages, permissions and privacy, follow `germany-legal-and-regulatory.md`, `payments-and-stripe.md`, `tax-invoicing-and-fiscalization.md`, `privacy-and-data-governance.md` and `legal-pages-consents-and-contracts.md`. The locale routes `/de-de` and `/de-en` may not disclose contradictory prices, contract versions or seller identities; merchant region controls the applicable legal treatment. No published page may imply legal advice or compliance certification that is not actually verified.
