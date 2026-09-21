# Marketing website

The bilingual restaurant-operator website uses Next.js static export for Cloudflare Pages. The primary conversion is registration at app.zakkig.com. Run `npm run dev` here for port 3000; `npm run build` produces `out/`. `npm run typecheck` checks TypeScript.

## Layout and localization

`MainPage` composes the paper QR hero, ordering flow, setup, pricing, FAQ and footer. `globals.css` contains the marketing tokens and responsive layouts; the canonical visual rules are in the root `DESIGN.md`.

German and English live at `/de-de` and `/de-en`. The locale dialog stores the selected preference and retains the active legal route. All text and URL messages are exposed through next-intl in `lib/i18n.ts`. Core, landing, legal and long-form privacy messages are separated for maintenance. Legal text was moved without changing the privacy policy's substance. The GTC page still carries the existing pending-finalization notice.

## Real product images

`public/product/` contains German and English WebP captures of the actual webapp components. The source fixture is `webapp/tools/marketing-demo/`; it is outside the application routes and has no live backend access. Start it from webapp with:

```sh
node node_modules/vite/bin/vite.js --config tools/marketing-demo/vite.config.ts
```

Use `http://127.0.0.1:4174/?lang=de` or `?lang=en`, a 390 × 740 viewport, select the Favourites category to scroll to its photos, and capture the menu with its seeded cart item. Open the cart and then checkout for the second capture. Do not submit payment; all mutation adapters are disabled. Capture the kitchen at 1200 × 720 using `?screen=kitchen&lang=de` or `en`. Wait for fonts, images and dialog transitions to finish. Export optimized WebP files as `{language}-{scan|pay|kitchen}.webp`. The restaurant photograph and logo in the fixture come from existing project assets.

The QR in the hero is rendered by the existing QR library with square modules and the centered zakkig logo. It is an example linking to app.zakkig.com, not a live table-ordering session.

## Validation

Before shipping, build the static export and inspect German/English pages at desktop, tablet and mobile sizes including 320px. Check: no horizontal overflow, all screenshots loaded, mobile navigation, FAQ expansion, registration and login targets, email/MARS/legal links, locale apply/cancel/Escape, route retention on legal pages, and root preference restoration. Fee calculations have integration tests in `webapp/tests/platform-fee.test.ts`.

## Revenue evidence

The benefits section pairs staff time for service with a clearly attributed industry example: Microsoft reports up to 30% higher revenue for me&u. This is neither a measured zakkig outcome nor a guaranteed result. The source is linked beside the figure in both languages; do not remove this context or turn it into a zakkig performance promise. The source also describes features beyond zakkig's current offering, so outcomes cannot be assumed to transfer.

Source (reviewed 2026-09-21): https://news.microsoft.com/en-au/features/meu-helps-grow-revenues-for-hospitality-operators-and-provide-better-experiences-for-customers/


## Demo image credits

The menu fixture uses Unsplash photographs, downloaded as 400px WebP assets:
- Burrata: https://unsplash.com/photos/a-white-plate-topped-with-lots-of-different-types-of-vegetables-BfV7PSGpbqc
- Lemonade, Olga Tutunaru: https://unsplash.com/photos/clear-drinking-glass-with-lemon-juice-y_tIrc1Y7eI

These images illustrate fictional menu items. The Next Image stand-in honors fill sizing so captures preserve the real product layout.
