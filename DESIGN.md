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
  numeric:
    fontFamily: "Inter, ui-sans-serif, sans-serif, system-ui"
    features: "tabular-nums"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
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
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
  badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    gap: "4px"
  floating-cart:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}"
    roundedTop: "{rounded.2xl}"
  price:
    fontFamilySans: "Poppins"
    fontFamilyNumeric: "Inter"
  qr-code:
    moduleStyle: "square-sm"
    finderStyle: "square"
    color: "{colors.primary}"
---

# Design System: zakkig

## 1. Overview & Creative North Star

**Creative North Star: "Radical Monochrome Precision & Apple Fluid Motion"**

zakkig represents the intersection between high-performance operational utility and editorial architectural minimalism. Built for high-tempo hospitality environments—from lively bar counters to bustling pizza kitchens and seamless table ordering—the interface delivers instant readability, zero cognitive friction, and unmistakable tactile confidence.

The aesthetic philosophy rejects decorative fluff, low-contrast dark grays, and faux-glassmorphism. Instead, it commits to a crisp, high-contrast palette (`#000000` / `#ffffff`) with clean light surfaces across dialogs, modals, and auth screens. Dark/black backgrounds are intentionally restrained and never overused, ensuring the webapp feels light, fresh, and airy. Every element has a definitive boundary, purposeful typography, and crisp tactile feedback.

**Key Characteristics:**
- **Absolute Contrast:** Deepest black (`#000000`) and pure white (`#ffffff`) as the core aesthetic engine; no dark gray substitutes (`#171717`, `#18181b`, `zinc-900`).
- **Light Surface Architecture:** Dialogs, action drawers, confirmation alerts, and auth pages render on clean light surfaces (`bg-background` / `bg-card`) with crisp borders (`border-border`) and soft elevation (`shadow-2xl`). Pure black is reserved for focal points: the dashboard sidebar, primary CTAs, and active badges.
- **Numerical Typography Rule (Inter for Digits Only):** All digits `0-9` and decimal separators render in Inter (`font-inter tabular-nums`). Currency symbols (`€`), price prefixes (`ab`, `+`), units, and surrounding words strictly remain in Poppins.
- **Dynamic Flexbox Text Spacing:** Dynamic badges and labels inside flex containers use `inline-flex items-center gap-1` with discrete `<span>` tags to prevent whitespace collapsing.
- **Apple Fluid Motion:** Instant pointerdown tactile response (`active:scale-[0.98]`), spring transitions, interruptible gestures, and smooth corner radius hierarchies.
- **Container-Width Responsive Layouts:** Responsive breakpoints evaluate against container width (`@container`, `desktop:*`, `tablet:*`, `ResizeObserver`) rather than window viewports.
- **Iconographic Discipline:** Exclusively Phosphor Icons (`@phosphor-icons/react`); absolutely zero emojis across code, UI, or communications.
- **Operational Speed:** Clear status badges, immediate touch targets, full-height live order boards, and sticky cart transitions designed for one-handed mobile guest ordering and glanceable kitchen operations.

---

## 2. Color System

The palette is strictly monochromatic and high-contrast, supported only by muted neutrals for borders and secondary metadata, plus a single semantic destructive red.

### Primary
- **Absolute Black** (`#000000` / `oklch(0 0 0)`): The authoritative primary token. Used for primary buttons, dashboard sidebar background, brand headers, and high-impact action badges.
- **Absolute White** (`#ffffff` / `oklch(1 0 0)`): Primary canvas background, dialog surfaces, card backgrounds, and primary button labels.

### Neutral
- **Muted Surface** (`#f7f7f7` / `oklch(0.97 0 0)`): Subtle secondary button backgrounds, input backdrops, and card hover fills.
- **Border & Divider** (`#ebebeb` / `oklch(0.922 0 0)`): Hairline structural separators, table borders, and default card outlines.
- **Subdued Text** (`#71717a` / `oklch(0.556 0 0)`): Helper text, descriptions, tax disclaimers, and timestamps.
- **Dark Sidebar Accent** (`#2e2e2e` / `oklch(0.18 0 0)`): Active item indicators inside the dark dashboard navigation.
- **Sidebar Border** (`rgba(255, 255, 255, 0.1)`): Subtle hairline separator for dark panels.

