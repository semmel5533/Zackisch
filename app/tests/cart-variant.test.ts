import { describe, expect, it } from "vitest";
import { cartVariantId } from "../lib/cart-variant";
import { useCartStore } from "../store/cart-store";

describe("configured cart item identity", () => {
  it("keeps variants with a shared step prefix in separate cart lines", () => {
    useCartStore.getState().clearCart();
    const cheese = [{ stepName: "Choose topping", optionName: "Cheese", extraPrice: 100 }];
    const olives = [{ stepName: "Choose topping", optionName: "Olives", extraPrice: 200 }];
    for (const [customizations, price] of [[cheese, 1100], [olives, 1200]] as const) {
      useCartStore.getState().addItem({ id: cartVariantId("pizza", customizations), menuItemId: "pizza", name: "Pizza", price, customizations: [...customizations] });
    }
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().total()).toBe(2300);
    useCartStore.getState().clearCart();
  });
  it("matches the same choices in a different selection order without separator collisions", () => {
    const choices = [{ stepName: "Size", optionName: "Large" }, { stepName: "Topping", optionName: "Olives" }];
    expect(cartVariantId("pizza", choices)).toBe(cartVariantId("pizza", [...choices].reverse()));
    expect(cartVariantId("pizza", [{ stepName: "a:b", optionName: "c" }])).not.toBe(cartVariantId("pizza", [{ stepName: "a", optionName: "b:c" }]));
  });
});
