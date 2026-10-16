# Zackisch

Zackisch erweitert bestehende Gastronomiebetriebe um digitale Bestellungen und Bezahlungen per QR-Code. Gäste bestellen direkt im mobilen Browser; der Betrieb behält sein Kassensystem, seine gewohnten Arbeitsabläufe und die Wahl, an welchen Tischen oder für welche Abholangebote der digitale Bestellweg angeboten wird. Ein Wechsel des Kassensystems oder spezielle Zackisch-Hardware ist nicht vorgesehen.

**Markenversprechen:** Deine Kasse bleibt. Deine Gäste bestellen selbst.

## Produkt und Geschäftsmodell

Zackisch richtet sich zunächst an Gastronomiebetriebe in Deutschland: Restaurants, Cafés, Imbisse, Bars und vergleichbare Betriebe. Die Betreiber registrieren sich selbst, prüfen Voraussetzungen, richten Speisekarte und Zahlungsabwicklung ein, verbinden ein geeignetes eigenes Personal-Tablet, erstellen QR-Codes und testen das Angebot. Ein Einrichtungsassistent begleitet jeden Schritt; ergänzende Anleitungen und ein Ticketbereich sind unter `support.zackisch.com` verfügbar. Gäste benötigen keinen eigenen Account und keine installierte App.

Die Zackisch-Einrichtung und die laufende Zackisch-Grundgebühr kosten jeweils 0 €. Zackisch erhebt 2 % Plattformgebühr für über Zackisch abgewickelte Bestellungen; hinzu kommen Gebühren des Zahlungsdienstleisters. Ohne Zackisch-Bestellungen fällt keine prozentuale Zackisch-Plattformgebühr an. Eigene Geräte, Internetzugang, Druck und gegebenenfalls weitere Dienstleistungen können gesondert Kosten verursachen. Die konkrete Berechnungsgrundlage, Steuern, Erstattungen, Rückbuchungen und Auszahlungen sind in Produkt und Vertragsbedingungen transparent abzubilden.

Zackisch ist keine eigenständige Registrierkasse und ersetzt keine betrieblichen Kassen- und steuerrechtlichen Pflichten. Die digitalen Umsätze werden nach den vorgesehenen Abläufen im bestehenden Kassensystem erfasst. Fällt der digitale Bestellweg aus, kann der Betrieb seinen bisherigen Service fortsetzen; bereits bezahlte Zackisch-Aufträge dürfen dabei weder verloren gehen noch doppelt ausgeführt werden.

## Anwendungen und Adressen

| Anwendung | Projekt | URL | Aufgabe |
| --- | --- | --- | --- |
| Öffentliche Website | [`root/`](root/README.md) | `https://zackisch.com/de-de` | Verständliche Produktpräsentation, Voraussetzungen, Preise, FAQ, Rechtliches und Registrierung |
| Betriebs- und Gäste-App | [`app/`](app/README.md) | `https://app.zackisch.com` | Registrierung, Einrichtung, Speisekarten, QR-Code-Druck, Personal-Tablet, Gäste-Bestellung und Checkout |
| Hilfe-Center | [`support/`](support/README.md) | `https://support.zackisch.com/de-de` | Öffentliche Schritt-für-Schritt-Anleitungen, Suche und angemeldete Support-Tickets |
| Team Dashboard | [`internal/`](internal/README.md) | `https://internal.zackisch.com` | Regionale Teamverwaltung, Betriebe, Aufträge, Partner, Newsletter, E-Mail-/Auditprotokolle und Support-Tickets |

Alle dynamischen Produktdaten werden über das gemeinsame Convex-Backend in `app/convex/` verarbeitet. Die verschiedenen Benutzergruppen erhalten nur die für ihre Rolle, ihren Betrieb und ihre Region zulässigen Daten.

## Technische Grundlagen

