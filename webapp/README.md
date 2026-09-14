# Zakkig Webapp

Dieses Verzeichnis enthält die Haupt-Applikation von Zakkig (das Gastronomen-Dashboard, die Bestell-Oberflächen für Gäste sowie die Kitchen- und Verfügbarkeits-Terminals).

---

## Technologie-Stack

- **Framework:** Next.js (App Router, Server Actions, Server Components, Turbopack) & `vinext` für Cloudflare Workers
- **Backend Platform:** Convex (Reaktive Echtzeit-Datenbank, serverseitige Mutations/Queries/Actions, File Storage, Crons & HTTP Endpoints)
- **Corporate Infrastructure:** Cloudflare (Domain Registrar, DNS, Pages & Workers)
- **Edge-Architektur:** Strikte Zero-Node-Edge-Architektur. Das Next.js-Frontend läuft auf V8 Edge Runtimes (Cloudflare Workers) ohne Node-Sockets; alle E-Mail- (SMTP) und Zahlungs-Abwicklungen (Stripe) laufen exklusiv auf Convex
- **Authentifizierung:** Convex Auth & SSR Session Management mit HttpOnly-Cookies und E-Mail-OTP
- **E-Mail-Versand:** Google Workspace (SMTP via `smtp.gmail.com`, `selim@zakkig.com`, abgewickelt als Convex Node Action)
- **Zahlungsabwicklung:** Stripe Connect (Destination Charges mit 1% Plattform-Gebühr, Checkout Sessions API & Payment Element)
- **UI & Styling:** Tailwind CSS, Shadcn UI, Phosphor Icons, Apple-inspirierte Edge-to-Edge Dividers
- **State Management:** Zustand & reaktive Convex Hooks (`useQuery`, `useMutation`)
- **Internationalisierung (i18n):** next-intl (Model B Regionen- & Sprachstruktur, Endonyme für Länderbezeichnungen)

---

## Architektur & Authentifizierung

Die Applikation nutzt ein striktes **Server-Side Rendering (SSR) Authentifizierungs-Modell** in Verbindung mit Convex.

- **Sichere HttpOnly-Cookies:** Nach erfolgreicher Anmeldung oder Registrierung setzt der Server ein sicheres `HttpOnly`-Cookie (`zakkig_session`). Clientseitiger JavaScript-Code kann das Cookie nicht auslesen, was effektiven Schutz vor XSS bietet.
- **Zwei-Faktor E-Mail-OTP:** Sowohl bei der Registrierung als auch beim Login wird standardmäßig ein kryptografischer 6-stelliger Einmalcode per E-Mail versendet. Erst nach korrekter Eingabe wird die Sitzung aktiv.
- **Proxy & Session-Validierung:** `webapp/proxy.ts` und serverseitige Helfer in `lib/convex/auth.ts` (`getUser()`, `getAuthenticatedConvexClient()`) validieren bestehende Sessions für geschützte Routen.

---

## E-Mail-Infrastruktur (Convex Node Actions)

Der Versand von Transaktions-E-Mails (Anmeldecodes, Passwort-Resets, Bestätigungen für E-Mail-Änderungen und Account-Löschungen) ist zu 100 % in `convex/emails.ts` implementiert und läuft über den Convex-Scheduler (`ctx.scheduler.runAfter(0, internal.emails....)`).

- **Keine Node-Abhängigkeiten in Next.js:** Das Frontend ruft ausschließlich Convex-Mutationen auf (`requestAccountDeletionEmail`, `requestEmailChangeEmail`, `sendEmailChangeOtpWithEmail`), wodurch die Webapp frei von `nodemailer` oder TCP-Sockets bleibt.
- **Primärer Versandweg:** Google Workspace SMTP (`smtp.gmail.com`, Port 587) mit TLS-Verschlüsselung.
- **Absender-Konfiguration:**
  - **Absender-E-Mail:** `selim@zakkig.com`
  - **Absender-Name (Deutsch):** `Selim von zakkig`
  - **Absender-Name (Englisch):** `Selim at zakkig`
- **Verschlüsselung:** TLS/STARTTLS über Port 587.

---

## Datenmodell & Schema (`convex/schema.ts`)

Alle Tabellen sind typsicher über Convex definiert:

