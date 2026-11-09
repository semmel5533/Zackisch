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

[`../DESIGN.md`](../DESIGN.md) definiert Lexend, die neuen Originalmarken und die gemeinsame visuelle Sprache. Neue und geänderte UI wird mit Impeccable, mehreren Mobbin-Referenzen und Base UI umgesetzt und mit Playwright geprüft. Die neue Spezifikation allein bedeutet nicht, dass alle bestehenden Ansichten bereits vollständig neu gestaltet sind. Fotos dürfen nur echte, kostenlos kommerziell nutzbare Internet-Stockfotos sein; KI-generierte Fotos sind ausgeschlossen. Fehlende Produktaufnahmen bleiben beschriftete Platzhalter.

Branding wird ausschließlich unter `https://zackisch.com/brand/...` von der Website ausgeliefert. Die anwendungsübergreifenden Sicherheits-, Zahlungs-, Datenschutz-, Rechtsrecherche-, Backup- und Releasepflichten stehen in [`../AGENTS.md`](../AGENTS.md). Öffentliches Hosting einer Vertragsvorlage ist keine rechtliche Freigabe. Produktionsänderungen und Echtgeldaktionen benötigen ausdrückliche Zustimmung.

## Zahlungsmodell und Kassenabgleich

Zackisch ergänzt das bestehende Kassensystem. Der Gastronomiebetrieb ist Verkäufer gegenüber seinen Gästen und verarbeitet Zahlungen über sein eigenes angebundenes Stripe-Konto. Stripe übernimmt die Zahlungsabwicklung und die vereinbarten Verifizierungsaufgaben. Zackisch berechnet **2 % des erfolgreich bezahlten Bruttobestellwerts ohne freiwilliges Trinkgeld einschließlich der gegebenenfalls auf die Zackisch-Leistung entfallenden Umsatzsteuer**; die Stripe-Zahlungsgebühren kommen hinzu. Für die Gäste stellt Zackisch eine Bestell- und Zahlungsbestätigung bereit, **keinen Kassenbeleg und keine Rechnung**. Der Gastronomiebetrieb übernimmt bezahlte Bestellungen genau einmal in sein vorhandenes Kassensystem und stellt dort einen ordnungsgemäßen Beleg beziehungsweise eine Rechnung bereit. Die genaue umsatzsteuerliche und kassentechnische Einordnung wird vor dem Echtbetrieb fachlich freigegeben. Verbindliche technische Details stehen in den [zentralen Regeln](../AGENTS.md).

Der Gäste-Warenkorb öffnet die eigene Checkout-Seite unter `/table/[businessId]/checkout` beziehungsweise `/pickup/[businessId]/checkout`. Die Tischkennung bleibt als Query-Parameter erhalten. Der lokale Warenkorb bleibt bei der Navigation zur Karte erhalten; ein vollständiges Neuladen startet ohne Warenkorb. Trinkgeld ist optional und startet bei null. Der Browser-Test prüft außerdem Seitenwechsel, Rücknavigation und E-Mail-Validierung vor dem Zahlungsaufruf; er bestätigt keine erfolgreiche Providerzahlung.

## Intelligentes Menü und freiwilliges Trinkgeld

Die Funktionen sind im Gäste-Menü, im Warenkorb und auf der eigenen Checkout-Seite eingebunden. In den Betriebseinstellungen lassen sich **Empfehlungen**, **Beliebteste** und **Trinkgeld** unabhängig steuern. Fehlende Einstellungswerte werden wie aktiviert behandelt.

