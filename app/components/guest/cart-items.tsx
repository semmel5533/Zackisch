"use client";
import { Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/price";
import { useTranslation } from "@/lib/i18n";
import { MAX_CART_ITEM_QUANTITY, useCartStore } from "@/store/cart-store";

export function CartItems({ editable = true }: { editable?: boolean }) {
  const { t } = useTranslation();
  const { items, updateQuantity } = useCartStore();
  return (
    <ul className="guest-cart-items">
      {items.map((item) => (
        <li key={item.id}>
          <div className="guest-cart-item-copy">
            <p>
              <strong>{item.name}</strong>
            </p>
            {!!item.customizations?.length && (
              <p className="zk-supporting">
                {item.customizations
                  .map((option) => option.optionName)
                  .join(", ")}
              </p>
            )}
            <p className="zk-supporting">
              {item.quantity} × <Price cents={item.price} />
            </p>
          </div>
          <div className="guest-cart-item-actions">
            <Price cents={item.price * item.quantity} />
            {editable && (
              <div className="guest-quantity">
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={`${t("decreaseQuantity")}: ${item.name}`}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={20} aria-hidden="true" />
                </Button>
                <span className="guest-quantity-value">{item.quantity}</span>
                <Button
                  variant="ghost"
                  iconOnly
                  disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
                  aria-label={`${t("increaseQuantity")}: ${item.name}`}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={20} aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
