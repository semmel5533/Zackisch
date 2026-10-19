"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, DownloadSimple, Check, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { MAX_CART_ITEM_QUANTITY, useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/guest/cart-sheet";
import { Price } from "@/components/ui/price";
import { OrderTracker } from "@/components/guest/order-tracker";
import { RestaurantHeroHeader } from "@/components/guest/restaurant-hero-header";
import Image from "next/image";
import { CustomizationModal } from "@/components/guest/customization-modal";
import { cartVariantId } from "@/lib/cart-variant";
import { DIETARY_LABEL_KEYS } from "@/lib/dietary-labels";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { downloadOrderConfirmation } from "@/lib/confirmation-generator";
import type { PublicRestaurant, MenuCategory, MenuItem, Order, CartItem } from "@/lib/types";

interface GuestFrontendProps {
  business: PublicRestaurant;
  categories: MenuCategory[];
  items: MenuItem[];
  popularItems?: MenuItem[];
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  orderId?: string;
  initialOrder?: Order | null;
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
  business: PublicRestaurant;
  tableNumber?: string;
  setDineInSuccess: (val: null) => void;
}) {
  const { t, locale } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight text-foreground">{business.name}</span>
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
        <Button variant="ghost"
          type="button"
          id="floating-cart-banner"
          onClick={onOpenCart}
          className="w-full min-h-[48px] rounded-lg bg-foreground text-background px-4 py-2 flex items-center justify-between font-semibold hover:bg-foreground/90 transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
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
        </Button>
      </div>
    </aside>
  );
}

