# Zackisch Marketing Website — Design Concept & Art Direction System

> **Awwwards Quality Standard & Creative Direction**  
> Stand: 20. Oktober 2026 · Version 3.0 · Framework: Next.js App Router, Tailwind CSS, Base UI, Astryx Theme

---

## 1. Concept Card

```yaml
Idea:        Ein intelligentes digitales Menü, das mitdenkt – Bestellen & Bezahlen am Tisch, an der Theke oder zur Abholung, ohne Kassenwechsel und ohne Monatsgebühr.
Metaphor:    "Die Brücke zwischen Gast und Team": Der physische Moment (QR-Code auf dem Tisch/Tresen) verbindet die intuitive Gäste-Entscheidung nahtlos mit der realen Vorbereitung am Küchen-/Personal-Tablet.
Signature:   "Eine Bestellung. Drei Perspektiven." – Die interaktive Signature-Bühne verbindet physischen QR-Scan, Gast-Webapp (Smart Menu, Konfigurator, Checkout mit 0 % Trinkgeld-Default) mit dem Personal-Tablet (Zutaten-/Artikel-Verfügbarkeitstoggle) und Betreiber-Ledger.
Emotion:     Warm, souverän, bodenständig, transparent (PayPal-Klarheit trifft Mannheimer Gastfreundschaft).
Motion verb: "Gleiten und einrasten" (ruhige, organische Übergänge; präzise UI-Zustandswechsel ohne theatralisches Zappeln).
Screenshot:  Die Drei-Perspektiven-Bühne: Reales Café-/Restaurant-Ambiente mit edlem QR-Aufsteller, schwebendem Smartphone-Gastmenü und beleuchtetem Personal-Tablet.
```

---

## 2. Art Direction System

### Palette (Monochrom UI + Warme Gastro-Farben)
Die Benutzeroberfläche bleibt bewusst monochrom, ruhig und seriös. Die visuelle Lebendigkeit und Wärme stammen ausschließlich aus echter Fotografie und Speisen.

- **Ground (Papier/Hintergrund):** `#FFFFFF` (Surface) / `#F7F7F8` (Warm Canvas Off-White) / `#161618` (Dark Surface Footer)
- **Ink (Text primär):** `#0A0A0B` (Tiefes Schwarz, hoher Kontrast WCAG AAA)
- **Muted (Text sekundär):** `#52525B` (Ruhiges neutrales Dunkelgrau, WCAG AA konform auf weißem Grund)
- **Line (Bordüren & Trenner):** `#E4E4E7` (Sanfte 1px-Begrenzung)
- **Accent (Aktion & Brand):** `#111111` (Monochromer Hauptakzent, invertiert `#FFFFFF` auf Schwarz)
- **Highlight (Subtiles Badge/Tag):** `#F4F4F5` (Neutrale Kontrastpill)

### Typografie (Poppins Brand Font + Inter Tabular Data)
- **Brand & Headings:** `Poppins` (Google Font via `next/font/google`), Gewichte `400`, `500`, `600`, `700`.
  - H1: `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]`
  - H2: `text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug`
  - H3: `text-xl sm:text-2xl font-semibold leading-snug`
- **Body & Fließtext:** `Poppins`, `text-base sm:text-lg text-muted-foreground leading-relaxed`
- **Zahlen & Finanztabellen:** `Inter` mit `tabular-nums` / `tnum 1` für absolut flackerfreie, synchrone Kalkulator- und Ledger-Zahlen.

### Formen & Radien
- Große Bildmasken: `28px` bis `36px` (`rounded-3xl`)
- Panels & Dialoge: `20px` bis `24px` (`rounded-2xl`)
- Inputs & Buttons: weich abgerundete Ecken (`rounded-xl` bzw. `rounded-full` für Signature Pills)
- Einheitliche Astryx-Theme-Skalierung: `radius: { base: 8, multiplier: 1.25 }`.

### Grid & Kompositionsrhythmus
- **Desktop (1440px):** 12-Spalten-Grid mit asymmetrischen Brüchen. Keine repetitive "Drei-Karten-Reihe"-Ermüdung: Jede Sektion besitzt ihre eigene architektonische Struktur (Split-Hero, 2-Spalten-Statistik mit Großzahl, 4-Spalten Betriebsformen, 3-Perspektiven-Bühne, vertikales Rechner-Ledger, Gründersolitär).
- **Mobile (390px):** Klare, fokussierte Stapel, horizontal wischbare oder tab-gesteuerte Szenarien, große Touch-Ziele (min. `44px` bis `48px`).

---

## 3. Die Signature-Interaktion ("Eine Bestellung. Drei Perspektiven.")

### Konzept & Dramaturgie
Die Website demonstriert das Kernversprechen von Zackisch nicht in abstrakten Feature-Bullet-Points, sondern als zusammenhängende, voll spielbare Simulation ohne Backend-Zwang:

