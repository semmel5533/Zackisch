"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LocalizedText } from "@/components/ui/localized-text";
import { SpinnerGap } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cart-store";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { getOrderBySessionAction } from "@/actions/checkout-actions";

export function PaymentSuccessPoller({
  sessionId,
  paymentIntentId,
  businessId,
  type,
}: {
  sessionId?: string;
  paymentIntentId?: string;
  businessId: string;
  type: "takeaway" | "dine-in";
}) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const { t } = useTranslation();
  const [timedOut, setTimedOut] = useState(false);

  const stripeIdentifier = sessionId || paymentIntentId || "";

  // Reactive subscription to order created via webhook
  const order = useQuery(api.orders.getOrderByPaymentIntent, {
    stripePaymentId: stripeIdentifier,
  });

  // If webhook is delayed or in local development, verify directly with Stripe via Server Action
  useEffect(() => {
    if (order === null && stripeIdentifier) {
      const timer = setTimeout(() => {
        getOrderBySessionAction(stripeIdentifier, businessId).catch(console.error);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order, stripeIdentifier, businessId]);

  useEffect(() => {
    if (order) {
      clearCart();
      toast.success(t("orderPlaced" as any));

      if (type === "takeaway") {
        router.replace(`/pickup/${businessId}?order=${order._id}`);
      } else {
        router.replace(`/table/${businessId}?table=${order.tableNumber || ""}&order=${order._id}`);
      }
    }
  }, [order, businessId, type, router, clearCart, t]);

  // Fallback safety timeout (45s) in case webhook fails completely
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!order) {
        setTimedOut(true);
        toast.error(t("error"));
        router.replace(`/${type === "takeaway" ? "pickup" : "table"}/${businessId}`);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [order, businessId, type, router, t]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center space-y-4 p-6 bg-background">
      <SpinnerGap className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">
        <LocalizedText tKey="processingPayment" />
      </p>
    </div>
  );
}
