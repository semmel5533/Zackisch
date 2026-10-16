# Zackisch design system

## 1. Design intent

**Familiar hospitality, digital convenience without operational upheaval.** The system must feel capable and dependable but never like a dense enterprise POS. Visual simplicity means a small number of meaningful components, legible information hierarchy and understandable status—not empty whitespace at the expense of functionality. Four distinct contexts share accessibility, tokens, typography and interaction principles:

- `root`: human, editorial, photographic, friendly and credible owner acquisition; show kitchens, cafes and real people in actual workflows rather than technology effects.
- `app` owner: pragmatic, predictable, task-guided setup and management, especially on ordinary laptops and tablets.
- `app` guest: restaurant-first, appetizing photographs, readable menu, no-account checkout, unmistakable payable total and order status.
- `app` staff: fast at a glance, robust on older tablets, large controls, high-contrast order statuses, clear escalation when offline.
- `support`: reader-first editorial layout, search and sequential tutorials with screenshots and deep links.
- `internal`: professional, compact but readable Team Dashboard; information density is appropriate, not identical to the marketing page.

Reference inspirations: PayPal's clear transactional communication; me&u's venue-oriented ordering and physical table signage; sunday's simple optional guest action; German competitors for buyer objections. **Do not copy trade dress, visual identity or proprietary assets**. No invented reviews/photography of fictitious Zackisch customers. Prefer real licensed shoots with venue/model consent; maintain asset attribution and rights internally.

## 2. Identity and color decisions

Preserve original Zackisch wordmark and symbol (`brand_mark`, `combination_mark`) and **Poppins** typography. The design system is built upon a **strictly monochrome** canvas: pure white (`#FFFFFF`), pure black (`#0A0A0A` / `#161616`), and nuanced neutral grays (`#F7F7F7` to `#252525`). Sparing functional status colors provide feedback for payment confirmations, alert states, and operational queues without distracting from venue content.

| Token | Semantic Role | Value | Notes |
| --- | --- | --- | --- |
| `--zds-color-neutral-0` | Paper / Surface | `#FFFFFF` | Primary cards, forms, QR quiet zone |
| `--zds-color-neutral-25` | Subtle Surface | `#FCFCFC` | Elevated card surfaces |
| `--zds-color-neutral-50` | Muted Background | `#F7F7F7` | Public sections, support body background |
| `--zds-color-neutral-100` | Border Subtle | `#F2F2F2` | Dividers, badge backgrounds |
| `--zds-color-neutral-150` | Input Border | `#EAEAEA` | Form control outlines |
| `--zds-color-neutral-200` | Border Strong | `#E0E0E0` | Standard component border |
| `--zds-color-neutral-400` | Placeholder / Disabled | `#959595` | Muted hints, secondary icons |
| `--zds-color-neutral-600` | Secondary Text | `#525252` | Body copy, subtitles (contrast >= 4.5:1) |
| `--zds-color-neutral-900` | Primary Text | `#161616` | Key headings, primary action background |
| `--zds-color-neutral-950` | Brand Ink | `#0A0A0A` | Display headings, logo-adjacent brand text |
| `--zds-color-status-success` | Success Action | `#12744B` | Verified payment, completed step |
| `--zds-color-status-warning` | Warning Action | `#8B5D08` | Requires review, non-blocking attention |
| `--zds-color-status-danger` | Destructive Action | `#B42318` | Validation errors, refund action |
| `--zds-color-status-info` | Information | `#225CB0` | Non-fiscal callouts, guidance notes |

**Color policy:** A single central monochrome token architecture exported from `packages/design-system/src/styles/tokens.css`. Functional status colors are used strictly with semantic icons and clear labels, never through color alone. Real photography from `root/public/media/` provides authentic hospitality atmosphere. Real venue branding and culinary dish photography dominate on guest surfaces.

## 3. Typography

