# Zackisch — engineering and agent contract

Scope: the whole repository. Read the relevant application's `AGENTS.md` before editing it. Human documentation is German; agent instructions and `DESIGN.md` are English. Maintain only root `README.md`, `AGENTS.md`, `DESIGN.md`, Impeccable's `PRODUCT.md`, and one README/AGENTS pair per application as product documentation. Installed skill instructions and required third-party license notices are tooling, not competing product documentation. Keep plans, research logs, screenshots, approval evidence and audit reports outside the repository.

## Product and company

Zackisch supplements an existing hospitality POS with optional browser QR ordering/payment. Guests need neither an app nor an account. Preserve human service, owner self-service, suitable existing devices, manual POS recording and honest outage fallback. Preserve checkout, ledgers, staff, permissions, partners and newsletter behavior.

The founder confirmed Selim Eser, trading as Zackisch, a German sole proprietorship with no employees, and `selim@zackisch.com`. Finom is used for business banking; do not imply a Finom API integration. The real business address, tax registration and VAT treatment are not confirmed. A placeholder address must be clearly labelled as a draft and cannot establish publication readiness. Never infer small-business VAT status from legal form or employee count.

## Topology and boundaries

| Directory | Host | Responsibility |
| --- | --- | --- |
| `root/` | `zackisch.com` | Public marketing, legal pages and sole brand asset host |
| `app/` | `app.zackisch.com` | Merchant, guest, staff; sole backend in `app/convex/` |
| `support/` | `support.zackisch.com` | Public localized help and authenticated business tickets |
| `internal/` | `internal.zackisch.com` | Authorized Team Dashboard |

All four use Next.js/React on Cloudflare Workers through vinext. Do not create another database or Convex project. UI → validated Server Action → authenticated/authorized domain operation → Convex/provider. Client-triggered Convex mutations follow the established Server Action boundary; exceptions need a security-reviewed architectural decision and negative tests. Server business/region/menu data is authority, never browser IDs or prices. Keep public DTOs minimal and privileged helpers internal.

Read version-matched installed `node_modules/next/dist/docs/` before Next.js edits. Check exact vinext/Workers support, build artifacts and runtime restrictions. Use Next.js 16 `proxy.ts` where applicable. Prefer ESM, strict TypeScript, explicit contracts and focused modules. Avoid speculative packages, shallow wrappers and giant conditional files; split around actual responsibilities.

## Mandatory UI workflow

1. Read `DESIGN.md`, `PRODUCT.md`, affected routes/components, their installed Base UI API and functional tests. Preserve product truth and task-specific density.
2. Research references through Mobbin for **every new or changed UI**. Read the connected Mobbin best-practices/search skills first. Compare several relevant screen/flow/section references; inspect their images and record exact links and why they fit outside Git. For marketing, broaden to major payment, banking, commerce and software brands (e.g. PayPal, Stripe, Wise, Square, Shopify, Revolut), not only hospitality competitors. Do not claim a result belongs to the requested brand when its returned name differs. References inform structure, never copy assets, claims or brand identity.
3. Use the installed `.agents/skills/impeccable/SKILL.md` for design, implementation, critique and polish. Explicit user instructions and `DESIGN.md` override catalog aesthetics or unnecessary approval rounds. The approved brand and brief do not need repeated confirmation. No Paper requirement or parallel competing design skill. Build the smallest useful Zackisch component library on `@base-ui/react` and semantic native HTML; add wrappers only for repeated responsibility.
4. Use League Spartan, unchanged black wordmark/signet, white/black/Electric Citron tokens and Phosphor per `DESIGN.md`. No second theme/library, foreign fonts or automatic dark mode. All UI strings, ARIA text, errors, notices and links use localized dictionaries or next-intl. `/de-de` and `/de-en` distinguish language from trusted business region.
5. Use only real stock photographs from the internet with verified free rights for the intended commercial use, attribution where required and private provenance/release evidence. Never generate photographs with AI anywhere in the product or marketing. Product imagery must remain clearly text-labelled placeholders describing the future screenshot until real product captures are available; never invent mock screenshots or synthetic product UI. Never invent testimonials, customer logos, metrics, savings, guarantees or screenshots of features that do not exist. Label any illustrative product scenario.
6. Test each change with Playwright, affected unit/integration tests and rendered review. Desktop marketing may use purposeful scroll scenes and strong layouts; mobile, keyboard and reduced-motion modes must retain all content without scroll hijacking. Run Impeccable's detector and finish review. Preserve payment wording and purchase disclosures unless their change is independently reviewed and tested.

