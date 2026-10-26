"use client";

import { useState } from "react";
import {
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function CheckoutForm({ returnUrl }: { returnUrl: string }) {
  const checkoutState = useCheckoutElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    if (checkoutState.type !== "success") return;

    const { checkout } = checkoutState;
    setIsProcessing(true);
    setError(null);

    try {
      const confirmResult = await checkout.confirm();

      if (confirmResult.type === "error") {
        setError(confirmResult.error.message || t("paymentFailed"));
        setIsProcessing(false);
      } else if (confirmResult.type === "success") {
        const sessionId = confirmResult.session.id;
        const nextUrl = new URL(returnUrl, window.location.origin);
        nextUrl.searchParams.set("session_id", sessionId);
        window.location.href = nextUrl.toString();
      }
    } catch {
      setError(t("paymentFailed"));
      setIsProcessing(false);
    }
  };

  const isReady =
    checkoutState.type === "success" && checkoutState.checkout.canConfirm;

  return (
    <form onSubmit={handleSubmit} className="guest-checkout-form">
      <div>
        {checkoutState.type === "loading" && (
          <p role="status">{t("loading")}</p>
        )}
        {checkoutState.type === "error" && (
          <p role="alert" className="guest-option-error">
            {t("paymentFailed")}
          </p>
        )}
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      <div className="guest-checkout-form">
        {error && (
          <p role="alert" className="guest-option-error">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          variant="primary"
          fullWidth
          disabled={!isReady || isProcessing}
          loading={isProcessing}
        >
          {isProcessing ? t("processingPayment") : t("orderAndPay")}
        </Button>
      </div>
    </form>
  );
}
