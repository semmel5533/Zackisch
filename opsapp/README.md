# Zackisch Operations (Ops Dashboard)

Dieses Next.js-Projekt ist das interne Operations- und Verwaltungsdashboard für das operative Zackisch-Team (`https://ops.zackisch.com`). Es dient Regional-Administratoren und operativen Mitarbeitern zur Steuerung der regionalen Gastronomiebetriebe, Bestellungen, Partner-Provisionen, Newsletter-Kampagnen und Sicherheitsüberprüfungen.

Das Projekt greift auf das gemeinsame Convex-Backend unter [`webapp/convex/`](../webapp/convex/) zu; alle Berechtigungen und regionalen Filterungen werden serverseitig erzwungen.

---

## 1. Funktionen und Routen

Die Benutzeroberfläche umfasst zehn operative Bereiche:

| Bereich | Route | Zweck & Berechtigung |
|---|---|---|
| **Zentrale-Anmeldung** | `/sign-in` | Dedizierte Zwei-Faktor-Authentifizierung (E-Mail + Passwort + Einmalkennwort) für Mitarbeiter und Administratoren |
| **Regionale Übersicht** | `/` | Echtzeit-Kennzahlen zu Bruttoumsatz (GMV), 2 % Plattformgebühr, 50 % Partner-Provisionen, aktiven Betrieben, Bestellungen und Systemstatus (Regional-Admins) |
| **Betriebsverwaltung** | `/organizations` | Übersicht aller Gastronomiebetriebe (Restaurants, Cafés, Imbisse, Bars) mit Onboarding-Status, Tischkontingenten, Partner-Codes und Menülinks (`restaurants:read`) |
| **Bestellübersicht** | `/orders` | Chronologische Echtzeit-Bestellansicht mit Filterung nach Status (in Bearbeitung, abholbereit, abgeschlossen, storniert) und Zahlungsreferenzen (`orders:read`) |
| **Mitarbeiterverwaltung** | `/staff` | Einladung und granulare Rechtevergabe für Teammitglieder (`staff:manage` oder Regional-Admin) |
| **Vertriebspartner** | `/partners` | Provisionsabrechnung für regionale Partner (50 % der Plattformgebühr = 1 % GMV), Partnercodes, vermittelte Betriebe und Buchung von Auszahlungen (`partners:read`) |
| **Newsletter-Editor** | `/newsletter` | Visueller No-Code-Block-Editor für E-Mail-Kampagnen mit Live-Master-Template-Vorschau, Abonnentenübersicht, Testversand und Terminierung (`newsletter:read`) |
| **E-Mail-Protokoll** | `/emails` | Chronologische Übersicht aller über Google Workspace versendeten Transaktions- und Marketingnachrichten mit Zustellstatus und SMTP-Verbindungstest (Regional-Admins) |
| **Audit-Trail** | `/audit` | Manipulationsgeschütztes Protokoll aller relevanten Team-Aktionen mit automatischer Schwärzung vertraulicher Daten und Passwörter (`audit:read`) |
| **Einstellungen** | `/settings` | Regionale Konfiguration, Gebührensätze und Systemstatus (Regional-Admins) |

---

## 2. Authentifizierung und Zwei-Faktor-Sicherheit (2FA)

Der Zugang zum Operations Dashboard (`ops.zackisch.com`) erfolgt über die dedizierte Route `/sign-in` (`OpsLoginForm` / `AdminLoginForm`):

1. **Schritt 1 – Zugangsdatenprüfung:** Mitarbeiter oder Administrator geben ihre autorisierte E-Mail-Adresse und ihr Passwort ein (`initiateAdminLogin`). Bei erfolgreicher Prüfung generiert das Backend automatisch einen kryptografischen 6-stelligen Sicherheitscode (OTP).
2. **Automatischer E-Mail-Versand via Google Workspace SMTP:** Der Sicherheitscode wird unverzüglich über das Google-Workspace-Relay von `noreply@zackisch.com` an das Postfach des Teammitglieds zugestellt (Gültigkeit: 15 Minuten).
3. **Schritt 2 – Bestätigungscodes (`completeAdminLoginWithOtp`):** Erst nach Eingabe des 6-stelligen E-Mail-Codes wird ein kryptografisches 30-Tage-Sitzungstoken erzeugt und die Anmeldung im Audit-Log vermerkt.
4. **Rollenbasierte Weiterleitung:**
   - **Regional-Administratoren** werden direkt auf die operative Hauptübersicht (`/`) weitergeleitet.
   - **Mitarbeiter** werden unmittelbar in ihren primären Arbeitsbereich weitergeleitet (z. B. `/orders` oder `/organizations`).
5. **Sitzungsvalidierung (`verifyAdminSession`) & Abmeldung:** Sitzungen bleiben lokal persistent und werden bei jedem Aufruf serverseitig gegen aktive Benutzerkonten validiert. Ein Klick auf **„Abmelden“** in der Seitenleiste beendet die Sitzung und führt zurück zu `/sign-in`.

---

## 3. Regionale Sprach- und Marktauswahl

Analog zur Webapp verfügt das Operations Dashboard über einen modularen **`RegionLanguageSwitcher`**:

- **Länderauswahl:** Direkte Umschaltung zwischen den Märkten Deutschland (DE, aktiv), Österreich (AT, in Vorbereitung) und Schweiz (CH, in Vorbereitung) mit landesspezifischen SVG-Flaggen (`RegionFlag`).
- **Sprachauswahl:** Umschaltung zwischen Deutsch (`de`) und Englisch (`en`) mit unmittelbarer Aktualisierung der Navigation und Systembeschriftungen.
- **Zustandsspeicherung:** Ausgewählte Regionen und Sprachen werden lokal im Browser gespeichert und wirken sich auf alle regionalen Abfragen und Dashboards aus.

---

## 4. Regionales Sicherheitsmodell und Rollen

- **Serverseitige Regionsbegrenzung:** Regional-Admins und Mitarbeiter agieren ausschließlich innerhalb ihrer zugewiesenen Region (`regionId`, standardmäßig `de`). Datenzugriffe werden im gemeinsamen Convex-Backend gefiltert und autorisiert.
- **Granulare Rechtevergabe:** Berechtigungen (z. B. `newsletter:send`, `partners:write`, `staff:manage`) werden bei jedem API-Aufruf serverseitig überprüft; ein reiner Oberflächenfilter genügt nicht.
- **Datenschutz und Geheimnisschutz:** Passwörter, Authentifizierungscodes (OTPs) und sensible Finanzgeheimnisse werden im Audit-Log und in Übersichten prinzipiell niemals im Klartext dargestellt.

---

## 5. Lokale Entwicklung und Build

### Befehle

```sh
# Abhängigkeiten installieren
npm ci

# Lokalen Entwicklungsserver auf Port 3002 starten
npm run dev

# TypeScript-Typen validieren
npm run typecheck

# Produktions-Build erstellen
npm run build
```

---

## 6. Weiterführende Dokumente

- [Gesamtübersicht des Repositories](../README.md)
- [Systemarchitektur und Sicherheitskonzept](../docs/architecture.md)
- [Designsystem und Styling-Vorgaben](../DESIGN.md)
- [Audit- und Statusübersicht](../docs/documentation-audit.md)
