# Zackisch

Zackisch ergänzt den persönlichen Service und das vorhandene Kassensystem eines Gastronomiebetriebs um QR-Bestellungen und digitale Bezahlung. Gäste öffnen das Menü im Browser, ohne App-Installation oder eigenes Konto. Der Betrieb bearbeitet bestätigte Bestellungen auf einem gekoppelten Personalgerät und erfasst die bezahlten Umsätze in seiner bestehenden Kasse.

## Die vier Anwendungen

| Anwendung | Aufgabe | Einstieg |
| --- | --- | --- |
| Website | Produkt, Kosten, Registrierungseinstieg und Rechtstexte | [`root/README.md`](root/README.md) |
| App | Betreiberkonto, Einrichtung, Menü, Gäste und Personal | [`app/README.md`](app/README.md) |
| Hilfe-Center | Öffentliche Anleitungen und private Support-Tickets | [`support/README.md`](support/README.md) |
| Team Dashboard | Geschützte Verwaltung, Support und kaufmännische Abläufe | [`internal/README.md`](internal/README.md) |

Alle Anwendungen verwenden Next.js 16, React 19 und TypeScript. Die Cloudflare-Builds laufen über vinext. Das einzige Convex-Backend liegt unter `app/convex/`. Öffentliche Website und Hilfe sind für Deutschland auf Deutsch (`de-de`) und Englisch (`de-en`) angelegt. Sprache und rechtliche Geschäftsregion sind getrennt.

## Intelligentes Menü

Das Gäste-Menü ergänzt die Speisekarte um eine automatische Beliebteste-Kategorie. Warenkorb und Checkout zeigen passende zusätzliche Artikel; freiwilliges Trinkgeld bietet Prozentvorschläge und startet bei null. Betreiber steuern diese Funktionen getrennt. Die aktuelle Berechnung, Datenbasis und Grenzen sind vollständig im [App-README](app/README.md#intelligentes-menü-und-freiwilliges-trinkgeld) beschrieben.

## Unternehmen und Gebühren

Zackisch ist das Einzelunternehmen von **Selim Eser**, derzeit ohne Beschäftigte. Geschäftlicher Kontakt: **selim@zackisch.com**. Finom wird als Geschäftskonto genutzt; daraus folgt keine technische Finom-Anbindung der Anwendung. Die tatsächliche Geschäftsanschrift und der Umsatzsteuerstatus sind noch nicht bestätigt. Musterangaben in Rechtstexten sind keine veröffentlichungsfähigen Unternehmensnachweise.

Das Gebührenmodell sieht keine Zackisch-Einrichtungsgebühr und keine monatliche Zackisch-Grundgebühr vor. Zackisch erhält **2 % des erfolgreich bezahlten Bestellwerts ohne freiwilliges Trinkgeld, einschließlich gegebenenfalls anfallender Umsatzsteuer auf die Zackisch-Gebühr**. Die Gebühren von Stripe kommen separat hinzu. Bei 10 € maßgeblichem Bestellwert beträgt die Zackisch-Gebühr insgesamt 0,20 €. Geräte, Internet und Druck können eigene Kosten verursachen.

Das Lokal bleibt Verkäufer. Zackischs Bestell- und Zahlungsbestätigung ist kein Kassenbeleg und keine Rechnung. Zahlungsabwicklung, steuerliche Behandlung, Belegpflichten und der konkrete Kassenablauf benötigen für den Echtbetrieb eine fachliche Prüfung. Weder diese Beschreibung noch bestandene Softwaretests sind eine Rechts- oder Sicherheitszertifizierung.

## Entwicklung

Jeder Anwendungsordner hat ein eigenes `package.json` und Lockfile. Abhängigkeiten werden mit `npm ci` im jeweiligen Ordner installiert; die Werkzeuge für das Gesamtprojekt zusätzlich im Repository-Root.

```sh
npm ci
npm ci --prefix root
npm run dev --prefix root
npm run test:unit
npm run typecheck
npm run test:browser
```

Die lokalen Entwicklungsports sind 3000 für die Website, 3001 für die App, 3002 für das Team Dashboard und 3003 für Support. Die jeweiligen Manifest-Skripte sind maßgeblich. Backendabhängige Abläufe benötigen eine passend konfigurierte Entwicklungsumgebung; Zugangsdaten gehören nicht ins Repository.

Playwright Test ist mit Chromium, Desktop- und Mobilprofil, Fehler-Screenshots, Traces und axe-Prüfung eingerichtet. `WEBSITE_TEST_URL` erlaubt Tests gegen einen bereits gestarteten lokalen oder freigegebenen Testserver. Die Tests aller vier Anwendungen laufen über dieselbe Playwright-Konfiguration; `TEST_APP=app`, `TEST_APP=support` oder `TEST_APP=internal` wählt die jeweilige Anwendung. Tests mit fehlenden Backend-Fixtures beweisen keine vollständige Anbieterzahlung.

## Gestaltung und Zusammenarbeit

[`DESIGN.md`](DESIGN.md) ist die einzige visuelle Spezifikation: schwarze Originalmarken, Weiß, Electric Citron und League Spartan. Impeccable unterstützt Gestaltung und Review; Mobbin liefert mehrere echte Referenzen vor jeder UI-Änderung. Zugängliche Komponenten entstehen auf Base UI. Für die Website dienen insbesondere etablierte Payment-, Banking- und Commerce-Marken als strukturelle Referenzen.

Fotos stammen ausschließlich aus echten Internet-Stockbeständen mit belegtem kostenlosem kommerziellem Nutzungsrecht. **KI-generierte Fotos sind ausgeschlossen.** Noch fehlende Produktaufnahmen werden mit Text als Platzhalter gekennzeichnet. Der zentrale öffentliche Assetpfad ist `root/public/brand/`, erreichbar über `https://zackisch.com/brand/...`; App, Support, Team Dashboard und E-Mails verwenden diese Adresse.

Entwicklung und kleine, geprüfte Commits erfolgen bewusst direkt auf `main`. Jede Anwendung wird unabhängig versioniert. Die vollständigen Regeln für Tests, Recht, Sicherheit, Zahlungen, Betrieb und Commits stehen in [`AGENTS.md`](AGENTS.md); [`PRODUCT.md`](PRODUCT.md) enthält den ergänzenden Produktkontext für Impeccable. Die README-Dateien beschreiben vorhandene Funktionen; Arbeitspläne und Prüfnachweise liegen außerhalb des Produktrepositories.

## Veröffentlichung

Vor jeder Änderung werden die einschlägigen aktuellen deutschen und europäischen Rechtsgrundlagen recherchiert. Vorrang haben offizielle Quellen: [Gesetze im Internet](https://www.gesetze-im-internet.de/) für deutsches Bundesrecht, [EUR-Lex](https://eur-lex.europa.eu/) für EU-Recht und die jeweils zuständigen Behörden für amtliche Erläuterungen. Neben der Zulässigkeit werden fehlende Pflichten und risikoärmere Alternativen geprüft. Für den Start sind echte Unternehmens- und Dienstleisterangaben, passende Verträge, geklärte Steuer-/Fiskalpflichten, tatsächliche Stripe-Freigaben und technische Tests erforderlich. Produktion, DNS, Echtgeld, destruktive Datenänderungen und Rundmails benötigen eine ausdrückliche Freigabe.
