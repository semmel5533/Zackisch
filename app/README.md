# Zackisch App (`app`)

Unter `https://app.zackisch.com` betreiben Gastronomen Zackisch selbst: Accountregistrierung, Betriebsprofil, Einstellungen, Zahlungsanbindung, Speisekarte, Tischverwaltung, QR-Druck, Bestellübersicht und Personal-Tablet. Gäste öffnen direkt eine tisch- oder abholbezogene Seite im mobilen Browser und bezahlen ohne eigenen Zackisch-Account.

## Einrichtung und Betrieb

Der persistente Einrichtungsassistent unterscheidet erforderliche, empfohlene und erledigte Schritte und prüft Fortschritt auf Basis tatsächlicher Serverzustände. Die Einrichtung umfasst Voraussetzungen, Region/Betrieb, Stripe-Verbindung, Angebot mit Preisen/Optionen, Tische und QR-Codes, Personal-Tablet mit sicherer Kopplung, kontrollierte Testbestellung und Veröffentlichung. Hilfelinks öffnen den richtigen Artikel auf `support.zackisch.com`. Der Betreiber kann den digitalen Bestellweg pausieren; der bestehende Kassenbetrieb läuft unabhängig weiter.

Das Personal-Tablet zeigt eingehende Bestellungen und deren eindeutige Statusfolge in Echtzeit. Stripe-Zahlungen und Bestellpreise werden serverseitig validiert, Zahlungsereignisse idempotent verarbeitet. Die Erfassung digitaler Umsätze im bestehenden Kassensystem bleibt erforderlich, soweit im betrieblichen Rechtsrahmen vorgesehen.

## Technik

Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl`, `@base-ui/react` mit kanonischen Zackisch-Design-Tokens (`--zk-*`), Cloudflare Workers mit vinext. `convex/` ist die **einzige** Backend-Quelle für alle vier Zackisch-Anwendungen. Authentifizierung, Berechtigungen, Regions- und Betriebsisolation, Daten, Echtzeitfunktionen und Storage sind zentral. Zahlungsabwicklung über Stripe Connect; ausgehende System-E-Mails über Google Workspace und dafür geeignete serverseitige Convex-Actions.

## Entwicklung und Tests

In `app/`: `npm ci`, `npx convex dev` für eine isolierte Entwicklungsumgebung und die im `package.json` definierten `dev`, `typecheck`, `test`, `build:cloudflare` und `check:cloudflare`-Skripte. Keine produktiven Convex-Restores oder Stripe-Live-Tests ohne Freigabe. Siehe [zentrale Regeln](../AGENTS.md).

Die Browserprüfung läuft vom Repository-Root mit `TEST_APP=app npm run test:browser`. Der Menütest benötigt `E2E_GUEST_PATH` (öffentlicher Pfad eines Entwicklungslokals) und `E2E_SIMPLE_ITEM_NAME` (verfügbarer Artikel ohne Optionen); ohne diese Angaben wird er ausdrücklich übersprungen. Er verändert ausschließlich den lokalen Warenkorb und löst keine Zahlung aus. Mit `E2E_CUSTOM_ITEM_NAME` wird zusätzlich die vorbereitete Größen-/Belag-Fixture geprüft (Klassisch/Familienpizza, Champignons; Gesamtpreis 15,50 €). Die Artikelauswahl verwendet Base-UI-Radios und -Checkboxen, zeigt Pflichtfehler am betroffenen Abschnitt und sperrt beschädigte Optionsdefinitionen.

## Gestaltung, Recht und Betrieb

[`../DESIGN.md`](../DESIGN.md) definiert League Spartan, die neuen Originalmarken und die gemeinsame visuelle Sprache. Neue und geänderte UI wird mit Impeccable, mehreren Mobbin-Referenzen und Base UI umgesetzt und mit Playwright geprüft. Die neue Spezifikation allein bedeutet nicht, dass alle bestehenden Ansichten bereits vollständig neu gestaltet sind. Fotos dürfen nur echte, kostenlos kommerziell nutzbare Internet-Stockfotos sein; KI-generierte Fotos sind ausgeschlossen. Fehlende Produktaufnahmen bleiben beschriftete Platzhalter.

Branding wird ausschließlich unter `https://zackisch.com/brand/...` von der Website ausgeliefert. Die anwendungsübergreifenden Sicherheits-, Zahlungs-, Datenschutz-, Rechtsrecherche-, Backup- und Releasepflichten stehen in [`../AGENTS.md`](../AGENTS.md). Öffentliches Hosting einer Vertragsvorlage ist keine rechtliche Freigabe. Produktionsänderungen und Echtgeldaktionen benötigen ausdrückliche Zustimmung.

## Zahlungsmodell und Kassenabgleich

Zackisch ergänzt das bestehende Kassensystem. Der Gastronomiebetrieb ist Verkäufer gegenüber seinen Gästen und verarbeitet Zahlungen über sein eigenes angebundenes Stripe-Konto. Stripe übernimmt die Zahlungsabwicklung und die vereinbarten Verifizierungsaufgaben. Zackisch berechnet **2 % des erfolgreich bezahlten Bruttobestellwerts ohne freiwilliges Trinkgeld einschließlich der gegebenenfalls auf die Zackisch-Leistung entfallenden Umsatzsteuer**; die Stripe-Zahlungsgebühren kommen hinzu. Für die Gäste stellt Zackisch eine Bestell- und Zahlungsbestätigung bereit, **keinen Kassenbeleg und keine Rechnung**. Der Gastronomiebetrieb übernimmt bezahlte Bestellungen genau einmal in sein vorhandenes Kassensystem und stellt dort einen ordnungsgemäßen Beleg beziehungsweise eine Rechnung bereit. Die genaue umsatzsteuerliche und kassentechnische Einordnung wird vor dem Echtbetrieb fachlich freigegeben. Verbindliche technische Details stehen in [zentrale Regeln](../AGENTS.md) und [zentrale Regeln](../AGENTS.md).

Der Gäste-Warenkorb öffnet die eigene Checkout-Seite unter `/table/[businessId]/checkout` beziehungsweise `/pickup/[businessId]/checkout`. Die Tischkennung bleibt als Query-Parameter erhalten. Der lokale Warenkorb bleibt bei der Navigation zur Karte erhalten; ein vollständiges Neuladen startet ohne Warenkorb. Trinkgeld ist optional und startet bei null. Der Browser-Test prüft außerdem Seitenwechsel, Rücknavigation und E-Mail-Validierung vor dem Zahlungsaufruf; er bestätigt keine erfolgreiche Providerzahlung.
