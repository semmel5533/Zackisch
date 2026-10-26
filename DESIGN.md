# Zackisch — DESIGN SYSTEM

**Status:** verbindliches Soll-Design · **Version:** 5.0 · **Stand:** 26.10.2026 · **Repository-Pfad:** `/DESIGN.md`

**Geltung:** Marke, öffentliche Website (`root/`), Betreiber- und Gästeoberflächen (`app/`), Personal-Tablet, Hilfe-Center (`support/`), internes Team (`internal/`) und physische QR-Materialien.

> **Single Source of Truth:** Diese Datei legt **ausschließlich Design** fest: Brand Identity, Bildsprache, Typografie, Farben, Abstände, Radien, Responsive-Grundsätze, Informationshierarchie, semantische UI-Komponenten, Oberflächenkomposition, Microinteractions, Mascot, Print-Visuals, UX-Qualität. Sie beschreibt **keine** Datenmodelle, API/Stripe-Verträge, Authentifizierungsimplementierungen, technische Routen, Exportalgorithmen, SemVer oder Deployment-Anleitungen. Die direkt nebenan liegende [`README.md`](./README.md) erklärt das Produkt, die Nutzergruppen, Forschung, Gründerstory, Funktionsinventar und technischen Kontext; projektspezifische README/AGENTS und `docs/` gelten für Implementierungsdetails.
>
> **Neues Erscheinungsbild:** Bisherige UI-Stile und Layouts im Repository gelten nicht als Designvorlage. **Combination Mark (aus der gelieferten Wortmarken-Referenz vektorisiert) und unveränderte offizielle Brand Mark bleiben verbindlich.** UI-Schrift ist Inter; der Edding-Stil ist ein begrenztes Markenelement.
>
> **Sprache:** Der Oberbegriff ist **Lokal** (auch für Bars, Cafés, Imbisse und Bäckereien). Inhalte, Listen und Konfigurationsangebote heißen **Menü**. Ausnahmen nur für wörtliche Originalquellen, technische Altbezeichner oder juristisch notwendige Begriffe.

---

## 01 · Zielgruppen, UX-Prioritäten und Marke

**Markeneigenschaften:** freundlich · locker · einfach · klar · menschlich · modern · schnell · nahbar. Kein Werbeslogan im Designsystem vorgeschrieben.

| Kontext | Situation | UX-Maßstab | Grundton |
|---|---|---|---|
| Gast am Tisch | Spontaner QR-Scan, oft mit einer Hand, wechselndes Licht, ggf. schlechte Verbindung | Ohne Account, einfache Produktauswahl, klare Preise, durchsichtige Zahlung | ruhig, selbsterklärend |
| Abholgast | In Bewegung, kein Tisch, möchte Zeit und Abholstatus verstehen | minimaler Checkout, deutliche Abholidentität/Nummer | praktisch, prägnant |
| Betreiber:in eines Lokals | Wenig Zeit, oft keine IT-Expertise, unterschiedliche digitale Erfahrung | schrittweise Selbst-Einrichtung, verständliche Begriffe, rücknehmbare Änderungen | hilfsbereit, unaufgeregt |
| Service-/Küchenpersonal | Lärm, Zeitdruck, weit entferntes Tablet, Hände beschäftigt | große Aktionen, sofort sichtbarer Status, kein Rätselraten | präzise, robust |
| Support/Team | Große Datenmengen, viele ähnliche Fälle, hohe Verantwortung | filtern, vergleichen, sicher entscheiden, klarer Auditkontext | sachlich, verlässlich |
| Marketing-Besucher | Eigentümer:innen und Betriebsleitende, müssen Nutzen und Hürden schnell erfassen | Geschichte statt Produkt-Screenshot-Wüste, Belege statt Prognosen, eine klare Aktion | seriös, menschlich |

**Leitprinzipien:**
1. **Menschen vor Software.** Zeige Gäste, Gastgeber:innen und nachvollziehbare Aufgaben statt abstrakter Technologie.
2. **Eine Hauptaufgabe pro Sichtbereich.** Sekundäre Funktionen sind auffindbar, konkurrieren aber nicht mit der nächsten sinnvollen Aktion.
3. **Sichtbarer Systemstatus.** Zahlung, Erreichbarkeit, Bestellung, Druck und POS-Erfassung sind textlich eindeutig.
4. **Bestehenden Service respektieren.** QR-Bestellen ist eine zusätzliche Möglichkeit; persönlicher Service bleibt erkennbar.
5. **Weniger Oberfläche, mehr Orientierung.** Keine drei gleichförmigen Karten nur zur Dekoration, kein unmotiviertes Badge-/Icon-Raster.
6. **Zielgruppengerecht statt überall identisch.** Gemeinsame Tokens, aber unterschiedliche Dichte, Navigation und Aktionsgrößen.
7. **Reduziert bedeutet nicht kalt.** Eine sparsame, monochrome UI darf durch Fotos, natürliche Texte und die Katze menschlich wirken.

## 02 · Markenhierarchie und White Label

| Oberfläche | Primäre Identität | Zackisch Combination Mark | Brand Mark / Mascot |
|---|---|---|---|
| Öffentliche Website und eigene Präsentationen | Zackisch | sichtbar an markentypischen Stellen | sparsam |
| Betreiber-Dashboard und Hilfe | Zackisch | in Rahmen-Navigation | Hilfen, einzelne Zustände |
| Internes Team-Dashboard | Zackisch | kleine Navigation | überwiegend nicht erforderlich |
| Gäste-Bestelloberfläche | **Lokalname/-logo** | **nicht im Header, nicht als Hauptlogo** | bei ausgewählten Hilfen/Bestätigungen |
| Physische QR-Karten, Aufsteller, Sticker | neutrales Tisch-/Abholziel | **erlaubt: einmal klein und dezent** | nur optional, sonst vermeiden |
| Gäste-Bestellbestätigung | Lokal als Verkäufer | nicht statt Lokalname | kleine positive Emotion zulässig |

**Combination Mark** = vollständiger Zackisch-Schriftzug als markeneigene Wortmarke. Die freigegebene Referenz ist die bereitgestellte handgezeichnete Wortmarke; das separate Katzenzeichen wird **Brand Mark** genannt. **Brand Mark** = Katzenkopf allein. **Mascot** = expressive Varianten der Brand Mark. Bereitgestelltes bzw. freigegebenes finales SVG verwenden. Keine zusätzlichen Striche, Funken, Sterne, Effektringe oder Unterstreichungen **direkt an der Combination Mark oder Brand Mark**. Abstände der Marke nach Original-Proportionen; Mindestfreiraum ringsum 0,5 × Höhe der Brand Mark als Layoutregel; nicht Teil des SVG modifizieren.

### Original-Assets
- `assets/zackisch/brand/combination_mark.svg`: Vektorexport der gelieferten Zackisch-Wortmarkenreferenz; Originalform bewahren, vor Publikation mit der Masterdatei abgleichen.
- `assets/zackisch/brand/brand_mark.svg`: unveränderte offizielle Zackisch Brand Mark aus der SVG-Quelldatei; auch Favicon/Avatar.
- `assets/zackisch/mascot/*.svg`: finale Mascot-Varianten als einsatzbereite Vektorassets.
- `assets/zackisch/icons/*.svg`: handgezeichnete Doodle-Icons für Website, Produkt, Hilfestates und Marketing.
- `assets/zackisch/font/zackisch.ttf`, `assets/zackisch/font/zackisch.woff2`, `assets/zackisch/font/zackisch.css`: dekorative Zackisch-Display-Schrift und Einbindung.
- Keine generierten Neukonstruktionen des Kernlogos jenseits dieser finalen Export-Assets.
- Dunkle Assets auf hellem Grund bevorzugen. Invertierte Version nur, wenn es ein autorisiertes Logoasset ist und Kontrast stimmt.

## 03 · Farbe: Foundation- und semantische Tokens

### Neutrales Markensystem
| Token | Wert | Primäre Funktion |
|---|---|---|
| `neutral.canvas` | `#FAFAF9` | Standardhintergrund |
| `neutral.white` | `#FFFFFF` | QR-Fläche, UI-Karten, Dialoge, Print |
| `neutral.black` | `#000000` | Markenassets, wichtigste Texte und Icons |
| `neutral.900` | `#333333` | längerer Text |
| `neutral.700` | `#595959` | sekundärer Text mit ausreichend Kontrast |
| `neutral.500` | `#737373` | nur große/dekorative Meta-Information; bei normalem Text Kontrast messen, ggf. `neutral.700` verwenden |
| `neutral.200` | `#E6E6E4` | Linien, Separators, Kartenränder |
| `neutral.100` | `#F3F3F1` | Flächen, Hover, Gruppen |
| `accent.cobalt` | `#315BCD` | ausgewählte Aktionen, Links, Fokus, ausgewählte Grafik |
| `accent.light` | `#B9C9F1` | kleine Hintergrundflächen, nie alleinige Text-/Statusfarbe |

### Semantische Rollen (funktionale Statusfarben, keine Erweiterung der Branding-Palette)
| Token | Designwert | Regel |
|---|---|---|
| `text.primary` | `#000000` | Überschrift, Beträge, Schlüsseldaten |
| `text.body` | `#333333` | Fließtext |
| `text.secondary` | `#595959` | sekundäre Informationen |
| `text.inverse` | `#FFFFFF` | auf Schwarz / geprüftem Cobalt |
| `surface.page` | `#FAFAF9` | normale Seite |
| `surface.card` | `#FFFFFF` | sachliche Arbeitskarte |
| `surface.muted` | `#F3F3F1` | gruppierende Fläche |
| `border.default` | `#E6E6E4` | feine Linien |
| `border.strong` | `#737373` | wichtiger Input-Rahmen |
| `action.primary` | `#000000` | Default-Hauptaktion markeneigener Produktoberflächen |
| `action.secondary` | `#FFFFFF` | Outline-Aktion |
| `action.accent` | `#315BCD` | gezielte aktive/konversionsbezogene Handlung |
| `focus.ring` | `#315BCD` | sichtbarer äußerer Fokusrahmen |
| `status.success.ink` | `#146044` | Erfolgstext, nur mit Wort/Icon |
| `status.success.bg` | `#E8F5EE` | Erfolgsfläche |
| `status.warning.ink` | `#744800` | Warntext |
| `status.warning.bg` | `#FFF5DD` | Warnfläche |
| `status.error.ink` | `#A52828` | Fehltext |
| `status.error.bg` | `#FFF0F0` | Fehlerfläche |
| `status.info.bg` | `#ECF1FF` | Information |

**Farbdisziplin:** ca. 90 % der sichtbaren Marke neutral; Cobalt und Light Blue zusammen ca. 10 %. Ausnahme für kritische Statusflächen: Statuskommunikation ist wichtiger als Markenpurismus. Rot/Grün/Amber **niemals als alleiniger Informationsträger**. Kontrast aller tatsächlichen Kombinationen überprüfen (mindestens WCAG 2.2 AA; Ziel 4,5:1 Fließtext, 3:1 große Schrift, 3:1 wichtige Nichttext-Signale). `#737373` auf sehr hellem Hintergrund nicht ungetestet als kleiner Text verwenden.

**White-Label:** Die Akzentfarbe des Lokals kann `action.accent`, nicht jedoch rechtliche Statussemantik oder Tastaturfokus-Sichtbarkeit überschreiben. Falls Lokalfarben Kontrasttests nicht bestehen, fällt das UI auf sichere Zackisch-Fallbacks zurück. **Black (`#000000`) bleibt für Zackisch-Markenassets unverändert.**

## 03a · Verbindliche CSS-Custom-Properties für Base UI

Die folgenden Werte sind die **Source of Truth für neue UI-Tokens**; in allen vier Projekten werden sie aus einem gemeinsamen Design-Contract übernommen. Tokenwerte in Einzelkomponenten nicht frei überschreiben. Semantische Rollen sind bewusst von Rohwerten getrennt. Dark Mode ist **nicht** automatisch freigegeben; keine ungetestete Invertierung der Marken-/Gastoberfläche.

```css
:root {
  --zk-font-ui: "Inter", system-ui, sans-serif;
  --zk-font-doodle: "Zackisch", cursive;

  --zk-white: #ffffff;
  --zk-black: #000000;
  --zk-neutral-900: #333333;
  --zk-neutral-700: #595959;
  --zk-neutral-500: #737373;
  --zk-neutral-200: #e6e6e4;
  --zk-neutral-100: #f3f3f1;
  --zk-off-white: #fafaf9;
  --zk-cobalt: #315bcd;
  --zk-light-blue: #b9c9f1;

  --zk-page: var(--zk-off-white);
  --zk-surface: var(--zk-white);
  --zk-surface-muted: var(--zk-neutral-100);
  --zk-text: var(--zk-black);
  --zk-text-body: var(--zk-neutral-900);
  --zk-text-secondary: var(--zk-neutral-700);
  --zk-border: var(--zk-neutral-200);
  --zk-border-strong: var(--zk-neutral-500);
  --zk-action: var(--zk-black);
  --zk-action-fg: var(--zk-white);
  --zk-link: var(--zk-cobalt);
  --zk-focus: var(--zk-cobalt);
  --zk-success-text: #146044;
  --zk-success-bg: #e8f5ee;
  --zk-warning-text: #744800;
  --zk-warning-bg: #fff5dd;
  --zk-error-text: #a52828;
  --zk-error-bg: #fff0f0;
  --zk-info-bg: #ecf1ff;

  --zk-space-0: 0px;
  --zk-space-1: 4px;
  --zk-space-2: 8px;
  --zk-space-3: 12px;
  --zk-space-4: 16px;
  --zk-space-5: 20px;
  --zk-space-6: 24px;
  --zk-space-8: 32px;
  --zk-space-10: 40px;
  --zk-space-12: 48px;
  --zk-space-16: 64px;
  --zk-space-20: 80px;
  --zk-space-24: 96px;
  --zk-space-32: 128px;

  --zk-radius-xs: 4px;
  --zk-radius-sm: 8px;
  --zk-radius-md: 12px;
  --zk-radius-lg: 16px;
  --zk-radius-xl: 20px;
  --zk-radius-2xl: 24px;
  --zk-radius-pill: 9999px;

  --zk-control-sm: 40px;
  --zk-control-md: 48px;
  --zk-control-lg: 56px;
  --zk-touch-min: 44px;
  --zk-stroke-ui: 2px;
  --zk-duration-fast: 120ms;
  --zk-duration-standard: 180ms;
  --zk-duration-slow: 280ms;
  --zk-ease: cubic-bezier(.2,.8,.2,1);
  --zk-shadow-dialog: 0 16px 50px rgba(0,0,0,.10);
}
```

