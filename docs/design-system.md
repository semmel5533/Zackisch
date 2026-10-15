# Design-System-Referenz

Dies ist die quellcodebezogene Implementierungsreferenz für [DESIGN.md](../DESIGN.md). [AGENTS.md](../AGENTS.md) definiert verbindliche Zielvorgaben; die untenstehenden Quellverweise beschreiben den implementierten Stand. [UX-Forschung](ux-research.md) begründet die Richtlinien für Klarheit, Zugänglichkeit und Wiederherstellbarkeit.

| ID | Bereich | Quelle |
| --- | --- | --- |
| [DS-01](#ds-tokens) | Gemeinsame Tokens | [webapp CSS](../webapp/app/globals.css), [website CSS](../website/app/globals.css) |
| [DS-02](#ds-primitives) | Buttons, Felder, Karten | [webapp UI](../webapp/components/ui/), [website-Varianten](../website/components/ui/button-variants.ts) |
| [DS-03](#ds-overlays) | Dialoge, Popups, Feedback | [dialog](../webapp/components/ui/dialog.tsx), [select](../webapp/components/ui/select.tsx), [website-Modal](../website/components/RegionLanguageModal.tsx) |
| [DS-04](#ds-shells) | Dashboard- und Terminal-Shells | [dashboard](../webapp/components/dashboard/dashboard-shell.tsx), [staff](../webapp/components/staff/staff-terminal-shell.tsx) |
| [DS-05](#ds-guest) | Gäste-Bestellablauf und Zahlung | [guest](../webapp/components/guest/guest-frontend.tsx), [cart](../webapp/components/guest/cart-sheet.tsx) |
| [DS-06](#ds-qr) | QR, Druck, Ziffern | [overview](../webapp/components/dashboard/overview-content.tsx), [website QR](../website/components/QrCodeShowcase.tsx) |
| [DS-07](#ds-website) | Marketing-Website | [page](../website/components/MainPage.tsx), [header](../website/components/Header.tsx) |
| [DS-08](#ds-i18n) | Lokalisierung und Barrierefreiheit | [Regeln](../AGENTS.md), [Forschung](ux-research.md) |
| [DS-09](#ds-decisions) | Evidenz und Design-Entscheidungen | [Audit](documentation-audit.md) |
| [DS-10](#ds-more-primitives) | Zusätzliche Primitive | [webapp UI](../webapp/components/ui/) |
| [DS-11](#ds-auth) | Authentifizierungsformulare | [auth layout](../webapp/app/%28auth%29/layout.tsx) |
| [DS-12](#ds-menu) | Speisekarte und Verfügbarkeiten | [menu](../webapp/components/dashboard/menu-content.tsx), [availability](../webapp/components/availability/availability-content.tsx) |
| [DS-13](#ds-overview) | Übersicht, Bestellarchiv, QR-Verwaltung | [overview](../webapp/components/dashboard/overview-content.tsx), [archive](../webapp/components/dashboard/all-orders-content.tsx) |
| [DS-14](#ds-region) | Region und Sprache | [webapp](../webapp/components/region-language-dialog.tsx), [website](../website/components/RegionLanguageModal.tsx) |
| [DS-15](#ds-15-tailwind-first-authoring) | Tailwind-Entwicklung | [Regeln](../AGENTS.md), [CSS-Quellen](../webapp/app/globals.css) |

<a id="ds-tokens"></a>
## DS-01: Tokens und berechnetes Rastersystem

Beide Stylesheets nutzen eine schwarz-weiße semantische Basis mit gedämpfter Oberfläche `oklch(0.97 0 0)`, gedämpftem Text `oklch(0.5 0 0)`, subtilem Standard-Rahmen für Container und Steuerelemente `oklch(0.922 0 0)` (`--border` und webapp `--input`) sowie dezentem Seitenhintergrund `oklch(0.982 0 0)` (`--canvas`). Destruktives Rot ist `oklch(0.577 0.245 27.325)`. Website `--site-muted`, `--site-line` und `--site-soft` spiegeln jeweils gedämpften Text, Rahmen und gedämpfte Oberflächen wider. Die Webapp definiert helle Sidebar-Rollen (`--sidebar` in reinem Weiß `oklch(1 0 0)`): [Webapp Tokens](../webapp/app/globals.css), [Website Tokens](../website/app/globals.css).

Das gemeinsame Tailwind `--spacing` beträgt `0.25rem`: Bei 16px Basisschriftgröße entspricht `p-2 = 8px`, `p-4 = 16px`, `h-9 = 36px`, `h-11 = 44px` und `h-12 = 48px`. Die expliziten Eckenradien lauten `sm 4px`, `md 8px`, `lg 12px`, `xl 20px` und `2xl` bis `4xl 24px`. Es werden stets die definierten Tokens verwendet: [Webapp CSS](../webapp/app/globals.css), [Website CSS](../website/app/globals.css).

Reguläre Theme-Schatten nutzen den transparenten Standardwert `0 0 #0000`. Sichtbare Popups oder Dialoge erhalten gezielte Oberflächenschatten gemäß [Webapp Theme](../webapp/app/globals.css). Das [QR-Papier](../website/components/QrCodeShowcase.tsx) der Website verwendet einen bewussten physischen Schattenwurf.

Sowohl die [Root-Layouts](../webapp/app/layout.tsx) als auch das [Website-Layout](../website/app/layout.tsx) laden Poppins und Inter. Poppins trägt Text und Wortmarken; Inter mit Tabellenziffern (`tabular-nums`) dient isolierten Ziffern und Dezimaltrennern. Die Webapp-Komponente [Price](../webapp/components/ui/price.tsx) hält Währungszeichen und Präfix außerhalb des Inter-Ziffern-Spans. Reine Versalschrift (All-Caps) ist strikt reserviert: Auf der Website wird sie exklusiv für Navigation und rechtliche Links ([Header](../website/components/Header.tsx), [SiteFooter](../website/components/SiteFooter.tsx)) für eine klare architektonische Strukturierung eingesetzt; in der Webapp ausschließlich für physische QR-Code-Beschriftungen ([Overview](../webapp/components/dashboard/overview-content.tsx)), um maximale Fernwirkung auf gedruckten Aufstellern und Stickern zu gewährleisten. Alle übrigen Benutzeroberflächen-Überschriften, Tabellenköpfe, Badges und Steuerelemente verwenden natürliche Groß-/Kleinschreibung in fetter Poppins (`text-sm font-bold text-foreground`).

<a id="ds-primitives"></a>
## DS-02: Buttons, Felder und Karten

Der [Webapp-Button](../webapp/components/ui/button.tsx) und die [Website-Button-Varianten](../website/components/ui/button-variants.ts) teilen dieselbe Aktionshierarchie: schwarzer Standard (Default/Primary), weiße konturierte Schaltfläche (Outline), dezente Geister-Schaltfläche (Ghost) und roter destruktiver Button. `secondary` fungiert als kompatibler Alias für Outline. Standard-Buttons haben `h-11` (44px), kompakte `h-9` (36px), prominente Checkout-Buttons `h-12` (48px) und Icon-Controls 44px; kompakte Touch-Ziele vergrößern sich für grobe Zeiger auf mindestens 44px. Beschriftungen sind in 14px Semibold gehalten. Hover, aktive Skalierung (.98), Deaktivierungs-Deckkraft, 2px Fokusring mit 2px Versatz und `prefers-reduced-motion` sind zentral definiert.

Das [Webapp-Input](../webapp/components/ui/input.tsx) ist ein mindestens 44px hohes weißes Eingabefeld mit 12px Eckenradius, dezentem `border-border`, klaren Fokus- und Fehlerzuständen und einer Standardbegrenzung auf 255 Zeichen. Die [Card](../webapp/components/ui/card.tsx) verwendet helle Oberflächen und einheitliche 20px Eckenradien.

<a id="ds-overlays"></a>
## DS-03: Overlays, Modals und Feedback

Das [Webapp-Dialog](../webapp/components/ui/dialog.tsx) bietet einen hellen Rahmen (20px mobil, 24px Desktop) mit durchgehenden Trennlinien in Kopf- und Fußzeile. Alle Dialog- und Sheet-Köpfe mit Schließen-Aktion richten das 'X'-Icon vertikal exakt auf der Mittelachse des Titels aus (`flex items-center justify-between`). [Select](../webapp/components/ui/select.tsx) und [Dropdown](../webapp/components/ui/dropdown-menu.tsx) nutzen 20px Außenradien, 8px Innenabstand und 12px Zielbereiche für Einträge.

Das [RegionLanguageModal](../website/components/RegionLanguageModal.tsx) der Website nutzt natives `<dialog>` mit `showModal()`, Auswahlspeicherung, übersetzten Zielen, Klick-ins-Freie-/Escape-Schließen und Fokus-Wiederherstellung.

[Sonner](../webapp/components/ui/sonner.tsx) stellt Toast-Benachrichtigungen dar. Diese erscheinen oben zentriert mit Icon links. Inline-Fehler werden linksbündig direkt am betroffenen Feld dargestellt; ein Toast dupliziert keine Fehlermeldung, die bereits im Formular sichtbar ist.

<a id="ds-shells"></a>
## DS-04: Dashboard- und Terminal-Shells

Das [Dashboard](../webapp/components/dashboard/dashboard-shell.tsx) und die [Staff-Shell](../webapp/components/staff/staff-terminal-shell.tsx) bieten vollständig helle Flächen (`bg-sidebar text-sidebar-foreground` mit reinweißer Sidebar, `bg-canvas` mit dezentem `oklch(0.982 0 0)` für Seitenhintergründe und `bg-card` für Inhaltskarten), eine Breite von 288px (`w-72`), damit Einträge wie „Aktuelle Bestellungen“ ungekürzt dargestellt werden, schwarze Wortmarken (`brightness-0`), kontraststarke aktive Navigations-Pills (`bg-primary text-primary-foreground`) und eine durchgehende vertikale Trennlinie (`border-r border-border`). Auf Desktop-Bildschirmen teilen sich alle Dashboard-Header und die Sidebar-Kopfzeile eine Höhe von exakt 64px (`h-16`) mit vertikaler Mittelachse bei $y = 31.5\,\text{px}$, wodurch das Zackisch-Logo und die `h1`-Hauptüberschrift horizontal exakt fluchten. Die Zackisch-Wortmarke wird als nicht-klickbares statisches Branding dargestellt.

In der [Live-Bestellansicht](../webapp/components/dashboard/current-orders-content.tsx) teilen sich beide Spaltenköpfe („In Bearbeitung“ und „Abholbereit“) sowie der Kopf der ausgewählten Bestellkarte eine identische Höhe von exakt 60px (`h-[60px]`), sodass alle horizontalen Trennlinien über alle drei Spalten auf einer durchgehenden Achse liegen.

<a id="ds-guest"></a>
## DS-05: Gäste-Bestellablauf und Checkout

Das [Gäste-Frontend](../webapp/components/guest/guest-frontend.tsx) bündelt Speisekarte und Warenkorb in einer fokussierten Spalte und blendet nach Hinzufügen eines Artikels ein fixiertes unteres Warenkorb-Banner ein. Eine charakteristische schwarze Wellenlinie ([WaveLine](../webapp/components/ui/wave-line.tsx), `strokeWidth={2.25}`, einheitliche $16\,\text{px}$ Wellenlänge, $12\,\text{px}$ Höhe, $4.5\,\text{px}$ Amplitude) im Zackisch-QR-Stil trennt das Kopfprofil von der fixierten Kategorienleiste. Auf Mobilgeräten berücksichtigen Header und Footers die iOS-Safe-Areas (`pt-[max(1.5rem,env(safe-area-inset-top))]`, `pb-[max(1.5rem,env(safe-area-inset-bottom))]`).

Im [Warenkorb](../webapp/components/guest/cart-sheet.tsx) nutzen Mengensteuerungen kompakte Stepper (`h-7`, `p-0.5`, `size-6` Buttons, `min-w-[18px]` Ziffer, ca. 72px Breite). Im [Kassendialog](../webapp/components/guest/checkout-form.tsx) ist die E-Mail-Angabe optional: Eine standardmäßig deaktivierte Checkbox („Bestell- und Zahlungsbestätigung per E-Mail erhalten“) blendet bei Bedarf das E-Mail-Feld ein. Gäste können direkt nach der Zahlung eine eigenständige Bestell- und Zahlungsbestätigung als druckoptimierte HTML-Datei ([confirmation-generator](../webapp/lib/confirmation-generator.ts), `bestell-und-zahlungsbestaetigung-{orderNumber}.html`) herunterladen. Zackisch fungiert hierbei als technischer Vermittler der Zahlungsbestätigung; steuerliche Bewirtungsbelege stellt der gastronomische Betrieb aus.

<a id="ds-qr"></a>
## DS-06: QR-Codes, Druck und Ziffern

Das [Website-QR-Showcase](../website/components/QrCodeShowcase.tsx) visualisiert einen echten, kontraststarken QR-Code auf einem leicht geneigten Blatt mit der einheitlichen [WaveLine](../website/components/WaveLine.tsx). Auf Mobilgeräten passt sich die Höhe dynamisch an (`max-[600px]:min-h-0 max-[600px]:px-[22px] max-[600px]:py-6`), um vertikale Verzerrungen zu vermeiden. Die QR-Code-Verwaltung und der Ausdruck erfolgen direkt über das [Dashboard](../webapp/components/dashboard/overview-content.tsx) per nativem Browser-Druckdialog (`window.print`). Physische Druckschilder nutzen kräftige Versalien für Fernwirkung und Lesbarkeit am Tisch.

<a id="ds-website"></a>
## DS-07: Marketing-Website

Die Startseite ([MainPage](../website/components/MainPage.tsx)) führt durch Editorial Hero, QR-Showcase, Produktablauf („So einfach funktioniert's“), Einrichtungsablauf („Ruckzuck eingerichtet“, zentriert), Umsatzpotenzial („Mehr Raum für Umsatz“, linksbündig), Preismodell („Nur wenn bestellt wird“, linksbündig), FAQ-Akkordeon und Registrierungs-CTA. Der [Header](../website/components/Header.tsx) nutzt lokalisierte Hash-Links und ein tastaturbedienbares Mobilmenü mit Escape-Unterstützung.

Die charakteristische schwarze [WaveLine](../website/components/WaveLine.tsx) liegt exklusiv direkt über dem Footer. Die Bereiche „Mehr Raum für Umsatz“ und „Nur wenn bestellt wird“ nutzen den Steinstruktur-Hintergrund des Hero-Bereichs (`bg-[#e7e7e7] bg-[url('/hero-stone-bg.webp')]`) mit oberen und unteren Trennlinien (`border-y border-[var(--site-line)]`), einer inneren Trennlinie (`border-black/20`) und kontraststarkem Fließtext (`text-black/75` für WCAG AAA Lesbarkeit). Alle übrigen Abschnittsübergänge werden durch standardmäßige feine Rahmen getrennt. Zwischen dem FAQ-Akkordeon und dem Footer ist ein eigenständiger Newsletter-Bereich mit Double-Opt-In platziert. Im [Footer](../website/components/SiteFooter.tsx) sitzt das Eichhörnchen-Maskottchen ungestört an der unteren Blattkante, während Navigations- und Rechtslinks spationierte Versalien (`uppercase tracking-[0.08em]`) nutzen. Das Brand-Mark-Icon wird zur Gewährleistung bester Lesbarkeit auf Dark-Mode-Browserleisten in einem reinweißen, abgerundeten Container ausgeliefert.

<a id="ds-i18n"></a>
## DS-08: Lokalisierung und Barrierefreiheit

[AGENTS.md](../AGENTS.md) verlangt vollständig übersetzte Benutzeroberflächen, muttersprachliche Regionsbezeichnungen (Endonyme), Phosphor-Icons und sichtbares visuelles Feedback. Beide Button-Fundamente definieren Tastaturfokus und Reduzierte-Bewegung-Regeln. [UX-Forschung](ux-research.md) deckt Kontraste, Tastaturfokus, Mindestzielgrößen, Reflow und Fehlerbehandlung ab.

<a id="ds-decisions"></a>
## DS-09: Evidenz und Design-Entscheidungen

Das 4px-Raster, die schwarzen Primäraktionen, die Trennung zwischen Poppins und Inter sowie die spezifischen Radien sind konsistente Markenentscheidungen für Zackisch. Das [Dokumentations-Audit](documentation-audit.md) erfasst den verifizierten Implementierungsstand.

<a id="ds-more-primitives"></a>
## DS-10: Zusätzliche UI-Primitive

[Checkbox](../webapp/components/ui/checkbox.tsx), [Switch](../webapp/components/ui/switch.tsx), [Tabs](../webapp/components/ui/tabs.tsx), [Textarea](../webapp/components/ui/textarea.tsx), [OTP-Eingabe](../webapp/components/ui/input-otp.tsx), [Table](../webapp/components/ui/table.tsx), [Pagination](../webapp/components/ui/pagination.tsx), [Avatar](../webapp/components/ui/avatar.tsx), [Tooltip](../webapp/components/ui/tooltip.tsx), [Popover](../webapp/components/ui/popover.tsx) und [ScrollArea](../webapp/components/ui/scroll-area.tsx) kapseln ihr lokales Verhalten. Der Tooltip unterstützt zusätzlich zum Hover auch Tap/Click-Toggling für mobile Geräte.

<a id="ds-auth"></a>
## DS-11: Authentifizierungsformulare

Das [Auth-Layout](../webapp/app/%28auth%29/layout.tsx) zentriert helle Karten und Eingabefelder. Die [Anmeldung](../webapp/app/%28auth%29/sign-in/page.tsx) leitet von Zugangsdaten zum OTP-Code über, begleitet von Timer und Fehleranzeigen. Eingegebene Werte, Ladezustände und linksbündige Korrekturhinweise bleiben konsistent erhalten.

<a id="ds-menu"></a>
## DS-12: Speisekarte und Verfügbarkeiten

Die [Kartenverwaltung](../webapp/components/dashboard/menu-content.tsx) koordiniert Kategorien und Artikel. Innerhalb von Kategorien werden Artikel über Pfeil-Schaltflächen neu geordnet. Der [ItemWorkspace](../webapp/components/dashboard/menu/item-workspace.tsx) und der [CustomizationBuilder](../webapp/components/dashboard/menu/customization-builder.tsx) ermöglichen die Bearbeitung von Bildern, Optionen, Freimengen und Preisen. [Verfügbarkeiten](../webapp/components/availability/availability-content.tsx) bietet Schnellschalter für den operativen Betrieb.

<a id="ds-overview"></a>
## DS-13: Übersicht, Bestellarchiv und QR-Verwaltung

Die [Übersicht](../webapp/components/dashboard/overview-content.tsx) bündelt Kennzahlenkarten, Diagramme und die Tischverwaltung. Das [Bestellarchiv](../webapp/components/dashboard/all-orders-content.tsx) enthält Suche, Filter, Bestelltabelle und Paginierung. Ein Klick auf eine Bestellnummer kopiert diese in die Zwischenablage und bestätigt den Vorgang per Toast.

<a id="ds-region"></a>
## DS-14: Region und Sprache

Der [Webapp-Auswahldialog](../webapp/components/region-language-dialog.tsx) und das [Website-Modal](../website/components/RegionLanguageModal.tsx) ermöglichen die Auswahl von Region und Sprache über Modals mit muttersprachlichen Länderendonymen und Bestätigung.

<a id="ds-15-tailwind-first-authoring"></a>
## DS-15: Tailwind-First-Entwicklung

Die Richtlinien verlangen Tailwind-Utilities für alle Gestaltungsaufgaben: Layout, Abstände, Typografie, Varianten für Viewports und Container, Pseudoklassen und Übergänge. Benutzerdefiniertes CSS ist reserviert für Tokens, Webfonts, Resets, Keyframes und plattformspezifische Randbedingungen.
