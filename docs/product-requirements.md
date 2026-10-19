# Functional product requirements and invariants

## 1. Core business invariants

1. **Supplementary to existing POS:** Zackisch complements the restaurant's existing POS and service workflow. Paid orders are entered once into the existing POS with auditable staff confirmation (`recordOrderInPos`).
2. **Guest browser ordering without account/app:** Guests scan a table or pickup QR code and order/pay in their mobile browser without installing an app or registering an account.
3. **Self-service merchant onboarding:** Owners register, configure their business profile and menu, connect Stripe via embedded onboarding, pair a compatible staff tablet, print QR codes, and run a controlled test order.
4. **Transparent 2% fee model:** 0 EUR setup fee, 0 EUR monthly base fee, 2% Zackisch platform fee on the eligible paid order subtotal excluding voluntary tips (including applicable VAT on Zackisch's service fee), plus separate Stripe payment processing fees.
5. **Connected-account Direct Charges:** Payments are processed as Stripe Connect Direct Charges on the merchant's connected Stripe account (`on_behalf_of` / connected account target), with no silent fallback to platform-owned charges.
6. **Non-fiscal guest confirmation:** Guests receive a clearly labeled `Bestell- und Zahlungsbestätigung` (`Dies ist kein Kassenbeleg und keine Rechnung`).
7. **Strict multi-tenant and regional isolation:** Every business, menu, order, staff session, support ticket, partner record, and admin operation is isolated by `businessId` and server-verified `regionId`.

## 2. Smart Menu functional requirements (`app/`)

1. **Three independent per-business toggles:**
   - `smartRecommendationsEnabled` (default `true`): controls post-add complementary item recommendations and pre-checkout cart add-on suggestions.
   - `popularCategoryEnabled` (default `true`): controls the virtual `Beliebteste` / `Most popular` category tab on the guest menu.
   - `tipsEnabled` (default `true`): controls whether voluntary tip options are shown in the guest checkout sheet.
2. **Verified data source:**
   - Recommendations and popularity rankings use **only** orders belonging to the same `businessId` where `paymentStatus === "paid"`, `status !== "cancelled"`, `isTestOrder !== true`, and a verified Stripe payment/session reference exists.
   - Zero guest cross-session tracking, zero third-party cookies, and zero cross-restaurant data pooling (`TDDDG § 25` / `DSGVO Art. 5` data minimization).
3. **Post-add complementary recommendation:**
   - Triggered non-modally after a guest adds an item to the cart when `smartRecommendationsEnabled !== false` and at least one verified co-occurring item (`confidence(A -> B)` / `lift(A -> B)` above support threshold, available, not already in cart) or same-venue category fallback exists.
4. **Pre-checkout cart add-on row:**
   - Shown inside the cart sheet before payment when `smartRecommendationsEnabled !== false`, offering up to 3 lower-priced complementary items not already in the cart.
5. **Virtual `Beliebteste` category (`id: "virtual:popular"`):**
   - Rendered as the first read-only category tab in the guest menu when `popularCategoryEnabled !== false` and sufficient verified paid item volume exists.
   - Never persisted as a mutable `menuCategories` database row and never exposed to category deletion or manual drag-and-drop sorting.
6. **Voluntary tip control:**
   - When `tipsEnabled === false`, the tip selector is hidden in the guest cart/checkout and the server enforces `tipCents = 0`.
   - When `tipsEnabled !== false`, tips default to `0` (`Kein Trinkgeld`) so no optional charge is preselected (`§ 312a Abs. 3 BGB`).