### Destructive
- **Destructive Red** (`#dc2626` / `oklch(0.577 0.245 27.325)`): Reserved exclusively for irreversible actions (e.g. deleting categories, cancelling orders, deleting accounts).

### Semantic Rules
- **The True Black Rule:** Never substitute `#000000` with dark charcoal or off-black hex codes (such as `#171717`, `#18181b`, `#121212`, or `zinc-900`). Primary buttons, sidebar panels, and brand highlights must resolve to pure `#000000`.
- **The Light Surface & Dialog Rule:** Dark/black backgrounds must never be overused. Every modal, confirmation dialog, customization sheet, and auth page across both the guest frontend and merchant dashboard must render on a light background (`bg-background text-foreground` or `bg-card text-card-foreground`) with a subtle dimming backdrop (`bg-black/50 backdrop-blur-xs`) and clean borders (`border-border`). Pure black is reserved for high-impact accents (sidebar, primary CTAs, active filter badges).

---

## 3. Typography & Numerical Precision

**Primary Font Family:** `Poppins, ui-sans-serif, sans-serif, system-ui`  
**Numeric Font Family:** `Inter, ui-sans-serif, sans-serif, system-ui`

Poppins brings architectural weight to bold display headlines while remaining remarkably legible in dense kitchen tickets and ingredient modifier lists. Inter brings mathematical precision, alignment, and tabular legibility to all figures and numerical data.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3rem)`, `line-height: 1.1`, `letter-spacing: -0.02em`): Dashboard welcome titles. Marketing typography is defined in section 11.
- **Headline** (SemiBold 600, `1.5rem` / `24px`, `line-height: 1.25`, `letter-spacing: -0.01em`): Category section headers, modal titles, and large KPI metrics.
- **Title** (SemiBold 600, `1.125rem` / `18px`, `line-height: 1.3`, `letter-spacing: normal`): Menu item names, dialog sub-headers, and order ticket numbers.
- **Body** (Regular 400, `0.875rem` / `14px`, `line-height: 1.5`, `max-width: 65ch`): Item descriptions, explanations, and general paragraph content.
- **Label** (Medium 500, `0.75rem` / `12px`, `line-height: 1.4`, `letter-spacing: 0.05em`): Status badges, table indicators, and metadata tags.

### Named Rules
- **The Numerical Typography Rule (Strictly Digits Only in Inter):**
  - Poppins is the primary font for everything across `webapp` and `website`: all titles, headings, body text, buttons, labels, and badges.
  - Strictly and exclusively numeric digits (`0-9`) and decimal separators (`.` or `,`) render in **Inter** (`font-inter tabular-nums`) for maximum legibility.
  - Currency symbols (e.g. `€`), price prefixes (e.g. `ab`, `+`), units, and words MUST remain in **Poppins**.
  - All price displays in the UI must use the standard `<Price cents={...} from={...} prefix={...} />` component.
  - Never apply `font-inter` to parent containers or badges that contain text.
- **The Dynamic Flexbox Text Spacing Rule:**
  - Dynamic text combinations inside flex containers (e.g. `Tisch 4` from `{t("table")}` and `tableNumber`) must always use `inline-flex items-center gap-1` and individual `<span>` tags.
  - Never rely on whitespace strings `{" "}` inside flex items (as browser flex layout can collapse or strip them).
- **The Strict i18n Rule:**
  - Never hardcode text strings in JSX or emails. All user-facing strings must be localized via `next-intl` or centralized translation dictionaries (`t("key")`).
- **The Zero-Emoji Rule:**
  - Emojis are strictly banned from all user-facing copy, code, comments, documentation, and commit messages. UI iconography must use Phosphor Icons exclusively.

---

## 4. Apple Design & Fluid Physical Motion

zakkig translates Apple's interface design and fluid motion philosophy into high-tempo web interactions.

### Physical Motion Principles
- **Instant Response on Pointerdown:** Highlight and scale elements the instant they are pressed (`active:scale-[0.98]` or `active:scale-[0.97]`). Waiting for `click` or release creates artificial latency that breaks the physical illusion.
- **Spring Physics over Scripted Animations:**
  - Default UI Transitions: Critically damped (`damping: 1.0`, `response: 0.3-0.4s`) with zero overshoot for graceful settling.
  - Momentum & Flicks: Under-damped (`damping: ~0.8`) with subtle bounce only when preceding input carried momentum.
- **Interruptibility:** Gestures and transitions must be interruptible at any frame. An ongoing drawer closure or modal dismissal can be grabbed and reversed mid-flight without locking input.
- **Spatial Consistency & Origin Awareness:**
  - Enter and exit along the same spatial path (e.g. a bottom sheet enters from the bottom and dismisses downward).
  - Menus and popovers scale and originate from their trigger button (`transform-origin: trigger`).
- **Corner Radius Hierarchy:**
  - Small Form Elements & Buttons: `rounded-lg` (8px to 12px)
  - Cards & Panels: `rounded-2xl` (20px)
  - Modals & Bottom Drawers: `rounded-3xl` (24px)
  - Floating Pills & Circular Chips: `rounded-full` (9999px)

---

## 5. Responsive Container Query Architecture

Because the dashboard navigation sidebar (`bg-sidebar`) occupies varying screen widths or can collapse, viewport media queries (`window.innerWidth`, `@media (min-width: ...)`) lead to incorrect layouts.

### Container Rules
- **Container Evaluation:** All dashboard content panels and responsive layouts evaluate against the available content container using CSS Container Queries:
  ```css
  @custom-variant desktop (@container (width >= 1110px));
  @custom-variant tablet (@container (width >= 500px));
  ```
- **Observer Integration:** In dynamic layouts (such as the drag-and-drop menu manager), compute layout breakpoints via `ResizeObserver` on `containerRef.current` rather than `window.matchMedia`.
- **Layout Thresholds:**
  - Narrow / Mobile: `< 500px` (single column, full width)
  - Intermediate / Tablet: `500px - 1109px` (two columns or tabbed view)
  - Expanded / Desktop: `>= 1110px` (three columns, split view with fixed master queue and inspection panel)

---

## 6. Elevation, Surfaces & Depth

The system uses a flat, border-defined architectural spatial model. Surfaces differentiate themselves through sharp tonal contrast rather than layered elevation shadows.

### Shadow Vocabulary
- **Shadow Zero / Flat (`none`):** Standard state for cards, tables, inputs, and inline controls. Separation is established via `border-border`.
- **Subtle Ambient Lift (`shadow-xs` / `shadow-sm`):** Light floating elevation for interactive menu cards and dropdown menus.
- **Bottom Sheet Lift (`shadow-[0_-8px_30px_rgba(0,0,0,0.08)]`):** Upward ambient shadow for sticky bottom cart containers.
- **Dialog Modal Lift (`shadow-2xl`):** Floating modal elevation above the dimmed backdrop overlay.

### Named Rule
- **The Border-Over-Shadow Rule:** Structural containment must always be achieved through a clean 1px border stroke (`border border-border`) rather than heavy drop shadows.

---

## 7. Component Catalog & Implementation Standards

### Buttons & Controls
- **Apple Pill Geometry Standard:**
  All action buttons, select triggers (`SelectTrigger`), dropdown triggers, sidebar navigation links, and order tickets across dashboard and staff views strictly use unified Apple pill geometry (`h-11 rounded-full font-semibold px-4` or `px-5`, compact `h-9 rounded-full font-semibold px-3.5`).
- **Concentric Corner Radius & Nested Geometry Standard:**
  Whenever an inner element sits inside an outer container with uniform padding $P$, the outer radius $R_{\text{outer}}$ and inner radius $R_{\text{inner}}$ MUST strictly follow the concentric border radius formula:
  $$R_{\text{outer}} = R_{\text{inner}} + P \quad \Longleftrightarrow \quad R_{\text{inner}} = \max(0, R_{\text{outer}} - P)$$
  Standard Tailwind tokens like `rounded-2xl` evaluate to `43.2px` in this project due to `--radius: 1.5rem`. NEVER use `rounded-2xl` for dropdown or select popups, as it produces distorted spherical corners.
  - Outer container card: strictly `rounded-[20px]` with `p-2` (8px padding)
  - Inner selectable items: strictly `rounded-[12px]` ($20\text{px} - 8\text{px} = 12\text{px}$) with `px-3.5 py-2.5 font-semibold`
- **Primary Action Button:**
  ```tsx
  className="bg-primary hover:bg-neutral-800 text-primary-foreground rounded-full font-bold h-11 sm:h-12 px-5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer select-none"
  ```
- **Secondary Button:**
  ```tsx
  className="bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98] rounded-full h-11 px-4 font-semibold transition-colors cursor-pointer"
  ```
- **Destructive Button:**
  ```tsx
  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full h-11 px-4 font-semibold active:scale-[0.98] transition-colors cursor-pointer"
  ```

### Uppercase Tracked Typography Standard
Section block titles, card categorization headers, queue column headers, and metadata headers across the webapp and modals (e.g. `BETRIEBSDATEN`, `LOGO & BANNER`, `ZAHLUNGSANBIETER`, `GEFAHRENZONE`, `IN BEARBEITUNG`, `ABHOLBEREIT`, `STATISTIK`, `QR-CODE VERWALTUNG`, `SITZUNGEN`, `ARTIKELDETAILS`, `BILD & VORSCHAU`, `PRESETS & ANPASSUNGEN`, `REGION`, `SPRACHE`, `SUMME`) strictly render with `text-xs font-bold uppercase tracking-wider text-muted-foreground` (or `text-zinc-900` / `text-foreground` on Apple light modal dialogs, and `text-destructive` for danger zones).

### Light Dialogs & Sheets
- **Backdrop Overlay:** `fixed inset-0 bg-black/50 backdrop-blur-xs`
- **Dialog Container:** `bg-background text-foreground border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`
- **Dialog Header:** Clean white surface, high-contrast title, close button with `<X>` or `<CaretDown>` (16px, `weight="bold"`).
- **Dialog Footer:** Dedicated border divider (`border-t border-border`), hosting full-width action buttons with left-aligned label and right-aligned dynamic price.

### Customization Options (Guest Ordering)
- **Container:** `w-full flex items-center justify-between px-4 py-3 rounded-[14px] border transition-all text-left select-none`
- **Selected State:** `border-primary bg-primary/[0.04] ring-1 ring-primary text-foreground hover:bg-primary/[0.07] active:scale-[0.985] cursor-pointer`
- **Unselected State:** `border-border/80 bg-card hover:bg-muted/50 hover:border-foreground/25 active:scale-[0.985] cursor-pointer text-foreground hover:shadow-2xs`
- **Disabled / Max Selection State:** `border-border/40 opacity-40 cursor-not-allowed bg-muted/20 text-muted-foreground`
- **Custom Indicators:**
  - Checkbox (Multi-select): `w-5 h-5 flex items-center justify-center rounded-[5px] border shrink-0`
  - Radio (Single-select): `w-5 h-5 flex items-center justify-center rounded-full shrink-0` with centered `w-2.5 h-2.5` bullet when active.

### Floating Cart Bottom Card (Guest Ordering)
- **Visibility:** Automatically hidden when cart is empty; mounts smoothly when `itemCount > 0`.
- **Container Card:** Slides up from the bottom when `itemCount > 0`. Styled as a crisp white bottom card:
  ```tsx
  <div className="w-full max-w-[500px] bg-background border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[24px] px-4 pt-3.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6 pointer-events-auto animate-in fade-in slide-in-from-bottom duration-300">
  ```
- **Pill Action Button:** Full-width pill (`bg-primary hover:bg-neutral-800 text-primary-foreground rounded-full h-12 sm:h-13 flex items-center justify-between active:scale-[0.98] transition-all`) containing:
  - Left: Circular quantity badge (`h-10 w-10 rounded-full bg-background text-foreground flex items-center justify-center font-extrabold text-sm sm:text-base font-inter tabular-nums leading-none`).
  - Center: "Zum Warenkorb" label (`font-bold text-base truncate text-center flex-1 px-3`).
  - Right: Formatted total price via `<Price cents={total()} />`.
  - Crucial: No arrow icon next to the price.

### Focused Cart View (Guest Ordering)
- **Clean Focus:** When cart is open, merchant hero banner is suppressed.
- **Top Header:** Sticky top header with `<ArrowLeft>` back button returning to the menu, cart title, restaurant subtitle, and order type badge (`dine-in` or `takeaway`).

### Dynamic Price Component (`<Price />`)
- **Strict Separation:** Digits in Inter, symbols and prefixes in Poppins.
  ```tsx
  <span className="inline-flex items-baseline whitespace-nowrap font-sans">
    {from && <span className="mr-1">{t("from")}</span>}
    {prefix && <span className="mr-1">{prefix}</span>}
    <span className="font-inter tabular-nums">{digits}</span>
    <span className="ml-1">€</span>
  </span>
  ```

### QR Code Engineering Standards
- **Standard Styling:**
  - `dataModulesSettings: { color: "#000000", style: "square-sm" }`
  - `finderPatternOuterSettings: { color: "#000000", style: "square" }`
  - `finderPatternInnerSettings: { color: "#000000", style: "square" }`
- **Session Dialog Presentation:**
  - Container: `w-full aspect-square flex items-center justify-center bg-white cursor-pointer`
  - Margin: `marginSize={2}`
  - Size: `size={360}` with responsive `svgProps={{ className: "w-full h-auto aspect-square block" }}` for edge-to-edge dialog utilization.
  - Centered brand emblem excavated cleanly.

### Badges & Dynamic Text Spacing
- **Structure:** Always wrap label and value into discrete elements separated by `gap-1`:
  ```tsx
  <span className="text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1 border bg-muted text-foreground/80 border-transparent">
    <span>{t("table")}</span>
    <span className="font-inter tabular-nums">{order.tableNumber}</span>
  </span>
  ```

### Live Orders Kitchen Board
- **Full Screen Height Utilization:** Board container utilizes 100% of available vertical height (`flex-1 min-h-0 h-full`) without bottom dead space.
- **3-Column Architecture:**
  - Left: Master queue panel (fixed 540px on desktop, full width on mobile/tablet).
  - Center/Right: Detailed ticket inspector panel with order progression actions.
- **Order Number Integrity:** Sequential 3-digit rolling numbers (`001` - `999`).

### Menu & Availability Item Cards
- **Image Banner:** Full-width `h-40 sm:h-48` top image with `object-cover` and `overflow-hidden`.
- **Sold-out State:** Deactivated or unavailable items automatically transition to `grayscale opacity-75` with line-through text.
- **Guest Ordering Action Button:** Large full-width pill button (`rounded-full h-11 sm:h-12 w-full px-4 sm:px-5 flex items-center justify-between`) uniting the add action with the price. The left side holds the `<Plus>` icon, *"Hinzufügen"* label, and quantity badge; the right side displays the formatted price via `<Price />` (including dynamic *"ab"* prefix for customizable items).

### OTP Validity Live Countdown Timer (`<OtpValidityTimer />`)
- **Initial Presentation:** `<Clock className="w-3.5 h-3.5 shrink-0" />` with `text-xs text-muted-foreground font-medium` ("Code noch für 30 Minuten gültig" / "Code valid for another 30 minutes").
- **Numerical Precision:** Strictly digits in Inter (`font-inter tabular-nums`), surrounding words in Poppins.
- **Dynamic Live Decrement:** Updates every second; decrements cleanly minute by minute (e.g. 29 Minuten, down to "Code noch für 1 Minute gültig").
- **Expired State Handling:**
  - Inline destructive notice: `text-xs text-destructive font-medium` ("Code abgelaufen. Bitte neuen Code anfordern.") strictly without warning/error icons.
  - Form disabling: locks OTP inputs and submit actions.
  - Action transformation: switches secondary resend action to a full-width, high-contrast primary pill button "Neuen Code anfordern".

### Focused Cart & Checkout View Typography
- **Upper Tracked Summary:** Subtotal and total summary labels in the guest cart sheet and checkout payment modal strictly render in tracked uppercase `SUMME` (`t("sumTotal")`) alongside the tax disclaimer ("inkl. MwSt.").
- **Header Cleanliness:** Redundant "KATEGORIEN" headers on the menu page and "Alle Bestellungen" table titles on dashboard archive views are suppressed.

### Email Templates
- **Canvas:** `#f4f4f5` outer background, `#ffffff` card container (`border-radius: 24px`).
- **Sender Identity:** `Selim von zakkig` (DE) / `Selim at zakkig` (EN) via Microsoft 365 (`selim@zakkig.com`).
- **Standardized Subjects:** `Anmeldecode für zakkig`, `Passwort zurücksetzen für zakkig`, `Email-Adresse ändern für zakkig`.
- **Brand Header:** Center-aligned or left-aligned `https://www.zakkig.com/full.svg` brand logo (`height: 56px`).
- **Headline & Links:** `#000000` bold typography, underlined links.
- **Responsive Code Box:** `#000000` rounded container (`border-radius: 16px`) with crisp `#ffffff` 48px tracked digits in Inter; container padding and letter-spacing scale fluidly on narrow mobile viewports to prevent wrapping across multiple lines.
- **Action Button:** `#000000` rounded button with white text.

