# Help center information architecture and support workflows

## Purpose and URL model

The support site exists for independent merchant setup and operation, not to funnel users into tickets. Public pages at `https://support.zackisch.com/de-de` and `/de-en` are readable without login. Maintain stable localized categories and meaningful canonical article slugs; links from `app` should preserve market (`de`) and selected language. Ticket pages are private, noindex, under a clearly authenticated segment. Avoid separate identities or password stores. Users may require deliberate secure cross-origin session exchange; shared Convex deployment alone does not imply SSO.

## Help-center homepage

- Headline `Was möchtest du einrichten?` and search `Wobei brauchst du Hilfe?`.
- Primary entry `Zackisch einrichten`, `Das Personal-Tablet`, `QR-Codes drucken`, `Speisekarte`, `Bestellungen`, `Zahlungen und Gebühren`, `Probleme beheben`.
- Popular tasks and a progress-aware contextual article from the app when already logged in.
- Search suggests synonyms: `Tablet verbinden/koppeln/anmelden`, `QR ausdrucken/aufkleben`, `Bestellungen kommen nicht an`, `Kasse/POS`, `Stripe/Auszahlung`, `Schließung/Pause`.
- Empty search offers spelling correction, categories and `Support kontaktieren`, not a dead end.

## Article template

1. Search-friendly human title, e.g. `So verbindest du dein Personal-Tablet` (not `Terminal Setup V2`).
2. One-sentence goal and supported operating context/region.
3. `Was du brauchst` prerequisites, including compatible browser and stable internet where relevant.
4. Numbered single-action steps with real UI labels and accurate screenshots; no invented time estimate unless measured.
5. `Daran erkennst du, dass es funktioniert` verification.
6. `Wenn etwas nicht klappt` common symptoms, safe retry and escalation.
7. Links to next step, glossary or ticket; authorship/source ownership and last reviewed date if it can be maintained reliably.
8. English locale equivalent for Germany with the same actual behavior and tested crosslinks. Screenshots must correspond to current release.

## Required article inventory (release scope)

### Getting started and prerequisites

| Slug idea | Title (German source wording) | Validation |
| --- | --- | --- |
| `was-ist-zackisch` | Was ist Zackisch – und was bleibt wie bisher? | Explains POS supplementation and manual revenue entry |
| `voraussetzungen` | Was du vor der Einrichtung brauchst | Suitable tablet, browser, internet, payment account, POS |
| `selbst-registrieren` | So erstellst du deinen Zackisch-Account | Self-signup without team contact |
| `betrieb-anlegen` | So legst du deinen Betrieb an | Region and business verified |
| `einrichtungsassistent` | So nutzt du den Einrichtungsassistenten | Required vs optional and resume |
| `einrichtung-pruefen` | So prüfst du, ob du startklar bist | Server readiness versus dismissed steps |

### Payment, menu and accounting

| Slug idea | Title | Validation |
| --- | --- | --- |
| `stripe-verbinden` | So verbindest du dein Zahlungskonto | Stripe account verified, no live secrets in article |
| `stripe-pruefung` | Warum deine Zahlungsfreigabe noch aussteht | Pending/restricted state |
| `gebuehren` | Was Zackisch kostet | 2% and Stripe fee distinctions |
| `auszahlungen` | Wann du deine Auszahlungen siehst | Verify actual Stripe settings, no fixed unsupported promise |
| `erstattungen` | So gehst du mit Erstattungen um | Backend/Stripe behavior accurate |
| `kasse-buchungen` | Wie du Zackisch-Umsätze in deiner Kasse erfasst | Explicit manual workflow, tax/legal review |
| `speisekarte-starten` | So legst du deine Speisekarte an | Menu creation |
| `kategorien-artikel` | Kategorien, Gerichte und Getränke anlegen | Menu edits |
| `bilder` | Bilder für Speisen hinzufügen | Media types and rights |
| `optionen` | Größen, Extras und Beilagen einstellen | Server prices validated |
| `ausverkauft` | Gerichte vorübergehend ausblenden | Availability propagation |
| `preise-und-steuern` | Preise und Steuereinstellungen prüfen | Business responsibility |

