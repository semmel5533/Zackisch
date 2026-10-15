# Zackisch

Zackisch ist eine moderne, QR-basierte Bestell- und Bezahlplattform für Gastronomiebetriebe aller Art (Restaurants, Cafés, Imbisse, Bars). Gäste bestellen und bezahlen direkt über ihr eigenes Smartphone am Tisch oder zur Abholung – ohne App-Installation und ohne Registrierungszwang.

Dieses Repository ist ein Monorepo, das die öffentliche Marketing-Website (`website/`), die Webanwendung für Gäste und Gastronomiebetriebe (`webapp/`), die operative Verwaltungskonsole (`adminapp/`) sowie das gemeinsame reaktive Backend (`webapp/convex/`) vereint.

---

## Inhaltsverzeichnis

1. [Zackisch auf einen Blick](#1-zackisch-auf-einen-blick)
2. [So funktioniert die Plattform](#2-so-funktioniert-die-plattform)
3. [Geschäftsmodell und Partner](#3-geschäftsmodell-und-partner)
4. [Plattform und Anwendungen](#4-plattform-und-anwendungen)
5. [Technologie und Infrastruktur](#5-technologie-und-infrastruktur)
6. [Regionen und Sprachen](#6-regionen-und-sprachen)
7. [Betrieb und Administration](#7-betrieb-und-administration)
8. [Kommunikation und E-Mail](#8-kommunikation-und-e-mail)
9. [Sicherheit, Compliance und Betriebsgrenzen](#9-sicherheit-compliance-und-betriebsgrenzen)
10. [Repository-Überblick und lokaler Einstieg](#10-repository-überblick-und-lokaler-einstieg)
11. [Git-Commit-Konventionen](#11-git-commit-konventionen)
12. [Dokumentationsübersicht](#12-dokumentationsübersicht)

---

## 1. Zackisch auf einen Blick

- **Kernprodukt:** Digitale Speisekarte, tischgenaue QR-Bestellung, Abholservice und bargeldlose Bezahlung direkt im mobilen Webbrowser.
- **Zielgruppen:**
  - *Gäste:* Schnelle Bestellung und Bezahlung per Smartphone ohne App-Download.
  - *Gastronomiebetriebe:* Einfache Speisekartenpflege, Echtzeit-Verfügbarkeitssteuerung (86-Switch), digitale Küchenanzeige und Umsatzübersichten.
  - *Service- und Küchenpersonal:* Klare Küchenansicht auf Tablets für fehlerfreie Vorbereitung und zügige Ausgabe.
  - *Zackisch-Operations-Team:* Regionale Administration, Provisionsabrechnung, Newsletter-Marketing und E-Mail-Audit.
- **Nutzen:** Weniger Wartezeiten für Gäste, spürbare Entlastung des Personals zu Spitzenzeiten und zusätzliches Umsatzpotenzial durch intuitive Zusatzoptionen und Beilagenauswahl.
- **Primäre Domain:** `https://zackisch.com`
- **Startmarkt:** Deutschland (`de`), zweisprachig aufgestellt mit Deutsch und Englisch.

---

## 2. So funktioniert die Plattform

```text
Gast scannt QR-Code        Speisenauswahl & Optionen        Bargeldlose Zahlung
(am Tisch / zum Abholen) ──> im Browser des Smartphones ──> via Stripe (Apple Pay, Google Pay, Karte)
                                                                    │
                                                                    ▼
Bestell- & Zahlungsbeleg     Zubereitung in der Küche        Echtzeit-Auftrag
sofort als Download bereit <── auf dem Personal-Tablet   <── im Convex-Backend
```

1. **Gästeerlebnis:** Der Gast scannt den QR-Code am Tisch oder im Eingangsbereich. Die Speisekarte öffnet sich sofort im Browser. Artikel, Portionsgrößen und Extras werden ausgewählt und über Stripe Checkout bezahlt. Direkt nach der Zahlung steht eine herunterladbare Bestell- und Zahlungsbestätigung bereit; eine optionale E-Mail-Kopie kann auf Wunsch angefordert werden.
2. **Küchen- und Personalansicht:** Das Personal-Terminal (`/staff/[organizationId]`) visualisiert eingegangene Aufträge in Echtzeit. Bestellungen werden manuell von „In Bearbeitung“ auf „Abholbereit“ und „Abgeschlossen“ gesetzt.
3. **Kassenintegration und Einordnung:** Zackisch ist eine spezialisierte Bestell- und Zahlungsplattform, kein vollständiges Kassensystem (POS). Der Gastronomiebetrieb führt sein bestehendes Kassensystem unverändert fort. Digitale Bestellungen werden als unbare Umsätze manuell im Kassensystem erfasst. Die Einhaltung lokaler Beleg- und Fiskalisierungspflichten (z. B. KassenSichV / TSE in Deutschland) verbleibt eigenverantwortlich beim jeweiligen Betrieb.

---

## 3. Geschäftsmodell und Partner

- **Keine Fixkosten:** 0 € Einrichtungsgebühr und 0 € monatliche Grundgebühr.
- **Erfolgsbasierte Plattformgebühr:** 2 % Zackisch-Plattformgebühr auf das über die Plattform abgewickelte Bestellvolumen, zzgl. variabler Gebühren des Zahlungsdienstleisters (Stripe).
- **Regionales Partnerprogramm:** Lokale Vertriebspartner können Betriebe vermitteln. Vorgesehen ist eine Partnerprovision von 50 % der Zackisch-Plattformgebühr (entspricht 1 % des vermittelten GMV).
- **Vorbehalt und Compliance:** Steuerliche Pflichten, Rechnungsstellung, Umsatzsteuerabführung und Auszahlungsmodalitäten für Partner und Betriebe werden für jede Region gesondert rechtlich geprüft.

---

## 4. Plattform und Anwendungen

Das System besteht aus drei Frontend-Projekten und einem gemeinsamen Cloud-Backend:

| Anwendung | Verzeichnis | Öffentlich geplante Adresse | Hosting & Runtime | Zweck |
|---|---|---|---|---|
| **Website** | [`website/`](website/README.md) | `https://zackisch.com` | Cloudflare Pages (`output: "export"`) | Öffentliche Marketingseite, Preismodell, FAQ, rechtliche Angaben, Newsletter-An- und Abmeldung |
| **Webapp** | [`webapp/`](webapp/README.md) | `https://app.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Betriebs-Dashboard, Speisekarten- und Tischverwaltung, Küchen-Terminal, mobiler Gäste-Checkout |
| **Adminapp** | [`adminapp/`](adminapp/README.md) | `https://admin.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Interne operative Zentrale: Betriebe, Bestellungen, Partner-Gutschriften, No-Code-Newsletter, E-Mail-Log und Audit-Trail |
| **Convex Backend** | [`webapp/convex/`](webapp/convex/) | `*.convex.cloud` | Convex Serverless Cloud | Zentrales reaktives Datenbanksystem, serverseitige Regionsisolation, Google-Workspace-SMTP-Actions und Stripe-Webhooks |

---

## 5. Technologie und Infrastruktur

- **Next.js & React 19:** Moderne App-Router-Architektur mit serverseitigen Aktionen, Container-Queries und Tailwind CSS.
- **Cloudflare:** Authoritativer DNS-Provider für alle Domains (`zackisch.com`, `app.zackisch.com`, `admin.zackisch.com`). Hosting über Cloudflare Pages (Website) und Cloudflare Workers via `vinext` (Webapp und Adminapp).
- **Convex:** Reaktiv synchronisierte Single-Source-of-Truth-Datenbank mit Live-Subscriptions, serverseitiger Autorisierung und kryptografischen Tokens.
- **Stripe Connect Standard:** Bargeldlose Zahlungsabwicklung für Gäste mit direkter Auszahlung an verbundene Gastronomiebetriebe.
- **Google Workspace:** Zentraler Unternehmens-E-Mail-Dienst für geschäftliche Postfächer und automatisierten Systemversand über den Workspace-SMTP-Relay (`smtp-relay.gmail.com:587`, STARTTLS).
- **Finom:** Geschäftskonto und unterstützende Buchhaltungs- und Finanzprozesse.
- **Design System:** Typografie mit Poppins für Text und Inter für Tabellenzahlen; monochrome Schwarz-Weiß-Ästhetik mit abgerundeten Karten und Pill-Buttons (Dokumentation: [`DESIGN.md`](DESIGN.md)).

---

## 6. Regionen und Sprachen

- **Marketing-Website:** Klare Struktur aus Region zuerst und Sprache danach:
  - `/de-de`: Deutschland (Deutsch) – Standard
  - `/de-en`: Deutschland (Englisch)
- **Webapp (`app.zackisch.com`):** Führt Region und Sprache ohne URL-Präfix im Session-Kontext. Gastronomiebetriebe sind fest ihrer Geschäftsregion zugeordnet; die Nutzersprache kann in den Kontoeinstellungen unabhängig gewählt werden.
- **Serverseitige Isolation:** Alle Regionen nutzen dieselbe Convex-Bereitstellung, Datenzugriffe werden jedoch serverseitig strikt nach `regionId` gefiltert.
- **Geplante DACH-Erweiterung:** Österreich (`at`) und die Schweiz (`ch`) sind konzeptionell vorbereitet und werden nach Klärung der regionalen Steuersätze und Rechtsrahmen freigeschaltet.

---

## 7. Betrieb und Administration

Die operative Steuerung erfolgt über die [`adminapp/`](adminapp/README.md):

- **Rollenmodell:** Unterscheidung zwischen regionalen Administratoren und operativen Mitarbeitern mit feingliedrigen Rechten (Betriebe, Bestellungen, Personal, Partner, Newsletter, E-Mails, Audit).
- **Betriebsverwaltung (`/organizations`):** Übersicht aller registrierten Gastronomiebetriebe, Stripe-Connect-Status, Tischkontingente und Menülinks.
- **Partnerabrechnung (`/partners`):** Transparente Nachverfolgung vermittelter Betriebe und Buchung von Provisionsauszahlungen (50 % der Plattformgebühr).
- **No-Code-Newsletter-Editor (`/newsletter`):** Visuelle Gestaltung von E-Mail-Kampagnen auf Basis von Inhaltsblöcken (Texte, Bilder, Buttons, Trenner) mit Live-Vorschau, Testversand und double-opt-in-konformer Abonnentenverwaltung.
- **E-Mail-Log & Audit-Trail (`/emails`, `/audit`):** Protokollierung aller über Google Workspace versendeten Nachrichten sowie lückenloser, manipulationsgeschützter Audit-Trail mit automatischer Schwärzung vertraulicher Daten.

---

## 8. Kommunikation und E-Mail

- **Google Workspace:** Ausschließliche E-Mail-Infrastruktur für alle geschäftlichen und automatisierten Nachrichten:
  - `selim@zackisch.com`: Persönliches Workspace-Postfach des Gründers für Geschäftsführung und manuellen Kundensupport.
  - `noreply@zackisch.com`: Technischer Absender für automatisierte Transaktionsnachrichten (Login-Codes, Verifizierungslinks) und Newsletter.
- **Kein E-Mail-Zwang für Gäste:** Bestell- und Zahlungsbelege werden direkt im Browser zum Download angeboten. Gäste können freiwillig eine E-Mail-Zustellung aktivieren.
- **Abmeldekomfort:** Marketing-Nachrichten enthalten den standardkonformen One-Click-Unsubscribe-Header gemäß RFC 8058 (`List-Unsubscribe-Post: List-Unsubscribe=One-Click`). Eine Newsletter-Abmeldung berührt notwendige Sicherheitsnachrichten nicht.
- **Sicherheitsprinzip:** Anmeldecodes und vertrauliche Tokens werden niemals im Klartext in Logs oder Datenbankspiegeln gespeichert. Secrets verbleiben in der sicheren Convex-Secret-Verwaltung.

---

## 9. Sicherheit, Compliance und Betriebsgrenzen

- **Datenschutz & Gastgrenze:** Öffentliche Gast-Endpunkte filtern sensible Betriebsinterna (Stripe-Konto-IDs, Steuernummern, Plattformgebühren, Inhaber-IDs) vor der Auslieferung serverseitig heraus.
- **Kryptografische Absicherung:** Authentifizierungscodes und Session-Tokens werden über kryptografisch sichere Zufallsgeneratoren (`crypto.getRandomValues`) erzeugt. Login-Codes laufen nach 30 Minuten ab; nach fünf Fehlversuchen erfolgt eine permanente Sperrung des Codes.
- **Fiskalische Einordnung:** Zackisch ist kein Kassenersatz und entbindet den Betrieb nicht von den gesetzlichen Pflichten zur ordnungsgemäßen Kassenführung (z. B. TSE-Pflicht gemäß KassenSichV).
- **Betriebsgrenzen:** Die Bestellübersicht ruft standardmäßig die 100 neuesten Datensätze ab; CSV-Exporte enthalten geschätzte Zahlungsdienstleistergebühren und ersetzen keine zertifizierte Finanzbuchhaltung.

---

## 10. Repository-Überblick und lokaler Einstieg

### Voraussetzungen

- Node.js 20+ und npm
- Ein eingerichteter Convex-Zugang (`dev:silent-narwhal-392`)

### Lokale Entwicklung starten

Jedes Projekt kann unabhängig im Entwicklungsmodus ausgeführt werden:

```sh
# 1. Gemeinsames Convex-Backend bereitstellen (aus webapp/)
cd webapp
npm ci
npx convex dev

# 2. Webapp starten (Port 3001)
npm run dev -- --port 3001

# 3. Marketing-Website starten (Port 3000)
cd ../website
npm ci
npm run dev

# 4. Adminapp starten (Port 3002)
cd ../adminapp
npm ci
npm run dev
```

### Tests und Build-Prüfung

```sh
# Webapp: Typen prüfen, Vitest-Tests ausführen und Cloudflare-Dry-Run
cd webapp
npm run typecheck
npm test
npm run check:cloudflare

# Website: Statischen HTML-Export erstellen
cd ../website
npm run typecheck
npm run build

# Adminapp: Typen prüfen und Produktions-Build validieren
cd ../adminapp
npm run typecheck
npm run build
```

---

## 11. Git-Commit-Konventionen

In diesem Monorepo gilt ein verbindlicher, persönlicher Commit-Stil:

1. **100 % Kleinbuchstaben:** Jede Commit-Nachricht beginnt durchgängig kleingeschrieben (auch das allererste Wort).
2. **Englische Sprache:** Prägnante, technische und natürliche Formulierungen.
3. **Vergangenheitsform (Past Tense):** Verwendung handlungsorientierter Verben wie `added`, `changed`, `updated`, `fixed`, `removed`, `adjusted`, `switched`, `overhauled`, `isolated`.
4. **Konkrete Projekt- und Bereichsbezeichnung:** Nennung der betroffenen Oberfläche oder Komponente (z. B. `on website`, `on webapp`, `on adminapp`, `in documentation`, `on live orders`).
5. **Verbindung mit „and“:** Zusammenhängende Teilschritte werden flüssig mit `and` verknüpft.
6. **Keine Satzzeichen am Ende:** Kein abschließender Punkt und kein Ausrufezeichen.
7. **Keine Emojis und keine Präfixe:** Weder Emojis noch Conventional-Commit-Präfixe (wie `feat:`, `fix:`, `chore:`).

### Beispiele

```text
updated startup overview and restored commit guidelines in repository readme
translated project readmes and aligned mail documentation on website and webapp
updated adminapp documentation and fixed outdated repository links
```

---

## 12. Dokumentationsübersicht

Weiterführende Details und technische Spezifikationen sind in den folgenden Dokumenten zu finden:

| Dokument | Pfad | Inhalt |
|---|---|---|
| **Website-README** | [`website/README.md`](website/README.md) | Aufbau der statischen Marketingseite, Pfade, Sprachwechsel und Build |
| **Webapp-README** | [`webapp/README.md`](webapp/README.md) | Routen, Gast-Checkout, Betriebs-Dashboard, Terminal und Worker-Deploy |
| **Adminapp-README** | [`adminapp/README.md`](adminapp/README.md) | Operative Zentrale, Regional-Admins, Betriebe, Newsletter und Audit |
| **Produkt & Zielgruppen** | [`PRODUCT.md`](PRODUCT.md) | Fachliche Zielgruppen, Produktzweck, Kernversprechen und Modell |
| **Designsystem** | [`DESIGN.md`](DESIGN.md) | Gestaltungsprinzipien, Farben, Typografie, Maße und Barrierefreiheit |
| **Entwicklungsregeln** | [`AGENTS.md`](AGENTS.md) | Verbindliche Entwicklungsregeln, Next.js-Richtlinien und Sicherheitsstandards |
| **Architektur-Guide** | [`docs/architecture.md`](docs/architecture.md) | Technische Systemarchitektur, Datenfluss, Rollen und externe Schnittstellen |
| **Dokumentations-Audit** | [`docs/documentation-audit.md`](docs/documentation-audit.md) | Auditstatus, verifizierte Implementierungen und offene Handlungsfelder |
| **Design-Referenz** | [`docs/design-system.md`](docs/design-system.md) | Quellcode-verlinkte Komponentenreferenz und Gestaltungsdetails |
| **UX-Recherche** | [`docs/ux-research.md`](docs/ux-research.md) | Empirische UX-Grundlagen zu Lesbarkeit, Tastenhöhen und Interaktionen |
| **Produktdurchgang** | [`docs/walkthrough.md`](docs/walkthrough.md) | Manueller Durchgang der Kernfunktionen von Gästen und Betrieben |
| **SEO & Indexierung** | [`docs/seo.md`](docs/seo.md) | Mehrsprachige Auffindbarkeit, Metadaten, Sitemap und strukturierte Daten |
