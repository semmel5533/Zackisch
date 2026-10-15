# Technischer Dokumentations- und Sicherheitsaudit

Dieses Dokument erfasst den geprüften Sicherheits-, Architektur- und Betriebszustand des Zackisch-Monorepos. Es unterscheidet verbindlich zwischen lokal verifizierten Implementierungen und noch offenen externen Voraussetzungen.

---

## 1. Verifizierte Sicherheits- und Architekturstandards

| Komponente / Themenfeld | Technische Umsetzung & Nachweis | Status |
|---|---|---|
| **Kryptografische Zufallswerte (OTP & Tokens)** | 6-stellige Einmal-Codes und Session-Tokens werden über kryptografisch sichere Zufallsgeneratoren (`crypto.getRandomValues`) erzeugt. 30 Minuten Gültigkeit, Sperre nach 5 Fehlversuchen. Geprüft in `webapp/convex/customAuth.ts` und `webapp/convex/users.ts`. | **Umgesetzt & getestet** |
| **Datenschutz & Gast-Grenze (Data Minimization)** | Öffentliche Abfragen (`getGuestOrderTracker`, `getPublicRestaurant`) filtern interne Stripe-IDs, Steuernummern, Inhaber-IDs und Plattformgebühren serverseitig heraus. Gäste erhalten ausschließlich für sie relevante Daten. | **Umgesetzt & getestet** |
| **Google Workspace SMTP-Infrastruktur** | Ausgehende Transaktions- und System-E-Mails laufen über den Google Workspace SMTP-Relay (`smtp-relay.gmail.com:587`, STARTTLS, `noreply@zackisch.com`). Das App-Passwort liegt gesichert in der Convex-Secret-Verwaltung (`dev:silent-narwhal-392`). SMTP-Verbindungstest und E-Mail-Log verifiziert. | **Umgesetzt & live geprüft** |
| **Operative Zentrale (`opsapp`)** | Eigenständige Next.js-Anwendung in `opsapp/` (`ops.zackisch.com`) mit 10 aktiven Routen (`/sign-in`, `/`, `/organizations`, `/orders`, `/staff`, `/partners`, `/newsletter`, `/emails`, `/audit`, `/settings`). Geschützt durch verpflichtende Zwei-Faktor-Authentifizierung (E-Mail + Passwort + 6-stelliger Einmal-Code via E-Mail) mit rollenbasierter Navigation und automatischer Weiterleitung für Mitarbeiter und Administratoren. Reaktiv angebunden an Convex mit serverseitiger Regionsbegrenzung. Build und Typecheck fehlerfrei. | **Umgesetzt & gebaut** |
| **Newsletter-System (Double-Opt-in & RFC 8058)** | Vollständige No-Code-Newsletter-Verwaltung in Convex (`newsletter.ts`) und `opsapp/app/newsletter/page.tsx` mit visuellem Block-Editor, Live-Vorschau, Testversand und double-opt-in-konformen Bestätigungsseiten. RFC-8058-One-Click-Unsubscribe-Header über Convex HTTP Router angebunden. | **Umgesetzt & getestet** |
| **Einheitliche Betriebs- und Organisationsterminologie** | Durchgängige Ausrichtung auf alle Gastronomiebetriebe (Restaurants, Cafés, Imbisse, Bars): Schema und Routen nutzen `organizations`, die deutsche Benutzeroberfläche nutzt konsistent „Betrieb / Betriebe“, die englische „Business / Venue“. Keine veralteten Weiterleitungsrouten. | **Umgesetzt & bereinigt** |

---

## 2. Offene operative und externe Punkte

Die folgenden Punkte erfordern externe Handlungen, geschäftliche Entscheidungen oder reale Drittkonten und werden daher bewusst als offen deklariert:

1. **Stripe-Connect-Produktivverifikation:** Das Zahlungssystem nutzt Standard Connect mit Checkout Sessions und dem Payment Element. Reale Auszahlungen, Händler-Identitätsprüfungen und Dispute-Prozesse erfordern das Onboarding echter Gastronomiebetriebe im Produktivmodus.
2. **Finom-Buchhaltungsanbindung:** Finom ist als Geschäftskonto und unterstützende Buchhaltungsumgebung vorgesehen. Eine automatisierte API-Synchronisation hängt von den verfügbaren Schnittstellen von Finom ab.
3. **Kassenführung & KassenSichV:** Zackisch ist eine Bestell- und Zahlungsplattform, kein zertifiziertes Kassensystem (POS). Betriebe übertragen Bestellungen manuell als unbare Umsätze in ihr Kassensystem; die Einhaltung lokaler TSE-Vorschriften verbleibt beim Betrieb.
4. **Schlussfassung der Allgemeinen Geschäftsbedingungen (AGB):** Der AGB-Text befindet sich in der juristischen Finalisierung; rechtliche Kernangaben sind im Impressum hinterlegt.
