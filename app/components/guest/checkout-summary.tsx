"use client";
import type { PublicRestaurant } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/common/price";
import { CartItems } from "./cart-items";
export function CheckoutSummary({
  business,
  editable,
  totalChargeCents,
  tipCents,
}: {
  business: PublicRestaurant;
  editable: boolean;
  totalChargeCents: number;
  tipCents: number;
}) {
  const { t } = useTranslation();
  return (
    <section aria-label={t("cart")}>
      <h2>{t("cart")}</h2>
      <CartItems editable={editable} />
      <div className="guest-seller">
        <h2>{t("buyingFrom")}</h2>
        <p>
          <strong>{business.legalName || business.name}</strong>
        </p>
        {business.legalName && business.legalName !== business.name && (
          <p>{business.name}</p>
        )}
        {business.address && (
          <p className="guest-address">{business.address}</p>
        )}
        {business.vatId && (
          <p>
            {t("sellerVatId")} {business.vatId}
          </p>
        )}
      </div>
      <p className="guest-total">
        <span>
          {t("total")} · {t("taxNote")}
        </span>
        <Price cents={totalChargeCents} />
      </p>
      {tipCents > 0 && (
        <p>
          {t("guestVoluntaryTip")}: <Price cents={tipCents} />
        </p>
      )}
      <p className="zk-supporting">
        {t("paymentDisclaimerPrefix")}
        <a href={t("zakkigUrl")} target="_blank" rel="noreferrer">
          {t("zakkigHost")}
        </a>
        {t("paymentDisclaimerSuffix")} {t("agreeToTermsPrefix")}
        <a href={t("guestTermsUrl")} target="_blank" rel="noreferrer">
          {t("guestTermsLabel")}
        </a>
        {t("agreeToTermsMiddle")}
        <a href={t("privacyUrl")} target="_blank" rel="noreferrer">
          {t("privacyPolicy")}
        </a>
        {t("agreeToTermsSuffix")}
      </p>
    </section>
  );
}