### Interaction contract

One dominant primary action per task area; navigation uses links. Destructive confirmations name consequences and action. Persistent visible labels, associated descriptions/errors, retained input after failure. Radios for exclusive choices, checkboxes for independent ones, tables for dense comparisons. Test focus trap/return, keyboard, touch targets, 320px reflow, zoom, contrast, long translations, loading/disabled/offline/error states and reduced motion. Guest headers prioritize the venue. Financial metrics use tabular numbers. Only authoritative server confirmation can show payment success; POS recording is independent of preparation.

### Page titles and brand hierarchy

Every browser page title in all four applications follows `<localized page subject> | Zackisch`, exactly once, including authentication, guest, support, internal, error and generated confirmation pages. Use Next metadata templates or explicit absolute titles consistently; client-side updates must retain the same convention. Keep Open Graph and social titles consistent. The wordmark is the primary logo. Use the signet only where the wordmark cannot fit, such as a favicon or genuinely compact control. Website favicons use the supplied Citron rounded platform export, not the transparent general-purpose signet.

### Assets

Only `root/public/brand/` hosts brand assets. The other apps and emails reference `https://zackisch.com/brand/...`, never duplicate public files. Preserve source logo geometry and asset-manifest hashes. Email logos use compatible PNG fallbacks. Fonts are served by the website with appropriate CORS, never runtime Google Fonts requests. Verify all cross-origin URLs, CSP and font loading before deployment; deploy central assets before consumers. Build-time CSS imports may share canonical tokens without duplicating hosted media. Keep app-specific non-brand content where needed.

QR signs must encode the correct canonical venue/table/pickup URL, never credentials. Black square modules on white, four-module quiet zone, high correction and independently tested central signet if used. Preserve 92 × 135 mm cards, four per A4, duplex alignment and personal-service alternative; no venue logo/name. Decode actual payloads and physically test actual-size prints with several cameras before shipping QR changes. A brand spec does not prove scannability.

## Security and data integrity

Every sensitive operation checks actor, valid session, action, business ownership and region at Server Action and Convex boundaries. Deny by default. Anonymous menus/tracking must not leak Stripe/accounting/admin fields. Keep merchant, paired staff and internal identities separate. Internal roles and explicit regional permissions never imply blanket access.

Use scoped expiring credentials, secure HttpOnly cookies where appropriate, strict Origin/CSRF controls, allowlisted redirects, session rotation/revocation, rate limits and verified logout. Do not share all cookies across subdomains. Any app/support identity exchange must bind state/nonce, short expiry and single use; shared Convex alone is not SSO. Check recovery, OTP abuse, replay and terminal revocation.

Ticket replies and internal notes use distinct typed operations and backend visibility. Customer queries, attachments, notifications and exports must never include notes or internal metadata. Enforce attachment ownership, content-based MIME allowlists, size/count limits, safe rendering, private downloads and malware handling. Sanitize rich text; prevent stored XSS, SSRF, IDOR, CSRF, token leakage and resource exhaustion. Paginate/bound scans and retries. Private responses are no-store; indexing controls are not authorization.

Never store PAN/CVC, KYC scans, bank passwords or secrets in application data/logs. Use structured redacted logs and auditable privileged changes. Keep secrets in provider configuration, not Git. Verify dependency provenance and lockfiles before installation; do not run blind major audit upgrades. Security scanners identify leads, not certifications. Confirmed critical/high exploitable findings block release until fixed and retested.

## Payment, fee and POS contract

The restaurant sells food/drinks to its guest. Zackisch supplies B2B software, not a replacement POS, custodian or issuer of the restaurant's fiscal receipt. Prefer verified Connect Direct Charges in each merchant's connected account, Stripe-collected processing fees and Stripe-assigned connected-account negative-balance responsibility as confirmed by actual account configuration. Never fall back to platform-owned charges when a merchant fails readiness. Embedded Stripe collects its required agreements/KYC; short-lived account sessions require owner authorization and are never logged.

