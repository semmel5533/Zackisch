# GDPR architecture, processing inventory and data lifecycle

**Status:** German-first implementation specification, reviewed against the GDPR and TDDDG on 16 October 2026. Do not assert that a particular vendor is EU-only, a processor, or free of non-EU transfers without inspecting the active signed agreement and configuration. The actual privacy policies, processor register, retention schedule, TOMs and breach/DSAR procedures require DPO/legal review and verification in production. Data minimization is a design requirement, not a claim of complete anonymity.

## 1. Processing-purpose matrix (verify controller roles case by case)

| Data and flow | Purpose | Probable role / actors to validate | Need, access and minimization | Typical lawful basis to assess |
| --- | --- | --- | --- | --- |
| Owner identity, company, verified business and contact | Account, contract, billing, security | Zackisch independent controller for own B2B relationship; Stripe separate role for KYC | Essential business data only; do not mirror KYC scans/IBAN if Stripe handles them | Art. 6(1)(b), (c), (f) depending on subject and processing |
| Menus, owner-configured pricing, allergen data | Restaurant ordering service | Restaurant generally determines content; Zackisch service/processor for content where appropriate | Only merchant-admin editable; public fields intentionally selected | Art. 6(1)(b)/(f) or DPA legal basis, as determined by responsible party |
| Guest table/pickup cart, items, order state | Fulfilment and proof | Restaurant likely controller of guest order; Zackisch may process on instructions with separate platform compliance interests | No guest account needed; guest email optional; keep minimal linkable identifier, tokenize tracker | Art. 6(1)(b) for restaurant service, separately document Zackisch role |
| Stripe checkout/payment IDs, reconciliation | Payment processing, fraud, audit | Stripe and merchant/Zackisch roles subject to Connect agreements | Token/reference only; **never card PAN/CVC** in Zackisch DB, logs, analytics, attachments | Contract/legal obligation/legitimate interest subject to role |
| Optional receipt email | Send requested copy | Contractual service; recipient optional | Optional email fields; don't auto-subscribe to newsletter | Contract/request, consent only if actually appropriate |
| Newsletter subscriber and confirmation proof | Marketing | Zackisch controller | Double opt-in proof, unsubscribe status and limited abuse logs | GDPR consent as needed and UWG §7; right to withdraw |
| Public website server logs | Deliver/protect site | Zackisch, hosting provider by contract | Truncate/redact IP and user agent where feasible; rotate | Art. 6(1)(f) security or other justified basis |
| Strictly necessary auth/session cookies | Maintain requested sign-in/payment flow | Responsible operator of relevant domain | Secure HttpOnly SameSite, scoped per domain, expiry, no advertising reuse | TDDDG §25(2) necessity + separate GDPR legal basis |
| Optional analytics/advertising | Measure/market | Zackisch and vendors as contracted | Default off before consent; refusal equally simple; no tracking on guest purchase by default | TDDDG §25(1), consent under GDPR where required |
| Support tickets, screenshots, attachments | Resolve merchant issues | Zackisch often own support controller or processor depending issue; decide and document | Authenticated owners/members and authorized region agents only; redact PII in uploaded images | Contract/legitimate interest or DPA purpose; restrict sensitive data |
| Internal support notes and admin audit | Troubleshooting, internal security | Zackisch controller | Private notes never leak into public ticket responses or mail templates; role/region restrict | Art. 6(1)(f)/(c) as appropriate |
| Backups, deletion/legal hold | Resilience, preservation | Zackisch and vendors under appropriate agreements | Minimum backup copies, access audit, tested restore, purge when retention allows | Art. 6(1)(c)/(f) and Art. 32 necessity |

A processor can have some **independent-controller** purposes at the same time. A restaurant's merchant-owned data may require an Art. 28 processing agreement, while Zackisch's contract/security data require its own notice. Do not declare all processing joint controllership merely because vendors interact. Maintain a documented record of processing activities (Art. 30) to the extent applicable, with purpose/role/region/vendor/data-subject categories.

## 2. Full data map to create in the source repository

Enumerate every Convex table and storage bucket, all Cloudflare Workers/Pages request paths, auth cookies, cache/session state, Stripe metadata and webhook event payloads, Google Workspace email logs, Finom/accounting flows, analytics/observability, client device local/session storage, support uploads and backups. For each field document:

- Field name, subject type, optional/required classification, source, controller/processor and processing purpose.
- Legal basis, display/API consumers, sharing or transfer, vendor/subprocessor, geographical storage/processing, encryption/access, retention, deletion owner and backups.
- Whether it contains personal data or sensitive secrets; whether it can be indexed by search engines; whether it appears in browser/SSR/cache/third-party scripts.
- Contract/evidence: effective vendor DPA; SCCs/adequacy where applicable; transfer assessment and subprocessors; specific security and breach notification commitments.

Do not casually store raw Stripe event bodies, entire customer browser headers or card data, hidden tracking IDs, precise geolocation, birthday, dietary allergy *of the guest* or a guest's telephone/address if not needed for pickup. In product logs replace email/IP/token/reference with purpose-appropriate masked IDs and retain only what can be justified.

## 3. Cookie and frontend storage rules

