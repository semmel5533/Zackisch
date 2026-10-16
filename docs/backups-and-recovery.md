# Backup, disaster recovery and operational continuity

## Verified provider capability versus tenant configuration

Convex officially supports manual backups and scheduled automatic **daily or weekly** backups in its dashboard. Scheduled backups require Convex Pro as documented by Convex. Backups capture a consistent database table snapshot; including file storage is configurable. Current published retention is **7 days for daily backups and 14 days for weekly backups**; manual backups are also retained for 7 days. Configuration, code, environment variables and scheduled functions are **not included**. These are *provider capabilities*, not a claim that any particular Zackisch production deployment has backups enabled. Reference: https://docs.convex.dev/database/backup-restore .

The owner reports that automatic Convex backups are already enabled. Before release the operator must use the actual deployment dashboard and **verify**: deployment identity, plan, schedule, time zone, last successful backup, retention, whether file storage is included, alerting/access permissions and a usable restore artifact. Avoid inserting secrets or customer data into evidence. If configuration cannot be read, record `unverified` instead of inferring a schedule.

## Recovery coverage matrix

| Asset | Recovery source | Gap to plan for |
| --- | --- | --- |
| Convex database tables | Convex scheduled/manual backups | Point-in-time only; limited published retention |
| Convex file storage | Backup **only when opted in** | Missing menu photos or attachments if omitted |
| Application source | Private GitHub repository + tagged release commit | Repository alone cannot reconstruct secrets |
| Deployment/workers config | Versioned Wrangler/Next settings + provider inventory | Live domain/build bindings and secrets not in Convex backups |
| Cloudflare DNS/custom domains | Controlled IaC/export/runbook and account access | Manual state reconciliation and permissions |
| Stripe payment state | Stripe as authoritative payment ledger | Convex order reconciliation, refunds and payouts |
| E-mail delivery/notifications | Provider logs + idempotent notification outbox | Avoid duplicate messages on recovery |
| Encryption keys/secrets | Provider secret managers + securely controlled recovery procedure | Never commit or casually export plaintext |

## Restoration policy

**NEVER run a Convex restore/import over production merely to test recovery.** Convex restore workflows may replace existing deployment data. Verify the current official restore semantics; use an isolated nonproduction deployment populated with synthetic or properly anonymized fixtures. Scope restore privileges to authorized operators only. Preserve an immutable record of the recovery exercise without dumping sensitive content.

A complete exercise:

1. Identify the correct backup artifact, date/time, database and Storage inclusion; record a hash if downloaded securely.
2. Create isolated recovery deployment with appropriate low-privilege test provider configuration and nonproduction Stripe keys. Confirm it cannot send real emails or issue live payments.
3. Import backup/synthetic equivalent into the isolated target, following current Convex docs and confirming destructive implications before any command.
4. Run schema compatibility checks, authorization tests, basic menu/order/ticket read/write, media fetch and account logins; never expose retained real user credentials.
5. Check cross-provider reconciliation: Stripe ledger remains authoritative for payments; do not replay already consumed webhooks into kitchen order creation.
6. Record observed recovery time and lost test-data window, not fictitious RTO/RPO. Owner must approve explicit operational RTO/RPO objectives.
7. Delete test deployment and any temporary copies securely and document permissions used.

## Monitoring and service health

Observe each Cloudflare app and Convex functions with separate latency, request error rate, build health and provider status. Monitor Stripe webhook backlog, failed email/outbox delivery, ticket response backlog, failed login spikes, unauthorized access attempts and most recent successful backup. Alerts should point to runbooks and avoid customer payloads. Establish appropriate owner escalation and maintenance windows. Document whether alerts are implemented rather than claiming an SLA.

## Incident playbooks

- **Internet/Cloudflare outage:** existing local POS/normal verbal service continues; signage or staff informs guests that digital ordering is temporarily unavailable. Do not promise offline Zackisch ordering. Reconcile already paid transactions when service returns.
- **Convex degradation:** disallow new unconfirmed orders and reflect backend status honestly; protect existing settled orders, do not use client caches as financial truth.
- **Stripe unavailable:** disable payment initiation; show clear non-charging state; verify webhook/settlement before declaring paid. Existing POS remains an alternative payment process.
- **Tablet failure:** switch to compatible spare or reconnect through secure short-lived pairing flow; revoke compromised tablet tokens.
- **Security incident:** isolate affected origin, rotate secrets/sessions, preserve lawful evidence with minimal access, assess legal notification timelines with counsel, track remediation and independently retest.
- **Bad deploy/schema regression:** isolate provider effect, restore tested previous app artifact where safe; evaluate Convex schema compatibility and reconciliation before rollbacks; never blindly replace production data.

## Backup ownership and evidence checklist

| Check | Owner | Evidence |
| --- | --- | --- |
| Automatic backups enabled in each production deployment | Authorized Convex project admin | Redacted dashboard timestamp/config screenshot |
| File storage inclusion | Convex project admin | Redacted setting and sample media recovery |
| Last successful backup and alert | Operations | Provider timestamp and alert test |
| Staging restore exercise | Engineering + operations | Dated command log, harmless fixture checks, RTO/RPO observation |
| Domain/Worker rebuild | Engineering | Successful clean deployment from tagged commit |
| Stripe reconciliation and manual fallback | Engineering + real venue pilot | Synthetic/event fixture or supervised test evidence |
| Retention/GDPR review | Counsel / privacy owner | Signed policy decision |

Only report backup verifications actually performed. Do not modify the user's existing production backup schedule without explicit authorization.
