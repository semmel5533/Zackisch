# Zackisch product context

<!-- impeccable:product-schema 1 -->

## Platform

Web. Four Next.js 16 / React 19 applications targeting Cloudflare Workers through vinext; one Convex backend under `app/convex`.

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

## Root website direction contract

THESIS: The menu does more while the operator remains the host. Explain discovery, relevant additions and voluntary tips through few meaningful words, then show how the existing POS and team remain central.

OWN-WORLD: Original black primary wordmark, League Spartan, white canvas and Citron. Oversized editorial type, generous space and real color hospitality photography without optional stock captions. Signet only for constrained positions. No invented product images.

STORY: Understand the optional QR route for table service or counter pickup in the hero; recognize competing table requests and counter ordering/payment/pickup queues; discover popular items, complementary recommendations and optional tips; understand venue control, staff/POS handoff and the existing personal-service/cash option for guests who prefer it or cannot use a smartphone; understand payment-linked fees without a monthly base fee, seasonal suitability and setup; ask questions or contact the founder; register.

FIRST VIEWPORT: Centered single-color display headline, one short explanation and primary signup action above one large real photograph of café guests holding a smartphone. No statistic, feature dump or decorative signet.

FORM: Header/footer region-language dialog triggers show the native country name; the header pill matches the login control and forms a group with it at a 12px gap while the footer retains its Citron treatment; dialog options stack native country/language names. A fictional venue-logo carousel headed “Demo-Lokale” / “Demo venues” runs below the hero with pause and reduced-motion support. The personal email section has a bottom separator and is right-aligned, with an underline on hover/focus instead of an arrow. A three-column primary Citron footer puts the country trigger above unheaded navigation, followed by help and legal groups, and ends with a translucent full-width unchanged wordmark and minimal bottom space. Three progressively stronger Citron product chapters stack during desktop scrolling, each with one core message and an explicitly textual screenshot placeholder. On mobile and reduced motion, they remain sequential. A visible-default photographic scroll entrance introduces the page. Code-led implementation; seed:48372546b412a709 is the original recorded workflow reference; current composition follows the user's explicit new brief.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
