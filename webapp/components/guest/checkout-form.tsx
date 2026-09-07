"use client";

import { useState } from "react";
import { PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { SpinnerGap } from "@phosphor-icons/react";
import { toast } from "sonner";

export function CheckoutForm({ returnUrl }: { returnUrl: string }) {
  const checkoutState = useCheckoutElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (isProcessing) return;
    if (checkoutState.type !== "success") return;

    const { checkout } = checkoutState;
    setIsProcessing(true);

    try {
      const confirmResult = await checkout.confirm();

      if (confirmResult.type === "error") {
        console.error("Stripe Checkout confirmation failed:", confirmResult.error);
        toast.error(confirmResult.error.message || t("paymentFailed" as any));
        setIsProcessing(false);
      } else if (confirmResult.type === "success") {
        const sessionId = confirmResult.session.id;
        const baseReturnUrl = returnUrl || `${window.location.origin}/to-go/success`;
        const separator = baseReturnUrl.includes("?") ? "&" : "?";
        window.location.href = `${baseReturnUrl}${separator}session_id=${sessionId}`;
      }
    } catch (err: any) {
      console.error("Payment confirmation error:", err);
      toast.error(err?.message || t("error"));
      setIsProcessing(false);
    }
  };

  const isReady = checkoutState.type === "success" && checkoutState.checkout.canConfirm;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button 
        type="submit" 
        size="lg"
        onClick={handleSubmit}
        disabled={!isReady || isProcessing} 
        className="w-full rounded-full font-bold h-12 text-base shadow-md cursor-pointer"
      >
        {isProcessing ? <SpinnerGap className="mr-2 h-5 w-5 animate-spin" /> : null}
        {isProcessing ? t("processingPayment" as any) : t("orderAndPay" as any)}
      </Button>
    </form>
  );
}
