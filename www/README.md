# Zackisch Website

Die Website erklärt den zusätzlichen QR-Bestellweg für Gastronomiebetriebe in Deutschland. Gäste können ohne App oder Gastkonto bestellen. Die bestehende Kasse und der persönliche Service bleiben Teil des Betriebs. Der Hauptbutton führt zu `https://app.zackisch.com/sign-up`.

## Seiten und Sprachen

Die Startseite ist unter `/de-de` und `/de-en` verfügbar. Beim Aufruf von `/` wählt die Website anhand der Browsersprache (`navigator.languages` beziehungsweise `navigator.language`) automatisch `de-de` für Deutsch oder `de-en` für Englisch und fällt standardmäßig auf `de-de` (Deutschland mit Deutsch) zurück, wenn die Browsersprache nicht ermittelt werden kann oder nicht unterstützt wird. Beide Sprachvarianten bieten Forschungsquelle, Impressum, Website-Datenschutz, Plattform-Datenschutz, Betreibervertrag, Gastinformationen und Auftragsverarbeitungsvereinbarung. Canonical, Hreflang, Sitemap und Dokumentsprache berücksichtigen die Sprachpfade; unbekannte Seiten liefern 404.

Die Startseite erklärt konfigurierbare Varianten, Extras und Auswahlschritte, die Verfügbarkeitsschalter des Personals für Artikel, Schritte und Optionen, die Beliebteste-Kategorie, ergänzende Artikelempfehlungen, freiwilliges Trinkgeld, die Betreiberschalter, den Bestellablauf und die Einrichtung. Sie nennt 2 % Zackisch-Gebühr einschließlich gegebenenfalls anfallender Umsatzsteuer auf diese Gebühr sowie zusätzliche Zahlungsanbietergebühren und Voraussetzungen. Die Studienzahl ist eine externe Selbstauskunft und kein Wirkungsnachweis für Zackisch. Produktbilder sind ausdrücklich beschriftete Platzhalter. Die echten Stockfotos stammen von Pexels; Quelle, freie kommerzielle Lizenz und Bearbeitung stehen in `public/media/credits.json`.

## Umsetzung

Next.js 16, React 19 und TypeScript; Base UI für Dialoge und Akkordeon. Die Website wird als statischer Export (`out/`) für Cloudflare Pages gebaut und benötigt keine Cloudflare Workers oder vinext. Deutsche und englische Texte liegen in lokalisierten Wörterbüchern. [DESIGN.md](../DESIGN.md) definiert Lexend, Citron, unveränderte Zackisch-Logos und die Gestaltung. Alle Markenressourcen und Schriften liegen zentral in `public/brand/`. Die anderen Anwendungen verwenden dafür absolute URLs auf `https://zackisch.com/brand/`.

Auf Desktop laufen die drei Funktionskapitel beim Scrollen übereinander. Browser mit Unterstützung für Scroll-Animationen öffnen den großen Fotoausschnitt sanft. Bei reduzierter Bewegung entfallen diese Effekte. Bei höchstens 650 Pixeln Fensterhöhe werden die Funktionskapitel nicht angeheftet. Auf schmalen Geräten folgen die Inhalte untereinander. Die Website lädt keine optionalen Analyse- oder Werbedienste und keine externen Google Fonts.

## Lokal arbeiten

Vom Repository-Root:

```sh
npm run dev --prefix www
npm run lint --prefix www
npm run typecheck --prefix www
npm run test --prefix www
npm run test:browser
npm run build --prefix www
npm run dev:pages --prefix www
```

Playwright prüft unter anderem Sprachmetadaten, lokale Bilder und Schrift, 320-Pixel-Reflow, Navigation, Tastatur und Fokus, FAQ, Datenschutzdialog, Rechtstextverlinkung, 404 und automatisierte Barrierefreiheit. Eine bestandene automatische Prüfung ersetzt keine vollständige manuelle oder rechtliche Prüfung.

## Rechtstexte

