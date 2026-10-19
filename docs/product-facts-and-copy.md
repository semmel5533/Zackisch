# Product facts, copy invariants and communication policy

## Brand mark and trust boundaries

Poppins is a non-negotiable part of the Zackisch brand identity because the original wordmark and combination mark use it; always preserve the existing `brand_mark.svg`, `word_mark.svg`, and `combination_mark.svg` assets under `root/public/`. Supporting UI typography and visual layout are governed by the owner-approved design system (`design-system/README.md`).

Use only verified factual security and operational wording such as **`Deine Bestellungen und Betriebsdaten sind über geschützte Zugriffe verwaltbar.`** once authorization tests verify the claim. Do not promise legal certification, `100 % sicher`, guaranteed uptime, legal exemption from POS/TSE requirements, Stripe's specific processing fees without source/date, or free third-party services. Legal release copies must explain that hospitality businesses remain the sellers of food and beverages, Zackisch provides ordering software, and Stripe handles payment services under the connected-account Direct Charges model. Refer to `germany-legal-and-regulatory.md` and `legal-pages-consents-and-contracts.md` for truthful claim boundaries.

## Positioning

Zackisch is the **self-service, pay-per-use QR ordering and payment complement to the existing hospitality operation**, initially for Germany. It is not a POS replacement. Hospitality owners can go from eligibility check to live QR ordering using their own compatible devices and print resources, without a mandatory sales call or technician. Help and authenticated ticket support remain available. Guests choose whether to order digitally. The existing cashier and personal service continue.

**Core message (preferred German wording):** `Deine Kasse bleibt. Deine Gäste bestellen selbst.`

**Supporting message:** `Selbst einrichten. Eigene Geräte nutzen. Nur bei Bestellungen bezahlen.`

**Pricing fact:** `0 € Zackisch-Einrichtungsgebühr. 0 € monatliche Zackisch-Grundgebühr. 2 % Zackisch-Plattformgebühr auf über Zackisch abgewickelte Bestellungen (ohne freiwilliges Trinkgeld), zuzüglich Gebühren des Zahlungsdienstleisters.` Validate the contractual fee base, refunds, and VAT; do not pretend all fees are zero or included. If the service is not used, the percentage Zackisch fee does not arise. Connectivity, print, device, and outside costs can still exist. Every marketing claim must match release behavior.

## Real differentiation, no exclusivity claim

QR ordering is established and other providers may also complement an existing system. Zackisch highlights the **combination** of keeping the existing POS, autonomous sign-up and setup, compatible existing devices, printable own QR signage, optional guest use, percentage-only Zackisch fees, Smart Menu recommendations based on verified store sales, clear support, and manual fallback. Do not claim "first in Germany", "only solution", automatic POS sync, guaranteed revenue growth, or offline payment processing.

## Writing style rules

- German B2B and product communication uses respectful, direct `du/dein`. Legal copy uses formal, legally accurate language.
- Prefer `Betrieb`, `Kasse`, `Bestellung`, `Personal-Tablet`, `QR-Code`, `selbst einrichten`, `Hilfe-Center`, `Zahlungsanbietergebühren` over `Gastro-Ökosystem`, `Omnichannel`, `Terminal-Orchestrierung`, `disruptiv`, `100 % kostenlos`.
- One idea per heading, descriptive action verbs for buttons, precise state labels for errors. No emoji, excessive exclamation points, faux-casual slang, fake metrics, or stacked slogan walls.
- Be accurate about payment provider fees, POS manual accounting, device requirements, setup effort, and availability. Avoid absolute security or availability claims (`bankensicher`, `unknackbar`, `garantiert verfügbar`).
- Customer-facing print signs must not show platform fee calculations, internal operational jargon, or enterprise claims.

## Pricing microcopy and truth table

| Claim | Acceptable when verified | Avoid |
| --- | --- | --- |
| No monthly Zackisch fee | `Keine monatliche Zackisch-Grundgebühr.` | `Alle Kosten entfallen, wenn du nichts verkaufst.` |
| Percent fee | `2 % Zackisch-Plattformgebühr ... zzgl. Zahlungsanbietergebühren.` | `Nur 2 % Gesamtkosten.` |
| Own device | `Ein geeignetes vorhandenes Tablet kann ausreichen.` | `Jedes alte Tablet funktioniert garantiert.` |
| POS | `Du nutzt dein bisheriges Kassensystem weiter.` | `Zackisch macht deine Kasse überflüssig.` |
| Outage | `Du kannst im gewohnten Kassenbetrieb weiterarbeiten.` | `Zackisch läuft auch ohne Internet.` |
| Security | `Zugriffe werden rollen- und betriebsbezogen geprüft.` (when tested) | `100 % sicher und ausfallsicher.` |
| Smart Menu | `Empfehlungen und Beliebteste basieren auf echten bezahlten Bestellungen deines Betriebs.` | `Garantiert 30 % höherer Bonwert durch KI-Upselling.` |

## Payment and receipt microcopy for Germany

- Merchant onboarding: **`Zahlungen einrichten – direkt in Zackisch.`** Subtext: `Stripe prüft sicher die nötigen Unternehmens- und Bankangaben. Du bleibst in Zackisch und siehst jederzeit, was noch fehlt.`
- Payment transparency: **`Keine Grundgebühr. Zackisch verdient nur mit, wenn du Bestellungen darüber abwickelst.`** Footer/fee disclosure: `2 % vom erfolgreich bezahlten Bestellwert ohne freiwilliges Trinkgeld, inklusive Umsatzsteuer auf unsere Gebühr, sofern anwendbar. Zuzüglich Stripe-Zahlungsgebühren.`
- Guest final commitment: **`Zahlungspflichtig bestellen`** (with complete order review and seller identity above the button per § 312j BGB).
- Guest success: **`Bezahlt. Deine Bestellung ist beim Betrieb eingegangen.`** Only after server-verified Stripe payment and order creation. Document title `Bestell- und Zahlungsbestätigung`; explanatory note: `Dies ist kein Kassenbeleg und keine Rechnung. Der Gastronomiebetrieb bietet dir den gesetzlich erforderlichen Beleg an und stellt bei entsprechender Pflicht eine Rechnung aus.`
- Staff states: **`Bereits mit Zackisch bezahlt`**, **`In Kasse erfasst`**, **`Kassenabgleich offen`**, **`Zahlung wird geprüft`** as distinct states.
