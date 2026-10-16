# Research sources and active architectural decisions

## Scope and methodology

Research reviewed against publicly accessible official vendor docs, primary standards, government sources and named competitor pages on **16 October 2026**. These references inform design and implementation, not a substitute for independently verifying the exact deployed versions or legal advice. Distinguish primary standards/provider docs from competitors' self-promotional claims and dated industry surveys. Re-check URLs before changing material decisions. No paywalled/unlicensed competitor imagery or third-party brand assets are imported into Zackisch.

## Competitive patterns: verified references

| Product | Observable product/content pattern | Learning for Zackisch | Not a legitimate claim |
| --- | --- | --- | --- |
| me&u | Promotes mobile Order & Pay, visual menus, dietary/allergen support, integration and table signage; online help covers venue configuration and table numbers. https://www.meandu.com/gb/serve/order-pay ; https://help.meandu.com/hc/en-us/categories/5993694134927-Serve | Make order context, table mapping and self-service help obvious; use food photography responsibly | That QR ordering itself is novel, or Zackisch currently integrates with existing POS |
| sunday | QR pay-at-table and hybrid models retain staff service; support explains how staff can introduce optional scanning. https://sundayapp.com/digital-bill/ ; https://intercom.help/sundayapp-help/en/articles/6242586-how-to-present-sunday | Optional guest choice, short signage instructions, preserve hospitality | That customers universally prefer QR |
| PayPal | Merchant-facing messaging emphasizes clear tasks and familiar trust rather than only technology features. https://www.paypal.com/de/business | Focus on outcomes, readable conversion steps, trustworthy tone | Copying colors, layouts, proprietary photos or security assertions |
| orderbird / gastronovi / German QR providers | German category already includes QR/self-ordering and POS-connected offerings. https://www.orderbird.com/de/ ; https://www.gastronovi.com/ | Differentiate on DIY + no base fee + own devices + existing POS, not generic QR | “Only German company offering QR ordering” |
| delivery-platform merchant tablet models | Separate incoming-order tablet can be a familiar mental model; verify each provider's official current practice | Explain staff operation in familiar language | Partnership or actual Lieferando/Wolt/Uber Eats integration |

## Design research, evidence quality and user-centered standards

- WCAG 2.2 normative recommendation with AA target: https://www.w3.org/TR/WCAG22/ ; target size interpretation: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; focus obstruction https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html ; accessible authentication: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html .
- NN/g guidance on progressive disclosure, recognition rather than recall, error prevention and aesthetic-usability: https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.nngroup.com/articles/recognition-and-recall/ ; https://www.nngroup.com/articles/error-prevention/ ; https://www.nngroup.com/articles/aesthetic-usability-effect/ . Heuristics are not conversion guarantees.
- Browser performance: https://web.dev/articles/vitals .
- German BFSG / e-commerce and microenterprise exception: https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/E-Commerce/online-shops_node.html . Determine legal scope per party/contract.
- BGB §312j consumer purchase requirements: https://www.gesetze-im-internet.de/bgb/__312j.html .
- Market signals: Destatis company register (scope: hospitality businesses, not just independent restaurants) https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/Unternehmensregister/_inhalt.html ; Bitkom digital restaurant survey https://bitkom-research.de/news/restaurants-und-cafes-fuer-knapp-ein-drittel-sind-online-bewertungen-entscheidend ; industry DEHOGA surveys to be checked in context.

## Technical sources checked

- Cloudflare recommends vinext for new Next.js Workers apps and documents Next.js static deployment options: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ ; https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/ . Test exact adapter in code.
- Convex backups/scheduling and retentions: https://docs.convex.dev/database/backup-restore . Scheduled daily and weekly backup capability with file-storage option; it requires a supported plan. Configuration/code/env are excluded. Production settings not observed merely from Git.
- Cloudflare security-audit-skill official README, install and six-phase validation: https://github.com/cloudflare/security-audit-skill .
- Tester Army E2E official README and exact setup details: https://github.com/tester-army/e2e ; https://github.com/tester-army/e2e/blob/main/skills/e2e/references/setup.md . Active-development APIs and version minimum matter.
- Cursor Thermos current plugin (contains thermo-nuclear-code-quality-review and correctness review): https://github.com/cursor/plugins/blob/main/thermos/README.md . Use supported host; original skill remains https://github.com/cursor/plugins/blob/main/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md .
- Security review practices: https://owasp.org/www-project-application-security-verification-standard/ .
- QR fundamentals and quiet zones: https://www.qrcode.com/en/howto/code.html ; https://www.gs1.org/standards/barcodes/2d . Validate final specific QR outputs.

