"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { guestCheckoutPath } from "@/lib/guest-paths";
import type { PublicRestaurant } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/price";
import { CartItems } from "./cart-items";
import { CartRecommendations } from "./cart-recommendations";

export function CartSheet({
  open,
  onOpenChange,
  business,
  type,
  tableNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: PublicRestaurant;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { items, total } = useCartStore();
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("cart")}
      closeLabel={t("close")}
      sheet
      footer={
        items.length > 0 && business.canOrder ? (
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              onOpenChange(false);
              router.push(guestCheckoutPath(business.$id, type, tableNumber));
            }}
          >
            {t("continueToPayment")} · <Price cents={total()} />
          </Button>
        ) : undefined
      }
    >
      {!business.canOrder ? (
        <p role="alert">{t("onlineOrderingUnavailable")}</p>
      ) : items.length === 0 ? (
        <p>{t("emptyCart")}</p>
      ) : (
        <>
          <CartItems />
          <p className="guest-total">
            <span>
              {t("total")} · {t("taxNote")}
            </span>
            <Price cents={total()} />
          </p>
          <CartRecommendations
            businessId={business.$id}
            enabled={open && business.isUpsellingEnabled !== false}
          />
        </>
      )}
    </Modal>
  );
}
