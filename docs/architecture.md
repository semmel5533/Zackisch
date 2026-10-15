# Systemarchitektur und Entwicklerhandbuch

Dieses Dokument beschreibt die technische Architektur, Laufzeitgrenzen, Sicherheitsmodelle und Datenflüsse der Plattform **Zackisch**.

---

## 1. Systemtopologie und Drei-App-Architektur

Zackisch ist als Monorepo organisiert, das drei Next.js-Frontend-Anwendungen mit einem gemeinsamen, reaktiven Convex-Cloud-Backend verbindet:

```text
├── website/       Öffentliche statische Marketing- & Rechtswebsite (Cloudflare Pages, out/)
├── webapp/        Betriebs-Dashboard, Küchenterminal & mobiler Gäste-Checkout (Cloudflare Workers)
├── opsapp/        Operative Zentrale für Regional-Admins & Mitarbeiter (Cloudflare Workers)
└── webapp/convex/ Zentrales reaktives Convex-Backend, Datenbank, Actions und Storage
```

| Anwendung | Öffentliche Adresse | Laufzeit & Hosting | Hauptaufgaben |
|---|---|---|---|
| `website/` | `https://zackisch.com` | Cloudflare Pages (`output: "export"`) | Regionale Marketingseiten (`/de-de`, `/de-en`), Double-Opt-In-Newsletter-Anmeldung, Abmeldung und rechtliche Pflichtangaben. |
| `webapp/` | `https://app.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Betriebs-Onboarding, Speisekarten- und Tischverwaltung, 86-Verfügbarkeitsmanager, Küchen-Terminal und bargeldloser Gäste-Checkout. |
| `opsapp/` | `https://ops.zackisch.com` | Cloudflare Workers (`vinext`, Next.js App Router) | Operative Zentrale: Regionale Übersicht, Betriebsverwaltung (`/organizations`), Bestellungen, Teamberechtigungen, Partner-Provisionen, No-Code-Newsletter-Editor und Audit-Log. |
| `Convex` | `*.convex.cloud` | Convex Serverless Cloud (`dev:silent-narwhal-392`) | Reaktive Echtzeit-Datenbank, kryptografische Tokens, Google-Workspace-SMTP-Versand, Stripe-Webhooks und öffentliche HTTP-Endpunkte. |

---

## 2. Regionale Struktur und Datenbegrenzung

- **Zentrale Domain mit Subdomains:** Alle Dienste laufen unter `zackisch.com` und den zugeordneten Subdomains (`app.zackisch.com`, `ops.zackisch.com`), gestützt durch dieselbe Convex-Bereitstellung.
- **Startregion:** Deutschland (`de`). Weitere Regionen (Österreich `at`, Schweiz `ch`) sind im Backend strukturell vorbereitet und werden nach Klärung regionaler Steuersätze freigeschaltet.
- **Serverseitige Isolation:** Mitarbeiter in der Opsapp arbeiten ausschließlich innerhalb ihrer zugewiesenen Region (`regionId`). Datenbankabfragen und Mutationen erzwingen diese Begrenzung serverseitig.
- **Gästegrenze & Datenminimierung:**
  - `orders.getGuestOrderTracker`: Filtert Bestelldaten und liefert ausschließlich für Gäste bestimmte Felder aus (Artikel, Bestellnummer, Tisch, Status, Typ, Summe). Interne Plattformgebühren, Stripe-Zahlungs-IDs und Betriebssteuernummern werden nicht exponiert.
  - `organizations.getPublicRestaurant`: Liefert nur öffentliche Betriebsdaten (Name, Beschreibung, Medien, Bestellstatus). Inhaber-IDs, Steuernummern und Stripe-Konto-IDs werden serverseitig entfernt.

---

## 3. Authentifizierung und Sicherheitsarchitektur

1. **Kryptografische Token- und Code-Generierung:**
   - 6-stellige Einmal-Codes (OTP): Werden über kryptografisch sichere Zufallsgeneratoren (`crypto.getRandomValues`) erzeugt.
   - Session- und Double-Opt-in-Tokens: 24-Byte-Zufallswerte, hexadezimal kodiert.
   - Gültigkeitsdauer: OTP-Codes verfallen nach 15 bis 30 Minuten; ein Brute-Force-Schutz sperrt den Code nach fünf aufeinanderfolgenden Fehlversuchen permanent.
2. **Operations- und Mitarbeiterrollen:**
   - Der initiale Regional-Administrator wird sicher über Convex-Funktionen hinterlegt (keine offene Registrierungs-Schnittstelle).
   - Die Opsapp schützt alle Arbeitsbereiche über das `OpsLoginForm` / `AdminLoginForm` mit verpflichtendem Zwei-Faktor-Login (E-Mail + Passwort + 6-stelliger E-Mail-Code via Google Workspace SMTP von `noreply@zackisch.com`).
   - Sitzungen werden nach Validierung in `verificationCodes` hinterlegt, clientseitig gehalten und können aktiv über „Abmelden“ beendet werden.
   - Mitarbeiter-Einladungen: Werden vom Regional-Admin mit granularen Rechten ausgestellt (`restaurants:read`, `restaurants:write`, `orders:read`, `staff:manage`, `partners:write`, `newsletter:send`, `audit:read`).
3. **Audit-Trail:**
   - Lückenlose Aufzeichnung aller relevanten Aktionen in der Tabelle `auditLogs` (Änderungen an Betriebsdaten, Provisionsbuchungen, Newsletterversand). Passwörter, Authentifizierungs-Codes und Geheimnisse werden vor dem Speichern geschwärzt.

---

## 4. E-Mail-Infrastruktur (Google Workspace)

Zackisch nutzt **Google Workspace** als alleinige E-Mail-Infrastruktur (`smtp.gmail.com:587`, STARTTLS):
- Sichtbarer Absender für automatisierte Transaktions- und Marketingnachrichten: `noreply@zackisch.com`.
- Persönlicher Support und geschäftliche Kommunikation: `selim@zackisch.com`.
- Secret-Verwaltung: `GOOGLE_WORKSPACE_SMTP_APP_PASSWORD` liegt verschlüsselt in der Convex-Secret-Verwaltung und wird niemals im Client-Code oder im Git-Repository exponiert.
- Protokollierung: Ausgelöste E-Mails werden in der Tabelle `emailLogs` mit Empfänger, Betreff, Kampagnen-ID und Übermittlungsstatus festgehalten.
- RFC 8058 One-Click-Unsubscribe: Alle Marketing-Nachrichten enthalten standardkonforme `List-Unsubscribe`- und `List-Unsubscribe-Post`-Header, die auf Convex-HTTP-Endpunkte verweisen.

---

## 5. Stripe Connect und Zahlungsflüsse

- **0 € Grundgebühr:** Keine Einrichtungsgebühr, keine monatliche Fixgebühr.
- **2 % Plattformgebühr:** Berechnet pro Bestellung über `platformFee(total)` und als `zackischFee` gespeichert.
- **50 % Partnerprovision:** 1 % des Bruttobestellvolumens (50 % der Plattformgebühr) werden dem vermittelnden Partner gutgeschrieben.
- **Checkout-Modus:** Stripe Checkout Sessions mit dem Payment Element (`ui_mode: "elements"`). Serverseitige Preisprüfung (`priceCheckout`) validiert Artikelverfügbarkeit und Optionspreise gegen Convex-Echtzeitdaten.
