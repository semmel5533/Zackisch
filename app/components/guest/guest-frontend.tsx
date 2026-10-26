"use client";

import { useState, useEffect } from "react";
import { DownloadSimple, Check } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { CartItems } from "@/components/guest/cart-items";
import { CartSheet } from "@/components/guest/cart-sheet";
import { Price } from "@/components/common/price";
import { OrderTracker } from "@/components/guest/order-tracker";
import { guestCheckoutPath } from "@/lib/guest-paths";
import { GuestMenu } from "./guest-menu";
import { CustomizationModal } from "@/components/guest/customization-modal";
import { cartVariantId } from "@/lib/cart-variant";
import { downloadOrderConfirmation } from "@/lib/confirmation-generator";
import type {
  PublicRestaurant,
  MenuCategory,
  MenuItem,
  Order,
  CartItem,
} from "@/lib/types";

const EMPTY_MENU_ITEMS: MenuItem[] = [];

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
          <span className="font-semibold text-lg tracking-tight text-foreground">
            {business.name}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {tableNumber ? `${t("tableLabel")} ${tableNumber}` : t("pickupLabel")}{" "}
          · {locale.toUpperCase()}
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
              variant="secondary"
              fullWidth
              size="lg"
              onClick={() => downloadOrderConfirmation(order, business, locale)}
            >
              {<DownloadSimple className="size-4 shrink-0" weight="bold" />}
              {t("downloadConfirmation")}
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
          variant="secondary"
          fullWidth
          size="lg"
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

function FloatingCartBanner({ onOpenCart }: { onOpenCart: () => void }) {
  const { t } = useTranslation();
  const { items, itemCount, total } = useCartStore();
  const count = itemCount();

  if (count === 0 || items.length === 0) {
    return null;
  }

  return (
    <aside aria-label={t("cart")} className="guest-cart-dock">
      <div className="w-full max-w-[500px] pointer-events-auto px-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onOpenCart}
        >{`${count} · ${t("viewCart")} · ${(total() / 100).toFixed(2).replace(".", ",")} €`}</Button>
      </div>
    </aside>
  );
}

export function GuestFrontend({
  business,
  categories,
  items,
  popularItems = EMPTY_MENU_ITEMS,
  type,
  tableNumber,
  orderId,
  initialOrder,
}: GuestFrontendProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { items: cartItems, addItem, total } = useCartStore();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [customizationItem, setCustomizationItem] = useState<MenuItem | null>(
    null,
  );

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

  const handleAddClick = (item: MenuItem) => {
    const id = item.$id || item._id;
    if (item.customizations && item.customizations !== "[]") {
      setCustomizationItem(item);
    } else {
      addItem({ id, menuItemId: id, name: item.name, price: item.price });
    }
  };

  const handleCustomizationAdd = (
    item: MenuItem,
    selections: NonNullable<CartItem["customizations"]>,
    totalPrice: number,
  ) => {
    const id = item.$id || item._id;
    const cartItemId = cartVariantId(id, selections);
    addItem({
      id: cartItemId,
      menuItemId: id,
      name: item.name,
      price: totalPrice,
      customizations: selections,
    });
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
          (initialOrder?.orderNumber === dineInSuccess.orderNumber
            ? initialOrder
            : null)
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
        <GuestMenu
          business={business}
          categories={categories}
          items={items}
          popularItems={popularItems}
          type={type}
          tableNumber={tableNumber}
          onAdd={handleAddClick}
        />

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
                <CartItems />

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-muted-foreground">
                    {type === "dine-in" ? t("tableLabel") : t("pickupLabel")}
                  </span>
                  <b className="font-semibold text-foreground">
                    {type === "dine-in" && tableNumber
                      ? tableNumber
                      : business.name}
                  </b>
                </div>

                <div className="total pt-3 border-t border-border flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-foreground">
                      {t("total")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1.5">
                      {t("taxNote")}
                    </span>
                  </div>
                  <Price
                    cents={total()}
                    className="text-xl font-bold text-foreground"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    router.push(
                      guestCheckoutPath(business.$id, type, tableNumber),
                    );
                  }}
                >
                  {t("continueToPayment")}
                </Button>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Floating Cart for Mobile & Desktop Dock */}
      <FloatingCartBanner
        onOpenCart={() => {
          setCheckoutOpen(true);
        }}
      />

      {/* Customization Modal */}
      <CustomizationModal
        item={customizationItem}
        open={!!customizationItem}
        onOpenChange={(open) => !open && setCustomizationItem(null)}
        onAddToCart={handleCustomizationAdd}
      />

      {/* Checkout / Cart Sheet */}
      <CartSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        business={business}
        type={type}
        tableNumber={tableNumber}
      />
    </div>
  );
}