1. **`users` & `authAccounts`:** Benutzerkonten, Namen, E-Mail-Adressen und gehashte Zugangsdaten.
2. **`organizations`:** Restaurant-Stammdaten (Name, Adresse, Logo-Storage-ID, Owner-ID, Stripe-Verbindungsstatus, Tische, Schalter für Abholung / Tischbestellung).
3. **`menuCategories`:** Speisekarten-Kategorien mit Sortier-Index (`by_organizationId_and_sortOrder`).
4. **`menuItems`:** Gerichte & Getränke mit Preisen in Cent, Bild-Storage-ID, MwSt.-Satz, Verfügbarkeits-Status und JSON-konfigurierten `customizations` (z.B. Größen, Teig, Toppings).
5. **`orders`:** Bestellungen mit fortlaufend aufsteigender, rollierender dreistelliger Bestellnummer (`001`–`999`, mit Rollover-Absicherung), Bestelltyp (`takeaway` / `dine-in`), Tischnummer (strikt auf max. 4 Zeichen begrenzt), Status (`in_progress`, `ready_for_pickup`, `completed`, `cancelled`), Gesamtsumme und Gebührenaufschlüsselung.
6. **`staffSessions`:** Autorisierungs-Token für die kombinierte Personal-Sitzung (`/staff/[orgId]`) mit Rollen- und Rechteprüfung sowie Abwärtskompatibilität zu Legacy-Sitzungen (`orderSessions`, `availabilitySessions`).
7. **`verificationCodes`:** Temporäre Prüfcodes für Login-OTPs, Passwort-Resets und Stammdaten-Änderungen.

---

## Reaktives Echtzeit-System (Realtime)

Convex synchronisiert Änderungen automatisch und ohne manuelle WebSocket-Verwaltung an alle aktiven Clients:

- **Personal-Terminal (`/staff/[orgId]`):** Vereinte Terminal-Oberfläche (`StaffTerminalShell`) für Service- und Küchenpersonal mit 3 Tabs:
  - **Aktuelle Bestellungen:** Reaktive `useQuery(api.orders.getLiveOrders)` Subscriptions mit "In Bearbeitung" und "Abholbereit", Audio-Glockenton bei Bestelleingang, "Bereitstellen", Reversions-Möglichkeit ("Zurück in Bearbeitung") und Sicherheits-Bestätigungsdialog für "Abschließen".
  - **Alle Bestellungen:** Vollständige Bestellhistorie mit Status- und Typfiltern, Stornierung aktiver Bestellungen, bewusst ohne DATEV-Export.
  - **Verfügbarkeit:** Sekundenschnelles Ein- und Ausschalten von Speisen, Optionen und Kategorien (`toggleMenuItemAvailability`).
  - **Responsive Layouts:** Desktop und Tablets nutzen eine einklappbare Seitenleiste; mobile Geräte (<1024px) wechseln auf eine native Touch-Tab-Leiste am unteren Bildschirmrand.
- **Gast-Bestellverfolgung (`/pickup` & `/table` Tracker):** Der Gast sieht den aktuellen Zubereitungs-Status seiner Bestellung in Echtzeit über `useQuery(api.orders.getOrder)`.

---

## Ablaufzeiten & Lifecycle-Management (TTL & Timeouts)

Um höchste Sicherheit, Speicher-Hygiene und eine transparente Nutzererfahrung zu gewährleisten, folgt die Plattform strikten und einheitlichen Ablaufzeiten:

| Komponente / Vorgang | Gültigkeit / Timeout | Verhalten nach Ablauf | Sicherheitsfunktion |
| :--- | :--- | :--- | :--- |
| **Auth OTP (Login & Registrierung)** | 30 Minuten | Code verfällt und wird serverseitig abgelehnt | Schutz vor Replay- und Brute-Force-Angriffen |
| **Brute-Force Lockout (OTP)** | 5 Fehlversuche | Sofortige Löschung des Codes | Verhindert systematisches Durchprobieren von Einmalcodes |
| **Unverifizierte Accounts** | 30 Minuten | Vollständige Bereinigung via Convex Scheduler (`cleanupUnverifiedUser`) | Gibt die E-Mail-Adresse wieder frei, verhindert Ghost-Accounts |
| **Passwort-Reset Link** | 30 Minuten | Token wird ungültig, Neuanforderung erforderlich | Schutz vor missbräuchlicher Passwortänderung über alte Links |
| **Account-Löschung & E-Mail-Änderung** | 30 Minuten | Signierter Bestätigungslink verfällt | Schutz vor verspäteter Token-Ausnutzung |
| **Küchen-Board & Bestell-Lifecycle** | Manuell / Direkt | Bestellungen werden nach Bereitstellung manuell abgeschlossen und sofort ins Archiv ("Alle Bestellungen") überführt | Volle Kontrolle für das Küchenteam ohne unerwünschte automatische Archivierung |
| **Takeaway Live-Tracker (Gast)** | 10 Minuten | Tracker schaltet auf Abschluss-Screen um (`TRACKING_EXPIRY_MINUTES = 10`) | Datenschutz und Vermeidung verwaister Live-Links |
| **Terminal & Personal-Sitzung Tokens** | Dauerhaft (Widerrufbar) | Gespeichert in sicheren HttpOnly SameSite=lax Cookies (`staff_session_*`, `order_session_*`) | Sicherer Tablet- und Smartphone-Betrieb ohne XSS-Gefährdung |

---

## Dateispeicher & Upload-Limits (Convex Storage)

Logos, Restaurant-Banner und Speisekarten-Bilder werden im nativen Convex File Storage gespeichert und unterliegen strengen Sicherheits- und Größenbegrenzungen:

- **Maximale Dateigröße:** Einheitlich 10 MB pro Datei (`MAX_IMAGE_SIZE_MB = 10`, `MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024`).
- **Erlaubte Dateitypen:** Exklusiv JPG und PNG (`image/jpeg`, `image/png`).
- **Clientseitige Validierung:** Sofortiges Feedback bei ungültigen Dateitypen ("Nur Bilder im JPG- oder PNG-Format sind erlaubt.") oder bei Überschreiten von 10 MB ("Das Bild darf maximal 10 MB groß sein.") via Toast-Meldung, sowie transparente Kennzeichnung im UI ("JPG, PNG bis 10 MB", "im Format JPG oder PNG", "max. 10 MB").
- **Serverseitige Enforcierung (Defense-in-Depth):**
  - Vor dem Upload in Convex File Storage validiert `lib/convex/storage.ts` (`uploadFileToConvex`) sowohl Dateityp (`isAllowedImageFile`) als auch die Dateigröße.
  - Alle Server Actions (`createMenuItemAction`, `updateMenuItemAction`, `updateBusinessAction`) prüfen Dateityp und Dateigröße serverseitig ab, bevor eine Speicheroperation angestoßen wird.
- **Speicherbereinigung:** Beim Aktualisieren oder Löschen von Artikeln und Logos werden alte Dateien automatisch über `ctx.storage.delete` aus dem Speicher entfernt.

---

## Sicherheit & Mandantentrennung (Defense-in-Depth)

1. **Strikte Mandanten-Isolation:** Jede Server Action, die Betriebsdaten liest oder modifiziert, autorisiert den Aufruf über `requireOwner(organizationId)` oder `requireStaffOrOwner(organizationId)`.
2. **Anti-IDOR Schutz (Insecure Direct Object Reference):**
   - Beim Bearbeiten oder Löschen von Kategorien (`updateCategoryAction`, `deleteCategoryAction`) wird validiert, dass die Kategorie tatsächlich zur autorisierten `organizationId` gehört.
   - Beim Bearbeiten, Löschen oder Umschalten der Verfügbarkeit von Speisen (`updateMenuItemAction`, `deleteMenuItemAction`, `toggleMenuItemAvailability`) wird geprüft, dass der Artikel zur autorisierten Organisation gehört.
   - Beim Aktualisieren des Bestellstatus auf dem Küchenboard (`updateOrderStatusAction`) wird geprüft, dass die Bestellung der autorisierten Organisation zugeordnet ist.
3. **Zero Data Leakage an Gast-Schnittstellen:**
   - Auf öffentlichen Gast-Seiten (`/pickup/[orgId]`, `/table/[orgId]`) werden sensible Betreiberdaten (`stripeAccountId`, `taxId`, `ownerId`) vor der Serialisierung in den React Server Component Payload unkenntlich gemacht bzw. genullt.
   - Bei der Bestellverfolgung werden Plattform- und Zahlungsgebühren (`zakkigFee`, `stripeFee`, `netAmount`, `stripePaymentId`) serverseitig auf 0 gesetzt, sodass Gäste ausschließlich für sie relevante Bestelldaten einsehen können.