Zackisch charges **2% of successfully captured restaurant order subtotal after discounts, excluding voluntary tips, including any applicable VAT on Zackisch's own service fee**. Stripe fees are separate. No Zackisch setup/monthly base fee. EUR 10 eligible order → EUR 0.20 total Zackisch fee, not EUR 0.20 plus VAT. Restaurant item VAT and Zackisch fee VAT are separate. Do not charge failed/abandoned/uncaptured payments. Refund/fee/partner adjustments must follow the actual agreement and provider state with integer-cent arithmetic and tested rounding.

Reconstruct prices from canonical menu/options and immutable transaction tax snapshots. Verify raw-body Stripe signatures, connected account, amount, currency and payment state; make events/orders/refunds idempotent across duplicate/out-of-order delivery and redirect races. Never release a paid kitchen order solely from browser return parameters. Distinguish pending, succeeded, failed, refunded and disputed. Never estimate processing fees as actuals.

Separate guest gross/product taxes, platform fee gross/net/VAT, actual Stripe processing fee, balance movement, payout, refunds and partner commission. Guest sales are not Zackisch revenue. Preserve immutable correction history and reconciliation identifiers. Financial exports and invoices need separately tested accounting support; a settlement report is not an invoice.

Guest output is a non-fiscal **Bestell- und Zahlungsbestätigung**, not a Kassenbon or invoice. Restaurant issues its legally required receipt/invoice. Record each already-paid order once in the existing POS with authorized auditable confirmation (`posRecordedAt`, actor, reference), no second collection. Keep overdue/unrecorded cases visible separately from preparation. Reconcile outages and refunds without silently rewriting paid facts. Physical table QR payment is not automatically an exempt online shop: actual TSE/KassenSichV classification and receipt timing require specialist assessment.

## Mandatory German and EU legal research

For **every addition or change**, research applicable current German/EU law from official primary sources before deciding the implementation. Assess missing obligations and less risky lawful alternatives, not only whether the proposed feature is prohibited. Record date, sources, actual facts, applicability, choice and unresolved approvals outside Git; retain durable obligations here and actual behavior in READMEs. Narrow a genuinely technical change's assessment proportionately, but do not skip it. Search snippets are starting points; read the provisions supporting material conclusions. Never promise “100% compliant”, “100% secure”, TSE exemption, tax certification, uninterrupted service or zero total costs.

### Official source hierarchy

