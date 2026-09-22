# Design system reference

This reference describes the UI that exists in the repository as of 2026-09-23. [DESIGN.md](../DESIGN.md) is the portable, normative summary. This file preserves source links, surface distinctions, and known differences between implementation and [AGENTS.md](../AGENTS.md). A stated project convention is a target; a source observation is a description. Neither should be silently substituted for the other.

| ID | Area | Primary source |
| --- | --- | --- |
| [DS-01](#ds-tokens) | Shared tokens and computed scales | [webapp globals](../webapp/app/globals.css), [website globals](../website/app/globals.css) |
| [DS-02](#ds-primitives) | Button, input, badge, and card primitives | [button](../webapp/components/ui/button.tsx), [input](../webapp/components/ui/input.tsx), [badge](../webapp/components/ui/badge.tsx), [card](../webapp/components/ui/card.tsx) |
| [DS-03](#ds-overlays) | Overlays and choice controls | [dialog](../webapp/components/ui/dialog.tsx), [sheet](../webapp/components/ui/sheet.tsx), [select](../webapp/components/ui/select.tsx), [dropdown](../webapp/components/ui/dropdown-menu.tsx) |
| [DS-04](#ds-shells) | Merchant and terminal shells | [dashboard shell](../webapp/components/dashboard/dashboard-shell.tsx), [staff shell](../webapp/components/staff/staff-terminal-shell.tsx) |
| [DS-05](#ds-guest) | Ordering and payment | [guest frontend](../webapp/components/guest/guest-frontend.tsx), [cart sheet](../webapp/components/guest/cart-sheet.tsx), [checkout form](../webapp/components/guest/checkout-form.tsx) |
| [DS-06](#ds-qr) | QR, print, and numeric display | [overview QR](../webapp/components/dashboard/overview-content.tsx), [QR showcase](../website/components/QrCodeShowcase.tsx), [price](../webapp/components/ui/price.tsx) |
| [DS-07](#ds-website) | Website | [site CSS](../website/app/globals.css), [main page](../website/components/MainPage.tsx), [QR showcase](../website/components/QrCodeShowcase.tsx) |
| [DS-08](#ds-i18n) | i18n and accessibility | [root instructions](../AGENTS.md), [dialog](../webapp/components/ui/dialog.tsx), [tracker](../webapp/components/guest/order-tracker.tsx) |
| [DS-09](#ds-decisions) | Evidence policy | [root instructions](../AGENTS.md), [portable summary](../DESIGN.md) |
| [DS-10](#ds-more-primitives) | More primitives | [webapp UI library](../webapp/components/ui/) |
| [DS-11](#ds-auth) | Authentication | [auth routes](../webapp/app/%28auth%29/), [OTP timer](../webapp/components/auth/otp-validity-timer.tsx) |
| [DS-12](#ds-menu) | Menu and availability | [menu manager](../webapp/components/dashboard/menu-content.tsx), [availability](../webapp/components/availability/availability-content.tsx) |
| [DS-13](#ds-overview) | Analytics, archive, and QR management | [overview](../webapp/components/dashboard/overview-content.tsx), [archive](../webapp/components/dashboard/all-orders-content.tsx) |
| [DS-14](#ds-region) | Region and language | [webapp dialog](../webapp/components/region-language-dialog.tsx), [website modal](../website/components/RegionLanguageModal.tsx) |
| [DS-15](#ds-15-tailwind-first-authoring) | Tailwind-first authoring policy | [root rules](../AGENTS.md), [webapp globals](../webapp/app/globals.css), [website globals](../website/app/globals.css) |

<a id="ds-tokens"></a>
## DS-01: Source tokens and arithmetic

Both global stylesheets use semantic OKLCH CSS variables: background/card/popover and their foreground pairs, primary and accent black, secondary and muted near-white, destructive red, border/input light gray, five grayscale chart values, and sidebar-specific colors. The CSS values are the source of truth; [DESIGN.md](../DESIGN.md) includes only the repeated design primitives. The website adds `--site-width: 1200px`, `--site-gutter: clamp(24px, 5vw, 64px)`, `--site-section: clamp(72px, 9vw, 128px)`, `--site-muted: #595959`, `--site-line: #e6e6e6`, and `--site-soft: #f7f7f5`. The website's dark setup and footer override muted text and line values locally. [Sources: webapp globals](../webapp/app/globals.css), [website globals](../website/app/globals.css).

| Semantic CSS variables | Exact source value | Role |
| --- | --- | --- |
| `--background`, `--card`, `--popover`, `--primary-foreground`, `--accent-foreground`, `--destructive-foreground`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent-foreground`, `--sidebar-ring` | `oklch(1 0 0)` | White surfaces or white-on-dark foreground |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--primary`, `--secondary-foreground`, `--accent`, `--ring`, `--sidebar`, `--sidebar-primary-foreground` | `oklch(0 0 0)` | Black text, action, focus, or sidebar |
| `--secondary`, `--muted` | `oklch(0.97 0 0)` | Near-white quiet surface |
| `--muted-foreground`, `--chart-2` | `oklch(0.556 0 0)` | Metadata and second chart shade |
| `--border`, `--input` | `oklch(0.922 0 0)` | Control and surface boundary |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error and destructive action |
| `--chart-1`, `--chart-3`, `--chart-4`, `--chart-5` | `oklch(0.87 0 0)`, `oklch(0.439 0 0)`, `oklch(0.371 0 0)`, `oklch(0.269 0 0)` | Grayscale chart ramp |
| `--sidebar-accent`, `--sidebar-border` | `oklch(0.18 0 0)`, `oklch(1 0 0 / 0.1)` | Active dark navigation and hairline |
| `--site-muted`, `--site-line`, `--site-soft` | `#595959`, `#e6e6e6`, `#f7f7f5` | Marketing copy, separators, and hover fill |

The two Tailwind themes set `--spacing: 0.3rem`. At a 16px root, one utility step is 4.8px. This makes `gap-1` 4.8px, `p-2` 9.6px, `p-4` 19.2px, `h-9` 43.2px, `h-11` 52.8px, and `h-12` 57.6px. Half steps scale the same way. Arbitrary values such as `rounded-[20px]` and CSS site values are literal. The project sets `--radius: 1.5rem`: `rounded-sm` is 20px, `rounded-md` 22px, `rounded-lg` 24px, `rounded-xl` 28px, `rounded-2xl` 43.2px, `rounded-3xl` 52.8px, and `rounded-4xl` 62.4px at a 16px root. These are theme calculations, not standard Tailwind defaults. [Sources: globals above].

All theme `--shadow-2xs` through `--shadow-2xl` definitions are zero-opacity, including the named `--shadow-opacity: 0`. The visual system gains ordinary hierarchy from white/light-gray fills and borders. Nonzero local examples include the guest customization footer's explicit upward shadow and the website paper QR. Do not describe `shadow-xs` as a visible lift. [Sources: globals above, [customization](../webapp/components/guest/customization-modal.tsx), [website CSS](../website/app/globals.css)].

The [webapp root layout](../webapp/app/layout.tsx) and [website root layout](../website/app/layout.tsx) load Poppins (300–700) and Inter (300–900) with `next/font/google`. Poppins is the sans family; `.font-inter`, `.font-numeric`, number inputs, and telephone inputs select Inter with tabular numerals. The [Price component](../webapp/components/ui/price.tsx) isolates price digits and comma in an Inter span and keeps translated `from`, caller prefix, and euro symbol in surrounding Poppins. The website's `.step-number` and `.benefit-stat` are distinct numeric treatments. The numeric-only rule is the intended house convention; number/tel inputs inherently apply Inter to any entered letters and are a source-level exception.

| Role | Source scale | Use |
| --- | --- | --- |
| Website hero | `clamp(52px, 6.2vw, 96px)`, 600, line-height 1, tracking −.04em at wide widths | Two words around the QR; later media rules shrink it when stacked |
| Website section heading | `clamp(32px, 4vw, 52px)`, 600, line-height 1.17, tracking −.035em | Balanced section titles |
| Website subheading/body/caption | 18px / 14–17px / 13px; body line-height 1.65 | Editorial reading and support |
| Webapp page title | `text-2xl font-bold tracking-tight` | Dashboard screen title |
| Webapp dialog title/description | `text-xl font-bold tracking-tight` / `text-xs` with relaxed line-height | Modal header |
| Webapp section label | `text-sm font-bold uppercase tracking-wider` | Card, settings, queue metadata |
| Webapp body/control | `text-sm` is common; Button default 14px semibold | Operational scanability |
| Numeric | Inter with `tabular-nums`; sizes follow the containing value role | Prices, counts, timers and order numbers |

<a id="ds-primitives"></a>
## DS-02: Primitive catalog

### Button state and size matrix

The [webapp Button](../webapp/components/ui/button.tsx) wraps Base UI and defines the following variants through CVA.

| Variant | At rest | Hover and focus | Disabled or active |
| --- | --- | --- | --- |
| default | primary black, white text | primary at 90% opacity; three-pixel half-opacity ring | disabled opacity 50%; active scale .98 |
| outline | white, border-color stroke | muted fill; expanded uses muted | same common states |
| secondary | near-white, black text | five-percent foreground mix | same common states |
| ghost | transparent | muted fill | same common states |
| destructive | destructive red, white text | red at 90%; destructive focus ring | same common states |
| link | transparent, primary text | underline | same common states |

Default size is `h-11 px-5 gap-2`, 14px semibold, full pill. `xs` is `h-7.5 px-3` and 12px; `sm` is `h-9 px-4` and 12px; `lg` is `h-12 px-6` and 16px. Icon sizes are `size-6`, `size-8`, `size-10`, and `size-11` as named in the source. These numeric utilities use the 4.8px step. The icon slot defaults to size 4 unless its class already specifies a size.

The [Input](../webapp/components/ui/input.tsx) is `h-8`, full-width, `rounded-lg` (24px from theme), transparent, with `border-input`, `px-2.5`, and responsive 16px/14px text. Focus changes border and draws a three-pixel ring; invalid state uses destructive border/ring; disabled state uses reduced opacity and pointer suppression. It defaults to 255 characters and currently emits a toast when typing or pasting past the limit. That is an implementation behavior, not a model for every field.

The [Badge](../webapp/components/ui/badge.tsx) is a compact `h-5` item with generated `rounded-4xl`, five color variants plus link, and an optional keyboard ring. The [Card](../webapp/components/ui/card.tsx) is white, `rounded-xl`, ringed at foreground/10, and uses `--card-spacing: --spacing(4)`; `size=sm` changes that to step 3. Header, content, and footer each use the spacing variable; the footer has a border and muted/50 fill. Its generated radius is larger than explicit 20px dialogs.

<a id="ds-overlays"></a>
## DS-03: Overlays, selection, and feedback

The [Dialog](../webapp/components/ui/dialog.tsx) uses a `bg-black/60` blurred overlay. Its popup is white, bordered zinc-200, 20px radius on small screens and 24px at `sm`, max width `sm:max-w-lg`, and constrained by dynamic viewport height. Header and footer borders are on their full-width wrappers, so dividers meet the outer frame. Title is 20px bold; description is 12px gray. Opening and closing combine 150ms fade and scale. Source has literal English `Close` in two visually hidden labels and an optional footer action; this is an i18n deviation, not a convention. The [Sheet](../webapp/components/ui/sheet.tsx) is a separate Base UI dialog-based primitive with a lighter `bg-black/10` overlay.

[Select](../webapp/components/ui/select.tsx) triggers are bordered pills: default `h-11 px-5`; small `h-9 px-3.5`. They use active scale .98 and a three-pixel focus ring. Select and [Dropdown](../webapp/components/ui/dropdown-menu.tsx) popups use 20px radius, `p-2`, border, and the zero-opacity `shadow-xl` token. Select options use 12px radius, `py-2.5 pl-3.5`, semibold text and a checkmark; dropdown options use 12px radius, `px-3.5 py-2`, including destructive focus fill. Popup animations are 100ms with source-dependent slide direction.

[Sonner](../webapp/components/ui/sonner.tsx) is the shared toast renderer; [AGENTS.md](../AGENTS.md) specifies top-center, icon-left toasts and no toast when the same inline error is already visible. The code's [Input](../webapp/components/ui/input.tsx) limit toast can occur alongside form-local validation, so apply the project rule when extending forms rather than treating every existing feedback call as exemplary. Inline validation in settings uses left-aligned `text-destructive` text without an icon. [Source: settings](../webapp/components/dashboard/settings-content.tsx).

<a id="ds-shells"></a>
## DS-04: Merchant and terminal surfaces

The [dashboard](../webapp/components/dashboard/dashboard-shell.tsx) and [staff terminal](../webapp/components/staff/staff-terminal-shell.tsx) share a black full-height shell, collapsible dark navigation, white logo treatment, restaurant media block, and a white main panel. On narrow viewports, the sidebar becomes an overlay with a `bg-black/50` backdrop and a black mobile header. At `lg`, the white main panel gets a rounded left edge. The content panel is marked `@container`; the shell itself still uses viewport `lg`, which is appropriate to its full-window placement.

The desktop sidebar is `w-64` when expanded and `w-16` when collapsed: 307.2px or 76.8px under the project's spacing unit. Its narrow-screen overlay remains `w-64`, translates fully offscreen when closed, and starts below the `lg` viewport breakpoint. Header and mobile top bar are `h-16` (76.8px). Navigation rows are pill-shaped, with 11-step icon cells and an active dark accent. The restaurant identity block includes a wide banner aspect ratio of 2.3:1 and a smaller overlaid logo. Merchant and staff shells differ in navigation destinations and terminal authority, not in their basic visual frame. [Sources: merchant shell](../webapp/components/dashboard/dashboard-shell.tsx), [staff shell](../webapp/components/staff/staff-terminal-shell.tsx).

The [live order board](../webapp/components/dashboard/current-orders-content.tsx) uses `flex-1 min-h-0` to occupy the main panel height. Under 500px container width, queue lanes switch to compact tabs. At 500px they form two lanes. At 1110px the board changes to a horizontal master/detail arrangement. The left master is exactly 580px wide at this point; within it, `.current-orders-queue-grid` uses a 255px/remaining split via the global container rule. This is the implemented geometry; the previous root DESIGN.md claimed a fixed 540px master lane, which the source does not support. The [menu editor](../webapp/components/dashboard/menu-content.tsx) and [item workspace](../webapp/components/dashboard/menu/item-workspace.tsx) use the same semantic colors and container-responsive workspace principles. [Settings](../webapp/components/dashboard/settings-content.tsx) uses `@min-[480px]` and `@min-[600px]` grids, media previews, and danger-area cards. Uppercase tracked 14px section headers recur across the board and settings, matching the project convention.

<a id="ds-guest"></a>
## DS-05: Guest ordering and checkout

The [guest frontend](../webapp/components/guest/guest-frontend.tsx) presents a centered column no wider than 500px, with a black surround/header and a white guest surface. Its floating cart container appears only after the cart gains an item: max width 500px, white fill, top border, 24px top corners, explicit upward shadow `0 -8px 30px rgba(0,0,0,.08)`, and bottom padding at least 1.25rem or the device safe area. It enters with a 300ms fade/slide. The black pill within is `h-12 sm:h-13`, includes a `h-10 w-10` count disc, centered action text, and Price total. Current code has no arrow alongside the price, while [AGENTS.md](../AGENTS.md) calls for an arrow; record that as a deviation rather than copying the omission as a rule. The cart-focused view suppresses the merchant hero and presents its own return header, title, restaurant subtitle, and order type. The empty cart has no bottom navigation tabs. The [cart sheet](../webapp/components/guest/cart-sheet.tsx) has a tall mobile treatment, a white surface, bold subtotal/total presentation, email entry, translated explanatory copy, and a primary payment button. The checkout form renders a processing spinner and disables while processing. [Sources: checkout](../webapp/components/guest/checkout-form.tsx), [price](../webapp/components/ui/price.tsx).

The [customization modal](../webapp/components/guest/customization-modal.tsx) gives each option a 14px rounded bordered row. Selected rows receive black border/ring and a faint black fill; unselected rows retain white and hover gray; rows blocked by a maximum selection are dimmed. Radio and checkbox indicators distinguish exclusive and multiple selection. Step headings remain sticky while options scroll, and the fixed footer can gain an explicit upward shadow when content continues beneath it. This modal uses the light dialog frame and a final full-width add action.

The [order tracker](../webapp/components/guest/order-tracker.tsx) visually distinguishes in-progress, ready-for-pickup, and completed states and renders a three-step history. A ready transition can play a sound after user interaction. Its ten-minute live countdown currently begins only when status is `completed`, using `completedAt` with timestamp fallbacks; `ready_for_pickup` has no countdown. [AGENTS.md](../AGENTS.md) calls for a countdown once ready. Treat that as a documented implementation deviation, not the new design rule. The tracker also has a hardcoded locale ternary for the minute suffix, another deviation from the i18n convention.

<a id="ds-qr"></a>
## DS-06: QR, print, and numeric display

The [website QR showcase](../website/components/QrCodeShowcase.tsx) renders a real QR with square finder geometry, copy-sized print lettering, a lightly rotated paper surface, and two translucent tape pieces. The site's [QR print text](../website/components/QrPrintText.tsx) measures each line for consistent width after fonts load. Merchant QR creation and printing live mainly in [Overview](../webapp/components/dashboard/overview-content.tsx), with terminal and session QR displays elsewhere. Maintain black-on-white code contrast, the centered logo excavation where already implemented, and square or `square-sm` modules. Verify actual QR renderer props in a target surface before copying an old DESIGN.md value; the old file's hard-coded 360px dialog QR was too specific for a shared token.

The [Price component](../webapp/components/ui/price.tsx) formats cents with a decimal comma and euro sign. Numerals are Inter/tabular; symbol and optional translated prefix remain Poppins. The marketing website has a distinct [numeric-text helper](../website/lib/numeric-text.tsx). Other counters use explicit `font-inter tabular-nums`. Do not set Inter on a parent that contains prose or currency.

<a id="ds-website"></a>
## DS-07: Marketing website

The website is a light editorial surface driven by [MainPage](../website/components/MainPage.tsx) and [global CSS](../website/app/globals.css). The hero has two large words flanking the paper QR at wide widths; below 1024px it becomes a centered heading, QR, and copy stack. Content columns use 1200px maximum width; sections use generous 72–128px vertical spacing. A two-column flow shows actual phone and tablet product renders. Setup and footer are intentionally black; benefits, pricing, FAQ, and legal reading surfaces stay light.

The site CSS controls its own button pair, independent of the webapp primitive: both are 44px minimum height, 14px semibold, fully rounded, with 150ms hover/press transitions and 0.98 press scale. Nav text uses 13px bold uppercase and tracked letters. The QR paper has a small real shadow, a 2px radius, and translucent tape; this is a deliberate object treatment, not a general card style. The website defines a 2px black keyboard outline with 5px offset, inverted to white in dark sections. Reduced-motion CSS disables transitions and smooth scrolling; [AnimatedBenefitStat](../website/components/AnimatedBenefitStat.tsx) is a deliberate exception that counts 0 to 30 over 2200ms when visible and goes immediately to its target for reduced motion.

The site also contains a separate [website UI Button](../website/components/ui/button.tsx) primitive. Its default library dimensions and variants are distinct from the marketing page's `.button-primary` and `.button-outline` CSS classes. When extending the marketing surface, follow the classes used by [MainPage](../website/components/MainPage.tsx); do not infer that every website button uses the CSS marketing pair.

Viewport breakpoints include 1100px for region label/hero spacing, 1024px for hero reflow, 900px for flow, 720px for mobile navigation, 600px for one-column layout, and 359px for compact header controls. Later 1024px and 600px CSS overrides govern the current hero and win in the cascade. Do not copy the previous DESIGN.md's three-column desktop flow claim: the current flow grid is two phone columns plus a full-width kitchen/tablet step.

<a id="ds-i18n"></a>
## DS-08: Internationalization and accessibility

[AGENTS.md](../AGENTS.md) requires every UI string and destination through `next-intl`, no locale ternaries, and country endonyms. Most screens use translation hooks; known visible source exceptions include literal `Close` in the generic [dialog](../webapp/components/ui/dialog.tsx) and the minute suffix in the [tracker](../webapp/components/guest/order-tracker.tsx). These are deviations to resolve when those components are changed. Phosphor is the specified icon family and is used throughout the sampled shared primitives and major surfaces; the dependency tree also includes `lucide-react`, which does not make it a design-system choice.

Base UI primitives provide dialog/select/menu interaction semantics. The shared button, input, and select declare focus-visible rings; the website declares a visible global focus outline and a reduced-motion rule. Native labels, screen-reader-only text, selected-state announcements, and disabled state should be preserved when extending a surface. The source review documents implementation patterns; it is not a full assistive-technology audit. Inline errors should be left aligned, destructive colored, and free of decorative error icons under the project convention.

<a id="ds-decisions"></a>
## DS-09: What not to canonize

The old DESIGN.md mixed exact source tokens with older assumptions: hex approximations as canonical values, stock 4px spacing, visible theme shadows, 540px order queue, 44/48px button equivalence, blanket zero animations, and a ten-minute countdown at ready state. This reference retains valid brand direction while anchoring dimensions and behavior to current source. The project convention in [AGENTS.md](../AGENTS.md) remains authoritative for future changes when current code differs. This documentation does not silently turn deviations into guidance.

<a id="ds-more-primitives"></a>
## DS-10: Remaining webapp primitives

These entries describe the [source-owned UI library](../webapp/components/ui/). The source files can be changed independently, so use the linked implementation for prop details and the table for visual intent. All numeric Tailwind dimensions below use the 0.3rem unit from DS-01.

| Primitive | Geometry and default appearance | States and behavior | Source |
| --- | --- | --- | --- |
| Checkbox | `size-4` (19.2px), 4px radius, `border-input`; bold Phosphor check | Checked becomes black/white; focus ring 3px, invalid destructive ring, disabled 50% opacity. A pseudo-element extends the pointer target beyond the box. | [checkbox](../webapp/components/ui/checkbox.tsx) |
| Switch | `h-5 w-9` (24×43.2px) pill, 2px transparent border, white `h-4 w-4` thumb | Off uses input gray, on uses primary black; thumb translates by `4` utility steps; focus ring 2px with offset; disabled 50% opacity. | [switch](../webapp/components/ui/switch.tsx) |
| Tabs | Horizontal or vertical Base UI root; trigger has medium 14px text, `rounded-md`, and `px-1.5` | Default variant uses white active fill; line variant adds a thin black underline or side rail; inactive text is 60% foreground; visible focus ring and disabled opacity. | [tabs](../webapp/components/ui/tabs.tsx), [variants](../webapp/components/ui/tabs-variants.ts) |
| Textarea | `min-h-16`, `rounded-lg`, bordered transparent fill, `px-2.5 py-2`, content-aware field sizing | Focus/invalid/disabled match Input. Default max length is 1000 and overflow typing or paste emits a translated toast. | [textarea](../webapp/components/ui/textarea.tsx) |
| OTP input | Input-OTP group of `size-8` (38.4px) bordered `rounded-md` slots; optional Minus separator | Active slot has a one-pixel ring and a fake blinking caret; invalid border is destructive; disabled group fades. | [input-otp](../webapp/components/ui/input-otp.tsx) |
| Table | Full-width 14px table inside a horizontal overflow container | Header `h-11 px-3`, bold tracked uppercase; rows have bottom borders and muted hover/selection; cells `p-2`; footer muted/50 fill. | [table](../webapp/components/ui/table.tsx) |
| Pagination | Centered nav with `gap-0.5`; page links compose Button | Active page uses outline, other pages ghost; Previous/Next text hides below `sm`, with Phosphor carets. Generic primitive retains literal English default labels and aria-labels, an i18n deviation. | [pagination](../webapp/components/ui/pagination.tsx) |
| Avatar | Circle with a subtle border overlay; default `size-8`, small `size-6`, large `size-10` | Image crops with object-cover; fallback has muted fill; badge overlays bottom-right; group overlaps members. | [avatar](../webapp/components/ui/avatar.tsx) |
| Tooltip | Foreground-black popup with inverse text, `rounded-lg`, `px-3 py-2`, 12px type | Base UI provider delay defaults to zero, popup side defaults top with 6px offset; side-dependent entrance. | [tooltip](../webapp/components/ui/tooltip.tsx) |
| Popover | Base UI anchored popup using semantic popover colors | Preserve source positioner origin, border, opening and closing states; unlike Dialog it does not dim the page. | [popover](../webapp/components/ui/popover.tsx) |
| Scroll area | Base UI scroll container with contained viewport and separate bar/thumb | Use for fixed-height lists such as QR table management rather than letting panels grow beyond the work area. | [scroll area](../webapp/components/ui/scroll-area.tsx), [overview use](../webapp/components/dashboard/overview-content.tsx) |

The shared [webapp Dialog](../webapp/components/ui/dialog.tsx) is worth copying by anatomy, not just radius. The popup is `max-w-[calc(100%-1.5rem)]` below `sm`, `sm:max-w-lg`, `max-h-[calc(100dvh-1.5rem)]` below `sm`, and `sm:max-h-[85vh]`. Header uses `px-5 sm:px-6 py-4 sm:py-5` (24/28.8px horizontal and 19.2/24px vertical at a 16px root). Body repeats those inset values and scrolls. Footer uses `px-5 sm:px-6 py-3.5 sm:py-4` with `gap-2.5 sm:gap-3`, column-reversed on mobile and a row on `sm`. The header/footer borders sit on those wrappers for edge-to-edge dividers. Optional close controls have a visually hidden name; local literal English labels are a known deviation. The [Sheet](../webapp/components/ui/sheet.tsx) supports top, right, bottom, and left sides and uses a lighter backdrop. The guest cart applies additional height and corner overrides to the sheet.

<a id="ds-auth"></a>
## DS-11: Authentication and security forms

The [auth layout](../webapp/app/%28auth%29/layout.tsx) centers children in a max-500px column on a `bg-secondary` canvas with `p-4 sm:p-8`. Sign-in, sign-up, reset, email-change, and deletion routes share this light environment and the same Card/Button/Input vocabulary. [Sign-in](../webapp/app/%28auth%29/sign-in/page.tsx) switches from credentials to an OTP form after a successful first step. The OTP screen has six individual visual slots, an active caret, verification loading state, resend countdown, lockout feedback, and a 30-minute validity timer. The [timer](../webapp/components/auth/otp-validity-timer.tsx) keeps numerals tabular; inline expiry is destructive text. The 30-minute duration and five-failure lockout are lifecycle requirements in [AGENTS.md](../AGENTS.md), not visual tokens.

Copy the form pattern as a light centered card with explicit labels, a primary pill submit action, disabled/loading treatment, and left-aligned validation text. The source currently toasts some action errors in the sign-in page; [AGENTS.md](../AGENTS.md) says not to duplicate an inline error with a toast. The auth layout metadata also uses a locale ternary for its description, which is outside the UI design standard. [Source: auth layout](../webapp/app/%28auth%29/layout.tsx).

<a id="ds-menu"></a>
## DS-12: Menu editor, item workspace, and availability

The [menu manager](../webapp/components/dashboard/menu-content.tsx) sits inside the white dashboard content region and coordinates category navigation, item management, and edit actions. The [item workspace](../webapp/components/dashboard/menu/item-workspace.tsx) combines image preview/upload, item fields, price, availability, and customization controls. The [image upload](../webapp/components/dashboard/menu/image-upload.tsx) owns object-cover preview, file replacement and drag/drop. The [customization builder](../webapp/components/dashboard/menu/customization-builder.tsx) groups option sets, min/max selection constraints, included counts, and option surcharges. Forms use shared bordered inputs and pill actions; selected or destructive states must remain explicit when reorganizing the editor. Container-aware changes use `ResizeObserver` or `@container` in the editor rather than inferring width from the window.

The [availability terminal](../webapp/components/availability/availability-content.tsx) is an operational surface for switching menu availability, with item images, status indicators, and clear toggle affordances. The initial guest menu query excludes unavailable items, so availability cannot be described as a universal grayscale/disabled guest card state. The [staff shell](../webapp/components/staff/staff-terminal-shell.tsx) supplies the same black sidebar/white workspace frame as the merchant dashboard.

<a id="ds-overview"></a>
## DS-13: Overview, archive, and QR print

The [overview](../webapp/components/dashboard/overview-content.tsx) uses a sticky light section header and a responsive card grid. Its high-level cards become two columns at 700px of container width and four at 1300px; nested feature cards divide at 500px. The statistics chart card presents order count in Inter and revenue through Price; a pill filter controls its period. The chart area reserves at least 260px at narrow widths and 280px from `sm`. It is a functional data display, not a decorative accent. [Source: chart wrapper](../webapp/components/dashboard/overview-chart.tsx).

QR management is part of this overview. The table list has a bounded scroll area around 370px high, a two-column table tile grid, empty-state copy, an add-table pill, and a preview panel. The QR preview includes print lettering, code, and a dedicated print action. At a 500px container threshold the QR card forms list/preview columns. The hidden print layer becomes a two-column print grid and uses 230px-wide card content, dashed cutting boundaries, and no display shadow/ring. A QR code must be sized and centered from the actual renderer in the target surface, not inferred from an older specification. [Source: QR management and print](../webapp/components/dashboard/overview-content.tsx).

The [all-orders archive](../webapp/components/dashboard/all-orders-content.tsx) starts with a sticky header, search field, and pill filters. At a 700px container width, the filter/search row changes from stacked to horizontal. The search field is `h-11` and rounded full, with search and clear icons. The archive provides sorting indicators, status filtering, tabular order numbers and amounts, a table/list region, loading and empty states, and paging controls. Keep headings and cell values legible at narrow widths, retaining horizontal scroll where necessary rather than compressing numeric data. The [Table](../webapp/components/ui/table.tsx) and [Pagination](../webapp/components/ui/pagination.tsx) define shared styling; the archive may layer its own layout on top.

<a id="ds-region"></a>
## DS-14: Region and language choice

The [webapp region/language switcher](../webapp/components/region-language-dialog.tsx) opens a modal, copies the current region and locale into draft state, offers checkmarked choices, and applies them only when the user commits. Escape closes it. The visual frame follows the light dialog architecture with edge-to-edge divisions and pill footer buttons. Native region names remain endonyms. It includes a German flag SVG, not an emoji. [AGENTS.md](../AGENTS.md) requires language switching through this modal interaction, not abrupt toggles.

The website's [RegionLanguageModal](../website/components/RegionLanguageModal.tsx) uses the native `<dialog>` element with `showModal()`, records and restores prior focus, prevents background scrolling while open, and closes through cancellation or backdrop click. Draft locale becomes active only on apply. On apply, the route destination is selected through translated URL keys, maintaining the legal/home destination across languages. Its [CSS](../website/app/globals.css) defines a white 24px-radius frame with full-width header and footer separators, padded options and visible selected/focus states. This is a parallel implementation of the same interaction contract, not a direct reuse of the webapp's Base UI dialog.

<a id="ds-15-tailwind-first-authoring"></a>
## DS-15: Tailwind-first authoring

The [root rules](../AGENTS.md) require Tailwind utilities for styling that can be expressed cleanly in both apps, especially the webapp. Compose layout, spacing, typography, responsive and container behavior, state variants, transitions, and hover/focus/active feedback in JSX/TSX. Tailwind arbitrary values and variants cover literal dimensions and project-specific selectors when named utilities do not. Check the project's `--spacing: 0.3rem` before selecting a numeric spacing utility; a literal `p-[8px]` is appropriate when exactly 8px is required ([webapp globals](../webapp/app/globals.css), [website globals](../website/app/globals.css)).

Do not add `globals.css` rules, CSS modules, or inline static styles for presentation already expressible with utilities. Shared tokens and fonts, global resets, keyframes, and runtime or third-party styling constraints may need custom CSS. Keep those exceptions narrow and explain the reason near the implementation when it is not apparent. Existing [webapp CSS](../webapp/app/globals.css) and [website CSS](../website/app/globals.css) include legacy or surface-specific rules; this section is an authoring target, not a claim that every current rule already complies or a request to refactor unrelated code. The [documentation audit](documentation-audit.md) and [portable design summary](../DESIGN.md) distinguish current behavior from intended standards.