---

## 8. UI Feedback, Form Validation & Toasts

### Toast Notifications
- **Position:** Strictly top-center (`position="top-center"`), regardless of viewport (desktop, tablet, or mobile).
- **Layout:** High-contrast pill. Icon strictly on the left of the pill. Text in container to the right of the icon is centered.
- **Deduplication:** DO NOT fire a toast if an inline error message is already visible on the screen or form.

### Form Errors & Inline Notices
- **Alignment:** Strictly left-aligned (`text-left w-full`).
- **Color Token:** Standard `text-destructive text-sm font-medium` (or `font-semibold`).
- **No Decorative Icons:** Never place warning or exclamation icons next to inline form error text.
- **No Blocky Alert Boxes:** Avoid heavy background alert boxes for simple form field validation.

---

## 9. Anti-AI Slop & Clean Code Quality

Keep the codebase clean, professional, minimal, and human-written. Strictly follow these quality constraints:

1. **Zero Emojis:**
   - DO NOT use emojis anywhere in the codebase: no emojis in source code, JSX, comments, documentation, markdown headers, or commit messages.
   - Use Phosphor Icons (`@phosphor-icons/react`) for UI iconography.
2. **No Decorative Comment Dividers:**
   - DO NOT use decorative AI-style horizontal comment lines (e.g. `// ─── Categories ───` or `// ==================`).
   - Use clean, standard, idiomatic comments (e.g. `// Categories`, `// Menu Items`).