Selim Eser, handelnd unter Zackisch, und `selim@zackisch.com` sind eingetragen. Die Anschrift ist auf Wunsch eine klar bezeichnete Musterangabe. Unbekannte Vertrags-, Dienstleister-, Aufbewahrungs- und Steuerangaben bleiben gekennzeichnet. Der Umsatzsteuerstatus wurde nicht festgelegt. Diese Entwürfe sind keine rechtliche Freigabe und müssen vor einem Echtbetrieb anhand der tatsächlichen Angaben vervollständigt werden.

Die Website nimmt selbst keine Zahlungen entgegen. Die Veröffentlichung einer Vertragsvorlage setzt keine Zustimmung im Backend. [AGENTS.md](../AGENTS.md) enthält die verbindlichen Zahlungs-, Datenschutz-, Sicherheits- und Release-Regeln und die Pflicht zur aktuellen deutschen und europäischen Rechtsrecherche.

Seitentitel folgen in beiden Sprachen dem Muster „Seiteninhalt | Zackisch“. Die Wortmarke ist das primäre Logo. Das Favicon verwendet das gelieferte schwarze Signet auf abgerundetem Citron-Hintergrund.

## Navigation, Bildsprache und Auffindbarkeit

Der zentrierte Einstieg zeigt auf Desktop ein großes echtes Café-Foto mit Smartphone. Probleme beim Tischservice und beim Bestellen, Bezahlen und Abholen am Tresen führen zu den Funktionen; ein weiteres Foto mit einem anderen Gast begleitet den Alltag auf Desktop. Im mobilen Layout unter 800 Pixeln Breite werden das Hero-Bild und das Bild im Abschnitt „Volle Tische, Schlange am Tresen“ komplett ausgeblendet. Der Team-Abschnitt ist ohne Foto zentriert und zeigt eine breite Personal-Vorschau, die beim Scrollen auf Desktop sanft von 88 auf 100 Prozent wächst. Auf Mobilgeräten und bei reduzierter Bewegung erscheint sie direkt vollständig. Die drei Gäste-Vorschauen stehen in Smartphone-Rahmen; alle Produktvorschauen enthalten weiterhin ausschließlich beschriftete Platzhalter. Stockfotos sind keine Produktaufnahmen oder Kundenreferenzen. Unter den FAQs ist Selim persönlich per E-Mail erreichbar. Der gesamte Kontaktblock ist linksbündig und wird unten statt oben durch eine Linie begrenzt; die E-Mail hat keinen Pfeil und wird bei Hover oder Tastaturfokus unterstrichen.

Header und Footer öffnen denselben Regions-/Sprachdialog. Die Auslöser zeigen nur „Deutschland“ oder „Germany“; im Dialog stehen „Deutschland / Deutsch“ und „Germany / English“ untereinander. Die Auswahl wechselt den Sprachpfad und behält die aktuelle Unterseite. Escape, Außenklick und das X oben rechts schließen den Dialog und geben den Fokus an den Auslöser zurück. Der mobile Menüauslöser ist ein zugänglich beschriftetes Hamburger-Icon. Der Anmelden-Link und der Regionsauslöser im Header verwenden denselben Pill-Button-Stil und stehen als Gruppe mit 12 Pixeln Abstand zusammen; die kompakten Pills sind mindestens 48 Pixel hoch, mit 17 Pixel Schrift und 12/20 Pixel Innenabstand. Icons und Pfeile in Buttons und Links sind optisch vertikal zur Schrift zentriert. Der Citron-Footer hat auf Desktop zwei Spalten und ist unter 800 Pixeln Breite einspaltig zentriert: zuerst die drei Outline-Pill-Buttons für Region/Sprache, Hilfe und Forschung & Quellen, danach Funktionen, Kosten, Fragen und Kontakt direkt darunter ohne Überschrift, daneben Rechtliches. Hilfe führt zur lokalisierten Support-Website, Kontakt zum E-Mail-Abschnitt der Startseite. Die Outline-Buttons passen sich farblich an Citron an. Abschnittslinks erhalten nur beim Darüberfahren einen Unterstrich. Links zu anderen Seiten tragen stattdessen dauerhaft einen Pfeil und werden nicht unterstrichen. Die transparente Originalwortmarke schließt ihn fast randlos ab.

