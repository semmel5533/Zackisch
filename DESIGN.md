---
name: zakkig
description: Monochrome ordering and restaurant operations with tactile controls
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0 0 0)"
  primary: "oklch(0 0 0)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  sidebar-accent: "oklch(0.18 0 0)"
  sidebar-border: "oklch(1 0 0 / 0.1)"
  site-muted: "#595959"
  site-line: "#e6e6e6"
  site-soft: "#f7f7f5"
typography:
  website-display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(52px, 6.2vw, 96px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  website-headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(32px, 4vw, 52px)"
    fontWeight: 600
    lineHeight: 1.17
    letterSpacing: "-0.035em"
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
    letterSpacing: "0.05em"
  numeric:
    fontFamily: "Inter, sans-serif"
rounded:
  base: "1.5rem"
  popup: "20px"
  popup-item: "12px"
  dialog-mobile: "20px"
  dialog-desktop: "24px"
  option: "14px"
  pill: "9999px"
spacing:
  unit: "0.3rem"
  "2": "0.6rem"
  "3": "0.9rem"
  "4": "1.2rem"
  "5": "1.5rem"
  "6": "1.8rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    height: "3.3rem"
    padding: "0 1.5rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "3.3rem"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "3.3rem"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    height: "3.3rem"
  select-trigger:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "3.3rem"
  popup:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.popup}"
    padding: "0.6rem"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.dialog-mobile}"
---

## Overview

**Creative North Star: "Monochrome clarity for service in motion"**

zakkig combines a quiet white working canvas with decisive black actions. The webapp favors fast scanning, clear boundaries, rounded controls, and immediate press feedback. The marketing website applies the same type and color foundation to an editorial composition and a physical QR-paper motif. This file records shared durable patterns; the [source-linked reference](docs/design-system.md) gives exact component and surface behavior.

**Key Characteristics:**

- White surfaces, black text and primary actions, gray containment, and red destructive states.
- Poppins for words; Inter with tabular figures for isolated digits and decimal separators.
- Pill actions, rounded cards and dialogs, and square QR modules.
- Container-responsive work areas, a narrow guest column, and a separate viewport-responsive website.
- Borders and tonal layers carry most depth; the website QR paper is a physical exception.

**The Evidence Rule.** Frontmatter records the shared token layer. Check the linked reference before treating a local override or an intended rule as universal.

## Colors

Both apps define the same OKLCH semantic base: white canvas and surface, black foreground and primary action, near-white secondary and muted surface, neutral gray metadata and border, and destructive red. The operational sidebar inverts to black with white text. The website defines extra neutrals for reading and hover surfaces.

**The Light Surface Rule.** Keep work areas, forms, dialogs, and guest content light. Reserve black fields for the operational sidebar, primary actions, and the website's dark setup and footer sections.

**The Semantic Red Rule.** Use destructive red for errors and destructive actions; use black or gray for ordinary status and selection.

## Typography

Poppins is the body and heading family in both apps. The website has a tightly tracked display and a 32–52px section headline. The webapp mostly uses 12–24px utility text, 14px bold tracked uppercase section labels, and a 20px bold dialog title. Inter is used for price digits, counters, order numbers, and timer numerals, while adjacent symbols and words remain in Poppins.

**The Split Price Rule.** In the webapp, render UI prices with its Price component: digits and decimal separator take Inter and tabular figures; the currency sign and translated prefix take the surrounding family. The website follows the family separation through its own numeric text pattern.

**The Endonym Rule.** Region names use native forms and visible UI copy and destinations are translated with next-intl.

## Layout

Both apps set Tailwind's spacing unit to 0.3rem: numeric utilities advance 4.8px per step at a 16px root. Thus p-2 is 9.6px and h-11 is 52.8px. Literal px, rem, clamp, and viewport values remain literal. Do not apply stock Tailwind measurements.

The dashboard and staff shell put a black sidebar beside a white content container. Dashboard content switches at 500px (tablet) and 1110px (desktop) of available container width; individual panels add thresholds such as 480px and 600px. Viewport lg still controls the outer sidebar. Guest content is centered within 500px. The website uses a 1200px content width, fluid 24–64px gutters and 72–128px sections, with viewport breakpoints for its hero, flow, and navigation.

**The Available Width Rule.** Use container queries inside dashboard content that can lose space to the sidebar. Use viewport breakpoints for the outer shell and website-wide composition.

## Elevation & Depth

All theme shadow definitions from 2xs through 2xl use zero-opacity color. A shadow utility alone therefore supplies no visible theme elevation. Borders, fills, overlays, and a few explicit nonzero shadows supply depth. The website's tilted QR paper has a restrained visible shadow and tape.

**The Boundary Rule.** Prefer a subtle border or tonal fill for normal containment. Visible shadows belong to surfaces with an explicitly floating or physical role.

## Shapes

Actions, select triggers, icon controls, and many tags are pills. Popup containers use a 20px outer radius with 0.6rem padding and 12px items. Dialogs use 20px at narrow widths and 24px at sm, with full-width header/footer dividers. The base radius is 1.5rem, so generated rounded-xl and rounded-2xl do not equal stock Tailwind sizes. Customization options use a 14px radius. QR modules and finder patterns use square or small-square styles.

**The Nested Radius Rule.** Preserve a clear inner and outer corner hierarchy. The current popup uses 20px outside and 12px inside with 9.6px padding, which is close to, but not exactly, concentric; the project convention targets outer radius minus padding.

## Components

The webapp button primitive offers default, outline, secondary, ghost, destructive, and link variants. It supplies xs, sm, default, lg, and four icon sizes. Default is black with white text, h-11, px-5, semibold 14px, full pill, hover color change, visible keyboard ring, disabled opacity, and active scale 0.98. The input primitive is an eight-step-high bordered rounded field with a focus and invalid ring. Select and dropdown share popup geometry. Cards use a large generated radius, surface fill, light ring, and variable internal spacing.

Dialogs have a light popup, edge-to-edge header divider, scrollable body, edge-to-edge footer divider, and pill actions. Guest ordering reveals the bottom cart action once the cart gains an item; customization exposes selected, unselected, and disabled option states; checkout uses a mobile sheet. The tracker renders in-progress, ready, and completed progression. Dashboard and staff shells share a sidebar pattern. Website CSS buttons are 44px high, distinct from webapp h-11.

**The Inline Feedback Rule.** Inline form errors use left-aligned destructive text; toasts sit top-center. Avoid duplicate inline and toast feedback for one error.

## Do's and Don'ts

### Do

- **Do** keep the main UI light and use black with white text for focal actions.
- **Do** calculate utility dimensions from this project's 0.3rem spacing unit.
- **Do** use Poppins for words and the webapp Price component for prices there.
- **Do** preserve visible focus, disabled, selected, loading, and error states.
- **Do** retain the distinct responsive models of the webapp and website.
- **Do** use Phosphor icons and translated UI copy.

### Don't

- **Don't** treat a zero-opacity theme shadow as visible elevation.
- **Don't** apply the website's 44px CSS button size to the webapp button primitive.
- **Don't** assume stock Tailwind spacing or radius values.
- **Don't** use a dark modal as a general surface pattern.
- **Don't** promote a documented code deviation into a new standard.
