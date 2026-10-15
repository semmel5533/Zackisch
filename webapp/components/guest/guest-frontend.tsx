"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight, DownloadSimple, Check } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { MAX_CART_ITEM_QUANTITY, useCartStore } from "@/store/cart-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/guest/cart-sheet";
import { Price } from "@/components/ui/price";
import { OrderTracker } from "@/components/guest/order-tracker";
import { LanguageSwitcher } from "@/components/language-switcher";
import Image from "next/image";
import { CustomizationModal } from "@/components/guest/customization-modal";
import { WaveLine } from "@/components/ui/wave-line";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { Storefront } from "@phosphor-icons/react/dist/ssr";
import { downloadOrderConfirmation } from "@/lib/confirmation-generator";
import type { Organization, MenuCategory, MenuItem, Order } from "@/lib/types";

interface GuestFrontendProps {
  organization: Organization;
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

import { RestaurantHeroHeader } from "@/components/guest/restaurant-hero-header";

function GuestOrderSuccess({
  orderNumber,
  order,
  organization,
  tableNumber,
  setDineInSuccess,
}: {
  orderNumber: string;
  order?: Order | null;
  organization: Organization;
  tableNumber?: string;
  setDineInSuccess: (val: null) => void;
}) {
  const { t, locale } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-clip">
      <RestaurantHeroHeader
        organization={organization}
        type="dine-in"
        tableNumber={tableNumber}
        showOrderingSubtitle={false}
      />

      <main className="flex-1 px-4 py-6 max-w-[500px] mx-auto w-full flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{t("yourOrderNumber")}</p>
          <div className="text-7xl sm:text-8xl font-black tracking-wider text-primary font-inter tabular-nums">
            {orderNumber}
          </div>
        </div>

        <div className="w-full bg-muted/40 border border-border rounded-xl p-6 text-center space-y-3">
          <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
            <Check className="size-6" weight="bold" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("orderPlaced")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("waitAtTable")}
          </p>
        </div>

        {order && (
          <div className="w-full flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-full font-semibold border-border text-foreground hover:bg-muted cursor-pointer gap-2"
              onClick={() => downloadOrderConfirmation(order, organization, locale)}
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
                className="text-black font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                zackisch.com
              </a>
              {t("confirmationDisclaimerSuffix")}
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full h-11 rounded-full font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
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

      <footer className="p-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
        <p className="text-xs text-muted-foreground">
          {t("processedViaZakkigPrefix")}
          <a
            href={t("homepageUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-black font-medium hover:opacity-80 transition-opacity"
          >
            zackisch.com
          </a>
          {t("processedViaZakkigSuffix")}
        </p>
      </footer>
    </div>
  );
}

function GuestMenu({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  const { t } = useTranslation();
  const { items: cartItems, addItem, updateQuantity } = useCartStore();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.$id || "");
  const [customizationItem, setCustomizationItem] = useState<MenuItem | null>(null);

  const [isSticky, setIsSticky] = useState(false);

  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const categoryNavRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
        if (categories.length > 0) {
          setActiveCategory(categories[categories.length - 1].$id);
          return;
        }
      }

      let currentActiveId = categories[0]?.$id;
      for (const category of categories) {
        const el = document.getElementById(category.$id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 90) {
            currentActiveId = category.$id;
          }
        }
      }
      if (currentActiveId) setActiveCategory(currentActiveId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categories]);

