"use client";

import Image from "next/image";
import { Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/price";
import { useTranslation } from "@/lib/i18n";
import { getMenuItemImageUrl } from "@/lib/menu-images";
import { DIETARY_LABEL_KEYS } from "@/lib/dietary-labels";
import { hasPaidCustomizations } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";

export function MenuItemRow({
  item,
  quantity,
  onAdd,
  onDecrease,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onDecrease: () => void;
}) {
  const { t } = useTranslation();
  const image = getMenuItemImageUrl(item);
  return (
    <article className="guest-menu-item">
      <div className="guest-menu-item-copy">
        <h3>{item.name}</h3>
        {item.description && (
          <p className="guest-menu-description">{item.description}</p>
        )}
        {!!item.dietaryLabels?.length && (
          <p className="guest-menu-dietary">
            {item.dietaryLabels
              .map((label) => t(DIETARY_LABEL_KEYS[label]))
              .join(" · ")}
          </p>
        )}
        <Price
          cents={item.price}
          from={hasPaidCustomizations(item.customizations)}
          className="guest-menu-price"
        />
        {!item.available && (
          <p className="guest-menu-unavailable">{t("unavailable")}</p>
        )}
      </div>
      <div className="guest-menu-item-actions">
        {image && (
          <Image
            src={image}
            alt=""
            width={112}
            height={112}
            sizes="(min-width: 600px) 112px, 88px"
            className="guest-menu-image"
          />
        )}
        {quantity > 0 ? (
          <div className="guest-quantity">
            <Button
              variant="ghost"
              iconOnly
              aria-label={`${t("decreaseQuantity")}: ${item.name}`}
              onClick={onDecrease}
            >
              <Minus size={20} aria-hidden="true" />
            </Button>
            <span className="guest-quantity-value">{quantity}</span>
            <Button
              variant="ghost"
              iconOnly
              disabled={!item.available}
              aria-label={`${t("increaseQuantity")}: ${item.name}`}
              onClick={onAdd}
            >
              <Plus size={20} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            disabled={!item.available}
            aria-label={`${t("addToCart")}: ${item.name}`}
            onClick={onAdd}
          >
            {t("addToCart")}
          </Button>
        )}
      </div>
    </article>
  );
}