Inventory cookies/localStorage/sessionStorage and external script access per subdomain and locale. The four domains have distinct roles; use host-only cookies by default rather than blanket `.zackisch.com` scope. SSO must rely on secure trust exchange with expiration/anti-CSRF, not leaking all user credentials into public guest or internal domain. Check `Secure`, `HttpOnly`, appropriate `SameSite`, maximum lifetime, revocation; clear cookie on logout and account deletion. Frontend analytics (if added) must not load until lawful choice; consent must be granular, specific, informed and reversible with a persistent `Datenschutzeinstellungen` option. Denying optional cookies cannot disable a legally necessary guest checkout. Track a minimal consent proof tied to policy/version if relied upon; do not persist unnecessary history forever.

## 4. Support data safeguards

Tickets may include pictures of screens, receipts, people or employee names. Warn against uploading payment card images, IDs, special-category medical information or unrelated personal data. Implement upload size/type constraints, private malware screening strategy and short-lived authenticated downloads, region/organization RBAC, per-ticket rate limits, malicious content sanitization, attachment deletion and audit. A staff-only note is its own server-side visibility class; neither public Convex queries, email notifications nor exports may include it. Automate ticket retention vs financial case preservation using real business purpose and legal hold. Do not use ticket content to train public AI systems without a separate documented legal assessment and user information.

## 5. Data rights, retention and separation

- Provide user-visible account deletion and privacy request intake with authentication and abuse checks. Deletion cannot automatically erase records needed for statutory accounting, fraud claims or ongoing disputes; separate personal account removal/anonymization from locked required financial ledger entries.
- Implement DSAR workflow: identify all linked tenant IDs, guest order references, Stripe/Cloudflare/Workspace/subprocessors, relevant exports, exceptions, response deadline and audit without exposing other tenants. Account owner is not automatically authorized to see every guest's unrelated data.
- Specify expiry for unverified signup/OTPs, terminal pairing tokens, guest carts, support tickets, newsletter proofs, security/audit logs and marketing events by purpose. **Do not invent one universal number**; document approved schedule with rationale and implement deletion job/cron where applicable. Obey invoice and accounting retention separately: §14b UStG generally 8 years for invoices; AO §147 has category-dependent 10/8/6-year rules and extended holds.
- Backups: define maximum restoration window, encryption, data subject access, deletion reapplication after restore, account revocation and breach scope. Backup is not an excuse to expose deleted data on a restored live database. Prohibit destructive production restore for testing.

## 6. Breach response and security controls

Role/region/tenant authorization at Convex actions, mutations, queries and server actions. Document least privilege, vulnerability handling, Cloudflare edge protections, Stripe signature verification, auth lockouts, cross-subdomain protection, secured file storage, incident owner and severity escalation. GDPR Art. 33 typically requires reporting qualifying personal data breaches to the supervisory authority within 72 hours after awareness, where feasible; whether notification is mandatory depends on breach risk. Art. 34 notice to persons depends on high risk. Practice incident drills with legal contacts; keep an evidence package and contact protocol. Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj .

## 7. Vendor checklist

| Provider | What to confirm independently (not assume) |
| --- | --- |
| Convex | Deployment/storage region; backup schedule and whether file storage included; access, DPA/subprocessors, SCCs/third-country transfers, encryption and logs; retention and deletion tools |
| Cloudflare | DNS/proxy/Workers/edge/storage locations and transfer mechanisms; log settings, security signals and DPA; documented subprocessor list |
| Stripe | Connected account data controller/processor roles, payment/KYC data, product DPA and privacy notices; webhook and reporting access; retention and transfer |
| Google Workspace | Mail content and audit data, EU/US processing disclosures, DPA, SMTP logs and retention; cross-border assessment |
| Finom | Company accounting/banking roles and whether vendor connects to app; data flows and local retention; no implied automatic API integration |
| Photo, video, analytics, support libraries | Consent/use rights, exact hosts, analytics scripts and non-EU transfer; no hidden CDN pixels or third-party embeds before assessment |

**Acceptance:** signed/current contracts cataloged outside Git, field-level inventory reviewed, public legal notices consistent with implementation, missing vendor data called out as blocker, negative access and deletion tests passing. Never commit DPA signatures, IDs, secrets or unredacted contracts to public GitHub.

## 8. Official references

GDPR Arts. 5,6,13,15,17,21,28,30,32–35,44+: https://eur-lex.europa.eu/eli/reg/2016/679/oj ; TDDDG §25: https://www.gesetze-im-internet.de/ttdsg/__25.html ; German Data Protection Conference AV guidance: https://www.datenschutzkonferenz-online.de/media/kp/dsk_kpnr_13.pdf ; state regulator guidance: https://www.lfd.niedersachsen.de/faqfaq-auftragsverarbeitung-nach-artikel-28-ds-gvo-189637.html .

## Embedded Stripe and guest confirmation data minimization

Hosted/embedded Stripe components remain Stripe-controlled and may require identity, business representative documents, payout banking and Stripe ToS interactions; disclose Stripe as a separate payment services provider and assess exact data-controller roles with counsel. Do not copy KYC scans, payment card data, PAN/CVV, bank passwords or full Stripe sensitive user metadata into Convex. Account-session client secrets must be ephemeral, TLS-only and never stored or logged. Keep the stored transaction snapshot to the minimal data required for tax reconciliation, refunds, legal retention and support. Guest's downloadable confirmation carries an opaque order reference and safe restaurant contact, not full internal Stripe IDs, unredacted data or restaurant bank details. Review purpose-specific retention and backup handling before implementing email confirmation/tickets.