  useEffect(() => {
    if (activeCategory && categoryNavRef.current) {
      const activeBtn = categoryNavRef.current.querySelector(`[data-category-id="${activeCategory}"]`) as HTMLElement;
      if (activeBtn) {
        const container = categoryNavRef.current;
        const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeCategory]);

  const scrollToCategory = (id: string) => {
    isClickScrolling.current = true;
    setActiveCategory(id);
    if (clickScrollTimeout.current) clearTimeout(clickScrollTimeout.current);
    clickScrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);

    const el = document.getElementById(id);
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
    const confString = selections.map((s: any) => `${s.stepName}:${s.optionName}`).join('|');
    const hash = btoa(encodeURIComponent(confString)).slice(0, 10);
    const cartItemId = `${item.$id}-${hash}`;
    addItem({ id: cartItemId, menuItemId: item.$id, name: item.name, price: totalPrice, customizations: selections });
  };

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full pointer-events-none -mb-px" />
      <div 
        id="category-nav"
        className={cn(
          "sticky top-0 z-30 w-full bg-background border-b border-border overflow-hidden transition-[border-radius] duration-150",
          isSticky ? "rounded-none" : "rounded-t-[1.5rem]"
        )}
      >
        <div
          ref={categoryNavRef}
          className="overflow-x-auto no-scrollbar overscroll-x-contain px-4 py-3 sm:py-3.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-2 min-w-max">
            {categories.map((c) => (
              <button
                key={c.$id}
                data-category-id={c.$id}
                onClick={() => scrollToCategory(c.$id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors border cursor-pointer",
                  activeCategory === c.$id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 pb-28 md:pb-32 space-y-10">
        {categories.map((category) => {
          const categoryItems = items.filter((i) => i.categoryId === category.$id);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.$id} id={category.$id} className="space-y-4 scroll-mt-20">
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <div className="space-y-4">
                {categoryItems.map((item) => {
                  const itemCartItems = cartItems.filter((i) => i.menuItemId === item.$id);
                  const totalQuantity = itemCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

                  return (
                    <Card
                      key={item.$id}
                      className="overflow-hidden hover:border-foreground/25 transition-colors p-0 gap-0"
                    >
                      {item.imageId && (
                        <div className="relative w-full h-48 bg-muted">
                          <Image
                            src={getImagePreviewUrl(item.imageId)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                          />
                        </div>
                      )}
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight break-words">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 break-words">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleAddClick(item)}
                            className="group relative w-full h-11 sm:h-12 rounded-full bg-primary hover:bg-neutral-800 text-primary-foreground transition-[background-color,transform] duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 flex items-center p-1 cursor-pointer select-none"
                          >
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background text-foreground flex items-center justify-center group-hover:bg-neutral-100 transition-colors shrink-0">
                              {totalQuantity > 0 ? (
                                <span className="font-extrabold text-sm sm:text-base font-inter tabular-nums leading-none">
                                  {totalQuantity}
                                </span>
                              ) : (
                                <Plus weight="bold" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                              )}
                            </div>

                            <span className="font-bold text-sm sm:text-base truncate text-center flex-1 px-3 text-primary-foreground">
                              {t("addToCart")}
                            </span>

                            <Price
                              cents={item.price}
                              from={hasPaidCustomizations(item.customizations)}
                              className="font-bold text-sm sm:text-base shrink-0 mr-3 sm:mr-4 text-primary-foreground"
                            />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <CustomizationModal
        item={customizationItem}
        open={!!customizationItem}
        onOpenChange={(open) => !open && setCustomizationItem(null)}
        onAddToCart={handleCustomizationAdd}
      />
    </>
  );
}

function CartHeader({
  onBack,
}: {
  onBack: () => void;
}) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shrink-0 pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-0">
      <div className="max-w-[500px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={onBack}
            className="shrink-0"
            aria-label={t("backToMenu")}
          >
            <ArrowLeft weight="bold" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {t("cart")}
          </h1>
        </div>

        <LanguageSwitcher
          variant="outline"
          className="shrink-0"
        />
      </div>
    </header>
  );
}

function GuestCart({
  setActiveTab,
}: {
  setActiveTab: (tab: "menu" | "cart") => void;
}) {
  const { t } = useTranslation();
  const { items: cartItems, updateQuantity } = useCartStore();

  return (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
          <ShoppingCart weight="bold" className="h-12 w-12 text-foreground" />
          <p className="font-semibold text-foreground text-base sm:text-lg">
            {t("emptyCart")}
          </p>
          <Button
            size="lg"
            className="mt-2 inline-flex"
            onClick={() => {
              setActiveTab("menu");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowLeft weight="bold" className="mr-2.5 h-5 w-5" />
            <span>{t("backToMenu")}</span>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="py-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-snug break-words">{item.name}</h3>
                {item.customizations && item.customizations.length > 0 && (
                  <div className="flex flex-col items-start gap-1 mt-1.5">
                    {item.customizations.map((c, cIdx) => (
                      <p
                        key={cIdx}
                        className="max-w-full text-xs leading-normal text-muted-foreground break-words"
                      >
                        {c.stepName ? (
                          <span className="font-medium text-foreground/80">
                            {c.stepName}:{" "}
                          </span>
                        ) : null}
                        <span>{c.optionName}</span>
                        {typeof c.extraPrice === "number" && c.extraPrice > 0 && (
                          <span className="ml-1 whitespace-nowrap">
                            (<Price
                              cents={c.extraPrice}
                              prefix="+"
                              className="text-muted-foreground font-normal text-xs"
                              currencyClassName="ml-0.5"
                            />)
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2">
                <Price
                  cents={item.price * item.quantity}
                  className="text-sm font-bold text-primary text-right leading-snug"
                />

                <div className="flex items-center bg-muted/80 p-0.5 h-7 rounded-full border border-border/60 shrink-0">
                  <button
                    type="button"
                    className="size-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-background active:scale-95 text-foreground transition-[background-color,transform] duration-100 disabled:opacity-50 disabled:pointer-events-none shrink-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label={`${item.quantity === 1 ? t("removeFromCart") : t("decreaseQuantity")}: ${item.name}`}
                  >
                    <Minus weight="bold" className="size-3" />
                  </button>
                  <span className="text-xs font-bold font-inter tabular-nums min-w-[18px] text-center px-1.5">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="size-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-background active:scale-95 text-foreground transition-[background-color,transform] duration-100 disabled:opacity-50 disabled:pointer-events-none shrink-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
                    aria-label={`${t("increaseQuantity")}: ${item.name}`}
                  >
                    <Plus weight="bold" className="size-3" />
                  </button>
                </div>
                {item.quantity >= MAX_CART_ITEM_QUANTITY && (
                  <p className="w-full text-left text-sm font-medium text-destructive">
                    {t("quantityLimitReached")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div className="w-full max-w-[500px] bg-background border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[24px] px-4 pt-3.5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 pointer-events-auto animate-in fade-in slide-in-from-bottom duration-300 motion-reduce:animate-none">
        <button
          type="button"
          id="floating-cart-banner"
          onClick={onOpenCart}
          className="group relative flex h-12 sm:h-13 w-full items-center gap-2 rounded-full bg-primary p-1 sm:p-1.5 text-primary-foreground transition-[background-color,box-shadow,transform] duration-150 hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 cursor-pointer select-none"
        >
          <div className="h-10 w-10 rounded-full bg-background text-foreground flex items-center justify-center group-hover:bg-neutral-100 transition-colors shrink-0">
            <span className="font-extrabold text-sm sm:text-base font-inter tabular-nums leading-none">
              {count}
            </span>
          </div>

          <span className="min-w-0 flex-1 truncate px-1 text-center text-sm sm:text-base font-bold text-primary-foreground">
            {t("viewCart")}
          </span>

          <Price cents={total()} className="shrink-0 text-sm sm:text-base font-bold text-primary-foreground" />
          <ArrowRight className="mr-2 size-4 shrink-0" weight="bold" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

export function GuestFrontend({
  organization,
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
  const { items: cartItems, total } = useCartStore();

  const [activeTab, setActiveTab] = useState<"menu" | "cart">(initialActiveTab);
  const [checkoutOpen, setCheckoutOpen] = useState(initialCheckoutOpen);
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

  const cartScrollRef = useRef<HTMLElement>(null);
  const [hasScrollBelow, setHasScrollBelow] = useState(false);

  const checkCartScroll = useCallback(() => {
    const el = cartScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 2;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 4;
    setHasScrollBelow(hasOverflow && !isAtBottom);
  }, []);

  useEffect(() => {
    if (activeTab !== "cart") return;

    checkCartScroll();
    const timeout = setTimeout(checkCartScroll, 60);

    const el = cartScrollRef.current;
    if (!el) return () => clearTimeout(timeout);

    const resizeObserver = new ResizeObserver(() => {
      checkCartScroll();
    });
    resizeObserver.observe(el);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [activeTab, cartItems, checkCartScroll]);

  useEffect(() => {
    const orgName = organization.name;
    if (orderId && type === "takeaway") {
      document.title = `Zackisch: ${t("orderStatus")} - ${orgName}`;
      return;
    }
    if (activeTab === "cart") {
      document.title = `Zackisch: ${t("cart")}`;
      return;
    }
    const prefix =
      type === "takeaway"
        ? t("titleToGo")
        : tableNumber
        ? t("titleToStay", { table: tableNumber })
        : t("titleToStayNoTable");
    document.title = `Zackisch: ${prefix} ${orgName}`;
  }, [locale, organization.name, type, tableNumber, orderId, activeTab, t]);

  if (orderId && type === "takeaway") {
    return (
      <OrderTracker
        orderId={orderId}
        organization={organization}
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
        organization={organization}
        tableNumber={tableNumber}
        setDineInSuccess={setDineInSuccess}
      />
    );
  }

  return (
    <>
      {activeTab === "cart" ? (
        <div className="h-dvh bg-background text-foreground flex flex-col items-center overflow-hidden">
          <div className="w-full max-w-[500px] bg-background h-full flex flex-col overflow-hidden">
            <CartHeader
              onBack={() => {
                setActiveTab("menu");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            <main
              ref={cartScrollRef}
              onScroll={checkCartScroll}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-6 py-4"
            >
              <GuestCart
                setActiveTab={setActiveTab}
              />
            </main>

            {cartItems.length > 0 && (
              <footer
                className={cn(
                  "shrink-0 border-t border-border bg-background px-4 md:px-6 pt-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 transition-shadow duration-200",
                  hasScrollBelow
                    ? "shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
                    : "shadow-none"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-foreground">
                      {t("total")}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {t("taxNote")}
                    </span>
                  </div>
                  <Price cents={total()} className="text-base sm:text-lg font-bold" />
                </div>
                <Button
                  size="lg"
                  className="w-full mt-3"
                  onClick={() => setCheckoutOpen(true)}
                >
                  {t("checkout")}
                </Button>
              </footer>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background overflow-x-clip">
          <RestaurantHeroHeader
            organization={organization}
            type={type}
            tableNumber={tableNumber}
          />

          {/* Main Section as rounded white Card inside dark canvas */}
          <div className="flex-1 bg-background text-foreground flex flex-col max-w-[500px] mx-auto w-full rounded-t-[1.5rem]">
            <GuestMenu
              categories={categories}
              items={items}
            />
          </div>

          <FloatingCartBanner
            onOpenCart={() => {
              setActiveTab("cart");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      <CartSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        organization={organization}
        type={type}
        tableNumber={tableNumber}
        initialSendEmailConfirmation={initialSendEmailConfirmation}
        initialEmail={initialEmail}
        onOrderSuccess={(orderId, orderNumber) => {
          setCheckoutOpen(false);
          useCartStore.getState().clearCart();
          if (type === "takeaway") {
            router.push(`/pickup/${organization.$id}?order=${orderId}`);
          } else {
            setDineInSuccess({ orderNumber });
          }
        }}
      />
    </>
  );
}