### Staff tablet and daily operations

| Slug idea | Title | Validation |
| --- | --- | --- |
| `tablet-voraussetzungen` | Funktioniert mein vorhandenes Tablet? | Browser/device support matrix |
| `tablet-verbinden` | Personal-Tablet verbinden – Schritt für Schritt | Secure session pairing |
| `tablet-neu-verbinden` | Verbindung verloren? So meldest du das Tablet neu an | Token expiration/revocation |
| `tablet-position` | Wo das Tablet im Betrieb am besten steht | Practical operations |
| `neue-bestellungen` | Neue Bestellungen im Blick behalten | Live queue |
| `bestellstatus` | Bestellung vorbereiten, bereitstellen und abschließen | Actual state machine |
| `abholung` | Abholbestellungen richtig bearbeiten | Pickup customer flow |
| `tischbestellungen` | So erkennst du den richtigen Tisch | Table binding |
| `betrieb-pausieren` | Zackisch vorübergehend pausieren | Seasonal closure / manual service |
| `betrieb-fortsetzen` | Zackisch wieder aktivieren | Readiness revalidation |

### QR and print

| Slug idea | Title | Validation |
| --- | --- | --- |
| `tische-anlegen` | Tische anlegen und benennen | Exact limits from code |
| `qr-generieren` | QR-Codes für Tische erstellen | URL validation |
| `qr-zuhause-drucken` | QR-Codes mit deinem Drucker ausdrucken | A4 scale and cut guide |
| `qr-druckerei` | QR-Vorlage für eine Druckerei vorbereiten | Vector/press output |
| `qr-anbringen` | Wo du die QR-Codes platzierst | Scanning and guest choice |
| `qr-testen` | Jeder Code muss zum richtigen Tisch führen | Scanner validation |
| `qr-scan-fehler` | Kamera scannt den QR-Code nicht | Quiet zone/contrast/fallback |
| `abhol-qr` | QR-Code für Abholung erstellen | Correct pickup endpoint |

### Guest checkout, troubleshooting, security and account

| Slug idea | Title | Validation |
| --- | --- | --- |
| `gast-bestellen` | So bestellen deine Gäste per QR-Code | No guest app or account |
| `gast-bezahlen` | So bezahlen deine Gäste | Actual provider methods and totals |
| `zahlung-ausstehend` | Zahlung noch nicht bestätigt – was tun? | Pending, no double payment |
| `beleg` | Bestellbestätigung und Beleg finden | Actual downloadable artifact |
| `bestellung-kommt-nicht-an` | Bestellung erscheint nicht auf dem Tablet | Connectivity/reconciliation |
| `internet-ausfall` | Was bei einer Störung passiert | Existing POS fallback, paid order checks |
| `anmelden` | Anmeldung und Passwort zurücksetzen | Security/OTP flows |
| `account-loeschen` | Account und Betriebsdaten löschen lassen | Verified legal/technical process |
| `datenschutz` | So schützen wir deine Daten | Accurate, verified controls only |
| `support-ticket` | So schreibst du dem Zackisch-Team | Ticket login and thread |
| `support-anhaenge` | Sichere Screenshots mit dem Support teilen | PII redaction and private attachments |

Article inventory is the **minimum editorial completion contract**. Agent should create full genuine content and current annotated screenshots, not empty stubs or AI-generated generic step lists. Keep all articles current when UI labels change.

## Ticket lifecycle and security

Ticket from merchant account always belongs to one authorized business and region. Customer selects their own business if they have more than one, sees issue category and status (e.g. `new`, `open`, `waiting_for_customer`, `resolved`, `closed`) and a chronological public thread. Ops staff can assign, answer, leave internal notes and change status with permission. Every message includes safe immutable author/time identity. Customer never sees staff-only notes, internal audit metadata, privileged attachment URLs or another business's conversation. Validate MIME/size, per-user quota, rate limits, text escaping and optional spam controls.

