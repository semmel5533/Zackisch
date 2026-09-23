"use client";

import { useState } from "react";
import { PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { useTranslation } from "@/lib/i18n";
import { SpinnerGap } from "@phosphor-icons/react";

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
      <SheetFooter className="shrink-0">
        {error && (
          <p role="alert" className="w-full text-left text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={!isReady || isProcessing} className="w-full">
          {isProcessing && <SpinnerGap data-icon="inline-start" className="size-5 animate-spin" />}
          {isProcessing ? t("processingPayment" as any) : t("orderAndPay" as any)}
        </Button>
      </SheetFooter>
    </form>
  );
}
