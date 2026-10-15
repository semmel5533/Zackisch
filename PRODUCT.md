# Product scope and commitments

<!-- impeccable:product-schema 1 -->

## Platform

Web (Next.js, Cloudflare Pages & Workers, Convex Realtime Backend)

## Users and Target Groups

Zackisch is a digital ordering and payment platform for hospitality operators, restaurant staff, guests, and operational team members:
- **Guests:** Scan QR codes and order/pay directly on their smartphones without downloading an app. Immediate digital confirmation receipt with direct download.
- **Restaurant Operators:** Manage digital menus, categories, extras/options, prices, table/pickup QR codes, and availability in the merchant dashboard.
- **Service & Kitchen Staff:** Real-time kitchen terminal display and order status updates on a dedicated tablet session.
- **Zackisch Regional Admins & Staff:** Operative control in `adminapp` over regional restaurants, orders, staff permissions, partner commissions, and No-Code newsletter campaigns.

## Product Purpose

App-less QR ordering and payment alongside the restaurant's existing POS workflow, with fair pay-as-you-earn pricing and localized regional administration.

## Commercial Terms and Capabilities

- **Zero Base Fee & Zero Setup Fee:** Free registration and setup.
- **2% Zackisch Platform Fee per Order:** Operators pay only 2% per successful order, plus variable payment provider fees.
- **50% Partner Commission:** Regional sales partners receive 50% of the platform fee (1% GMV) for referred restaurants.
- **Stripe Connect Integration:** Direct merchant payouts via Stripe Connect Standard.
- **Google Workspace Sole Email Infrastructure:** Automated transactional and newsletter emails sent via Google Workspace SMTP (`noreply@zackisch.com`), with RFC 8058 one-click unsubscription.
- **Operative HQ (`adminapp`):** No-Code newsletter editor, double opt-in subscriber management, email logs, regional partner ledgers, and tamper-resistant audit logs.

## Brand Commitments

- **Name:** Zackisch (`https://zackisch.com`, `https://app.zackisch.com`, `https://admin.zackisch.com`)
- **Canonical Assets:** `brand_mark` (symbol only) and `combination_mark` (symbol + wordmark).
- **Design System:** Poppins for primary typography, Inter for tabular numbers/monetary values, monochrome black/white palette with pill-shaped action buttons and rounded cards.
- **Contact:** `selim@zackisch.com` (personal and founder support).
- **Academic Partnership:** MARS Center for Entrepreneurship at TH Mannheim.

## Architecture and Regional Isolation

- **Shared Backend:** Single reactive Convex backend in `webapp/convex/` serving `website/`, `webapp/`, and `adminapp/`.
- **Regional Scoping:** Team members and restaurant records are bound to their assigned operational region (starting with Germany `de`). Cross-regional access requires explicit administrative authorization.
- **Security & Guest Privacy:** Guest endpoints are scoped and stripped of internal organization IDs, owner IDs, Stripe keys, and internal platform fees. Authentication uses cryptographically secure tokens.
