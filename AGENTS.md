These rules describe required implementation targets. [DESIGN.md](DESIGN.md) summarizes the intended visual system; [docs/design-system.md](docs/design-system.md) records source-backed UI details and current deviations; [docs/ux-research.md](docs/ux-research.md) explains supporting UX evidence; [docs/documentation-audit.md](docs/documentation-audit.md) records other known implementation gaps. A documented deviation does not waive a rule below.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- **Proxy Convention (Next.js 16+):** The `middleware.ts` file convention is deprecated and renamed to `proxy.ts`. Always use `proxy.ts` (exporting `export const proxy = ...` and default export) instead of `middleware.ts`.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shadcn-agent-rules -->

# shadcn

While interacting with shadcn make sure to use the shadcn mcp for more context.

<!-- END:shadcn-agent-rules -->

<!-- BEGIN:i18n-rules -->

# Internationalization (i18n)

All UI texts, labels, and URLs must be handled consistently and exclusively using `next-intl` (i.e. `t("key")`).
- DO NOT hardcode any language strings directly in JSX (e.g. `<div>Speichern</div>`).
- DO NOT use logical fallbacks with hardcoded text (e.g. `{t("key") || "Fallback"}`).
- DO NOT use ternary conditions based on locale for URLs or texts (e.g. `locale === "de" ? "/de/agb" : "/en/terms"`). Define these as translation keys in `i18n.ts` instead.

<!-- END:i18n-rules -->

<!-- BEGIN:anti-ai-slop-rules -->

# Anti-AI Slop & Clean Code Quality

Keep the codebase clean, professional, minimal, and human-written. Strictly follow these quality constraints:

1. **Zero Emojis:**
   - DO NOT use emojis anywhere in the codebase: no emojis in source code, JSX, comments, documentation, markdown headers, or commit messages.
   - Use Phosphor Icons (`@phosphor-icons/react`) for UI iconography.

2. **No Decorative Comment Dividers:**
   - DO NOT use decorative AI-style horizontal comment lines (e.g. `// ─── Categories ───` or `// ==================`).
   - Use clean, standard, idiomatic comments (e.g. `// Categories`, `// Menu Items`).

3. **No AI Debug Logging:**
   - DO NOT introduce temporary or weird `console.log` statements (e.g. `console.log("Here we do...", ...)`, `console.log("DEBUG: ...")`).
   - Use only standardized `console.error` and `console.warn` for genuine, unhandled server-side exceptions or browser API fallback events.

4. **No Boilerplate Bloat or Over-Engineering:**
   - Write concise, idiomatic, high-performance TypeScript. Avoid unnecessary abstractions, wrapper-layers, or redundant types.

<!-- END:anti-ai-slop-rules -->

<!-- BEGIN:architecture-security-rules -->

# System Architecture & Security (Defense-in-Depth)

Follow this unified, multi-layered architecture for all features and changes:

1. **Strict Layering & Entry Points:**
   - **Client Components** must NEVER call mutating Convex functions directly. All mutations MUST run through Next.js Server Actions (`webapp/actions/`).
   - **Server Actions** validate the request boundary: validate input types, verify authorization, sanitize errors, and call Convex via `convexServer`.
   - **Convex Functions** enforce authorization and defense-in-depth: validate the caller session, tenant ownership, string lengths, bounds, and business invariants directly in mutation handlers. Menu and session management use `convex/permissions.ts`; never treat a caller-supplied organization ID as authorization.

2. **Tenant Isolation & Authorization (Anti-IDOR):**
   - Every Server Action that modifies or accesses organization data MUST call `await requireOwner(organizationId)`. Never trust client-supplied `organizationId` without checking `org.ownerId === user._id`.
   - Operations on terminal endpoints (kitchen display, 86-availability) must be authorized with `requireKitchenOrOwner` or `requireStaffOrOwner`.
   - Dashboard layouts must strictly verify ownership (`if (org.ownerId !== user._id && org.ownerId !== user.$id) redirect("/sign-in")`).

3. **Zero Data Leakage (Guest Boundary & DOM Hygiene):**
   - When passing data to public guest pages (`pickup`, `table`), NEVER expose sensitive merchant or platform accounting data (`stripeAccountId`, `taxId`, `ownerId`, `zakkigFee`, `stripeFee`, `netAmount`). Always sanitize or zero out before serializing into RSC payloads or query responses.