export function GuestFrontend({
  business,
  categories,
  items,
  popularItems = [],
  type,
  tableNumber,
  orderId,
  initialOrder,
}: GuestFrontendProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isDe = locale.startsWith("de");
  const { items: cartItems, updateQuantity, addItem, total } = useCartStore();

  const isPopularEnabled =
    business.isPopularCategoryEnabled !== false &&
    Array.isArray(popularItems) &&
    popularItems.length > 0;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customizationItem, setCustomizationItem] = useState<MenuItem | null>(null);

  const [dineInSuccess, setDineInSuccess] = useState<{
    orderNumber: string;
    order?: Order | null;
  } | null>(() => {
    if (initialOrder && type === "dine-in") {
      return {
        orderNumber: initialOrder.orderNumber,
        order: initialOrder,
      };
    }
    return null;
  });


  useEffect(() => {
    const businessName = business.name;
    if (orderId && type === "takeaway") {
      document.title = `${t("orderStatus")} – ${businessName}`;
      return;
    }
    const prefix =
      type === "takeaway"
        ? t("titleToGo")
        : tableNumber
        ? t("titleToStay", { table: tableNumber })
        : t("titleToStayNoTable");
    document.title = `${prefix} – ${businessName}`;
  }, [locale, business.name, type, tableNumber, orderId, t]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (categoryId === "all") {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const el = document.getElementById(categoryId);
    if (el) {
      const offset = 75;
      const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top: y, behavior });
    }
  };

  const handleAddClick = (item: MenuItem) => {
    const id = item.$id || item._id;
    if (item.customizations && item.customizations !== "[]") {
      setCustomizationItem(item);
    } else {
      addItem({ id, menuItemId: id, name: item.name, price: item.price });
    }
  };

  const handleCustomizationAdd = (item: MenuItem, selections: NonNullable<CartItem["customizations"]>, totalPrice: number) => {
    const id = item.$id || item._id;
    const cartItemId = cartVariantId(id, selections);
    addItem({ id: cartItemId, menuItemId: id, name: item.name, price: totalPrice, customizations: selections });
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

  return (
    <div className="guest-page min-h-screen bg-background flex flex-col">
      {/* Menu and desktop cart */}
      <main className="guest-layout max-w-[1120px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1 pb-24 lg:pb-12">
        {/* Left Section: Menu */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-6">
          <RestaurantHeroHeader business={business} type={type} tableNumber={tableNumber} />

          {/* Category navigation */}
          <div className="tabline border-b border-border flex items-center gap-6 overflow-x-auto no-scrollbar pt-2">
            <Button variant="ghost"
              type="button"
              onClick={() => scrollToCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={cn(
                "min-h-11 pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                activeCategory === "all"
                  ? "font-bold text-foreground border-b-2 border-foreground -mb-px"
                  : "font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              {t("allCategories")}
            </Button>
            {isPopularEnabled && (
              <Button variant="ghost"
                type="button"
                onClick={() => scrollToCategory("popular")}
                aria-pressed={activeCategory === "popular"}
                className={cn(
                  "min-h-11 pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground flex items-center gap-1.5",
                  activeCategory === "popular"
                    ? "font-bold text-foreground border-b-2 border-foreground -mb-px"
                    : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkle className="size-3.5 text-primary" weight="fill" />
                <span>{isDe ? "Beliebteste" : "Most Popular"}</span>
              </Button>
            )}
            {categories.map((c) => (
              <Button variant="ghost"
                key={c.$id}
                type="button"
                onClick={() => scrollToCategory(c.$id)}
                aria-pressed={activeCategory === c.$id}
                className={cn(
                  "min-h-11 pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                  activeCategory === c.$id
                    ? "font-bold text-foreground border-b-2 border-foreground -mb-px"
                    : "font-medium text-muted-foreground hover:text-foreground"
                )}
              >
                {c.name}
              </Button>
            ))}
          </div>

          {/* Menu categories */}
          <div className="space-y-10 pt-2">
            {items.length === 0 && <p className="py-6 text-muted-foreground">{t("menuEmpty")}</p>}

            {/* Virtual Popular Category */}
            {isPopularEnabled && (
              <div id="popular" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkle className="size-5 text-primary" weight="fill" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {isDe ? "Beliebteste" : "Most Popular"}
                  </h2>
                </div>
                <div className="divide-y divide-border border-y border-border">
                  {popularItems.map((item) => {
                    const itemId = item.$id || item._id;
                    const itemCartItems = cartItems.filter((i) => i.menuItemId === itemId);
                    const totalQuantity = itemCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

                    return (
                      <div
                        key={`popular-${itemId}`}
                        className="food-row py-4 sm:py-5 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-base sm:text-lg text-foreground leading-snug">
                            {item.name}
                          </h3>
                          {Boolean(item.dietaryLabels?.length) && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.dietaryLabels!.map((label) => t(DIETARY_LABEL_KEYS[label])).join(" · ")}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
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

                        <div className="flex flex-col items-end gap-3 shrink-0">
                          {(item.imageUrl || item.imageId) && (
                            <div className="food-thumb relative size-24 sm:size-32 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={item.imageUrl || getImagePreviewUrl(item.imageId!)}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(min-width: 640px) 128px, 96px"
                              />
                            </div>
                          )}

                          {totalQuantity > 0 ? (
                            <div className="flex items-center bg-muted/80 p-0.5 min-h-11 rounded-lg border border-border shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                onClick={() => {
                                  const cartEntry = cartItems.find((ci) => ci.menuItemId === itemId);
                                  if (cartEntry) updateQuantity(cartEntry.id, cartEntry.quantity - 1);
                                }}
                                aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                              >
                                <Minus weight="bold" className="size-3.5" />
                              </Button>
                              <span className="text-xs sm:text-sm font-bold tabular-nums px-2 min-w-[24px] text-center font-inter">
                                {totalQuantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                onClick={() => handleAddClick(item)}
                                aria-label={`${t("increaseQuantity")}: ${item.name}`}
                              >
                                <Plus weight="bold" className="size-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => handleAddClick(item)}
                              className="min-h-11 px-4 rounded-lg border border-border bg-white text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                            >
                              {t("addToCart")}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                            {Boolean(item.dietaryLabels?.length) && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.dietaryLabels!.map(label => t(DIETARY_LABEL_KEYS[label])).join(" · ")}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
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

                          <div className="flex flex-col items-end gap-3 shrink-0">
                            {item.imageId && (
                              <div className="food-thumb relative size-24 sm:size-32 rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={getImagePreviewUrl(item.imageId)}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="(min-width: 640px) 128px, 96px"
                                />
                              </div>
                            )}

                            {totalQuantity > 0 ? (
                              <div className="flex items-center bg-muted/80 p-0.5 min-h-11 rounded-lg border border-border shrink-0">
                                <Button variant="ghost" size="icon"
                                  type="button"
                                  className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                  onClick={() => {
                                    const cartEntry = cartItems.find((ci) => ci.menuItemId === item.$id);
                                    if (cartEntry) updateQuantity(cartEntry.id, cartEntry.quantity - 1);
                                  }}
                                  aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                                >
                                  <Minus weight="bold" className="size-3.5" />
                                </Button>
                                <span className="text-xs sm:text-sm font-bold tabular-nums px-2 min-w-[24px] text-center font-inter">
                                  {totalQuantity}
                                </span>
                                <Button variant="ghost" size="icon"
                                  type="button"
                                  className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                                  onClick={() => handleAddClick(item)}
                                  aria-label={`${t("increaseQuantity")}: ${item.name}`}
                                >
                                  <Plus weight="bold" className="size-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost"
                                type="button"
                                onClick={() => handleAddClick(item)}
                                className="min-h-11 px-4 rounded-lg border border-border bg-white text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                              >
                                {t("addToCart")}
                              </Button>
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

        {/* Desktop cart */}
        <aside className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <div className="sticky top-6 border-l border-border pl-6 space-y-5">
            <div>
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
                        <div className="flex items-center bg-muted/60 p-0.5 min-h-11 rounded-lg border border-border/60">
                          <Button variant="ghost" size="icon"
                            type="button"
                            className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                            aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus weight="bold" className="size-4" />
                          </Button>
                          <span className="text-[11px] font-bold tabular-nums px-1.5 font-inter">{item.quantity}</span>
                          <Button variant="ghost" size="icon"
                            type="button"
                            className="size-11 rounded-lg flex items-center justify-center hover:bg-background text-foreground transition-colors cursor-pointer"
                            aria-label={`${t("increaseQuantity")}: ${item.name}`}
                            disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus weight="bold" className="size-4" />
                          </Button>
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

                <Button variant="ghost"
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full min-h-[44px] rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {t("continueToPayment")} →
                </Button>


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
