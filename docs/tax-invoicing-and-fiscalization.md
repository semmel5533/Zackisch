# German tax, invoices, receipts and POS reconciliation

This document prescribes records and engineering workflows. It does not replace individual tax advice. Restaurant sales and Zackisch platform service are legally distinct supplies with different invoice issuers, VAT treatments, books and retention responsibilities.

## 1. Three independent flows

| Flow | Seller / supplier | Customer | Commercial consideration | Evidence |
| --- | --- | --- | --- | --- |
| Restaurant food and drinks | Restaurant operating company | Guest | Guest gross line prices including applicable VAT | Restaurant invoice/receipt, cash register records/TSE where applicable, payment reconciliation |
| Zackisch QR software platform | Zackisch legal entity | Restaurant | Contractual 2% fee on defined eligible transaction base | Zackisch B2B invoice (typically VAT where required), fees ledger, settlement report |
| Stripe payment processing | Contractual Stripe entity | Merchant or platform as actually configured | Stripe processing and Connect fees per merchant agreement | Stripe invoice/balance transactions, VAT/reverse-charge assessment where cross-border |

Do not post the entire B2C transaction value as Zackisch's revenue. Track gross merchandise volume (GMV) separately from Zackisch's platform revenue, VAT and third-party costs. A settlement is not an invoice. Stripe exports alone may lack required item VAT, food/drink distinctions and cash register markers.

## 2. German rate treatment and merchant configuration

For applicable restaurant/catering food services, 7% VAT has applied since 1 January 2026; drinks remain generally 19%. Classification can vary for packaged items, delivery/takeaway bundles, supplements, vouchers, deposits and special cases. Make item tax category explicit and region-configured, with validated rate and effective date. Store tax rate at transaction time and immutable line-level tax snapshots. Where valid, calculate embedded VAT from VAT-inclusive gross item amount as `gross * rate / (100 + rate)` using cent-safe allocation and documented rounding; do not treat that formula as universal for vouchers, exemptions, adjustments or blended bundles.

The restaurant supplies its own tax identification/configuration; public guest menus must never expose tax IDs unnecessary for the guest. Business owner changes to tax settings should be privilege-checked and auditable. If merchant is a small business under §19 UStG, determine applicable treatment and wording with accountant; do not show a fake 7/19 VAT component if their particular invoice must not display it. Values in public item prices remain final VAT-inclusive consumer prices wherever applicable.

## 3. Separate confirmation documents and legally compliant receipts

At least two document classes should exist as justified by business rules:

1. **Guest payment/order confirmation:** useful for order tracker and guest; clearly identify restaurant, date/time, individual items and total, payment ID reference safe for guest, table/pickup, refund contact. Do **not** label it a TSE cash receipt or a full invoice unless it meets relevant legal requirements.
2. **Restaurant fiscal receipt/invoice:** issued by restaurant or on behalf of restaurant where contract authorizes it; §33 UStDV allows simplified invoices of <=250 EUR with prescribed contents; full invoices under §14 UStG need additional details. AO §146a/KassenSichV §6 may require transaction numbers, fiscal device/TSE signatures/serials in electronic or printed form. A generic QR code that links to Zackisch ordering is *not* the TSE receipt QR code.

Evaluate whether Zackisch's current functionality constitutes an electronic recording system requiring fiscalization and whether an integration/officially documented merchant POS capture flow is necessary. Legal and tax adviser must sign off a written classification. Do not promise effortless or legally sufficient manual registration in all cases. Configure clear merchant-facing copy and mandatory confirmation of accounting responsibilities after review.

## 4. POS data and reconciliations

For each paid order generate immutable facts: internal order ID, globally unique payment reference, paid and fulfilment timestamps, restaurant legal ID and region, item snapshots, quantity/options/tax category, guest gross amount, discounts/tips where supported, refunds, payment method and terminal/ticket data as appropriate. Provide a merchant export with identifiers allowing one-to-one comparison against existing POS bookings, Stripe balance reports and bank receipts. Make reconciliation report show unmatched/missing/duplicated orders and reasons; provide action to acknowledge corrected entries without silently altering original records.

Resolve manual double-entry policy: identify who books sale, when it must be booked, how to identify it as non-cash, whether the original TSE registers exactly the same event, and how to account for canceled, disputed, refunded, partially refunded or offline-paid orders. Test with realistic service scenarios and a professional tax adviser or POS/fiscalization specialist.

## 5. Zackisch B2B invoicing and bookkeeping

