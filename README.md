# zakkig

zakkig is a QR ordering and payment product for restaurants. Guests use their own phones for table or pickup orders; operators manage the menu and orders in the web app. The intended operating model keeps the restaurant's existing POS workflow, with manual POS entry. The commercial offer is no setup or monthly base fee, a 2% zakkig fee per order, and variable payment provider fees. These are product and marketing commitments, not a certification of tax treatment or live deployment. See [product scope](PRODUCT.md), [website implementation](website/README.md), and [web app implementation](webapp/README.md).

## Repository map

| Path | Responsibility | Evidence |
| --- | --- | --- |
| `website/` | German and English marketing and legal pages; Next.js static export to `out/`. | [website config](website/next.config.ts), [website routes](website/app/%5Blocale%5D/page.tsx) |
| `webapp/` | Owner dashboard, guest ordering, staff terminal, Server Actions, and Convex backend. Local Next build and separate vinext Worker build. | [webapp scripts](webapp/package.json), [Worker config](webapp/wrangler.jsonc) |
| `webapp/convex/` | Schema, queries, mutations, actions, storage, and Stripe webhook. | [schema](webapp/convex/schema.ts), [HTTP router](webapp/convex/http.ts) |
| `webapp/tests/` | Isolated backend, fee, and translation checks. | [test configuration](webapp/vitest.config.ts) |

The [architecture guide](docs/architecture.md) explains request flows, authorization boundaries, data, environment ownership, and operational limits. The [documentation audit](docs/documentation-audit.md) records differences found between prior claims and source behavior. [DESIGN.md](DESIGN.md) is the design reference; [AGENTS.md](AGENTS.md) contains repository working rules.

## Local development

Install and run each application independently. Use Node and npm versions compatible with the committed lockfiles; each app has its own `package-lock.json` and scripts ([webapp](webapp/package.json), [website](website/package.json)). Start Convex separately for web app backend development ([Convex functions](webapp/convex/)). The web app's [environment example](webapp/.env.example) is a template, not a deployment manifest; [environment ownership](docs/architecture.md#configuration-and-builds) distinguishes Worker, build-time, and Convex values. The website currently has no `.env.example` and no application environment reads in its source.

```sh
cd webapp
npm ci
npx convex dev
# In another terminal from webapp:
npm run dev -- --port 3001

cd ../website
npm ci
npm run dev
```

The website script uses port 3000; the web app's default `next dev` also uses 3000, so the example moves the web app to 3001 ([scripts](website/package.json), [webapp scripts](webapp/package.json)). `npx convex dev` needs a configured Convex deployment. Set real secrets in their deployment environments; do not commit them.

For repository agent work, use Astra for planning and analysis and Sol for implementation and routine checks. Start command sessions with a fresh environment (`inheritEnv: false` where supported). On the Nix-based local host, an equivalent shell invocation preserves only the needed identity variables and explicitly includes Nix profiles in `PATH`:

```sh
env -i HOME="$HOME" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh \
  PATH="$HOME/.nix-profile/bin:/nix/var/nix/profiles/default/bin:/usr/bin:/bin:/usr/sbin:/sbin" \
  /bin/zsh -c 'git status --short'
```

This is a developer workflow preference, separate from the application runtime and [deployment configuration](docs/architecture.md#configuration-and-builds).

## Build and verification

Run `npm run typecheck` and `npm run build` in each app. The website build emits [static `out/`](website/next.config.ts); the web app's local Next build emits `.next/`, while `npm run build:cloudflare` emits the Worker assets configured in [wrangler.jsonc](webapp/wrangler.jsonc). `npm run check:cloudflare` is a deploy dry run, and `npm run deploy:cloudflare` publishes the Worker ([scripts](webapp/package.json)). Deploying Convex, Workers, or Pages needs separately configured accounts and environments. Neither application's `npm run lint` is currently a working gate: both scripts call `next lint`, which Next 16 removed ([scripts](webapp/package.json), [website scripts](website/package.json)).

On 2026-09-23, both typechecks and the web app's `npm test` passed locally: 29 tests across three files (security, platform fee, translations). This is isolated verification, not a Stripe transaction, cloud deploy, or end-to-end acceptance ([tests](webapp/tests/), [Vitest config](webapp/vitest.config.ts)).

## Product and implementation boundaries

The marketing site uses locale paths `/de-de` and `/de-en`; the web app uses nonlocalized route paths and translated UI text ([website region parser](website/lib/regions.ts), [webapp translation helper](webapp/lib/i18n.ts)). The guest checkout uses Stripe Checkout Sessions with the Payment Element, reprices from the stored menu, and creates paid orders through the webhook or success-page verification path ([guest cart](webapp/components/guest/cart-sheet.tsx), [pricing](webapp/convex/checkoutPricing.ts), [webhook](webapp/convex/http.ts)). The legacy `placeOrderAction` uses a payment placeholder and is not evidence of a completed Stripe payment ([order action](webapp/actions/order-actions.ts)).

Several controls described in older documentation remain gaps, including public Convex authorization and guest data minimization. Read the [gap register](docs/documentation-audit.md#open-implementation-gaps) before treating the current implementation as production-ready. Business and legal requirements in [PRODUCT.md](PRODUCT.md) are explicitly separated from shipped behavior.