**Schriftrollen, die Komponenten tatsächlich verwenden:** `display.hero` 72/44px 700; `display.section` 52/36px 700; `heading.h1` 32/28px 700; `heading.h2` 26/24px 700; `heading.h3` 22/20px 600; `heading.h4` 18px 600; `body.md` 16px 400; `label.md` 14px 600; `button.md` 16px 600. Die vollständige Tabelle im folgenden Abschnitt ist normativ. Doodle-Font nur handschriftliches Akzent-Lettering, niemals Functional UI.

**Base-UI-Anbindung:** `@base-ui/react` liefert ungestylte, zugängliche Interaktion und den Zustandsvertrag. Die Zackisch-Wrapper definieren deren Appearance über diese Tokens, sichtbare Fokusführung und Component-States. Komponenten verwenden die dokumentierten Base-UI-State-Attribute (`[data-open]`, `[data-checked]`, `[data-disabled]`, `[data-invalid]` soweit für das konkrete Primitive vorgesehen) statt CSS-Klassen eines Fremd-Themes. Immer die API der installierten Base-UI-Version prüfen. Keine Radix-, Shadcn-, Astryx- oder fertigen Hallmark-Themes als zweite Komponentenbibliothek installieren.

**Anwendungsbeispiele der Tokenrolle:** Haupt-Button 48px hoch (`--zk-control-md`), Radius 12px (`--zk-radius-md`), Padding 16–24px, Schwarz mit weißer Schrift; Primary im Gast-/Personal-Kontext mit 56px Höhe. Eingaben 48px / 12px Radius, Default-Rahmen 1px `--zk-border-strong`, Fokus mindestens 2px `--zk-focus` mit ausreichendem Abstand. Dialog-Fläche Weiß, Radius 24px, Padding 24px, genau ein dominanter Primary-Action-Button. Card 16px Radius; flache Border statt generischer Dauerschatten. Tooltip ersetzt nie das sichtbare Formularlabel.

## 04 · Typografie: ausschließlich Inter für UI und Lesetexte

**Fonts:** Inter, Fallback `system-ui, sans-serif`; Zahlen und Preise `font-variant-numeric: tabular-nums`. Zusätzlich gibt es die dekorative Display-Schrift **Zackisch** (`assets/zackisch/font/zackisch.ttf`, `assets/zackisch/font/zackisch.woff2`) für kurze Headlines, Labels, Sticker, Kampagnenwörter und ausgewählte Website-Akzente. **Zackisch nie für Fließtext, Formulare, Preise, kritische UI-Texte oder längere Navigation einsetzen.**

### Verbindliche Type-Styles (px; Desktop / Mobile wenn abweichend)
| Stil | Größe | Line Height | Weight | Farbe | Einsatz |
|---|---:|---:|---:|---|---|
| `display.hero` | 72 / 44 | 1.05 | 700 | primary | einmaliger Marketing-Hero |
| `display.section` | 52 / 36 | 1.10 | 700 | primary | große Story-Abschnitte |
| `heading.h1` | 32 / 28 | 1.20 | 700 | primary | Produkt-Seitentitel |
| `heading.h2` | 26 / 24 | 1.25 | 700 | primary | Hauptbereich |
| `heading.h3` | 22 / 20 | 1.30 | 600 | primary | Karten-/Bereichstitel |
| `heading.h4` | 18 | 1.35 | 600 | primary | kleinere Titel, Artikelname |
| `body.lg` | 18 | 1.55 | 400 | body | Marketing-Einleitung, größere Hinweise |
| `body.md` | 16 | 1.50 | 400 | body | Standardtext, Formulare, Gäste-Menü |
| `body.sm` | 14 | 1.45 | 400 | body | Zusatzinformationen, Hilfetexte |
| `label.md` | 14 | 1.35 | 600 | primary | Feldlabel, Filter |
| `label.sm` | 12 | 1.30 | 600 | secondary | nur kurze Metadaten, kein erforderlicher Fließtext |
| `button.md` | 16 | 1.25 | 600 | nach Variante | Buttons |
| `button.sm` | 14 | 1.25 | 600 | nach Variante | sekundäre Desktop-Aktionen |
| `number.money` | 20 | 1.25 | 700 | primary | Preise, Beträge |
| `number.kpi` | 36 / 30 | 1.15 | 700 | primary | KPI/Bestellnummer |
| `status.critical` | 18 | 1.35 | 700 | primary | Bestell-/Zahlungsstatus |

**Keine ungeprüften Zwischengewichte simulieren:** Es gelten ausschließlich die oben aufgelisteten Inter-Gewichte (400, 600, 700). Keine `text-xs` für Hauptaktionen, Zahlungsinfos, Allergene, Preise oder rechtliche Pflichttexte. Gast-UI mindestens 16px für produktive Texte; Eingabefelder mindestens 16px zur Vermeidung von iOS-Zoom beim Fokus. Schrift darf bei 200 % Zoom und 320px Breite nicht abgeschnitten werden; Line-Height nicht fest in px schneiden.

**Marketing-Lesebreite:** Textspalte 58–70 Zeichen, große Überschrift visuell ~10–14 Zeichen pro Zeile bei sehr großen Fonts; keine erzwungenen Zeilenumbrüche in Übersetzungen. **Tabellen und Geld** rechtsbündig und tabellarisch.

## 05 · Spacing und Rhythmus

**4px-Grundraster:** `space.0=0`, `.1=4`, `.2=8`, `.3=12`, `.4=16`, `.5=20`, `.6=24`, `.8=32`, `.10=40`, `.12=48`, `.16=64`, `.20=80`, `.24=96`, `.32=128` (alle px). Kein freies `margin: 17px` ohne expliziten Grund.

| Anwendungsfall | Vertikal | Horizontal |
|---|---:|---:|
| Icon ↔ Label | 8 | 8 |
| Label ↔ Input | 8 | – |
| Feld ↔ Hilfetext/Fehler | 4–8 | – |
| Zwischen Formularfeldern | 20–24 | – |
| Button-Gruppe | 8–12 | 8–12 |
| Karte intern mobil | 16 | 16 |
| Karte intern desktop | 24 | 24 |
| Karten im Raster | 16–24 | 16–24 |
| Inhaltsblock ↔ Inhaltsblock | 32–48 | – |
| Dashboard-Sektion ↔ Sektion | 48–64 | – |
| Marketing-Sektion mobil | 64–80 | 20 |
| Marketing-Sektion desktop | 96–128 | 24–48 |

**Vertikale Hierarchie:** Die Abstände zwischen Blöcken sind stets größer als innerhalb. Einzelne Formulare in langen Reihen ohne Trennung vermeiden; Gruppen erst bei semantischer Zusammengehörigkeit bilden. Kein unmotivierter vertikaler Leerraum in Personalansicht.

## 06 · Layoutsysteme, Breiten und Responsive

| Kontext | Breiten-/Layout-Regel |
|---|---|
| Marketing | max-width 1280px; großer Hero darf visuell bis 1440px; horizontal mobile 20px, tablet 32px, desktop 48px |
| Gäste-App | max. 640px Lesespalte auf Desktop; mobil volle Breite mit 16px Rand; Produkte immer lesbar in einer Spalte, ab ≥480 optional dichtere Bilder/Zeilen |
| Checkout Gäste | max. 560px; immer lineares Schrittmodell; keine zweispaltige Checkout-Pflichtstrecke |
| Betreiber-Dashboard | Shell 240px Seitenleiste ≥1200px; 80px kompakt bei Bedarf 900–1199px; unter 900px Drawer-Navigation |
| Dashboard-Inhalt | max. 1440px; 24–32px Rand desktop, 16px mobil; Tabellen horizontal nur bei echtem Datenbedarf |
| Personal-Tablet | Full-Viewport; sichtbare Echtzeit-Queue, 1–3 Spalten abhängig von Tabletbreite; 24px Rand im landscape |
| Support-Artikel | Lesespalte 760px; Seitentoc nur ab 1100px; keine drei Textspalten |
| Team-Dashboard | hohe Informationsdichte, aber Tabellen lesbar: Minimum 44px Zeilenhöhe, Daten in vorhandener Breite vergleichbar |

**Responsive Orientierung:** 320–599 `compact`, 600–899 `medium`, 900–1199 `wide`, ≥1200 `expanded`. Diese Werte sind Layout-Entscheidungen, keine Gerätemodelle. Bei langem Inhalt robust umbrechen. Kein horizontales Dokument-Scrolling. Mobile Bottom-Bar nur für **dauerhafte** Navigation mit maximal 3–4 Einträgen; nie doppelt mit identischer Kopf-/Sidebar-Navigation.

**Sticky:** Gast-Warenkorb-/Checkout-CTA darf unten haften, darf aber keine Eingaben verdecken und berücksichtigt `env(safe-area-inset-bottom)`. In Mitarbeiter-Tablet sichtbare Status-/Aktionsleiste. Keine globale Sticky-Marketing-Navigation; Header scrollt normal mit.

## 07 · Radius, Konturen, Schatten, Layer

| Token | px | Einsatz |
|---|---:|---|
| `radius.xs` | 4 | kleine visuelle Tags, Codeflächen |
| `radius.sm` | 8 | kleine Chips, kleine Badges |
| `radius.md` | 12 | **Inputs und Buttons** |
| `radius.lg` | 16 | **Standard-Card**, Menu-Item-Detail |
| `radius.xl` | 20 | größere Medienkacheln |
| `radius.2xl` | 24 | Dialog/Sheet-Content |
| `radius.pill` | 9999 | echte Pills, nur Chips und Filter |

**Rahmen:** 1px `border.default`, interaktiv fokussiert 2px sichtbarer äußerer Focus-Ring + 2px Offset. **Shadows:** Standard keiner; schwebende Popovers weicher geringer Shadow `0 8px 24px rgba(0,0,0,.08)`, Modal `0 20px 56px rgba(0,0,0,.14)`; keine schwebenden Karten überall, keine Glassmorphism-Dauerlösung. **Layering:** Document → sticky CTA → popover/tooltip → overlay → dialog → transient nonblocking notice; zentral verwalten und testen. Hinter Dialog inert, Fokus darin gehalten und danach zurückgeführt.

## 08 · Interaktionszustände und Motion

### Einheitliche Zustände
`default`, `hover` (wenn Pointer), `active/pressed`, `focus-visible`, `selected/checked`, `disabled`, `loading`, `success`, `error`; zusätzlich für Formulare `invalid`, `readonly`, `required` und für asynchrone Bereiche `empty`, `offline`, `stale`, `retrying`.

- Hover **nur** subtile Farbänderung; keine springenden Buttons.
- Active optional `scale(.99)` max. 100ms; fokussiert immer sichtbarer Ring.
- Disabled: visuell reduziert, aber erklärbar; Gründe bei geschäftskritischen Aktionen **als Text** nebenan.
- Loading: Buttontext bleibt erkennbar oder wird zu „Wird gespeichert…“, feste Breite; mehrfaches Abschicken blockieren.
- Skeleton nur wenn Layoutstruktur bekannt; für kurzlebige Operationen eher Progress-Indikator, niemals Infinite-Spinner ohne Abbruch/Retry bei Fehlern.
- Reduced Motion: alle Informationen statisch zugänglich, scrollgebundene Effekte entfernt, UI-Feedback bleibt verständlich.

### Motion-Tokens
| Token | Dauer | Anwendung |
|---|---:|---|
| `motion.fast` | 100–140ms | Press/hover |
| `motion.default` | 180–220ms | Popover, kleine Panels |
| `motion.dialog` | 220–280ms | Dialog/Sheet |
| `motion.story` | scrollabhängig, **nicht zeitkritisch** | einziger zentraler Produkt-Erklärmoment der Website |

Easing funktional `cubic-bezier(.2,.8,.2,1)`; Verabschiedung kürzer als Eintritt. Animation erklärt Raum/Status, nie entscheidende Daten allein. **Kein Scroll-Jacking, kein verpflichtendes Pinning, kein fliegender QR-Code als Funktionshindernis.** Für Storytelling Transform und Opacity bevorzugen; pro Viewport in der Regel höchstens eine nennenswerte Bewegung gleichzeitig. Feste Menüs und Checkout bewusst ruhig lassen.

## 09 · Bildsprache, Medien und Authentizität

- Menschen in **echten** Gastronomie-Umgebungen: Gäste, Service, Bar, kleine Cafés, Imbiss, Tischservice, Abholung. Divers ohne künstliche Inszenierung.
- Website-Bilder: warm, natürlich, leichte lebendige Farbigkeit. **Keine KI-generierten Fotos/Videos als reale Referenz.** Rechte/Quelle/Personenfreigabe dokumentieren.
- Hero: echtes menschliches Erlebnis + beiläufig sichtbarer QR-Touchpoint; nicht nur schwebende Geräte.
- Produktfotos: Speise klar erkennbar, appetitlich, realistisches Licht; standardmäßig **4:3**, auf Produktdetail optional 1:1. Keinen generischen Burger-Platzhalter, wenn echte Bilder fehlen: neutrale Kategorie-Motivfläche.
- Lokalbanner: **16:7** breites Querformat oder 16:9 als sichere Aufnahme; informative zentrale Safe Zone. Darf den Lokalnamen **nicht** ersetzen. Wenn kein Banner: neutrale Fläche, keine unpassende Stockaufnahme.
- Lokallogo: eigene freigegebene Datei, zentriert in einem max. ca. 120×72px Container, `object-fit:contain`; transparenter Hintergrund zulässig. Fehlt es: Lokalname in Inter Bold.
- Help-Center: echte aktuelle Screenshots; beschneiden und markieren, damit Schritte nachvollziehbar sind. Keine Mockups als angebliche reale Ansichten.
- Video nur, wenn ein Ablauf durch Bewegtbild besser verständlich wird: 30–90s mit Untertiteln/Transkript, Pausieren, Posterbild, keine Autoplay-Audio. In Marketing kann ein sehr kurzes stummes Loop eine reale Szene veranschaulichen – nie statt Text oder Handlung.
- Print-QR: Schwarz auf reinem Weiß; keine Fotohintergründe unter dem Code.