- **Frontend:** Next.js 16 mit App Router, React 19, TypeScript, Tailwind CSS 4, `next-intl`, zugänglichen Base-UI-Primitiven und konsistenten Zackisch-Komponenten.
- **Hosting:** Cloudflare DNS und Edge-Plattform; alle vier Next.js-Anwendungen über Cloudflare Workers mit dem geprüften vinext-Adapter, wobei die öffentliche Website weitgehend vorgerenderte statische Inhalte ausliefert.
- **Backend:** Eine Convex-Bereitstellung mit reaktiver Datenbank, serverseitigen Policies, Actions, Storage, regionenbewussten Datenmodellen und zentraler Authentifizierung.
- **Zahlungen:** Stripe Connect zur Anbindung von Gastronomiebetrieben und Abwicklung unterstützter Zahlungsarten. Merchant-of-record, Direktzahlung/Plattformzahlung, Gebühren- und Steuerbehandlung sind in der final implementierten Vertrags- und Systemkonfiguration überprüft. Zahlbeträge, Gebühren und Zahlungszustände werden serverseitig validiert und reconciliert.
- **Unternehmensdienste:** Cloudflare für Domains und Hosting; Google Workspace für geschäftliche und transaktionale E-Mail; Finom für Geschäftskonto beziehungsweise unterstützende Finanzprozesse; GitHub für Quellcode und Zusammenarbeit.
- **Backups:** Die Convex-Backup-Konfiguration wird in der jeweiligen Umgebung überwacht; zusätzlich sind Quellcode, Konfiguration, Secrets-Verzeichnis, Recovery und Wiederherstellungstests getrennt dokumentiert. Siehe [Betriebssicherheit](docs/backups-and-recovery.md).

Verbindliche Architektur- und Sicherheitsdetails stehen in [docs/architecture.md](docs/architecture.md), [docs/security.md](docs/security.md) und [AGENTS.md](AGENTS.md). Poppins bleibt als prägende Schrift des Zackisch-Markenauftritts und der bestehenden Wortmarke erhalten; die Original-Logoassets bleiben verbindlich. Ein gemeinsames Designsystem und eine einheitliche Sprache verbinden alle Oberflächen, ohne die unterschiedlichen Arbeitssituationen von Gästen, Betreibern, Personal und internen Teammitgliedern zu verwischen.

## Regionen, Sprachen und Rollen

Startregion ist Deutschland (`de`), öffentlich mit deutschen (`/de-de`) und englischen (`/de-en`) Inhalten. Jede Organisation ist ihrer Geschäftsregion serverseitig zugeordnet. Die angezeigte Sprache kann unabhängig gewählt werden. Weitere Regionen werden erst mit überprüften rechtlichen, steuerlichen und betrieblichen Voraussetzungen aktiviert. Öffentlich lesbare Inhalte müssen die korrekte regionale Fassung ausweisen.

Der Zugriff unterscheidet Gäste ohne Login, Betriebseigentümer, autorisierte Personalgeräte, Support-Ticket-Absender sowie interne Teammitglieder mit regionalen Rollen. Besonders geschützt sind Stripe- und Auszahlungsdaten, personenbezogene Daten, interne Notizen, Sitzungen und Support-Anhänge.

## Entwicklung und Qualitätsstandard

Die Anwendungen besitzen eigene `package.json` und `package-lock.json` mit unabhängigem Semantic Versioning. Der jeweils aktuelle `README.md` erklärt lokale Startbefehle, erforderliche Umgebungsvariablennamen und Tests der Anwendung. Keine produktiven Tokens oder echten Kundendaten im Repository hinterlegen.

Vor einem Release werden Builds und Typprüfung aller vier Anwendungen, Convex-Verträge, Zahlungs- und Rechte-Tests, Barrierefreiheit, Security-Audit, Qualitätsreview und browserbasierte End-to-End-Tests durchgeführt. Testergebnisse müssen tatsächlich reproduzierbar sein. Die wichtigsten Qualitätsgrenzen stehen unter [docs/testing-and-release.md](docs/testing-and-release.md).

## Commit- und Versionierungsregeln

