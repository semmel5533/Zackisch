# Zackisch Enterprise Product & UX Rebuild — Verification Report (2026-10-17)

## 1. Executive Summary

The **Zackisch Enterprise Product & UX Rebuild** has been executed directly on `main` across all five packages (`design-system`, `root`, `app`, `support`, `internal`). Every structural, visual, functional, security, and legal-compliance requirement from the handoff specification has been verified against live reference research and automated test suites.

---

## 2. Live Web Research & Product Synthesis (`RESEARCH-DECISION-REGISTER.csv`)

All major product and interaction decisions were grounded in live primary-source inspection conducted on `2026-10-17`:

| Decision ID | Area | Primary Live Sources Inspected (`2026-10-17`) | Synthesized Zackisch Pattern |
| :--- | :--- | :--- | :--- |
| **R001** | Cross-App Region & Language Selector | GOV.UK Service Manual (`naming-your-service`), WCAG 2.2 SC 3.2.6 (`consistent-help`), WCAG 2.2 SC 2.5.8 (`target-size-minimum`) | Unified `RegionLanguageSelector` & `RegionLanguageTrigger` in `@zackisch/design-system` with two explicit `<fieldset>` groups (**Operating Region** vs. **Display Language**), `44px` minimum touch targets, and strict separation of display language from backend regional RBAC. |
| **R002** | Guest Checkout & Non-Fiscal Confirmation | GOV.UK Design System (`confirmation-pages`), PayPal DE Business Checkout (`/de/business/accept-payments/checkout`), UStG § 14 | High-contrast order reference panel + explicit "what happens next" tracker + `PaymentVerification` non-fiscal disclosure + single-entry POS reconciliation (`PosReconciliationSummary`). |
| **R003** | Stripe Connect Embedded Onboarding | Stripe Connect Docs (`connect/onboarding/quickstart?connect-onboarding-surface=embedded`) | Embedded `ConnectAccountOnboarding` paired with server-side capability verification (`chargesEnabled` / `payoutsEnabled` in `getSetupReadiness`), never trusting client redirect URLs alone. |
| **R004** | Private Support Tickets & Internal Staff Notes | Atlassian Design System (`components/flag/examples`), GOV.UK (`error-summary`), TDDDG § 25 | Canonical `getTeamTickets` / `getTeamTicketThread` queries enforcing strict regional isolation for all non-`super_admin` roles (including `regional_admin`), server-side stripping of `internal` notes from customer responses, and `sessionStorage` ops session storage (`zackisch_ops_session`). |
| **R005** | Monochrome Editorial Storytelling & Media Provenance | PayPal DE Checkout, Pexels License (`pexels.com/license`), DDG § 5 | Environment-aware `resolveBrandAsset` and `resolveMediaAsset` (local `/...` paths on `root`, `http://localhost:3000` in dev, `https://zackisch.com` in prod), plus SHA-256 verified `root/public/media/register.csv` with honest `model_release_verified="unverified"` / `"not_applicable"` status. |
| **R006** | Platform Fee Invoice Validity (EN 16931 / XRechnung) | BMF E-Rechnung FAQ, UStG § 14 | `validateEn16931Completeness` and `buildEn16931XRechnungXml` in `app/convex/setup.ts` emitting complete Mannheim supplier address/contact, `EndpointID`, `PartyLegalEntity`, `PaymentMeansCode` (`48`), and `InvoicePeriod`, while marking `urn:cen.eu:en16931:2017#draft-pending-supplier-tax-id` until the supplier tax/VAT ID is configured. |

---

## 3. Relocation of `@zackisch/design-system` to Repository Root (`design-system/`)

