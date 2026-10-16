# Operations, observability and support runbooks

## Operational ownership

The internal **Team Dashboard** (`internal.zackisch.com`) is the authorized working surface for regional staff/admins. Scope includes account/business oversight, orders, partner commission, newsletter campaigns, email delivery/auditing, permission management and merchant support. Actions are always constrained by assigned region, explicit permission and auditability.

Provider responsibilities: Cloudflare domain/Workers and deployment monitoring; Convex backing data/actions/storage/backups; Stripe financial ledger and connected merchant accounts; Google Workspace business/transactional email; Finom business banking/bookkeeping context; GitHub repository/CI. Retain only truthful integrations actually configured. Finom being used as business banking does not imply an automated Finom API integration.

## Environments

Keep local development, preview/staging and production logically separate. Use explicit project environment variables in provider dashboards and nonproduction credentials. Each app's deployment uses correct working directory and worker name. On production release review custom domain, TLS, CSP/origin, callbacks, email links, monitoring and Convex deployment target. Changing active domain requires human permission and DNS cutover plan; a passing local build alone does not prove live readiness.

## Release workflow

1. Review branch, dependency lock and version bumps; no unapproved `1.0.0`.
2. Confirm all affected apps and Convex contracts built/tested; QA across real browser and Cloudflare preview.
3. Verify full regression around ordering, payment, 2FA, region isolation, ticket visibility, QR printing and support identity.
4. Verify backup/safe rollback readiness, recent recovery exercise and provider status.
5. Receive explicit approvals for legal copy, production domain cutover, live Stripe/provider changes, destructive data migrations and outbound mass email.
6. Release by controlled procedure, smoke test real domains **without live charges unless authorized**, monitor status and preserve reversible rollback where possible.

## Monitored signals

- Worker request failure, latency and origin route health per app.
- Convex function errors and slow queries; collection/scans and resource use.
- Stripe webhook delivery/retries/payment reconciliation, refund/chargeback exceptions, provider API error.
- Owner signup/OTP failure spikes, unauthorized access denied, tablet reconnect failures.
- Ticket backlog, assigned/old unresolved cases, email send failures/retry queue.
- Recent successful backup, file storage inclusion and recovery drill age.
- Browser performance/field Core Web Vitals where actual telemetry exists, with data minimization.

Alert thresholds and contact policy need owner approval; do not invent monitoring configuration in docs or publicly promise particular uptime.

## Troubleshooting playbooks

**No staff order after guest says they paid:** Do not issue another charge. Look up provider payment status and webhook record using correct scoped permission; reconcile order ID/venue; recover if payment succeeded but order creation failed; do not expose guest financial details unnecessarily.

**Guest QR broken:** Check table still exists, URL encoding/venue/locale, activation state, code legibility/quiet zone and live app route. Offer staff ordering while investigating.

**Owner cannot pair tablet:** Verify compatible browser/connection, token expiry/revocation, cookies and paired org; issue new limited pairing token through owner-authenticated flow; never send privileged token to unsecured email/chat.

**Support notification missing:** Verify ticket saved; inspect redacted outbox/error and send idempotent retry. Do not duplicate public ticket messages.

**Regional data mismatch:** Stop access, reproduce in isolated staging with test tenants, inspect policy and query indexes; treat it as potential security incident, not a cosmetic UI filter bug.

**Incident or outage:** Mark unavailable honestly, use existing POS fallback, track paid-order reconciliation, invoke provider escalation, preserve audit evidence and follow the recovery guide.

## Internal knowledge and response style

A ticket response should be specific and actionable in the customer's language with link to the current help article. Internal notes may include operational triage but not unnecessary secrets or full card data. Customers should know whether they must take action next. Keep response promises conservative: no fabricated 24/7 hotline or guaranteed one-hour SLA.
