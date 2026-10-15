# Zackisch: Aktueller Produktdurchgang

Dieser Durchgang beschreibt den aktuellen Funktionsumfang des Quellcodes und die lokal verifizierten Abläufe von Zackisch. Er unterscheidet klar zwischen lokal nachgewiesenen Tests und künftigen Live-Zahlungsläufen mit echten Gästen. Details finden sich in der [Gesamtübersicht](../README.md), der [Systemarchitektur](architecture.md), dem [Designsystem](../DESIGN.md) und dem [Dokumentations-Audit](documentation-audit.md).

---

## 1. Öffentliche Website und Einstieg

Die statisch exportierte [Website](../website/README.md) informiert auf Deutsch (`/de-de`) und Englisch (`/de-en`) über das Produktangebot, den Bestellablauf, das transparente Preismodell und häufige Fragen. Anmeldung und Registrierung führen direkt zur separaten Webapp. Der Header nutzt übersetzte Sprungziele; der Regions- und Sprachdialog übernimmt Änderungen erst nach Bestätigung oder schließt mit der Escape-Taste unter Rückgabe des Fokus.

---

## 2. Betrieb einrichten

Betriebsinhaber registrieren sich in der Webapp, verbinden ihr Bankkonto über Stripe Connect, erfassen Speisen und Kategorien, hinterlegen Zusatzoptionen und drucken optimierte QR-Code-Tischaufsteller direkt über den Browser. Die [Dashboard-Routen](../webapp/README.md) (`/dashboard/[organizationId]/...`) bilden diesen Verwaltungsweg ab.

---

## 3. Gastbestellung und Bezahlung

Gäste scannen den QR-Code am Tisch (`/table/[organizationId]`) oder wählen die Abholansicht (`/pickup/[organizationId]`), wählen Artikel und Beilagen, prüfen ihren Warenkorb und zahlen bargeldlos über Stripe Checkout mit dem Payment Element. Die [Checkout-Preisprüfung](../webapp/convex/checkoutPricing.ts) berechnet alle Preise und Optionen aus den gespeicherten Daten serverseitig nach. Nach erfolgreicher Zahlung steht sofort eine formatierte Bestätigungsdatei zum Download bereit; eine optionale E-Mail-Kopie kann auf Wunsch angefordert werden.

---

## 4. Küche und Ausgabe

Das Personal-Terminal (`/staff/[organizationId]`) visualisiert eingehende Aufträge in Echtzeit. Mitarbeiter schalten Bestellungen manuell von `in_progress` über `ready_for_pickup` bis `completed`. Ausverkaufte Gerichte werden über den integrierten 86-Verfügbarkeitsschalter sofort für Neubestellungen gesperrt.

---

## 5. Operative Zentrale

Das interne Zackisch-Team steuert Betriebe, Bestellungen, Partner-Provisionen, Newsletter-Kampagnen und E-Mail-Logs über die [Opsapp](../opsapp/README.md) (`https://ops.zackisch.com`). Der Zugang ist über eine dedizierte Anmelderoute (`/sign-in`) mit Zwei-Faktor-Authentifizierung (E-Mail + Passwort + Einmalkennwort) gesichert und führt Mitarbeiter und Administratoren rollenbasiert in ihre zuständigen Arbeitsansichten. Datenzugriffe werden serverseitig auf die zugewiesene Region begrenzt und manipulationsgeschützt protokolliert.

---

## 6. Prüfungs- und Teststand

- **Lokale Builds und Tests:** Builds und TypeScript-Prüfungen aller drei Anwendungen (`website/`, `webapp/`, `opsapp/`) sowie alle 32 Unit- und Sicherheitstests in `webapp/` wurden erfolgreich ausgeführt.
- **Offene Punkte vor dem Produktivbetrieb:** Echte Auszahlungen und Streitfall-Prozesse erfordern das Onboarding realer Gastronomiebetriebe mit verifizierten Stripe-Geschäftskonten. Die fiskalische Erfassung im Vor-Ort-Kassensystem verbleibt beim Betrieb.
