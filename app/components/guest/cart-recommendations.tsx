"use client";
import { useState } from "react";
import { CustomizationModal } from "./customization-modal";
import { cartVariantId } from "@/lib/cart-variant";
import type { MenuItem } from "@/lib/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCartStore } from "@/store/cart-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/price";

export function CartRecommendations({
  businessId,
  enabled,
  checkout = false,
}: {
  businessId: string;
  enabled: boolean;
  checkout?: boolean;
}) {
  const { items, addItem } = useCartStore();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const args =
    enabled && items.length
      ? {
          businessId: businessId as Id<"businesses">,
          currentCartItemIds: items.map((item) => item.menuItemId || item.id),
          limit: 2,
        }
      : "skip";
  const suggestions = useQuery(
    api.smartMenu.getSmartMenuRecommendations,
    !checkout ? args : "skip",
  );
  const addons = useQuery(
    api.smartMenu.getCheckoutAddons,
    checkout ? args : "skip",
  );
  const recommendations = checkout ? addons : suggestions;
  if (!recommendations?.length) return null;
  return (
    <section className="guest-recommendations">
      <h2>{t("guestSuggestedItems")}</h2>
      <ul>
        {recommendations.map((item) => (
          <li key={item._id}>
            <div>
              <p>{item.name}</p>
              <Price cents={item.price} />
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                if (item.customizations && item.customizations !== "[]")
                  setSelected({
                    ...item,
                    $id: item._id,
                    imageStorageId: item.imageStorageId ?? undefined,
                  });
                else
                  addItem({
                    id: item._id,
                    menuItemId: item._id,
                    name: item.name,
                    price: item.price,
                  });
              }}
            >
              {t("addToCart")}
            </Button>
          </li>
        ))}
      </ul>
      <CustomizationModal
        item={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onAddToCart={(item, selections, price) =>
          addItem({
            id: cartVariantId(item._id, selections),
            menuItemId: item._id,
            name: item.name,
            price,
            customizations: selections,
          })
        }
      />
    </section>
  );
}
