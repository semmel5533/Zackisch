---
name: Zackisch
description: Human service with an additional browser QR ordering route
colors:
  black: "#000000"
  white: "#FFFFFF"
  citron: "#C6FF34"
  citron-subtle: "#F7FFDF"
  citron-soft: "#EFFFBB"
  citron-selected: "#9FD600"
  text-secondary: "#525252"
  border: "#E5E5E5"
  hover-neutral: "#171717"
  error: "#C62828"
typography:
  marketing-display:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "clamp(3rem, 6.7vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  marketing-display-mobile:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  marketing-headline:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 4.7vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  marketing-chapter-title:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  marketing-intro:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "1.25rem"
    lineHeight: 1.45
  body:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.5
  button-label:
    fontFamily: "League Spartan, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  dialog: "24px"
  marketing-pill: "999px"
  marketing-panel: "32px"
spacing:
  compact: "8px"
  control-y: "12px"
  body: "16px"
  control-x: "20px"
  group: "24px"
  surface: "32px"
  section-mobile: "64px"
  section-desktop: "96px"
components:
  marketing-button-primary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    rounded: "{rounded.marketing-pill}"
    typography: "{typography.button-label}"
    padding: "12px 20px"
    height: "48px"
  marketing-button-primary-hover:
    backgroundColor: "{colors.hover-neutral}"
    textColor: "{colors.white}"
  marketing-button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.marketing-pill}"
    typography: "{typography.button-label}"
    padding: "12px 20px"
    height: "48px"
  marketing-placeholder:
    textColor: "{colors.black}"
    rounded: "{rounded.dialog}"
    padding: "40px"
  marketing-chapter:
    backgroundColor: "{colors.citron-subtle}"
    textColor: "{colors.black}"
    rounded: "{rounded.marketing-panel}"
    padding: "64px"
---

# Zackisch — Brand & Product Design System

> **Version 1.3 · 6 November 2026 · Canonical design specification**
> Applies to `root/` (public website), `app/` (merchant/guest/staff), `support/` and `internal/`.
> This document defines the **new** visual direction. It intentionally does not inherit, preserve, or adapt the repository's previous visual identity. It does **not** change checkout, POS or payment behavior.

## 0. Quick decisions

| Area | Non-negotiable rule |
|---|---|
| Identity | Original `wordmark.svg` and `signet.svg` supplied by the founder; their vector outlines stay intact and **always #000000**. No recoloring. |
| Foundation | Pure white `#FFFFFF`, pure black `#000000`, **Electric Citron `#C6FF34`**. No substitutions. |
| Selection | On Citron menus: background `citron.300` (`#C6FF34`); selected **pill** `citron.500` (`#9FD600`), black font weight **700**, Phosphor icon **fill** when an icon is present (inactive **regular**); **no black marker, stripe, dot or side border**. |
| Feedback | **Every meaningful status, including Error, uses a recognizable Phosphor status icon + explicit text.** Only Error has a separate hue: icon/message/border `#C62828`. Success, Warning, Info and Pending stay black/gray, distinguished by icon shape and wording — never green/yellow/blue. |
| Typography | **League Spartan** across marketing and app, weights 400/500/600/700/800; the public marketing hero uses variable weight 650. Original letterforms of the logo are artwork, not retyped in the font. |
| Icons | **Phosphor** exclusively and **only where they add information**. No icons automatically on every button, field, card, menu item or metric; see §6. |
| Shape | Rounded language. Pill buttons, menu items, tabs and chips. Large rounded cards; input corners 16px for a practical floating-label field. |
| Inputs | Persistent accessible `<label>` inside the outline. Resting: centered; on focus **or filled**: floats to upper inner edge, never disappears. |
| Imagery | Candid, people-first photographs showing real hospitality, staff, guests, smiles and authentic service; no generic corporate stock mood. |
| Print QR | Printable guest-order QR output **black ink on white paper only**; centered black signet; no brand colors. Documented here only: **no QR templates or QR code assets included in this package**. |
| Product | Human-centered: service stays human; Zackisch removes ordering/payment friction. Quick, obvious, honest and accessible. |

## 1. Brand strategy

### Brand idea

**Human service, without unnecessary waiting.** Zackisch adds optional browser-based QR ordering and payments to existing hospitality workflows. The restaurant keeps its POS and service choices; guests do not need an app/account. The visual system should feel **direct, warm, fast, trustworthy, calm** — more useful product than neon experiment.

- **Personality:** approachable, confident, practical, cheerful without being childish; transparent and never coercive.
- **Promise:** “Deine Kasse bleibt. Deine Gäste bestellen selbst.” Use as an approved product message when contextually accurate; do not imply Zackisch replaces the POS or guarantees operations.
- **Visual tension:** vivid Electric Citron for recognition; otherwise confident black typography, clean white pages, warm human photography and generous whitespace.
- **Audience by surface:** owners need trustworthy setup/billing, staff need fast operational clarity, guests need rapid mobile decisions, support users need readable instructions, internal staff need dense and reliable data.
- **Primary languages:** German first; all UI must accept longer German copy and English translations, and be localization-ready.

### Writing and interaction voice

Write in plain language and present a next action. Prefer “Bestellung abschicken”, “Zahlung prüfen”, “Erneut versuchen” over jargon. Never mask the difference between *order submitted*, *payment authorized*, *payment successful* and *order accepted*. Errors state what failed and what the user can do safely, particularly with payments. Avoid clever copy in permission, legal, payment, tax and checkout dialogs.

## 2. Brand assets and logo governance

**The two original source files are authoritative:** `root/public/brand/logo/original/signet.svg` and `root/public/brand/logo/original/wordmark.svg`. They are **byte-identical** to the supplied cropped vectors, with neither white space nor a new font. Every derivative includes **only** the unmodified black artwork, optionally positioned within a white or Electric Citron canvas. **No slogans, taglines, headings, supporting text, illustrations, decorative frames, shadows, extra marks or additional logo combinations** are allowed in any published logo/social asset. Never typeset the wordmark using League Spartan. The logo is *always* `#000000`; there is no white or colored-reversal mark.

