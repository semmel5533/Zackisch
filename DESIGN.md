---
name: zakkig
description: "Kontaktloses Bestellen & Bezahlen für moderne Gastronomie"
colors:
  primary: "#000000"
  primary-foreground: "#ffffff"
  background: "#ffffff"
  foreground: "#000000"
  card: "#ffffff"
  card-foreground: "#000000"
  popover: "#ffffff"
  popover-foreground: "#000000"
  secondary: "#f7f7f7"
  secondary-foreground: "#000000"
  muted: "#f7f7f7"
  muted-foreground: "#71717a"
  accent: "#000000"
  accent-foreground: "#ffffff"
  destructive: "#dc2626"
  destructive-foreground: "#ffffff"
  border: "#ebebeb"
  input: "#ebebeb"
  ring: "#000000"
  sidebar: "#000000"
  sidebar-foreground: "#ffffff"
  sidebar-primary: "#ffffff"
  sidebar-primary-foreground: "#000000"
  sidebar-accent: "#2e2e2e"
  sidebar-accent-foreground: "#ffffff"
  sidebar-border: "rgba(255, 255, 255, 0.1)"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, sans-serif, system-ui"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, ui-sans-serif, sans-serif, system-ui"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Poppins, ui-sans-serif, sans-serif, system-ui"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, ui-sans-serif, sans-serif, system-ui"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, ui-sans-serif, sans-serif, system-ui"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
---

# Design System: zakkig

## Overview

**Creative North Star: "Radical Monochrome Precision"**

zakkig represents the intersection between high-performance operational utility and editorial architectural minimalism. Built for high-tempo hospitality environments—from lively bar counters to bustling pizza kitchens and seamless table ordering—the interface delivers instant readability, zero cognitive friction, and unmistakable confidence.

The aesthetic philosophy rejects decorative fluff, low-contrast dark grays, and faux-glassmorphism. Instead, it commits to a crisp, high-contrast palette (`#000000` / `#ffffff`) with clean light surfaces across dialogs, modals, and auth screens. Dark/black backgrounds are intentionally restrained and never overused, ensuring the webapp feels light, fresh, and airy. Every element has a definitive boundary, purposeful typography, and crisp tactile feedback.

**Key Characteristics:**
- **Absolute Contrast:** Deepest black (`#000000`) and pure white (`#ffffff`) as the core aesthetic engine; no dark gray substitutes (`#171717`, `#18181b`).
- **Light Surface Architecture:** Dialogs, action drawers, confirmation alerts, and auth pages render on clean light surfaces (`bg-background` / `bg-card`) with crisp borders (`border-border`). Pure black is reserved for focal points: the dashboard sidebar, primary CTAs, and key badges.
- **Numerical Legibility (Inter for Digits):** All digits, prices, order counts, stats, and tabular data render in the Inter font (`tabular-nums`, `font-inter`) for optimal scanning.
- **Iconographic Discipline:** Exclusively Phosphor Icons (`@phosphor-icons/react`); absolutely zero emojis across code, UI, or communications.
- **Operational Speed:** Clear status badges, immediate touch targets, and persistent sticky carts designed for mobile one-handed guest ordering and kitchen glanceability.

## Colors

The palette is strictly monochromatic and high-contrast, supported only by muted neutrals for borders and secondary metadata, plus a single semantic destructive red.

### Primary
- **Absolute Black** (`#000000` / `oklch(0 0 0)`): The authoritative primary token. Used for primary buttons, dashboard sidebar background, brand headers, and high-impact action badges.
- **Absolute White** (`#ffffff` / `oklch(1 0 0)`): Primary canvas background, dialog surfaces, and primary button labels.

### Neutral
- **Muted Surface** (`#f7f7f7` / `oklch(0.97 0 0)`): Subtle secondary button backgrounds, input backdrops, and card hover fills.
- **Border & Divider** (`#ebebeb` / `oklch(0.922 0 0)`): Hairline structural separators, table borders, and default card outlines.
- **Subdued Text** (`#71717a` / `oklch(0.556 0 0)`): Helper text, descriptions, tax disclaimers, and timestamps.
- **Dark Sidebar Accent** (`#2e2e2e` / `oklch(0.18 0 0)`): Active item indicators inside the dark dashboard navigation.

### Destructive
- **Destructive Red** (`#dc2626` / `oklch(0.577 0.245 27.325)`): Reserved exclusively for irreversible actions (e.g. deleting categories, cancelling orders, deleting accounts).