## 10 · Icon-System

**Zwei bewusst getrennte Stile:**
1. **Funktionale UI-Icons:** schlichtes, konsistentes 24px-/20px-Vektor-Set; feste 2px-Stroke, klare Standard-Symbole. Hier gewinnt Erkennbarkeit vor Unperfektion. Semantische Icons niemals ohne Text als einziges Signal bei wichtigen Aktionen.
2. **Marker-Illustrationsicons:** ausschließlich Marketing, leere Zustände, QR-Deko außerhalb Scanzone, Hilfegrafiken; handgezeichnet, asymmetrisch, leicht schwankende Strichbreite 2.5–3.5px auf 48px Raster. Nicht wie kaputte SVG-Icons wirken; bewusst gestaltete Original-Assets, nicht zufällige Linienverzerrung.

**QR-Grafik ist kein Illustration-Icon:** Der wirklich zu scannende Code besteht aus unberührter, technisch korrekter Matrix. **Keine** Katzenköpfe im Code, verzerrte Module, invertierten Farben, dekorativen Aussparungen oder Effekte innerhalb der Quiet Zone.



## 10a · Asset bundle und verbindliche Namen

**Dateinamenskonvention:** nur englisch, nur lowercase, Wörter mit `_` bzw. `-` wie im Bundle vorgegeben.

**Brand:**
- `assets/zackisch/brand/combination_mark.svg`
- `assets/zackisch/brand/brand_mark.svg`

**Mascot-Set (Auswahl der wichtigsten finalen Assets):**
- `assets/zackisch/mascot/mascot_curious_welcome.svg`
- `assets/zackisch/mascot/mascot_happy.svg`
- `assets/zackisch/mascot/mascot_wink.svg`
- `assets/zackisch/mascot/mascot_focused.svg`
- `assets/zackisch/mascot/mascot_thinking.svg`
- `assets/zackisch/mascot/mascot_sleeping.svg`
- `assets/zackisch/mascot/mascot_excited.svg`
- `assets/zackisch/mascot/mascot_celebrating.svg`
- `assets/zackisch/mascot/mascot_peeking.svg`
- `assets/zackisch/mascot/mascot_helpful_guide.svg`
- `assets/zackisch/mascot/mascot_scan_qr.svg`
- `assets/zackisch/mascot/mascot_payment_success.svg`
- `assets/zackisch/mascot/mascot_order_received.svg`
- `assets/zackisch/mascot/mascot_order_ready.svg`
- `assets/zackisch/mascot/mascot_empty_state.svg`
- `assets/zackisch/mascot/mascot_error_404.svg`
- `assets/zackisch/mascot/mascot_offline_pause.svg`
- `assets/zackisch/mascot/mascot_support_listening.svg`

**Doodle-Icons (Kernset):** `assets/zackisch/icons/icon_menu.svg`, `assets/zackisch/icons/icon_cart.svg`, `assets/zackisch/icons/icon_qr_code.svg`, `assets/zackisch/icons/icon_smartphone.svg`, `assets/zackisch/icons/icon_print_qr.svg`, `assets/zackisch/icons/icon_table_number.svg`, `assets/zackisch/icons/icon_receipt.svg`, `assets/zackisch/icons/icon_card_payment.svg`, `assets/zackisch/icons/icon_add.svg`, `assets/zackisch/icons/icon_confirm.svg`, `assets/zackisch/icons/icon_close.svg`, `assets/zackisch/icons/icon_search.svg`, `assets/zackisch/icons/icon_filters.svg`, `assets/zackisch/icons/icon_settings.svg` und weitere Dateien aus `assets/zackisch/icons/`.

**Display-Font:**
- `assets/zackisch/font/zackisch.ttf`
- `assets/zackisch/font/zackisch.woff2`
- `assets/zackisch/font/zackisch.css`

**Typeface / Font:** `assets/zackisch/font/zackisch.ttf` (eigenständige aus Handlettering-Referenzen entstandene Prototyp-Glyphen, inkl. äöü/ÄÖÜ/ß), `assets/zackisch/font/zackisch.woff2` (Browser), `assets/zackisch/font/zackisch.css` (Einbindung). die gesonderte Übergabevorschau `previews/zackisch_font_exported.png` zeigt eine Darstellung aus der echten Font-Datei. Die dynamische Schrift ist ein **Display-Prototyp** (Kernzeichen/Umlaute im tatsächlichen Font-Render prüfen, Kerning ist nicht final) und **nicht** das offizielle Logo: `assets/zackisch/brand/combination_mark.svg` bleibt bei Logoeinsatz unverändert.


**Einsatzlogik:** Inter bleibt UI-Standard. Zackisch ist ein illustratives Brand-Tool. Die Mascot-Dateien sind in `DESIGN.md` semantisch verortet; die exakten Produkt-/Projektkontexte stehen in `README.md`.

## 11 · Mascot-System und präzise Placement Map

| Emotion / Variante | Wo sinnvoll | Größe (visuell) | Wann nicht |
|---|---|---:|---|
| **Neugierig** (offene Augen) | erste optionale Einführung; Tipps zur Menü; Produkt-Tour | 48–72px | dauerhaft im Navigationsheader |
| **Fröhlich** (lächelnd) | tatsächlich bestätigte, nichtkritische Erfolgsmomente | 56–96px | Zahlung solange nur `processing` |
| **Zwinkernd** | kleine optionale UX-Hilfen, kleine Marketing-Lockerheit | 32–48px | rechtliche Hinweise, notwendige Validierung |
| **Fokussiert** | neutrale Begleitung von Arbeitsschritten im Onboarding | 40–64px | als Icon für Pflichtstatus/Zahlungszustand |
| **Schläfrig/Ruhig** | leerer, **unbedenklicher** Arbeitszustand („noch keine Artikel“) | 64–96px | Systemausfall, Bestellung verloren, Geräte offline |
| **Überrascht** | wenige kuratierte, positive Produktmomente | 48–64px | Fehlermeldung oder unerwartete Gebühren |
| **Feiernd/Sternaugen** | Einrichtung nach vollständig geprüftem Abschluss, neutrale Gast-Bestätigung **nach verifizierter Zahlung** | 64–112px | künstliche Success-Pages vor Backendbestätigung |
| **Peeking / über Kante** | sanfter Empty State oder QR-Aufsteller **außerhalb des Codes** optional | 36–64px | neben jedem CTA, in jedem Produktbild |
| **Keine Katze** | Preisaufschlüsselung, Stripe-Finanzdaten, Fehler/Inkonsistenz, Allergene, Datenschutz, Support-Audit, Beschwerden | – | – |

**Verbindlich:** max. **eine** sichtbare Mascot-Darstellung pro Produktzustand / Hauptbereich. Katze nie Ersatz für Text, Statusicon, Buttonlabel oder Lokallogo. Originale Silhouette bleibt; Emotionen durch Augen/Mimik/Pose; keine Glow-Striche am Logo, keine permanenten Wackelanimationen, niemals autoanimierte Mascot beim kritischen Tippen/Zahlen. Bildbeschreibung bei dekorativem Mascot `alt=""`, bei informativem Bild eine sinnvolle knappe Beschreibung; **nicht** dieselbe Statusmeldung doppelt vorlesen.

## 11a · Mascot-Asset-Mapping pro Situation (Dateiname ist Vertrag)

Die SVG-Dateien sind echte Illustrationen, **keine** Icons für sicherheits- oder zahlungskritische Statusanzeige. Für alle Assets gilt: keine externen Animationen, keine zufälligen Glanz-/Stressstriche an der Marke, keine Farbe allein als Semantik.

| Asset | Empfohlene Stelle | Dosierung / Textpflicht |
|---|---|---|
| `assets/zackisch/mascot/mascot_curious_welcome.svg` | Website: dezenter QR-Einstieg, Onboarding-Welcome | 80–140px; neben echter Überschrift |
| `assets/zackisch/mascot/mascot_happy.svg` | Setup abgeschlossen, sympathisches positives Leermoment | 56–112px; Text benennt Zustand |
| `assets/zackisch/mascot/mascot_wink.svg` | seltene freundliche Microcopy / Produkthinweis | 40–72px, keine kritischen Controls |
| `assets/zackisch/mascot/mascot_focused.svg` | Arbeitsschritt „Wir prüfen …“ / Setup-Fortschritt | 48–80px; echte Progress-Information zusätzlich |
| `assets/zackisch/mascot/mascot_thinking.svg` | erklärender Hinweis, FAQ-/Hilfesituation | 48–90px |
| `assets/zackisch/mascot/mascot_sleeping.svg` | Leerlauf-/Ruheansicht ohne Aktivitätsdruck | 56–112px; nicht in Checkout-Zahlungswartezeit |
| `assets/zackisch/mascot/mascot_excited.svg` | seltene positive Marke-/Marketingmomente | 64–140px; nicht übernutzen |
| `assets/zackisch/mascot/mascot_celebrating.svg` | erfolgreicher Setup-Meilenstein, freiwillige positive Aktion | 64–112px; nicht als alleinige Bestätigung |
| `assets/zackisch/mascot/mascot_peeking.svg` | freie Fläche an leeren Listen, Showcase-Kante | 64–120px, nicht neben jedem CTA |
| `assets/zackisch/mascot/mascot_helpful_guide.svg` | kurze Schritt-für-Schritt-Hilfe auf Betreiberseiten | 56–96px |
| `assets/zackisch/mascot/mascot_scan_qr.svg` | Website: Funktionsgrafik QR-Einstieg | 100–180px; illustrative QR-Fläche ist **nicht scannbar** |
| `assets/zackisch/mascot/mascot_payment_success.svg` | Gast-Bestätigung **nach verifiziertem Status** | 72–120px; Text und Bestellreferenz bleiben zentral |
| `assets/zackisch/mascot/mascot_order_received.svg` | Gaststatus „Bestellung eingegangen“ | 72–120px; echte Bestellung/Zeit/Daten separat |
| `assets/zackisch/mascot/mascot_order_ready.svg` | Abholstatus „Bereit“ | 72–120px; Abholkennung und klare Handlung |
| `assets/zackisch/mascot/mascot_empty_state.svg` | Keine Ergebnisse in Menü/Support/Listen | 72–128px; Ursache und Alternative erklären |
| `assets/zackisch/mascot/mascot_error_404.svg` | Not Found / 404, aber **nicht** Zahlungsfehler | 96–160px; Navigation zurück erforderlich |
| `assets/zackisch/mascot/mascot_offline_pause.svg` | Verbindung unterbrochen / Pause | 72–112px; Verbindung und Retry klar erklären |
| `assets/zackisch/mascot/mascot_support_listening.svg` | Support-Kontakt oder Help-Onboarding | 72–128px; echter Kontaktlink vorhanden |

**Animierter Mascot:** nur später als freigegebenes separates Animation-Asset; SVG bleibt statisch. Bei `prefers-reduced-motion: reduce` keine kontinuierliche Bewegung. **Höchstens ein** deutlicher Mascot pro Abschnitt, kein Mascot bei Eingabefehlern, Chargebacks oder Sicherheitswarnungen. Auf der Gäste-Oberfläche gilt weiterhin das Lokallogo als primäre Identität.

## 12 · Komponenten: semantische Entscheidungsmatrix

**Grundregel:** Zuerst entscheiden, *was die Information oder Aktion bedeutet*, dann die visuelle Komponente wählen. Vorhandene Screens sind kein Vorbild.

| Bedarf | Komponente | Beispiel | Nicht verwenden |
|---|---|---|---|
| nächste Aktion in einem Ablauf | Primary Button | `Weiter`, `Speichern`, `Zahlungspflichtig bestellen` | Link für Mutation |
| Navigation zu anderem Ziel | Link | `Anleitungen öffnen` | Button für reinen Seitenwechsel |
| Wahl aus 2–4 **gegenseitig ausschließenden** Optionen | Radio Group / Segmented | Tisch/Abholung nur wenn beides für Gast wählbar | Checkbox |
| mehrere unabhängige Optionen | Checkbox Group | Zutaten hinzufügen | Segmented Single Select |
| wenige Optionen aus bekannten Werten | Select | Betriebsregion, Kategorie | freie Texteingabe |
| langer, filterbarer Auswahlkatalog | Combobox | große Artikelliste, interner Ticket-Owner | Native Select mit 200 Einträgen |
| Navigation innerhalb derselben Seite | Tabs | `Aktuell` / `Archiv` | Tabs für mehrstufige Einrichtungs-Formulare |
| progressive Details ohne Seitenwechsel | Disclosure/Accordion | FAQ, optionale Details | Accordion für Pflichtinformationen im Checkout |
| kurzer, nichtkritischer Ereignis-Hinweis | Toast | `Änderung gespeichert` | Zahlung fehlgeschlagen, Formularfehler |
| persistentes Problem auf der Seite | Inline Callout / Notice | `Zahlungskonto muss geprüft werden` | automatisch verschwindender Toast |
| invalides Feld | Field Error | `Gib eine gültige E-Mail-Adresse ein` | globaler Toast |
| mehrere Formularfehler | Error Summary + Inline Errors | Einrichtung/Steuerdaten | nur rote Rahmen |
| destruktiver, schwer rücknehmbarer Vorgang | Alert Dialog | Betrieb dauerhaft löschen | Popover mit „OK“ |
| normale kontextuelle Bearbeitung | Dialog (desktop), Sheet (mobil) | Produktdetails/Extras | Alert Dialog für triviale Auswahl |
| kurzes Kontextmenü | Menu | `Umbenennen / Duplizieren / Löschen` | Navigation als Dropdown-Menü bei drei Seiten |
| mehrere fokussierte Informationen zu einem Datensatz | Side Panel | Bestelldetails desktop | Modal für dauerhaftes paralleles Prüfen |
| umfangreiche Datenvergleiche | Table/Data Grid | Auftragsliste, Gebühren, Audit | 100 einzelne Cards |
| wiederholte kleine Auswahl-/Filteroptionen | Chips | Kategorie-/Statusfilter | Pill-Badge als fake Button |
| Status abbilden | Status Badge **mit Text** | `Bezahlt`, `In Bearbeitung` | Farbe oder Mascot allein |
| endgültiger Abschluss eines linearen Ablaufs | Confirmation Screen | Account, QR-Ausdruck vorbereitet, Zahlung bestätigt | kurzer Toast als einzige Bestätigung |
| Erfolg mit aktionsrelevanten Daten | Summary/Receipt View | Gast-Bestell-/Zahlungsbestätigung | Gratulations-Popup ohne Daten |
| Datei auswählen | File Input/Uploader | Artikelfoto, Lokallogo | freie URL für normale Nutzer |
| Menge ändern | Stepper + validierte Eingabe | Anzahl eines Artikels | Slider |
| Fortschritt anzeigen | Progress/Stepper | mehrstufige Einrichtung | unendlicher Ladebalken ohne Status |
| externe Zahlungsdetails | Trusted Provider Embed | Stripe Onboarding/Zahlung | frei nachempfundenes Checkout-Formular |

