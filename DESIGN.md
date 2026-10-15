---
name: Zackisch
description: Monochrome Gestaltung für mobile Bestell- und Betriebsabläufe mit taktiler Klarheit
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0 0 0)"
  primary: "oklch(0 0 0)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.5 0 0)"
  input: "oklch(0.65 0 0)"
  border: "oklch(0.922 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  sidebar-accent: "oklch(0.18 0 0)"
  sidebar-border: "oklch(1 0 0 / 0.1)"
  site-muted: "oklch(0.5 0 0)"
  site-line: "oklch(0.922 0 0)"
  site-soft: "oklch(0.97 0 0)"
typography:
  website-display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(52px, 6.2vw, 96px)"
    fontWeight: 600
  website-headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(32px, 4vw, 52px)"
    fontWeight: 600
  dialog-title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  section-label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
  numeric:
    fontFamily: "Inter, sans-serif"
rounded:
  field: "12px"
  card: "20px"
  popup: "20px"
  popup-item: "12px"
  dialog-mobile: "20px"
  dialog-desktop: "24px"
  pill: "9999px"
spacing:
  unit: "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "2.75rem"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "2.75rem"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.field}"
    height: "2.75rem"
  popup:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.popup}"
    padding: "0.5rem"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.dialog-mobile}"
---

## 1. Gestaltungsphilosophie

**Visueller Leitstern: „Monochrome Klarheit für lebendige Betriebsabläufe.“** Zackisch setzt auf eine weiße Arbeitsfläche, schwarze Primäraktionen, zurückhaltende graue Abgrenzungen und semantisches Rot für Gefahren- und Abbruchoperationen. Die Marketingseite kombiniert redaktionelle Eleganz mit einem haptischen QR-Papier-Motiv; Gäste- und Betriebs-Oberflächen stellen Übersicht und Fehlertoleranz in den Mittelpunkt; Admin-Ansichten bieten kompakte, strukturierte Tabellen und visuelle No-Code-Editoren.

Maßgebliche Original-Markenassets sind `brand_mark` (nur Symbol) und `combination_mark` (Symbol und Wortmarke). Die Gestaltungsregeln sind funktionale und markenbezogene Designentscheidungen, keine Heilsversprechen für Konversionsraten.

---

## 2. Farben und Oberflächen

Alle drei Anwendungen (`website`, `webapp`, `adminapp`) nutzen dieselbe semantische Farbpalette:
- **Flächen:** Reines Weiß für Hintergrund, Karten und Popups (`bg-background`, `bg-card`).
- **Aktionen:** Reines Schwarz (`#000000`) für primäre Aktionsschaltflächen (`bg-primary`), aktive Navigationspills und ausgewählte Filter-Badges.
- **Linien & Grenzen:** Sanfte, neutrale Grauwerte (`oklch(0.922 0 0)`) für Ränder, Trennlinien und Eingaberahmen.
- **Hinweise & Fehler:** Reines semantisches Rot (`oklch(0.577 0.245 27.325)`) ausschließlich für Fehlermeldungen und destruktive Aktionen (z. B. Löschen).

**Die Regel der hellen Flächen:** Formulare, Gastinhalte und Dialoge bleiben durchgängig hell. Dunkle Flächen werden punktuell zur Hervorhebung primärer Aktionen eingesetzt, nicht als flächendeckende Container.

---

## 3. Typografie

- **Poppins:** Trägt alle Wörter, Überschriften, Schnittstellenbeschriftungen, Navigationspunkte, Schaltflächentexte und Währungssymbole.
- **Inter (`font-inter`, `tabular-nums`):** Wird streng und ausschließlich auf Ziffern (`0-9`) und Dezimaltrenner (`.` oder `,`) bei Preisen und Mengenangaben angewendet. Währungssymbole (`€`), Einheiten und Wörter bleiben in Poppins.
- **Preis-Komponente (`Price`):** In der Webapp trennt die Komponente `<Price cents={...} />` diese Rollen automatisch und verhindert typografische Mischfehler.
- **Schreibweise:** Natürliche Groß- und Kleinschreibung (Sentence- / Title-Casing). All-Caps ist ausschließlich für physische QR-Tischaufsteller und Ländercodes (`DE`, `AT`, `CH`) zulässig.

---

## 4. Formen und Maße

- **Gemeinsames 4px-Raster:** Tailwind-Einheit `0.25rem` (4 px). Standardhöhe für Steuerelemente ist `h-11` (44 px), kompakte Höhe `h-9` (36 px, mit automatischer Ausdehnung auf mindestens 44 px bei Touch-Bedienung).
- **Abrundungen (Border Radius):**
  - Eingabefelder: 12 px (`rounded-xl` bzw. `rounded-[12px]`)
  - Karten und Popovers: 20 px (`rounded-[20px]`)
  - Dialogfenster: 20 px mobil, 24 px auf Desktop (`rounded-[24px]`)
  - Aktionen und Schaltflächen: Pill-Form (`rounded-full`)

---

## 5. Komponentenstandard

- **Primärbuttons:** Schwarzer Hintergrund, weiße Schrift, pillenförmig (`h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm`).
- **Sekundärbuttons / Kontur:** Weißer Hintergrund, schwarze Schrift, feiner Rand (`border border-input hover:bg-zinc-50`).
- **Trennlinien:** Durchgängig von Kante zu Kante (`border-b border-border -mx-6 px-6`), niemals freischwebend oder eingerückt.
- **Feedback & Fehler:** Formularfehler stehen linksbündig und barrierefrei direkt unter dem betreffenden Eingabefeld (`text-destructive text-sm font-medium`); Toasts werden zentriert am oberen Bildschirmrand angezeigt.