4. **Server-Side Price & Integrity Enforcement:**
   - NEVER trust client-supplied prices, item names, or order totals.
   - `createCheckoutSession` and `createPaymentIntent` must use `priceCheckout` to validate every item and selected option, recalculate stored base prices and option surcharges including free selections, and match the total to the exact cent. Payment metadata must contain canonical names and prices.

5. **Convex Public API Surface Minimization:**
   - Functions not called directly by the browser MUST be declared as `internalMutation`, `internalQuery`, or `internalAction` (e.g. file deletion, database seeds, webhook order processing).
   - Sensitive user mutations (`createAccountDeletionToken`, `createEmailChangeToken`) must require and verify a valid server-issued `sessionToken`.
   - Never leave unauthenticated or debug queries (like `listAll`) open on Convex.

6. **Standardized Lifecycles & Timeouts (TTL):**
   - **Auth, OTPs & Security Links:** Strictly 30 minutes (`30 * 60 * 1000` ms).
   - **Brute-Force Lockout:** OTP codes must track failed attempts and permanently delete the code after 5 failures.
   - **Kitchen Board Lifecycle:** Explicit manual completion (orders start in progress, advance to ready for pickup, and transition to completed, removing them immediately from current orders).
   - **Guest Takeaway Tracker:** Remains active on the tracking page until the order is cancelled or completed.

7. **Terminal Session Persistence:**
   - Terminal pairing tokens from URLs (`?token=...`) must be persisted via secure, HttpOnly, SameSite=lax cookies (`staff_session_[orgId]`, `order_session_[orgId]`, `availability_session_[orgId]`). Never store pairing tokens in unencrypted client `localStorage`.

8. **Table Name & Number Boundary (Max 4 Characters):**
   - Table names and numbers must strictly never exceed 4 characters (`<= 4`). Enforce both client-side (`maxLength={4}`, input clamping) and server-side across all Server Actions (`settings-actions`, `checkout-actions`, `order-actions`) and Convex mutations (`organizations`, `orders`, `stripe`).

9. **Order Numbering Integrity (Rolling 001 - 999):**
   - Order numbers strictly count sequentially upwards from `001` to `999` and roll over back to `001`. The calculation must always inspect the maximum allocated number (`maxNum`) from recent orders to prevent countdown artifacts.

10. **Container-Width-Based Responsive Layouts:**
   - Dashboard layouts and responsive switches must evaluate against the available content width without the sidebar. Use CSS Container Queries (`@container`, `desktop:*`, `tablet:*`, `@min-[...]`) and `ResizeObserver` on the content container instead of window viewport media queries (`window.innerWidth`, `window.matchMedia`).

11. **Zero-Node-Edge Architecture (Cloudflare Workers & vinext):**
   - Next.js Server Actions and components must remain 100% free from Node.js-specific TCP/socket libraries (`nodemailer`, raw socket APIs).
   - All transactional email dispatching and third-party payment provider verification MUST be delegated to Convex backend actions and mutations.

<!-- END:architecture-security-rules -->

<!-- BEGIN:ui-feedback-conventions -->

# UI Feedback, Form Errors & Toast Conventions

1. **Toast Notifications:**
   - Must ALWAYS render at the top center (`position="top-center"`), regardless of viewport (desktop or mobile).
   - Icons are reserved exclusively for toasts (positioned on the left of the pill). The text in the container to the right of the icon is centered.
   - DO NOT fire a toast if an inline error message is already visible on the screen or form (avoid duplicate user feedback).

2. **Form Errors & Inline Notices:**
   - Must ALWAYS be left-aligned (`text-left`, `w-full`).
   - Must ALWAYS use the standard error color token `text-destructive` with `text-sm font-medium` (or `text-sm font-semibold`).
   - DO NOT use icons next to inline form error or warning text.
   - DO NOT use heavy, blocky background alert boxes for simple form validation errors or attempts counters.

3. **Interactive Tooltip Standard & Order ID Copy:**
   - All tooltips across the webapp (`tooltip.tsx`, `info-tooltip.tsx`) must support tap/click to toggle open/close in addition to hover, ensuring full accessibility on mobile and touch devices while preserving outside-click and Escape dismissal.
   - On the "Alle Bestellungen" page (`all-orders-content.tsx`), clicking an individual order ID copies the full ID to the clipboard, displays a confirmation toast ("Bestell-ID in Zwischenablage kopiert."), and opens the tooltip.