### Komponenten-Anatomie (verbindliche Maße)
| Komponente | Maße | Radius | Weitere Regeln |
|---|---|---|---|
| Button groß | min. 56px hoch (Gast-Primary, Personal) | 12px | seitliches Padding 24px, Icon 20px |
| Button normal | 48px hoch | 12px | Padding 20px |
| Button klein | 40px hoch (nur Desktop-Sekundär) | 10px | Padding 16px |
| Icon Button | **mind. 44×44px**; Personal 56×56 | 12px | Tooltip + accessible name |
| Text Input | 48px hoch; Gast 52px | 12px | Border 1px, x-Padding 16px |
| Textarea | min. 120px | 12px | vertikales Resize erlauben |
| Select / Combobox Trigger | 48–52px | 12px | lange Werte nicht abschneiden ohne Anzeige |
| Checkbox / Radio | visuelle Form 20–24px, Target ≥44px | nach Typ | gesamtes Label klickbar |
| Segmented | 44–48px pro Option | 12px Außenform | klare aktive Fläche, nicht nur Farbe |
| Tabs | min. 44px hohe Ziele | keine Card nötig | aktive Linie/Fläche, keyboard pattern |
| Toast | 320–420px max, mobil Full minus 16px Rand | 12px | 16px Padding, max 2 Zeilen Kerntext |
| Inline Notice | volle relevante Inhaltsbreite | 12px | 16px Padding, erklärende Aktion/Link |
| Card | variabel | 16px | 16–24px Padding, meist Border statt Shadow |
| Dialog | bis 560px, komplex bis 720px | 24px | Header/Body/Footer, max 90vh scrollfähig |
| Mobile Sheet | 100vw, max 90dvh | 24px oben | Handle optional, sichere Close/Back-Aktion |
| Popover | 240–360px, um Inhalt | 12px | Position/Fokus testen, nicht Modal-Ersatz |
| Dropdown Menu | 200–320px | 12px | Items ≥40px hoch |
| Table Row | 48px; interne dichte Liste min. 44px | – | sortierbare Spaltenlabels; kein horizontales Chaos |
| Badge | Höhe 24–28px | 8px | lesbarer Status-Text, keine Buttons |
| Tooltip | max. 280px | 8px | 12–14px Text, niemals notwendige einzige Info |
| Empty State | freie Fläche ≥240px | – | kurze Überschrift, Erklärung, nächste Handlung |

### Toast-Spezifikation
- Position: Betreiber/Team/Desktop **rechts unten** mit 24px Abstand; Gast mobil **oberhalb** einer festen Bottom-Action (sonst oben), nicht über Tastatur/Checkout. Safe area respektieren.
- **Success**: kurze 3–5 Sekunden; **Info**: 5–7 Sekunden; auto-dismiss pausen bei Hover/Fokus, manuelles Schließen. Nichtkritische Meldungen höflich über `role=status`/polite ankündigen.
- **Nicht auto-dismiss** bei notwendiger Handlung: statt Toast persistenten Inline-Hinweis. Kein Toast-Stack aus fünf parallelen Meldungen; Events sinnvoll zusammenfassen.
- Bei Optimistic Save nur Erfolg melden, wenn Persistierung bestätigt. Fehler mit konkreter Retry-Aktion im relevanten Kontext. Kein Mascot innerhalb Toast.

### Dialog/Alert-Dialog/Sheet
- Dialog bei kurz bearbeitbarer fokussierter Aufgabe (z. B. eine Speise schnell bearbeiten); komplexe Menükonfiguration hat **eigene Seite / Side Workspace** mit Zustandserhalt.
- Alert Dialog nur bei Verlust/irreversibler Wirkung. Konsequenz konkret nennen, positive/negative Buttons explizit benennen, Escape nur wenn sicher; Fokus passend setzen, Rückkehr zum Trigger.
- Bottom Sheet für Gast-Produktdetails, Warenkorb, kleine Filter; **Checkout selbst als stabile Seite**, nicht in endloser Sheet-Kaskade. Bei Sheet-Schließen ungespeicherte Eingaben schützen.

### Formulare: Feldtypen und Fehler
- Feld-Label **immer sichtbar außerhalb des Feldes**; Placeholder ist Beispiel, kein Ersatz. Required und optional nur dort kennzeichnen, wo nötig.
- Telefonnummer mit `type=tel`, E-Mail mit `type=email`, Geld nicht als frei formatierter String ohne Vorzeichen-/Rundungsprüfung. Decimal-Eingabe mobil mit sinnvoller Tastatur, Währung sichtbar.
- Feldhinweis direkt unter Label oder Feld, Fehlermeldung direkt am Feld + Fehlerübersicht bei mehrschrittigen/längeren Formularen. Nach fehlerhaftem Absenden Fokus zur Fehlerübersicht und Links zum fehlerhaften Feld.
- Validierung beim Submit; bei verlassenem Feld nur unaufdringliche Formatprüfung, keine roten Fehlermeldungen während aktiver Eingabe. Fehler klar umsetzbar formulieren.
- Maximal eine primäre Aktion pro Formular; klare `Abbrechen`-Navigation. Langer Assistent speichert Fortschritt nur, wenn Backend das garantiert; sonst ehrlich vor Verlust warnen.
- Formularblöcke gruppieren, Schritte nach Aufgabe statt Datenbanktabellen. Beispiel: **Betrieb → Menü → Zahlung → QR & Personal → Test → Start**; Reihenfolge von tatsächlichen Freigaben abhängig, visuell nachvollziehbar.

## 13 · Spezialkomponenten: Gäste-App

| Komponente | Einsatz und Platzierung | Sichtbare Pflichtinformationen |
|---|---|---|
| LokalHeader | Oben; Lokallogo/-name, ggf. Banner, Kontext Tisch/Abholung | Lokal als Verkäufer erkennbar; nicht Zackisch-Logo |
| MenuCategoryNav | unter Lokalheader, horizontal scrollbare **echte** Kategorien | klare aktive Kategorie, überspringbare Navigation |
| MenuItemRow | Standard: Bild 88–112px (wenn vorhanden), Titel, kurzer Text, Preis, klare Add-Aktion | verfügbar/nicht verfügbar, notwendige Allergene erreichbar |
| MenuItemDetail | mobile Sheet oder stabile Detailseite bei sehr vielen Optionen | Produkt, Preis, Eigenschaften, Optionen, Gesamtpreis |
| CustomizationStep | nacheinander oder scrollbarer Bereich, Radio für genau eine, Checkbox für mehrere Optionen | Pflichtwahl, Mehrpreis je Option, Zusammenfassung |
| QuantityStepper | im Detail und Cart; Buttons 44px | Wert, Grenzen, Preisaktualisierung |
| CartSummary | sticky Gast-Aktion, erst wenn Warenkorb >0 | Menge, Gesamtbetrag, `Warenkorb ansehen` |
| CheckoutSummary | **vor** verpflichtender Zahlung als prüfbare Zusammenfassung | Lokal, Tisch/Abholung, Einzelpositionen, Trinkgeld, Gesamt, klare Zahlungsart |
| TipSelector | freiwillig und ohne Dark Patterns | **0** als unvoreingestellter/sicherer Default, freie Wahl, Gesamtänderung |
| Recommendation | max. 1–2 sachlich passende Ergänzungen, nach Auswahl vor finalem Checkout | Preis, Begründung nicht überbehaupten, leicht überspringbar |
| OrderStatus | separate ruhige Ansicht | tatsächlicher bezahlter / ausstehender / fehlgeschlagener Status; Bestellnummer |
| GuestConfirmation | **erst nach gesicherter Serverbestätigung** | Bestell- und Zahlungsbestätigung (kein automatisch angenommener Kassenbeleg), Lokal, Positionen, Zeit, Betrag, Download/Status |

**Gast-Informationsfluss:** Lokal & Menü → Artikel/Optionen → Warenkorb → kompakte Kontrolle & Trinkgeld → rechtlich korrekte zahlungspflichtige Aktion / Provider-Checkout → überprüfter Status → Bestätigung/Tracking. Keine Pflichtregistrierung. **Persönlichen Service nicht im Bestellfrontend als nutzlose Fake-Funktion versprechen**; in QR-Druckhinweis erklären.

## 14 · Betreiber-Dashboard: Aufgaben statt Menülawine

### Soll-Navigation
1. **Übersicht** — Betriebsstatus, Startklar-Status, heutige Aufträge, priorisierte To-dos.
2. **Bestellungen** — `Aktuell`, `Verlauf`, Filter, Kassenabgleich; gespeicherte Ansicht für offene POS-Erfassungen.
3. **Menü** — Kategorien/Artikel als Liste + rechter Detailworkspace; Optionsgruppen mit klaren Regeln; Medien, Allergene und Verfügbarkeit.
4. **QR & Tische** — Tischverwaltung, Druckvorlagen, A4 4-up, Duplex, Scan-Test, Abholung.
5. **Zahlungen** — Stripe-Verbindungsstatus, Auszahlungen/Gebühren, Erstattungsstatus, Verweise zum Provider.
6. **Betrieb** — Lokallogo, Banner, Kontaktdaten, Tisch-/Abholmodus, Öffnungs-/Pausenstatus, Einstellungen.
7. **Hilfe** — kontextuelle Links statt separate Einstellungsseite für jedes Problem.

**Onboarding** als Aufgabe auf Übersichtsseite (nach Aktivierung als „Einrichtung anzeigen“ erreichbar): Ein klarer Schritt zur Zeit mit eigenem Titel, Status, Grund und nächster Aktion. Keine 8 irrelevanten Marketingkarten. Optionales kann auf später verschoben werden; erforderliche Voraussetzungen dürfen nie als erfüllt simuliert werden.

**Menüs:** desktop Category List + Item List + Inspector (bei sehr großen Inhalten eine separate Detailansicht). Mobil gestapelt mit Back-Navigation, nicht drei nebeneinander gestauchte Spalten. Drag-and-drop nur optional **mit Tastatur-Buttons Hoch/Runter als Alternative**. Produkt-Foto-Upload mit Crop-Vorschau, Fehler/Dateigröße, `Entfernen` als sekundärer Text-Button.

## 15 · Personal-Tablet und Betriebszustand

- Vollbild-ähnliche Arbeitsoberfläche, hohe Kontraste, 56px Hauptaktionen, 18–22px Hauptinformationen, Order-ID und Tisch/Abholung unverwechselbar.
- Kanbanähnliche Spalten nur wenn auf Gerät und Arbeitsablauf erkennbar; sonst priorisierte Liste `Neu` → `In Bearbeitung` → `Bereit` → `Erledigt`, klare Anzahl je Gruppe.
- Ticket zeigt: **bereits bezahlt**, Bestellnummer, Zeitpunkt, Tisch/Abholung, Produkte/Optionen, eventuelle Allergene und notwendige Warnungen.
- `In Kasse erfasst` **separater unabhängiger Status** von Zubereitung; nicht mit „Erledigt“ koppeln. Bei fehlender Erfassung sichtbarer POS-Hinweis; nicht verbergen.
- Offline/Realtime-Störung: feststehendes kritisches Banner mit Zeitpunkt letzter Aktualisierung und klarer Wiederaufnahme; keine grüne Success-Katze bei fehlender Verbindung.
- Akustische Hinweise optional konfigurierbar, nie einzige Benachrichtigung. Scroll-Position bei Aktualisierungen stabil; keine Karten, die während einer Interaktion springen.
- Keine Bezahlung kassieren oder erneut auslösen, wenn Order bereits extern bezahlt ist.

## 16 · Hilfe-Center und interne Verwaltung

**Support:** suchen → Kategorie/Ergebnis → Artikel (Ziel, Voraussetzungen, nummerierte Schritte, echte aktuelle Screenshots, Prüfkriterium, Probleme, nächste Schritte) → optional Ticket. Suche bekommt echte Empty States und gute Navigation zurück. Private Tickets als Conversation View mit Status, Antwortfeld, Anhängen und klarer Unterscheidung öffentlicher Antwort vs. interner Notiz (nur internes Team). Eine interne Notiz ist **nicht bloß ein farbiges öffentliches Textfeld**, sondern eine erkennbar getrennte UX-Aktion.

**Internal:** Datenlisten, Filterchips, Date-Ranges, Status, Bulk-Aktionen nur mit deutlicher Zielanzahl. Datensätze erhalten Detailseiten/Inspector, keine Modal-Flut. Gefahraktionen brauchen Bestätigung; Export/Download muss eindeutigen Umfang benennen. Berechtigungsfehler sind neutrale Access-Denied-Ansichten, kein rotes Validierungsfeld.

## 17 · QR-Karten und Aufsteller: vollständige visuelle Spezifikation

**Zielbild:** Ein ganz einfacher, vertrauenswürdiger Schwarz-Weiß-Aufsteller, den auch ein kleines Café mit Heimdrucker schnell nutzen kann. **Weder Name noch Logo des Lokals auf der Karte.** Die **Combination Mark** darf **einmal dezent** vorkommen. Das Gäste-Menü hinter dem QR zeigt dagegen die Identität des Lokals; diese Trennung ist bindend.

