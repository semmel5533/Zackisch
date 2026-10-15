# Zackisch

Zackisch ist eine moderne, QR-basierte Bestell- und Bezahlplattform für die Gastronomie. Gäste bestellen und bezahlen direkt über ihr Smartphone (am Tisch oder zur Abholung); Gastronomen verwalten Speisekarten, Bestellungen, Personal-Terminals und QR-Codes in der Webapp. Das operative Zackisch-Team steuert Restaurants, Bestellungen, Partner-Gutschriften und No-Code-Newsletter über die Adminapp.

Das kommerzielle Modell umfasst **keine Einrichtungsgebühr, keine monatliche Grundgebühr und eine Zackisch-Plattformgebühr von 2 % pro relevanter Bestellung** (zzgl. variabler Zahlungsdienstleistergebühren). Vertriebspartner erhalten 50 % der Plattformgebühr (1 % GMV).

## Projektstruktur und Hosting

| Anwendung | Öffentliche Adresse | Hosting & Technologie | Zweck |
| --- | --- | --- | --- |
| `website/` | `https://zackisch.com` | Cloudflare Pages (Next.js Static Export `out/`) | Mehrsprachige Marketing- und Rechtswebsite (`/de-de`, `/de-en`), Double-Opt-In-Newsletter und Abmeldung |
| `webapp/` | `https://app.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Gastronomen-Dashboard, Küchendisplay, 86-Verfügbarkeitsmanager und digitaler Gäste-Checkout |
| `adminapp/` | `https://admin.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Interne operative Zackisch-Zentrale: Übersicht, Restaurants, Bestellungen, Personal, Partner, No-Code-Newsletter, E-Mail-Log und Audit-Trail |
| `webapp/convex/` | `*.convex.cloud` | Convex (Shared Backend & Realtime-DB) | Gemeinsames Backend aller drei Apps mit reaktiven Queries, Mutationen, kryptografischen Tokens und serverseitiger Regionsisolation |

## Lokale Entwicklung

Jede Anwendung kann unabhängig ausgeführt werden. Alle drei Frontend-Anwendungen greifen auf dasselbe Convex-Backend zu.

```sh
# 1. Gemeinsames Backend starten (aus webapp/)
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

## E-Mail-Infrastruktur

Zackisch nutzt **Google Workspace** als alleinigen E-Mail-Anbieter (`smtp-relay.gmail.com:587`, STARTTLS):
- Sichtbarer Absender für automatisierte Systemnachrichten und Newsletter: `noreply@zackisch.com`
- Reply-To und persönlicher Support: `selim@zackisch.com`
- Authentifizierung über Google Workspace SMTP-App-Passwort, serverseitig in der Convex-Secret-Verwaltung hinterlegt.
- RFC 8058 One-Click-Unsubscribe (`List-Unsubscribe-Post: List-Unsubscribe=One-Click`) wird serverseitig über den Convex HTTP Router bereitgestellt.

## Qualität und Verifikation

- **Website:** `npm run typecheck` und `npm run build` (19 statische HTML-Seiten in `out/`).
- **Webapp:** `npm run typecheck`, `npm test` (32 Vitest-Tests bestanden), `npm run build` und `npm run check:cloudflare` (Dry-Run bestanden).
- **Adminapp:** `npm run typecheck` und `npm run build` (11 statische Pages).
- **Convex:** `npx convex dev --once` (Typisierte Schemas, Actions, Mutationen und HTTP-Routen ohne Fehler deployt).