Notifications use the established Google Workspace sending infrastructure through approved Convex actions and a retry-safe outbox. Avoid emailing private ticket text in a manner that could expose secrets; prefer `Neue Antwort verfügbar` and secure link. Do not send duplicate email on idempotent retries. Support response expectations must not be advertised as contractual SLAs without a measured/approved policy.

## Internal workflow

Queue filters by region/status/assigned agent/age and category; chronological thread with clear **customer reply** versus **internal note** editor. Internal notes should be a physically separate server-side operation. At submission time, identify author, destination, business and visibility, and provide confirmation for sensitive mode switches. Authorized staff can merge/close/reopen only if such operations are explicitly built and audited; do not invent actions in docs. Every state change audited with redacted details.

## Governance and publication

Content owners in engineering/support sign off on articles relevant to a feature in the same PR; update screenshots, translations, internal links and search synonyms. Publish only after feature and docs are both validated. Avoid stale screenshots of removed routes or product names. For German/English parity use code-based checks that all required localized article IDs exist. Keep ticket surfaces out of sitemaps and crawlers. Preserve help availability even when the main merchant app is degraded where architectural dependencies permit.

## German legal, payments and fiscal help content

Publish clear, legally reviewed merchant tutorials covering: who sells to the guest and handles refunds; why Stripe conducts KYC and may charge processing fees; when a merchant is ready to accept payments; how Zackisch's contractual 2% platform charge works (exact taxable base and VAT treatment); where actual Stripe fees, application fees, transfers and bank payouts can be found; full and partial refunds and disputes; mixed German food/drink VAT (7% eligible food from 2026 and generally 19% drinks); POS reconciliation and officially reviewed receipt/TSE responsibilities; allergen and menu information; invoice download and E-invoice reception; how to correct merchant tax data; GDPR merchant responsibilities and privacy requests; optional cookie/newsletter consent; use of account deletion versus legally required record retention. Link each article to the real implemented step, current legal page and verified screenshot; do not publish speculative accounting/legal shortcuts. The legal/fiscal categorization must be reviewed by qualified practitioners before the articles go live. See `germany-legal-and-regulatory.md`, `payments-and-stripe.md`, `tax-invoicing-and-fiscalization.md`, `privacy-and-data-governance.md` and `legal-pages-consents-and-contracts.md`.

## Payment onboarding and POS help articles (publish as tested tutorials)

- `Zahlungen mit Stripe direkt in Zackisch einrichten`: why identity verification is required, expected Stripe branding/terms, bank data securely supplied to Stripe, what `Zahlungen aktiv` and `Auszahlungen aktiv` mean, what remains pending, when limited Stripe login is unavoidable.
- `Zackisch-Gebühren verstehen`: 0 EUR setup and recurring base, 2%-VAT-inclusive standard fee on eligible paid order subtotal (excluding voluntary gratuities), separate actual Stripe fees, refunds and how invoices/credits are received.
- `Zackisch-Bestellungen in der bestehenden Kasse erfassen`: exact paid-order/never double-charge procedure, how `In Kasse erfasst` and nightly reconciliation work, tax categories and refund correction examples; do not present generic tutorial as POS-vendor certified.
- `Bestell- und Zahlungsbestätigung oder Kassenbeleg?`: clearly separate Zackisch's non-fiscal downloadable confirmation, Stripe payment details, merchant POS statutory receipt and merchant-issued tax invoice; how guest obtains each.
- `Zahlungsbestätigung ohne Bestellung`, `Kunde bezahlt, Tablet offline`, `Zahlung zurückerstatten`, `Stripe-Verifizierung fehlt` with tested recovery procedures and secure ticket escalation.

See [Payments](payments-and-stripe.md), [Guest/POS](guest-confirmation-and-pos.md).