**Poppins must remain part of Zackisch's permanent visual identity** because it underpins the existing logotype. Preserve approved `brand_mark` and `combination_mark` exactly—do not rebuild letters in text, stretch the icon, swap logo fonts or alter clear-space proportions. Use Poppins for logo-adjacent brand signatures, marketing/display headings and selected prominent app headings. Use **Inter selectively for dense UI body, tables and tabular amounts** if it improves working readability, but ensure consistent optical weight, line height and spacing with Poppins. A Poppins-only UI is also permitted after readability/performance validation; **eliminating Poppins or changing the mark is not an option**. Avoid per-digit font switching inside numbers. Introduce typography tokens (`font-brand`, `font-ui`, `font-numeric`) and test both families against actual German, English and print examples. Brand-aware color changes must respect the verified logo in mono/light/dark/real photography environments. Body text should normally be at least 16 CSS pixels on reading surfaces; 14px only for short, genuinely secondary UI labels with valid contrast. Avoid all-uppercase navigation by default and all-caps paragraphs. Use German sentence case; reserve striking capitals for short physical QR signage only if user tests support it.

Suggested responsive hierarchy (adjust in implementation, preserve scale and WCAG):

| Role | Desktop | Small viewport | Leading | Notes |
| --- | --- | --- | --- | --- |
| Marketing H1 | clamp(2.6rem, 5vw, 4.75rem) | 2.4rem min | 1.06–1.15 | Short, approximately 2 lines where possible |
| Marketing H2 | clamp(2rem, 3.5vw, 3.25rem) | 2rem | 1.15–1.2 | Explanatory not abstract |
| App page H1 | 1.5–1.75rem | 1.375rem | 1.25 | Stable page identity |
| Article H1 | 2.25rem | 1.9rem | 1.2 | Reader-first |
| Body/description | 1rem–1.125rem | 1rem | 1.5–1.65 | Paragraph width 60–75 characters |
| Operational UI | 0.875–1rem | >=0.875rem | 1.35–1.5 | Prioritize fast scan |
| Amounts/order IDs | 1.125–2rem | Responsive | 1.2 | `font-variant-numeric: tabular-nums` |

Loading: prefer locally optimized font assets and `font-display: swap`, avoid unnecessary multiple weights/fonts, measure CLS and contrast. Never deliver license-restricted font files publicly unless licensing explicitly permits it.

### Logo-integrity acceptance tests

Verify true existing SVG/PNG assets as the source, light/dark/monochrome versions, accessible contrast in every background, consistent icon-to-wordmark proportion, sharp output from 1x through retina and A4 print, safe clearance around QR quiet zones, and documented licensed asset provenance. No AI-generated reconstruction of the Zackisch logo. New hospitality palette is a proposal only until demonstrated to harmonize with the source brand symbol and actual website/product screens.

## 4. Grid, spacing and shape

- Spacing base: 4px scale; consistent 8, 12, 16, 24, 32, 48, 64px increments. Never cram touch targets to fit a card.
- Page content: marketing up to 1200–1280px with deliberate visual pacing; support article text 720–800px max; dashboard content adapts to **container** width excluding sidebar.
- Input: 44–48px minimum comfortable target height, visible permanent label, clear affordance and focus.
- Buttons: primary/secondary/tertiary/quiet/destructive; choose one prominent action per task, not one per card indiscriminately. Pill shape may be used in marketing but operational control grouping requires visible alignment.
- Cards: roughly 12–20px corners; dialogues 16–24px. Avoid nested cards on cards, strong outlines around every element and mystery click targets.
- Shadows: almost none for routine content. Use a restrained elevation cue for menus, popovers, dialogs and physical product mockups.
- No excessive fixed header covering focused fields; CSS `scroll-margin-top` and focus-aware scrolling.

## 5. Component catalogue and states

