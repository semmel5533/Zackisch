# Zackisch Website (`root`)

Die öffentliche Website unter `https://zackisch.com` erklärt Zackisch für Gastronomiebetriebe in Deutschland (B2B-Marketing) und führt direkt zur Selbstregistrierung (`app.zackisch.com/sign-up`) oder zum Voraussetzungen-Check.

Sie stellt den operativen Nutzen für Gastronomen in den Mittelpunkt:
- **Bestehende Kasse behalten:** Keine erzwungenen Kassenwechsel, keine KassenSichV-/TSE-Eingriffe. Bestellungen werden bezahlt auf einem vorhandenen Tablet angezeigt und vom Personal manuell in die vorhandene Kasse gebucht.
- **Eigenständig einrichten & testen:** Menüerstellung im Browser, QR-Codes selbst als PDF generieren und ausdrucken.
- **Transparente Preise:** 0 € Einrichtungsgebühr, 0 € Monatsgebühr, 2 % Zackisch-Plattformgebühr pro bezahlter Bestellung (ohne Trinkgeld) zzgl. direkter Zahlungsabwicklung via Stripe.
- **0 € Lohnkosteneinsparung:** Realistische Modellierung ohne falsche Versprechen von Personalabbau.

---

## 1. Technischer Stack & Architektur

- **Framework:** Next.js 16 (App Router + Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Poppins Markenfont, Inter UI-Font, semantische Tokens
- **Komponenten:** Headless `@base-ui/react`, `@astryxdesign/core` Designsystem
- **Routing & Proxy:** Next.js 16 `proxy.ts` für HTTP 307 Spracherkennung und saubere 404-Behandlung
- **Testing:** Vitest für deterministische Unit- & E2E-Acceptance-Tests (`tests/`)
- **Strikte Trennung:** Reines statisches/SSR B2B-Marketingfrontend. **KEIN** Convex-Backend, **KEIN** Stripe-SDK im Bundle, keine Tracking-Cookies ohne Einwilligung.

---

## 2. Routenstruktur & Mehrsprachigkeit

| Route | Sprache / Region | Zweck |
| :--- | :--- | :--- |
| `GET /` | Dynamisch (307) | Prüft `Accept-Language` und leitet auf `/de-de` oder `/de-en` weiter |
| `/[locale]` | DE / EN | Homepage mit 12 modularen Sektionen, interaktiver Demo & Rechner |
| `/[locale]/product` | DE / EN | Detaillierte Produktübersicht |
| `/[locale]/product/smart-menu` | DE / EN | Intelligentes Menü, Modifikatoren, Empfehlungen |
| `/[locale]/product/staff-dashboard` | DE / EN | Personal- & Küchenansicht, 86-Ausverkauft-Echtzeittoggle |
| `/[locale]/solutions/*` | DE / EN | Branchenlösungen (Restaurants & Bars, Cafés, Quick-Service, Pickup) |
| `/[locale]/pricing` | DE / EN | Transparente Preisstruktur (2 % Gebühr, 0 € Fixkosten, Stripe) |
| `/[locale]/potential-calculator` | DE / EN | Interaktiver Potenzialrechner v3 gemäß Spezifikation |
| `/[locale]/research` | DE / EN | 10 wissenschaftliche Primärstudien mit DOIs & Einordnung |
| `/[locale]/about` | DE / EN | Gründerstory von Selim Eser, Vision, MARS Center Unterstützung |
| `/[locale]/contact` | DE / EN | Direkter E-Mail-Kontakt (`selim@zackisch.com`), Support-Link |
| `/[locale]/legal-notice` | DE / EN | Impressum (§ 5 DDG Anbieterkennzeichnung) |
| `/[locale]/privacy` | DE / EN | Datenschutzerklärung (DSGVO Art. 13/14) |
| `/[locale]/cookies` | DE / EN | Cookie-Richtlinie |
| `/[locale]/legal/business-terms` | DE / EN | B2B-Nutzungsbedingungen |
| `/[locale]/legal/guest-terms` | DE / EN | Gast-Bestellbedingungen |
| `/[locale]/legal/payments` | DE / EN | Zahlungsabwicklung & Stripe-Connect-Information |

### 404-Verhalten
- Unbekannte Pfade unter `/de-de/*` liefern ein deutsches HTTP 404 (`Hier ist gerade nichts zu bestellen.`).
- Unbekannte Pfade unter `/de-en/*` liefern ein englisches HTTP 404 (`There is nothing to order here.`).
- Unbekannte Pfade **ohne** Sprachpräfix (z. B. `/nicht-existiert`) liefern direkt ein englisches HTTP 404 ohne Redirect.

---

## 3. Potenzialrechner v3 (Mathematischer Kontrakt)

Der Potenzialrechner implementiert exakt die mathematische Spezifikation aus `docs/CALCULATOR_MODEL_SPEC.md`:
- **Nur 2 Eingaben:** Zeitraum (Jahr / Monat / Tag) und bisheriger Nettoumsatz in €.
- **Default-Zustand:** Jahr / 420.000 € (entspricht 35.000 €/Monat bzw. 1.400 €/Tag bei 300 Betriebstagen).
- **Referenz-Ergebnisse (Jahr / 420.000 €):**
  - Rechnerisches Umsatzpotenzial: **+18.840 € / Jahr**
  - Modellierter zusätzlicher Ergebnisbeitrag: **+4.404,60 € / Jahr** (Display: **+4.405 €**)
  - Personalkosteneinsparung: **0,00 €** (transparent ausgewiesen)
- Alle Referenzvektoren sind durch automatisierte Tests in `tests/calculator.test.ts` abgedeckt.

---

## 4. Lokale Entwicklung & Befehle

```bash
# Abhängigkeiten installieren
npm install

# TypeScript Typecheck
npm run typecheck

# Automatisierte Tests ausführen
npm test

# Next.js Entwicklungsserver starten (Port 3000)
npm run dev

# Produktions-Build erstellen
npm run build

# Produktions-Server starten
npm run start -- -p 3000
```

---

## 5. Externe Links & Schnittstellen

- **Betreiber-Registrierung:** `https://app.zackisch.com/sign-up` (immer im neuen Tab: `target="_blank" rel="noopener noreferrer"`)
- **Betreiber-Anmeldung:** `https://app.zackisch.com/sign-in` (neuer Tab)
- **Newsletter-Anmeldung:** `https://app.zackisch.com/newsletter` (neuer Tab)
- **Hilfe & Wissensportal:** `https://support.zackisch.com` (neuer Tab)
- **Direkter Kontakt:** `mailto:selim@zackisch.com`

---

## 6. Medien & Compliance

- **Keine generativen KI-Bilder:** Siehe `docs/MEDIA_LICENSES.md` für das vollständige Lizenzverzeichnis aller verwendeten Fotos (Unsplash, Pexels, Gründerportrait).
- **Offene Launch-Punkte:** Siehe `docs/LAUNCH_BLOCKERS.md` für alle juristischen, steuerlichen und kaufmännischen Freigaben vor dem offiziellen Livegang.
