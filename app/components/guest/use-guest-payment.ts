"use client";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSessionAction } from "@/actions/checkout-actions";
import { useTranslation } from "@/lib/i18n";
import type { CartItem } from "@/lib/types";
export function useGuestPayment({
  businessId,
  type,
  tableNumber,
  items,
  subtotalCents,
  tipCents,
}: {
  businessId: string;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  items: CartItem[];
  subtotalCents: number;
  tipCents: number;
}) {
  const { t } = useTranslation();
  const [checkoutSession, setCheckoutSession] = useState<{
    clientSecret: string;
    revision: string;
    stripeAccountId?: string;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);
  const requestVersionRef = useRef(0);

  const cartRevision = JSON.stringify({
    items,
    type,
    tableNumber,
    businessId: businessId,
    tipCents,
    email: sendEmailConfirmation ? email.trim() : undefined,
  });

  const [previousRevision, setPreviousRevision] = useState(cartRevision);
  if (previousRevision !== cartRevision) {
    setPreviousRevision(cartRevision);
    setCheckoutSession(null);
    setCheckoutError(null);
  }

  const clientSecret =
    checkoutSession?.revision === cartRevision
      ? checkoutSession.clientSecret
      : null;

  const activeStripeAccountId = clientSecret
    ? checkoutSession?.stripeAccountId
    : undefined;

  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    return activeStripeAccountId
      ? loadStripe(pk, { stripeAccount: activeStripeAccountId })
      : null;
  }, [activeStripeAccountId]);

  useEffect(() => {
    requestVersionRef.current += 1;
    return () => {
      requestVersionRef.current += 1;
    };
  }, [cartRevision]);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const normalizedEmail = email.trim();

    if (sendEmailConfirmation) {
      if (
        !normalizedEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      ) {
        setEmailError(t("emailInvalid"));
        return;
      }

      if (normalizedEmail.length > 100) {
        setEmailError(t("emailTooLong"));
        return;
      }
    }

    setEmailError(null);
    setCheckoutError(null);
    submittingRef.current = true;
    const requestVersion = requestVersionRef.current;
    startTransition(async () => {
      try {
        const result = await createCheckoutSessionAction({
          businessId: businessId,
          type,
          tableNumber,
          items,
          total: subtotalCents,
          tipCents,
          email: sendEmailConfirmation ? normalizedEmail : undefined,
        });

        if (requestVersion !== requestVersionRef.current) return;

        if (result.error) {
          setCheckoutError(result.error);
        } else if (result.clientSecret && result.stripeAccountId) {
          setCheckoutSession({
            clientSecret: result.clientSecret,
            revision: cartRevision,
            stripeAccountId: result.stripeAccountId,
          });
        } else {
          setCheckoutError(t("paymentFailed"));
        }
      } catch {
        if (requestVersion === requestVersionRef.current)
          setCheckoutError(t("paymentFailed"));
      } finally {
        submittingRef.current = false;
      }
    });
  };

  return {
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
  };
}