### Curated source, lockup and platform formats

| Layer | Exact location / naming | Practical use |
|---|---|---|
| Original / zero padding | `root/public/brand/logo/original/{signet,wordmark}.svg` | Tight transparent vector source; retain unchanged |
| Responsive padded SVG | `root/public/brand/logo/lockups/{signet,wordmark}--{transparent,white,citron}--{standard,spacious}.svg` | UI header, marketing layout, presentations, email signature; CSS scalable |
| Bitmap fallback | `root/public/brand/logo/lockups/{signet,wordmark}--{background}--{padding}--{width}w.png` | Fixed-resolution placement when SVG is not supported |
| Favicon | `root/public/brand/logo/platform/signet--favicon.{svg,ico}` and `signet--favicon--32.png` | Browser tab/bookmarks; rounded 28%-radius Citron tile with transparent outer corners; ICO 16/32/48 px |
| Apple touch | `root/public/brand/logo/platform/signet--apple-touch--180.png` | Full-bleed square Citron; OS applies rounded mask automatically |
| PWA | `root/public/brand/logo/platform/signet--pwa--{192,512}.png`, `signet--pwa-maskable--512.png` | `any`: round-square/transparent corners; `maskable`: full-bleed square for OS-provided mask |
| Social profile | `root/public/brand/logo/social/signet--avatar--400.png` | Square avatar, centered and circle-crop safe |
| Open Graph | `root/public/brand/logo/social/wordmark--og--{citron,white}--1200x630.png` | Link preview / OG and large social card; logo only |

This is an **intentionally constrained** set, not a collection of all export sizes a design tool can generate. No redundant WebP logos, 10-size PNG ladders, standalone social banners, platform-specific extra dimensions, old logo variants or combined wordmark/signet compositions. A dedicated social-cover asset should be added **only after** an actual platform's cover crop and requirements are confirmed; render the existing original artwork, without slogans.

### Backgrounds, padding and clear space

- **Approved artwork color:** black `#000000` only. **Approved export backgrounds:** transparent, white `#FFFFFF`, Citron 300 `#C6FF34`. Transparent is true alpha; do not bake in a fake checkerboard or gray canvas.
- **Original tight:** supplied cropped SVG with zero added padding, for precise developer placement. It is *not* a recommended final lockup for social publishing or fixed-size UI.
- **Standard:** practical default. Signet occupies ~72% of square canvas height; wordmark has clear space of `0.35×` source mark height on every side.
- **Spacious:** for visually isolated placements and co-branding. Signet occupies ~58% of a square canvas; wordmark clear space `0.85×` source mark height on every side.
- **Platform treatments:** favicon icon is deliberately larger (~80% signet height) for tiny tab sizes; its Citron canvas has strongly rounded (28% radius) corners with actual transparent exterior. PWA `purpose=any` uses the same rounded-square treatment at ~70% signet height. Apple Touch must remain opaque square because iOS rounds it; PWA `maskable` must remain opaque square because Android/OS masks it. Both preserve original artwork and safe areas; 512px maskable and round-cropped avatar use ~58% high signet. Check actual device/platform crops before release.
- When placing an original tight SVG in a custom layout, reserve at least the **standard** clear space around it and test at actual display size. Do not stretch, rotate, recolor, outline, add filters or draw a replacement wordmark.

### Asset integration and quality control

All filenames in the delivered brand library begin with **`signet`** or **`wordmark`** (besides the machine-readable `manifest.json`); the original artwork stays in `original/`. File naming follows `mark--background--padding--size`, so a developer can reliably choose the needed variant. `root/public/brand/logo/manifest.json` lists every exported file, its specific purpose, format, pixel dimensions where relevant and SHA-256 checksum. A background-specific file is visually just the black logo on that color, nothing else.

Prefer SVG for web/UI and editable vector handoffs; use exact-size PNG only for systems requiring raster. For Next.js App Router, copy/route the relevant source under the framework's expected metadata name or configure `metadata.icons`; this runtime wiring does **not** rename the source asset in the design library. The same **1200×630** OG PNG may be used for a large social share card; site titles and descriptions belong in HTML/OG metadata, **not printed onto the graphic**. Asset filenames and platform masks are listed above.

**QR printing is not a logo asset export.** Printed order QR designs are specified later in this document: functional black on white, a black signet centered only when scan reliability allows, no Citron or ornamentation. **No QR codes, table-tent print layouts or PDFs belong in this package.**

## 3. Palette — primitives

Three fixed brand values:

| Primitive | Hex | Function |
|---|---|---|
| `color.ref.white` | `#FFFFFF` | Default canvas and content surfaces |
| `color.ref.black` | `#000000` | Logo, headings, buttons, nav labels, icons |
| `color.ref.citron.300` | `#C6FF34` | Brand identity, logo canvas, navigation background, emphasis |

**Citron scale**

| Token | Value | Use |
|---|---|---|
| `citron.50` | `#F7FFDF` | Gentle content emphasis |
| `citron.100` | `#EFFFBB` | Highlight card backgrounds |
| `citron.200` | `#DEFF8C` | Hover fill and neutral accent surfaces |
| **`citron.300`** | **`#C6FF34`** | **Fixed primary** |
| `citron.400` | `#B6EF15` | Intermediate tone, use sparingly |
| **`citron.500`** | **`#9FD600`** | **Selected navigation/menu item** |
| `citron.600` | `#79A800` | Deeper accent (use only with contrast audit) |
| `citron.700` | `#506E00` | Exceptional dark detail; not standard sidebar |
| `citron.800` | `#354A00` | Exceptional illustration only |
| `citron.900` | `#1E2B00` | Exceptional illustration only |

