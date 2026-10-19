"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { X, Sparkle, ArrowLeft, Plus, Minus, Trash } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSessionAction } from "@/actions/checkout-actions";
import { BottomSheet } from "@astryxdesign/core/BottomSheet";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TextInput } from "@astryxdesign/core/TextInput";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Price } from "@/components/common/price";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutForm } from "./checkout-form";
import Image from "next/image";
import { getMenuItemImageUrl } from "@/lib/menu-images";
import type { PublicRestaurant } from "@/lib/types";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: PublicRestaurant;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  initialStep?: "cart" | "checkout";
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
  initialStep = "cart",
}: CartSheetProps) {
  const { t, locale } = useTranslation();
  const isDe = locale.startsWith("de");
  const { items, total, addItem, updateQuantity, itemCount } = useCartStore();
  const count = itemCount();

  const [step, setStep] = useState<"cart" | "checkout">(initialStep);
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
  const submittingRef = useRef(false);
  const requestVersionRef = useRef(0);

  const subtotalCents = total();
  const tipCents = Math.round((subtotalCents * effectiveTipPercent) / 100);
  const totalChargeCents = subtotalCents + tipCents;

  const businessId = (business._id || business.$id) as Id<"businesses">;

  const cartItemIds = useMemo(
    () => items.map((i) => i.menuItemId || i.id).filter(Boolean),
    [items]
  );

  const smartRecommendations = useQuery(
    api.smartMenu.getSmartMenuRecommendations,
    isUpsellingEnabled && open && cartItemIds.length > 0
      ? {
          businessId,
          currentCartItemIds: cartItemIds,
          limit: 3,
        }
      : "skip"
  );

  const checkoutAddons = useQuery(
    api.smartMenu.getCheckoutAddons,
    isUpsellingEnabled && open
      ? {
          businessId,
          currentCartItemIds: cartItemIds,
          limit: 3,
        }
      : "skip"
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

  const activeStripeAccountId = checkoutSession?.stripeAccountId;

  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    return activeStripeAccountId
      ? loadStripe(pk, { stripeAccount: activeStripeAccountId })
      : loadStripe(pk);
  }, [activeStripeAccountId]);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
    }
  }, [open, initialStep]);

  useEffect(() => {
    requestVersionRef.current += 1;
    setCheckoutSession(null);
    setCheckoutError(null);
  }, [open, cartRevision]);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const normalizedEmail = email.trim();

    if (sendEmailConfirmation) {
      if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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
  };

  return (
    <BottomSheet
      isOpen={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          requestVersionRef.current += 1;
          setCheckoutSession(null);
          setCheckoutError(null);
        }
        onOpenChange(nextOpen);
      }}
      label={step === "cart" ? t("cart") : t("checkout")}
      height="tall"
      padding={0}
    >
      <div className="flex flex-col h-full max-w-[540px] mx-auto bg-background">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-background shrink-0">
          <div className="flex items-center justify-between gap-3">
            <HStack gap={2} vAlign="center">
              {step === "checkout" && (
                <IconButton
                  label={t("back" as any) || "Zurück"}
                  icon={<ArrowLeft className="size-4" weight="bold" />}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCheckoutSession(null);
                    setStep("cart");
                  }}
                />
              )}
              <Heading level={2}>
                {step === "cart" ? t("cart") : t("checkout")}
              </Heading>
              {count > 0 && (
                <Badge
                  label={String(count)}
                  variant="neutral"
                />
              )}
            </HStack>

            <IconButton
              label={t("close")}
              icon={<X className="size-4" weight="bold" />}
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            />
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-foreground">
                {step === "checkout" ? t("total") : (isDe ? "Zwischensumme" : "Subtotal")}
              </span>
              <span className="text-xs text-muted-foreground">{t("taxNote")}</span>
            </div>
            <Price
              cents={step === "checkout" ? totalChargeCents : subtotalCents}
              className="text-base sm:text-lg font-bold text-foreground"
            />
          </div>
        </div>

        {!business.canOrder ? (
          <div className="flex-1 p-5 space-y-2">
            <p className="text-sm font-semibold text-destructive">
              {t("onlineOrderingUnavailable" as any)}
            </p>
            <Text type="supporting">
              {t("onlineOrderingUnavailableDesc" as any)}
            </Text>
          </div>
        ) : count === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <p className="text-base font-semibold text-foreground">{t("emptyCart")}</p>
            <p className="text-sm text-muted-foreground">
              {isDe ? "Wähle Gerichte aus der Karte, um zu bestellen." : "Select dishes from the menu to start ordering."}
            </p>
            <Button
              label={isDe ? "Zur Speisekarte" : "Back to menu"}
              variant="secondary"
              size="lg"
              onClick={() => onOpenChange(false)}
            />
          </div>
        ) : step === "cart" ? (
          /* STEP 1: CART OVERVIEW WITH RECOMMENDATIONS */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
              {/* Cart Items List */}
              <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-start justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.customizations.map((c) => c.optionName).join(", ")}
                        </p>
                      )}
                      <Price cents={item.price} className="text-xs font-medium text-muted-foreground mt-1" />
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <Price cents={item.price * item.quantity} className="font-bold text-foreground" />
                      <div className="flex items-center bg-muted/70 p-0.5 rounded-lg border border-border">
                        <button
                          type="button"
                          className="size-8 rounded-md flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                          aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          {item.quantity === 1 ? (
                            <Trash weight="bold" className="size-3.5 text-destructive" />
                          ) : (
                            <Minus weight="bold" className="size-3.5" />
                          )}
                        </button>
                        <span className="text-xs font-bold tabular-nums px-2 font-inter">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="size-8 rounded-md flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                          aria-label={`${t("increaseQuantity")}: ${item.name}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus weight="bold" className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Frequently Ordered Together in Cart Overview */}
              {isUpsellingEnabled && smartRecommendations && smartRecommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkle className="size-4 text-foreground" weight="fill" />
                    <span className="text-sm font-semibold text-foreground">
                      {isDe ? "Wird oft zusammen bestellt" : "Frequently ordered together"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {smartRecommendations.map((rec) => {
                      const recImg = getMenuItemImageUrl(rec);
                      return (
                        <div
                          key={rec._id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-card"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            {recImg && (
                              <div className="relative size-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={recImg}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{rec.name}</p>
                              <Price cents={rec.price} className="text-xs text-muted-foreground" />
                            </div>
                          </div>
                          <Button
                            label={isDe ? "+ Hinzufügen" : "+ Add"}
                            variant="secondary"
                            size="md"
                            onClick={() => {
                              addItem({
                                id: rec._id,
                                menuItemId: rec._id,
                                name: rec.name,
                                price: rec.price,
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t border-border bg-background shrink-0">
              <Button
                size="lg"
                variant="primary"
                width="100%"
                label={`${t("continueToPayment")} · ${(subtotalCents / 100).toFixed(2).replace(".", ",")} €`}
                onClick={() => setStep("checkout")}
              />
            </div>
          </div>
        ) : !clientSecret ? (
          /* STEP 2: CHECKOUT & PAYMENT SELECTION */
          <form
            onSubmit={handleContinueToPayment}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
              {/* Checkout Add-ons (Last chance extra) */}
              {isUpsellingEnabled && checkoutAddons && checkoutAddons.length > 0 && (
                <div className="space-y-3 pb-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">
                    {isDe ? "Noch eine Kleinigkeit dazu?" : "Add something extra?"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {checkoutAddons.map((addon) => {
                      const addonImg = getMenuItemImageUrl(addon);
                      return (
                        <div
                          key={addon._id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {addonImg && (
                              <div className="relative size-9 rounded-md overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={addonImg}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{addon.name}</p>
                              <Price cents={addon.price} className="text-xs text-muted-foreground" />
                            </div>
                          </div>
                          <Button
                            label={isDe ? "+ Dazu" : "+ Add"}
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              addItem({
                                id: addon._id,
                                menuItemId: addon._id,
                                name: addon.name,
                                price: addon.price,
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Voluntary Tip Selector */}
              {isTippingEnabled && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {isDe ? "Freiwilliges Trinkgeld für das Team" : "Voluntary tip for the team"}
                    </span>
                    {tipCents > 0 && (
                      <Price cents={tipCents} className="text-xs font-semibold text-foreground" />
                    )}
                  </div>
                  <SegmentedControl
                    label={isDe ? "Trinkgeld auswählen" : "Select tip"}
                    value={String(tipPercent)}
                    onChange={(val) => setTipPercent(Number(val) as any)}
                    size="lg"
                    layout="fill"
                  >
                    <SegmentedControlItem value="0" label={isDe ? "Kein" : "None"} />
                    <SegmentedControlItem value="5" label="5 %" />
                    <SegmentedControlItem value="10" label="10 %" />
                    <SegmentedControlItem value="15" label="15 %" />
                  </SegmentedControl>
                  <p className="text-[11px] text-muted-foreground">
                    {isDe
                      ? "100 % des Trinkgelds gehen ohne Zackisch-Provision an den Betrieb."
                      : "100% of the voluntary tip goes to the venue without any Zackisch platform fee."}
                  </p>
                </div>
              )}

              {/* Email Receipt Option */}
              <div className="space-y-3 border-t border-border pt-4">
                <CheckboxInput
                  label={t("sendConfirmationEmailCheckbox")}
                  value={sendEmailConfirmation}
                  onChange={(checked) => {
                    setSendEmailConfirmation(checked);
                    if (!checked) {
                      setEmailError(null);
                    }
                  }}
                />

                {sendEmailConfirmation && (
                  <div className="pt-1">
                    <TextInput
                      label={t("emailForReceipt")}
                      value={email}
                      size="lg"
                      onChange={(val) => {
                        setEmail(val);
                        setEmailError(null);
                        setCheckoutError(null);
                      }}
                      placeholder={t("emailPlaceholder")}
                      status={emailError ? { type: "error", message: emailError } : undefined}
                    />
                  </div>
                )}
              </div>

              {/* Explicit Seller of Record Disclosure */}
              <div className="space-y-1 border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("buyingFrom")}
                </p>
                <p className="text-base font-bold text-foreground">
                  {business.legalName || business.name}
                </p>
                {business.legalName && business.legalName !== business.name && (
                  <p className="text-xs text-muted-foreground">{business.name}</p>
                )}
                {business.address?.trim() && (
                  <div className="text-xs text-muted-foreground space-y-0.5 pt-0.5">
                    {formatAddressLines(business.address).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}
                {business.vatId && (
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    {t("sellerVatId")} {business.vatId}
                  </p>
                )}
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {t("paymentDisclaimerPrefix")}
                <a
                  href={t("zakkigUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
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

            <div className="p-4 border-t border-border bg-background shrink-0 space-y-2">
              {checkoutError && (
                <p role="alert" className="w-full text-left text-sm font-medium text-destructive">
                  {checkoutError}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                width="100%"
                label={isPending ? t("loading") : (isDe ? "Zahlungspflichtig weiter" : "Continue to pay")}
                isDisabled={isPending}
                isLoading={isPending}
              />
            </div>
          </form>
        ) : (
          /* STRIPE EMBEDDED PAYMENT FORM */
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
                  { businessId: business.$id }
                )}
              />
            </CheckoutElementsProvider>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