Implement accessible wrappers around Base UI where supported: `Button`, `LinkButton`, `TextField`, `TextArea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `Combobox`, `Tabs`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `Toast`, `Alert`, `StatusBadge`, `ProgressList`, `EmptyState`, `Skeleton`, `DataTable`, `Pagination`, `Stepper`, `FileUpload`, `QRCodePrintPreview`, `RestaurantMenuItem`, `OrderCard`, `TicketThread`. Do not build abstract wrappers around components that are only used once without a concrete reason. Maintain consistent `aria-*`, Escape, focus trapping/return, keyboard activation and tap interaction.

Each component has specified: anatomy, usage, variants, touch targets, loading/disabled/invalid/focus/hover/pressed states, keyboard interactions, localized copy and visual regressions. Provide a runnable story/demo page or isolated test fixture when cost-effective. Use design tokens in Tailwind utilities rather than hardcoded HEX repeated across apps. Do not force every app to use visually identical components when the task requires a special layout; shared semantics are mandatory, uniform density is not.

### Verified package implementation (`@zackisch/design-system`)

The design system is implemented in `packages/design-system/` and linked across `app`, `root`, `support`, and `internal`:
- **Tokens:** Semantic monochrome color scale (`neutral.n0`–`neutral.n950`), functional status tokens, touch targets, spacing, radius, and typography tokens exported via CSS variables and typed constants.
- **Component Primitives (24):** Accessible Base UI-backed primitives:
  - Form Controls: `Button`, `IconButton`, `Input`, `Textarea`, `Field`, `Select`, `Checkbox`, `Radio`, `Switch`
  - Feedback & Display: `Badge`, `StatusBadge`, `Card`, `Dialog`, `Drawer`, `Tabs`, `Accordion`, `Popover`, `Breadcrumbs`, `Pagination`, `LoadingIndicator`, `DataTable`, `EmptyState`, `PhotoFigure`, `Stepper`
- **Layout Templates (9):**
  - Public & Editorial: `PageContainer`, `PublicSection`, `EditorialHero`, `ReadingLayout`
  - Applications & Ops: `AuthLayout`, `WorkspaceLayout`, `OpsLayout`, `ShopLayout`, `SystemLayout`
- **Domain Patterns (4):**
  - `Price`: German/European currency formatting with tabular numerals
  - `QrSignageCard`: Physical QR table and counter display with verified quiet zone
  - `PaymentVerification`: Non-fiscal digital payment verification banner
  - `PosReconciliationSummary`: Daily register reconciliation summary for cash registers
- **Brand & Media Assets:** Canonical SVG/PNG assets and verified licensed photography hosted on `https://zackisch.com/*` (`root/public/media/`) and registered in `root/public/media/register.csv`.
- **Site Metadata:** `createSiteMetadata` utility ensuring consistent canonical links, OpenGraph properties, Twitter cards, and multi-lingual hreflang annotations.

## 6. Website IA and editorial compositions

1. **Hero:** Real owner/team or welcoming venue photograph with adequate text contrast; H1 `Deine Kasse bleibt. Deine Gäste bestellen selbst.`; two sentences max about optional QR orders, existing tablet and no monthly fee; primary `Kostenlos registrieren`, secondary `Voraussetzungen prüfen`; a small explicit `2 % ... zzgl. Zahlungsanbietergebühren` line.
2. **How it complements service:** side-by-side existing POS and Zackisch staff-tablet workflow. Use true screenshot with explainers; never imply direct POS sync.
3. **DIY in simple stages:** register; connect payments and menu; pair tablet; print/scan QR; supervised test; open. Each step links to current help.
4. **Use your own devices:** clear compatibility list and printer examples, with unsupported cases and fallback.
5. **Price:** 0€ setup, 0€ Zackisch monthly base, 2% per eligible processed order plus Stripe/provider fees. A realistic fee example only if verified; footnote refunds/taxes.
6. **Voluntary guest ordering:** guests may still order traditionally; staff workload and guest choice, no false claims about adoption rates.
7. **Security and continuity:** modest factual statements after audit: `Zugriffe sind rollen- und betriebsbezogen geschützt. Bei einer Störung bleibt deine bisherige Kasse nutzbar.` Not high-availability SLA unless contracted and measured.
8. **FAQ:** core merchant objections; detailed tutorials live on support. Footer region/language, legal, privacy, accessibility where required and verified external links.

