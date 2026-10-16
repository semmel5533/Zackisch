# Security architecture, authorization and threat controls

**Security is a verifiable engineering property, not a marketing absolute.** This document defines the expected security contract for all four apps and Convex, with OWASP ASVS as a structured review aid, not a claim of certification. Check current upstream security guidance before each major security change.

## Threat boundaries and actors

- Anonymous guest: public menu, QR code, cart, controlled payment return page and appropriate order tracker.
- Merchant user: authenticated account, organizations they own or explicitly belong to, related data and tickets.
- Staff tablet: narrow terminal session with only orders/status and availability operations needed for that venue. Never inherit owner admin privileges.
- Internal team: separate 2FA session, `regional_admin` or `staff` role and explicit resource permissions, enforced by Convex after session validation.
- External providers: Stripe Connect via signed webhooks; Google Workspace via server-held credentials; Convex and Cloudflare through secrets and deployment scopes.
- The browser, query parameters, QR contents, emails, third-party callbacks and uploaded files are always untrusted inputs.

## Required access-control policy

Every protected operation evaluates actor identity, authentication/session validity, action permission, object ownership, organization and region, plus ticket message visibility. The organization region must be fetched through trusted data; ignore or validate claimed request region. Deny by default and shape responses to avoid entity enumeration. Enforce at (1) route/Server Action and (2) Convex function/data access layers. Use typed policy helpers rather than copy-pasted ad hoc checks. Keep public Convex functions to minimum; mark privileged helpers `internalQuery`, `internalMutation` and `internalAction`.

| Object / action | Merchant owner | Paired staff | Regional support staff | Anonymous guest |
| --- | --- | --- | --- | --- |
| Public menu read | Yes | Yes | Only as public user | Yes |
| Menu/QR edit | Own org | No | Only explicit admin permission | No |
| View/process live order | Own org | Paired org, bounded actions | Explicit regional permission | Only sanitized own tracker |
| Ticket create/read/reply | Own org | No, unless explicit account policy | Assigned region + `tickets:*` | No |
| Internal ticket note | No | No | Assigned region + `tickets:note` | No |
| Newsletter, partner ledger, staff admin | No | No | Specific operational permission | No |
| Cross-region private queries | No | No | No by default | No |

## Sessions and cross-subdomain sign-in

Use the existing trusted merchant identity for `app` and `support`, without duplicate user records or insecure implicit domain cookies. Prefer narrow host-only Secure, HttpOnly, SameSite cookies and a deliberately designed short-lived authorization-code exchange via authenticated redirect if needed. Allowlist callback origins, bind exchange to state/nonce and session, single-use and short TTL; avoid localStorage tokens or leaking bearer credentials through URLs, logs, analytics or `Referer`. Logout and account deletion must revoke both sites. Re-evaluate account recovery, session fixation, multi-device logout and server-side revocation. Do not casually reuse internal Team Dashboard sessions for merchant routes. Existing OTP rules and timeouts need compatibility/regression testing.

## Web threats to prove absent or mitigated

1. **IDOR / BOLA:** change organization, ticket, attachment, order and table IDs in every route/action/query. Test adversarial users from other businesses and regions.
2. **CSRF and login CSRF:** enforce appropriate SameSite plus server Origin/Host checks for state-changing cross-site contexts; never trust browser-set headers without platform review.
3. **XSS and rich content:** sanitize Markdown/rich text renderers, strip dangerous HTML, restrict SVG where unsafe, use CSP appropriate to Stripe and trusted assets. Untrusted ticket/restaurant text must not become executable.
4. **SSRF:** no arbitrary user-provided URL fetches from Convex actions/Workers; strict provider host allowlists and redirect behavior for remote images/links where used.
5. **Payment integrity:** Stripe signature verification on raw body, idempotency on events/orders, authoritative amount and currency, Connect account linkage, cancellation/refunds/dispute handling, replay protection, payment state audit. No order release to kitchen solely because the browser claims success.
6. **OTP, brute force and session attack:** rate limits per identity/IP/tenant where suitable, challenge expiry, failed-attempt limits, hashed credentials, secure reset, bounded admin sessions and revocation, audit of suspicious operations.
7. **File uploads:** allowlisted MIME validated by bytes, size/count limits, virus/scanning strategy where feasible, private storage, signed/time-limited access, authorization on download, XSS-resistant rendering, storage quotas and deletion retention.
8. **Resource abuse and cost:** per-tenant rate limits and pagination on public search, signup, ticket creation, OTP and checkout. Bound data scans, search input length, attachment throughput, log volume and retry fan-out.
9. **CORS/CSP/cache headers:** origin allowlists per app, CSP with Stripe-required exceptions only, no `Access-Control-Allow-Origin: *` for credentialed endpoints, no-store for private pages/data, adequate `Referrer-Policy`, framing protection and HTTPS/HSTS strategy.
10. **Secrets and logging:** Cloudflare/Convex provider secrets only; rotate compromised keys; no secrets or customer PII in console, traces, error pages, telemetry, emails or audit logs. Use safe structured error codes.
11. **Supply chain:** lockfile-only installs in CI, dependency review, security advisories, pinned audit tools, no automatic unreviewed npm lifecycle scripts or network access in security test sandboxes.
12. **Data lifecycle:** privacy notices, minimal collection, purpose-bound storage, retention schedules, GDPR access/deletion process, audit data minimization, secure backup access, breach response plan.

## Separate customer and staff support messages

Customer-visible replies and internal notes **must be different server operations** and database visibility types. Any public ticket query explicitly selects `visibility = public` and removes staff metadata and internal fields. Internal-only files cannot be retrieved through a customer attachment API even with a known storage ID. Staff client cannot change visibility by tampering with a request unless actor has appropriate capability. Add tests that attempt every variant.

## Security verification matrix

- Unit: policy truth table covering owner, staff terminal, ops employee, regional admin, cross-organization and cross-region.
- Integration: publicly callable Convex queries/mutations cannot enumerate private fields or mutate without server-bound proofs.
- End to end: login, token rotation/expiry, logout across `app`/`support`, internal OTP, direct deep link with wrong region, invalid CSRF origin.
- Provider: Stripe test mode duplicated/reordered webhook, wrong signature, stale prices and malformed cart, disputed/refunded statuses, payout account mismatch.
- Scanners and manual: dependency scan, secret scan, source-to-sink analysis, Cloudflare security-audit skill, DOM XSS/headers/caching, CSP, attachment download attempts.
- Recovery: backup export permissions, nonproduction restore isolation and evidence; privileges used only when necessary.

## Audit and incident expectations

Confirmed critical/high findings block release until remediated and independently retested. A scanner output is a *lead*, not proof of exploitability; Cloudflare's skill has separate `confirmed`, `needs_validation`, and `rejected` classes. Unresolved security facts remain blockers when impact could be severe. Do not run offensive tests against production or unrelated systems; use isolated test deployment and explicit scopes. Keep actionable vulnerability details out of public marketing and screenshots. Publish only factual, conservative security language: `Zugriffe werden rollen- und betriebsbezogen geprüft` when verified, never `100 % sicher`.

References: https://owasp.org/www-project-application-security-verification-standard/ ; https://github.com/cloudflare/security-audit-skill ; https://docs.convex.dev/ ; https://developers.cloudflare.com/workers/ .