Use [Gesetze im Internet](https://www.gesetze-im-internet.de/) as the default official source for consolidated German federal statutes and regulations; follow the exact provision, check its current version and commencement/transitional rules. For authoritative promulgation and amendments, consult [the Federal Law Gazette](https://www.recht.bund.de/). Use [EUR-Lex](https://eur-lex.europa.eu/) for EU legislation, the Official Journal and applicable consolidated versions. Use official state-law portals for Länder law.

For administrative interpretation and implementation, prefer the competent authority: BMF/BZSt and tax administrations, BaFin, BMAS and the BFSG market-surveillance authority, BfDI/state privacy regulators and EDPB. Guidance explains the law; distinguish its status from binding legislation and relevant court decisions. Vendor documentation establishes product behavior, not legal compliance. Blogs, forums and commercial legal summaries may help discovery but never replace the underlying official source. Cite the exact provision or official guidance, not only a portal homepage. Check effective dates, territorial scope and amendments; surface unresolved conflicts instead of silently choosing the convenient source.

The baseline source map below was researched on 5 November 2026 and must be refreshed for the next change. It is an engineering requirement, not legal advice or evidence of professional approval.

| Topic | Primary sources and implementation consequence |
| --- | --- |
| Provider identity | [DDG §5](https://www.gesetze-im-internet.de/ddg/__5.html): actual proprietor, serviceable address, email and applicable register/USt-ID/W-IdNr; do not invent registration or publish private tax numbers. Sole proprietorship is not GmbH/e.K. by assumption. |
| Privacy | [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), especially Arts. 5,6,12–22,28,30,32–35,44+: purpose/role/legal basis, transparent recipients/transfers/retention, data rights, processor agreements, minimization and breach process. |
| Device storage/marketing | [TDDDG §25](https://www.gesetze-im-internet.de/ttdsg/__25.html), [UWG §7](https://www.gesetze-im-internet.de/uwg_2004/__7.html): necessity is specific to the requested service; optional tracking needs prior lawful consent, equally easy refusal/withdrawal; newsletter consent/DOI separate from transactional messages. |
| Consumer contract | [BGB §312i](https://www.gesetze-im-internet.de/bgb/__312i.html), [§312j](https://www.gesetze-im-internet.de/bgb/__312j.html), [§312g](https://www.gesetze-im-internet.de/bgb/__312g.html), [EGBGB Art.246a](https://www.gesetze-im-internet.de/bgbeg/art_246a__1.html): seller identity, material items, final total and fulfilment immediately before binding order where applicable; unambiguous payment obligation. Do not assume every food order has no withdrawal right. |
| Prices/food | [PAngV §§3,13](https://www.gesetze-im-internet.de/pangv_2022/__13.html), [LMIV](https://eur-lex.europa.eu/eli/reg/2011/1169/oj), [LMIDV §4](https://www.gesetze-im-internet.de/lmidv/__4.html): final consumer prices, allergens and applicable additives before purchase; online menu does not replace every physical price-list duty. Review alcohol/youth protection where relevant. |
| Payments | [BaFin ZAG guidance](https://www.bafin.de/SharedDocs/Veroeffentlichungen/DE/Merkblatt/mb_111222_zag.html), [ZAG §2](https://www.gesetze-im-internet.de/zag_2018/__2.html): actual control/custody/contract flow determines scope; Stripe alone does not establish an exemption. |
| VAT | [UStG §§12,19](https://www.gesetze-im-internet.de/ustg_1980/__19.html), [BMF food-service guidance](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-12-22-verpflegungsdienstleistungen.html): qualifying food services at 7% from 2026, drinks generally 19%; classify exceptions/bundles and merchant status. Assess Zackisch's own supply separately; do not assume §19 election. |
| Invoices | [UStG §14](https://www.gesetze-im-internet.de/ustg_1980/__14.html), [§27](https://www.gesetze-im-internet.de/ustg_1980/__27.html), [UStDV §33](https://www.gesetze-im-internet.de/ustdv_1980/__33.html), [BMF E-invoice FAQ](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html): required domestic B2B receipt capability from 2025; general issuance transition through 2026, eligible <=EUR800,000 prior-year issuers through 2027; review exceptions. PDF alone is not a structured e-invoice. |
| Retention/fiscal | [AO §§146a](https://www.gesetze-im-internet.de/ao_1977/__146a.html), [147](https://www.gesetze-im-internet.de/ao_1977/__147.html), [UStG §14b](https://www.gesetze-im-internet.de/ustg_1980/__14b.html), [KassenSichV](https://www.gesetze-im-internet.de/kassensichv/): category-specific 10/8/6-year records with possible holds, not universal retention of personal data; actual system classification, TSE, receipt timing, GoBD and audit exports require verification. |
| Accessibility | [BFSG §§2](https://www.gesetze-im-internet.de/bfsg/__2.html), [3](https://www.gesetze-im-internet.de/bfsg/__3.html), [BFSGV §19](https://www.gesetze-im-internet.de/bfsgv/__19.html): assess consumer e-commerce and each provider; services microenterprise exception requires headcount and financial criteria, not merely zero employees. WCAG 2.2 AA remains the engineering target. |
| Disputes | [VSBG §§36](https://www.gesetze-im-internet.de/vsbg/__36.html), [37](https://www.gesetze-im-internet.de/vsbg/__37.html); [EU 2024/3228](https://eur-lex.europa.eu/eli/reg/2024/3228/oj): ODR platform ended in 2025; no obsolete link. Small-entity exception to §36(1)1 does not erase every dispute-specific duty. |
| Platform scope | [P2B](https://eur-lex.europa.eu/eli/reg/2019/1150/oj), [DSA](https://eur-lex.europa.eu/eli/reg/2022/2065/oj), [PStTG](https://www.gesetze-im-internet.de/psttg/): document actual applicability to intermediation, ranking/suspension, hosting/content, merchant traceability and platform reporting. No blanket small-startup exemption. Assess NIS2 and other sector rules when service/scale changes. |

### Legal data and documents

Website privacy, platform privacy, B2B terms, guest information and Art.28 DPA serve different purposes. Keep canonical German/English routes and footer/signup/checkout links consistent. Record actual accepted immutable document version/hash, actor, business, server time and language; consent is distinct from contractual acceptance. Existing version checks do not imply counsel approval or immutable content binding.

Map account, guest, staff, ticket, newsletter, audit and billing data to purpose, controller/processor, lawful basis, recipient, location, transfer safeguards, retention and deletion owner. Confirm Cloudflare, Convex, Stripe and Google Workspace contracts/configuration; do not invent EU-only hosting or a DPA. Finom accounting data is a separate flow. Store evidence outside public bundles. DSAR responses normally have the GDPR Art.12 time limit; Art.33 breach notification has a conditional 72-hour deadline. Keep Art.34 risk assessment and contact process.

Account deletion must separate erasable profile data from legally retained books/claims. Retain structured invoice originals, corrections and appropriate proofs; backups are not the accounting archive. Define legal holds, deletion jobs and deletion reapplication after recovery. Never set arbitrary global retention periods to fill a privacy template.

## Verification, reviews and release

After every new feature or modification run relevant Playwright E2E, not merely source inspection. Keep semantic assertions for real outcomes, negative authorization tests, provider retries/failures, mobile, keyboard, reduced motion, image/font delivery and legal links. Maintain regression coverage for signup/setup, paired staff expiry/revocation, QR payloads/printing, guest payment, existing POS recording, public support search, private tickets/internal notes, regional roles, partners, newsletter and unsubscribe. Playwright MCP is optional exploratory tooling, not a substitute for saved tests.

Run affected unit/integration tests, typecheck, lint and actual Next/Workers builds. No inference of success from code. Review backend diffs with retained thermo-nuclear correctness/security and code-quality skills; use Stripe and Convex skills for their domains. Validate findings, fix and retest. Keep React diagnostics useful and scoped. No blind framework/dependency migration for visual work.

Quality target: WCAG 2.2 AA, keyboard/focus, screen-reader sanity, 200–400% zoom, real 320px layout, touch targets, no avoidable CLS. Automated axe is partial evidence only. Measure performance rather than inventing LCP/INP/CLS or uptime claims.

Before release verify actual Convex backup deployment, schedule, storage inclusion, retention, access and recent success. Never infer from provider capabilities. Test restore only in an isolated nonproduction deployment with effects disabled; record observed recovery/loss windows, reapply deletion and reconcile Stripe, do not replay payments/emails. Source/DNS/config/secrets need separate recovery coverage. Never change production schedules or restore production for a drill.

Operational fallback: stop unconfirmed checkout during provider failure, retain settled facts, use ordinary personal service/POS, reconcile delayed webhooks once. Monitor provider errors, payment backlog, authentication abuse, notification retries and backups where configured. Do not claim monitoring/SLA exists without evidence. Incidents preserve redacted evidence, revoke exposed sessions/secrets and assess legal notification.

Production deployment/DNS, destructive migration/restore, real charges/refunds, secret changes and broadcast email require explicit human authorization. Legal and fiscal sign-off is separate from tests. A release needs real proprietor/vendor details, payment/account capability evidence, agreed contracts, tax/fiscal classification and no unresolved material security/financial defect. Report blockers honestly; do not manufacture readiness.

## Git and versions

Work directly on **main** in this solo-developer repository. Do not create branches or worktrees unless the owner explicitly overrides this rule. Inspect and preserve unrelated changes. Commit small reviewed, tested units regularly, not one final giant commit. Do not push or deploy by implication.

Commit identity: `Selim Eser <semmel5533@gmail.com>`; verify configured identity. Messages are English, entirely lowercase, concise past-tense action, no emoji, no terminal punctuation, no Conventional Commit prefix; join related actions with `and`.

Independent package/lock versions for `root`, `app`, `support`, `internal`; evaluate all affected packages **before each commit**. Patch for fixes/refactors/text/style, minor for features/routes/schema. Never advance to 1.0.0 or any major without explicit owner approval. Root tooling package also keeps manifest/lock versions aligned. Read → map dependencies → research → implement reversible changes → test/review → sync verified docs → commit.
