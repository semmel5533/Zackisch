# Zackisch Website

Die Website erklärt den zusätzlichen QR-Bestellweg für Gastronomiebetriebe in Deutschland. Gäste können ohne App oder Gastkonto bestellen. Die bestehende Kasse und der persönliche Service bleiben Teil des Betriebs. Der Hauptbutton führt zu `https://app.zackisch.com/sign-up`.

## Seiten und Sprachen

Die Startseite ist unter `/de-de` und `/de-en` verfügbar. Beide Sprachvarianten bieten Kosten, Forschungsquelle, Kontakt, Impressum, Website-Datenschutz, Plattform-Datenschutz, Betreibervertrag, Gastinformationen und Auftragsverarbeitungsvereinbarung. Canonical, Hreflang, Sitemap und Dokumentsprache berücksichtigen die Sprachpfade; unbekannte Seiten liefern 404.

Die Startseite erklärt die Beliebteste-Kategorie, ergänzende Artikelempfehlungen, freiwilliges Trinkgeld, die Betreiberschalter, den Bestellablauf und die Einrichtung. Sie nennt 2 % Zackisch-Gebühr einschließlich gegebenenfalls anfallender Umsatzsteuer auf diese Gebühr sowie zusätzliche Zahlungsanbietergebühren und Voraussetzungen. Die Studienzahl ist eine externe Selbstauskunft und kein Wirkungsnachweis für Zackisch. Produktbilder sind ausdrücklich beschriftete Platzhalter. Die echten Stockfotos stammen von Pexels; Quelle, freie kommerzielle Lizenz und Bearbeitung stehen in `public/media/credits.json`.

## Umsetzung

Next.js 16, React 19 und TypeScript; Base UI für Dialoge und Akkordeon. Deutsche und englische Texte liegen in lokalisierten Wörterbüchern. [DESIGN.md](../DESIGN.md) definiert League Spartan, Citron, unveränderte Zackisch-Logos und die Gestaltung. Alle Markenressourcen und Schriften liegen zentral in `public/brand/`. Die anderen Anwendungen verwenden dafür absolute URLs auf `https://zackisch.com/brand/`.

Auf Desktop laufen die drei Funktionskapitel beim Scrollen übereinander. Browser mit Unterstützung für Scroll-Animationen öffnen den großen Fotoausschnitt sanft. Bei reduzierter Bewegung entfallen diese Effekte. Bei höchstens 650 Pixeln Fensterhöhe werden die Funktionskapitel nicht angeheftet. Auf schmalen Geräten folgen die Inhalte untereinander. Die Website lädt keine optionalen Analyse- oder Werbedienste und keine externen Google Fonts.

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

Seitentitel folgen in beiden Sprachen dem Muster „Seiteninhalt | Zackisch“. Die Wortmarke ist das primäre Logo. Das Favicon verwendet das gelieferte schwarze Signet auf abgerundetem Citron-Hintergrund.

## Navigation, Bildsprache und Auffindbarkeit

Der zentrierte Einstieg zeigt ein großes echtes Café-Foto mit Smartphone. Eine kurze Problemsituation führt zu den Funktionen; zwei weitere Fotos mit anderen Menschen und Szenen begleiten Alltag und persönlichen Service. Stockfotos sind keine Produktaufnahmen oder Kundenreferenzen. Unter den FAQs ist Selim persönlich per E-Mail erreichbar.

Header und Footer öffnen denselben Regions-/Sprachdialog. Die Auslöser zeigen nur „Deutschland“ oder „Germany“; im Dialog stehen „Deutschland / Deutsch“ und „Germany / English“ untereinander. Die Auswahl wechselt den Sprachpfad und behält die aktuelle Unterseite. Escape, Außenklick und das X oben rechts schließen den Dialog und geben den Fokus an den Auslöser zurück. Der mobile Menüauslöser ist ein zugänglich beschriftetes Hamburger-Icon. Der Anmelden-Link und der Regionsauslöser im Header verwenden denselben Pill-Button-Stil und stehen als Gruppe mit 12 Pixeln Abstand zusammen. Der Citron-Footer bündelt Funktionen/Kosten/Quellen, Hilfe/Kontakt und Rechtliches; der Regionsbutton passt sich farblich an Citron an. Footer-Links sind erst beim Darüberfahren unterstrichen. Die transparente Originalwortmarke schließt ihn fast randlos ab.

Öffentliche Seiten liefern serverseitig sichtbaren Inhalt, eigene Titel/Beschreibungen, Canonicals, wechselseitige Hreflang-Verweise, Open Graph samt 1200×630-Citron-Vorschaubild und große Twitter-Karten. Robots und Sitemap erlauben die Erfassung. Die Startseiten enthalten JSON-LD für Organisation, Website und Sprachseite mit bestätigtem Namen, Kontakt und Logo; Musteranschrift und unbekannter Steuerstatus werden nicht als Unternehmensdaten ausgezeichnet. Keine erfundenen Bewertungen oder Suchmaschinen-Texte außerhalb des sichtbaren Inhalts.

Für klassische und generative Suche gelten die [Google-Grundlagen für KI-Suchergebnisse](https://developers.google.com/search/docs/appearance/ai-features) und die [Bing-Webmaster-Richtlinien](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a). Technische Erfassbarkeit garantiert keine Indexierung oder Zitierung. Nach einer freigegebenen Veröffentlichung müssen die echte Domain, CDN-Regeln, URL-Prüfung und Sitemap in Google Search Console/Bing Webmaster Tools geprüft werden. Lokal bestandene Tests belegen keine Live-Indexierung.

Unter dem Hero läuft ein Band mit sechs fiktiven Beispielmarken unter der Überschrift „Demo-Lokale“, ohne zusätzlichen Erklärungssatz. Es lässt sich pausieren und hält beim Darüberfahren an. Bei reduzierter Bewegung erscheinen alle Marken statisch ohne doppelte Inhalte.

Die Fotos sind farbig und erscheinen ohne Quellenzeile; die Pexels-Lizenz verlangt keine sichtbare Namensnennung. Die Kapitelüberschrift nutzt die volle Inhaltsbreite und bricht innerhalb von „Mehr gute Entscheidungen.“ nur bei Platzmangel um. Die kurze Preisangabe lautet „Inklusive Umsatzsteuer auf unsere Gebühr.“; der tatsächliche Steuerstatus bleibt separat zu klären. Die Preisargumentation betont Gebühren erst bei bezahlten Bestellungen, keine Grundgebühr und die Eignung für Saisonbetriebe. Eigene Geräte-, Internet- und Zahlungsanbietergebühren bleiben separat. Die FAQ erklärt Alltag, Kosten, manuelle Kassenerfassung samt einfachem Einstieg, mögliche künftige optionale Integrationen ohne Anbieter- oder Terminzusage, Voraussetzungen, Gastzugang, persönlichen Service und Verbindungsstörungen. Marketing verwendet „Artikel“, „Menü“ und „Zahlungsanbieter“; Rechtstexte nennen weiterhin die tatsächlichen Dienste.
