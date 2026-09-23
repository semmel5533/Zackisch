# Design system reference

This is the source-linked implementation reference for [DESIGN.md](../DESIGN.md). [AGENTS.md](../AGENTS.md) states required targets; source links below describe what is implemented. Known differences remain explicit. [UX research](ux-research.md) explains the evidence behind clarity, accessibility, and recovery rules without claiming that a color or radius causes conversions.

| ID | Area | Source |
| --- | --- | --- |
| [DS-01](#ds-tokens) | Shared tokens | [webapp CSS](../webapp/app/globals.css), [website CSS](../website/app/globals.css) |
| [DS-02](#ds-primitives) | Buttons, fields, cards | [webapp UI](../webapp/components/ui/), [website variants](../website/components/ui/button-variants.ts) |
| [DS-03](#ds-overlays) | Dialogs, popups, feedback | [dialog](../webapp/components/ui/dialog.tsx), [select](../webapp/components/ui/select.tsx), [website modal](../website/components/RegionLanguageModal.tsx) |
| [DS-04](#ds-shells) | Dashboard and terminal shells | [dashboard](../webapp/components/dashboard/dashboard-shell.tsx), [staff](../webapp/components/staff/staff-terminal-shell.tsx) |
| [DS-05](#ds-guest) | Guest ordering and payment | [guest](../webapp/components/guest/guest-frontend.tsx), [cart](../webapp/components/guest/cart-sheet.tsx) |
| [DS-06](#ds-qr) | QR, print, numbers | [overview](../webapp/components/dashboard/overview-content.tsx), [website QR](../website/components/QrCodeShowcase.tsx) |
| [DS-07](#ds-website) | Marketing site | [page](../website/components/MainPage.tsx), [header](../website/components/Header.tsx) |
| [DS-08](#ds-i18n) | Localization and accessibility | [rules](../AGENTS.md), [research](ux-research.md) |
| [DS-09](#ds-decisions) | Evidence and deviations | [audit](documentation-audit.md) |
| [DS-10](#ds-more-primitives) | Additional primitives | [webapp UI](../webapp/components/ui/) |
| [DS-11](#ds-auth) | Authentication forms | [auth layout](../webapp/app/%28auth%29/layout.tsx) |
| [DS-12](#ds-menu) | Menu and availability | [menu](../webapp/components/dashboard/menu-content.tsx), [availability](../webapp/components/availability/availability-content.tsx) |
| [DS-13](#ds-overview) | Overview, archive, QR management | [overview](../webapp/components/dashboard/overview-content.tsx), [archive](../webapp/components/dashboard/all-orders-content.tsx) |
| [DS-14](#ds-region) | Region and language | [webapp](../webapp/components/region-language-dialog.tsx), [website](../website/components/RegionLanguageModal.tsx) |
| [DS-15](#ds-15-tailwind-first-authoring) | Tailwind authoring | [rules](../AGENTS.md), [CSS sources](../webapp/app/globals.css) |

<a id="ds-tokens"></a>
## DS-01: Tokens and computed scale

Both stylesheets use a white/black semantic base with muted surface `oklch(0.97 0 0)`, muted text `oklch(0.5 0 0)`, input border `oklch(0.65 0 0)`, and quieter container border `oklch(0.922 0 0)`. Destructive red is `oklch(0.577 0.245 27.325)`. Website `--site-muted`, `--site-line`, and `--site-soft` alias shared muted-text, border, and muted-surface roles, respectively. The webapp separately defines dark sidebar roles. [Webapp tokens](../webapp/app/globals.css), [website tokens](../website/app/globals.css).

The shared Tailwind `--spacing` is `0.25rem`: at a 16px root `p-2 = 8px`, `p-4 = 16px`, `h-9 = 36px`, `h-11 = 44px`, and `h-12 = 48px`. The explicit radii are `sm 4px`, `md 8px`, `lg 12px`, `xl 20px`, and `2xl` through `4xl 24px`. Use the actual token rather than assuming a stock Tailwind radius. [Webapp CSS](../webapp/app/globals.css), [website CSS](../website/app/globals.css).

All ordinary theme shadows have the valid transparent value `0 0 #0000`. A visible popup or dialog must opt into an explicit surface shadow, as the [webapp theme](../webapp/app/globals.css) does. The website's [QR paper](../website/components/QrCodeShowcase.tsx) uses a deliberate physical shadow. Transparent shadows are kept syntactically valid so they do not invalidate composited focus rings.

Both [root layouts](../webapp/app/layout.tsx) and [website layout](../website/app/layout.tsx) load Poppins and Inter. Poppins carries words; Inter with tabular figures is for isolated digits and decimal separators. The webapp [Price](../webapp/components/ui/price.tsx) keeps the currency sign and prefix outside its Inter numeral span. Existing `number` and `tel` CSS selects Inter for all entered characters, which is a source-level exception to the strict numeric-only rule. All-caps typography is strictly reserved: on the website, it is used exclusively for navigation and legal links ([Header](../website/components/Header.tsx), [SiteFooter](../website/components/SiteFooter.tsx)) to establish crisp architectural wayfinding; on the webapp, it is used exclusively for physical QR code signage text ([Overview](../webapp/components/dashboard/overview-content.tsx)) to maximize high-contrast legibility from a distance on physical standees and stickers. All other webapp UI headings, section titles, table heads, badges, and controls use natural sentence and title casing in bold Poppins (`text-sm font-bold text-foreground`).

<a id="ds-primitives"></a>
## DS-02: Buttons, fields, and cards

The [webapp Button](../webapp/components/ui/button.tsx) and [website button variants](../website/components/ui/button-variants.ts) share the action hierarchy: black default, white bordered outline, quiet ghost, and red destructive. `secondary` remains a compatibility alias for outline. The webapp also has a link variant. Default buttons are `h-11` (44px), compact `h-9` (36px), large `h-12` (48px), and icon controls 44px; compact targets expand to at least 44px with coarse pointers. Labels are generally 14px semibold. Hover, active scale .98, disabled opacity, 2px focus ring with 2px offset, and reduced-motion behavior are defined in the primitives. The website applies the same roles to registration and sign-in; the header sign-in is outline so it does not compete visually with the primary registration action. [Header](../website/components/Header.tsx).

The [webapp Input](../webapp/components/ui/input.tsx) is a 44px-minimum white field with 12px corners, `border-input`, explicit focus and invalid states, and a default 255-character cap. The [Card](../webapp/components/ui/card.tsx) uses a light surface and shared card radius; check its source for size-specific spacing. Other fields and badges may still carry local older geometry; the shared design target is the 12px field and 20px card hierarchy, not a claim that every historical component already matches it.

<a id="ds-overlays"></a>
## DS-03: Overlays and feedback

The [webapp Dialog](../webapp/components/ui/dialog.tsx) provides the light 20px-mobile/24px-desktop frame with full-width header/footer dividers. All dialog and sheet headers with a close action align the 'X' button vertically on the exact center datum line with the header title (`flex items-center justify-between`). [Select](../webapp/components/ui/select.tsx) and [Dropdown](../webapp/components/ui/dropdown-menu.tsx) use the 20px outer popup, 8px padding, and 12px item target. This makes the inset corners concentric. An explicit visible shadow distinguishes floating layers from ordinary cards. [AGENTS.md](../AGENTS.md) defines the anatomy and role order.

The website [RegionLanguageModal](../website/components/RegionLanguageModal.tsx) uses native `<dialog>` with `showModal()`, draft selection, translated destinations, backdrop/Escape dismissal, and focus restoration. Its backdrop and entrance use Tailwind utilities; [global CSS](../website/app/globals.css) contains shared tokens, fonts, resets, and reduced-motion behavior rather than component styling. It is a parallel implementation of the same light dialog behavior, not a reuse of Base UI.

[Sonner](../webapp/components/ui/sonner.tsx) renders toasts; [AGENTS.md](../AGENTS.md) requires top-center, icon-left toasts, left-aligned inline errors, and no duplicate toast when an inline error already explains the failure. Do not infer full compliance from the shared primitive alone.

<a id="ds-shells"></a>
## DS-04: Merchant and terminal shells

The [dashboard](../webapp/components/dashboard/dashboard-shell.tsx) and [staff shell](../webapp/components/staff/staff-terminal-shell.tsx) place a black sidebar beside white work content. On desktop viewports, all dashboard work panels and the sidebar header share an exact 64px height (`h-16`) and vertical datum line center at $y = 31.5\text{px}$, keeping the sidebar `zakkig` logo and the page's `h1` title in perfect horizontal alignment. The outer shell responds to viewport width; dashboard panels use `@container` so their layout responds to space remaining after the sidebar. The overview dashboard structures the staff terminal session ([StaffSessionCard](../webapp/components/dashboard/staff-session-card.tsx)) into an operational card with quick actions beside a balanced 2x2 quick links grid with contextual InfoTooltips. The [live order board](../webapp/components/dashboard/current-orders-content.tsx) switches queue presentation at container thresholds. [Menu](../webapp/components/dashboard/menu-content.tsx) and [settings](../webapp/components/dashboard/settings-content.tsx) are separate work areas with their own responsive content. In the menu editor, category and item creation uses consistent dashed cards (`border border-dashed border-muted-foreground/40`) at the end of each collection, keeping navigation headers clean.

<a id="ds-guest"></a>
## DS-05: Guest ordering and checkout

The [guest frontend](../webapp/components/guest/guest-frontend.tsx) keeps menu and cart content in a narrow column and reveals a bottom cart action after an item is added. A signature black dashed divider line (`border-b border-dashed border-black`) separates the top restaurant branding and address from the sticky categories carousel, maintaining tactile physical anchoring in hospitality environments. Inside the cart view, item quantity controls use a compact, narrow stepper pill (`h-8`, `size-7` actions) preventing layout crowding next to item titles and totals. [Cart sheet](../webapp/components/guest/cart-sheet.tsx) and [checkout form](../webapp/components/guest/checkout-form.tsx) present selection review and payment with a prominent action. [Customization](../webapp/components/guest/customization-modal.tsx) distinguishes selected, unselected, disabled, and required choices. The [tracker](../webapp/components/guest/order-tracker.tsx) renders in-progress, ready, and completed states; its ten-minute UI timer begins at `readyAt`, with timestamp fallbacks for older orders. The timer does not revoke backend reads; see the [audit](documentation-audit.md).

<a id="ds-qr"></a>
## DS-06: QR, print, and numbers

The [website QR showcase](../website/components/QrCodeShowcase.tsx) renders a real high-contrast QR on a tilted, taped paper sheet. The [print lettering](../website/components/QrPrintText.tsx) fits after fonts load. Merchant QR management and browser printing use the [overview](../webapp/components/dashboard/overview-content.tsx); this is `window.print`, not a dedicated PDF generator. Physical QR print signage uses bold uppercase lettering for high-contrast affordance and distance readability at dining tables and counters. [Price](../webapp/components/ui/price.tsx) separates numeric Inter from Poppins words and symbols. The website has its own [numeric helper](../website/lib/numeric-text.tsx).
 
<a id="ds-website"></a>
## DS-07: Marketing website

[MainPage](../website/components/MainPage.tsx) keeps the editorial hero, QR sheet, product views, setup flow, pricing, FAQ, and signup action. [Header](../website/components/Header.tsx) uses translated native hash links and an accessible mobile menu with Escape dismissal and focus return. [ProductDemo](../website/components/ProductDemo.tsx) renders the committed DE/EN captures; their visual currency depends on regeneration from the webapp [fixture](../webapp/tools/marketing-demo/) after webapp changes. The page uses the shared button roles and 4px scale; static layout is authored in Tailwind JSX, with [global CSS](../website/app/globals.css) reserved for tokens and base behavior. [AnimatedBenefitStat](../website/components/AnimatedBenefitStat.tsx) animates on intersection and jumps to its target under reduced motion.

The website uses viewport composition breakpoints and retains a black setup and footer contrast to the light sections. Navigation and legal links render with tracked uppercase (`uppercase tracking-[0.08em]`) for distinct wayfinding, while buttons, dialog triggers, and body text use natural casing. Its QR paper shadow is an object treatment, not general elevation. [Page](../website/components/MainPage.tsx), [QR](../website/components/QrCodeShowcase.tsx), [footer](../website/components/SiteFooter.tsx).

<a id="ds-i18n"></a>
## DS-08: Localization and accessibility

[AGENTS.md](../AGENTS.md) requires translated UI text and destinations, native country endonyms, Phosphor icons, and visible feedback. Both button foundations define keyboard focus and reduced-motion handling; the website has a global focus rule and native dialog. These source facts do not constitute an assistive-technology or WCAG conformance assessment. [Research and criteria](ux-research.md) cover readable text/control boundaries, keyboard focus, target size, reflow, error recovery, and motion. Literal English labels or locale ternaries still present in webapp components are deviations, not reusable patterns. [Webapp dialog](../webapp/components/ui/dialog.tsx), [tracker](../webapp/components/guest/order-tracker.tsx).

<a id="ds-decisions"></a>
## DS-09: Evidence and deviations

The 4px grid, black primary, Poppins/Inter split, and corner radii are design decisions for this product. [UX research](ux-research.md) supports clear actions, recognition, readable forms, and accessible interaction; it does not show that these exact tokens increase sales. Current source can differ from an [AGENTS.md](../AGENTS.md) target. The [documentation audit](documentation-audit.md) identifies significant behavior and security gaps; it is not a waiver.

<a id="ds-more-primitives"></a>
## DS-10: Additional primitives

[Checkbox](../webapp/components/ui/checkbox.tsx), [switch](../webapp/components/ui/switch.tsx), [tabs](../webapp/components/ui/tabs.tsx), [textarea](../webapp/components/ui/textarea.tsx), [OTP](../webapp/components/ui/input-otp.tsx), [table](../webapp/components/ui/table.tsx), [pagination](../webapp/components/ui/pagination.tsx), [avatar](../webapp/components/ui/avatar.tsx), [tooltip](../webapp/components/ui/tooltip.tsx), [popover](../webapp/components/ui/popover.tsx), and [scroll area](../webapp/components/ui/scroll-area.tsx) own their local behavior. Compose from them where appropriate; check the linked source for geometry and states before copying an older screen. Use the shared roles and focus/error conventions when bringing a local primitive into alignment.

<a id="ds-auth"></a>
## DS-11: Authentication forms

The [auth layout](../webapp/app/%28auth%29/layout.tsx) centers light cards and fields. [Sign-in](../webapp/app/%28auth%29/sign-in/page.tsx) proceeds from credentials to OTP, with timer and error feedback. Preserve entered values, explicit labels, loading/disabled states, and left-aligned inline recovery text. The [OTP timer](../webapp/components/auth/otp-validity-timer.tsx) is a lifecycle display, not a visual token; consult [architecture](architecture.md) for actual session and OTP limits.

<a id="ds-menu"></a>
## DS-12: Menu and availability

[Menu management](../webapp/components/dashboard/menu-content.tsx) coordinates category and item editing. The [item workspace](../webapp/components/dashboard/menu/item-workspace.tsx) and [customization builder](../webapp/components/dashboard/menu/customization-builder.tsx) expose images, choices, included counts, and prices. [Availability](../webapp/components/availability/availability-content.tsx) supplies operational toggles. Keep selected, disabled, and destructive states explicit, and use container width for embedded editor changes.

<a id="ds-overview"></a>
## DS-13: Overview, archive, and QR management

The [overview](../webapp/components/dashboard/overview-content.tsx) combines summary cards, chart, and QR management. Browser print renders the QR sheet. The [archive](../webapp/components/dashboard/all-orders-content.tsx) contains search, filters, order table, and paging. These screens use the shared shell and content-width adaptations; their data limitations are described in the [webapp README](../webapp/README.md) and [architecture](architecture.md).

<a id="ds-region"></a>
## DS-14: Region and language

The [webapp switcher](../webapp/components/region-language-dialog.tsx) and [website switcher](../website/components/RegionLanguageModal.tsx) stage region/language changes in a modal and apply them on confirmation. Both keep endonym labels. The website's native dialog handles Escape, backdrop dismissal, and focus return. [AGENTS.md](../AGENTS.md) makes the modal path a required interaction instead of an abrupt toggle.

<a id="ds-15-tailwind-first-authoring"></a>
## DS-15: Tailwind-first authoring

The [root rules](../AGENTS.md) require Tailwind utilities for styling that can be expressed cleanly in both apps. This covers layout, spacing, typography, responsive and container variants, state, transitions, hover, focus, and active feedback. The shared 4px scale means `p-2` is exactly 8px at a 16px root; use arbitrary values for other exact geometry. Reserve custom CSS for shared tokens/fonts, resets, keyframes, and genuine runtime or third-party constraints. [Website CSS](../website/app/globals.css) now follows that narrow role; existing [webapp CSS](../webapp/app/globals.css) can still contain legacy surface rules. These are authoring targets, not a reason to refactor unrelated screens without verifying them.