Öffentliche Seiten liefern serverseitig sichtbaren Inhalt, eigene Titel/Beschreibungen, Canonicals, wechselseitige Hreflang-Verweise, Open Graph samt 1200×630-Citron-Vorschaubild und große Twitter-Karten. Robots und Sitemap erlauben die Erfassung. Die Startseiten enthalten JSON-LD für Organisation, Website und Sprachseite mit bestätigtem Namen, Kontakt und Logo; Musteranschrift und unbekannter Steuerstatus werden nicht als Unternehmensdaten ausgezeichnet. Keine erfundenen Bewertungen oder Suchmaschinen-Texte außerhalb des sichtbaren Inhalts.

Für klassische und generative Suche gelten die [Google-Grundlagen für KI-Suchergebnisse](https://developers.google.com/search/docs/appearance/ai-features) und die [Bing-Webmaster-Richtlinien](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a). Technische Erfassbarkeit garantiert keine Indexierung oder Zitierung. Nach einer freigegebenen Veröffentlichung müssen die echte Domain, CDN-Regeln, URL-Prüfung und Sitemap in Google Search Console/Bing Webmaster Tools geprüft werden. Lokal bestandene Tests belegen keine Live-Indexierung.

Unter dem Hero läuft ein Band mit sechs lokalisierten Platzhaltern wie „Dein Café“ unter der Einladung „Hier könnte dein Lokal auftauchen.“, ohne zusätzlichen Erklärungssatz. Es lässt sich pausieren und hält beim Darüberfahren an. Bei reduzierter Bewegung erscheinen alle Marken statisch ohne doppelte Inhalte.

Die Fotos sind farbig und erscheinen ohne Quellenzeile; die Pexels-Lizenz verlangt keine sichtbare Namensnennung. Die Kapitelüberschrift nutzt die volle Inhaltsbreite und bricht innerhalb von „mehr Optionen“ nur bei Platzmangel um. Die kurze Preisangabe lautet „Inklusive Umsatzsteuer auf unsere Gebühr, zzgl. Zahlungsanbietergebühren.“; zusammengesetzte Begriffe wie „QR-Codes“ und Zusätze wie „zzgl. Zahlungsanbietergebühren.“ werden als zusammenhängende Einheit auf einer Zeile gehalten. Der tatsächliche Steuerstatus bleibt separat zu klären. Die Preisargumentation betont Gebühren erst bei bezahlten Bestellungen, keine Einrichtungskosten oder monatliche Grundgebühr und die Eignung für Saisonbetriebe. Eigene Geräte-, Internet- und Zahlungsanbietergebühren bleiben separat. Die FAQ erklärt Alltag, Abholung ohne Tische samt Bestellnummer und Abholstatus, Kosten, manuelle Kassenerfassung samt einfachem Einstieg, mögliche künftige optionale Integrationen ohne Anbieter- oder Terminzusage, Voraussetzungen, Gastzugang, persönlichen Service, Barzahlung im bestehenden Kassenablauf und Verbindungsstörungen. Gäste ohne nutzbares Smartphone können wie gewohnt beim Team bestellen und bezahlen. Marketing verwendet „Artikel“, „Menü“ und „Zahlungsanbieter“; Rechtstexte nennen weiterhin die tatsächlichen Dienste.

Abschnittslinks scrollen sanft ohne sichtbaren URL-Hash, auch von Unterseiten aus. Die Zielüberschrift erhält den Fokus und oben 24 Pixel Platz unter 800 Pixeln Breite, sonst 40 Pixel. Bei reduzierter Bewegung erfolgt der Sprung sofort. Für neue Tabs und ohne JavaScript bleiben echte Fragmentlinks erhalten. Eine separate Kontaktseite gibt es nicht. FAQ-Fragen und der Einrichtungstext darüber beginnen auf derselben Spaltenkante. Der Hero-Text hat maximal 54ch Breite; das Problemfoto wird im kürzeren 4:3-Format angezeigt.

Der Kostenabschnitt liegt auf der Startseite; eine separate Pricing-Seite gibt es nicht.

Mit `TEST_BROWSER=chromium`, `TEST_BROWSER=firefox` oder `TEST_BROWSER=webkit` vor `npm run test:browser` wird die Browser-Engine gewählt. Firefox prüft den mobilen Viewport ohne mobile Browseremulation. Die Tests decken auch 200 Prozent Textgröße und beide Wörterbuchstrukturen ab; echte Geräte und assistive Technologien bleiben zusätzliche Prüfungen.

Links zu anderen Hosts, einschließlich app.zackisch.com, support.zackisch.com und externen Quellen, öffnen einen neuen Tab mit einem lokalisierten zugänglichen Hinweis und `noopener noreferrer`. Öffentliche Unterseiten auf derselben Domain bleiben im selben Tab. Die beiden Registrierungsbuttons verwenden einheitlich 19 Pixel Schrift und mindestens 56 Pixel Höhe; die kompakten Header-, Mobilmenü- und Footer-Pills verwenden 17 Pixel Schrift und mindestens 48 Pixel Höhe. Die Kontakt-E-Mail behält ihren Hover-Unterstrich ohne Pfeil.

Die Fehlerseite verwendet denselben Header und Footer, zentrierte Texte ohne sichtbare Fehlernummer und einen direkten Weg zur Startseite. Pfade unter `/de-en/` zeigen Englisch, unter `/de-de/` und ohne bekanntes Sprachpräfix Deutsch. Ein Sprachwechsel auf der 404 führt zur Startseite der gewählten Sprache; auf vorhandenen Seiten bleibt der Seitenpfad erhalten. Unbekannte und entfernte Seiten liefern HTTP 404 und noindex.

Das aufgeweitete Hero-Foto nutzt dieselbe volle Containerbreite wie die folgenden Abschnitte. Unter dem Header verläuft eine durchgehende Trennlinie. Einzelne zusammenhängende Überschriften, kurze Einzelzeilen und kommagetrennte Überschriften wie „Am Tisch, am Tresen, mit deinem Team“ vermeiden abschließende Punkte. Das Hero-Foto ist unten ausgerichtet und auf 16:9 beschnitten; dadurch entfällt ein Teil des oberen Bildrands.

Der automatische Axe-Dialogscan ist im aktuellen Firefox-Testlauf wegen eines reproduzierbaren Browserabsturzes ausdrücklich übersprungen. Dialoginteraktion, Sprachwechsel, Fokus sowie die übrigen Firefox-Prüfungen laufen weiter; Chromium und WebKit prüfen auch den Dialog mit Axe.

Im Header folgen Funktionen, Kosten, Fragen und Kontakt links auf das Logo. Hilfe, Region/Sprache und Anmelden stehen rechtsbündig. Im Footer folgen Hilfe und Forschung & Quellen als Outline-Pill-Buttons unmittelbar auf die Regionsauswahl; Kontakt steht nach Fragen. Hilfe erscheint im Header als Ghost-Pill und im Mobilmenü sowie im Footer mit Outline. Unter 1250 Pixeln zeigt der Header nur Logo und Hamburger. Das von links sanft einfahrende Citron-Menü enthält dieselbe Reihenfolge wie der Desktop-Header (Funktionen, Kosten, Fragen, Kontakt, gefolgt von Hilfe als Outline-Pill, Region & Sprache als Outline-Pill und Anmelden als schwarzer Pill-Button) ohne zusätzlichen Registrierungsbutton, ohne sichtbare Überschrift und mit X oben rechts. Es unterstützt Tastatur, Fokus-Rückgabe und reduzierte Bewegung. Der Hero-CTA ist Primary Citron, Anmelden im Desktop-Header und Mobilmenü schwarz.

Die FAQ bündelt die wichtigsten Themen in acht Fragen; Kassenerfassung, Einstiegsgrund und mögliche spätere Integrationen stehen gemeinsam in einer Antwort. Die Regionsauswahl ist in Header, Mobilmenü und Footer gleich groß: im Header als Ghost-Button, im Mobilmenü und Footer wie der Hilfe-Button und der Button Forschung & Quellen im Footer mit Outline.