<!-- END:ui-feedback-conventions -->

<!-- BEGIN:guest-ordering-ux-conventions -->

# Guest Ordering UX Conventions

1. **Clean Initial State:**
   - Public guest ordering pages (`pickup`, `table`) must have no bottom navigation tabs when the cart is empty.
2. **Floating Bottom Cart Banner:**
   - A floating cart banner appears fixed at the bottom only when `itemCount > 0`. It displays the count badge, "Zum Warenkorb", total price, and arrow. It must automatically hide when the cart is emptied.
3. **Focused Cart View:**
   - When viewing the cart, the merchant hero banner is suppressed. The view features a top header with an `<ArrowLeft>` back button returning to the menu, the cart title, restaurant subtitle, and order type tag.
4. **Tactile Wavy Divider & Sleek Quantity Controls:**
   - A prominent black wavy divider (`<WaveLine className="w-full mt-4 text-black" strokeWidth={2.25} />`) in zakkig's signature physical QR aesthetic separates the top restaurant profile and address from the sticky categories carousel.
   - Cart item quantity controls use a slim stepper pill (`h-7`, `p-0.5`, `size-6` actions, `min-w-[18px]` digit, ~72px width) preventing layout crowding next to item titles and totals while maintaining identical geometry across all viewports and pointer types.
5. **Post-Checkout Brand Attribution & Zero-Logo Link Policy:**
   - The zakkig logo across the webapp (dashboard, staff shell, and auth pages) is non-clickable static branding.
   - Post-checkout guest views (dine-in order success and takeaway order tracker) feature a subtle, centered attribution notice at the bottom: "Bestellung abgewickelt über zakkig.com als QR-Bestell- und Bezahlsystem" (or English equivalent), where `zakkig.com` is an underlined external link.
6. **Mobile Viewport Breathing Room & Rounded Frame Clearance:**
   - On mobile viewports, guest headers use top padding with safe-area clearance (`pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-6`) to prevent banner content and controls from crowding or clipping against rounded hardware corners and notches.
   - Sticky cart headers include top safe-area clearance (`pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-0`).
   - Bottom bars (floating cart banner, cart footer, and order success/tracker footers) include balanced bottom safe-area insets (`pb-[max(1.5rem,env(safe-area-inset-bottom))]` or `pb-[max(1.75rem,env(safe-area-inset-bottom))]`).

<!-- END:guest-ordering-ux-conventions -->

<!-- BEGIN:dialog-conventions -->

# Dialog, Modal & Action Sheet Architecture

All dialogs, modals, and settings sheets across `webapp` and `website` strictly follow a unified Apple-inspired architecture:

1. **Edge-to-Edge Dividers Rule (Komplett durchgezogene Trennlinien):**
   - Header and footer dividers must run continuously from the left outer edge to the right outer edge of the dialog frame. Put the border on the full-width header/footer wrapper, outside its content padding; never inset or float it.
   - Use light semantic surfaces (`bg-background text-foreground`) and a subtle semantic border. The frame is 20px on mobile, 24px on desktop, and uses an explicit dialog shadow. Ordinary theme shadow utilities are transparent.

2. **Standardized Header & Typography:**
   - Use a dedicated full-width header with `px-5 sm:px-6 py-4 sm:py-5`, a bottom divider, and left-aligned text.
   - Use a `text-xl font-bold tracking-tight leading-tight` title in `text-foreground` and a small readable description in `text-muted-foreground`.
   - When a close button ('X') is present in the header, it must strictly align vertically on the exact center datum line with the dialog title (`flex items-center justify-between`).

3. **Standardized Footer & Action Buttons:**
   - Use a dedicated full-width footer with `px-5 sm:px-6 py-3.5 sm:py-4`, a top divider, stacked actions on mobile, and aligned actions on wider screens.
   - Cancellation is an outline action; commitment is the primary action or destructive for deletion. Use shared 44px Button roles and responsive width rather than duplicating local color and focus recipes.

4. **Modal Language Switcher Standard:**
   - Clicking any language switcher (guest menus, order tracker, dashboard sidebar) must NEVER perform an abrupt toggle. It must always open a modal dialog adhering to this exact architecture (header, edge-to-edge dividers, language options with checkmarks, responsive footer buttons).