- Define service performed date, fee accrual point (successful charge vs completed order), fee calculation base (gross/net merchant payment), eligibility/exclusions, refunds and chargebacks, tax rate/recipient, contract price whether VAT inclusive or plus VAT, rounding and optional discounts in signed merchant terms.
- Issue compliant serial-numbered B2B invoices/credit notes in Zackisch's legal entity name with required §14 UStG fields, appropriate VAT or exemptions, invoice correction references, payment references and access to downloadable records. For domestic B2B, implement **structured E-invoices** (EN 16931-compatible e.g. XRechnung/ZUGFeRD appropriate profile), schema validation and archival, not PDF-only forever.
- Receive vendors' incoming E-invoices from 2025 onward through appropriate inbox/storage/process; do not assume Finom alone performs this without API or policy verification. Supplier Stripe invoices may require reverse-charge VAT treatment depending on exact contracting entity and invoice; tax adviser to sign off accounts and USt-ID use.
- Regional sales partners earning 50% of platform fee need independently classified B2B commission contracts and invoice/credit-note workflows. A `Gutschrift` under §14 UStG is a specific agreed tax document, not the same as refunding a guest or ordinary credit movement; handle partner self-billing only with explicit agreement.
- Revenue postings, charge fees, Stripe settlements, partner commissions and VAT summaries reconcile to Stripe and bank entries, and permit corrections without editing historical paid amounts.

## 6. E-invoicing phase timing (Germany)

In domestic taxable B2B situations where required, German businesses must accept E-invoices since 1 January 2025. Issuers can generally use other invoices through 2026; some with previous-year turnover <=800,000 EUR and certain EDI arrangements have transition through 2027. From the end of applicable transition, a plain PDF is not a structured E-invoice. Exceptions such as small-value invoices <=250 EUR and eligible small-business issuers can apply. Do not make the product dependent on a temporary transition. Confirm German BMF FAQ (March 2026): https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html .

## 7. Preservation and deletion

Use purpose-specific retention schedules with technical legal holds: invoice copies per §14b UStG normally eight years; AO §147 categories include ten, eight and six years with extensions. Archive original structured E-invoice payloads, changes/credit notes, contractual acceptance history and financial proofs in tamper-evident form. Prevent account deletion from destroying required records, while promptly removing unrelated account/profile/ticket/analytics data once grounds lapse. Convex backup is **not** a substitute for archival retention and a verified export process. Encrypt backups and limit restore access; test restoration in isolated staging.

## 8. Approval gates

Before live checkout:

- [ ] German tax adviser signs off restaurant tax categorization and status handling, guest document classes, merchant's POS manual/integrated workflow and TSE/DSFinV-K implications.
- [ ] Zackisch adviser signs off 2% service tax base and whether quote includes/excludes VAT, Stripe processing/reverse-charge cost treatment, partner commissions and refund corrections.
- [ ] E-invoice handling is demonstrably usable with sample XRechnung/ZUGFeRD validation and acceptance for own incoming invoices.
- [ ] Test: mixed 7/19 order, small-value invoice, ordinary full invoice, multi-rate add-on, VAT-exempt/small business if supported, refund, partial refund, failed charge, dispute, settlement mismatch, duplicate POS import prevention.
- [ ] Real merchant-facing service agreement and consumer copy match the actual implementation.

## 9. Official legal references

BMF 2026 food VAT: https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html ; BMF E-invoicing FAQ: https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html ; UStG §§14,14b,19,27: https://www.gesetze-im-internet.de/ustg_1980/__14.html ; https://www.gesetze-im-internet.de/ustg_1980/__14b.html ; https://www.gesetze-im-internet.de/ustg_1980/__19.html ; https://www.gesetze-im-internet.de/ustg_1980/__27.html ; UStDV §33: https://www.gesetze-im-internet.de/ustdv_1980/__33.html ; AO §146a/§147: https://www.gesetze-im-internet.de/ao_1977/__146a.html ; https://www.gesetze-im-internet.de/ao_1977/__147.html ; KassenSichV §6: https://www.gesetze-im-internet.de/kassensichv/__6.html .

## Explicit final Zackisch fee/tax rule and document separation

The negotiated standard commercial target is **2% of the successfully captured restaurant order subtotal including its VAT but excluding voluntary gratuities including VAT on the Zackisch service, to the extent applicable under verified Zackisch tax status**; Stripe's processing fee is independent and payable under the connected merchant's Stripe setup. For EUR 10.00 gross, the Zackisch *collected* application fee is EUR 0.20 total; do not add 19% on top of this figure. For a German VAT-liable domestic Zackisch B2B software supply at 19%, this sum corresponds to an unrounded taxable net of EUR 0.168067... and VAT of EUR 0.031932..., subject to consistent invoice-level rounding. Record Zackisch B2B tax independently of the merchant's 7/19% food/drink VAT and Stripe processor invoices. Monthly invoices/credits, proper e-invoice transitions and reverse-charge status are reviewed and configured based on actual legal entity.

The guest receives a **non-fiscal order/payment confirmation** from Zackisch and, when the applicable law requires it, a proper receipt or invoice from the restaurant via its own lawful fiscal process. POS is the intended source for the existing restaurant workflow but is **not the only mechanism legally capable of creating an invoice**. Immediate/near-transaction KassenSichV receipt timing, POS/TSE classification for an in-person QR/table payment, manner of electronic receipt acceptance and recording timestamps require a written fiscal opinion before production release. Implement staff POS acknowledgment, unique reference, payment already settled, reconciliation queue and immutable audit. See [Guest payment confirmation and POS](guest-confirmation-and-pos.md) and current BMF FAQ: https://www.bundesfinanzministerium.de/Content/DE/FAQ/FAQ-steuergerechtigkeit-belegpflicht.html .
