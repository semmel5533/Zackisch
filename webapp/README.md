# Zackisch Webapp

Die Webanwendung (`https://app.zackisch.com`) ist das zentrale System für Gastronomiebetriebe, Servicepersonal und Gäste. Sie umfasst das Betriebs-Dashboard, das Küchen-Terminal und den mobilen Gäste-Checkout.

Das Backend wird durch die gemeinsame Convex-Cloud-Instanz im Unterverzeichnis [`convex/`](convex/) bereitgestellt.

---

## 1. Oberflächen und Routen

Die Anwendung gliedert sich in vier klar getrennte Bereiche ohne veraltete Weiterleitungs-Altlasten:

| Bereich | Pfade | Zweck |
|---|---|---|
| **Authentifizierung** | `/sign-in`, `/sign-up`, `/reset-password`, `/reset-password/confirm`, `/change-email/otp`, `/delete-account` | Login, Neuregistrierung, Passwort-Wiederherstellung und Kontoverwaltung |
| **Betriebs-Dashboard** | `/dashboard/[organizationId]/{overview,current-orders,all-orders,menu,settings}` | Betriebsdaten, Speisekarten- und Kategorienpflege, Tischverwaltung, QR-Code-Druck, Stripe-Kontoanbindung und Bestellhistorie |
| **Personal-Terminal** | `/staff/[organizationId]` | Echtzeit-Bestellanzeige für Küche und Bar mit Statuswechsel (`in_progress` ➔ `ready_for_pickup` ➔ `completed`) und 86-Verfügbarkeitsschalter |
| **Gäste-Checkout** | `/table/[organizationId]`, `/pickup/[organizationId]` sowie jeweilige `/success`-Seiten | Digitales Menü, Artikelkonfiguration mit Beilagen/Optionen, Warenkorb, bargeldlose Zahlung und Beleg-Download |

---

## 2. Gast-Bestellablauf und Zahlungslogik

1. **Digitales Menü:** Der Gast öffnet die Speisekarte über den tischspezifischen oder abholbezogenen QR-Code. Die Artikel, Kategorien und Preise werden reaktiv aus Convex geladen.
2. **Artikelanpassung:** Zusatzoptionen, Pflichtauswahlen und Beilagenaufpreise werden im Auswahl-Dialog konfiguriert und im lokalen Warenkorb gespeichert.
3. **Serverseitige Preisprüfung (`priceCheckout`):** Beim Öffnen des Checkouts berechnet das Backend in [`convex/checkoutPricing.ts`](convex/checkoutPricing.ts) alle Artikel- und Optionspreise serverseitig aus der Datenbank nach. Manipulierte oder veraltete Preise und nicht verfügbare Artikel werden strikt abgewiesen.
4. **Stripe Checkout mit Payment Element:** Gäste zahlen bargeldlos mit Apple Pay, Google Pay, Kreditkarte oder weiteren Zahlungsarten. Der Gastronomiebetrieb erhält die Auszahlung direkt auf sein verknüpftes Stripe-Express-/Standard-Konto abzüglich der 2 % Zackisch-Plattformgebühr.
5. **Sofortiger Beleg-Download:** Unmittelbar nach erfolgreicher Zahlung steht auf der Bestätigungsseite eine formatierte Datei zum Download bereit ([`lib/confirmation-generator.ts`](lib/confirmation-generator.ts)). Eine E-Mail-Zustellung ist optional aktivierbar.

---

## 3. Betriebs- und Personalwerkzeuge

- **Kategorie- und Speisekartenverwaltung:** Intuitive Erstellung und Umsortierung von Kategorien, Speisen, Allergenhinweisen, Preisen und Zusatzoptionen mit sofortiger Live-Synchronisation.
- **Tisch- und QR-Code-Management:** Vergabe kurzer Tischnummern (maximal 4 Zeichen gemäß Gestaltungsstandard) und Druck optimierter DIN-A-Aufsteller über den Browser.
- **Küchen-Board:** Eingehende Bestellungen werden mit rollierenden Belegnummern (`001` bis `999`) angezeigt. Sobald eine Bestellung fertig ist, setzt das Personal den Status auf abholbereit; nach Ausgabe wird der Auftrag als abgeschlossen markiert.
- **86-Verfügbarkeitsmanager:** Ausverkaufte Zutaten oder Gerichte können mit einem Klick sofort gesperrt und später wieder aktiviert werden.

---

## 4. Sicherheit und Datenbegrenzung

- **Schutz von Betriebs- und Inhaberdaten:** Öffentliche Gast-Schnittstellen (`/table`, `/pickup`, Bestelltracker) filtern interne Kontodaten, Steuernummern, Plattformgebühren und Inhaber-IDs serverseitig heraus.
- **Mandantentrennung (Anti-IDOR):** Alle datenändernden Server Actions verifizieren die Inhaberschaft (`requireOwner(organizationId)`) oder die Terminal-Berechtigung (`requireStaffOrOwner`).
- **Sitzungssicherheit:** Einladungs- und Login-Codes (OTP) verfallen nach 30 Minuten und werden nach fünf aufeinanderfolgenden Fehlversuchen unwiderruflich gesperrt.

---

## 5. Lokale Entwicklung und Qualitätsprüfung

### Befehle

```sh
# Abhängigkeiten installieren
npm ci

# Gemeinsames Backend synchronisieren (erfordert Convex-Zugang)
npx convex dev

# Webapp auf Port 3001 starten
npm run dev -- --port 3001

# TypeScript-Typen validieren
npm run typecheck

# Unit- und Sicherheitstests ausführen
npm test

# Lokalen Produktions-Build erstellen
npm run build

# Cloudflare-Workers-Dry-Run (Deployment-Vorprüfung)
npm run check:cloudflare
```

---

## 6. Weiterführende Dokumente

- [Gesamtübersicht des Repositories](../README.md)
- [Architektur- und Sicherheitsdokumentation](../docs/architecture.md)
- [Designsystem und Tailwind-Tokens](../DESIGN.md)
- [Dokumentations- und Test-Audit](../docs/documentation-audit.md)