### Named Rules
**The True Black Rule.** Never substitute `#000000` with dark charcoal or off-black hex codes (such as `#171717`, `#18181b`, `#121212`, or `zinc-900`). Primary buttons, sidebar panels, and brand highlights must resolve to pure `#000000`.

**The Light Surface & Dialog Rule.** Dark/black backgrounds must never be overused. Every modal, confirmation dialog, customization sheet, and auth page across both the guest frontend and merchant dashboard must render on a light background (`bg-background text-foreground` or `bg-card text-card-foreground`) with a subtle dimming backdrop (`bg-black/50 backdrop-blur-xs`) and clean borders (`border-border`). Pure black is reserved for high-impact accents (sidebar, primary CTAs).

## Typography

**Primary Font Family:** `Poppins, ui-sans-serif, sans-serif, system-ui`

**Character:** Geometric, modern, and punchy. Poppins brings architectural weight to bold display headlines while remaining remarkably legible in dense kitchen tickets and ingredient modifier lists.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3rem)`, `line-height: 1.1`, `tracking: -0.02em`): Hero headlines on the marketing website and primary dashboard welcome titles.
- **Headline** (SemiBold 600, `1.5rem` / `24px`, `line-height: 1.25`, `tracking: -0.01em`): Category section headers, modal titles, and large KPI metrics.
- **Title** (SemiBold 600, `1.125rem` / `18px`, `line-height: 1.3`): Menu item names, dialog sub-headers, and order ticket numbers.
- **Body** (Regular 400, `0.875rem` / `14px`, `line-height: 1.5`, `max-width: 65ch`): Item descriptions, explanations, and general paragraph content.
- **Label** (Medium 500, `0.75rem` / `12px`, `tracking: 0.05em`, uppercase when tabular): Status badges, table indicators, and metadata tags.

### Named Rules
**The Zero-Emoji Rule.** Emojis are strictly banned from all user-facing copy, code, comments, and commit messages. UI iconography must use Phosphor Icons exclusively.

**The Strict i18n Rule.** Never hardcode text strings in JSX or emails. All user-facing strings must be localized via `next-intl` or centralized translation dictionaries (`t("key")`).

**The Numerical Typography Rule (Strictly Digits Only in Inter).** Poppins is the primary font for everything across `webapp` and `website`. Strictly and exclusively numeric digits (`0-9`) and decimal separators (`.` or `,`) render in **Inter** (`font-inter tabular-nums`) for maximum legibility. Currency symbols (`€`), price prefixes (`ab`, `+`), units, and words remain in Poppins. All price displays must use the `<Price>` component.

## Layout

- **Spacing Rhythm:** Based on an 8pt spatial grid with a compact base spacing unit (`0.3rem` / `4.8px`). Common paddings: `p-3`, `p-4`, `p-6`.
- **Guest Mobile Frame:** Public guest ordering pages (`to-go`, `to-stay`) are designed mobile-first (`max-w-md` or `max-w-lg` centered container), optimizing for one-handed thumb interaction with sticky bottom navigation.
- **Merchant Dashboard Frame:** Two-column layout with a fixed high-contrast black sidebar (`bg-sidebar`) on desktop and fluid content canvas (`flex-1 p-6 md:p-8`).
- **Availability & Kitchen Terminals:** Glanceable full-screen responsive cards, maximizing horizontal and vertical density for tablet mounting.

## Elevation & Depth

The system uses a flat, border-defined architectural spatial model. Surfaces differentiate themselves through sharp tonal contrast rather than layered elevation shadows.

### Shadow Vocabulary
- **Shadow Zero / Flat** (`none`): Standard state for cards, tables, inputs, and inline controls. Separation is established via `border-border`.
- **Subtle Ambient Lift** (`shadow-xs` / `0 1px 3px rgba(0,0,0,0.05)`): Light floating elevation for interactive menu cards and dropdown menus.
- **Dialog Modal Lift** (`shadow-2xl` / `0 25px 50px -12px rgba(0,0,0,0.25)`): Light modal elevation above the dimmed backdrop overlay.

### Named Rules
**The Border-Over-Shadow Rule.** Structural containment must always be achieved through a clean 1px border stroke (`border border-border`) rather than heavy drop shadows.

## Shapes

- **Base Radius:** `--radius: 1.5rem` (24px).
- **Cards & Modals:** `rounded-2xl` (20px) to `rounded-3xl` (24px) for container enclosures.
- **Buttons & Inputs:** `rounded-lg` (8px to 12px) for form elements; `rounded-full` for pills and quick-action chips.
- **Item Image Banner:** Full-width top banner with `overflow-hidden`, perfectly clipped to the container top corners with `object-cover`.

## Components

### Buttons
- **Primary Button:** `bg-black text-white hover:opacity-90 active:scale-[0.98] transition-all rounded-lg font-medium px-4 py-2` (or `rounded-full` for pill CTAs).
- **Secondary Button:** `bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98] rounded-lg px-4 py-2`.
- **Dialog Action Button:** `bg-black text-white hover:bg-neutral-800 font-semibold rounded-full px-5 py-3.5 transition-transform active:scale-[0.98]`.
- **Destructive Button:** `bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full px-4 py-2`.

### Light Dialogs & Sheets
- **Container:** `bg-background text-foreground border border-border rounded-2xl sm:rounded-3xl shadow-2xl p-6 max-w-lg`.
- **Overlay:** `fixed inset-0 bg-black/50 backdrop-blur-xs`.
- **Header:** High-contrast title with close button (`CaretDown` / `X` icon in `16px`, `weight="bold"`).
- **Footer:** Bottom action bar with border divider `border-border`, hosting full-width action buttons with left-aligned label and right-aligned dynamic price.

### Floating Cart Bottom Card (Guest Ordering)
- **Container Card:** Slides up from the bottom when `itemCount > 0`. Styled as a crisp white bottom card (`bg-background border-t border-border rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]`).
- **Action Button:** Full-width pill button (`bg-black text-white rounded-full h-12 sm:h-14 px-4 sm:px-5 flex items-center justify-between`) containing:
  - Left: Circular quantity badge (`w-6 h-6 rounded-full bg-white text-black font-inter tabular-nums font-bold flex items-center justify-center text-xs sm:text-sm`).
  - Center: "Zum Warenkorb" label.
  - Right: Formatted total price in Inter font.
- **Visibility:** Automatically hidden when cart is empty; mounts smoothly when `itemCount > 0`.

### Menu & Availability Item Cards
- **Image Banner:** Full-width `h-40 sm:h-48` top image with `object-cover` and `overflow-hidden`.
- **Sold-out State:** Deactivated or unavailable items automatically transition to `grayscale opacity-75` with line-through text.
- **Guest Ordering Action Button:** Large full-width pill button (`rounded-full h-11 sm:h-12 w-full px-4 sm:px-5 flex items-center justify-between`) uniting the add action with the price. The left side holds the `<Plus>` icon, *"Hinzufügen"* label, and quantity badge; the right side displays the formatted price (including dynamic *"ab"* prefix for customizable items).

### Email Templates
- **Canvas:** `#f4f4f5` outer background, `#ffffff` card container (`border-radius: 24px`).
- **Brand Header:** Center-aligned or left-aligned `https://www.zakkig.de/full.svg` brand logo (`height: 56px`).
- **Headline & Links:** `#000000` bold typography, underlined links.
- **Code Box:** `#000000` rounded container (`border-radius: 16px`) with crisp `#ffffff` 48px tracked digits in Inter.
- **Action Button:** `#000000` rounded button with white text.

