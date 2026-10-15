# Documentation audit & Migration Status

This document records the audited security, architectural, and operational state of the Zackisch monorepo. It explicitly distinguishes verified, tested behavior from pending external requirements.

## 1. Resolved Security & Architectural Items (Audited & Verified)

| Component / Finding | Previous Issue | Resolution & Evidence | Status |
| --- | --- | --- | --- |
| **Cryptographic OTP & Token Randomness** | `Math.random` was used for 6-digit verification codes and session tokens in `customAuth.ts` and `users.ts`. | Replaced with cryptographically secure random generators: `crypto.randomInt(100000, 1000000)` in Node environments and `crypto.getRandomValues(new Uint32Array(1))` in Convex runtimes. Verified in `webapp/convex/customAuth.ts` and `webapp/convex/users.ts`. | **RESOLVED & TESTED** |
| **Guest Boundary & Data Sanitization** | Public queries (`getOrder`, `organizations.get`) previously leaked internal Stripe IDs, tax numbers, owner IDs, and accounting fees to guests. | Implemented `getGuestOrderTracker` in `webapp/convex/orders.ts` and `getPublicRestaurant` in `webapp/convex/organizations.ts`. Return shapes strictly sanitize and exclude owner IDs, Stripe account IDs, tax IDs, internal fees, and payment tokens. | **RESOLVED & TESTED** |
| **Google Workspace SMTP Infrastructure** | Migration from legacy M365/custom SMTP to Google Workspace SMTP relay (`smtp-relay.gmail.com:587`, STARTTLS, `noreply@zackisch.com`). | Synced `GOOGLE_WORKSPACE_SMTP_*` configuration and app password securely into remote Convex deployment (`dev:silent-narwhal-392`). Tested live SMTP transmission via `emails:testSmtpConnection`; connection authenticated and email delivered successfully. Central logging active in `emailLogs` table. | **RESOLVED & VERIFIED LIVE** |
| **Operative Headquarters (`adminapp`)** | No dedicated administrative workspace existed; team actions were undocumented. | Built full Next.js application in `adminapp/` with 11 routes (`/`, `/restaurants`, `/orders`, `/staff`, `/partners`, `/newsletter`, `/emails`, `/audit`, `/settings`). Real-time connection to shared Convex backend, granular staff permissions, and non-sensitive audit diffs. Typecheck and Next build pass cleanly. | **RESOLVED & BUILT** |
| **Newsletter System (Double Opt-In & RFC 8058)** | No built-in newsletter or campaign tool existed. | Full newsletter engine in Convex (`newsletter.ts`), `adminapp/app/newsletter/page.tsx` (No-Code block editor and campaign scheduler), website footer form, and public static pages (`/newsletter/confirm`, `/newsletter/unsubscribe`). RFC 8058 One-Click Unsubscribe headers (`List-Unsubscribe-Post: List-Unsubscribe=One-Click`) handled via Convex HTTP action. | **RESOLVED & TESTED** |
| **Brand Migration to Zackisch** | Codebase and UI referenced legacy brand `zakkig`. | Canonical assets `brand_mark` (symbol only) and `combination_mark` (symbol + wordmark) generated and integrated across all three applications. Derived formats (`.png`, `.webp`, favicons, apple touch icon, QR inlays, social og_image) built via Sharp. Marketing texts, legal translations, JSON-LD schemas, and domains updated to `zackisch.com`. | **RESOLVED & COMPILED** |

## 2. Open Operational & External Items

The following items depend on external merchant actions, business decisions, or third-party provider accounts and remain intentionally separated from shipped code claims:

1. **Stripe Connect Production Verification:** The Stripe Connect integration uses Standard Connect with Checkout Sessions and Payment Elements. Production verification, live payouts, and dispute handling require live merchant onboarding.
2. **Finom Accounting Integration:** Finom remains the intended business banking and preliminary bookkeeping tool. Specific API sync depends on available Finom developer APIs.
3. **POS / KassenSichV Notice:** Zackisch is an ordering and cashless payment platform. Operators manually record digital orders into their existing point-of-sale systems according to local cash register regulations (KassenSichV / TSE).
4. **General Terms & Conditions (AGB):** The GTC text remains in finalization; legal notice is maintained in `website/lib/legal-translations.ts`.
