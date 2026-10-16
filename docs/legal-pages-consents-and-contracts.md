# Contract, legal page, consent and disclosure implementation map

This document describes the required **locations, fields, UX timing, evidence and content outline**. Never ship guessed legal entity details or publish a legal boilerplate as lawyer-approved. A German lawyer must approve final B2B SaaS terms, DPA, consumer-facing seller information and payment/regulatory classifications. German is the operative default for `/de-de`; `/de-en` must be a faithful complete translation with same meaning and release version. The final pages may be created in localized source/MDX/data structures suitable for the existing Next.js build; all user-visible strings use project i18n conventions.

## 1. Legal page routes and navigation

| URL/application | Minimum content and visibility | Link placements |
| --- | --- | --- |
| `zackisch.com/de-de/legal-notice` | Zackisch §5 DDG imprint: legally correct registered entity, representative, physical address, email and required commercial/register/tax information | Every public footer, support footer, signup/legal UI, accessible from app dashboard |
| `zackisch.com/de-de/privacy-policy` | Public website, merchant registration, platform-owned security, emails, analytics/cookies, processor and Stripe references; link separate guest/ticket sections as needed | Footer, signup, newsletter, cookie/privacy settings |
| `zackisch.com/de-de/terms` or existing canonical `/gtc` | Zackisch merchant B2B service agreement including fee model, parties, service levels, pause/termination, data transfer, disputes, taxes, supplier responsibility | Directly before merchant legal contract acceptance, downloadable; avoid conflicting duplicate routes |
| `zackisch.com/de-de/data-processing` (if appropriate) | Art. 28 DPA with scopes, TOMs, subprocessors, rights and standard contractual mechanisms where needed; make available during merchant signup and account | Merchant legal hub, contract acceptance, team support access |
| `zackisch.com/de-de/accessibility` (if counsel deems applicable) | Service accessibility information and feedback contact, accurate based on implementation | Site/footer + guest ordering where required; content factual, not certified without basis |
| `support.zackisch.com/de-de/privacy-policy` or clearly linked canonical merchant support notice | Ticket purpose, visibility, attachments, retention, controller/processor identity, email notifications | Ticket form and support footer |
| `app.zackisch.com` public guest checkout | Restaurant-specific seller identity/contact, guest privacy data, pre-purchase total and terms, relevant cancellation/refund and food disclosures | Venue header/menu help, cart, immediately before binding order, confirmation |
| `internal.zackisch.com` | Internal staff security/privacy policies in authenticated context, outside indexing | Staff login and internal settings |

Route aliases must not create contradictory `canonical`, hreflang, privacy or Terms versions. Links must be keyboard accessible and readable on phones, never hidden solely in an inaccessible menu. If `root` remains static content on Workers, build legal pages as statically renderable multilingual pages and use application API only for authenticated dynamic consent records.

## 2. B2B restaurant Terms content requirements (counsel-authored)

1. Contracting entity, commercial purpose and product scope: supplementary ordering/payment software, not a replacement POS or guaranteed fiscal certificate.
2. Prerequisites and self-onboarding: devices, internet, maintained existing POS, accurate menu/allergen/tax data, permissions, age restrictions if relevant, testing before guests.
3. No setup Zackisch fee, no monthly Zackisch base fee, **precise** 2% basis; whether fee is charged on gross B2C order and includes/excludes VAT on Zackisch service; settlement method, minimums, mixed currencies, refunds, chargebacks, Stripe fees and fee changes.
4. Stripe connection: named payment parties/merchant of record, merchant acceptance of Stripe terms, KYC, fraud/negative balances/disputes, direct receipt of payouts if model permits; clear distinction that Zackisch is not a licensed payment institution by merely using Stripe.
5. Data processing: relationship of controller/processor, DPA, cross-border/subprocessors, documentation access, own merchant data responsibility, guest notice, breach communication.
6. Transaction lifecycle: paid/accepted/order preparation, reconciliation and customer refunds; liability for incorrect items, taxes, allergens, kitchen fulfilment or unregistered sales; reasonable product technical obligations and compatible integrations.
7. Availability, support and incident handling: no hard availability SLA unless measured/contracted; platform outages and orders already paid, remedies and logging.
8. Contract period, account pause, cancellation, termination, retention, deletion and export; partner program terms separate, region changes subject to approvals.
9. B2B complaint/contact procedure, dispute resolution, limitation of liability only within legally permissible boundaries, changes to terms and notice process; applicability of P2B Regulation to be checked.

**Do not hide material commercial terms inside Stripe's agreement**. Zackisch's agreement should disclose Stripe's separate fees to the extent known and link the exact Stripe version/terms shown during onboarding.

## 3. Guest order disclosures and actions