**Neutral grayscale**

| Token | Value | Default use |
|---|---|---|
| `gray.50` | `#FAFAFA` | Quiet page sections, table headers |
| `gray.100` | `#F5F5F5` | Muted cards, hover surfaces, skeleton highlight |
| `gray.200` | `#E5E5E5` | Dividers, skeleton base, noncritical borders |
| `gray.300` | `#D4D4D4` | Stronger borders, disabled tracks |
| `gray.400` | `#A3A3A3` | Disabled UI, not regular body copy |
| `gray.500` | `#737373` | Tertiary text only after context-specific contrast review |
| **`gray.600`** | **`#525252`** | **Descriptions and supporting copy** |
| `gray.700` | `#404040` | Strong secondary labels |
| `gray.800` | `#262626` | Black-button hover, near-black UI |
| `gray.900` | `#171717` | Inverse near-black surfaces only if needed |

**Error:** `color.ref.error = #C62828` for error icons, borders, messages and blocked destructive confirmation. It is deliberately **not** a fourth brand accent. A destructive action must be plainly labeled and offer meaningful safeguards. No separate success green, warning orange or info blue.

## 4. Token architecture and implementation

**Canonical source:** `root/public/brand/tokens/design-tokens.json` uses Design Tokens Community Group 2025.10-style `$type`, `$value`, type-aware values and aliases. Reference the source tokens by semantic intent rather than copying a hex into components:

1. **Reference / primitive:** `color.ref.*`, `space.*`, `radius.*`, `typography.*`, `motion.*`.
2. **Semantic:** `color.semantic.text.primary`, `.background.canvas`, `.navigation.item-active`, `.skeleton.base`.
3. **Component:** `component.sidebar.item-radius`, `component.input.height`, `component.card.radius`.

**Deliverables:** `root/public/brand/tokens/tokens.css` (CSS custom properties), `root/public/brand/tokens/tokens.ts` (TypeScript lookup), `root/public/brand/tokens/tailwind-v4.css` (optional theme bridge), `root/public/brand/tokens/theme.css` (base reset/typographic use), `root/public/brand/tokens/contrast-audit.json` (reference audit). Do not invent duplicate per-app token catalogs. CSS tokens use `--zk-` prefix, e.g. `--zk-color-semantic-navigation-item-active`.

A token is not permission to use a color everywhere. Red is strictly error; dark Citron is not a global sidebar treatment; neutral, white and black make up most application surfaces.

### Most-used semantic assignments

| Purpose | Semantic token | Resolved example |
|---|---|---|
| Main app canvas | `background.canvas` | White |
| Secondary page section | `background.subtle` | Gray 50 |
| Main content card | `card.default` | White |
| Soft card | `card.subtle` | Gray 50 |
| Featured card | `card.emphasis` | Citron 100 |
| Main text | `text.primary` | Black |
| Descriptions | `text.secondary` | Gray 600 |
| Muted micro-label | `text.tertiary` | Gray 500, review 12px contrast |
| Border | `border.default` | Gray 200 |
| Input border | `field.border` | Gray 300 (not sole affordance) |
| Focus border / ring | `border.focus` | Black |
| Main action | `action.primary` | Black with white label |
| Alternative accent action | `action.accent` | Citron 300 with black label |
| Sidebar/menu surface | `navigation.background` | Citron 300 |
| Selected nav/menu fill | `navigation.item-active` | Citron 500 |
| Loading skeleton | `skeleton.base` / `skeleton.shimmer` | Gray 200 / 100 |
| Notification error | `status.error` / `text.error` | Red |
| Other feedback | `status.success` / `status.warning` / `status.info` | Black |
| Print QR | `qr.dark` / `qr.light` | Black / white |

### Contrast and accessibility constraints

- On Citron 300 and 500 **always black** for nav text and icons, not white. Black-on-Citron is high contrast.
- Citron 300 and 500 differ by only about **1.47:1**. Therefore background color alone **must not** carry selection: use a complete rounded selection shape, bold 700 label and **Phosphor `fill` icon if present** (inactive `regular`); expose `aria-current="page"` on navigational links, `aria-selected` only for the correct selectable widget pattern. No decorative marker, line, stripe or dot. Keep keyboard focus as a **separate** high-contrast ring using `:focus-visible`.
- W3C WCAG 2.2 AA target: text 4.5:1 normal, 3:1 large; essential graphical/UI-state indicators 3:1 against relevant adjacent colors. Verify each context, including focused/error/disabled and forced-colors. Do not assume selected fill alone satisfies non-text state contrast. In Windows forced-colors mode an OS-visible selected outline is allowed only as an accessibility fallback, **not part of the default branding**.
- Never communicate error *only* via red: always pair with accessible message, icon and recovery action. Never distinguish success/warning/info purely through color, as no separate hue exists for those.
- A supporting description in Gray 500 at 12px may be too low-contrast in smaller UI. Prefer Gray 600 for operational copy.

## 5. Typography

Use **League Spartan** in every property, including data tables, labels, mobile checkout and support article text. The custom Zackisch wordmark is never recreated as typeset League Spartan.

| Text role | Size / line height | Weight |
|---|---|---|
| Hero | 48–60px / 1.05–1.1 | 700–800 |
| Page title | 32–36px / 1.15 | 700 |
| Section title | 24px / 1.2 | 700 |
| Card title | 18–20px / 1.3 | 600–700 |
| Body | 16px / 1.5 | 400–500 |
| Compact data / desktop nav | 14px / 1.4 | 500 |
| Helper / captions | 12–14px / 1.45 | 500; avoid critical 12px |
| Numeric data / amounts | 16–36px, according to hierarchy | 600–700; `font-variant-numeric: tabular-nums` |

