# Technical sources and active architectural decisions

## Scope and methodology

Technical, accessibility, payment, and German regulatory references inform engineering and compliance verification. They do not substitute for independent legal or tax counsel. Primary standards and official vendor documentation take precedence over secondary commentary.

## Normative standards and technical references

- **WCAG 2.2 AA:** https://www.w3.org/TR/WCAG22/ ; Target Size (Minimum) SC 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; Focus Not Obscured (Minimum) SC 2.4.11: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html ; Accessible Authentication (Minimum) SC 3.3.8: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html .
- **Base UI React Primitives:** https://base-ui.com/react/overview/about ; Dialog primitive: https://base-ui.com/react/components/dialog .
- **Shopify Product Recommendations & Merchandising:** https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations ; https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations/related-products .
- **Usability & progressive disclosure:** https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.nngroup.com/articles/recognition-and-recall/ ; https://www.nngroup.com/articles/error-prevention/ .
- **Core Web Vitals:** https://web.dev/articles/vitals .
- **Cloudflare Workers / Next.js:** https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ ; https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/ .
- **Convex backups and restore:** https://docs.convex.dev/database/backup-restore .
- **QR code quiet zones and contrast:** https://www.qrcode.com/en/howto/code.html ; https://www.gs1.org/standards/barcodes/2d .

## Germany legal and Stripe Connect references

- **Stripe Connect Direct Charges & SaaS model:** https://docs.stripe.com/connect/saas ; https://docs.stripe.com/connect/direct-charges ; https://docs.stripe.com/connect/accounts-v2/connected-account-configuration ; https://docs.stripe.com/connect/embedded-onboarding ; https://docs.stripe.com/api/account_sessions .
- **German consumer checkout & price disclosure:** BGB § 312j (https://www.gesetze-im-internet.de/bgb/__312j.html); PAngV § 13 gastronomy price list (https://www.gesetze-im-internet.de/pangv_2022/__13.html); DDG § 5 (https://www.gesetze-im-internet.de/ddg/__5.html); TDDDG § 25 (https://www.gesetze-im-internet.de/ttdsg/__25.html); BFSG § 3 (https://www.gesetze-im-internet.de/bfsg/__3.html).
- **German fiscalization & VAT:** AO § 146a (https://www.gesetze-im-internet.de/ao_1977/__146a.html); KassenSichV § 1 and § 6 (https://www.gesetze-im-internet.de/kassensichv/__1.html, https://www.gesetze-im-internet.de/kassensichv/__6.html); UStDV § 33 small-amount invoices (https://www.gesetze-im-internet.de/ustdv_1980/__33.html); BMF E-invoice FAQ (https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html); BMF 2026 food VAT (https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html).

## Active architectural decisions

- **D-01 Four application roots:** `root`, `app`, `support`, `internal` with matching npm package names and public hosts (`zackisch.com`, `app.zackisch.com`, `support.zackisch.com`, `internal.zackisch.com`).
- **D-02 Single Convex backend:** All persistence, queries, mutations, and provider actions live under `app/convex/`. Every sensitive operation enforces server-side actor, tenant (`businessId`), and region (`regionId`) authorization.
- **D-03 Cloudflare deployment:** All four Next.js 16 applications target Cloudflare deployments (`root` uses `output: "export"` static export; `app`, `support`, and `internal` use vinext/Workers).
- **D-04 Authenticated support handoff:** `app` and `support` share merchant identity via explicit cryptographic `supportSessions` tokens rather than broad cross-subdomain cookies or unverified email parameters.
- **D-05 Merchant-owned payments and POS boundary:** Stripe Connect Direct Charges on the restaurant's connected account are authoritative for payment state; Zackisch collects a 2% platform fee on the eligible order subtotal excluding voluntary tips. Paid orders are recorded once in the restaurant's existing POS (`recordOrderInPos`).
- **D-06 Design system governance:** Visual direction is pending owner selection from researched design concepts (`design-system/README.md`). All shared primitives use Base UI in `@zackisch/design-system` and target WCAG 2.2 AA.
- **D-07 Documentation truth:** All five `README.md` files are German; all five `AGENTS.md` files and `docs/*.md` files are English. Documentation describes only verified current behavior.
- **D-08 Privacy-preserving Smart Menu intelligence:** Item popularity (`virtual:popular`) and co-occurrence recommendations (`frequentlyBoughtTogether`, `cartComplementIds`) are computed per `businessId` solely from Stripe-verified paid, non-test orders without cross-business pooling or guest tracking profiles.