## Do's and Don'ts

### Do:
- **Do** use `#000000` and `#ffffff` as the unambiguous foundation for all primary UI surfaces.
- **Do** ensure all dialogs, modals, customization sheets, and auth screens render on clean light surfaces (`bg-background` / `bg-card`).
- **Do** render all numbers, prices, counters, and statistics in Inter (`tabular-nums font-inter`).
- **Do** wrap the guest floating cart button in a clean bottom card container that slides up from the bottom.
- **Do** use `@phosphor-icons/react` icons exclusively with standard weights (`regular` or `bold`).
- **Do** position toast notifications strictly at `top-center`.
- **Do** keep form error messages left-aligned with `text-destructive text-sm font-medium` without alert boxes or icons.
- **Do** format all guest ordering prices with proper localization (e.g. `12,50 €`).
- **Do** render item images in availability and menu screens as full-width top banner cards (`object-cover`).

### Don't:
- **Don't** use emojis anywhere in the codebase, UI, comments, or documentation.
- **Don't** introduce dark charcoal values like `#171717`, `#18181b`, or `zinc-900` for primary black elements.
- **Don't** overuse black backgrounds; preserve a light, fresh, airy feel across the entire application.
- **Don't** render dark inverted dialogs or modals anywhere in the application.
- **Don't** hardcode language strings directly in JSX or templates; always use `t("key")`.
- **Don't** use arrow icons next to prices in the floating cart banner.
- **Don't** add decorative AI comment dividers (`// ──────...──────`) or temporary debug logs.
- **Don't** allow client components to call mutating Convex functions directly without going through Server Actions.