### 17.1 Standardformat und ruhige Druckanmutung

| Eigenschaft | Fester Designwert / Regel |
|---|---|
| Karte | **92 × 135 mm, Hochkant**, etwas kleiner als A6 |
| A4-Vorschau | **2 Spalten × 2 Zeilen**, vier Karten |
| Zwischenraum | **4 mm** horizontal und vertikal |
| Blattseitenränder | **11 mm** links/rechts, **11,5 mm** oben/unten |
| Druckfarben | **#000000 auf #FFFFFF**, kein Cobalt-Blau als Pflichtfarbe |
| Kartensicherheitsabstand | mindestens 5–6 mm für reguläre Texte/Logo, Schneidelinien außerhalb |
| Kartenumrandung | Default keine; alternativ 0,35 mm feine Kontur außerhalb des Inhalts |
| Typografie | Inter; QR-Pflichttexte sind echte, scharfe Drucktypen, keine Edding-Schrift |
| Logo | einmal kleine originale **Combination Mark**, ca. 22–28 mm breit |
| QR | technisch korrekt erzeugte schwarze Matrix, auf Weiß, **mindestens vier Module Quiet Zone**, keine gestalterischen Eingriffe |
| QR-Größe | Richtwert: 43–49 mm **Matrix** plus separate erforderliche Quiet Zone; Gesamthöhe nach tatsächlicher Modulzahl prüfen |

### 17.2 Verpflichtende visuelle Lesereihenfolge

1. **Handlung:** `Scannen, bestellen & bezahlen` – kompakter Titel, **15 pt / 18 pt, Inter SemiBold**, zentriert, gegebenenfalls zwei Zeilen.
2. **QR-Fläche:** mittig, kontraststark, mit echter geschützter Weißzone; **kein Mascot, Logo, Doodle oder Rahmen innerhalb der Quiet Zone**.
3. **Ort:** bei Tischbetrieb `Tisch 04` – **17 pt / 20 pt Bold**, optional 1.5× größer als erläuternde Zeilen. Bei Abholung `Abholung`, niemals eine erfundene Tischnummer.
4. **Persönliche Alternative:** `Du möchtest lieber persönlich bestellen? Unser Personal kommt wie gewohnt zu dir. Bitte warte einen Moment.` – **9,5–10 pt**, Inter Regular, mindestens 12 pt Zeilenhöhe; bei Platzmangel lieber Titel kompakter halten als Servicehinweis unlesbar machen.
5. **Absender:** originale Zackisch Combination Mark, **einmal** klein am Kartenfuß mit genügend Freiraum.
6. **Fallback**, nur wenn URL lesbar, tatsächlich kurz und sicher: unter dem QR oder beim Fuß als zweite Möglichkeit bei Scanproblemen. Niemals URL auf Kosten der Quiet Zone setzen.

Das ist die verbindliche **inhaltliche Hierarchie**, nicht zwingend eine einzige unveränderliche Anordnung: Bei optisch besserer Balance darf der kleine Absender am Kopf erscheinen. **Nicht** zweimal Zackisch auf einer Karte. Gäste müssen den Code und die Tischnummer zuerst erkennen, nicht die Plattformmarke.

### 17.3 Erlaubte Varianten

| Name | Wann | Visuell |
|---|---|---|
| **Minimal** (Default) | fast alle Lokale, Klebeetikett oder Aufsteller | Weiß, schwarzer Text, keine äußere Kontur, kompakter Logo-Fuß |
| **Outline** | Ausschneiden, kontrastarme Tischoberfläche | wie Minimal, mit dünner schwarzer Kartengrenze **außerhalb** QR-Sicherheitsbereich |
| **Abholung** | Theke, Fenster, Außer-Haus | explizit `Abholung` statt Tisch, passende Headline; sonst identisches Erscheinungsbild |
| **Duplex-Aufsteller** | Zweiseitiger Papierständer, Schutzhülle | jede physische Vorder-/Rückseite trägt dieselbe Karte, kein spiegelverkehrter Text |

**Nicht als Varianten zulassen:** Lokalname/-logo, farbige Markenflächen, invertierter QR, Katzenkopf *im* QR, rustikale Edding-Verzierung auf der Matrix, unlesbare Mini-Schrift, automatisch wechselnde Hero-Bilder, Gutscheinwerbung oder zweite konkurrierende CTA.

### 17.4 Druckauswahl und Duplex-Vorschau (UX, keine Export-Implementierung)

Im Betreiberbereich `QR & Tische` gibt es eine schmale, klare **Schrittansicht**: **Auswahl → Vorlage → Papier & Seiten → Prüfen → Drucken**. Rechts (mobil darunter) ist immer eine maßstabsnahe A4-Vorschau. Einstellungen sind kurze Radio-Gruppen/Selects, **keine** überladene Einstellungsmodalwand. Einseitig ist Standard; Duplex wird bewusst aktiviert und erklärt.

**Front-Vorschau (vier unterschiedliche Tische):**

```text
┌─────────────┬─────────────┐
│  Tisch 01   │  Tisch 02   │
├─────────────┼─────────────┤
│  Tisch 03   │  Tisch 04   │
└─────────────┴─────────────┘
```

**Rückseiten-Vorschau bei A4 Hochkant / Wenden an langer Kante:**

```text
┌─────────────┬─────────────┐
│  Tisch 02   │  Tisch 01   │
├─────────────┼─────────────┤
│  Tisch 04   │  Tisch 03   │
└─────────────┴─────────────┘
```

Hier werden **Kartenpositionen links/rechts getauscht**, nicht der QR selbst oder der Text gespiegelt. Die Vorschau enthält eine sichtbare Legende `Vorderseite` / `Rückseite`, die gewählte Wendeart und eine Hilfe `Erst ein Testblatt drucken`. **Physische Druckertests bleiben nötig**, da Treiber/Wendeart variieren. Bei weniger als vier Karten sichtbare Leerslots, keine falschen Tischcodes. Ein interaktiver Druck-Assistent muss nach dem Anzeigen/Export nicht fälschlich behaupten, der QR sei bereits physisch geprüft.

**Fehlerdarstellung im Druckdialog:** nicht nur Toast. Lange Tischnamen, ungültige Zielcodes, fehlende Druckvoraussetzungen oder unvollständige Auswahl werden direkt im jeweiligen Auswahlfeld und in der Vorschau mit konkreter nächster Handlung gezeigt. Scanprüfung im realen Ausdruck ist ein expliziter Schritt; das Symbol ist keine Scan-Garantie.

### 17.5 Materialien außerhalb des Blattes

Für echte Tischaufsteller: genügend Fuß- und Schnittfreiheit, kein QR genau auf Falz/Knick, matte statt stark reflektierende Oberfläche; für einfache Sticker keine dekorativen Schnitt-/Falzelemente. Eine Abholversion kann ohne lokale Tischzuordnung bereitgestellt werden. Technische Codierung, Druck-/Sicherheitsverträge und Exportprüfungen stehen in [`README.md`](README.md) und [`docs/qr-and-print.md`](docs/qr-and-print.md).

## 18 · Marketingwebsite: vollständige Art Direction und Oberflächenkomposition

**Ziel:** Eine reduzierte, außergewöhnlich gut gestaltete Website für Menschen, die **ein Lokal führen**. Sie soll in Sekunden verständlich sein und im Verlauf Vertrauen schaffen. **Kein Umsatzrechner, keine Feature-Wand, keine künstlichen KPIs, keine pflichtmäßige Founder-Section**. Studien, inhaltliche Produktwahrheiten und Gründer-Quellfakten stehen in [`README.md`](README.md); hier steht nur, **wie** diese Inhalte dargestellt werden.

### 18.1 Rhythmus, Grid und Dramaturgie

**Keine fixe Zahl an Sections**. Ausgangskomposition (zusammenziehen/aufteilen, wenn die tatsächliche Seite dadurch besser wird):

| Visueller Beat | Primäre Frage | Gestalterische Ausführung | Vermeiden |
|---|---|---|---|
| **A — Intro/Hero** | Was bietet Zackisch? | 2-Spalten-Editorial am Desktop: markantes ruhiges Inter-Display, kurzer lesbarer Begleittext, **eine** klar erkennbare Primary Action. Gegenpol: glaubwürdiges echtes Foto von Menschen im Lokal. | 3 gleichzeitig konkurrierende CTAs, Autoplay-Hintergrundvideo, Fantasiezahlen |
| **B — Problem/Beleg** | Wo hakt es aus Gästesicht? | Ein einzelner gut belegter Befund (nur nach Prüfung in README) als typografisch eigenständiger Block, mit sichtbarer Quellenzeile; daneben eine konkrete Alltagsszene. Darunter **klar markierte qualitative Einordnung** aus Betreiberperspektive. | Zahlen als vermeintlicher Zackisch-Effekt, überdimensionierte drei KPI-Karten |
| **C — Produktstrecke** | Wie funktioniert es praktisch? | Eine visuelle Sequenz **gedruckter QR → Gäste-Menü → bezahlte Bestellung → Personal-Tablet**. Auf großen Screens kann die Szene bei Scrollbewegung **gezielt** Zustände wechseln, auf Mobile als vertikale klare Schritte. | 3D-Deko, unwahre Screenshots, blockierendes Pinning |
| **D — Menschen & Wahlfreiheit** | Ersetzt das den persönlichen Service? | Großes reales Foto einer guten Interaktion, maximal zwei präzise Sätze zu zusätzlicher Wahlmöglichkeit und bestehender Kasse. Bild trägt Emotion, Typografie die Erklärung. | Menschen als austauschbare „Teamwork“-Stockszene; Personalabbau-Versprechen |
| **E — Einfacher Einstieg** | Wie komme ich dazu? | Reduzierter nummerierter Ablauf mit vier bis sechs klaren Schritten; echte Begriffe, kleine sachliche Icons; optionale Hilfelinks. | 8 Riesen-Cards oder technischer Setup-Screenshot als Erstkontakt |
| **F — Konditionen & Grenzen** | Was kostet und braucht es? | Ruhiger Text-/Zahlenblock mit **prüfbaren** Eckdaten, getrennt Plattform- vs. Zahlungsanbietergebühr, zusammen mit Voraussetzungen. Kein Rechner, keine Schätzkurve. | hypothetische Ertragsprognosen, kryptisches Sternchen-Mikrocopy |
| **G — Vertrauen & Ende** | Ist das glaubwürdig, wie fange ich an? | knapper Quellenlink zur Research-Vertiefung, ggf. FAQ-Disclosure, kleine reale Kontakt-/Gründeroption, großer klarer Abschluss-CTA. Danach strukturierter Footer. | Logos fremder Kunden/Studien als endorsement, endlose Doppelung |

**Prinzip der visuellen Verdichtung:** Der Hero schafft Orientierung; Abschnitt B schafft eine nachvollziehbare Notwendigkeit; Abschnitt C zeigt **das echte Produkt**; D löst die Sorge vor unpersönlichem Service; E/F nehmen Setup- und Kostenrisiken; G schließt ab. Eine Section ohne eigenständige Frage entfällt.

### 18.2 Header, Navigation und Footer

- **Header nicht sticky.** Original-Combination-Mark links, maximal vier klare Hauptlinks bzw. eine kompakte Menügruppe, rechts ein klarer primärer Einstieg; Desktop große, ruhige horizontale Abstände. Keine animierte Navigation. Mobile ein leicht bedienbarer Menü-Trigger, logische Fokusführung, keine redundanten Buttons.
- Auf der Homepage **ein H1**. Hero: `display.hero`, max. 8–11 Wörter als grobe Lesbarkeitsleitlinie; Zeilenumbrüche bewusst; keine sinnlosen per-word Animationen, die Screenreader zerlegen. Body max. ~65–75 Zeichen pro Zeile. Links/Buttons mit eindeutigem Ziel.
- **Call to Action:** als eigenständiger, kontraststarker Button; primär Schwarz auf Hell oder eine einzelne Cobalt-Aktion; in einem sichtbaren Abschnitt üblicherweise genau eine Haupthandlung. Sekundärlink nach Bedarf.
- **Footer:** 2–4 klar gruppierte Spalten aus Produkt, Hilfe, Kontakt, Recht/Sprachen. **Am äußersten Ende** eine große originale Zackisch-Wortmarke bzw. autorisierte Kombination, breit und responsiv, ohne Beschnitt/Verzerrung. Nicht zwischen Pflichtrechtsinformationen platzieren.

### 18.3 Bilder, Videos, Produkt-Demos, Preview-Fallback

**Immer sichtbar oder als bewusst geplanter Medienplatz vorhanden:**

1. **QR-Aufsteller** (Foto eines echten gedruckten Aufstellers auf Lokal-Tisch oder ein nach Freigabe authentisches Produktbild mit realem QR-Design).
2. **Gäste-Menü** (authentische Browseroberfläche mit Lokallogo/-name, Artikelfoto, Varianten/Preis; **keine Zackisch Combination Mark im Gast-Header**).
3. **Personalansicht** (echte, gut lesbare Liste/Karte neuer **bereits bezahlter** Bestellungen und Status; kein erdachter Kassenterminal).

**Bis echte Assets existieren:** pro fehlendem Produktmoment eine zurückhaltend gestaltete graue Fläche (`#F3F3F1` oder neutrales Grau) mit 1px Border, 12–20px Radius und zentrierter **expliziter Beschriftung** `Hier erscheint: QR-Aufsteller`, `Hier erscheint: Gäste-Menü`, `Hier erscheint: Personal-Tablet`. Kein fiktiver Screenshot, keine Fake-App mit unmöglichen Daten und kein Live-Anschein. Auch auf einer veröffentlichten Prelaunch-Seite ist die graue Preview als **deutlich erkennbarer Platzhalter** zulässig, aber niemals als fertiger Produktscreenshot oder Kundenreferenz. Echte Fotos der Menschen und klare Texte tragen weiterhin die Glaubwürdigkeit. Sobald reale Freigaben vorliegen, Platzhalter durch echte, korrekt beschriftete Assets ersetzen.