## Current decisions (not migration history)

**D-01 Four application roots:** `root`, `app`, `support`, `internal` with identically named npm packages and public hosts; the internal product label is “Team Dashboard”. It is distinct from merchant access.

**D-02 One Convex source:** Backend lives under `app/convex`; avoid shadow auth and independent support DB. The data model is region-aware, data access server-enforced.

**D-03 Unified Workers deployment:** All four Next.js applications deploy to Cloudflare Workers using vinext; the public site favors pre-rendered static assets and remains simple. Verify build/hosting support and seek explicit production domain approval before cutover.

**D-04 Owner support identity:** `app` and `support` share the merchant identity but use a security-reviewed cross-site session mechanism, not automatically broad cookies.

**D-05 POS and financial boundary:** Zackisch is supplementary, with manual POS accounting workflow and Stripe as authority for payment state. Checkout cannot rely on browser-side order total.

**D-06 Design language:** A restrained hospitality-friendly palette, real images and unified Base UI component semantics, adapted to real user context; WCAG 2.2 AA is the engineering goal irrespective of legal classification.

**D-07 Documentation truth:** All five READMEs in German, all five AGENTS and the root `docs/` deep docs in English; current implementation only, no outdated alternate documents.

**D-08 Security and resilience:** No unconditional high-availability/security promises. Automatic Convex backups are verified in provider environment, isolated restore tests only, scope-limited access and realistic existing-POS fallback.

**D-09 Quality system:** Full-repo Cloudflare security-audit, current Thermos code review and Tester Army E2E plus actual runtime/authorization/a11y/manual tests before release.

## Germany law and Stripe authoritative references

At release validate dates and account-specific terms against the current official documents linked in `germany-legal-and-regulatory.md`, `payments-and-stripe.md`, `tax-invoicing-and-fiscalization.md`, `privacy-and-data-governance.md`, and `legal-pages-consents-and-contracts.md`. Important checked references (October 2026): BMF VAT food 2026 (https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html); BMF E-invoice FAQ (https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html); Stripe Connect SaaS pricing/direct-charge model (https://docs.stripe.com/connect/saas); Stripe Connect live pricing (https://stripe.com/en-de/connect/pricing); DDG §5 (https://www.gesetze-im-internet.de/ddg/__5.html); TDDDG §25 (https://www.gesetze-im-internet.de/ttdsg/__25.html); BGB §312j (https://www.gesetze-im-internet.de/bgb/__312j.html); AO §146a (https://www.gesetze-im-internet.de/ao_1977/__146a.html); KassenSichV §6 (https://www.gesetze-im-internet.de/kassensichv/__6.html); German BFSG §3 (https://www.gesetze-im-internet.de/bfsg/__3.html). These source links do not substitute for review of the actual signed contracts and production system.

## Payment provider and German fiscal design evidence (reviewed 16 October 2026)

Stripe official SaaS referral pricing assigns merchant-of-record to the connected account, Stripe processing fees and connected-account negative balances to the connected account/Stripe arrangements when configured as Stripe-owned pricing, with Direct Charges and supported application fees: https://docs.stripe.com/connect/saas . Account v2 `fees_collector`, `losses_collector`, dashboard types and irreversible choices: https://docs.stripe.com/connect/accounts-v2/connected-account-configuration . Themeable embedded KYC and necessary Stripe agreement: https://docs.stripe.com/connect/embedded-onboarding . Account Session secrets must remain ephemeral: https://docs.stripe.com/api/account_sessions .

Germany: BMF fiscal FAQ explains that physically on-site payment is not automatically within the ordinary remote web-shop exemption and that completely separated noncash recording systems can be assessed independently: https://www.bundesfinanzministerium.de/Content/DE/FAQ/FAQ-steuergerechtigkeit-belegpflicht.html . KassenSichV §1/§6: https://www.gesetze-im-internet.de/kassensichv/__1.html ; https://www.gesetze-im-internet.de/kassensichv/__6.html . Small amount invoices (EUR 250 ceiling): https://www.gesetze-im-internet.de/ustdv_1980/__33.html . Guest payment button §312j BGB: https://www.gesetze-im-internet.de/bgb/__312j.html . BMF 2026 food VAT: https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html . German merchant gastronomy public price list: https://www.gesetze-im-internet.de/pangv_2022/__13.html . For the final public technical architecture, only document the tested configuration with source links; do not retain alternative-model analysis as current product documentation.
