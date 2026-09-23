---
name: zakkig
description: Monochrome ordering and restaurant operations with clear, tactile controls
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

## Overview

**Creative north star: “Monochrome clarity for service in motion.”** zakkig uses a white working canvas, black primary actions, restrained gray boundaries, and destructive red. The marketing site adds editorial composition and a physical QR-paper motif; restaurant and guest interfaces prioritize task clarity. This is the shared design target. [AGENTS.md](AGENTS.md) sets required implementation rules, [the source-linked reference](docs/design-system.md) records current behavior and deviations, and [UX research](docs/ux-research.md) explains the evidence behind clarity and accessibility decisions. Shape, color, and spacing are brand choices, not promised conversion effects.

## Colors

Both apps use the same semantic base: white background/card/popover, black foreground/primary, near-white muted surface, readable gray text, distinct input and surface borders, and red destructive state. The website's site-muted, site-line, and site-soft alias those shared roles. The operational sidebar and selected setup/footer sections deliberately invert to black. [Token sources: webapp](webapp/app/globals.css), [website](website/app/globals.css).

**The Light Surface Rule.** Keep forms, guest content, and dialogs light. Use dark surfaces for intentional emphasis, not routine containment.

**The Semantic Red Rule.** Reserve red for errors and destructive actions; ordinary status and selection use neutral contrast.

## Typography

Poppins carries words and interface text. Isolated digits and decimal separators use Inter with tabular figures; currency signs, units, prefixes, and words remain Poppins. The webapp [Price component](webapp/components/ui/price.tsx) separates these roles. The website keeps a large editorial hero and compact supporting copy, using tracked uppercase for navigation links; the webapp restricts uppercase exclusively to physical QR code signage, keeping all interface labels and section titles in natural bold casing. Region names remain endonyms and visible copy and destinations are translated through next-intl. [Website typography](website/components/MainPage.tsx), [webapp tokens](webapp/app/globals.css).

**The Split Price Rule.** Use the webapp Price component for webapp prices, rather than applying Inter to a mixed-text parent.

## Layout

Tailwind's shared spacing unit is `0.25rem`: at a 16px root, one step is 4px, `p-2` is 8px, `h-9` is 36px, and `h-11` is 44px. Dashboard content responds to its available container width; the outer shell and the editorial website use viewport breakpoints. Guest content stays in a narrow, readable column. [Webapp tokens](webapp/app/globals.css), [website tokens](website/app/globals.css), [dashboard shell](webapp/components/dashboard/dashboard-shell.tsx).

**The Available Width Rule.** Use container queries inside dashboard work areas whose width changes with the sidebar. Use viewport breakpoints for the outer shell and website composition.

**The Datum Line Alignment Rule.** Main dashboard page titles and the sidebar zakkig logo share an exact 64px header height and horizontal datum line center at $y = 31.5\text{px}$ on desktop viewports. Dashboard headers use `sticky top-0 z-30 h-16` with `text-2xl font-bold tracking-tight text-foreground leading-none`.

**The Tailwind-First Rule.** In both apps, write expressible layout, spacing, type, responsive behavior, state, and motion with Tailwind utilities in JSX/TSX. Arbitrary values and variants are available. Reserve CSS for tokens, fonts, resets, keyframes, and genuine runtime or third-party constraints. [Authoring detail](docs/design-system.md#ds-15-tailwind-first-authoring).

## Elevation & Depth

Ordinary shadow tokens are valid transparent values (`0 0 #0000`), so borders and tonal layers establish normal hierarchy without accidental elevation. Explicit popup and dialog shadows identify floating layers. The website's printed QR sheet uses a deliberate physical shadow. [Webapp tokens](webapp/app/globals.css), [website tokens](website/app/globals.css), [QR showcase](website/components/QrCodeShowcase.tsx).

**The Boundary Rule.** Use a border or tonal fill for ordinary containment; use a visible shadow only for a floating or physical role.

## Shapes

Fields have 12px corners, cards and popups 20px, and dialogs 20px on mobile and 24px on desktop. Actions remain pills. Popup outer radius 20px, padding 8px, and item radius 12px form concentric corners. QR finder modules stay square. [Shared tokens](webapp/app/globals.css), [website tokens](website/app/globals.css).

**The Nested Radius Rule.** For uniformly padded nested shapes, set inner radius to outer radius minus padding.

## Components

Primary buttons are black; outline buttons are white with an input border; ghost buttons are quiet; destructive buttons are red. The `secondary` API remains an alias of outline. Shared default action height is 44px, compact height 36px (at least 44px for coarse pointers), and prominent guest payment height 48px. Controls use 14px semibold labels, an active press response, visible focus ring, and reduced-motion treatment. Inputs use 12px corners and 44px minimum height; cards use 20px. [Webapp button](webapp/components/ui/button.tsx), [input](webapp/components/ui/input.tsx), [website button variants](website/components/ui/button-variants.ts).

Dialogs use light surfaces and edge-to-edge dividers; inline errors remain left aligned and toasts sit top-center without duplicating visible errors. The website locale selector is a native dialog with translated options and focus restoration. [Dialog rule](AGENTS.md), [website modal](website/components/RegionLanguageModal.tsx). Specific flow behavior and known deviations are in the [reference](docs/design-system.md).

**The Inline Feedback Rule.** Put persistent, actionable errors beside the affected field or operation; use a toast only when it adds information.

## Do's and Don'ts

### Do

- Use the shared 4px spacing scale, semantic colors, and named control roles.
- Keep the principal next action distinct from supporting navigation; write descriptive labels.
- Preserve input values and visible error, focus, loading, disabled, and selected states.
- Use Tailwind utilities for styling they can express, including state and container variants.
- Check actual source and the [research reference](docs/ux-research.md) before making a behavior or outcome claim.

### Don't

- Use a dark modal or visible shadow as a general surface pattern.
- Treat `secondary` as a separate gray-filled button style.
- Apply Inter to words, currency symbols, or mixed-text parent containers.
- Hide required prices, selections, errors, or the next operational step.
- Treat a documented implementation deviation as permission to change the design rule.
