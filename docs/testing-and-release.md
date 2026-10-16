# Testing, reviews, release criteria and reproducible evidence

## Testing strategy

Testing is cross-application because the critical merchant and guest workflows cross origins and backend boundaries. Unit tests prove small policies; integration tests prove real Convex and Stripe contracts in nonproduction; end-to-end tests prove browser paths; manual accessibility and physical QR tests cover real-world blind spots. A green smoke test with mock screens is **not** equivalent to a tested live flow.

## Minimum quality gates by application

| Target | Required automated checks | Required live-preview/manual checks |
| --- | --- | --- |
| `root/` | Typecheck, lint, Cloudflare Workers/vinext static-page build, locale/link/meta/translation tests, axe | German and English desktop/mobile, no invented claims, CTA to app/help, legal page navigation |
| `app/` | Typecheck, lint, unit/Convex tests, Cloudflare/vinext build & dry-run, mocked/Stripe test-mode integration | Self-registration, Stripe test onboarding, wizard, staff pairing, QR print, guest paid-order simulation, outage recovery |
| `support/` | Typecheck, lint, worker build, article/locale completeness, search, security unit/integration | Public search without login, secure existing-account ticket, reply from internal, attachment policy, locale crosslinks |
| `internal/` | Typecheck, lint, worker build, ops role/policy tests, newsletter/partner regression | 2FA, region context, ticket queue/notes/replies, existing staff/admin/newsletter/audit screens |
| `app/convex/` | Schema validation, auth/region/org policy truth tables, idempotency/payment logic, storage permissions | Staging deployed functions, provider signature, failure/retries, small data sets |

Use existing `npm` and package scripts rather than inventing success via `npm run lint` where a broken old `next lint` script exists; fix/modernize commands as needed. Keep lockfiles reproducible and verify all four manifest names. E2E should be runnable on nonproduction/preview base URLs and from CI with harmless fixtures.

## Cross-application E2E scenario list

1. **Owner eligibility + signup:** visit German homepage, understand price/POS, pass prerequisites, sign up and land in persistent wizard with same identity.
2. **Wizard persistence:** complete only menu, refresh/new browser session, identify blocked payment, continue from last step; no green readiness if prerequisites missing.
3. **Staff tablet:** pair with short-lived secure code, receive test order, status change, reconnect; revoked token cannot resume.
4. **QR:** print one table and pickup code, independently decode generated output and verify route, venue, table. Every table different; PDF at actual-size.
5. **Guest mobile checkout:** browse menu without account, select options, see clear total/payment CTA, Stripe test payment succeeds and exactly one order enters staff queue; appropriate success/tracker state.
6. **Payment failures:** changed price, unavailable item, declined card, delayed webhook, duplicate webhook, canceled payment, repeated button tap and connectivity loss never double-charge/double-order.
7. **Merchant existing POS fallback:** if Zackisch unavailable, UI doesn't claim offline digital orders; manual service and reconciliation guidance accessible in help.
8. **Public support:** search German/English article, follow instructions/context deep-link, no login required for help; private ticket path requires login.
9. **Cross-site merchant auth:** authenticate once via secure supported flow, open support ticket as same user, logout/revoke and confirm both origins enforce current session; no open redirect.
10. **Ticket/Team Dashboard:** create ticket for org A, authorized regional agent replies, customer sees only public message and status; internal note stays private and another org cannot access.
11. **Ops regression:** 2FA, organizations, orders, partner ledger, newsletter creation/DOI, email log and audit work as before; role-restricted ops user denied unauthorized actions.
12. **Region isolation:** org and regional admin from Germany cannot read/modify synthetic Austria/Switzerland fixtures or other German org unless explicit legal role grants; attempt tampered IDs and direct Convex endpoints.
13. **Accessibility:** keyboard-only control of forms/checkout/dialogs, screen-reader labels and errors, zoom/reflow, focus not obscured, reduced motion, target sizes and genuine contrast.
14. **Output/privacy:** no sensitive Stripe fields, tokens or admin notes in guest DOM/RSC/JSON/logs; no private ticket pages indexed.
15. **Deployment:** Cloudflare Workers preview of all four apps, including prerendered/static root, with correct env/host allowlists and no runtime missing Node APIs.