<!-- END:dialog-conventions -->

<!-- BEGIN:stripe-conventions -->

# Stripe Integration Conventions (Checkout Sessions API + Payment Element)

- **Default API Choice**: Prefer the **Checkout Sessions API** with the **Payment Element** (`ui_mode: "elements"`) over raw Payment Intents for payment integrations.
- **Why**: Checkout Sessions covers the same use cases with significantly less code, supports modern Stripe features (such as Adaptive Pricing, automatic tax, and dynamic payment methods), and simplifies confirmation.
- **React Frontend**:
  - Import providers and hooks from `@stripe/react-stripe-js/checkout`.
  - Initialize using `<CheckoutElementsProvider>` with `stripe` and `options={{ clientSecret }}`.
  - Mount `<PaymentElement />` and confirm payment using `checkout.confirm()`.
- **Backend / Convex**:
  - Create session via `stripe.checkout.sessions.create({ ui_mode: "elements", mode: "payment", ... })`.
  - Return `session.client_secret` to initialize `CheckoutElementsProvider`.

<!-- END:stripe-conventions -->

<!-- BEGIN:design-theme-conventions -->

# UI Theme, Light Surfaces & Numerical Typography

1. **Light Surface, Signature WaveLine Dividers & Contrast Rule:**
   - The entire webapp and marketing website feature 100% clean light backgrounds (`bg-background text-foreground`). Dark/black backgrounds are NEVER used for full sections or sidebars.
   - The desktop dashboard sidebar and staff terminal sidebar render with light surfaces (`bg-background text-foreground`), a 288px width (`w-72`) ensuring navigation items like 'Aktuelle Bestellungen' are fully written out, black logos (`brightness-0`), and a clean standard vertical border divider (`border-r border-border`) matching the horizontal dividing lines used in the header and footer.
   - On the marketing website, all sections and footers render with light backgrounds, cleanly delineated by Zakkig's signature horizontal `WaveLine` dividers (`text-black`) as a core visual trademark separating every major section (Ablauf to Benefit, Benefit to Setup, Setup to Pricing, Pricing to FAQ, and FAQ to Footer) with zero thin gray borders, with the footer divider serving as the sole divider above the footer.
   - Dark `#000000` is strictly reserved for deliberate focal accents: primary CTA buttons (`bg-primary text-primary-foreground`), active navigation pills, and selected badges.

2. **Numerical Typography Rule (Strictly Digits Only in Inter):**
   - Poppins is the primary font for everything across `webapp` and `website`: all titles, headings, body text, buttons, labels, and badges.
   - Strictly and exclusively numeric digits (`0-9`) and decimal separators (`.` or `,`) render in **Inter** (`font-inter`, `tabular-nums`) for maximum legibility.
   - Currency symbols (e.g. `€`), price prefixes (e.g. `ab`, `+`), units, and words MUST remain in **Poppins**.
   - Use the `<Price cents={...} from={...} prefix={...} />` component for all price displays in the UI rather than wrapping raw formatted strings in `font-inter`.
   - Never apply `font-inter` to parent containers or badges that contain text.

3. **Apple Design & Fluid Motion:**
   - Instant feedback on pointerdown (`active:scale-[0.98]` or `active:scale-[0.97]`).
   - Smooth corner radii hierarchy (`rounded-[20px]`, `rounded-[24px]`, `rounded-full`).
   - Target testable WCAG AA contrast: at least 4.5:1 for ordinary text, 3:1 for qualifying large text and necessary non-text control boundaries, with visible keyboard focus. Verify actual screens before claiming conformance.

4. **Control Geometry Standard:**
   - Action buttons, select and dropdown triggers, and navigation actions use the shared pill treatment: `h-11 rounded-full font-semibold` (44px at the 4px spacing scale), or compact `h-9` (36px) where density requires it. Compact interactive targets expand to at least 44px on coarse pointers. Guest payment actions use `h-12` (48px).
   - Text inputs and textareas are fields, not pills: use a 12px radius, distinct `border-input`, and 44px minimum height for ordinary inputs. Content cards use a 20px radius.
   - Button roles are primary black, outline white with an input border, ghost, and destructive red. `secondary` is a compatibility alias for outline, not a separate gray-filled action.