Load the approved self-hosted League Spartan font from `root/public/brand/fonts/`, with all required weights, `font-display: swap` and sensible fallback fonts. The other applications use the absolute website URL with the configured CORS headers. Ensure the correct diacritics and German numeric formatting. Prefer tighter letter spacing only for large display, not microcopy. Preserve legibility in long support articles: cap line length around 65–75 characters and use generous line height. Optical sizing varies; test text in actual browsers and zoom.

### Public marketing scale — root only

The table above remains the operational UI scale for merchant, guest, staff, support and internal screens. The public website has a separate responsive display hierarchy to support the founder's requested desktop emphasis. This exception does not enlarge checkout controls, dashboards or support reading text.

| Public website role | Implemented size / line height | Weight / tracking |
|---|---|---|
| Hero, widths from 400px | `clamp(3rem, 6.7vw, 6rem)` / 0.98; maximum 96px at the default root size | 650 / −0.035em |
| Hero, widths through 399px | 2.6rem / 0.98 | 650 / −0.035em |
| Marketing section heading | `clamp(2.6rem, 4.7vw, 4rem)` / 1.03; maximum 64px | 700 / −0.035em |
| Product chapter heading | `clamp(2rem, 3.8vw, 3.4rem)` / 1.05 | 600 / −0.03em |
| Closing invitation heading | `clamp(3rem, 6.5vw, 6rem)` / 1.03 | 700 / −0.035em |
| Article/legal title | `clamp(2.75rem, 4vw, 3.25rem)` / 1.05 | 700 / −0.035em |
| Article/legal section heading | 26px / 1.1 | 700 / −0.035em |
| Hero introduction | 20px / 1.45, maximum 42ch | Inherited body weight |
| General lead | 18px / 1.55, maximum 65ch | Inherited body weight |
| Chapter summary | 22px / 1.35; 20px through 799px, maximum 30ch | Inherited body weight |
| Fee figure | `clamp(7rem, 16vw, 14rem)` / 0.85; 8rem through 799px | 600 / −0.04em; tabular figures |

The self-hosted variable font declares weights 100–900; the hero's 650 is a supported marketing-specific setting, not a replacement for operational weight roles.

**The Marketing Scope Rule.** Larger display typography belongs to the public website's explanatory hierarchy; keep the operational UI scale unchanged. Headings wrap naturally, without fixed-height text containers. Body copy retains a maximum 65-character measure where the layout permits; long legal text uses a narrower 760px article container. Test the actual translation at 320px and with enlarged text.

**The Visible Motion Rule.** Scroll enhancements begin from visible content. On the public website, desktop-only photo clipping is progressive enhancement; reduced-motion mode disables animations, transitions and sticky chapter panels. No content depends on animation support or scroll position to become readable.

### Public marketing layout and motion — root only

The public container is `min(100% - 96px, 1280px)`, with 32px side gutters through 1100px and 20px through 599px. The header is 112px tall, reduced to 96px through 599px; desktop navigation becomes a dialog menu through 899px. These content-driven breakpoints override the general device guidance only for this website.

The centered introduction leads into two offset photographs in a 1.7:1 grid with a 24px gap. Main and side images are 440px and 376px high, respectively; the side figure begins 64px lower. Image corners are 32px. Through 799px the supporting photo is omitted, and the main photograph uses its natural height within a 4:3 aspect ratio. The promise list stacks vertically at that width. Through 399px the introductory actions also stack.

Product chapters use two equal columns, 64px padding and gap, 32px corners, a 32px top sticky offset and `min(720px, calc(100svh - 64px))` minimum height. Their surfaces progress from Citron 50 through Citron 100 to Citron 300. Through 1100px padding becomes 40px and gap 32px; through 799px chapters become static single-column panels with 32px padding and no fixed minimum height. Through 399px padding is 28px vertically and 20px horizontally. Viewport heights through 650px and reduced motion also make the chapters static.

Screenshot regions remain explicitly labelled text descriptions: transparent backgrounds inherit their chapter surface, a dashed Citron 700 boundary uses 24px corners, 40px padding and 420px minimum height. Padding reduces to 24px through 1100px; minimum height reduces to 300px through 799px. The staff variant uses a muted surface and secondary-text border with a 460px desktop minimum height. No preview controls or synthetic screenshots are implied.

Chapter introductions, staff explanation and setup use split layouts; all become single-column through 799px. Major desktop sections use up to 144px vertical spacing; mobile sequences use 64–80px. The fee section is full-width Citron with a two-column inner grid, becoming one column through 799px. These spacious marketing rules do not change operational card density or radii.

In browsers supporting `animation-timeline: view()`, only widths from 800px with no reduced-motion preference receive photo entrances. The main figure opens from `clip-path: inset(0 6% round 32px)` to zero inset over `entry 0% cover 45%`; the side figure rises from 40px to zero over `entry 0% cover 60%`. Both use linear progression and visible defaults. Sticky panels use native scrolling, without scroll hijacking. Buttons retain 120ms background/border transitions; the FAQ icon rotates 45 degrees over 180ms ease-out. Reduced motion removes these animations and transitions.

## 6. Iconography and semantic feedback

**One library: Phosphor Icons** (`@phosphor-icons/react` in React, or official Phosphor equivalents elsewhere). Use `currentColor`; no mixing with Lucide, emoji, custom glyphs or decorative illustrations as functional UI icons. **Icons are optional in most product components, not mandatory decoration.** A meaningful icon must make the interface faster to recognize, expose an action/affordance, or clarify a non-trivial status. When words are clearer, use words alone.

### When to use icons — decision guide