3. **No AI Debug Logging:**
   - DO NOT introduce temporary or weird `console.log` statements (e.g. `console.log("Here we do...", ...)`).
   - Use only standardized `console.error` and `console.warn` for genuine, unhandled server-side exceptions or browser API fallback events.
4. **No Boilerplate Bloat or Over-Engineering:**
   - Write concise, idiomatic, high-performance TypeScript. Avoid unnecessary abstractions, wrapper-layers, or redundant types.

---

## 10. Do's and Don'ts Checklist

### Do:
- **Do** use `#000000` and `#ffffff` as the unambiguous foundation for all primary UI surfaces.
- **Do** ensure all dialogs, modals, customization sheets, and auth screens render on clean light surfaces (`bg-background` / `bg-card`).
- **Do** render all numbers, prices, counters, and statistics in Inter (`font-inter tabular-nums`).
- **Do** use the `<Price cents={...} />` component for all price displays in the UI.
- **Do** keep currency symbols (`€`), price prefixes (`ab`, `+`), and units in Poppins.
- **Do** use `inline-flex items-center gap-1` with discrete `<span>` tags for dynamic badges like `Tisch 4`.
- **Do** wrap the guest floating cart button in a clean bottom card container that slides up from the bottom when `itemCount > 0`.
- **Do** use `@phosphor-icons/react` icons exclusively with standard weights (`regular` or `bold`).
- **Do** position toast notifications strictly at `top-center`.
- **Do** keep form error messages left-aligned with `text-destructive text-sm font-medium` without alert boxes or icons.
- **Do** use `square-sm` module styling and full-width container presentation for QR codes.
- **Do** evaluate responsive layout switches against container width (`@container`) rather than window viewports.
- **Do** apply immediate tactile pointerdown feedback (`active:scale-[0.98]`).
- **Do** ensure the live orders kitchen board utilizes the entire available vertical screen height.

