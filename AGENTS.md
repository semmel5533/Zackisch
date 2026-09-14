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
   - **Server Actions** are the authoritative boundary: validate input types, verify authorization, sanitize errors, and call Convex via `convexServer`.
   - **Convex Functions** enforce defense-in-depth: validate string lengths, bounds, and business invariants directly in mutation handlers.

2. **Tenant Isolation & Authorization (Anti-IDOR):**
   - Every Server Action that modifies or accesses organization data MUST call `await requireOwner(organizationId)`. Never trust client-supplied `organizationId` without checking `org.ownerId === user._id`.
   - Operations on terminal endpoints (kitchen display, 86-availability) must be authorized with `requireKitchenOrOwner` or `requireStaffOrOwner`.
   - Dashboard layouts must strictly verify ownership (`if (org.ownerId !== user._id && org.ownerId !== user.$id) redirect("/sign-in")`).

3. **Zero Data Leakage (Guest Boundary & DOM Hygiene):**
   - When passing data to public guest pages (`pickup`, `table`), NEVER expose sensitive merchant or platform accounting data (`stripeAccountId`, `taxId`, `ownerId`, `zakkigFee`, `stripeFee`, `netAmount`). Always sanitize or zero out before serializing into RSC payloads or query responses.

4. **Server-Side Price & Integrity Enforcement:**
   - NEVER trust client-supplied prices, item names, or order totals.
   - `createPaymentIntent` must query the database, check that each item exists, is available (`available !== false`), satisfies minimum price, and recalculates `calculatedTotal === args.total` to the exact cent.

5. **Convex Public API Surface Minimization:**
   - Functions not called directly by the browser MUST be declared as `internalMutation`, `internalQuery`, or `internalAction` (e.g. file deletion, database seeds, webhook order processing).
   - Sensitive user mutations (`createAccountDeletionToken`, `createEmailChangeToken`) must require and verify a valid server-issued `sessionToken`.
   - Never leave unauthenticated or debug queries (like `listAll`) open on Convex.

6. **Standardized Lifecycles & Timeouts (TTL):**
   - **Auth, OTPs & Security Links:** Strictly 30 minutes (`30 * 60 * 1000` ms).
   - **Brute-Force Lockout:** OTP codes must track failed attempts and permanently delete the code after 5 failures.
   - **Kitchen Board Lifecycle:** Explicit manual completion (orders start in progress, advance to ready for pickup, and transition to completed, removing them immediately from current orders).
   - **Guest Takeaway Tracker:** 10 minutes active countdown once ready for pickup.

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

<!-- END:ui-feedback-conventions -->

<!-- BEGIN:guest-ordering-ux-conventions -->

# Guest Ordering UX Conventions

1. **Clean Initial State:**
   - Public guest ordering pages (`pickup`, `table`) must have no bottom navigation tabs when the cart is empty.
2. **Floating Bottom Cart Banner:**
   - A floating cart banner appears fixed at the bottom only when `itemCount > 0`. It displays the count badge, "Zum Warenkorb", total price, and arrow. It must automatically hide when the cart is emptied.
3. **Focused Cart View:**
   - When viewing the cart, the merchant hero banner is suppressed. The view features a top header with an `<ArrowLeft>` back button returning to the menu, the cart title, restaurant subtitle, and order type tag.

<!-- END:guest-ordering-ux-conventions -->

<!-- BEGIN:dialog-conventions -->

# Dialog, Modal & Action Sheet Architecture

All dialogs, modals, and settings sheets across `webapp` and `website` strictly follow a unified Apple-inspired architecture:

1. **Edge-to-Edge Dividers Rule (Komplett durchgezogene Trennlinien):**
   - Horizontal dividing lines (`border-b border-zinc-100` under the dialog header and `border-t border-zinc-100` above the dialog footer) must ALWAYS run continuously from the left outer edge to the right outer edge of the dialog frame.
   - Dividers must NEVER be indented, floating, or cut off inside content padding (no `p-6` with inset borders). They must use `border-zinc-100` for a delicate, crisp, ultra-clean Apple finish matching the website modal.
   - The outer container uses `p-0 sm:p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col`.

2. **Standardized Header & Typography:**
   - Every dialog features a dedicated `DialogHeader` (`px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-col gap-1`).
   - Title: `DialogTitle` in `text-xl font-bold tracking-tight text-zinc-900 leading-tight`.
   - Description: `DialogDescription` in `text-xs text-zinc-500 font-normal leading-relaxed mt-0.5`.

3. **Standardized Footer & Action Buttons:**
   - Every dialog with actions features a dedicated `DialogFooter` (`px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full`).
   - Secondary / Abbrechen button: strictly `variant="outline"`, full-width responsive (`w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer`).
   - Primary / Action button: strictly `bg-black text-white hover:bg-zinc-800 font-semibold rounded-full h-11 w-full sm:flex-1 active:scale-[0.98] transition-all cursor-pointer` (or `variant="destructive"` for deletions).

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

1. **Light Surface & Dialog Rule:**
   - Dark/black backgrounds must NEVER be overused. The webapp must feel light, airy, and fresh.
   - All dialogs, modals, action sheets, confirmation alerts, and auth pages must render with a clean light background (`bg-background text-foreground` or `bg-card text-card-foreground`) and standard border (`border-border`).
   - Dark `#000000` is strictly reserved for deliberate focal accents: the desktop dashboard sidebar (`bg-sidebar`), primary CTA buttons (`bg-primary text-primary-foreground`), and selected badges.

2. **Numerical Typography Rule (Strictly Digits Only in Inter):**
   - Poppins is the primary font for everything across `webapp` and `website`: all titles, headings, body text, buttons, labels, and badges.
   - Strictly and exclusively numeric digits (`0-9`) and decimal separators (`.` or `,`) render in **Inter** (`font-inter`, `tabular-nums`) for maximum legibility.
   - Currency symbols (e.g. `€`), price prefixes (e.g. `ab`, `+`), units, and words MUST remain in **Poppins**.
   - Use the `<Price cents={...} from={...} prefix={...} />` component for all price displays in the UI rather than wrapping raw formatted strings in `font-inter`.
   - Never apply `font-inter` to parent containers or badges that contain text.

3. **Apple Design & Fluid Motion:**
   - Instant feedback on pointerdown (`active:scale-[0.98]` or `active:scale-[0.97]`).
   - Smooth corner radii hierarchy (`rounded-[20px]`, `rounded-[24px]`, `rounded-full`).
   - High contrast WCAG AA/AAA compliance.

4. **Pill Buttons & Select Controls Standard:**
   - All action buttons, select triggers (`SelectTrigger`), dropdown items, and search/filter bars across dashboard views strictly use unified Apple pill geometry (`h-11 rounded-full font-semibold`, compact `h-9 rounded-full font-semibold`).
   - Dropdown menus use `rounded-2xl` container cards with `rounded-xl` selectable items.

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

2. **Google Workspace:**
   - **Enterprise Email & Identity:** Primary business email domain with Google Workspace (`selim@zakkig.com`).
   - **SMTP & Transactional Messaging:** Authoritative email infrastructure for notifications, auth verification, and team communication.

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