| Context | Recommended treatment | Avoid |
|---|---|---|
| Primary navigation (sidebar/bottom nav) | Icon **plus always-visible label** only for familiar, unambiguous destinations; keep use consistent within the same navigation group | Guesswork metaphors, icon-only nav, a token icon for every destination |
| Secondary/settings/context menu | **Text first**; optionally add a familiar icon where it materially improves scanning (e.g. Delete) | Decorating every menu row, arbitrary icon metaphors |
| Buttons / CTAs | Usually **text only**; add e.g. `Plus`, `Download`, `MagnifyingGlass` only when it reinforces an established action, consistently in a group | Icon on every CTA, mismatched icon treatments in adjacent button group |
| Icon-only controls | Only universally recognized, space-constrained controls (close, search, overflow) with accessible name and 44–48px target | Icon-only destructive actions or ambiguous actions with no visible explanation |
| Status / feedback | **Icon + clear text for all states, including Error**; see state mapping below | Bare colored dots, color-only semantics, icon-only payment outcome |
| Fields | Text labels first; use trailing icon only for true affordance (`Eye` visibility toggle, clear button) or **error indicator** | Leading icons on every email/name/phone field |
| Data tables / KPIs / cards | **No icons by default**; add only for actionable columns, exceptional status or helpful scanning | Decorative icons beside every number, heading or row |
| Empty states | Icon optional; informative text and clear next action are mandatory | Generic decorative picture repeated on every blank panel |
| Marketing | Prefer licensed human photography and strong type; use iconography sparingly for simple feature explanation | Infographics built from miscellaneous symbols |

**Icon recognition rule:** if the team cannot quickly identify a stable, well-understood metaphor, remove the icon or use label-only UI. Research and test with real operators/guests; never add an icon purely to fill whitespace. Labels must remain visible where users need to distinguish actions. Consistent visual density is more important than artificially using the same number of icons on every page.

### Icon weights and active navigation

- **Inactive/current pairing:** if a navigation item has an icon, render that **same Phosphor icon in `weight="regular"` when inactive and `weight="fill"` when active/selected**. Simultaneously use label **500 → 700** and background **Citron 300 → Citron 500**. This is the canonical pattern for sidebars, brand-colored menus, mobile navigation and nav-like tabs. **No marker, left rail, dot or indicator stroke.**
- **Without icon:** keep the same background and font-weight change. **Do not add an icon just to create a selected state.**
- Choose only icon concepts with a clear, recognizable **regular/fill pair**; audit the filled silhouette at actual size. If filled meaning is ambiguous or illegible, use **text-only across that navigation group** or choose a better metaphor — do not silently switch active state back to `bold`.
- For ordinary controls that aren't active nav, default to `regular`; `fill` may convey persistent selected/toggled state when conventionally meaningful. Don't use filled icons as generic emphasis. Status icons use the explicit weight mapping below, independently of navigation.
- Recommended sizes: 16px compact supplementary, 20px standard, 24px primary nav/action, 28–32px large status (not automatic). Pair icon and text in `currentColor` and center-align optically. Interactive hit targets ideally ≥44×44px; icon size is not the hit target.
- With a visible text label, normally set the icon `aria-hidden="true"` to avoid duplicate announcement. Icon-only buttons need a meaningful **`aria-label`**; if a status icon adds meaning not present in text, ensure the accessible text describes the state. Respect screen-reader live-region urgency and avoid double announcements.

### Status feedback: icon is mandatory, red is Error-only

These rules apply to **alerts, inline field validation, toast notifications and significant payment/order states**, irrespective of compact/expanded presentation. Include **an icon and descriptive text in every meaningful semantic state**; use action/recovery copy where needed. Visual color is never the sole indicator.

| State | Phosphor icon | Suggested weight | Icon/text color | Meaning and copy |
|---|---|---|---|---|
| **Success** | `CheckCircle` | `regular` | Black / Gray 700 | “Bestellung übernommen” after verified success |
| **Warning** | `Warning` | `regular` | Black / Gray 700 | Risk explained + safe next step; no yellow/orange |
| **Info** | `Info` | `regular` | Black / Gray 700 | Important context and guidance; no blue |
| **Pending** | `Clock` or labeled spinner | `regular` | Black / Gray 700 | State still processing; don't imply completion |
| **Error** | **`XCircle`** (or `WarningCircle` when conceptually appropriate) | **`fill`** | **Red `#C62828`** for icon and key message/border | **What failed + what user can do next; icon is required in addition to red** |

**Error examples:** payment failure alert = filled red `XCircle` **and** readable “Zahlung fehlgeschlagen. Bitte überprüfe die Zahlungsmethode.”; invalid text input = red error icon adjacent to the specific field **and** visible message linked through `aria-describedby` plus `aria-invalid="true"`; error toast = red error icon **and** concise explanation with optional retry. The red border by itself never replaces the error icon. Do **not** use green success, amber warning or blue information hues. Neutral status icons are not necessarily decorative: they make shape/meaning distinguishable without relying on color.

For a non-urgent success/info state use `role="status"`/polite announcement when appropriate; for blocking errors use `role="alert"`/assertive **where necessary**, not blanket assertive live regions for every state. Critical payment outcomes are always stated in text and backed by server-confirmed state. If status is already unmistakably clear from normal text in a non-feedback context (e.g., a descriptive paragraph), don't turn it into an additional alert merely to show an icon.

**Approved concepts** (verify exact exports in installed Phosphor version): `House`, `Receipt`, `ShoppingBag`, `CreditCard`, `Gear`, `CheckCircle`, `Warning`, `Info`, `Clock`, `XCircle`, `Plus`, `MagnifyingGlass`, `CaretDown`, `Trash`, `QrCode`. This is a vocabulary, **not a requirement to display them all**. Refer to `examples/navigation-item.tsx` and `examples/status-message.tsx` for implementation guidance.

## 7. Shape, spacing, elevation and motion

**Rounded, but purposeful.** Pills (`radius.pill = 9999px`) for buttons, nav items, tabs, segmented selectors, filters and chips. Cards use 24px radius, dialogs/drawers 28px, floating-label inputs 16px (not a true pill: the upper label/border must remain readable). Image frames 16–24px depending on crop. Avatars round/circular. This is a visual system, not “every rectangle must be a pill”.

