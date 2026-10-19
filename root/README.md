# Zackisch Website (`root`)

Die öffentliche Website unter `https://zackisch.com` erklärt Zackisch für Gastronomiebetriebe in Deutschland und führt zur Selbstregistrierung. Sie erläutert die Voraussetzungen. Sie stellt den Nutzen für bestehende Betriebe vor die technische Funktionsliste: vorhandene Kasse behalten, eigenständig einrichten, eigenes geeignetes Tablet verwenden, QR-Codes selbst drucken, keine monatliche Zackisch-Grundgebühr.

## Technik

Next.js 16 App Router mit statischem Export (`output: "export"`), React 19, TypeScript, Tailwind CSS 4, `next-intl`, `@zackisch/design-system` mit zugänglichen Base-UI-Primitiven und Poppins-Tokens. Die Anwendung hostet unter `public/` alle kanonischen Marken-Assets (`https://zackisch.com/*`), auf die alle Zackisch-Anwendungen zentral zugreifen. Newsletter und andere dynamische Aktionen werden über bestehende zulässige Backend-Endpunkte abgewickelt; keine geheimen Schlüssel im statischen Frontend.

## Regionen und Inhalte

`/de-de` ist die deutschsprachige Deutschland-Seite, `/de-en` die englischsprachige. Beide verwenden konsistente Canonical-/Hreflang-Angaben. Die Seite erklärt Gastbestellung, Personalbearbeitung und manuelle Kassenerfassung, die Einrichtung sowie die 2-%-Gebühr einschließlich des Hinweises auf separate Zahlungsanbietergebühren. Registrierung, Newsletter-Anmeldung (Double-Opt-In) und Hilfe-Center sind über die bestehenden Funktionen angebunden. Es werden keine erfundenen Umsatzkennzahlen oder unbelegten Kundenstimmen gezeigt. Beschriftungen und Statusmeldungen sind übersetzt; interne Servermeldungen werden nicht angezeigt.

## Entwicklung

Aus `root/`: `npm ci`, `npm run dev`, `npm run typecheck`, `npm run build` und die im Manifest definierten Lint-/Test-Kommandos. Die lokale Adresse und tatsächlichen Skripte sind im Manifest maßgeblich. Querverweise: [Produktfakten](../docs/product-facts-and-copy.md), [Designsystem](../design-system/README.md), [SEO und Compliance](../docs/localization-and-compliance.md).

## Rechtliches und Datenschutz

Die rechtliche Umsetzung richtet sich nach den geprüften Vertragsbeziehungen, dem tatsächlich eingesetzten Stripe-Connect-Modell, DSGVO-/Datenschutzanforderungen und den für Deutschland geltenden steuer- und kassentechnischen Pflichten. Technische Grundlagen sind in [`docs/germany-legal-and-regulatory.md`](../docs/germany-legal-and-regulatory.md), [`docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und [`docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md) dokumentiert. Zahlungs- und Steuerfragen stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/tax-invoicing-and-fiscalization.md`](../docs/tax-invoicing-and-fiscalization.md). Die Rechtstexte sind im Quellcode hinterlegt. Ihre technische Einbindung belegt keine juristische Prüfung oder Freigabe der Unternehmensangaben. Die bestehenden Zackisch-Logoassets und Poppins bleiben Grundlage der visuellen Markenführung.
