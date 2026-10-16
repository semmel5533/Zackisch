# Agent Tooling, Skills and Audit Framework

This document records the curated agent tooling, testing frameworks, and audit skills installed and maintained in `.agents/skills/` for the Zackisch codebase.

---

## 1. Curated Skills Inventory

Following a comprehensive utility, redundancy, and freshness audit, the repository maintains exactly 16 verified skills in `.agents/skills/`. All redundant or dead skills (including obsolete Svelte, Vue, Nuxt, Astro, dead Impeccable live-servers, and duplicate Stripe directories) have been removed.

| Skill | Category | Purpose and Usage |
| :--- | :--- | :--- |
| `convex` | Backend Data Layer | Schema design, index strategies, query/mutation design, real-time data sync. |
| `convex-auth` | Authentication | Convex authentication flows, credential management, identity binding. |
| `convex-authz` | Authorization | Role-based and tenant-isolated authorization rules for queries and mutations. |
| `convex-backup` | Data Reliability | Snapshot, backup verification, point-in-time recovery guidance. |
| `convex-deploy-guard`| Release Safety | Pre-deployment schema integrity and migration safety checks. |
| `convex-launch-readiness`| Launch Checklist | Production readiness verification for Convex cloud deployments. |
| `convex-reviewer` | Code Review | Specialized Convex pattern reviewer for query optimization and safety. |
| `convex-test` | Automated Testing | Unit and integration testing strategies using `convex-test`. |
| `e2e` | End-to-End Testing | Headless Chromium browser automation via `@e2e-dev/web` and `e2e` runner. |
| `react-doctor` | Frontend Hygiene | Diagnosing React 19 performance, re-render loops, and hook anti-patterns. |
| `security-audit` | Security & Compliance | Cloudflare Security Audit framework (`validate-coverage-ledger.cjs`, `validate-findings.cjs`). |
| `stripe-best-practices`| Payments | Stripe Connect Direct Charges, application fees, webhook verification. |
| `stripe-docs` | Payment Reference | Official Stripe API reference, parameter definitions, and error schemas. |
| `thermos` | Code Quality Dual Review | Orchestrates dual-pass thermo reviews for security and code quality. |
| `thermo-nuclear-review`| Vulnerability Review | Deep-dive review for regressions, breaking changes, and security defects. |
| `thermo-nuclear-code-quality-review`| Code Architecture | Audit for maintainability, file growth, abstraction leaks, and code hygiene. |

---

## 2. Cloudflare Security Audit Framework

The security audit framework is housed in `.agents/skills/security-audit/`. It adheres to the Cloudflare Security Audit methodology and provides deterministic JSON schema validators:

1. **Coverage Ledger (`validate-coverage-ledger.cjs`):**
   - Validates `docs/security-audit-coverage-ledger.json`.
   - Enforces canonical coverage IDs (`canonicalCoverageId`), lexicographical sorting, assigned review owners, reviewed repository paths, and local check evidence.
   - Command: `node .agents/skills/security-audit/validate-coverage-ledger.cjs docs/security-audit-coverage-ledger.json`

2. **Findings Register (`validate-findings.cjs`):**
   - Validates `docs/security-audit-findings.json` against `report-schema.json`.
   - Requires source-grounded evidence, reproduction instructions, root-cause analyses, remediation strategies, and confidence ratings for all findings.
   - Command: `node .agents/skills/security-audit/validate-findings.cjs docs/security-audit-findings.json`

---

## 3. Cursor Thermos Dual Review

Cursor Thermos performs two complementary passes across git branch diffs:
1. **Security & Correctness:** Checks authorization boundaries, secret exposure, breaking API contracts, and tenant leakage.
2. **Code Quality:** Checks package modularity, design system token compliance, duplicate assets, and dead dependencies.
- Detailed report artifact: [`docs/thermos-review.md`](thermos-review.md).

---

## 4. End-to-End Browser Testing (`tester-army/e2e`)

Browser testing is driven by `e2e` (tester-army) with the `@e2e-dev/web` Playwright-based deterministic engine:
- Configuration: `e2e.config.ts` targeting all 4 application endpoints:
  - `root`: `http://localhost:3000`
  - `webapp`: `http://localhost:3001`
  - `internal`: `http://localhost:3002`
  - `support`: `http://localhost:3003`
- Test files located in `tests/e2e/`:
  - `root-marketing.e2e.ts`: Verifies German/English marketing landing, pricing, POS disclaimers.
  - `support-seo.e2e.ts`: Verifies SSR Knowledge Base, categories, articles, breadcrumbs, and `noindex` on tickets.
  - `internal-admin.e2e.ts`: Verifies internal portal authentication form and `noindex` headers.
  - `webapp-auth.e2e.ts`: Verifies merchant sign-in, multi-step sign-up wizard, and password reset.