**Spacing:** 4px base; common steps 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Default card padding 24px desktop / 16px mobile, content gutters 24–32px desktop / 16px mobile. Touch targets at least 44×44px; preferred design token 48px. Forms: 16px between controls, 24–32px between groups.

**Elevation:** almost flat; boundaries and space first. `--zk-shadow-card` barely perceptible, popover and modal elevation modest. Avoid heavy glows, noisy gradients, glassmorphism or 3D effects.

**Motion:** quick 120–180ms state changes; slow 260ms for larger spatial transitions. Use only transform/opacity for animation where feasible; skeleton 1400ms subtle pulse/shimmer. Respect `prefers-reduced-motion`; no motion necessary to understand feedback. Avoid animation around monetary totals.

## 8. Components — standards and states

Every component requires: default, hover (if pointer), `:focus-visible`, pressed/active, selected where relevant, disabled, loading (where relevant), error (where relevant), empty content and long localized copy behavior. Prefer semantic HTML and an accessible headless primitive to custom keyboard logic.

### Buttons

- **Primary:** black pill, white text, 48px minimum height (40px compact when justified), active/hover gray 800, no all-caps. One clear primary action per decision region.
- **Accent:** Citron 300 pill, black text; reserved for strong brand contexts or specific checkout emphasis, not every CTA.
- **Secondary:** white pill, black label, subtle neutral border. **Tertiary:** text/ghost action with accessible focus ring.
- **Destructive:** do not make general red buttons. Use neutral button; in irreversible/error flow highlight the *error message/icon* red, confirmation text must be explicit.
- Disabled never by opacity alone on a control with ambiguous function; disable interaction semantically and explain prerequisite. While loading, hold button width/label area to prevent layout shift.

### Navigation — fixed brand pattern

**This rule applies consistently to desktop sidebar, compact menus, popovers, mobile navigation and tab-like brand navigation where the containing surface is Citron.**

| State | Container | Label/icon | Other |
|---|---|---|---|
| Resting | Citron 300, no extra item fill | Black, weight 500, Phosphor regular | pill hit area 44–48px |
| Hover | Citron 200 (or subtle opacity feedback) | Black, weight 500 | no motion/layout shift |
| **Current/selected** | **Citron 500, full rounded pill** | **Black, weight 700, optional Phosphor **fill** (inactive `regular`)** | **NO marker, side bar, dot, stroke or extra decoration** |
| Keyboard focus | Existing state preserved | Black | Separate visible focus outline, never suppressed |
| Disabled | Lower-emphasis Citron surface | Low emphasis, no action | semantic disabled state |

ARIA rule: use `<nav aria-label="...">` and current route `<a aria-current="page">`. Tabs use valid tab semantics and keyboard mapping; do not apply `aria-current` to arbitrary toggles. Header nav on white uses equivalent semantic selected-background patterns appropriate for the context; never introduce dark-lime sidebar as default. Prefer one permanent nav level, consistent names and a visible section heading when needed. More than two nested navigation levels is a signal to simplify IA.

### Text fields — floating labels

- **Persistent real label**, never only a placeholder or `aria-label`. Label starts *within* input. On focus **or non-empty value (including autofill)**, animate to its **upper internal edge**; keep it visible after blur while filled.
- Recommended field height 56px (larger for high-density checkouts where necessary), 16px radius, 16px side padding. Resting label 16px; floated 12px. Maintain sufficient contrast of label and typed text.
- On invalid data: **red border + red Phosphor error icon + explicit text below**. Error message tied with `aria-describedby`; set `aria-invalid`. Neutral helper copy uses Gray 600.
- Optional/required must be explained in the accessible label, not solely with a color/asterisk. Show formatting examples as helper text **outside** the field. Don't use disappearing placeholders.
- Keyboard input modes: `email`, `tel`, `decimal`, `numeric` as applicable. Browser autofill, paste, prefilled values, long names, dynamic validation, password manager and zoom behavior must be tested. Don't animate content unexpectedly on submit.
- Use Base UI Field/Input and test autofill, prefilled values, keyboard and validation states.

### Cards, tables and data

- Default card white with subtle Gray 200 boundary and 24px radius; data-dense cards may use Gray 50. Highlight only important metrics with Citron 50/100/300, not a page full of bright tiles.
- Orders/transactions need clear readable state text/icons, numeric amounts with tabular figures, localized Euro decimals, sortable column semantics, responsive overflow or stacked rows. Do not encode financial meaning in chart hue alone.
- Chart palette is deliberately limited: black, Citron 300, Gray 600 and Gray 300. Use direct labels, contrasting pattern or line shape, meaningful legend, and a text/table alternative for critical values.
- Empty state = optional meaningful Phosphor icon, clear heading, succinct explanation, primary next step. A loading skeleton mirrors the content shape; no fake metrics.

### Additional component recipes

