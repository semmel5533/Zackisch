# Zackisch product context

<!-- impeccable:product-schema 1 -->

## Platform

web

Four Next.js 16 / React 19 applications: `www/` deploys to Cloudflare Pages as a static export (`out/`); `app/`, `support/` and `internal/` target Cloudflare Workers through vinext; one Convex backend under `app/convex`.

## Users and purpose

Independent hospitality operators in Germany add optional browser QR ordering/payment to their existing POS. Guests need no app installation or Zackisch account. Staff process verified paid orders and separately acknowledge existing-POS recording. Public help and private business tickets support operation; the internal dashboard has separately authorized personnel roles.

## Commercial and operational facts

Zackisch is Selim Eser's sole proprietorship, currently without employees. Business contact: selim@zackisch.com. Finom is used for business banking; this is not evidence of an API integration. The actual address and tax status remain unconfirmed. Never infer Kleinunternehmer treatment from legal form.

The service fee is 2% of eligible successfully captured restaurant order value, excluding voluntary tips and including any VAT applicable to Zackisch's own fee. Stripe fees are separate. There is no Zackisch setup or monthly base fee. The restaurant remains the seller and is responsible for its lawful receipt/invoice and POS workflow.

## Verified smart-menu functionality

Same-venue order co-occurrence informs cart recommendations, excluding current and unavailable items. The current cart and checkout each request at most two suggestions; checkout offers available low-priced additions (default ceiling EUR 6). Available same-venue items provide a fallback. A virtual most-popular category appears first and ranks historical ordered quantities. Recommendations, popularity and tipping have independent venue toggles. Optional percentage tips start at zero. Ordinary menu/category order remains manually managed; no rolling trend window or personalized guest profile is implemented. Current queries exclude cancelled orders but do not independently filter payment status/test flags; never market them as a verified-paid-only ranking until this is implemented and tested.

## Brand commitments

Use the founder-supplied black wordmark and signet without modifying outlines. `DESIGN.md` is the only visual authority. All new UI uses Impeccable, Mobbin research and Base UI. The website targets owner self-registration at https://app.zackisch.com/sign-up, in German and English for Germany. Only real internet stock photography with verified free commercial usage rights; never AI-generated photos. Product screenshots remain text-labelled placeholders until genuine captures exist. No invented endorsements, metrics or feature claims.

## Product boundaries

Preserve payment, checkout, permissions, ledgers, pairing, partners and newsletter behavior. No replacement POS, guaranteed availability, blanket legal/security certification, fake payment success or hidden platform-charge fallback. Legal text with placeholders is a draft; production release needs actual company/vendor facts and appropriate professional review.

## Source of operating rules

`AGENTS.md` owns engineering, security, legal research, testing and commit rules. Each application's README describes verified implementation. This file provides stable Impeccable product context, not a second implementation plan.

## Public website direction contract (www/)

THESIS: The menu does more while the operator remains the host. Explain discovery, relevant additions and voluntary tips through few meaningful words, then show how the existing POS and team remain central.

OWN-WORLD: Original black primary wordmark, Lexend, white canvas and Citron. Generous responsive typography, strong space and real color hospitality photography without optional stock captions. Signet only for constrained positions. No invented product images.

STORY: Understand the optional QR route for table service or counter pickup in the hero; recognize competing table requests and counter ordering/payment/pickup queues; discover configurable item variants, extras and selection steps, popular items, complementary recommendations and optional tips; understand venue control, staff availability switches for items, steps and options, staff/POS handoff and the existing personal-service/cash option for guests who prefer it or cannot use a smartphone; understand payment-linked fees without a monthly base fee, seasonal suitability and setup; ask questions or contact the founder; register.

FIRST VIEWPORT: Centered single-color display headline, one short explanation and primary signup action above one large real photograph of café guests holding a smartphone on desktop (omitted along with the problem-section photograph on mobile below 800px). No statistic, feature dump or decorative signet.

FORM: Visiting `/` automatically selects `de-de` or `de-en` from browser language preferences and defaults to `de-de` (`Deutschland` / `Deutsch`) when undetermined or unsupported. Header/footer region-language dialog triggers show the native country name; both triggers use equally sized 48px-height, 17px-text pills, ghost in the header and outlined in the footer; the header trigger forms a right-aligned group with ghost help and black login at a 12px gap, while the footer starts with outlined region, help and research pills with a Citron-adapted hover; dialog options stack native country/language names. Icons and arrows inside buttons and links are vertically centered (`align-items: center`, no vertical translation offset) with Lexend text. A localized venue-placeholder carousel headed “Hier könnte dein Lokal auftauchen” / “Your venue could be here” runs below the hero with pause and reduced-motion support. The personal email section has a bottom separator and is left-aligned, with an underline on hover/focus instead of an arrow. A two-column primary Citron footer puts the country trigger above unheaded navigation including help, research and contact, beside the legal group, centers into a single column below 800px, and ends with a full-width opaque black unchanged wordmark and minimal bottom space. Three progressively stronger Citron product chapters stack during desktop scrolling, each with one core message and an explicitly textual smartphone-frame screenshot placeholder. On mobile and reduced motion, they remain sequential. A visible-default photographic scroll entrance introduces the page. The hero registration CTA is Primary Citron; the desktop and mobile login pills are black. Below 1250px, only logo and hamburger remain in the header; a left-sliding Citron drawer with `@starting-style` entry animation contains the four section links (`Funktionen`, `Kosten`, `Fragen`, `Kontakt`) followed by outlined `Hilfe`, outlined `Region & Sprache` and black `Anmelden` in the same order as the desktop header, omitting the registration CTA, without a visible heading and with an upper-right close icon. The centered team section has no photo; a wide text-labelled staff preview grows gently on desktop scrolling and remains full size for mobile and reduced motion. Section navigation scrolls smoothly with focus transfer and clean URLs. Contact and pricing live on the homepage. The expanded hero image aligns with the content container, and a full-width divider closes the header. Centered localized error content without a numeric code retains header/footer and returns to the homepage when changing language. Section links underline on hover; page links use arrows. Other hosts open a new tab with localized accessible notice. Registration CTAs share 19px text and 56px minimum height while compact header/footer/drawer pills share 17px text and 48px minimum height. Code-led implementation; seed:48372546b412a709 is the original recorded workflow reference; current composition follows the user's explicit new brief.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
