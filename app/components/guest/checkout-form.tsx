"use client";

import { useState } from "react";
import { PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { Button } from "@astryxdesign/core/Button";
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
        setError(confirmResult.error.message || t("paymentFailed" as any));
        setIsProcessing(false);
      } else if (confirmResult.type === "success") {
        const sessionId = confirmResult.session.id;
        const nextUrl = new URL(returnUrl, window.location.origin);
        nextUrl.searchParams.set("session_id", sessionId);
        window.location.href = nextUrl.toString();
      }
    } catch {
      setError(t("paymentFailed" as any));
      setIsProcessing(false);
    }
  };

  const isReady = checkoutState.type === "success" && checkoutState.checkout.canConfirm;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      <div className="p-4 border-t border-border shrink-0 bg-background space-y-2">
        {error && (
          <p role="alert" className="w-full text-left text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          variant="primary"
          width="100%"
          label={isProcessing ? t("processingPayment" as any) : t("orderAndPay" as any)}
          isDisabled={!isReady || isProcessing}
          isLoading={isProcessing}
        />
      </div>
    </form>
  );
}
