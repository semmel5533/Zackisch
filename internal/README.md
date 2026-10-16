# Zackisch Team Dashboard (`internal`)

Das Team Dashboard unter `https://internal.zackisch.com` ist die geschützte Arbeitsoberfläche für autorisierte Mitglieder des Zackisch-Teams. Die Anwendung dient regionaler Betriebs- und Auftragsverwaltung, Mitarbeiterberechtigungen, Partner- und Provisionsabläufen, Newsletter-Kampagnen, E-Mail-Logs, Audits und dem zentralen Support-Ticketprozess.

## Rollen und Funktionen

Teammitglieder melden sich über einen gesicherten Prozess mit verpflichtender Zwei-Faktor-Authentifizierung an. Rollen und Einzelberechtigungen bestimmen den Zugang zu Organisationen, Aufträgen, Partnern, Nachrichten, Teamverwaltung, Sicherheitsprotokollen und Tickets. Alle Daten sind zusätzlich serverseitig auf die jeweilige Region und erlaubte Organisation begrenzt.

Der Ticketbereich führt offene und zugewiesene Fälle, Antworten, interne Notizen, Statuswechsel, Zuordnung, regionale Filter und nachvollziehbare Bearbeitung zusammen. Kundennachrichten und ausschließlich interne Notizen werden technisch und visuell klar unterschieden. Bestehende kaufmännische und operative Funktionen bleiben erhalten.

## Technik und Entwicklung

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Base UI, lokalisierte UI-Texte und Cloudflare Workers/vinext. Backend ist die gemeinsame Convex-Instanz in `../app/convex`. In `internal/`: `npm ci` und die verfügbaren `dev`, `typecheck`, `test`, `build:cloudflare`, `check:cloudflare`-Kommandos aus `package.json`. Interne Funktionen dürfen nie öffentlich indexiert werden. Siehe [Architektur](../docs/architecture.md), [Berechtigungen](../docs/security.md), [Betrieb](../docs/operations.md).

## Rechtliches und Datenschutz

Die rechtliche Umsetzung richtet sich nach den geprüften Vertragsbeziehungen, dem tatsächlich eingesetzten Stripe-Connect-Modell, DSGVO-/Datenschutzanforderungen und den für Deutschland geltenden steuer- und kassentechnischen Pflichten. Technische Grundlagen sind in [`docs/germany-legal-and-regulatory.md`](../docs/germany-legal-and-regulatory.md), [`docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und [`docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md) dokumentiert. Zahlungs- und Steuerfragen stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/tax-invoicing-and-fiscalization.md`](../docs/tax-invoicing-and-fiscalization.md). Die veröffentlichten Rechtstexte beruhen auf freigegebenen Unternehmensangaben und der tatsächlichen Anwendungskonfiguration. Die bestehenden Zackisch-Logoassets und Poppins bleiben Grundlage der visuellen Markenführung.