**Menschenfotos:** Freigegebene reale Fotos, lokale Atmosphäre, natürliches Licht, Unterschiede in Alter und Gastro-Konzepten. Kommerziell verwendbare Stockbilder sind erlaubt, **Lizenz und Quelle dokumentieren**, keine KI-generierten vermeintlich realen Gäste, Angestellten oder Gründer. Fotopositionen und Motivauswahl müssen zur Aussage passen (z. B. Bestellung/Warten/Service). Für Founder-Story ausschließlich echtes freigegebenes Gründerfoto; MARS-Logo nur nach bestätigter Freigabe; die Founder-Section **optional**. Tatsächliche Informationen dazu: README Abschnitt 9.

**Video:** Optional ein realistischer kurzer Clip von Lokal-Alltag bzw. Freigabe einer echten Produktdemo; kein automatisch abspielender Ton. Posterbild, Play/Pause, Untertitel/Transkript wo erforderlich. **Nicht** Video nur wegen eines Awwwards-Effekts einsetzen. Eine stumme Hero-Loop darf ein *echtes* Produkt-/Menschmotiv veranschaulichen, aber die statische Erstansicht muss schon vollständig überzeugen.

### 18.4 Der eine Signature-Motion-Moment

Die **QR→Gast→Personal-Kette** ist die einzige mögliche große Scroll-Story. Empfehlung: Desktop zeigt einen ruhigen zweigeteilten Frame aus Foto/QR und Produktmoment; bei kontrolliertem Scrollen wechselt die aktive **eindeutig beschriftete Phase**. Keine frei schwebenden Telefonsimulationen, keine festgehaltene Scrollposition mit Zwang zum „Durchspielen“; die Story ist vor und nach Animationsende vollständig verständlich.

- Phasen maximal vier: `Scannen` → `Menü` → `Bezahlen` → `Personal sieht Auftrag`. Je Phase ein erklärender Satz, ein Medium/Platzhalter, ein visueller Wechsel. Status „Bezahlt“ nur in als Demo gekennzeichneter Simulation oder echter verifizierter Aufnahme.
- Mobile: einfache vertikale Schrittfolge statt Scroll-Pinning; optional tapbare Step-Navigation **mit zugänglichen Labels**. Kein horizontaler Zwangsscroll.
- Alle Schritte immer im Dokument lesbar; Motion animiert nur vorhandene visuelle Ebenen, versteckt keine Pflichtinformationen.
- `prefers-reduced-motion`: **dieselbe Information statisch**; keine Parallax-/Scrollbindung. Animationsdauer nicht als Informationskanal verwenden.
- Kleine Motion: nur sinnvolle Dropdown-/Dialog-Transitions, Bild-Reveals bei wirklich relevantem Szenenwechsel; Buttons springen nicht. Die Bewegung muss professionell, nicht „AI-Slop“ wirken.

### 18.5 Redaktions- und Research-Darstellung

- Ein Studienwert als einzelne typografische Hervorhebung mit **sichtbarer Einheit, Bezugsgruppe, Datum und direktem Quellenlink**. Daneben in Inter-Medium eine knappe Einordnung: Was wissen wir? Was **wissen wir nicht**?
- Die Verbindung **Gastproblem → mögliche Belastung für Lokal → zusätzliche Bestellmöglichkeit** muss als sachliche Logik erkennbar bleiben. Keine **Kausalgarantie**, dass Zackisch dadurch eine konkrete Umsatz-/Wartezeitsteigerung erzeugt.
- Feste Microcopy-Prinzipien: kurze konkrete Titel, keine Buzzword-Slogans; keine Zahlen aus erfundenen Beispielrechnungen. Konkrete Zitate/Studieninhalte kommen ausschließlich aus der README und ihren Primärquellen.
- Newsletter, About und ausführliche Research-Inhalte nur dann visuell hervorheben, wenn sie wirklich zum jeweiligen Entscheidungsschritt beitragen.

### 18.6 Alternative Kompositionen und Entscheidungskriterien

**Layout A (bevorzugt):** ruhiger Editorial-Hero + reales Foto → typografischer Studienbeleg → große Produktsequenz → Menschenbild/Hybrid → kompakte Einrichtung/Preise → Schluss. **Layout B:** Einstieg direkt mit QR-/Personalszene im Hero, danach Problem/Beleg; nur wenn Blicktest ohne Vorwissen zeigt, dass Zackisch in Sekunden verstanden wird. Nicht zwei Konzepte gleichzeitig mischen.

**Qualitätscheck der Homepage:** Innerhalb von 5 Sekunden erkennbar, dass Zackisch QR-Bestellung/Bezahlung für Lokale ergänzt; Primary CTA sichtbar; kein unklarer QR-Live-Demolink; Personalfunktion erkennbar; kein unbewiesener finanzieller Outcome; korrektes White Label; vollständige Story ohne Scrollanimation; mobil in einer Hand verständlich.

### 18.7 A/B-Evidenz als Designentscheidung, nicht als Schablone

Die dokumentierten Obama- und Bing-Experimente werden **in der README** inklusive Quellen, Ergebnissen und Übertragungsgrenzen beschrieben. Für die Gestaltung bedeutet das **nicht**, dass jeder blaue CTA gewinnt oder jedes Video verliert. Daher: zuerst einen hervorragenden, schnellen, menschenorientierten **statischen** Hero bauen; eindeutige CTA-Sprache; visuelle Produktstory nur, wenn sie nachweislich das Verständnis verbessert; Experimente später sauber auf echten Betreibern evaluieren. Keine Ad-hoc-Änderungen nach einzelnen Klicks; nie Accessibility gegen Klickrate eintauschen. Automatisch wechselnde Hero-Slider sind nicht Bestandteil des Designs.

## 19 · UX-Wording und Sprachregeln

- Deutsch und Englisch als gleichwertige Oberflächen, Begriffe konsequent: `Betrieb`, `Tisch`, `Abholung`, `Bestellung`, `Personal-Tablet`, `Kasse`, `In Kasse erfasst`, `Bestell- und Zahlungsbestätigung`.
- Keine Slogans im Design System festlegen; funktionale UI-Beispiele sind erlaubt.
- Buttons als klare **Verb-Objekt-Handlung**: `Menü bearbeiten`, `QR-Codes drucken`, `Zahlungspflichtig bestellen` (nach Prüfung der tatsächlichen Checkout-Position).
- Fehler präzise und lösbar: statt `Fehler` → `Die Verbindung zum Tablet ist unterbrochen. Verbinde das Tablet erneut.`
- Kein „100 %“, „garantiert“, „KI“, „Echtzeit“ ohne belegbare technische Grundlage. Keine UX-Dark-Patterns, keine bereits angekreuzten Marketing-Opt-ins, kein Default-Trinkgeld >0.
- Keine Success-Texte, solange ein Zahlungs-/Speicherzustand noch unbestätigt ist.

## 20 · Anti-AI-Slop: zwingende Gestaltungsprüfung

1. Jede Sektion muss eine **Frage des konkreten Zielnutzers** beantworten; sonst löschen.
2. Keine zufälligen Glows, Gradients, Hintergrund-Gitter, Blur-Blobs, Fake-3D-Phone-Floats oder Glassmorphism als Markenidentität.
3. Keine drei gleich großen Karten für Inhalte, die besser als Absatz, Timeline, Liste oder reales Foto erzählt wären.
4. Icons nur, wenn sie schneller verstanden werden als Text; Marker-Stil nicht für kritische Interaktion.
5. Keine Lorem-ipsum-UI, Fantasie-KPIs, erfundenen Kundenzitate, frei erfundenen Fotos oder Anbieter-Zertifizierungen.
6. Überschriften nicht austauschbar (`Revolutioniere dein Business`, `Next-Level-Erlebnis`); konkrete Aufgaben/Zustände verwenden.
7. Nur ein starker Motion-Moment; der Rest verhält sich ruhig.
8. Keine kleine Schrift als „Premium-Look“. Lesbarkeit bei schlechter Beleuchtung und während Service priorisieren.
9. Keine unmotivierten Full-Bleed-Fotos hinter Body-Text, kein miserabler Kontrast.
10. Screenshots und Produktdemos auf echte Produktfunktionen beziehen; Demo immer als Simulation kennzeichnen.
11. Konsistente Rundungen, Raster und Abstände; nicht willkürlich pill-shaped alles.
12. Vor Freigabe jede Seite bei 320px, 390px, 768px, 1280px und 1600px sowie Tastatur/Zoom/Reduced Motion prüfen.

## 21 · Base UI, Accessibility und Qualitäts-Gates

**Base UI ist bevorzugtes primitives Fundament** für Dialog, Select, Combobox, Checkbox, Radio, Switch, Tabs, Accordion, Popover, Menu, Tooltip und Field; native HTML-Elemente verwenden, wenn sie semantisch angemessener sind. Base UI ist **unstyled**: der neue Zackisch-Komponentenlayer übernimmt ausschließlich die Tokens dieses Dokuments, nicht ein fremdes Theme. Ein eigener `Toast`-Wrapper muss Accessible-Live-Region, Lebensdauer und Interaktionsunterbrechungen prüfen. Bei komplexen Datengrid- und Drag-and-Drop-Funktionen zusätzliche geprüfte Pattern nutzen; Base UI deckt nicht automatisch alle Anwendungsfälle ab.

**Minimum:** WCAG 2.2 AA; 44×44px als praktische Touch-Vorgabe (AA-Minimum kann kleiner sein, aber Gastro-Nutzung verlangt Komfort); Focus Visible mit ≥2px kontrastreichem Ring, logische Tab-Reihenfolge, Escape/Focus-Restore, Screenreader-Labels, Fehlerzusammenfassung, Zoom/Reflow, Text-Abstände, Farbkontrast, Reduced Motion. Wenn ein Pattern nicht sicher barrierefrei umgesetzt werden kann: **einfacheren zugänglichen Pattern wählen**.

### Definition of Done pro Komponente/Screen
- [ ] Zweck und korrekte Semantik dokumentiert; kein unnötiges Overlay.
- [ ] Alle Zustände: default, selected, disabled, loading, empty, error, offline, success wo relevant.
- [ ] Keyboard, Pointer, Touch, Screenreader und Fokus-Rückkehr getestet.
- [ ] Bei wichtigen Entscheidungen klare textliche Folgen und Undo/Bestätigung.
- [ ] Keine unbestätigte Zahlung als erfolgreich beschrieben; keine vertraulichen Daten in öffentlicher View.
- [ ] Gast-/Betreiber-/Personal-/Support-Kontext korrekt, Lokal-White-Label geschützt.
- [ ] Original-Brand-Assets unverändert; Mascot-Variante und Häufigkeit begründet.
- [ ] Freigegebene echte Fotos/Rechte, Alt-Texte oder dekoratives `alt=""`.
- [ ] Keine horizontalen Überläufe bei 320px oder 200 % Zoom; Reduced Motion ohne Informationsverlust.
- [ ] Test mit echter Zielgruppe: Scan, Bestellung, Druck und POS-Arbeit unter realistischen Bedingungen.

## 22 · Screen-, Komponenten- und Status-Mapping als verbindlicher Designvertrag

Die folgende Matrix beschreibt **nur die sichtbare Aufgabe, Reihenfolge und passende Semantik**. Sie ist **keine technische Routenliste**; technische Domänen, Daten und Berechtigungen stehen in der README.

| Oberfläche/Situation | Visuelle Kernstruktur | Zwingendes Hauptfeedback | Mascot |
|---|---|---|---|
| Gäste-Menü am Tisch | Lokalkopf + Tischkontext, Kategoriennavigation, Artikelliste mit Preisen, erreichbarer Warenkorb | Verfügbarkeit/Allergene/Preise unmittelbar an Artikeln | beim optionalen Einstieg höchstens neugierig, sonst keiner |
| Gäste-Menü Abholung | Lokalkopf + Abholkontext, Artikelliste, ggf. Abholhinweise, Warenkorb | Abholung deutlich statt Tisch | kein Dauer-Mascot |
| Artikeloptionen | Überschrift/Bild, Optionen in echten Radios/Checkboxen, sichtbare Mehrpreise, Mengenwahl, Gesamtbetrag, CTA | Pflichtoptionen inline; Zusammenfassung vor Bestätigung | keiner |
| Warenkorb | Positionen/Optionen, Menge, Entfernung, Zwischensumme, optionale Empfehlungen, Weiter-CTA | Bestand/Preisänderung persistent, nicht Toast-only | keiner |
| Checkout | Verkäufer-Lokal, Bestellkontext, Gesamtsumme, 0%-Trinkgeldoption, Anbieterzahlung | ausstehend/fehlgeschlagen/bezahlt als unterschiedliche Zustände | keiner |
| Bestätigung | echte Bestellreferenz, Positionen, Gesamtbetrag, Status, Download / Statusverfolgung | erst nach verifizierter Zahlung Erfolg | **fröhlich/feiernd**, einmal optional |
| Betreiberübersicht | aktueller Lokalstatus + priorisierte nächste Aufgabe, danach relevante Kennzahlen/Bestellungen | erforderliche Einrichtung oder Störung als persistente Notice | neugierig beim echten Onboarding-Erstschritt |
| Menüverwaltung | Kategorie-/Artikelliste mit Inspector; Schnelledit für Verfügbarkeit | Save/Fehler lokal am Datensatz; nicht erzwungene Dialogkaskade | keiner |
| QR-Auswahl/Druck | Tabellen-/Tischauswahl, Layoutoptionen, A4-Vorschau, Duplex-Vorschau, Druckhilfe | falsch zugeordneter Code blockiert Druck mit präzisem Fehler | keiner auf Druckvorschau |
| Personal-Tablet live | neue bezahlte Bestellungen visuell priorisiert, Aktionen groß, Details vollständig | Verbindung/Letzte Aktualisierung + bezahlt + Kassenerfassung | keiner |
| Betreiber-Zahlungskonto | Anbieterstatus und konkrete nächste Handlung, verständliche Fachlabels | eingeschränkt/offen/aktiv persistenter Status | keiner |
| Hilfe-Suche | prominentes Suchfeld, Kategorien als klare Textliste, Suchtreffer | Nulltreffer mit Vorschlägen | kleine **neugierige** Variante nur im unbelasteten Empty State |
| Support-Ticket | chronologischer Gesprächsverlauf, eigene Antworten, sichere Anhänge | Status/Absende- oder Ladefehler inline; Sichtbarkeit klar | keiner |
| Interne Ticketnotiz | separat erkennbare Notizkomposition und Sichtbarkeit, nicht nur anderes Textfeld | vor Senden eindeutiger Empfängerkontext | keiner |
| Team-Auswertung | Filterzeile, Datentabelle, sortierbare Spalten, Detailansicht | Ergebnisse/Leere/Fehler/Scope textlich | keiner |
| Marketing-Website | Editorial Hero → belegtes Problem → Produkt-/Menschenreise → Setup/Preis → Kontakt/CTA | visuelles Lesen auch ohne Motion möglich | maximal ein bis zwei kleine kuratierte Akzente auf ganzer Homepage |