Before guest agrees to pay, the mobile view should present merchant legal name/trade name and contact, identifiable items and quantities with allergens/additives where applicable, table or pickup details, guest total VAT-inclusive price and mandatory fees, accepted payment methods, expected fulfillment, cancellation/refund contacts and clear payment obligation. Get counsel to decide whether guest-specific T&Cs/withdrawal notice is needed in each dine-in/pickup situation (on-premise vs distance contracting). Where §312j applies, put its required key information next to the final order action and use wording unambiguously communicating purchase obligation. Payment form `submit` action must not masquerade as a nonbinding preview. A payment success screen should show verified status, not unverified `processing succeeded` assumption. Restaurant-specific disclaimer should not remove mandatory merchant obligations.

## 4. Consent and event proof schema

Create canonical **legal documents registry** (document key, locale, business region, immutable version/hash, effective date, external URL, legal approval/status, deprecation handling) and **acceptance events** (subject actor ID, org ID where appropriate, document version/hash, server UTC timestamp, source, applicable region/locale, required-vs-optional status, policy event type and limited audit metadata). Consent and Terms acceptance are **different events**; required contract acceptance need not rely on GDPR consent. Never pre-tick marketing or optional analytics. Allow merchant to review previous accepted terms and download permanent copy.

The signup flow must allow `Ich akzeptiere die Zackisch-Nutzungsbedingungen` for required B2B terms if lawyer-approved, and link privacy information **without** forcing an invalid blanket 'I consent to all data processing' statement. Add relevant DPA signing/acceptance according to adopted mechanism. Stripe's distinct terms/consents are collected by Stripe in Stripe-hosted onboarding; record only the permitted minimal Stripe account/status references. Marketing opt-in separate unchecked and optional. Newsletter consent record should include confirmed proof and one-click unsubscribe. Cookie manager: reject as easily as accept, granular choice, later change and purpose/vendor disclosure before third-party optional requests.

## 5. Version update and legal page correctness tests

- User registers and can actually open/download the exact merchant agreement they accept before acceptance; no broken links/hidden scroll jail; language matches viewed content.
- Signup blocked if required current agreement not accepted; no telemetry/Stripe request before needed disclosure if required; optional opt-ins unchecked and do not prevent registration.
- `acceptanceEvents` keeps server time, tenant and policy version; forged client version rejected; concurrent updates handled.
- Right to withdraw optional consent works without deleting service account; optional third-party tracking remains off until valid opt-in; protected checkout works with optional cookies refused.
- Guest checkout presents restaurant seller and applicable legal purchase information immediately before binding click; Stripe payment does not bypass disclosure; refund contact is clear.
- Every public root/support page has active imprint/privacy links; `noindex` for internal/tickets and private data; brand image/photo license and attribution requirements verified.
- English language pages reviewed for accuracy, German privacy/legal copy reviewed by licensed or competent professional, screen-reader/keyboard tests and canonical SEO metadata verified.

## 6. Counsel sign-off form (outside production docs)

Collect: exact Zackisch legal entity and address; register number and USt-ID if any; authorized representative; current contracts; actual Stripe jurisdiction/account/controller and merchant-of-record; fee tax clauses; German POS/TSE decision; role-specific GDPR controller/processor agreement and vendor DPA; refund policy; consumer contracting model; right of withdrawal assessment; BFSG; youth protection and food info; P2B/DSA/DAC7 scope; actual deployment, retention and transfer details. Each decision must have approver, date, version, link to evidence and consequences for implementation. Commit only non-sensitive outcomes; signed agreements and identity/credentials remain in secure company storage.

## 7. Official references

§5 DDG https://www.gesetze-im-internet.de/ddg/__5.html ; §25 TDDDG https://www.gesetze-im-internet.de/ttdsg/__25.html ; §312j BGB https://www.gesetze-im-internet.de/bgb/__312j.html ; §312g BGB https://www.gesetze-im-internet.de/bgb/__312g.html ; PAngV §13 https://www.gesetze-im-internet.de/pangv_2022/__13.html ; GDPR https://eur-lex.europa.eu/eli/reg/2016/679/oj ; BFSG https://www.gesetze-im-internet.de/bfsg/__3.html .

## Clear payment/merchant terms and guest document legal UX

Public commercial copy: `0 € Zackisch-Grundgebühr. 0 € Einrichtungsgebühr. 2 % des erfolgreich bezahlten Bestellwerts ohne freiwilliges Trinkgeld (inklusive der auf unsere Gebühr entfallenden Umsatzsteuer, sofern anwendbar). Zusätzlich fallen die Gebühren von Stripe an.` Only display a specific card-processing amount if it is verified current for that exact payment method and merchant terms. Provide an accessible linked price breakdown and actual refund/tips criteria. In merchant acceptance, separately identify **Stripe** as processor and the restaurant as seller; embedded Stripe onboards user and collects its own required legal agreement and privacy acknowledgement. Do not use fake consent checkboxes for normal GDPR legal processing; record actual Zackisch B2B contract version/affirmative acceptance and independent newsletter preference. Guest checkout identifies the restaurant seller and legally meaningful pay button; success page says `Bestell- und Zahlungsbestätigung`, never `Rechnung` or `Kassenbon` until the real fiscal function is legally verified. See [Guest/POS workflow](guest-confirmation-and-pos.md), [Payments](payments-and-stripe.md) and official BMF/KassenSichV requirements linked there.