Commit-Texte sind natürliches Englisch, vollständig kleingeschrieben, in der Vergangenheitsform, ohne Präfixe wie `feat:` und ohne abschließende Satzzeichen. Betroffene Projekte werden konkret benannt. Zusammengehörende Schritte dürfen mit `and` verbunden werden. Die hinterlegte Commit-Identität lautet `Selim Eser <semmel5533@gmail.com>`.

Jede Anwendung führt eigene `MAJOR.MINOR.PATCH`-Versionsnummern in Manifest und Lockfile. Bugfixes, Design- und Textkorrekturen sowie nicht verhaltensändernde Refactorings erhalten einen Patch-Schritt, neue Funktionen und kompatible Erweiterungen einen Minor-Schritt. **Eine erste Version `1.0.0` oder ein späterer Major-Sprung erfordert die ausdrückliche Freigabe des Projektinhabers.** Vor jedem Commit werden betroffene Projektversionen und Dokumentation geprüft.

## Dokumentation

Die fünf `README.md` sind auf Deutsch und richten sich an Menschen, die Zackisch betreiben oder entwickeln. Die fünf `AGENTS.md` sowie sämtliche vertiefenden Dokumente unter `docs/` sind auf Englisch. Aktuelle, überprüfte Implementierungen sind maßgeblich: Dokumentation enthält keine veralteten Projektbezeichnungen oder Änderungsgeschichten und keine unbewiesenen Betriebsbehauptungen.

- [Produkt- und Markeninhalte](docs/brand-content.md)
- [Designsystem](docs/design-system.md) und [UX/Barrierefreiheit](docs/ux-and-accessibility.md)
- [Architektur](docs/architecture.md), [Sicherheit](docs/security.md) und [Backups & Recovery](docs/backups-and-recovery.md)
- [QR-Codes und Druck](docs/qr-and-print.md)
- [Hilfe-Center](docs/support-content.md)
- [Regionen, SEO und Recht](docs/localization-and-compliance.md)
- [Betriebshandbuch](docs/operations.md) und [Tests/Release](docs/testing-and-release.md)
- [Deutscher Rechtsrahmen](docs/germany-legal-and-regulatory.md), [Stripe Connect und Zahlungsflüsse](docs/payments-and-stripe.md)
- [Steuern, E-Rechnungen und Kassenführung](docs/tax-invoicing-and-fiscalization.md), [DSGVO und Datenlebenszyklus](docs/privacy-and-data-governance.md)
- [Legal Pages, Verträge und Einwilligungen](docs/legal-pages-consents-and-contracts.md)
- [Quellen und technische Entscheidungen](docs/research-and-decisions.md)

## Zahlungsmodell und Kassenabgleich

Zackisch ergänzt das bestehende Kassensystem. Der Gastronomiebetrieb ist Verkäufer gegenüber seinen Gästen und verarbeitet Zahlungen über sein eigenes angebundenes Stripe-Konto. Stripe übernimmt die Zahlungsabwicklung und die vereinbarten Verifizierungsaufgaben. Zackisch berechnet **2 % des erfolgreich bezahlten Bruttobestellwerts ohne freiwilliges Trinkgeld einschließlich der gegebenenfalls auf die Zackisch-Leistung entfallenden Umsatzsteuer**; die Stripe-Zahlungsgebühren kommen hinzu. Für die Gäste stellt Zackisch eine Bestell- und Zahlungsbestätigung bereit, **keinen Kassenbeleg und keine Rechnung**. Der Gastronomiebetrieb übernimmt bezahlte Bestellungen genau einmal in sein vorhandenes Kassensystem und stellt dort einen ordnungsgemäßen Beleg beziehungsweise eine Rechnung bereit. Die genaue umsatzsteuerliche und kassentechnische Einordnung wird vor dem Echtbetrieb fachlich freigegeben. Verbindliche technische Details stehen in [`docs/payments-and-stripe.md`](docs/payments-and-stripe.md) und [`docs/guest-confirmation-and-pos.md`](docs/guest-confirmation-and-pos.md).
