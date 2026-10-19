"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CircleNotch, X, Check, Sparkle } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSessionAction } from "@/actions/checkout-actions";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutForm } from "./checkout-form";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PublicRestaurant } from "@/lib/types";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: PublicRestaurant;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  onOrderSuccess?: (orderId: string, orderNumber: string) => void;
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

const TIP_OPTIONS = [0, 5, 10, 15] as const;

export function CartSheet({
  open,
  onOpenChange,
  business,
  type,
  tableNumber,
}: CartSheetProps) {
  const { t, locale } = useTranslation();
  const isDe = locale.startsWith("de");
  const { items, total, addItem } = useCartStore();
  const [tipPercent, setTipPercent] = useState<(typeof TIP_OPTIONS)[number]>(0);

  const isUpsellingEnabled = business.isUpsellingEnabled !== false;
  const isTippingEnabled = business.isTippingEnabled !== false;
  const effectiveTipPercent = isTippingEnabled ? tipPercent : 0;

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
  const emailRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const requestVersionRef = useRef(0);

  const subtotalCents = total();
  const tipCents = Math.round((subtotalCents * effectiveTipPercent) / 100);
  const totalChargeCents = subtotalCents + tipCents;

  const businessId = (business._id || business.$id) as Id<"businesses">;

  const cartItemIds = useMemo(
    () => items.map((i) => i.menuItemId || i.id).filter(Boolean),
    [items],
  );

  const smartRecommendations = useQuery(
    api.smartMenu.getSmartMenuRecommendations,
    isUpsellingEnabled && open && cartItemIds.length > 0
      ? {
          businessId,
          currentCartItemIds: cartItemIds,
          limit: 3,
        }
      : "skip",
  );

  const checkoutAddons = useQuery(
    api.smartMenu.getCheckoutAddons,
    isUpsellingEnabled && open
      ? {
          businessId,
          currentCartItemIds: cartItemIds,
          limit: 3,
        }
      : "skip",
  );

  const cartRevision = JSON.stringify({
    items,
    type,
    tableNumber,
    businessId: business.$id || business._id,
    tipPercent: effectiveTipPercent,
  });
  const clientSecret =
    open && checkoutSession?.revision === cartRevision
      ? checkoutSession.clientSecret
      : null;

  const activeStripeAccountId =
    checkoutSession?.stripeAccountId;

  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    return activeStripeAccountId
      ? loadStripe(pk, { stripeAccount: activeStripeAccountId })
      : loadStripe(pk);
  }, [activeStripeAccountId]);

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
      if (
        !normalizedEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      ) {
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
          businessId: business.$id,
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
        } else if (result.clientSecret) {
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
            <Price
              cents={totalChargeCents}
              className="text-base sm:text-lg font-bold text-foreground text-right"
            />
          </div>
        </SheetHeader>

        {!business.canOrder ? (
          <div className="flex-1 px-5 py-5 sm:px-6">
            <p className="w-full text-left text-sm font-medium text-destructive">
              {t("onlineOrderingUnavailable" as any)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("onlineOrderingUnavailableDesc" as any)}
            </p>
          </div>
        ) : !clientSecret ? (
          <form
            action={onContinueToPayment}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {/* Frequently Ordered Together (Smart Menu Recommendations) */}
              {isUpsellingEnabled && smartRecommendations && smartRecommendations.length > 0 && (
                <div className="space-y-2.5 pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <Sparkle className="w-4 h-4 text-primary" weight="fill" />
                    <span className="text-sm font-semibold text-foreground">
                      {isDe ? "Häufig zusammen bestellt" : "Frequently ordered together"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {smartRecommendations.map((rec) => (
                      <div
                        key={rec._id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-medium text-foreground truncate">{rec.name}</p>
                          <Price cents={rec.price} className="text-xs font-semibold text-muted-foreground" />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addItem({
                              id: rec._id,
                              menuItemId: rec._id,
                              name: rec.name,
                              price: rec.price,
                            });
                          }}
                          className="shrink-0 h-8 px-3 rounded-full text-xs font-semibold"
                        >
                          + {isDe ? "Hinzufügen" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Small Checkout Add-ons */}
              {isUpsellingEnabled && checkoutAddons && checkoutAddons.length > 0 && (
                <div className="space-y-2.5 pb-2 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">
                    {isDe ? "Noch eine Kleinigkeit dazu?" : "Add something extra?"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {checkoutAddons.map((addon) => (
                      <div
                        key={addon._id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium text-foreground truncate">{addon.name}</p>
                          <Price cents={addon.price} className="text-xs font-semibold text-muted-foreground" />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addItem({
                              id: addon._id,
                              menuItemId: addon._id,
                              name: addon.name,
                              price: addon.price,
                            });
                          }}
                          className="shrink-0 h-7 px-2.5 rounded-full text-[11px] font-semibold"
                        >
                          + {isDe ? "Dazu" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Voluntary Tip Selector (excluded from 2% Zackisch fee) */}
              {isTippingEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {isDe
                        ? "Freiwilliges Trinkgeld für das Team"
                        : "Voluntary tip for the team"}
                    </span>
                    {tipCents > 0 && (
                      <Price
                        cents={tipCents}
                        className="text-xs font-semibold text-foreground"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {TIP_OPTIONS.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTipPercent(pct)}
                        className={`h-9 rounded-full text-xs font-semibold border transition-colors ${
                          effectiveTipPercent === pct
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {pct === 0 ? (isDe ? "Kein" : "None") : `${pct} %`}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isDe
                      ? "100 % des Trinkgelds gehen ohne Zackisch-Provision an den Betrieb."
                      : "100% of the voluntary tip goes to the venue without any Zackisch platform fee."}
                  </p>
                </div>
              )}

              <div className="space-y-3 border-t border-border pt-4">
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
                        <Check
                          weight="bold"
                          className="size-3.5 text-primary-foreground"
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {t("sendConfirmationEmailCheckbox")}
                  </span>
                </label>

                {sendEmailConfirmation && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-foreground sr-only"
                    >
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
                      aria-describedby={
                        emailError ? "checkout-email-error" : undefined
                      }
                      required={sendEmailConfirmation}
                    />
                    {emailError && (
                      <p
                        id="checkout-email-error"
                        role="alert"
                        className="w-full text-left text-sm font-medium text-destructive"
                      >
                        {emailError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Explicit Seller of Record Disclosure */}
              <div className="space-y-1 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">
                  {t("buyingFrom")}
                </p>
                <p className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {business.legalName || business.name}
                </p>
                {business.legalName &&
                  business.legalName !== business.name && (
                    <p className="text-xs font-medium text-muted-foreground">
                      {business.name}
                    </p>
                  )}
                {business.address?.trim() && (
                  <div className="text-xs text-muted-foreground space-y-0.5 pt-0.5">
                    {formatAddressLines(business.address).map(
                      (line, idx) => (
                        <p key={idx}>{line}</p>
                      ),
                    )}
                  </div>
                )}
                {business.vatId && (
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    {t("sellerVatId")}{" "}
                    {business.vatId}
                  </p>
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
                <p
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {checkoutError}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending && (
                  <CircleNotch
                    data-icon="inline-start"
                    className="size-5 animate-spin"
                  />
                )}
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
              <CheckoutForm
                returnUrl={t(
                  type === "dine-in" ? "tableSuccessUrl" : "pickupSuccessUrl",
                  { businessId: business.$id },
                )}
              />
            </CheckoutElementsProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
