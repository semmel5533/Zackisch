# Zackisch Website (`root`)

Die öffentliche Website unter `https://zackisch.com` erklärt Zackisch für Gastronomiebetriebe in Deutschland und führt direkt zur Selbstregistrierung oder zum Voraussetzungen-Check. Sie stellt den Nutzen für bestehende Betriebe vor die technische Funktionsliste: vorhandene Kasse behalten, eigenständig einrichten, eigenes geeignetes Tablet verwenden, QR-Codes selbst drucken, keine monatliche Zackisch-Grundgebühr.

## Technik

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `next-intl`, zugängliche Base-UI-Primitiven und das gemeinsame Zackisch-Designsystem. Die Website wird über Cloudflare Workers mit vinext und überwiegend statisch vorgerenderten Inhalten ausgeliefert. Newsletter und andere dynamische Aktionen werden über bestehende zulässige Backend-Endpunkte abgewickelt; keine geheimen Schlüssel im statischen Frontend.

## Regionen und Inhalte

`/de-de` ist die deutschsprachige Deutschland-Seite, `/de-en` die englischsprachige. Beide verwenden konsistente Canonical-/Hreflang-Angaben. Die Seite enthält verständlichen Hero, echten Gastronomiekontext, Ablauf, Voraussetzungen, Kassen-Ergänzungsmodell, DIY-Geräte- und Druckhinweise, transparente Preise mit Zahlungsanbietergebühren, FAQ, Rechtstexte und einen Link zum ausführlichen Hilfe-Center. Die Produktdarstellung zeigt ausschließlich echte verfügbare Funktionen und überprüfbare Aussagen.

## Entwicklung


## Rechtliches und Datenschutz

Die rechtliche Umsetzung richtet sich nach den geprüften Vertragsbeziehungen, dem tatsächlich eingesetzten Stripe-Connect-Modell, DSGVO-/Datenschutzanforderungen und den für Deutschland geltenden steuer- und kassentechnischen Pflichten. Technische Grundlagen sind in [`docs/germany-legal-and-regulatory.md`](../docs/germany-legal-and-regulatory.md), [`docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und [`docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md) dokumentiert. Zahlungs- und Steuerfragen stehen in [`docs/payments-and-stripe.md`](../docs/payments-and-stripe.md) und [`docs/tax-invoicing-and-fiscalization.md`](../docs/tax-invoicing-and-fiscalization.md). Die veröffentlichten Rechtstexte beruhen auf freigegebenen Unternehmensangaben und der tatsächlichen Anwendungskonfiguration. Die bestehenden Zackisch-Logoassets und Poppins bleiben Grundlage der visuellen Markenführung.