5. **Concentric Corner Radius & Nested Geometry Standard:**
   - Whenever an inner element sits inside an outer container with uniform padding $P$, the outer radius $R_{\text{outer}}$ and inner radius $R_{\text{inner}}$ MUST strictly follow the concentric border radius formula:
     $$R_{\text{outer}} = R_{\text{inner}} + P \quad \Longleftrightarrow \quad R_{\text{inner}} = \max(0, R_{\text{outer}} - P)$$
   - Shared radius tokens are explicit: `rounded-lg` is 12px, `rounded-xl` is 20px, and `rounded-2xl` is 24px. Use the named popup geometry below instead of guessing from a token name.
   - For all Dropdown and Select menus:
     - Outer container card: `rounded-[20px] p-2` (20px radius, 8px inset at the shared `--spacing: 0.25rem` scale).
     - Inner selectable items: `rounded-[12px]` ($20\text{px} - 8\text{px} = 12\text{px}$), `px-3.5`, and `py-2` or `py-2.5` according to the control, with `font-semibold`.
     - This guarantees mathematically exact concentric curvature with uniform visual margins around all corners.

6. **Restrained Uppercase & Natural Title Typography Standard:**
   - All-caps / uppercase typography is strictly and exclusively restricted to two deliberate architectural contexts:
     1. **Navigation & Legal Links on the Website:** Navigation links in the site header and footer (`website/components/Header.tsx`, `website/components/SiteFooter.tsx`, `website/components/LegalPage.tsx`) use uppercase with tracking (`uppercase tracking-[0.08em]`) to create crisp, architectural visual anchoring for navigation wayfinding.
     2. **Physical QR Code Signage on the Webapp:** Printed table standees, counter stickers, and physical display cards generated on the QR canvas (`overview-content.tsx`) use high-impact uppercase lettering (`SCANNEN & BESTELLEN`, `ABHOLEN`) to maximize distance legibility, immediate physical affordance, and contrast in bustling hospitality environments.
   - All other UI surfaces across the webapp (section block titles, card categorization headers, queue column headers, metadata headers, table headers, form legends, badges, action sheets, and modal dialogs) strictly use standard sentence or title casing in `text-sm font-bold text-foreground` (or `text-destructive` for danger zones). Uppercase typography must NEVER be applied to internal webapp data, controls, or content headings.

7. **Tailwind-First Styling Standard (Zero Custom CSS Bloat):**
   - In `webapp` and `website`, implement styling directly in JSX/TSX with Tailwind utility classes whenever Tailwind can express it cleanly. This includes layout, spacing, typography, responsive and container behavior, state variants, transitions, and hover/focus/active states. Use arbitrary values and variants when a project-specific value or selector needs them.
   - Do not add redundant rules to `globals.css`, CSS modules, or inline `style` props for static presentation that Tailwind can express without difficulty (e.g. `gap-*`, `flex`, `grid`, `text-*`, `leading-*`, `items-*`, `justify-*`, `p-*`, `m-*`). Existing CSS is not a precedent for adding more of the same.
   - Keep custom CSS for genuine needs that utilities cannot express cleanly: shared tokens and fonts, global resets, keyframes, and runtime or third-party styling constraints. Keep `globals.css` limited to those needs and base layout resets that cannot be expressed with Tailwind.

8. **Vertical Alignment Datum Line Standard:**
   - On desktop viewports, all dashboard and terminal view headers (`sticky top-0 z-30 h-16`) share the exact 64px height and vertical center datum line ($y = 31.5\text{px}$) with the `zakkig` logo in the left sidebar (`h-16 flex items-center px-4`, logo height 24px centered at $y = 31.5\text{px}$). All main dashboard `h1` titles render with `text-2xl font-bold tracking-tight text-foreground leading-none`, aligning the baseline and center of the page title precisely with the sidebar wordmark across all viewports.
   - On the live order board (`current-orders-content.tsx`), both queue column headers ('In Bearbeitung' and 'Abholbereit') and the selected order detail card header share an exact 60px height (`h-[60px]`), ensuring the horizontal divider lines separating the headers from the lists align on the identical horizontal datum line across all three columns as a unified visual unit.