4. **Serverseitige Preis- und Integritätsprüfung:**
   - Gast-Warenkörbe werden im Checkout niemals ungeprüft akzeptiert. Die Convex Action `createCheckoutSession` liest alle Artikelpreise direkt aus der Datenbank und rechnet die Gesamtsumme centgenau nach.
5. **Tischnamen- und Tischnummern-Begrenzung:**
   - Alle Tischnummern sind durchgängig auf maximal 4 Zeichen limitiert (`<= 4`). Dies wird sowohl im Frontend (`maxLength={4}`, Input Clamping) als auch in den Server Actions (`settings-actions`, `checkout-actions`, `order-actions`) und Convex-Mutationen (`organizations`, `orders`, `stripe`) strikt durchgesetzt.

## Routing & Verzeichnisstruktur

```
webapp/
├── actions/             # Next.js Server Actions (Auth, Availability, Checkout, Menu, Orders, Settings, Stripe)
├── app/
│   ├── (auth)/          # Login, Registrierung, Passwort-Reset, Account-Löschung
│   ├── (dashboard)/     # Hauptdashboard (Übersicht, Aktuelle Bestellungen, Menü, Einstellungen, Alle Bestellungen, Stripe-Return)
│   ├── staff/           # Kombiniertes Personal-Terminal (Aktuelle Bestellungen, Alle Bestellungen, Verfügbarkeit)
│   ├── availability/    # Legacy-Redirect auf /staff/[orgId]?tab=availability
│   ├── orders/          # Legacy-Redirect auf /staff/[orgId]
│   ├── pickup/          # Gast-Bestellung zum Abholen, Checkout & Live-Tracking
│   └── table/           # Gast-Bestellung am Tisch, Checkout & Bestätigung
├── components/          # React-Komponenten (Dashboard, Guest UI, Staff-Terminal, UI-Primitives, Dialogs)
├── convex/              # Convex Backend
│   ├── schema.ts        # Typsicheres Datenbank-Schema
│   ├── auth.ts          # Convex Auth Konfiguration
│   ├── authQueries.ts   # Interne Queries & Mutationen für Authentifizierung
│   ├── customAuth.ts    # Node Actions für Registrierung, Login & OTP
│   ├── emails.ts        # E-Mail-Versand (Google Workspace SMTP via Nodemailer)
│   ├── http.ts          # HTTP-Router (Stripe Webhook)
│   ├── menu.ts          # Speisekarten-Logik
│   ├── orders.ts        # Bestellungen & rollierende Nummern (001-999)
│   ├── organizations.ts # Restaurant-Verwaltung & Kaskadenlöschung
│   ├── sessions.ts      # Terminal-Token-Verwaltung
│   ├── storage.ts       # Datei-Upload & Löschung
│   ├── stripe.ts        # Stripe Connect & Checkout Sessions (Payment Element)
│   └── users.ts         # Benutzerprofil & Kontolöschung
├── lib/
│   ├── convex/          # Server- & Client-Helfer für Convex (getUser, requireOwner, Client)
│   ├── constants.ts     # Globale Konstanten & Timer (TTL, Limits)
│   ├── i18n.ts          # Lokalisierung (next-intl)
│   └── types.ts         # TypeScript Interfaces
└── proxy.ts             # Proxy für Session- & Auth-Prüfungen (Next.js 16+)
```

---

## Entwicklung & Deployment

### Lokaler Start
```bash
cd webapp
npm run dev
```
Die Webapp läuft lokal standardmäßig auf Port **3000** (`http://localhost:3000`).

### Typüberprüfung & Build
```bash
npm run typecheck
npm run build
```

### Cloudflare Workers Kompatibilität & Deployment (vinext)
```bash
# Kompatibilität prüfen (95%+ nativ unterstützt)
npx vinext check

# Init & Deployment auf Cloudflare Workers
npx @vinext/cloudflare deploy
```

### Convex Deployment
```bash
npx convex deploy --preview-name webapp
```
