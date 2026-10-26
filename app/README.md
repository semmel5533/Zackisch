# Zackisch App (`app`)

Unter `https://app.zackisch.com` betreiben Gastronomen Zackisch selbst: Accountregistrierung, Betriebsprofil, Einstellungen, Zahlungsanbindung, Speisekarte, Tischverwaltung, QR-Druck, Bestellübersicht und Personal-Tablet. Gäste öffnen direkt eine tisch- oder abholbezogene Seite im mobilen Browser und bezahlen ohne eigenen Zackisch-Account.

## Einrichtung und Betrieb

Der persistente Einrichtungsassistent unterscheidet erforderliche, empfohlene und erledigte Schritte und prüft Fortschritt auf Basis tatsächlicher Serverzustände. Die Einrichtung umfasst Voraussetzungen, Region/Betrieb, Stripe-Verbindung, Angebot mit Preisen/Optionen, Tische und QR-Codes, Personal-Tablet mit sicherer Kopplung, kontrollierte Testbestellung und Veröffentlichung. Hilfelinks öffnen den richtigen Artikel auf `support.zackisch.com`. Der Betreiber kann den digitalen Bestellweg pausieren; der bestehende Kassenbetrieb läuft unabhängig weiter.

Das Personal-Tablet zeigt eingehende Bestellungen und deren eindeutige Statusfolge in Echtzeit. Stripe-Zahlungen und Bestellpreise werden serverseitig validiert, Zahlungsereignisse idempotent verarbeitet. Die Erfassung digitaler Umsätze im bestehenden Kassensystem bleibt erforderlich, soweit im betrieblichen Rechtsrahmen vorgesehen.

## Technik

Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl`, Base UI und bestehende Astryx-Komponenten, Cloudflare Workers mit vinext. `convex/` ist die **einzige** Backend-Quelle für alle vier Zackisch-Anwendungen. Authentifizierung, Berechtigungen, Regions- und Betriebsisolation, Daten, Echtzeitfunktionen und Storage sind zentral. Zahlungsabwicklung über Stripe Connect; ausgehende System-E-Mails über Google Workspace und dafür geeignete serverseitige Convex-Actions.

## Entwicklung und Tests

In `app/`: `npm ci`, `npx convex dev` für eine isolierte Entwicklungsumgebung und die im `package.json` definierten `dev`, `typecheck`, `test`, `build:cloudflare` und `check:cloudflare`-Skripte. Keine produktiven Convex-Restores oder Stripe-Live-Tests ohne Freigabe. Siehe [Architektur](../docs/architecture.md), [Sicherheit](../docs/security.md), [QR & Druck](../docs/qr-and-print.md), [Release-Tests](../docs/testing-and-release.md).

Die Browserprüfung läuft vom Repository-Root mit `npx e2e run --config app/e2e.config.ts`. Der Menütest benötigt `E2E_GUEST_PATH` (öffentlicher Pfad eines Entwicklungslokals) und `E2E_SIMPLE_ITEM_NAME` (verfügbarer Artikel ohne Optionen); ohne diese Angaben wird er ausdrücklich übersprungen. Er verändert ausschließlich den lokalen Warenkorb und löst keine Zahlung aus. Mit `E2E_CUSTOM_ITEM_NAME` wird zusätzlich die vorbereitete Größen-/Belag-Fixture geprüft (Klassisch/Familienpizza, Champignons; Gesamtpreis 15,50 €). Die Artikelauswahl verwendet Base-UI-Radios und -Checkboxen, zeigt Pflichtfehler am betroffenen Abschnitt und sperrt beschädigte Optionsdefinitionen.

## Rechtliches und Datenschutz

Die rechtliche Umsetzung richtet sich nach den geprüften Vertragsbeziehungen, dem tatsächlich eingesetzten Stripe-Connect-Modell, DSGVO-/Datenschutzanforderungen und den für Deutschland geltenden steuer- und kassentechnischen Pflichten. Technische Grundlagen sind in [`docs/germany-legal-and-regulatory.md`](../docs/germany-legal-and-regulatory.md), [`docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und [`docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md) dokumentiert. Zahlungs- und Steuerfragen stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/tax-invoicing-and-fiscalization.md`](../docs/tax-invoicing-and-fiscalization.md). Öffentliche Rechtstexte benötigen freigegebene Unternehmensangaben und müssen der tatsächlichen Anwendungskonfiguration entsprechen. Die unveränderten Zackisch-Logo-SVGs und selbst gehostetes Inter bilden die visuelle Grundlage. Der Gästeheader zeigt ausschließlich das Logo und Banner des Lokals, sofern hinterlegt. Menüartikel ohne eigenes Bild werden ohne automatisch zugeordnetes Stockfoto dargestellt.

## Zahlungsmodell und Kassenabgleich

Zackisch ergänzt das bestehende Kassensystem. Der Gastronomiebetrieb ist Verkäufer gegenüber seinen Gästen und verarbeitet Zahlungen über sein eigenes angebundenes Stripe-Konto. Stripe übernimmt die Zahlungsabwicklung und die vereinbarten Verifizierungsaufgaben. Zackisch berechnet **2 % des erfolgreich bezahlten Bruttobestellwerts ohne freiwilliges Trinkgeld einschließlich der gegebenenfalls auf die Zackisch-Leistung entfallenden Umsatzsteuer**; die Stripe-Zahlungsgebühren kommen hinzu. Für die Gäste stellt Zackisch eine Bestell- und Zahlungsbestätigung bereit, **keinen Kassenbeleg und keine Rechnung**. Der Gastronomiebetrieb übernimmt bezahlte Bestellungen genau einmal in sein vorhandenes Kassensystem und stellt dort einen ordnungsgemäßen Beleg beziehungsweise eine Rechnung bereit. Die genaue umsatzsteuerliche und kassentechnische Einordnung wird vor dem Echtbetrieb fachlich freigegeben. Verbindliche technische Details stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/guest-confirmation-and-pos.md`](../docs/guest-confirmation-and-pos.md).
