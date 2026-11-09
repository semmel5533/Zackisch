# Zackisch Team Dashboard (`internal`)

Das Team Dashboard unter `https://internal.zackisch.com` ist die geschützte Arbeitsoberfläche für autorisierte Mitglieder des Zackisch-Teams. Die Anwendung dient regionaler Betriebs- und Auftragsverwaltung, Mitarbeiterberechtigungen, Partner- und Provisionsabläufen, Newsletter-Kampagnen, E-Mail-Logs, Audits und dem zentralen Support-Ticketprozess.

## Rollen und Funktionen

Teammitglieder melden sich über einen gesicherten Prozess mit verpflichtender Zwei-Faktor-Authentifizierung an. Rollen und Einzelberechtigungen bestimmen den Zugang zu Betrieben, Aufträgen, Partnern, Nachrichten, Teamverwaltung, Sicherheitsprotokollen und Tickets. Alle Daten sind zusätzlich serverseitig auf die jeweilige Region und erlaubte Betriebe begrenzt.

Der Ticketbereich führt offene und zugewiesene Fälle, Antworten, interne Notizen, Statuswechsel, Zuordnung, regionale Filter und nachvollziehbare Bearbeitung zusammen. Kundennachrichten und ausschließlich interne Notizen werden technisch und visuell klar unterschieden. Bestehende kaufmännische und operative Funktionen bleiben erhalten.

## Technik und Entwicklung

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Base UI, lokalisierte UI-Texte und Cloudflare Workers/vinext. Backend ist die gemeinsame Convex-Instanz in `../app/convex`. In `internal/`: `npm ci` und die verfügbaren `dev`, `typecheck`, `test`, `test:browser`, `build:cloudflare`, `check:cloudflare`-Kommandos aus `package.json`. Interne Funktionen dürfen nie öffentlich indexiert werden. Siehe [zentrale Regeln](../AGENTS.md).

## Gestaltung, Recht und Betrieb

[`../DESIGN.md`](../DESIGN.md) definiert Lexend, die neuen Originalmarken und die gemeinsame visuelle Sprache. Neue und geänderte UI wird mit Impeccable, mehreren Mobbin-Referenzen und Base UI umgesetzt und mit Playwright geprüft. Die neue Spezifikation allein bedeutet nicht, dass alle bestehenden Ansichten bereits vollständig neu gestaltet sind. Fotos dürfen nur echte, kostenlos kommerziell nutzbare Internet-Stockfotos sein; KI-generierte Fotos sind ausgeschlossen. Fehlende Produktaufnahmen bleiben beschriftete Platzhalter.

Branding wird ausschließlich unter `https://zackisch.com/brand/...` von der Website ausgeliefert. Die anwendungsübergreifenden Sicherheits-, Zahlungs-, Datenschutz-, Rechtsrecherche-, Backup- und Releasepflichten stehen in [`../AGENTS.md`](../AGENTS.md). Öffentliches Hosting einer Vertragsvorlage ist keine rechtliche Freigabe. Produktionsänderungen und Echtgeldaktionen benötigen ausdrückliche Zustimmung.