1. **Perspektive 1 — Der QR-Code vor Ort:**  
   Ein scanbarer bzw. mit einem Klick aktivierbarer QR-Aufsteller in drei wählbaren gastronomischen Betriebsmodi (Restaurant/Tisch, Café/Theke, Imbiss/Abholung).
2. **Perspektive 2 — Das Gast-Smartphone:**  
   Öffnet direkt im simulierten Smartphone-Frame. Zeigt die Speisekarte mit Bestseller-Kennzeichnung ("Über Zackisch häufig bestellt"), interaktiver Varianten-Konfiguration, smartem Warenkorb-Add-on ("Wird oft zusammen bestellt"), 0 % Trinkgeld-Default und sofortigem Bezahl-Simulationsbutton.
3. **Perspektive 3 — Das Personal-Tablet:**  
   Die bezahlte Bestellung trifft mit optischem Signal am Tablet ein. Das Team sieht Tisch-/Thekenbezug, Summe und Artikel.  
   **Das Hero-Feature:** Das Personal kann direkt auf dem Tablet einen Artikel oder eine Zutat (z. B. "Hafermilch" oder "Burrata") als *Ausverkauft* markieren. Die Gastansicht reagiert unmittelbar: Der Artikel ist sofort gesperrt.
4. **Perspektive 4 — Das Betreiber-Ledger:**  
   Zeigt die saubere Trennung von Speisenumsatz, separatem Trinkgeld, der 2 % Zackisch-Gebühr und Stripe-Gebühren.

---

## 4. Rechner v3 Spezifikation (docs/CALCULATOR_MODEL_SPEC.md)

- Genau zwei Nutzer-Eingaben: Zeitraum (`Tag` | `Monat` | `Jahr`) und bisheriger Nettoumsatz in Euro.
- **Default:** `Jahr` / `420.000 €` (entspricht `Monat` / `35.000 €` bzw. `Tag` / `1.400 €` bei 300 Öffnungstagen/Jahr).
- **Ergebnis:**
  - Zusätzlicher Nettoumsatz: **+18.840 € / Jahr** (+1.570 € / Monat, +62,80 € / Tag).
  - Modellierter zusätzlicher Ergebnisbeitrag: **+4.404,60 € / Jahr** (gerundet **+4.405 € / Jahr**; +367,05 € / Monat, +14,68 € / Tag).
  - **Personalkosteneinsparung: 0,00 €** (Arbeitszeit wird für Gastfreundschaft genutzt, nicht doppelt verrechnet).
- **Transparenzhinweis:** "Realistische Modellannahmen, illustratives günstiges Szenario, kein gemessener Zackisch-Erfolg."

---

## 5. Awwwards QA-Matrix & Kriterien

- [x] Barrierefreiheit: WCAG 2.2 AA (Fokusringe, ARIA, Farbkontraste min. 4.5:1, Skip-Link).
- [x] Tastaturnavigation: Alle Tabs, Rechner, Modale und Navigationsdropdowns vollständig bedienbar.
- [x] Motion: Respektiert `prefers-reduced-motion` vollständig.
- [x] Bildmaterial: 100 % echte lizenzierte Fotos (Pexels / Unsplash) und originales Gründerfoto `selim_full.png`. Keine generativen KI-Personen.
- [x] SEO & Internationalisierung: Vollständiges Zwei-Sprachen-System (`/de-de` und `/de-en`), echte HTTP-404 mit Sprachkontext, absolute Canonicals, `hreflang`, OpenGraph 1200x630, JSON-LD Schema.
- [x] Riesiges SVG-Wordmark unter dem Footer auf Desktop (wie bei Tinder).

---

## 6. Region & Language Dialog & Motion Architecture

- **Region & Language Dialog (`components/dialogs/region-language-dialog.tsx`):**
  - Accessible `@base-ui/react` modal dialog with backdrop blur (`bg-black/60 backdrop-blur-sm`).
  - Deutschland (DE) preselected and designated as the sole active operating region with an animated green pulse dot (`bg-emerald-500 animate-pulse`).
  - Österreich (AT) and Schweiz (CH) clearly designated as coming soon ("Demnächst") with disabled interactive states.
  - Seamless language switching (Deutsch / English) that preserves the current page pathname (`/de-de/*` <-> `/de-en/*`).
  - Accessible via both the Desktop/Mobile Header pill (`🇩🇪 DE · Deutsch ▾`) and the Footer region link.

- **Motion Architecture:**
  - **Lenis Smooth Scroll (`components/motion/smooth-scroll.tsx`):** Inertia-based smooth scrolling on desktop viewports, automatically disabled when `prefers-reduced-motion: reduce` is active.
  - **GSAP Scroll Reveals (`components/motion/gsap-reveals.tsx`):** `RevealOnScroll` and `AnimatedNumber` for fluid, organic viewport entrance transitions (`power3.out` easing, staggered delays).
