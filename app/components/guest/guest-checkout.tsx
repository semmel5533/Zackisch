"use client";
import { useState } from "react";
import { useGuestPayment } from "./use-guest-payment";
import Link from "next/link";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { useCartStore } from "@/store/cart-store";
import { useTranslation } from "@/lib/i18n";
import { guestMenuPath } from "@/lib/guest-paths";
import type { PublicRestaurant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { CheckoutSummary } from "./checkout-summary";
import { CartRecommendations } from "./cart-recommendations";
import { CheckoutForm } from "./checkout-form";
const TIP_OPTIONS = [0, 5, 10, 15] as const;
export function GuestCheckout({
  business,
  type,
  tableNumber,
}: {
  business: PublicRestaurant;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
}) {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);
  const menuPath = guestMenuPath(business.$id, type, tableNumber);
  return (
    <main className="guest-checkout">
      <header>
        <Link href={menuPath} className="guest-back-link">
          {t("guestBackToMenu")}
        </Link>
        <h1>{t("checkout")}</h1>
        <p>
          {business.name} ·{" "}
          {type === "dine-in" && tableNumber
            ? `${t("tableLabel")} ${tableNumber}`
            : t(type === "dine-in" ? "guestDineInContext" : "pickupLabel")}
        </p>
      </header>
      {!business.canOrder ? (
        <p role="alert">{t("onlineOrderingUnavailable")}</p>
      ) : items.length === 0 ? (
        <p>{t("emptyCart")}</p>
      ) : (
        <CheckoutDetails
          business={business}
          type={type}
          tableNumber={tableNumber}
        />
      )}
    </main>
  );
}
function CheckoutDetails({
  business,
  type,
  tableNumber,
}: {
  business: PublicRestaurant;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
}) {
  const { t } = useTranslation();
  const { items, total } = useCartStore();
  const [tipPercent, setTipPercent] = useState<(typeof TIP_OPTIONS)[number]>(0);

  const isTippingEnabled = business.isTippingEnabled !== false;
  const effectiveTipPercent = isTippingEnabled ? tipPercent : 0;

  const subtotalCents = total();
  const tipCents = Math.round((subtotalCents * effectiveTipPercent) / 100);
  const totalChargeCents = subtotalCents + tipCents;
  const {
    email,
    setEmail,
    sendEmailConfirmation,
    setSendEmailConfirmation,
    emailError,
    setEmailError,
    checkoutError,
    setCheckoutError,
    isPending,
    clientSecret,
    stripePromise,
    handleContinueToPayment,
  } = useGuestPayment({
    businessId: business.$id,
    type,
    tableNumber,
    items,
    subtotalCents,
    tipCents,
  });

  return (
    <div className="guest-checkout-grid">
      <CheckoutSummary
        business={business}
        editable={!clientSecret}
        totalChargeCents={totalChargeCents}
        tipCents={tipCents}
      />
      <section aria-label={t("continueToPayment")}>
        {!clientSecret ? (
          <form
            onSubmit={handleContinueToPayment}
            noValidate
            className="guest-checkout-form"
          >
            <CartRecommendations
              businessId={business.$id}
              enabled={business.isUpsellingEnabled !== false}
              checkout
            />
            {isTippingEnabled && (
              <div>
                <ChoiceGroup
                  label={t("guestVoluntaryTip")}
                  value={String(tipPercent)}
                  onChange={(value) => {
                    const next = Number(value);
                    if (TIP_OPTIONS.some((option) => option === next))
                      setTipPercent(next as typeof tipPercent);
                  }}
                  options={TIP_OPTIONS.map((value) => ({
                    value: String(value),
                    label: value === 0 ? t("guestNoTip") : `${value} %`,
                  }))}
                />
                <p className="zk-supporting">{t("guestTipDisclosure")}</p>
              </div>
            )}
            <CheckboxField
              label={t("sendConfirmationEmailCheckbox")}
              checked={sendEmailConfirmation}
              onChange={(checked) => {
                setSendEmailConfirmation(checked);
                setEmailError(null);
              }}
            />
            {sendEmailConfirmation && (
              <TextField
                label={t("emailForReceipt")}
                type="email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setEmailError(null);
                  setCheckoutError(null);
                }}
                placeholder={t("emailPlaceholder")}
                error={emailError}
              />
            )}
            {checkoutError && (
              <p role="alert" className="guest-option-error">
                {checkoutError}
              </p>
            )}
            <Button type="submit" size="lg" fullWidth loading={isPending}>
              {isPending ? t("loading") : t("guestContinueToPay")}
            </Button>
          </form>
        ) : (
          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{
              clientSecret,
              elementsOptions: { appearance: { theme: "stripe" } },
            }}
          >
            <CheckoutForm
              returnUrl={t(
                type === "dine-in" ? "tableSuccessUrl" : "pickupSuccessUrl",
                { businessId: business.$id },
              )}
            />
          </CheckoutElementsProvider>
        )}
      </section>
    </div>
  );
}
