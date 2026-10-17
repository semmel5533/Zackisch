# Cursor Thermos Dual Review Report: Release Candidate Hardening

**Branch:** `rc-hardening-and-design-system`  
**Base:** `release-candidate-2026` (`2d8e386af94869fdc87b1157b3c6713e2041ddf6`)  
**Scope:** Security quarantine, shared design system, asset centralization, support SSR/SEO, skill cleanup, E2E browser testing.  
**Review Date:** 2026-10-16  

---

## 1. Executive Summary & Verdict

- **Overall Verdict:** **APPROVED FOR RELEASE CANDIDATE ACCEPTANCE**  
- **Dual Review Passes Executed:**
  1. **Thermo-Nuclear Review (Correctness & Security):** Zero high or critical regressions introduced. All 6 P0 security vulnerabilities identified in the audit goal have been decisively remediated on the backend boundary and verified with unit and E2E tests.
  2. **Thermo-Nuclear Code Quality Review (Maintainability & Architecture):** Major structural improvement achieved by introducing `@zackisch/design-system`, deduplicating 1.2+ MB of identical asset binaries across 3 apps, pruning 31 obsolete/dead agent skills (85k+ lines of legacy code removed), and decoupling React Server Components from worker test runners.

---

## 2. Pass 1: Thermo-Nuclear Security & Correctness Audit

### A. Authentication & Tenant Boundaries
- **P0-01 (Support Authorization):** `getCustomerTickets`, `getCustomerTicketThread`, and `addCustomerReply` now mandate a verified `sessionToken` checked against the `supportSessions` table. Unauthenticated or cross-tenant access fails closed with authorization errors.
- **P0-02 (Team Ticket Identity):** `requireTeamPermission` no longer accepts an unverified email from client state. It strictly requires a valid admin `sessionToken` and checks both role permissions (`tickets:view`, `tickets:note`) and regional constraints.
- **P0-03 (Financial Exposure):** `getSetupReadiness` and `getFeeStatements` enforce `requireBusinessOwner(ctx, args.businessId)`. Unauthorized callers cannot inspect merchant onboarding or financial billing records.
- **P0-04 (Ops Credential Storage):** Privileged operations bind directly to server-verified session tokens.
- **P0-05 (SSO Handoff):** The handoff flow exchanges single-use tokens atomically for a server-tracked `supportSession` record. Email query parameters have been removed from ticket URLs.
- **P0-06 (POS Reconciliation):** `recordOrderInPos` and `getPosReconciliationSummary` enforce business staff authorization.

### B. Payment & Stripe Connect Invariants
- Direct charges continue to run strictly against connected merchant accounts (`stripeAccount` parameter).
- Platform fee is fixed at exactly 2% (`application_fee_amount`).
- Webhook signature validation and idempotency safeguards remain intact.

### C. Developer Experience (DevEx) & Breaking Changes
- Root static export (`output: "export"`) build and preview commands verified with `serve` on port 3000.
- Standalone `vitest.config.ts` files created in `root`, `support`, and `internal` to prevent Cloudflare Vite plugins from interfering with Vitest RSC testing.
- Typechecking across all 5 packages (`design-system`, `app`, `root`, `support`, `internal`) passes with 0 TypeScript diagnostics.

---

## 3. Pass 2: Thermo-Nuclear Code Quality & Architecture Audit

### A. Shared Design System (`design-system`)
- **Package Architecture:** Created an independent npm package (`@zackisch/design-system`) using Base UI primitives, modern CSS variables, and Poppins font tokens.
- **Component Primitives:** Implemented 21 accessible components (Button, Input, Card, Modal, Table, Tabs, Badge, Toast, etc.).
- **Domain Components:** Built `Price` (with strict EUR formatting) and `QrSignageCard` (for merchant counter QR signage).
- **Metadata Helpers:** Provided `createSiteMetadata` ensuring canonical URL, OpenGraph, Twitter card, and hreflang consistency.

### B. Asset Centralization & Public Cleanup
- All Zackisch brand assets are now canonically hosted under `https://zackisch.com/*` (in `root/public/`).
- Removed 12 duplicate image/SVG binaries from `app/public/`, `support/public/`, and `internal/public/`, replaced with `.gitkeep` and `BRAND_ASSETS.*` constants.
- Reduced Git repository bloat and eliminated the risk of asset drift.

### C. Support SEO & Knowledge Base Architecture
- Migrated Knowledge Base pages (`/de-de`, `/de-en`, categories, articles) from client-side rendering to Next.js React Server Components with dynamic `generateMetadata` and `generateStaticParams`.
- Added structured Schema.org JSON-LD (`Article` and `BreadcrumbList`).
- Implemented `support/app/sitemap.ts` generating 98 localized URLs.
- Implemented `support/app/robots.ts` and route-level `noindex, nofollow` on private `/tickets` routes.
- Eliminated the unsubstantiated "15-minute setup" marketing claim in favor of transparent self-service onboarding copy.

### D. Skill Tree & Altlasten Cleanup
- Pruned 31 redundant skills (including Svelte, Nuxt, Astro, dead Impeccable live servers).
- Removed `.impeccable/design.json`.
- Retained 16 essential, actively verified skills (`convex`, `convex-auth`, `convex-authz`, `convex-backup`, `convex-deploy-guard`, `convex-launch-readiness`, `convex-reviewer`, `convex-test`, `react-doctor`, `stripe-best-practices`, `stripe-docs`, `security-audit`, `thermos`, `thermo-nuclear-review`, `thermo-nuclear-code-quality-review`, `e2e`).

---

## 4. Test Verification Summary

| Test Layer | Target / Suite | Count | Result |
| :--- | :--- | :--- | :--- |
| Security Unit Tests | `app/tests/security.test.ts` | 6 tests | **PASS** |
| Payment Unit Tests | `app/tests/payments-and-stripe.test.ts` | 31 tests | **PASS** |
| POS & Fee Tests | `app/tests/` (setup, fee, pos) | 16 tests | **PASS** |
| Root Legal & SSR Tests | `root/tests/` | 5 tests | **PASS** |
| Support Knowledge Base Tests | `support/tests/knowledge-base.test.ts` | 6 tests | **PASS** |
| Cloudflare Security Ledger | `validate-coverage-ledger.cjs` | 6 units | **PASS** |
| Cloudflare Security Findings | `validate-findings.cjs` | 6 findings | **PASS** |
| E2E Browser: Root Marketing | `tests/e2e/root-marketing.e2e.ts` (port 3000) | 1 test | **PASS** |
| E2E Browser: Support SEO | `tests/e2e/support-seo.e2e.ts` (port 3003) | 1 test | **PASS** |
| E2E Browser: Internal Admin | `tests/e2e/internal-admin.e2e.ts` (port 3002) | 1 test | **PASS** |
| E2E Browser: Webapp Auth | `tests/e2e/webapp-auth.e2e.ts` (port 3001) | 1 test | **PASS** |

---

## 5. Synthesis & Release Readiness

Both review streams conclude that the branch is robust, hardened against tenant elevation and data leakage, significantly cleaner in code organization, and ready for release candidate testing.