### Konsistenz der visuellen Zustände

Jede aufgeführte Oberfläche erhält **aufgabenangemessene** Default-, Loading-, Empty-, Fehler-, Offline-/Verbindungs-, Success- und ggf. eingeschränkte Zustände. Nicht alle Zustände müssen künstlich überall existieren; wenn ein Zustand fachlich nicht vorkommen kann, wird er nicht simuliert. Keine dramatische rote Fläche für einen einfachen „noch kein Menüartikel“; kein heiterer Mascot bei fehlgeschlagener Zahlung. Kritische Folgen immer textlich, mit nächster Handlung und sichtbarem Wiederherstellungspfad.

## 23 · Formulardesign nach Fragetyp statt nach Datenbankfeld

**Eine Frage pro begrifflich zusammengehörigem Feld; eine Gruppe pro Entscheidung.** Bei Lokaldaten, persönlicher Authentifizierung, Artikelbearbeitung, Zahlungskonto und Support gelten dieselben visuellen Komponenten, aber **nicht** dieselbe Bildschirmdichte.

| Nutzerentscheidung | Richtige sichtbare Eingabe | Beschreibung / Nicht benutzen |
|---|---|---|
| Lokalname, Menüartikelname | Textfeld mit permanent sichtbarem Label | Placeholder nur Beispiel, nie als einzige Frage |
| E-Mail, Telefonnummer | spezialisiertes Eingabefeld | passende mobile Tastatur, konkrete Fehltexte, keine Icons als Label |
| Preis, Menge, Trinkgeld | Zahleneingabe oder Stepper abhängig von Aufgabe | Euro-/Einheitenanzeige, Grenzen, korrigierbarer Wert; keine Schieberegler für präzise Beträge |
| Tisch/Abholung als Angebot aktivieren | unabhängige Checkbox/Switch je **eigener** Betriebsfunktion | Zustand braucht Label und Konsequenz; Gast sieht keinen nicht verfügbaren Modus |
| exakt eine Größe/Variante | Radio Group | **nicht** Checkboxen, wenn genau eine Wahl nötig |
| optionale Extras | Checkbox Group mit sichtbaren Aufpreisen | **nicht** Radio, wenn mehrere möglich sind |
| eine Kategorie aus wenigen | Select/Radio je Platz | nicht Combobox ohne Suchbedarf |
| sehr viele Artikel/Tickets | Such-Combobox | leere Suche, kein Ergebnis und Tastatur explizit gestalten |
| Datum/Zeitbereich | Datum/Zeitraumkontrolle | lokale Datumsformatierung; keine zwei verwirrenden freien Texteingaben |
| Bild hochladen | Datei-Auswahl mit Vorschau, Fehler und austauschbarer Aktion | kein Drag-only; akzeptierter Inhalt/Format visuell erklären |
| Freitext/Supportnachricht | Textarea mit klarer Länge und ggf. Anhang | nicht E-Mail-Einzeiler für ausführliche Problembeschreibung |
| irreversibles Entfernen | Bestätigungsdialog mit konkretem Gegenstand | nicht als Switch/Toasts/unklare kleine Mülltonne |

**Fehlerablauf:** bei Submit Eingaben behalten; fehlerhafte Felder inline exakt benennen; bei langem Formular zusätzlich Error Summary ganz oben mit Sprung zum Feld; Fokus zur Summary. Bei mehreren sicheren Schritten ein erklärender Progress Stepper. Bei Eingabe weder jitternde Fehlermeldungen noch automatische Scrollanimationen bei jedem Zeichen. Sekundäre Entscheidungen nicht hinter auffälligem `Advanced` verstecken, wenn sie rechtlich oder finanziell wesentlich sind.

## 24 · Bildverwendung und Formatvertrag nach Medium

| Medium | Motive/Rolle | Bildformat & Layout | Fallback / Verbot |
|---|---|---|---|
| Website-Hero | echte Gäste oder Service in erkennbar echtem Lokal | großes Foto 4:5 oder 3:2, Motiv-Safe-Zone für Mobile | seriöse reine Textkomposition statt generiertem Menschenfoto |
| Website Produktstory | **QR-Aufsteller**, **Gäste-Menü**, **Personal-Tablet** als drei klar benannte Produktmomente | konsistente Medienrahmen, Desktop nebeneinander/abwechselnd, Mobile vertikal | grau beschrifteter Platzhalter, bis **echter** Screen freigegeben |
| Website Problem | wartende Gäste/realer Servicekontext, ohne gespielte Frustration | vorzugsweise dokumentarischer Ausschnitt 3:2 | kein künstliches Schmerz-Stockfoto |
| Gäste-Menü Artikelfoto | genau dieses Essen/Getränk, realistisch, lokaltypisch | Standard 4:3, scharfe Thumbnail-Crops, keine ikonischen Produktfotofakes | neutrale Kategoriefläche, Titel und Preis tragen Inhalt |
| Lokalbanner | Atmosphäre des Lokals, nicht generischer Skyline-Look | breites Verhältnis ca. 16:7, mittige Safe-Zone | Off White/Light Gray, **Lokalname bleibt Text** |
| Lokallogo | vom Betreiber bereitgestellte authentische Bildmarke | `contain` in ruhigem Container, ohne Verfälschung | Lokalname als Inter Text |
| Hilfeartikel | **aktueller echter Screenshot** mit markiertem Schritt | möglichst 16:9 bzw. natürliche App-Ratio; klare sichtbare Schritte | Textanleitung und explizit als noch fehlend markierte Screenshot-Stelle |
| Founder | freigegebenes echtes Gründerfoto | eher natürliches Hochkant 4:5; kleiner redaktioneller Bereich | Text oder Section auslassen |
| Team/Support | keine dekorative Personenillustration in operativer Tabelle | Datenklarheit gewinnt | keine Fake-Avatare als Identitätsersatz |
| Print-QR | reiner Vektorcode schwarz auf weiß | lesbar und reproduzierbar | **niemals** Foto als QR-Untergrund |

Keine automatischen inhaltslosen Bewegtbild-Karussells, keine „ästhetischen“ Blur-Overlays auf wichtigen Speisen, kein nicht freigegebenes Logo als Kunden-/Partnerempfehlung.

## 25 · Forschung, A/B-Ergebnisse und Designvalidierung

**Externe A/B-Tests sind Ideenquellen, nicht ein Designgesetz.** Die README enthält die dokumentierten Obama- und Bing-Experimente inklusive Quellen und Übertragungsgrenzen; der eigene **visuelle** Lernauftrag ist: Erstverständnis, echte Menschen statt Fremdvertrauenssymbolen, klare CTAs und Animationen mit Erklärnutzen. Deshalb:

1. **Hero zuerst statisch entwerfen:** Verständlichkeit bei abgeschalteter Animation; danach Motion ergänzen, nicht umgekehrt.
2. **Produktverständnis testen:** Betreiber:in ohne Vorwissen sieht den QR→Menü→Tablet-Verlauf und kann nach wenigen Sekunden selbst erklären, was passiert.
3. **CTA-Hierarchie testen:** eine dominante Aktion, verlässliche Links und erkennbare Zweckbeschreibung. Kein A/B-Test-Ergebnis anderer Firmen als Zackisch-Prognose kommunizieren.
4. **Mobile ebenso ernst nehmen:** 320/390/768px und reale Touchgeräte, 200% Zoom, kein horizontaler Gesamtseiten-Scroll, keine Unterbrechung durch Autoplay.
5. **Gastro-Realität testen:** Tischaufsteller unter Lampe, 1-Hand-Bedienung mit Getränk in der anderen Hand, lauter Service mit großen Statusaktionen, langsames Netz, optional persönlicher Service.
6. **Keine Accessibility-Experimente:** WCAG-Baseline, notwendige Labels, ehrlicher Zahlungsstatus und Nutzerwahl sind nicht verhandelbar – auch dann nicht, wenn ein kurzfristiger Klicktest mehr Klicks liefert.

**Designabnahme:** Mindestens je eine gezielte Usability-Runde mit echter Lokalbetreiber-Person, Gast und Personal, bevor kritische Flows als fertig gelten; Befunde festhalten und die Tokens/Patterns zentral verbessern statt Screen-by-Screen-Sonderlösungen. Ein Experiment ist erst ein belastbares Ergebnis, wenn Stichprobe und methodische Bedingungen ausreichen. Die Forschungsliste wird zentral **in der README** gepflegt.

## 26 · Design-Referenzen und Abgrenzung

**Inspirationsprinzipien** (keine Code-, Layout- oder Markenkopie): me&u zeigt reduzierte Lokalnavigation und prominente Artikelfotos; SO’USE zeigt deutlich getrennte Tisch-/Abholszenarien und verständliche QR-Touchpoints; PayPal/Stripe sind qualitative Vergleichsmaßstäbe für klare Enterprise-taugliche Marketinggestaltung und Vertrauen. Andere Produkte bieten teils POS-Integrationen, Shared Tabs oder spätere Zahlung — das sind **keine automatisch vorhandenen Zackisch-Funktionen**.

