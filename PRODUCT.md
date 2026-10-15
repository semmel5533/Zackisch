# Zackisch – Produktübersicht und Leistungsversprechen

<!-- impeccable:product-schema 1 -->

## 1. Plattform

Webbasiertes Gesamtsystem (Next.js, Cloudflare Pages & Workers, reaktives Convex-Echtzeit-Backend)

---

## 2. Nutzer und Zielgruppen

Zackisch ist eine digitale Bestell- und Zahlungsplattform für Gastronomiebetriebe, Personal, Gäste und operative Teammitglieder:

- **Gäste:** Scannen tisch- oder abholbezogene QR-Codes und bestellen sowie bezahlen direkt im mobilen Browser ohne App-Download. Sofortige Bereitstellung eines herunterladbaren Bestell- und Zahlungsbelegs.
- **Betreiber von Gastronomiebetrieben (Restaurants, Cafés, Imbisse, Bars):** Verwalten Speisekarten, Kategorien, Zusatzoptionen, Preise, Tischkontingente, QR-Codes und tagesaktuelle Verfügbarkeiten im Betriebs-Dashboard.
- **Service- und Küchenpersonal:** Erhalten eingehende Bestellungen in Echtzeit auf einem dedizierten Tablet-Terminal und schalten ausverkaufte Artikel über den 86-Manager sofort ab.
- **Zackisch-Regional-Admins und Mitarbeiter:** Operative Kontrolle in der Adminapp über regionale Betriebe, Bestellungen, Team-Berechtigungen, Partner-Provisionen und No-Code-Newsletter-Kampagnen.

---

## 3. Produktzweck

App-freie QR-Bestellung und bargeldlose Bezahlung parallel zum bestehenden Kassensystem des Betriebs, mit einem fairen Pay-as-you-earn-Preismodell und serverseitig isolierter regionaler Administration.

---

## 4. Kommerzielle Konditionen und Funktionsumfang

- **0 € Grundgebühr & 0 € Einrichtungsgebühr:** Kostenlose Registrierung und Inbetriebnahme.
- **2 % Zackisch-Plattformgebühr pro Bestellung:** Betriebe zahlen lediglich 2 % des über die Plattform abgewickelten Bruttobestellvolumens (zzgl. variabler Zahlungsdienstleistergebühren).
- **50 % Partnerprovision:** Regionale Vertriebspartner erhalten 50 % der Zackisch-Plattformgebühr (entspricht 1 % des vermittelten GMV).
- **Stripe Connect Integration:** Direkte Händlerauszahlungen über Stripe Connect Standard.
- **Google Workspace als alleinige E-Mail-Infrastruktur:** Automatisierter Versand von Transaktions- und Marketing-E-Mails über Google Workspace SMTP (`noreply@zackisch.com`) mit standardkonformem RFC-8058-One-Click-Unsubscribe.
- **Operative Zentrale (`adminapp`):** No-Code-Newsletter-Editor, Double-Opt-In-Abonnentenverwaltung, E-Mail-Protokolle, Partner-Ledger und manipulationsgeschützte Audit-Logs.

---

## 5. Markenidentität und Gestaltungsregeln

- **Markenname:** Zackisch (`https://zackisch.com`, `https://app.zackisch.com`, `https://admin.zackisch.com`).
- **Verbindliche Original-Assets:** `brand_mark` (nur Symbol) und `combination_mark` (Symbol mit Wortmarke).
- **Designsystem:** Poppins für primäre Typografie, Inter für Tabellenzahlen und Geldbeträge, monochrome Schwarz-Weiß-Farbpalette mit pillenförmigen Aktionsbuttons und abgerundeten Karten (20 px).
- **Offizieller Kontakt:** `selim@zackisch.com` (persönlicher Gründer- und Kundensupport).
- **Wissenschaftliche Unterstützung:** MARS – Center for Entrepreneurship an der Hochschule Mannheim.

---

## 6. Architektur und regionale Isolation

- **Gemeinsames Backend:** Eine einheitliche, reaktive Convex-Backend-Instanz unter `webapp/convex/` versorgt `website/`, `webapp/` und `adminapp/`.
- **Regionale Bindung:** Teammitglieder und Betriebsdatensätze sind fest ihrer zugewiesenen Betriebsregion zugeordnet (Start mit Deutschland `de`). Regionsübergreifende Zugriffe sind serverseitig unterbunden.
- **Sicherheit & Gast-Datenschutz:** Öffentliche Gast-Schnittstellen filtern interne Betriebs-IDs, Inhaber-IDs, Stripe-Schlüssel und Plattformgebühren vollständig heraus. Die Authentifizierung erfolgt über kryptografisch sichere Zufallstokens.
