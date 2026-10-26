# Zackisch Website (`root`)

Die Marketingwebsite erklärt den optionalen QR-Bestellweg für Gastronomiebetriebe in Deutschland. Zackisch ergänzt die bestehende Kasse und den persönlichen Service. Links führen zur Betreiberregistrierung, Anmeldung und zum Supportcenter.

## Inhalte und Sprachen

`/de-de` und `/de-en` enthalten die deutsche und englische Startseite. Unter beiden Sprachpfaden sind Kosten (`pricing`), Studienquelle und Einordnung (`research`), Kontakt (`contact`), Anbieterhinweis (`legal-notice`) und Datenschutzbeschreibung (`privacy`) erreichbar. Canonical- und Hreflang-Metadaten sowie die Dokumentsprache entsprechen dem jeweiligen Pfad. Unbekannte Seiten erhalten eine 404-Antwort.

Die Startseite zeigt Ablauf, Voraussetzungen, 2%-Gebühr einschließlich gegebenenfalls anfallender Umsatzsteuer auf die Zackisch-Gebühr, separate Stripe-Gebühren und FAQ. Die Studienzahl ist eine externe Selbstauskunft und kein Zackisch-Wirkungsnachweis. Produktaufnahmen sind ausdrücklich beschriftete graue Platzhalter. Das lokal gespeicherte Barista-Foto hat einen Quellen- und Lizenznachweis in `public/media/credits.json` und auf der Seite.

## Technik und Gestaltung

Next.js 16 App Router, React 19, TypeScript und Base UI für Dialoge und Akkordeon. Lokalisierte Wörterbücher liegen in `lib/content.ts`. [`../DESIGN.md`](../DESIGN.md) definiert die Gestaltung; Tokens, unveränderte Logo-SVGs und selbst gehostetes Inter stammen aus `../assets/zackisch/`. Das Skript `../scripts/sync-brand-assets.mjs` kopiert vor Entwicklung und Build die verwendeten Originale in den ignorierten öffentlichen Assetordner. Es gibt keine extern geladenen Schriften oder optionalen Analyse- und Werbedienste.

## Entwicklung und Prüfung

Aus dem Repository-Root:

```sh
npm run dev --prefix root
npm run lint --prefix root
npm run typecheck --prefix root
npm run test --prefix root
npm run build --prefix root
npm run build:cloudflare --prefix root
npm run check:cloudflare --prefix root
npx e2e run root/tests
```

Die Browsertests prüfen unter anderem lokale Schriften und Bilder, Sprachmetadaten, 320-Pixel-Darstellung, Menü, Fokus-Rückgabe, FAQ, Datenschutzeinstellungen und 404. Der vinext-Dry-Run prüft die Deploymentkonfiguration; er baut und veröffentlicht selbst nichts.

## Veröffentlichung und Rechtstexte

Impressum und Website-Datenschutz stehen unter ihren regulären Sprachpfaden. Die zweisprachigen Vorlagen in `lib/legal-content.ts` verwenden Max-Mustermann-Musterangaben und gekennzeichnete Felder für unbekannte Anbieter-, Dienstleister- und Aufbewahrungsangaben. Sie enthalten Quellenlinks und sind keine Bestätigung einer Rechtsprüfung. Die öffentlichen Seiten sind indexierbar; `robots.txt` erlaubt den Abruf und die Sitemap enthält sämtliche öffentlichen Sprachvarianten. Die Marketingwebsite führt keine eigene Veröffentlichungssperre ein.

Maßgeblich bleiben [`../docs/legal-pages-consents-and-contracts.md`](../docs/legal-pages-consents-and-contracts.md), [`../docs/privacy-and-data-governance.md`](../docs/privacy-and-data-governance.md) und die Zahlungs-/Steuerdokumentation. Die Marketingwebsite nimmt selbst keine Zahlungen entgegen.