**Externe UX-/Accessibility-Referenzen:**
- [Base UI – headless/accessible](https://base-ui.com/react/overview/about), [Styling](https://base-ui.com/react/handbook/styling)
- [GOV.UK Notification Banner](https://design-system.service.gov.uk/components/notification-banner/), [Error Summary](https://design-system.service.gov.uk/components/error-summary/), [Error Message](https://design-system.service.gov.uk/components/error-message/)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [Reduced Motion](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- [me&u redesigned Order & Pay](https://help.meandu.com/hc/en-us/articles/13065055225359-Explore-The-Revamped-Order-Pay-Experience), [SO’USE Tischservice](https://help.so-use.de/de/articles/12768308-servicekonzept-tischservice-was-muss-ich-beachten), [SO’USE Selbstbedienung](https://help.so-use.de/de/articles/12768318-servicekonzept-selbstbedienung-was-muss-ich-beachten)
- [Motion scroll-linked API](https://motion.dev/docs/react-scroll-animations)

### Migration aus dem bisherigen Repositoryzustand

- Die noch im Repository vorhandenen Poppins-/Astryx-/alten Theme-Regeln sind **Legacy-Implementierungsdetails** und **keine Design-Vorgaben**. Der neue Zielzustand benutzt Inter und die hier genannten Tokens; vorhandene technische Komponenten werden nur soweit wiederverwendet, wie sie semantisch und accessibility-technisch passen.
- Kein globales Redesign ohne visuelle Regression über alle vier Oberflächen: Die White-Label-Gäste-App, der Tabletbetrieb und das interne Dashboard haben unterschiedliche Dichten, aber dieselbe tokenbasierte Basissprache.
- Projekt-READMEs und Agent-Anleitungen nach Implementierung auf diese zentrale Designquelle **verweisen**, statt alte Font-/Komponentenregeln parallel zu verwalten.
- Zustand, Rechte, Zahlungs- und Fiskalprozesse **nicht** aus UI-Gestaltung ableiten; funktional gegen die jeweiligen Engineering-Verträge prüfen.

**Implementierungsagent:** Zuerst dieses Dokument lesen; technischen Produktkontext aus Projekt-READMEs/AGENTS und Fach-Docs prüfen; UI von Null nach diesen Tokens und semantischen Mustern aufbauen. Keine bestehenden Design-Tokens blind portieren. Die technische Produktwahrheit steht in [`README.md`](README.md) und den dort verlinkten Projekt-/Fachdokumenten. Diese Datei ist die **einzige** visuelle Soll-Spezifikation. Die Funktion, Rechte und Zahlungsfreigaben ändern sich **nicht** aufgrund einer Designentscheidung.


## Hallmark / Anti-AI-Slop: verbindlicher Design-Review-Modus

**Hallmark wird ausschließlich als Review-Werkzeug mit `custom`- bzw. `custom bespoke`-Ausrichtung benutzt.** Die Farben, Typografien, Abstände, Radien, Bildsprache, Komponenten und Layoutregeln in **dieser** `DESIGN.md` sind nicht verhandelbar. Keine Hallmark-Katalogthemes, keine vorgeschlagene Fremd-Palette, keine andere Fontkombination, keine generischen UI-Kits übernehmen. Ein Hallmark-Vorschlag, der der Zackisch-Gestaltung widerspricht, wird verworfen; seine allgemeingültige Qualitätsregel kann trotzdem berücksichtigt werden.

**Empfohlener Agent-Prompt:** „Use Hallmark in **custom bespoke** mode only as an anti-slop and visual critique layer. The root DESIGN.md owns the entire visual language. Preserve Base UI, Inter, the Zackisch accent font, monochrome tokens, branded vector assets, actual copy and actual product behavior. Do not select or copy a Hallmark catalog theme. Run sloplint / visual and accessibility checks against the implemented screens; fix objective issues without restyling the brand.”

**Prüfregeln:** Keine künstlichen Kennzahlen oder Testimonials, keine nicht vorhandenen App-Screenshots, kein Hero aus drei leeren Geräteframes, keine Text-auf-Foto-Bereiche ohne kontrollierten Kontrast, keine doppelte prominente Filled-CTA-Gruppe, keine unbegründeten Gradients, kein „Eyebrow“ über jeder Überschrift, keine sinnlosen Mikro-Animationen, kein horizontales Scrollen bei 320px. Echte Screenshot-/Print-Assets nutzen, sonst neutrale graue Platzhalter mit Beschriftung; lizenzierte echte Menschenfotos sind zulässig. Interaktionen nach Zweck statt nach Katalogstruktur komponieren.

**Review-Workflow:** Design.md lesen → User-Journey und echte Inhalte prüfen → Zackisch-custom Design bauen → Hallmark Slop-/Browser-Audit → Accessibility und Responsive manuell testen → Diff prüfen → erst danach akzeptieren. Hallmark selbst ist derzeit als **gewünschter neuer Skill**, nicht als bereits in `skills-lock.json` bestätigte Installation dokumentiert; Installations- und Integrationsanleitung siehe README.




## 27 · Verbindlicher Asset-Vertrag (freigegebenes Bundle)

Alle folgenden Repository-Pfade sind **konkret in diesem Migrationspaket enthalten**. Für Fotos und Lizenzprüfungen siehe das **externe Übergabepaket** `agent_handoff/MEDIA_SOURCES.md`; technische Handoff-Anweisungen stehen außerhalb des späteren Repo-Baums.

**Logo-Master (Originaldateien, kein Neuzeichnen):** `assets/zackisch/brand/combination_mark.svg` (Combination Mark, handgezeichneter Schriftzug) und `assets/zackisch/brand/brand_mark.svg` (Katzenkopf). Favicon/Appicons `assets/zackisch/brand/raster/`, OG-/Bannerdarstellungen `assets/zackisch/brand/social/`; Markenexporte in die Anwendung verlinken/übernehmen, nie neu entwerfen.

**Zackisch-Schrift:** `assets/zackisch/font/zackisch.ttf`, `assets/zackisch/font/zackisch.woff2`, `assets/zackisch/font/zackisch.css`; als *dekorative Display-Schrift* und nicht für UI lesen. Der Font ist als Prototyp gekennzeichnet; die handgezeichnete Logoform ist ausschließlich das Original-SVG.

### 27.1 Mascot: finale SVG-Datei pro Kontext

| Datei | Einsatz | Einschränkung |
|---|---|---|
| `assets/zackisch/mascot/mascot_curious_welcome.svg` | öffentliche Website: Begrüßung / Onboarding | nicht in Zahlungskarte |
| `assets/zackisch/mascot/mascot_happy.svg` | abgeschlossener optionaler Schritt, leere positive Antwort | kein Ersatz für Bestätigungslabel |
| `assets/zackisch/mascot/mascot_wink.svg` | kleine lockere Produkterklärung | nicht bei Warnung oder Fehler |
| `assets/zackisch/mascot/mascot_focused.svg` | Konfiguration wird geprüft, Suche läuft | kein falscher Fortschritt |
| `assets/zackisch/mascot/mascot_thinking.svg` | kontextsensitive Hilfe, Tooltip-Illustration | nicht neben jedes Formularfeld |
| `assets/zackisch/mascot/mascot_sleeping.svg` | Stille / Pause, selten | keine schlafende Figur während echter Zahlungswartezeit |
| `assets/zackisch/mascot/mascot_excited.svg` | Marketing-Meilenstein | nicht bei alltäglichem Toast |
| `assets/zackisch/mascot/mascot_celebrating.svg` | Erfolg nach nachweislich abgeschlossener Einrichtung | keine automatische Erfolgsbehauptung |
| `assets/zackisch/mascot/mascot_peeking.svg` | freundlicher leerer Bereich / visuelles Easter Egg | selten, niemals CTA verdecken |
| `assets/zackisch/mascot/mascot_helpful_guide.svg` | Einrichtungs-Wizard-Schritt und Hilfeartikel | nicht in rechtlichen Pflichtangaben |
| `assets/zackisch/mascot/mascot_scan_qr.svg` | Website-Demo einer QR-Interaktion | Illustrations-QR ist nie scannbar |
| `assets/zackisch/mascot/mascot_payment_success.svg` | Gästeapp bestätigte Zahlung | nur nach verifiziertem Server-/Stripe-Status |
| `assets/zackisch/mascot/mascot_order_received.svg` | bestätigte Bestellung | Status schriftlich getrennt |
| `assets/zackisch/mascot/mascot_order_ready.svg` | Abholung ausdrücklich bereit | Abholnummer sichtbar halten |
| `assets/zackisch/mascot/mascot_empty_state.svg` | keine Bestellungen/Suchergebnisse | 09 peeking nicht parallel |
| `assets/zackisch/mascot/mascot_error_404.svg` | 404-Not-Found-Seite | nicht für Zahlungsfehler |
| `assets/zackisch/mascot/mascot_offline_pause.svg` | keine Verbindung, Pause | expliziter Retry und Service-Alternative |
| `assets/zackisch/mascot/mascot_support_listening.svg` | Kontakt/Support-Einstieg | Kontaktweg stets als Text/Link |

Für diese Varianten gilt: Die SVGs sind *direkt aus der freigegebenen Mascot-Vorschau getraced*. Pupillen nicht beim UI-Rendering verschieben, nicht neu konstruieren, nicht mit zufälligen Strichen dekorieren. `mascot_wink.svg` hat **ein geschlossenes linkes und ein offenes rechtes Auge**. Die grafische Ausrichtung ist nicht semantischer Status.

### 27.2 Doodle-Icon-Pfade

| Icon | Datei | Bedeutung / geeigneter Einsatz |
|---|---|---|
| add | `assets/zackisch/icons/icon_add.svg` | Menge erhöhen |
| arrow left | `assets/zackisch/icons/icon_arrow_left.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| arrow right | `assets/zackisch/icons/icon_arrow_right.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| call | `assets/zackisch/icons/icon_call.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| card payment | `assets/zackisch/icons/icon_card_payment.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| cart | `assets/zackisch/icons/icon_cart.svg` | Warenkorb |
| cash | `assets/zackisch/icons/icon_cash.svg` | Barzahlung bei Verfügbarkeit |
| chat | `assets/zackisch/icons/icon_chat.svg` | Nachrichten |
| close | `assets/zackisch/icons/icon_close.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| confirm | `assets/zackisch/icons/icon_confirm.svg` | Abschlussstatus (Text bleibt erforderlich) |
| cutlery | `assets/zackisch/icons/icon_cutlery.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| dashboard | `assets/zackisch/icons/icon_dashboard.svg` | Dashboard-Verwaltung |
| delete | `assets/zackisch/icons/icon_delete.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| favorite | `assets/zackisch/icons/icon_favorite.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| filters | `assets/zackisch/icons/icon_filters.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| help | `assets/zackisch/icons/icon_help.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| image | `assets/zackisch/icons/icon_image.svg` | Mediengrafik |
| info | `assets/zackisch/icons/icon_info.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| location | `assets/zackisch/icons/icon_location.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| menu | `assets/zackisch/icons/icon_menu.svg` | Menünavigation |
| message | `assets/zackisch/icons/icon_message.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| notification | `assets/zackisch/icons/icon_notification.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| order | `assets/zackisch/icons/icon_order.svg` | Bestellübersicht |
| order ticket | `assets/zackisch/icons/icon_order_ticket.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| payment | `assets/zackisch/icons/icon_payment.svg` | Zahlungsart |
| pickup | `assets/zackisch/icons/icon_pickup.svg` | Abholstatus |
| plate | `assets/zackisch/icons/icon_plate.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| print qr | `assets/zackisch/icons/icon_print_qr.svg` | QR-Druck-Einstieg |
| qr code | `assets/zackisch/icons/icon_qr_code.svg` | Dekoratives QR-Symbol für Marketing; keine Scanadresse |
| receipt | `assets/zackisch/icons/icon_receipt.svg` | Beleg-/Bestätigungsdarstellung |
| receipt list | `assets/zackisch/icons/icon_receipt_list.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| refresh | `assets/zackisch/icons/icon_refresh.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| remove | `assets/zackisch/icons/icon_remove.svg` | Menge reduzieren |
| scan | `assets/zackisch/icons/icon_scan.svg` | Scan-Aktion/Scanner-Funktion |
| search | `assets/zackisch/icons/icon_search.svg` | Suchen |
| settings | `assets/zackisch/icons/icon_settings.svg` | Einstellungen |
| shopping bag | `assets/zackisch/icons/icon_shopping_bag.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| smartphone | `assets/zackisch/icons/icon_smartphone.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| staff | `assets/zackisch/icons/icon_staff.svg` | Personalübersicht |
| staff tablet | `assets/zackisch/icons/icon_staff_tablet.svg` | Personal-Tablet-Kontext |
| star | `assets/zackisch/icons/icon_star.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| support | `assets/zackisch/icons/icon_support.svg` | Support/Eskalation |
| table number | `assets/zackisch/icons/icon_table_number.svg` | Tischidentität |
| takeaway | `assets/zackisch/icons/icon_takeaway.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| tip | `assets/zackisch/icons/icon_tip.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| upload photo | `assets/zackisch/icons/icon_upload_photo.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| view | `assets/zackisch/icons/icon_view.svg` | sekundäres dekoratives Icon für den bezeichneten UI-Kontext |
| warning | `assets/zackisch/icons/icon_warning.svg` | Warnhinweis mit Text |

**Wichtig:** Kritische Bedienaktionen ausschließlich mit Textlabel und Base-UI-semantischer Komponente. Doodle-Icons allein sind keine zugängliche Beschriftung. Im hochverdichteten Team-Dashboard dürfen sie zugunsten klarer Inter-/Lucide-kompatibler Systemicons entfallen; keine zusätzliche vollständige Icon-Library ohne technische Begründung einführen.

### 27.3 Fotografie und Website-Platzhalter

- `assets/zackisch/media/founder/founder_portrait_original.png`: reales Foto des Founders, nur für freigegebenen optionalen Founder-Abschnitt. **Keine irreführende Darstellung als Gast/Servicepersonal**.
- `assets/zackisch/media/mars/mars_combination_mark.svg`: bereitgestellte MARS-Markendatei; Nutzung und konkrete Partnerschaftsformulierung vor Veröffentlichung genehmigen lassen.
- Stockmotive dürfen erst nach Quellen-/Rechteprüfung im Produkt liegen. Bis echte Produkt-Screens existieren: graue, präzise beschriftete Flächen „QR-Aufsteller – echtes Foto folgt“, „Gäste-Menü – finaler Screenshot folgt“, „Personalansicht – finaler Screenshot folgt“ statt erfundener Interfaces.
- Nur **eine** illustrative Zackisch-Katze pro sichtbarem Hauptkontext; Kombinationslogo nicht in Gäste-App-Navigation. Auf QR-Aufsteller klein und dezent.


### 27.4 Verbindliche Website-Bildplatzhalter bis zum echten Produktscreenshot

Es liegen drei absichtlich **neutrale graue**, korrekt beschriftete, nicht irreführende Bilder bei: `assets/zackisch/media/placeholders/qr_stand_placeholder.png`, `assets/zackisch/media/placeholders/guest_menu_placeholder.png`, `assets/zackisch/media/placeholders/staff_tablet_placeholder.png`. Auf der öffentlichen Website nur bis zur Ersetzung durch echte freigegebene Produktbilder nutzen. Sie sind **keine Mockups mit behaupteter bereits implementierter Funktion**.


## Exact asset file references

### Approved preview masters
- `previews/font_approved.png`
- `previews/icons_approved.png`
- `previews/mascot_approved.png`

### Official logo masters
- `brand/combination_mark.svg`
- `brand/brand_mark.svg`

### Production icon assets
- `icons/icon_menu.svg`
- `icons/icon_qr_code.svg`
- `icons/icon_smartphone.svg`
- `icons/icon_scan.svg`
- `icons/icon_cart.svg`
- `icons/icon_order.svg`
- `icons/icon_receipt.svg`
- `icons/icon_payment.svg`
- `icons/icon_cash.svg`
- `icons/icon_confirm.svg`
- `icons/icon_close.svg`
- `icons/icon_add.svg`
- `icons/icon_remove.svg`
- `icons/icon_info.svg`
- `icons/icon_warning.svg`
- `icons/icon_search.svg`
- `icons/icon_filters.svg`
- `icons/icon_settings.svg`
- `icons/icon_dashboard.svg`
- `icons/icon_table_number.svg`
- `icons/icon_pickup.svg`
- `icons/icon_takeaway.svg`
- `icons/icon_cutlery.svg`
- `icons/icon_plate.svg`
- `icons/icon_print_qr.svg`
- `icons/icon_upload_photo.svg`
- `icons/icon_favorite.svg`
- `icons/icon_location.svg`
- `icons/icon_staff.svg`
- `icons/icon_support.svg`
- `icons/icon_call.svg`
- `icons/icon_message.svg`
- `icons/icon_notification.svg`
- `icons/icon_help.svg`
- `icons/icon_arrow_right.svg`
- `icons/icon_arrow_left.svg`
- `icons/icon_refresh.svg`
- `icons/icon_shopping_bag.svg`
- `icons/icon_tip.svg`
- `icons/icon_star.svg`
- `icons/icon_view.svg`
- `icons/icon_upload_photo_alt.svg`
- `icons/icon_order_ticket.svg`
- `icons/icon_receipt_list.svg`
- `icons/icon_staff_tablet.svg`
- `icons/icon_chat.svg`
- `icons/icon_card_payment.svg`
- `icons/icon_delete.svg`

### Production mascot assets
- `mascot/mascot_curious_welcome.svg`
- `mascot/mascot_happy.svg`
- `mascot/mascot_wink.svg`
- `mascot/mascot_focused.svg`
- `mascot/mascot_thinking.svg`
- `mascot/mascot_sleeping.svg`
- `mascot/mascot_excited.svg`
- `mascot/mascot_celebrating.svg`
- `mascot/mascot_peeking.svg`
- `mascot/mascot_helpful_guide.svg`
- `mascot/mascot_scan_qr.svg`
- `mascot/mascot_payment_success.svg`
- `mascot/mascot_order_received.svg`
- `mascot/mascot_order_ready.svg`
- `mascot/mascot_empty_state.svg`
- `mascot/mascot_error_404.svg`
- `mascot/mascot_offline_pause.svg`
- `mascot/mascot_support_listening.svg`

### Font assets
- `font/zackisch.ttf`
- `font/zackisch.woff2`
- `font/zackisch.css`

### Asset usage rules
- Never recreate the official full Zackisch logo from the font. Use `brand/combination_mark.svg`.
- Never redraw the mascot mark in code. Use `brand/brand_mark.svg` for the canonical mark and `mascot/*.svg` for expressive variants.
- Use `Inter` for product UI and `Zackisch` only for display accents.