9. **Staff Session & Operational Quick Links Standard:**
   - The staff terminal session tile on the dashboard overview renders as a dedicated operational card with a contextual info tooltip and instant pill actions (`Scannen` as prominent full-width action, with `Link kopieren` and `Neu generieren` side-by-side below). The primary navigation quick links (`Menü`, `Aktuelle Bestellungen`, `Alle Bestellungen`, `Einstellungen`) render in a balanced 2x2 responsive grid beside the staff session card on desktop viewports (`@min-[1100px]:grid-cols-2`), using subtle contextual InfoTooltips to eliminate visual clutter and text noise from everyday operations.

10. **Resource Creation Cards, Reorder Controls & Standardized Overlay Actions Standard:**
   - Every resource addition pattern across the webapp (categories, menu items, table QR codes) uses the dashed addition card (`border border-dashed border-muted-foreground/40`) appended at the end of the collection. Redundant creation buttons in navigation headers are omitted to keep top bars calm and clean.
   - Inside category cards on the menu page, menu items are reordered using direct up and down arrow buttons (`ArrowUp`, `ArrowDown`) matching category header buttons, rather than dropdown menus.
   - Media overlay actions (banner, logo, and product photo change and delete buttons) render as standardized `size-10 pointer-coarse:size-11` circular buttons with centered `size-4.5` icons.

<!-- END:design-theme-conventions -->

<!-- BEGIN:git-commit-conventions -->

# Git Commit Conventions

All commit messages in this repository strictly follow the developer's personal commit style:

1. **Strictly 100% Lowercase:**
   - No capital letters anywhere, including the very first word (`changed`, `fixed`, `updated`, etc.).

2. **Past-Tense Action Verbs:**
   - Always formulate changes in past tense: `changed`, `fixed`, `updated`, `removed`, `added`, `overhauled`, `isolated`, `switched`, `limited`, `forced`, `adjusted`.

3. **Compound Structure Connected by "and":**
   - Combine multiple related adjustments into a single cohesive running sentence using `and` (e.g. `changed ... and fixed ... and updated ...`).

4. **Explicit Target & Scope Specification:**
   - Always name the target surface or component: `on webapp`, `on website`, `on website and webapp`, `on customization modal`, `on live orders`, `on article edit dialog`, `on checkout`.

5. **Zero Terminal Punctuation:**
   - Do NOT end the commit message with a period (`.`) or exclamation mark.

6. **Zero Emojis & No Conventional Commit Prefixes:**
   - Never use emojis anywhere in commit messages.
   - Do not use conventional commit prefixes (no `feat:`, `fix:`, `chore:`, `refactor:`).

7. **Pragmatic & Descriptive Human Tone:**
   - Keep the wording concise, technical, and grounded in concrete code/UI adjustments without AI buzzwords.

<!-- END:git-commit-conventions -->

<!-- BEGIN:corporate-stack-rules -->

# Corporate Tech Stack & Infrastructure

The official technology stack, infrastructure providers, and operational architecture for zakkig:

1. **Cloudflare:**
   - **Domain Registrar & DNS:** Authoritative DNS and registrar for all apex and sub-domains (`zakkig.com`, `app.zakkig.com`).
   - **Cloudflare Pages:** Hosting and edge delivery for the marketing website (`website`).
   - **Cloudflare Workers:** Serverless edge runtime and execution environment for the web application (`webapp`).

2. **Microsoft 365:**
   - **Enterprise Email & Identity:** Primary business email domain with Microsoft 365 Business Basic (`selim@zakkig.com`).
   - **SMTP & Transactional Messaging:** Authoritative email infrastructure for notifications, auth verification, and team communication (`smtp.office365.com` via port 587 STARTTLS).

3. **Convex:**
   - **Unified Reactive Backend:** Complete transactional database, real-time sync, background mutation handlers, and scheduled crons.
   - **Media & File Storage:** Convex Storage for all restaurant logos, hero banners, and menu item photos.

4. **GitHub:**
   - **Version Control & Repository Hosting:** Monorepo hosting, automated workflows, and continuous deployment triggers.

5. **AI Development Architecture:**
   - Google AI & ChatGPT for advanced agentic coding, pair programming, and architectural reasoning.

6. **Internationalization & Endonym Convention:**
   - Countries and regions must ALWAYS be displayed in their primary native language (endonym) across all UI surfaces and dialogs (e.g. Germany is strictly `"Deutschland"`, never translated to "Germany" even when the active UI language is English).

<!-- END:corporate-stack-rules -->
