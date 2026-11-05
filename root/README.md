# Zackisch Website

Die Website erklärt den zusätzlichen QR-Bestellweg für Gastronomiebetriebe in Deutschland. Gäste können ohne App oder Gastkonto bestellen. Die bestehende Kasse und der persönliche Service bleiben Teil des Betriebs. Der Hauptbutton führt zu `https://app.zackisch.com/sign-up`.

## Seiten und Sprachen

Die Startseite ist unter `/de-de` und `/de-en` verfügbar. Beide Sprachvarianten bieten Kosten, Forschungsquelle, Kontakt, Impressum, Website-Datenschutz, Plattform-Datenschutz, Betreibervertrag, Gastinformationen und Auftragsverarbeitungsvereinbarung. Canonical, Hreflang, Sitemap und Dokumentsprache berücksichtigen die Sprachpfade; unbekannte Seiten liefern 404.

Die Startseite zeigt den Bestellablauf, die Einrichtung, 2 % Zackisch-Gebühr einschließlich gegebenenfalls anfallender Umsatzsteuer auf diese Gebühr sowie separate Stripe-Gebühren und Voraussetzungen. Die Studienzahl ist eine externe Selbstauskunft und kein Wirkungsnachweis für Zackisch. Produktbilder sind ausdrücklich beschriftete Platzhalter. Die echten Stockfotos stammen von Pexels; Quelle, freie kommerzielle Lizenz und Bearbeitung stehen in `public/media/credits.json`.

## Umsetzung

Next.js 16, React 19 und TypeScript; Base UI für Dialoge und Akkordeon. Deutsche und englische Texte liegen in lokalisierten Wörterbüchern. [DESIGN.md](../DESIGN.md) definiert League Spartan, Citron, unveränderte Zackisch-Logos und die Gestaltung. Alle Markenressourcen und Schriften liegen zentral in `public/brand/`. Die anderen Anwendungen verwenden dafür absolute URLs auf `https://zackisch.com/brand/`.

Auf Desktop bleibt die Überschrift des Bestellablaufs beim Scrollen sichtbar. Browser mit Unterstützung für Scroll-Animationen öffnen den breiten Fotoausschnitt sanft. Bei reduzierter Bewegung entfallen diese Effekte. Auf schmalen Geräten folgen die Inhalte untereinander. Die Website lädt keine optionalen Analyse- oder Werbedienste und keine externen Google Fonts.

## Lokal arbeiten

Vom Repository-Root:

```sh
npm run dev --prefix root
npm run lint --prefix root
npm run typecheck --prefix root
npm run test --prefix root
npm run test:browser
npm run build --prefix root
npm run build:cloudflare --prefix root
```

Playwright prüft unter anderem Sprachmetadaten, lokale Bilder und Schrift, 320-Pixel-Reflow, Navigation, Tastatur und Fokus, FAQ, Datenschutzdialog, Rechtstextverlinkung, 404 und automatisierte Barrierefreiheit. Eine bestandene automatische Prüfung ersetzt keine vollständige manuelle oder rechtliche Prüfung.

## Rechtstexte

Selim Eser, handelnd unter Zackisch, und `selim@zackisch.com` sind eingetragen. Die Anschrift ist auf Wunsch eine klar bezeichnete Musterangabe. Unbekannte Vertrags-, Dienstleister-, Aufbewahrungs- und Steuerangaben bleiben gekennzeichnet. Der Umsatzsteuerstatus wurde nicht festgelegt. Diese Entwürfe sind keine rechtliche Freigabe und müssen vor einem Echtbetrieb anhand der tatsächlichen Angaben vervollständigt werden.

Die Website nimmt selbst keine Zahlungen entgegen. Die Veröffentlichung einer Vertragsvorlage setzt keine Zustimmung im Backend. [AGENTS.md](../AGENTS.md) enthält die verbindlichen Zahlungs-, Datenschutz-, Sicherheits- und Release-Regeln und die Pflicht zur aktuellen deutschen und europäischen Rechtsrecherche.