| Component | Default specification |
|---|---|
| Alerts / banners | Neutral card, **status icon + descriptive text** for Success/Warning/Info/Pending/**Error**; only Error icon/message may be red |
| Toast | White radius 20, subtle shadow, concise text, accessible controls; **every semantic status has an icon; errors MUST show a red error icon plus text** |
| Badges / chips | Pill, neutral gray 100 or Citron 100, always text; status is not color-only |
| Modal / dialog | 28px radius, reachable close and heading, focus trap, Escape where safe, warning before destructive action |
| Drawer / bottom sheet | 28px top radius, useful mobile alternative to dialog; prevent hidden price/pay action |
| Dropdown / combobox | 20px panel radius; 44px item target; keyboard navigation; selected fill/weight per surface, no marker |
| Checkbox / radio / switch | Native semantics, 20px checkbox, 48px switch track; high contrast, label clickable; never rely on hue |
| Tabs / segmented controls | Pill selection, current font 700, dark legible text; focus semantics separated from selected state |
| Search | Pill field; clear button when populated; zero-result guidance; search icons supplied by Phosphor |
| Pagination | 40–48px targets; page text and current state; no orphaned icons or color-only status |
| Stepper / onboarding | Numbered steps and textual labels, neutral completed/next, Citron current highlight; always show progress count |
| Upload / image crop | Rounded dropzone with dashed/neutral boundary; clear supported formats, upload/loading/error/retry controls |
| Table / list skeleton | Gray 200 base, Gray 100 highlight, low-motion, shape matching content; `aria-busy` on region |
| Menu item imagery | 1:1 or 4:3 real food image, crop, title, price, options/dietary info and obvious add control |
| Order progress | Explicit text and meaningful status icon for consequential state updates; not decorative icons for every step |
| Checkout summary | High contrast, stable totals, item lines, fees, tax/trinkgeld text; clear button hierarchy |
| Price display | Tabular numerals; server-authoritative calculation; never convey discount with color alone |

## 9. UX conventions for the four products

**Public website (`root/`):** predominantly white pages, strong League Spartan hero and human images, occasional Citron background sections. Make the product model and POS coexistence legible; large uncomplicated CTAs. Mobile-first hierarchy and no exaggerated claims.

**Merchant product (`app/`):** Citron 300 nav sidebar; Citron 500 selected item with label weight 700 and **regular → fill icon when the item has one**, no marker. Operational screens mostly white and gray. Prioritize actions, filters, order status, sales figures, QR setup and payment account readiness. Multi-step onboarding shows saved progress.

**Guest QR flow (`app/`):** no account/install requirement. High contrast item names/prices; sparse navigation; large touch controls; reliable cart/checkout. Clear loading/retry behavior. Payment result states must be truthful and resilient against duplicate submission; do not imply payment succeeded while processing.

**Staff terminal (`app/`):** strong typographic information architecture, larger action targets, unmistakable order detail, quiet badges, minimal decoration; time-critical actions cannot rely on a tiny icon or hover.

**Support (`support/`):** readable steps, search, FAQ accordions, embedded annotated screenshots, screenshots with alt captions, no overuse of Citron. Content must be comprehensible without color.

**Internal dashboard (`internal/`):** denser tables and filters are allowed. Same font, Phosphor, tokens and error language; no visual reversion to an old design system. Accessibility and restricted-data affordances take priority over decoration.

## 10. Photography / people-first brand system

**Owner rule: only real internet stock photography with verified free commercial usage rights. Never use AI-generated photographs anywhere. Until real product captures exist, product-image regions are text-labelled placeholders describing the intended screenshot, never fabricated mock UI.**

Trust comes from **actual people in believable hospitality contexts**. Photos should feel documentary, warmly lit and respectfully inclusive, not overly directed advertising. Prioritize: (1) guest ordering from a table phone, (2) friendly staff interacting with guests, (3) owner preparing/serving, (4) café/restaurant with welcoming atmosphere, (5) hands and food for detail. Include different ages and venue sizes without reducing people to stereotypes.

- Show staff and real hospitality, not anonymous close-ups of software dashboards alone. Feature people naturally looking at each other or the task, not everyone smiling at the camera.
- Photo ratio library: hero 16:9 / 3:2, portrait 4:5, square 1:1, background crops 21:9. Ensure negative space for text. Keep contrast overlay solid or subtle if typography overlays photo.
- Style: authentic daylight or warm indoor light, natural skin tones, clean framing, no excessive HDR, heavy yellow-green filter or fake neon tint. Do not recolor skin in Citron. Reserve Citron for layout, not photographic color casts.
- Rights: obtain commercial usage licenses, participant/model releases where required, and location permission. Follow GDPR and consent rules. Store source/attribution/consent information **outside public front-end bundles**.
- Images: use `AVIF` or `WebP` plus responsive `srcset`, 2x density for important images, appropriately sized files, `loading="lazy"` for below-the-fold. Hero/LCP images may need eager loading. Provide meaningful alt text; decorative images use `alt=""`.
- Do **not** ship random third-party portraits without a verified right to redistribute. This ZIP includes a **shot list**, not unlicensed photos.

Maintain photography provenance and release evidence outside public bundles; credits required by a license remain visible.

## 11. Printed QR guest-order codes — **design rules only**

This section controls the design of **codes dynamically generated by the existing QR workflow**. **Do not include QR templates, demonstration QR files, menu stands, mock codes or PDFs in this branding package.**

- **Monochrome only:** `#000000` QR modules, `#FFFFFF` background. Never include Citron or any extra brand colors, gradients, photo masks, decorative borders or background illustrations.
- **Centered original black `signet`:** place it at the geometric center, scaled conservatively, with a solid white clearance zone between the logo silhouette and QR modules. Only use the original signet silhouette, not a retypeset Z. Be mindful: central artwork obscures code modules.
- **Error correction:** use high error correction **where supported**, test with the actual encoded payload length; a central signet must never be assumed universally scannable. Validate using standard QR encoders/decoders and camera devices.
- **Quiet zone:** keep **at least four modules** of uninterrupted white on all four outer sides. Preserve perfectly square modules, full contrast, sharp print output and no rounded/blurred dots.
- **Print target:** preferably 35–50mm+ for typical table uses with ample viewing distance; never rely on arbitrary universal minimum. Determine actual physical module size from QR version and viewing distance; assess around 0.4mm/module for ordinary print, then print-test at actual size.
- **Content:** any necessary “Scannen & bestellen” label, table/location name or short URL may appear in **black text on white** outside the quiet zone; keep the code itself entirely black and white. Use the same League Spartan typography if printed, no brand color.
- **Tests:** thermal laser/inkjet and office print, black/white grayscale, low toner, glare, matte/laminated versions, multiple phone cameras, low light, older devices, variable-length URL, slightly angled viewpoint. Check destination accuracy, not just “some QR decodes.”
- **Operational safeguards:** each code uniquely links to the correct authorized venue/table/context. Avoid exposing guessable private tokens. A print design rule does **not** supersede server-side validation of table/venue identity or checkout links.

## 12. Inclusive accessibility, responsiveness and quality gates

- **WCAG 2.2 AA** is the implementation target; test normal/high contrast, keyboard, pointer, screen reader, dark-mode OS (brand design stays light for now), 200–400% zoom, RTL-ready structures if later needed, and localized copy overflow.
- Keyboard focus visible independently of selection; dialogs return focus appropriately. No inaccessible custom listboxes or hidden-label inputs. Honor reduced motion and touch accessibility.
- Responsive: mobile first; 0–639px compact; 640–767px larger mobile; 768–1023px tablet; 1024px+ desktop. These are guidance breakpoints, not hard device categories. Content-driven layouts take precedence.
- Avoid cumulative layout shift: reserve image/media space, skeleton dimensions and button/loading bounds. Error messaging should not make the payment CTA move unpredictably.
- **Critical flows:** test guest menu → cart → payment → confirmation; merchant sign-up/setup/Stripe connection; staff accept/fulfill orders; printer QR scanning; auth and recovery; support request; error/retry in every role. Test financial copy and financial states with real backend contract rules before deployment.
- Do not make up analytics, claims, prices, certifications or integrations. Test localization currency/date formatting, safe handling of reattempted payment flows, permissions, input errors and slow/offline network states.
- Build lint/test visual state snapshots for button, navigation, floating label, dialog, empty card, skeleton, error toast and QR output. Re-validate AA contrast when colors change.

## 13. Repository implementation contract

- Impeccable is the required UI design, implementation and critique workflow. Base UI supplies accessible primitives; focused Zackisch wrappers and these tokens supply the visual system. Mobbin research precedes each UI addition or modification. References inform composition and interaction, never override this brand.
- Public marketing references favor large established payment/financial brands, such as PayPal and Stripe, for hierarchy and professional presentation. Preserve human hospitality content and independent Zackisch composition. Desktop may use purposeful scroll sequences; mobile and reduced-motion layouts must expose all content without scroll traps.
- `root/public/brand/` is the only hosted brand asset directory. Its files are served from `https://zackisch.com/brand/...`. The other three applications and email templates use those absolute URLs. No asset copying into other public folders. CSS source imports at build time do not constitute a second asset host.
- Logo files remain byte-identical to the supplied bundle. Use PNG wordmarks in email clients that cannot render SVG. All fonts are hosted on the website domain; never load Google Fonts at runtime. Provide correct font CORS headers for the three application origins.
- Compatibility aliases may map existing component token names to this system while individual screens are migrated. They are not a second theme. Document actual coverage in the application README; do not call the whole product redesigned after changing tokens.
- Use the source token JSON for values, CSS for implementation, and verify rendered contrast. Correct invalid serialization (such as JavaScript-array syntax in CSS font-family) without changing brand decisions.
- Preserve all functional, legal, security, financial and release contracts in `AGENTS.md`. This visual specification grants no production, payment or fiscal approval.
- Printed output retains the repository's 92 × 135 mm card, four-per-A4 and duplex workflow until a separately tested change. No venue name/logo; table/pickup identity and personal-service alternative stay visible. The new signet treatment requires independent decoding and physical scan checks before replacement of working QR output.

## 14. Source standards and reference patterns

The research references below support **principles**, not an attempt to visually copy another brand.

- [DTCG Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/): primitives, aliases and exchange format (W3C Community Group report, not a W3C Recommendation).
- [WCAG 2.2 Understanding 1.4.11: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): 3:1 meaningful state indicators and contrast limitations.
- [WAI-ARIA Authoring Practices: Navigation Treeview](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/): navigational current location, semantics and keyboard behavior.
- [WAI-ARIA Keyboard Focus guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/): independently visible focus.
- [Material Design Navigation Rail](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md): selected navigation surface / label pattern.
- [Adobe Spectrum Side Navigation](https://spectrum.adobe.com/foundations/app-frame/side-navigation-browsing-context): selected navigation typography and distinctions (Zackisch intentionally does **not** replicate Spectrum's selection bar).
- [Material Web Outlined Text Fields](https://github.com/material-components/material-web/blob/main/docs/components/text-field.md): floating persistent labels.
- [Phosphor React icon library](https://github.com/phosphor-icons/react): official `regular` / `fill` weights and React package.
- [Atlassian Design – icon usage](https://atlassian.design/components/icon/usage): remove unnecessary icons; prefer recognizable metaphors and textual labels.
- [Nielsen Norman Group – icon usability](https://www.nngroup.com/articles/icon-usability/): icons often need visible labels and recognition testing.
- [U.S. Web Design System – icon guidance](https://designsystem.digital.gov/components/icon/): intentional semantics, icon accessibility, avoid arbitrary decoration.
- [Carbon – status indicators](https://www.carbondesignsystem.com/building-blocks/core/patterns/status-indicators): pair icon/symbol with descriptive content, avoid status clutter.
- [Carbon – notification guidelines](https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines): feedback messages with status-specific icons and recovery context (Zackisch intentionally uses only Error red).

**Implementation reminder:** Real-world accessibility compliance depends on rendered markup and user flows, not just brand guidance. This specification should be treated as testable design requirements, not an audit certificate.

### Brand hierarchy and browser titles

The **wordmark is the primary logo** across all four applications. Reserve the signet for positions where the wordmark cannot fit, including favicons and genuinely compact navigation. Do not use an isolated signet as decoration in a spacious marketing section. Browser titles use `<localized page subject> | Zackisch` exactly once; this applies to metadata and dynamic title updates. The website favicon uses `platform/signet--favicon.svg` with its supplied Citron background and rounded transparent exterior, with the matching 32px PNG fallback.