| Funktion | Tatsächliches Verhalten |
| --- | --- |
| Empfehlungen im Warenkorb | Bei gefülltem Warenkorb werden höchstens zwei Vorschläge angezeigt. Die Rangfolge gewichtet das gemeinsame Auftreten mit einem Warenkorbartikel dreifach und addiert die allgemeine Häufigkeit. Bereits gewählte und nicht verfügbare Artikel werden ausgeschlossen. Bei wenig Historie füllt der Server mit verfügbaren Artikeln desselben Betriebs auf. |
| Zusatzartikel vor der Zahlung | Die Checkout-Seite zeigt ebenfalls höchstens zwei Vorschläge. Der Server berücksichtigt verfügbare Artikel bis standardmäßig 6 € Grundpreis, sortiert nach bestellter Menge und bei Gleichstand nach niedrigerem Preis. Es gibt keinen Filter, der sie zwingend auf Getränke, Beilagen oder Desserts beschränkt. |
| Beliebteste | Eine virtuelle Kategorie vor den regulären Kategorien zeigt bis zu acht verfügbare Artikel, sortiert nach bestellter Menge. Ohne positive historische Bestellmenge bleibt sie aus. Sie ist keine bearbeitbare Datenbank-Kategorie. |
| Individuelle Auswahl | Vorschläge werden nur auf ausdrücklichen Klick hinzugefügt. Artikel mit Optionen öffnen die normale Varianten-Auswahl. Es wird kein Extra ungefragt in den Warenkorb gelegt. |
| Trinkgeld | Auswahl von 0, 5, 10 oder 15 Prozent des Warenwerts, standardmäßig 0. Bei ausgeschalteter Funktion wird die Auswahl verborgen. Der Betrag wird in Cent gerundet und getrennt vom Warenwert ausgewiesen. Zackischs 2-%-Gebühr bezieht freiwilliges Trinkgeld nicht ein. |

**Datengrundlage und Grenzen:** Alle drei Empfehlungsabfragen verwenden ausschließlich Bestellungen des jeweiligen Betriebs und schließen stornierte Bestellungen aus. Sie prüfen derzeit nicht zusätzlich Zahlungsstatus, Testbestellungskennzeichen oder Stripe-Referenz. Die Berechnung umfasst die gesamte vorliegende Historie, kein rollierendes Zeitfenster. Die normale Menü- und Kategorienreihenfolge bleibt manuell. Es gibt keine automatische Umsortierung der vollständigen Karte, kein personenbezogenes Gästeprofil und keine betriebsübergreifende Auswertung. Die Empfehlungen sind regelbasiert, kein generatives KI-System und keine Umsatzgarantie.

Die maßgeblichen Stellen sind `convex/smartMenu.ts`, `components/guest/cart-recommendations.tsx`, `guest-menu.tsx`, `guest-checkout.tsx` und die Betriebseinstellungen. `tests/smart-menu.test.ts` prüft Zusammenbestellungen, Preisgrenzen, Mengenrangfolge, Verfügbarkeit und Schalter. Die Backend-Standardlimits von vier Empfehlungen und drei Zusatzartikeln gelten nur ohne explizites Limit; die aktuelle Gästeoberfläche fordert jeweils zwei an.

## Weitere Produktbereiche

Das Menü unterstützt Kategorien, manuelle Reihenfolge, Artikelbilder, Preise, Verfügbarkeit, Varianten und Zusätze sowie Ernährungsmerkmale, Allergene und Zusatzstoffe. Das Personal kann in der Verfügbarkeitsansicht Artikel, einzelne Optionen oder ganze Auswahlschritte aus- und wieder einschalten. Ein Artikelschalter setzt auch seine Schritte und Optionen, ein Schrittschalter auch dessen Optionen; einzelne Optionen können separat geändert werden. Änderungen werden erst nach erfolgreicher Serverantwort übernommen. Die Auswahl validiert Pflichtoptionen und berechnet Aufpreise; der Server rekonstruiert den Checkoutpreis unabhängig vom Browser.

Betreiber finden Einrichtung, Tisch- und QR-Verwaltung sowie Personal-Kopplung in der Übersicht. Weitere Seiten verwalten aktive Bestellungen, Historie, Menü und Betriebseinstellungen. Gäste nutzen `/table/[businessId]` mit Tischkennung beziehungsweise `/pickup/[businessId]`, jeweils mit eigener Checkout- und Erfolgsseite. Der Bestellstatus bleibt von der gesonderten Erfassung in der bestehenden Kasse getrennt.

Kontofunktionen umfassen Anmeldung, Registrierung, Passwortzurücksetzung, E-Mail-Änderung und Kontolöschung. Das gekoppelte Personalgerät bearbeitet Bestellungen unter eigener, widerrufbarer Berechtigung. Anleitungen und private Tickets liegen in der Support-Anwendung; Team-, Partner-, Newsletter- und Auditverwaltung im internen Dashboard. Die zugehörigen READMEs beschreiben diese Bereiche.