### Don't:
- **Don't** use emojis anywhere in the codebase, UI, comments, or documentation.
- **Don't** introduce dark charcoal values like `#171717`, `#18181b`, or `zinc-900` for primary black elements.
- **Don't** overuse black backgrounds; preserve a light, fresh, airy feel across the entire application.
- **Don't** render dark inverted dialogs or modals anywhere in the application.
- **Don't** apply `font-inter` to parent containers or badges that contain text.
- **Don't** hardcode language strings directly in JSX or templates; always use `t("key")`.
- **Don't** use arrow icons next to prices in the floating cart banner.
- **Don't** add decorative AI comment dividers (`// ──────...──────`) or temporary debug logs.
- **Don't** evaluate content layouts against `window.innerWidth` when a sidebar is present.
- **Don't** rely on raw whitespace strings `{" "}` inside flexbox badges.
- **Don't** allow client components to call mutating Convex functions directly without going through Server Actions.

## 11. Marketing website

The website is a light, editorial surface for restaurant operators. Its primary action is direct registration. The webapp's functional design rules remain unchanged; the following tokens describe the marketing surface in `website/app/globals.css`.

### Composition and tokens

- Canvas: white; soft sections and footer `#f7f7f5`; text black; secondary text `#595959`; hairlines `#e6e6e6`.
- Content: maximum 1200px, centered. Side gutters scale from 24px to 64px. Section padding scales from 72px to 128px.
- Spacing rhythm: 4, 8, 12, 16, 24, 32, 40, 48, 64px. Use close spacing within a group and large spacing between groups.
- Poppins is the text family. Hero: 46–88px, 600, line-height 1.08. Section heading: 32–52px, 600, line-height 1.17. Subheading: 18px. Body: 14–17px. Supporting captions: 12px. Tracking never below -0.04em; Inter is reserved for numeric digits and decimal separators.
- Primary controls: black/white pill, minimum 48px height, 14px semibold. Secondary controls: 44px, thin border. Pointer-down scale 0.98. Keyboard focus: visible 2px black outline with 5px offset.
- Native locale dialog: white, 24px outer radius, 24px padding, edge-to-edge header/footer dividers. Options use explicit 12px radii. The dialog traps focus, closes on Escape and applies draft language only through the primary action.

