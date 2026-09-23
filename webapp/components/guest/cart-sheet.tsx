"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CircleNotch, X, Check } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSessionAction } from "@/actions/checkout-actions";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { CheckoutForm } from "./checkout-form";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Organization } from "@/lib/types";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  initialSendEmailConfirmation?: boolean;
  initialEmail?: string;
  onOrderSuccess: (orderId: string, orderNumber: string) => void;
}

function formatAddressLines(address?: string): string[] {
  if (!address || !address.trim()) return [];
  if (address.includes("\n")) {
    return address
      .split(/[\r\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (address.includes(",")) {
    return address
      .split(/,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [address.trim()];
}

export function CartSheet({
  open,
  onOpenChange,
  organization,
  type,
  tableNumber,
  initialSendEmailConfirmation = false,
  initialEmail = "",
  onOrderSuccess,
}: CartSheetProps) {
  const { t, locale } = useTranslation();
  const { items, total } = useCartStore();
  const [checkoutSession, setCheckoutSession] = useState<{ clientSecret: string; revision: string } | null>(null);
  const [email, setEmail] = useState(initialEmail);
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(initialSendEmailConfirmation);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const emailRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const requestVersionRef = useRef(0);
  const cartRevision = JSON.stringify({ items, type, tableNumber, organizationId: organization.$id });
  const clientSecret = open && checkoutSession?.revision === cartRevision ? checkoutSession.clientSecret : null;
  const [stripePromise] = useState(() => {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  });

  useEffect(() => {
    requestVersionRef.current += 1;
    setCheckoutSession(null);
    setCheckoutError(null);
  }, [open, cartRevision]);

  async function onContinueToPayment(formData: FormData) {
    if (submittingRef.current) return;
    const rawEmail = formData.get("email") as string;
    const normalizedEmail = rawEmail?.trim() ?? "";

    if (sendEmailConfirmation) {
      if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        setEmailError(t("emailInvalid"));
        emailRef.current?.focus();
        return;
      }

      if (normalizedEmail.length > 100) {
        setEmailError(t("emailTooLong"));
        emailRef.current?.focus();
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
          organizationId: organization.$id,
          type,
          tableNumber,
          items,
          total: total(),
          email: sendEmailConfirmation ? normalizedEmail : undefined,
        });

        if (requestVersion !== requestVersionRef.current) return;

        if (result.error) {
          setCheckoutError(result.error);
        } else if (result.clientSecret) {
          setCheckoutSession({ clientSecret: result.clientSecret, revision: cartRevision });
        } else {
          setCheckoutError(t("paymentFailed"));
        }
      } catch {
        if (requestVersion === requestVersionRef.current) setCheckoutError(t("paymentFailed"));
      } finally {
        submittingRef.current = false;
      }
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          requestVersionRef.current += 1;
          setCheckoutSession(null);
          setCheckoutError(null);
        }
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto h-[90dvh] max-h-[90dvh] w-full max-w-[500px] gap-0 overflow-hidden rounded-t-[20px] p-0 sm:h-auto sm:rounded-t-[24px]"
      >
        <SheetHeader className="shrink-0 text-left">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-xl font-bold text-foreground tracking-tight leading-tight">
              {t("checkout")}
            </SheetTitle>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                />
              }
            >
              <X className="w-4 h-4" weight="bold" />
              <span className="sr-only">{t("close")}</span>
            </SheetClose>
          </div>
          <div className="flex items-baseline justify-between mt-1.5 w-full">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground">
                {t("total")}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                {t("taxNote")}
              </span>
            </div>
            <Price cents={total()} className="text-base sm:text-lg font-bold text-foreground text-right" />
          </div>
        </SheetHeader>

        {!organization.stripeOnboardingComplete ? (
          <div className="flex-1 px-5 py-5 sm:px-6">
            <p className="w-full text-left text-sm font-medium text-destructive">
              {t("onlineOrderingUnavailable" as any)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("onlineOrderingUnavailableDesc" as any)}
            </p>
          </div>
        ) : !clientSecret ? (
          <form action={onContinueToPayment} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      name="sendEmailConfirmation"
                      checked={sendEmailConfirmation}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSendEmailConfirmation(checked);
                        if (!checked) {
                          setEmailError(null);
                        } else {
                          setTimeout(() => emailRef.current?.focus(), 50);
                        }
                      }}
                      className="peer sr-only"
                    />
                    <div className="size-5 rounded-[6px] border border-border bg-background flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                      {sendEmailConfirmation && (
                        <Check weight="bold" className="size-3.5 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {t("sendConfirmationEmailCheckbox")}
                  </span>
                </label>

                {sendEmailConfirmation && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground sr-only">
                      {t("emailForReceipt")}
                    </Label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError(null);
                        setCheckoutError(null);
                      }}
                      placeholder={t("emailPlaceholder")}
                      maxLength={100}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? "checkout-email-error" : undefined}
                      required={sendEmailConfirmation}
                    />
                    {emailError && (
                      <p id="checkout-email-error" role="alert" className="w-full text-left text-sm font-medium text-destructive">
                        {emailError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">
                  {t("buyingFrom")}
                </p>
                <p className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {organization.name}
                </p>
                {organization.address?.trim() && (
                  <div className="text-xs text-muted-foreground space-y-0.5 pt-0.5">
                    {formatAddressLines(organization.address).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("paymentDisclaimerPrefix")}
                <a
                  href={t("zakkigUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {t("zakkigHost")}
                </a>
                {t("paymentDisclaimerSuffix")}{" "}
                {t("agreeToTermsPrefix")}
                <a
                  href={t("termsUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  {t("termsGtc")}
                </a>
                {t("agreeToTermsMiddle")}
                <a
                  href={t("privacyUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  {t("privacyPolicy")}
                </a>
                {t("agreeToTermsSuffix")}
              </p>
            </div>
            <SheetFooter className="shrink-0">
              {checkoutError && (
                <p role="alert" className="w-full text-left text-sm font-medium text-destructive">
                  {checkoutError}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending && <CircleNotch data-icon="inline-start" className="size-5 animate-spin" />}
                {isPending ? t("loading") : t("continueToPayment")}
              </Button>
            </SheetFooter>
          </form>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
              <CheckoutElementsProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                  elementsOptions: {
                    appearance: { theme: "stripe" },
                  },
                }}
              >
                <CheckoutForm returnUrl={t(type === "dine-in" ? "tableSuccessUrl" : "pickupSuccessUrl", { organizationId: organization.$id })} />
              </CheckoutElementsProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
