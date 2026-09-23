# Product scope and commitments

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

zakkig is a web product for restaurant operators, kitchen/service staff, and guests. Guests order and pay on their own phones without an app download. Operators manage the menu, QR entry points, and orders; staff use a browser terminal. Direct registration is the marketing site's primary conversion ([marketing page](website/components/MainPage.tsx), [web app routes](webapp/app/)). The intended model runs alongside the restaurant's existing POS, with manual entry into that POS. This is an operating assumption, not a legal conclusion.

## Product Purpose

QR ordering and payment alongside the restaurant's existing workflow, with direct registration as the main marketing conversion ([marketing page](website/components/MainPage.tsx), [web app routes](webapp/app/)).

## Capabilities and Constraints

The stated commercial offer is no setup fee, no monthly base fee, a 2% zakkig platform fee per order, and variable provider fees ([marketing messages](website/lib/translations.ts), [fee calculation](webapp/lib/platform-fee.ts)). The web app implements owner menu editing, table/pickup guest menus, Checkout Sessions with Payment Element, a staff order board, availability changes, printable QR views through browser print, and CSV order export ([dashboard routes](webapp/app/%28dashboard%29/), [guest checkout](webapp/components/guest/cart-sheet.tsx), [staff shell](webapp/components/staff/staff-terminal-shell.tsx), [CSV action](webapp/actions/order-actions.ts)). Historical orders store their computed platform fee, but the CSV calculates a *new estimated* provider fee; it is not a reconciliation report ([orders schema](webapp/convex/schema.ts), [CSV action](webapp/actions/order-actions.ts)).

The preferred journey is restaurant registration, Stripe onboarding, menu and table setup, QR print, guest checkout, paid order creation, manual kitchen progression, then POS entry ([sign-up](webapp/app/%28auth%29/sign-up/page.tsx), [Stripe actions](webapp/actions/stripe-actions.ts), [order lifecycle](webapp/convex/orders.ts)). The current source does not establish production deployment, successful live payment, emailed guest receipt, or POS integration. [Architecture](docs/architecture.md) traces the implemented flow; [audit](docs/documentation-audit.md) lists material gaps.

## Brand Commitments

Keep the predominantly white visual language, black setup and footer, Poppins words and Inter numeric digits, restrained spacing and copy, and real product captures. The shared 4px grid, black primary/bordered outline action hierarchy, readable field boundaries, and 12px field/20px card geometry are product consistency choices ([design reference](DESIGN.md), [implementation detail](docs/design-system.md)). The hero uses a taped QR sheet and the closing section retains the squirrel mascot ([website components](website/components/)). [UX research](docs/ux-research.md) supports clear actions and accessible interaction but does not establish a conversion benefit from exact tokens. Do not invent zakkig metrics or testimonials. Contact is `selim@zakkig.com`; the current MARS support destination is [MARS](https://launchtomars.de/startup/zakkig/) ([marketing page](website/components/MainPage.tsx)). The GTC page retains a finalization notice ([legal messages](website/lib/legal-translations.ts)).

## Evidence on Hand

The current hero uses a taped QR sheet and product captures from the [isolated fixture](webapp/tools/marketing-demo/); the website includes [German and English locale routes](website/lib/regions.ts). Source-backed behavior and limits are in the [architecture guide](docs/architecture.md).

## Open Decisions

The GTC remains pending finalization ([legal messages](website/lib/legal-translations.ts)). The following requirements need product decisions or external review.

## Requirements pending implementation or external review

Merchant accounting, monthly fee invoices, any platform tax reporting, POS/TSE treatment, receipt wording, and related contract terms need product/legal review before being presented as operating controls. The repository has a limited CSV export, not monthly invoice or reporting automation ([CSV action](webapp/actions/order-actions.ts), [gap register](docs/documentation-audit.md#open-implementation-gaps)). Forced 3D Secure, custom statement descriptors, refund flow, and checkout IP rate limits are also not established by this codebase ([Stripe implementation](webapp/convex/stripe.ts), [gap register](docs/documentation-audit.md#open-implementation-gaps)). These remain requirements to decide and build, not shipped claims.

## Revenue evidence

The benefits section pairs potential service efficiency with an attributed industry example: [Microsoft reports up to 30% higher revenue for me&u](https://news.microsoft.com/en-au/features/meu-helps-grow-revenues-for-hospitality-operators-and-provide-better-experiences-for-customers/) (source reviewed 2026-09-21). This is neither a measured zakkig outcome nor a guarantee. The source describes features beyond this product, so its outcome cannot be assumed to transfer. Keep the source adjacent to the claim in both languages ([benefits content](website/components/MainPage.tsx)).
