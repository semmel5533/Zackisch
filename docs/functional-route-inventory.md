# Functional route and screen inventory

This document lists the required functional routes and capabilities across the four Zackisch applications. Visual layout, color tokens, and component styling are governed by the owner-approved design direction (`design-system/README.md`).

## 1. `root/` (`zackisch.com`)

| Route | Locale Support | Primary Purpose | Required Functional Capabilities |
| --- | --- | --- | --- |
| `/[locale]` (`/de-de`, `/de-en`) | `de-de`, `de-en` | Public merchant information and self-registration entry | Explains POS retention, 2% fee + Stripe fees (excluding tips), compatible existing devices, DIY setup steps, Smart Menu capabilities, FAQ accordion, newsletter double-opt-in form, links to registration (`app.zackisch.com/sign-up`) and help center (`support.zackisch.com`) |
| `/[locale]/legal` | `de-de`, `de-en` | Imprint (`Impressum` / DDG § 5) | Operator identity, address, contact, registration/VAT details |
| `/[locale]/privacy` | `de-de`, `de-en` | Privacy notice (`Datenschutzerklärung`) | Controller/processor roles, Stripe Connect, Convex, Cloudflare, TDDDG § 25 storage transparency |
| `/[locale]/gtc` | `de-de`, `de-en` | B2B Terms (`AGB`) | Merchant contract scope, 2% fee rules, merchant-of-record obligations, POS fiscal responsibility |

## 2. `app/` (`app.zackisch.com`)

| Route | Actor | Primary Purpose | Required Functional Capabilities |
| --- | --- | --- | --- |
| `/sign-in`, `/sign-up`, `/forgot-password` | Merchant owner | Authentication & registration | Email/password + OTP verification, business creation, password recovery |
| `/dashboard/[businessId]/overview` | Merchant owner | Setup readiness, POS reconciliation & live status | Persistent 6-step setup checklist derived from server facts, Stripe onboarding status, POS reconciliation summary (`Offen` vs `In Kasse erfasst`), pause/resume ordering |
| `/dashboard/[businessId]/menu` | Merchant owner | Menu, categories, items, customizations & dietary labels | Category CRUD & sort, item CRUD & sort, image upload/delete, customization groups, allergens/additives/dietary badges |
| `/dashboard/[businessId]/current-orders`, `/live-orders` | Merchant owner | Active order monitoring & POS recording | View `in_progress` and `ready_for_pickup` orders, update status, record in POS (`recordOrderInPos`) |
| `/dashboard/[businessId]/all-orders`, `/archive` | Merchant owner | Order history, refunds & CSV export | Filter orders, partial/full Stripe Connect refunds with proportional fee refund, accounting CSV export |
| `/dashboard/[businessId]/qr-codes` | Merchant owner | Table & pickup QR code generation and print | Manage table numbers, preview and print A6/table and pickup QR cards with scannable quiet zones |
| `/dashboard/[businessId]/settings` | Merchant owner | Business profile, Stripe Connect, Smart Menu & tip toggles | Legal/tax details, Stripe embedded onboarding & dashboard link, 3 independent switches (`smartRecommendationsEnabled`, `popularCategoryEnabled`, `tipsEnabled`), tablet session management |
| `/table/[businessId]/[tableNumber]`, `/pickup/[businessId]` | Guest (no login) | Mobile QR menu, Smart Menu recommendations & Stripe checkout | Virtual `Beliebteste` category (when enabled), category tabs, item detail/customization sheet, post-add complement recommendation, cart sheet with pre-checkout add-ons, voluntary tip selector (default 0, hidden when disabled), § 312j BGB `Zahlungspflichtig bestellen`, non-fiscal confirmation & live order tracker |
| `/staff/[businessId]` | Paired staff tablet | Kitchen/service order queue & availability | Token-authenticated live order queue (`Neu`, `Bereit`, `Erledigt`), single-tap status updates, POS recording confirmation, item availability quick-toggle |
| `/availability/[businessId]` | Paired terminal | Item availability management | Fast stock/availability toggling for kitchen/counter staff |

## 3. `support/` (`support.zackisch.com`)

| Route | Actor | Primary Purpose | Required Functional Capabilities |
| --- | --- | --- | --- |
| `/[locale]` (`/de-de`, `/de-en`) | Public / Merchant | SSR Help Center home & search | Client-side instant search (`SupportSearch`), 5 structured categories, 43 localized articles |
| `/[locale]/[category]`, `/[locale]/[category]/[slug]` | Public / Merchant | Category & article pages | Step-by-step instructions, prerequisites, verification result, Breadcrumb/Article JSON-LD |
| `/[locale]/tickets`, `/[locale]/tickets/new`, `/[locale]/tickets/[ticketId]` | Authenticated merchant | Private merchant support tickets | Requires verified `supportSessions` token (`noindex`), create ticket, view public replies (never internal notes) |

## 4. `internal/` (`internal.zackisch.com`)

| Route | Actor | Primary Purpose | Required Functional Capabilities |
| --- | --- | --- | --- |
| `/` and regional tabs | Regional Admin / Staff | Team Dashboard (`noindex`) | 2FA login (password + 6-digit email OTP), strict region-scoped views (`requireOpsActor` + `requireOpsRegion`), businesses, orders, support tickets (public reply vs internal note), partners, newsletter campaigns, email logs, audit logs, staff permissions |