- Moved `packages/design-system` to `design-system/` at the repository root (`git mv packages/design-system design-system`) and removed the empty `packages/` directory.
- Updated `package.json`, `root/package.json`, `app/package.json`, `support/package.json`, `internal/package.json`, lockfiles, `tsconfig.json` path mappings, and `app/globals.css` `@import` and `@source` directives across all four applications.
- Added shared enterprise modules to `design-system/`:
  - `src/tokens/brand.ts`: `getBrandAssetOrigin`, `resolveBrandAsset`, `resolveMediaAsset`
  - `src/components/Toast.tsx`: `ToastProvider`, `useToast`, `notify`, `getDefaultToastDuration` (persistent `0ms` `role="alert"` for `error`/`warning`; `5000ms` `aria-live="polite"` for `info`/`success`/`neutral`)
  - `src/patterns/RegionLanguageSelector.tsx`: `RegionLanguageSelector`, `RegionLanguageTrigger`, `RegionFlag`, `DEFAULT_REGIONS`, `DACH_REGIONS`, `DEFAULT_LANGUAGES`
  - `src/layouts/index.tsx`: Replaced hardcoded German strings and raw hex utilities with localized props and semantic CSS variables.

---

## 4. P1 Security, Integrity & Compliance Remediations

1. **Internal Admin Session & Identity (`internal/lib/admin-context.tsx`):**
   - Removed the hardcoded `"selim@zackisch.com"` fallback email (`adminEmail` defaults to `""` when unauthenticated).
   - Migrated `zackisch_ops_session` persistence from `localStorage` to `sessionStorage` + `SameSite=Strict` cookie and added automatic purge of any legacy `localStorage` token.
2. **Regional Admin Isolation & Canonical Ticket Console (`app/convex/support.ts`, `internal/app/tickets/page.tsx`):**
   - Enforced strict regional isolation (`admin.regionId.toLowerCase() !== regionId.toLowerCase()`) for all non-`super_admin` roles, including `regional_admin`.
   - Switched `internal/app/tickets/page.tsx` to canonical `getTeamTickets` and `getTeamTicketThread` queries and aligned all schema fields (`lastMessageAt`, `assignedToEmail`, `businessName`, `visibility === "internal"`, `authorType`, `authorId`).
3. **EN 16931 XRechnung Completeness Validator (`app/convex/setup.ts`):**
   - Added `validateEn16931Completeness` and upgraded `buildEn16931XRechnungXml` with full supplier address/contact (`Dannstadter Straße 6-8, 68199 Mannheim, DE`), `EndpointID`, `PartyLegalEntity`, `PaymentMeansCode` (`48`), `InvoicePeriod`, and explicit draft customization URN when `supplierTaxId` is not yet configured.
4. **TDDDG § 25 & GDPR Privacy Policy Reconciliation (`root/lib/privacy-de.json`, `root/lib/privacy-en.json`):**
   - Reconciled both German and English privacy policies with the verified data-flow register (`zackisch_locale`, `zackisch_region`, `zackisch-language-storage`, `zackisch-region-storage`, `zackisch_ops_session`, `zackisch_support_token`, `zackisch_support_business_id`, `staff_session`, `order_session`, `availability_session`, `zackisch_staff_session_v1`, `cart`).

---

## 5. Verification Results & Remaining External Sign-Offs

- **TypeScript (`npm run typecheck`):** PASS across `design-system`, `root`, `app`, `support`, and `internal` (0 errors).
- **Unit & Integration Tests (`npm run test:unit`):** PASS across all 11 test suites / 74 tests (`root`: 11 passed, `app`: 53 passed, `support`: 6 passed, `internal`: 4 passed).
- **Cloudflare Security Audit (`npm run audit:security`):** PASS (coverage ledger and findings validated).
- **External Owner / Tax Advisor Items Pending Before Live Production Cutover:**
  1. Configure production `ZACKISCH_SUPPLIER_VAT_ID` (`USt-IdNr.`) or `ZACKISCH_SUPPLIER_TAX_ID` (`Steuernummer`) in Convex environment variables so `buildEn16931XRechnungXml` transitions from `#draft-pending-supplier-tax-id` to full `#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0`.
  2. Replace Pexels stock photographs where `model_release_verified` is `"unverified"` if custom venue/staff photography with signed model/property releases is desired, or retain strictly for illustrative non-endorsement editorial context per Pexels license terms.
