"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Minus, ShoppingCart, DownloadSimple, Check, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { MAX_CART_ITEM_QUANTITY, useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/guest/cart-sheet";
import { Price } from "@/components/ui/price";
import { OrderTracker } from "@/components/guest/order-tracker";
import { LanguageSwitcher } from "@/components/language-switcher";
import Image from "next/image";
import { CustomizationModal } from "@/components/guest/customization-modal";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { downloadOrderConfirmation } from "@/lib/confirmation-generator";
import type { Business, MenuCategory, MenuItem, Order } from "@/lib/types";

interface GuestFrontendProps {
  business: Business;
  categories: MenuCategory[];
  items: MenuItem[];
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  orderId?: string;
  initialOrder?: Order | null;
  initialActiveTab?: "menu" | "cart";
  initialCheckoutOpen?: boolean;
  initialSendEmailConfirmation?: boolean;
  initialEmail?: string;
  initialDineInSuccess?: { orderNumber: string; order?: Order | null } | null;
}

function GuestOrderSuccess({
  orderNumber,
  order,
  business,
  tableNumber,
  setDineInSuccess,
}: {
  orderNumber: string;
  order?: Order | null;
  business: Business;
  tableNumber?: string;
  setDineInSuccess: (val: null) => void;
}) {
  const { t, locale } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-foreground">zackisch</span>
          <span className="text-xs text-muted-foreground font-normal"> · {t("orderingBrandSubtitle")}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {tableNumber ? `${t("tableLabel")} ${tableNumber}` : t("pickupLabel")} · {locale.toUpperCase()}
        </span>
      </header>

      <main className="flex-1 px-4 py-8 max-w-[520px] mx-auto w-full flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("yourOrderNumber")}
          </p>
          <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-foreground font-inter tabular-nums">
            {orderNumber}
          </div>
        </div>

        <div className="w-full bg-card border border-border rounded-xl p-6 text-center space-y-3 shadow-xs">
          <div className="size-12 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
            <Check className="size-6" weight="bold" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {t("orderPlaced")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("waitAtTable")}
          </p>
        </div>

        {order && (
          <div className="w-full flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full min-h-[44px] rounded-full font-semibold border-border text-foreground hover:bg-muted cursor-pointer gap-2"
              onClick={() => downloadOrderConfirmation(order, business, locale)}
            >
              <DownloadSimple className="size-4 shrink-0" weight="bold" />
              <span>{t("downloadConfirmation")}</span>
            </Button>
            <p className="text-[11px] leading-relaxed text-muted-foreground text-center px-2">
              {t("confirmationDisclaimerPrefix")}
              <a
                href={t("homepageUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                zackisch.com
              </a>
              {t("confirmationDisclaimerSuffix")}
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full min-h-[44px] rounded-full font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
          onClick={() => {
            setDineInSuccess(null);
            useCartStore.getState().clearCart();
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("order");
              window.history.replaceState(null, "", url.toString());
            }
          }}
        >
          {t("orderAgain")}
        </Button>
      </main>

      <footer className="p-4 text-center max-w-[520px] mx-auto w-full shrink-0">
        <p className="text-xs text-muted-foreground">
          {t("processedViaZakkigPrefix")}
          <a
            href={t("homepageUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-foreground font-medium hover:opacity-80 transition-opacity"
          >
            zackisch.com
          </a>
          {t("processedViaZakkigSuffix")}
        </p>
      </footer>
    </div>
  );
}

function FloatingCartBanner({
  onOpenCart,
}: {
  onOpenCart: () => void;
}) {
  const { t } = useTranslation();
  const { items, itemCount, total } = useCartStore();
  const count = itemCount();

  if (count === 0 || items.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label={t("cart")}
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden pointer-events-none"
    >
      <div className="w-full max-w-[500px] pointer-events-auto">
        <button
          type="button"
          id="floating-cart-banner"
          onClick={onOpenCart}
          className="w-full min-h-[48px] rounded-full bg-foreground text-background px-4 py-2 flex items-center justify-between font-semibold shadow-lg hover:bg-foreground/90 transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <span className="size-6 rounded-full bg-background text-foreground text-xs flex items-center justify-center font-bold tabular-nums">
              {count}
            </span>
            <span className="text-sm font-semibold">{t("viewCart")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Price cents={total()} className="text-sm font-bold text-background" />
            <ArrowRight className="size-4 shrink-0" weight="bold" aria-hidden="true" />
          </div>
        </button>
      </div>
    </aside>
  );
}

export function GuestFrontend({
  business,
  categories,
  items,
  type,
  tableNumber,
  orderId,
  initialOrder,
  initialActiveTab = "menu",
  initialCheckoutOpen = false,
  initialSendEmailConfirmation = false,
  initialEmail = "",
  initialDineInSuccess = null,
}: GuestFrontendProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { items: cartItems, updateQuantity, addItem, total } = useCartStore();

  const [activeTab, setActiveTab] = useState<"menu" | "cart">(initialActiveTab);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [checkoutOpen, setCheckoutOpen] = useState(initialCheckoutOpen);
  const [customizationItem, setCustomizationItem] = useState<MenuItem | null>(null);

  const [dineInSuccess, setDineInSuccess] = useState<{
    orderNumber: string;
    order?: Order | null;
  } | null>(() => {
    if (initialDineInSuccess) return initialDineInSuccess;
    if (initialOrder && type === "dine-in") {
      return {
        orderNumber: initialOrder.orderNumber,
        order: initialOrder,
      };
    }
    return null;
  });

  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const businessName = business.name;
    if (orderId && type === "takeaway") {
      document.title = `Zackisch: ${t("orderStatus")} - ${businessName}`;
      return;
    }
    const prefix =
      type === "takeaway"
        ? t("titleToGo")
        : tableNumber
        ? t("titleToStay", { table: tableNumber })
        : t("titleToStayNoTable");
    document.title = `Zackisch: ${prefix} ${businessName}`;
  }, [locale, business.name, type, tableNumber, orderId, t]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    isClickScrolling.current = true;
    if (clickScrollTimeout.current) clearTimeout(clickScrollTimeout.current);
    clickScrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);

    if (categoryId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(categoryId);
    if (el) {
      const offset = 75;
      const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleAddClick = (item: MenuItem) => {
    if (item.customizations && item.customizations !== "[]") {
      setCustomizationItem(item);
    } else {
      addItem({ id: item.$id, menuItemId: item.$id, name: item.name, price: item.price });
    }
  };

  const handleCustomizationAdd = (item: MenuItem, selections: any[], totalPrice: number) => {
    const confString = selections.map((s: any) => `${s.stepName}:${s.optionName}`).join("|");
    const hash = btoa(encodeURIComponent(confString)).slice(0, 10);
    const cartItemId = `${item.$id}-${hash}`;
    addItem({ id: cartItemId, menuItemId: item.$id, name: item.name, price: totalPrice, customizations: selections });
  };

  if (orderId && type === "takeaway") {
    return (
      <OrderTracker
        orderId={orderId}
        business={business}
        initialOrder={initialOrder}
      />
    );
  }

  if (dineInSuccess && type === "dine-in") {
    return (
      <GuestOrderSuccess
        orderNumber={dineInSuccess.orderNumber}
        order={
          dineInSuccess.order ||
          (initialOrder?.orderNumber === dineInSuccess.orderNumber ? initialOrder : null)
        }
        business={business}
        tableNumber={tableNumber}
        setDineInSuccess={setDineInSuccess}
      />
    );
  }

  const contextLabel =
    type === "dine-in" && tableNumber
      ? `${t("tableLabel")} ${tableNumber}`
      : t("pickupLabel");

  return (
    <div className="guest-page min-h-screen bg-background flex flex-col">
      {/* Top Bar (guest.html) */}
      <header className="guest-top sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-foreground">zackisch</span>
          <span className="text-xs text-muted-foreground font-normal"> · {t("orderingBrandSubtitle")}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {contextLabel} · {locale.toUpperCase()}
          </span>
          <LanguageSwitcher variant="outline" className="h-8 text-xs px-2.5 rounded-full" />
        </div>
      </header>

      {/* Main Two-Column Layout (guest.html) */}
      <main className="guest-layout max-w-[1120px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1 pb-24 lg:pb-12">
        {/* Left Section: Menu */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {contextLabel} · {business.name}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
              {t("guestHeadline")}
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
              {t("guestSubtitle")}
            </p>
          </div>

          {/* Category Tabline (guest.html .tabline) */}
          <div className="tabline border-b border-border flex items-center gap-6 overflow-x-auto no-scrollbar pt-2">
            <button
              type="button"
              onClick={() => scrollToCategory("all")}
              className={cn(
                "pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer",
                activeCategory === "all"
                  ? "font-bold text-foreground border-b-2 border-foreground -mb-px"
                  : "font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              {locale === "de" ? "Alle" : "All"}
            </button>
            {categories.map((c) => (
              <button
                key={c.$id}
                type="button"
                onClick={() => scrollToCategory(c.$id)}
                className={cn(
                  "pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer",
                  activeCategory === c.$id
                    ? "font-bold text-foreground border-b-2 border-foreground -mb-px"
                    : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Categories & Food Rows (guest.html .food-row) */}
          <div className="space-y-10 pt-2">
            {categories.map((category) => {
              const categoryItems = items.filter((i) => i.categoryId === category.$id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.$id} id={category.$id} className="scroll-mt-24 space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {category.name}
                  </h2>
                  <div className="divide-y divide-border border-y border-border">
                    {categoryItems.map((item) => {
                      const itemCartItems = cartItems.filter((i) => i.menuItemId === item.$id);
                      const totalQuantity = itemCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

                      return (
                        <div
                          key={item.$id}
                          className="food-row py-4 sm:py-5 flex items-center justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground leading-snug">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="mt-2">
                              <Price
                                cents={item.price}
                                from={hasPaidCustomizations(item.customizations)}
                                className="font-bold text-sm sm:text-base text-foreground"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {item.imageId && (
                              <div className="food-thumb relative w-16 h-14 sm:w-20 sm:h-18 rounded-lg overflow-hidden bg-muted border border-border shrink-0 hidden xs:block">
                                <Image
                                  src={getImagePreviewUrl(item.imageId)}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            )}

                            {totalQuantity > 0 ? (
                              <div className="flex items-center bg-muted/80 p-0.5 h-9 rounded-full border border-border shrink-0">
                                <button
                                  type="button"
                                  className="size-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                  onClick={() => {
                                    const cartEntry = cartItems.find((ci) => ci.menuItemId === item.$id);
                                    if (cartEntry) updateQuantity(cartEntry.id, cartEntry.quantity - 1);
                                  }}
                                  aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                                >
                                  <Minus weight="bold" className="size-3.5" />
                                </button>
                                <span className="text-xs sm:text-sm font-bold tabular-nums px-2 min-w-[24px] text-center font-inter">
                                  {totalQuantity}
                                </span>
                                <button
                                  type="button"
                                  className="size-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                  onClick={() => handleAddClick(item)}
                                  aria-label={`${t("increaseQuantity")}: ${item.name}`}
                                >
                                  <Plus weight="bold" className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddClick(item)}
                                className="min-h-[36px] px-4 rounded-full border border-border bg-white text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                              >
                                {t("addToCart")}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Section: Desktop Sticky Cart Pane (guest.html .pane.cart) */}
        <aside className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <div className="pane cart sticky top-20 bg-card border border-border rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <p className="label text-[11px] font-semibold uppercase tracking-[.08em] text-muted-foreground">
                {t("yourOrder")}
              </p>
              <h2 className="text-xl font-bold text-foreground mt-0.5">
                {t("cart")}
              </h2>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("emptyCart")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-border/60 max-h-[360px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs sm:text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {item.quantity} × <Price cents={item.price} className="inline text-xs text-muted-foreground" />
                        </p>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {item.customizations.map((c) => c.optionName).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <Price cents={item.price * item.quantity} className="font-bold text-foreground" />
                        <div className="flex items-center bg-muted/60 p-0.5 h-6 rounded-full border border-border/60">
                          <button
                            type="button"
                            className="size-5 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus weight="bold" className="size-2.5" />
                          </button>
                          <span className="text-[11px] font-bold tabular-nums px-1.5 font-inter">{item.quantity}</span>
                          <button
                            type="button"
                            className="size-5 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus weight="bold" className="size-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-muted-foreground">{type === "dine-in" ? t("tableLabel") : t("pickupLabel")}</span>
                  <b className="font-semibold text-foreground">
                    {type === "dine-in" && tableNumber ? tableNumber : business.name}
                  </b>
                </div>

                <div className="total pt-3 border-t border-border flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-foreground">{t("total")}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{t("taxNote")}</span>
                  </div>
                  <Price cents={total()} className="text-xl font-bold text-foreground" />
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="btn w-full min-h-[44px] rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {t("continueToPayment")} →
                </button>

                <p className="rtext text-[11px] text-muted-foreground text-center leading-relaxed">
                  {t("stripePaymentReassurance")}
                </p>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Floating Cart for Mobile */}
      <FloatingCartBanner
        onOpenCart={() => setCheckoutOpen(true)}
      />

      {/* Customization Modal */}
      <CustomizationModal
        item={customizationItem}
        open={!!customizationItem}
        onOpenChange={(open) => !open && setCustomizationItem(null)}
        onAddToCart={handleCustomizationAdd}
      />

      {/* Checkout Sheet */}
      <CartSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        business={business}
        type={type}
        tableNumber={tableNumber}
        initialSendEmailConfirmation={initialSendEmailConfirmation}
        initialEmail={initialEmail}
        onOrderSuccess={(newOrderId, orderNumber) => {
          setCheckoutOpen(false);
          useCartStore.getState().clearCart();
          if (type === "takeaway") {
            router.push(`/pickup/${business.$id}?order=${newOrderId}`);
          } else {
            setDineInSuccess({ orderNumber });
          }
        }}
      />
    </div>
  );
}