## Security and independent review

Run the official Cloudflare `security-audit` skill on the whole repository after architecture/security work, with scoped sandbox, validated coverage ledger and independent finding verification. It is not a certification. Run code quality/correctness review with current Cursor `thermos` plugin (or exact audited skill without Cursor). Its default review may be diff-scoped; supplement with **whole-repo** module review for giant files, dead code, security boundaries, naming and dependency drift. Use independent reviewers where supported to reduce self-confirmation; verify findings with actual repro before declaring vulnerability. Remediate and rerun targeted tests plus full regression. Explicit tooling setup is in the handoff workbook `agent-work/tool-setup.md`, not a permanently retained repo file.

## Accessibility release gate

WCAG 2.2 AA as independent quality target; `axe-core` and static linting can identify some failures only. Record keyboard route audit, color contrast matrix, VoiceOver/NVDA sanity, focus management, forms validation, responsive reflow and pinch/zoom compatibility. Prioritize guest payment and merchant sign-up as consumer-critical. Legal BFSG scope requires separate counsel decision.

## Performance

At minimum gather lab tests at representative network/device conditions and field Core Web Vitals when available. Aim p75 LCP <=2.5s, INP <=200ms and CLS <=0.1; treat targets as measured quality objectives, not unsupported availability SLA. Staff responsiveness at high order volume and older tablet/browser support are operational budgets; decide thresholds from representative trial.

## Test evidence format

Each run records code commit SHA, command, tool version, target env/region, date, high-level fixture, pass/fail/skipped/blockers, output artifact reference, and remediation commit/retest result. Do not include credentials, payment instrument numbers, unredacted customer data or sensitive vulnerability PoCs in public reports. Retain evidence in CI artifacts/private audit storage per policy rather than cluttering canonical docs with stale checklists.

## Explicit no-go conditions

- Confirmed exploitable critical/high security flaw not fixed and independently retested.
- Cross-org/region ticket, order or file access allowed, or staff note leaked.
- Paid order not reliably reconciled to verified provider event; double-charge risk.
- Unsupported claims on pricing/third-party fees or actual POS replacement.
- Core registration/wizard/checkout/staff/support flow unimplemented or blocked with no declared evidence.
- Convex backup or production restore asserted without actual verification; destructive test on production.
- Multiple conflicting current-state docs, stale active domains, broken build/test/preview, unapproved major version bump.
- Incomplete legal review falsely represented as compliance certification.

## Release report format

Provide: implementation summary; actual deployed/preview paths; current package versions; link to code diffs/commits; commands/results; UX/accessibility findings; Cloudflare security-audit outcome (`confirmed`, `needs_validation`, `rejected`); Thermos review and fixes; end-to-end recording/result; backup schedule verified status and restore exercise outcome; evidence of current docs; unresolved external approvals; explicit GO/NO-GO recommendation. Do not mark GO without meeting all mandatory technical gates and required human approvals.

## Germany-specific hard-stop gates

Do not enable live payment traffic solely because code/tests pass. Require (a) real Stripe Connect connected-account readiness, payment fee and payout policy, signed/legal merchant-of-record designation, (b) qualified German legal sign-off of merchant B2B Terms/DPA/privacy and consumer ordering disclosures, ZAG/P2B/DSA/DAC7 applicability assessment, (c) tax/fiscalization sign-off for German 7/19 food/drink VAT, Zackisch taxable 2% fee, Stripe supplier invoices, receipt/TSE/DSFinV-K classification and invoice/e-invoice/retention, (d) verified vendor DPA/third-country transfer and consent system, (e) executed German legal/payment E2E cases documented in `agent-work/legal-and-finance-checklist.md` (which is an external delivery plan and must not remain in the final repository). The passed release report must link to evidence without committing confidential agreements or real personal data.