### Visual signature and product imagery

The hero QR is a slightly rotated paper sheet held by two restrained translucent tape strips. It is the only physical visual effect. QR modules, finders and centered logo follow the existing product QR settings; the example links to the app entry, not a real restaurant table. No animated background, rotating QR showcase, card grid or decorative scroll effects.

The ordering flow uses actual `GuestFrontend`, `CartSheet` and `CurrentOrdersContent` renders with isolated demo data. Images are localized for German and English, served as WebP and labelled as examples. Two portrait phone frames and one landscape tablet describe scan, checkout and kitchen. Never replace their interfaces with imagined dashboards. The squirrel is the existing brand SVG used once in the closing section.

### Responsive contract

- Above 900px: split hero headline flanks the paper QR. At desktop widths the flow has two phone columns and a wider tablet column.
- 601–900px: headline above the QR, two phone columns, tablet beneath; reduced text-column spacing.
- Up to 600px: single-column page, compact header and disclosure navigation; sequential phone/tablet flow, stacked pricing and FAQ, independent contact and footer controls.
- At 320px the header uses smaller horizontal gaps. All primary actions remain at least 44px high. No horizontal document overflow.
- Reduced-motion preference disables smooth scrolling and transitions. Content is visible without entrance animation.

### Content rules

Keep one sentence per flow step. Setup needs three named actions, not three descriptive cards. Pricing states 2 % per order plus variable payment-provider fees; no setup or monthly fee. Do not invent adoption statistics, promises of increased revenue, testimonials or automatic POS integration. A restrained two-column benefits section combines service time with a sourced industry example; attribution and the absence of measured zakkig results must remain adjacent to the 30% figure. On mobile it stacks into one column. FAQ explicitly describes manual entry into the till. MARS appears with its existing logo and the verified zakkig startup profile link.

Every visible interface string and destination is resolved through next-intl. Legal routes retain their existing paths and content and use the same light typography and navigation. Keep the AGB finalization notice until approved legal terms are supplied.
