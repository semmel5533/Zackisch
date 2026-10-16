# Zackisch Hilfe-Center (`support`)

Das öffentliche Hilfe-Center unter `https://support.zackisch.com/de-de` enthält durchsuchbare, verständliche Schritt-für-Schritt-Anleitungen zur selbstständigen Einrichtung und Nutzung von Zackisch. `de-en` bietet die englische Fassung für Deutschland. Öffentliches Lesen benötigt keine Anmeldung; private Support-Tickets verwenden den bestehenden Zackisch-Account des Betriebs.

## Inhalte und Funktionen

Anleitungen decken Voraussetzungen, Registrierung, Stripe, Speisekarten, Personal-Tablet, QR-Design/Druck, Testbestellungen, Checkout, Gebühren, Kassenabläufe, Pausierung, Troubleshooting und Datenschutz ab. Jede Anleitung enthält klare Voraussetzungen, benannte Schritte, passende aktuelle Screenshots, Ergebnisprüfung und Verweise auf verwandte Themen. Suche, Inhaltskategorien, Breadcrumbs und hilfreiche Leer-/Fehlerzustände sorgen für schnelle Orientierung.

Angemeldete Betreiber eröffnen Tickets für den eigenen Betrieb, lesen Antworten und verfolgen den Status. Supportmitarbeiter bearbeiten Fälle im Team Dashboard. Private Notizen des Teams erscheinen niemals auf der Kundenseite. Anhänge sind beschränkt und privat; Zugriffsrechte werden serverseitig geprüft.

## Technik und Entwicklung

Eigenes Next.js-16-Projekt mit React 19, TypeScript, Tailwind CSS 4, `@zackisch/design-system` (Base UI und Poppins-Tokens), `next-intl` und Cloudflare Workers/vinext. Marken-Assets werden zentral über `https://zackisch.com/*` geladen. Öffentliche Hilfe-Seiten (Kategorien, Artikel) sind als serverseitige React Server Components (SSR) mit vollständigen `generateMetadata`-, `generateStaticParams`- und Schema.org-JSON-LD-Strukturdaten (`Article`, `BreadcrumbList`) umgesetzt. Ein dynamisches `sitemap.ts` liefert 98 lokalisierte URLs; `robots.ts` und private Ticket-Layouts erzwingen `noindex, nofollow` für geschützte Supportbereiche.

Das Projekt nutzt das bestehende Convex-Backend in `../app/convex`. Ticketabfragen und -erstellungen erzwingen serverseitig geprüfte Sitzungstokens (`supportSessions`), die über atomaren Token-Austausch ohne E-Mail-URL-Parameter etabliert werden. Aus `support/`: `npm ci` und die im Manifest dokumentierten `dev`, `typecheck`, `test`, `build:cloudflare` und `check:cloudflare`-Skripte. Details: [Hilfe-Inhalte](../docs/support-content.md), [Sicherheit](../docs/security.md).

## Rechtliches und Datenschutz

Die rechtliche Umsetzung richtet sich nach den geprüften Vertragsbeziehungen, dem tatsächlich eingesetzten Stripe-Connect-Modell, DSGVO-/Datenschutzanforderungen und den für Deutschland geltenden steuer- und kassentechnischen Pflichten. Technische Grundlagen sind in [`docs/germany-legal-and-regulatory.md`](../docs/germany-legal-and-regulatory.md), [`docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und [`docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md) dokumentiert. Zahlungs- und Steuerfragen stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/tax-invoicing-and-fiscalization.md`](../docs/tax-invoicing-and-fiscalization.md). Die veröffentlichten Rechtstexte beruhen auf freigegebenen Unternehmensangaben und der tatsächlichen Anwendungskonfiguration. Die bestehenden Zackisch-Logoassets und Poppins bleiben Grundlage der visuellen Markenführung.