Use editorial pace: alternating narrow explanatory copy, useful photos, real UI/product screenshot and whitespace. Avoid massive feature grids, fake KPI counters, generic gradient spheres, animation walls and enterprise acronyms.

## 7. Guest UI specification

Guest journey: scan or open fallback URL -> venue identity/table or pickup context -> category and item selection -> clear option/price impacts -> cart review with taxes/fees and total -> payment method -> unmistakable payment commitment -> Stripe payment -> verified result and order tracker. Keep the venue recognizable; surface allergies/dietary info where legally and operationally appropriate and ensure the business can maintain it accurately. Item pictures must be genuine and not obscure prices. Show unavailable items plainly and prevent stale cart checkout with server revalidation. No mandatory account, no dark-pattern tip selection. Clear recovery from payment failure and loss of connectivity; never send duplicate order from repeated clicks.

## 8. Merchant and wizard UI specification

Owner home prioritizes `Ready to accept orders?` and a **persistent checklist** rather than sales-oriented dashboard charts. Show `Required`, `Recommended`, `Complete`, `Blocked`, `Needs attention`; reason and direct action for each item. Status computed server-side. Offer contextual help, explicit return to dashboard, ability to switch between setup and regular work, and straightforward way to pause QR ordering. Avoid mandatory onboarding tours and punitive progress gamification. The owner understands why a step matters and how to verify it.

## 9. Staff and internal operations

Staff order queue visible at actual working distance: large ticket number/table, item list, order time/status, payment verification and clear one-step transitions; prevent accidental premature completion through affordance and reversible behavior as appropriate. No hidden essential action behind hover; touch targets >=44px for primary work, typography readable at a distance. On connection loss show prominent last-sync status and no false live indicator.

Team Dashboard offers dense, consistent grids, strong keyboard/focus, reliable region and permission context, query filters that persist through ticket detail navigation and overt difference between `Antwort an Betrieb` and `Interne Notiz`. Keep escalation and assignment comprehensible; no visual redesign that breaks current newsletter/partner flows.

## 10. Support and physical QR

Support landing centers the search box and popular owner questions. Every tutorial uses a consistent sidebar/TOC, prerequisites, numbered steps, current screenshots with text alternatives and next links. Ticket UI shows business and response visibility.

Physical QR template is a **product touchpoint** not a marketing poster. Short actionable headline, a large high-contrast actual QR, recognizable table identifier, venue name and visible fallback address. Unnecessary decorative marks must not touch the QR quiet zone. See `qr-and-print.md` for dimensions, reproducible printing and device scan tests.

## 11. Design review acceptance

- Measured contrast for all tokens/variants including image overlays and forms; WCAG 2.2 AA passes in automated and manual review.
- Test mobile 320/360/390, tablets 768/1024, desktop 1440, 200–400% zoom/reflow, motion reduction, dark/OS settings if supported.
- Keyboard-only traversal of registration, wizard, checkout, article search/tickets and internal response; screen-reader sanity tests with NVDA or VoiceOver.
- Usability tasks completed with representative real users when available, observations recorded and prioritized; do not fabricate usability research outcomes.
- Actual scans and print tests with A4 home printer and external printing variant; no ornamental demo QR in production.
- Copy reviewed for owner understanding of POS, fees, DIY and failure fallback; release screenshots match implemented UI.

Primary accessibility source: https://www.w3.org/TR/WCAG22/ . Related principles: https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.nngroup.com/articles/recognition-and-recall/ .
