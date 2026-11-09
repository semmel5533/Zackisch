# Zackisch Hilfe-Center (`support`)

Das öffentliche Hilfe-Center unter `https://support.zackisch.com/de-de` enthält durchsuchbare, verständliche Schritt-für-Schritt-Anleitungen zur selbstständigen Einrichtung und Nutzung von Zackisch. `de-en` bietet die englische Fassung für Deutschland. Öffentliches Lesen benötigt keine Anmeldung; private Support-Tickets verwenden den bestehenden Zackisch-Account des Betriebs.

## Inhalte und Funktionen

Anleitungen decken Voraussetzungen, Registrierung, Stripe, Speisekarten, Personal-Tablet, QR-Design/Druck, Testbestellungen, Checkout, Gebühren, Kassenabläufe, Pausierung, Troubleshooting und Datenschutz ab. Jede Anleitung enthält klare Voraussetzungen, benannte Schritte, Ergebnisprüfung und Verweise auf verwandte Themen. Suche, Inhaltskategorien, Breadcrumbs und hilfreiche Leer-/Fehlerzustände sorgen für schnelle Orientierung.

Angemeldete Betreiber eröffnen Tickets für den eigenen Betrieb, lesen Antworten und verfolgen den Status. Supportmitarbeiter bearbeiten Fälle im Team Dashboard. Private Notizen des Teams erscheinen niemals auf der Kundenseite. Anhänge sind beschränkt und privat; Zugriffsrechte werden serverseitig geprüft.

## Technik und Entwicklung

Eigenes Next.js-16-Projekt mit React 19, TypeScript, Tailwind CSS 4, Base UI, `next-intl` und Cloudflare Workers/vinext. Das Projekt nutzt das bestehende Convex-Backend in `../app/convex`, keine zusätzliche Datenbank und keinen zweiten Accountspeicher. Authentifizierung und regionale Isolation sind mit der Betreiber-App abgestimmt. Aus `support/`: `npm ci` und die im Manifest dokumentierten `dev`, `typecheck`, `test`, `build:cloudflare` und `check:cloudflare`-Skripte. Details: [zentrale Regeln](../AGENTS.md).

## Gestaltung, Recht und Betrieb

[`../DESIGN.md`](../DESIGN.md) definiert Lexend, die neuen Originalmarken und die gemeinsame visuelle Sprache. Neue und geänderte UI wird mit Impeccable, mehreren Mobbin-Referenzen und Base UI umgesetzt und mit Playwright geprüft. Die neue Spezifikation allein bedeutet nicht, dass alle bestehenden Ansichten bereits vollständig neu gestaltet sind. Fotos dürfen nur echte, kostenlos kommerziell nutzbare Internet-Stockfotos sein; KI-generierte Fotos sind ausgeschlossen. Fehlende Produktaufnahmen bleiben beschriftete Platzhalter.

Branding wird ausschließlich unter `https://zackisch.com/brand/...` von der Website ausgeliefert. Die anwendungsübergreifenden Sicherheits-, Zahlungs-, Datenschutz-, Rechtsrecherche-, Backup- und Releasepflichten stehen in [`../AGENTS.md`](../AGENTS.md). Öffentliches Hosting einer Vertragsvorlage ist keine rechtliche Freigabe. Produktionsänderungen und Echtgeldaktionen benötigen ausdrückliche Zustimmung.
