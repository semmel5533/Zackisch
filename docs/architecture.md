# System architecture and engineering contracts

## Architecture at a glance

Zackisch is a region-aware B2B2C platform with four Next.js applications and a single Convex backend. Product context is in the German root README, design system governance in `../design-system/README.md`, security in `security.md`, operations in `operations.md`. Never create competing per-app backend deployments or account stores.

| Domain | Directory / npm name | Execution | Primary actors |
| --- | --- | --- | --- |
| `zackisch.com` | `root/`, `root` | Next.js/vinext on Cloudflare Workers, primarily prerendered static pages | Prospective owners, public audience |
| `app.zackisch.com` | `app/`, `app` | Next.js/vinext on Cloudflare Workers | Owners, staff, guests |
| `support.zackisch.com` | `support/`, `support` | Next.js/vinext on Cloudflare Workers | Public readers, authenticated owners |
| `internal.zackisch.com` | `internal/`, `internal` | Next.js/vinext on Cloudflare Workers | Regional admins, support and ops staff |
| Convex | `app/convex/` only | Managed Convex cloud | Server-side persistence, actions, events |

All four applications use Cloudflare Workers/vinext. The public marketing site should still serve pre-rendered, cacheable static pages, avoiding unnecessary dynamic compute. Verify real Workers static-asset behavior and performance before domain cutover. Cloudflare documents vinext for Next.js on Workers: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ .

## Service boundaries and data flow

```
Public web -> root static assets / localized pages -> safe registration and help links
Guest QR -> app public route -> read-only sanitized menu -> cart -> server pricing -> Stripe -> signed webhook -> Convex paid order -> staff tablet
Merchant -> app authentication -> authorized action -> Convex org/region policy -> menu, setup, QR, staff sessions
Public help -> support localized article content/search
Owner ticket -> support authenticated action -> Convex ticket + messages + notification job -> internal queue
Internal agent -> internal 2FA + scoped permission -> Convex regional data -> response/audit/notification
```

Financial transactions are **not** created when a guest merely submits a client-side cart. The server reconstructs item and option prices from persistent canonical menu records. A valid paid order must be reconciled with a verified payment event, avoiding duplicate creation on provider redelivery and distinguishing payment pending, succeeded, refunded and disputed statuses. When payment confirmation is ambiguous, show pending/retry safely; do not produce false "paid" screens or double orders.

## Core bounded contexts

1. **Identity and sessions:** merchant identity; scoped internal team identity; staff terminal pairing; guest browser/checkout association. Shared merchant authentication for `app` and `support` with strictly scoped session validation, cross-origin CSRF and return URL allowlist. Never equate same backend with automatic SSO.
2. **Businesses and regions:** business owner, membership where supported, legal region, currency, offerings, open/paused status and permitted staff session. Region is derived from the business or verified staff assignment, never trusted from a client filter.
3. **Menu and availability:** categories, items, options, prices in minor currency units, tax classification, photo assets, availability updates, validation and ordering.
4. **Ordering and payment:** Dine-in versus pickup; table/venue identity; canonical totals, Stripe Connect, signed webhook, idempotency, status machine, receipts and reconciliation. Existing POS manual accounting is operationally independent.
5. **Setup readiness:** derived blockers, optional recommendations, persisted progress, resumable actions and last verified checks. Keep genuine source facts separate from UI dismissal flags.
6. **QR/print:** canonical public URL generation, print asset builder, QR encoding and scannability verification. Never encode privileged tablet/merchant/admin tokens.
7. **Knowledge base:** region+language+stable slug+publication state, articles and categories, search index, navigation and relevant links; editorial version matches deployed UI. Minimize CMS complexity.
8. **Ticketing:** business-owned ticket, region, requester, public messages, staff-only notes, attachments, assignment, status, notifications, audit. Every read and write authorizes both ticket visibility and specific message visibility.
9. **Internal ops:** independent 2FA, regional permissions, businesses/orders/partners/newsletters/email/audit/support. No implicit global access.
10. **Infrastructure and recovery:** Cloudflare deployment/observability, Convex backups, Stripe/Workspace integrations, documented incident recovery and operational ownership.

## Recommended layout per app

```
app/
  app/            # route groups, layout, pages, route handlers; mostly composition
  actions/        # authenticated Server Actions, input validation, safe error mapping
  components/     # domain-specific presentation and shared accessible primitives
  lib/            # narrow helpers, auth bridges, runtime/client configuration
  convex/         # schema, private/public functions, policies, provider-side actions
  tests/          # actual unit/integration scenarios
```

Use the same clarity of module boundaries in other apps without a costly move to a new generalized platform package. Reuse cross-app tokens/contracts through checked-in schema or small workspace package **only when it demonstrably prevents drift** and builds cleanly across all four Workers applications. Avoid accidental imports of `app` Node-only server modules into `support` or `internal`. Keep server-only modules explicitly separated from browser bundles.

## Data modeling: region, tenant, references

All private domain entities are associated directly or through immutable references with exactly one business and region. Establish indexed queries appropriate to access patterns. Do not rely on filters after broad collection reads for confidentiality or performance. For support, a reasonable example model includes:

```
articles: regionCode, locale, slug, categoryKey, title, summary, body, status, updatedAt
supportTickets: businessId, regionCode, requesterUserId, subject, category, priority, status, assignedAdminId?, createdAt, updatedAt
supportMessages: ticketId, senderKind, senderId, visibility(public|internal), body, createdAt
supportAttachments: ticketId, messageId?, storageId, mimeType, sizeBytes, uploadedBy, createdAt
supportEvents: ticketId, type, actor, regionCode, safeDetails, timestamp
setupProgress: businessId, dismissedHints, lastReviewedStep?, updatedAt
```

This is a suggested shape, not an instruction to copy blindly. Use real `Id<...>` references where appropriate, efficient indexes and server invariants. **Do not persist a trusted "ready" boolean when it can become stale.** Compute readiness from validated current status (including provider state, menu completeness, pairing, QR test) and optionally cache with explicit invalidation. Where setup steps depend on external Stripe verification, distinguish `pending`, `needs_action`, `verified`, and `error`.

## Naming and interface conventions

- Domain concepts in PascalCase for TypeScript types/classes, camelCase for functions/variables, kebab-case for filenames and URL slugs, SCREAMING_SNAKE_CASE for environment variables and stable constants, canonical DB table naming aligned with current Convex schema and generated types.
- Prefer `business` for business, `regionCode` for legal market, `locale` for UI translation, `member`/`operator` for auth roles, `staffSession` for paired device, `supportTicket` and `supportMessage` for customer support. Do not indiscriminately replace the existing stable schema fields without migrations/tests.
- Intentful functions such as `requireBusinessOwner`, `getPublicVenueMenu`, `createTicketForBusiness`, `addInternalTicketNote`, `markOrderReady`, `calculateCheckoutPrice`; avoid ambiguous `handleData`, `utils2`, `adminThing` or broad `getAll`.
- Server Action return types form discriminated unions with safe keys (`ok`, `errorCode`, safe `fieldErrors`) rather than provider exceptions or stack traces.
- UI uses domain-accurate German: `Betrieb`, `Personal-Tablet`, `QR-Code`, `Kasse`, `Bestellung`, `Abholung`, `Einrichtungsassistent`, `Team Dashboard`. Internal naming may be English.
- No direct cross-domain database mutation through browser-accessible convenience endpoints. Public data query output must use explicit allowlisted DTOs.

## Runtimes and configuration

Maintain separate development, preview and production configs with secrets managed by Cloudflare/Convex/Stripe providers, never Git. Document only names of necessary vars and safely reproducible setup commands. Keep `wrangler.jsonc` worker names aligned with the application purpose, such as `zackisch-app`, `zackisch-support` and `zackisch-internal`; configure custom domains via verified deployment settings. Audit `NEXT_PUBLIC_*` values for exposure, `compatibility_date`, `nodejs_compat`, cache and bindings. Test exact Cloudflare build artifacts and runtime, not only `next dev`.

## Failure modes

| Boundary | Required behavior |
| --- | --- |
| Stripe delayed/duplicate webhook | Idempotent eventual state, reconciliation and no duplicate kitchen order |
| Convex unavailable | Honest unavailable notice; no unsupported offline checkout or false success |
| Restaurant internet down | Existing POS/manual service continues, already-paid digital orders reconciled after recovery |
| Tablet token revoked/expired | Clear reconnect pathway; no stale privileged data |
| QR table deactivated | Safe guest explanation without misdirected order |
| Ticket notification fails | Ticket remains stored; retryable notification without duplicate sending |
| Region mismatch | Deny before private data read or mutation; audited where appropriate |
| Translation missing | Build-time validation/CI failure, not silently hardcoded strings |

## Architecture decision records

Important decisions must be captured succinctly in `product-decisions.md` with context, alternatives, security/operational consequences, verification link and current decision. This file records the **active decisions only**, not an accumulating migration history. Staging PRs may include implementation rationale separately.

## Payment, fiscal and data-protection invariants

The final operational payment model must be documented from actual Stripe-connected-account capabilities and Stripe objects, never inferred from branding. Seller of food (restaurant), payment provider (Stripe) and software/platform fee supplier (Zackisch) remain separately modeled and reconciled. Guest B2C sale tax and Zackisch's B2B service tax are separate accounting and invoice flows. Store per-order immutable item VAT snapshots, refund/dispute and ledger references; implement secure idempotency, least-privilege webhook/authentication, and do not describe generic confirmations as KassenSichV receipts. Every processing purpose must have an identified controller/processor, vendor/location/DPA, permission policy and approved retention outcome. The public merchant Terms, checkout legal disclosures and ticket privacy information must match the implemented architecture. See `payments-and-stripe.md`, `tax-invoicing-and-fiscalization.md`, `privacy-and-data-governance.md` and `legal-pages-consents-and-contracts.md`.

## Connected merchant settlement and fiscal boundary

A restaurant's Stripe connected account owns its Direct Charge and Stripe-owned payment pricing and negative-balance responsibility where the account's returned configuration confirms it. Zackisch collects its own 2%-VAT-inclusive application fee and does not take custody of guest sale proceeds. Connect embedded account sessions are created only for authenticated, authorized merchant owners, short-lived and never logged. Stripe Connect webhooks are verified and idempotent. Guest order/payment confirmation is a distinct document from the restaurant's own statutory receipt/invoice; the merchant's existing POS is separately reconciled exactly once with `already externally paid` notation and auditable employee confirmation. See [Stripe Connect](payments-and-stripe.md), [Guest and POS](guest-confirmation-and-pos.md) and [Tax/fiscalization](tax-invoicing-and-fiscalization.md).
