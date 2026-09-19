import type { OrderItem, CustomizationStep } from "../lib/types";

type PricedItem = {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  customizations: string;
};
type LegacyStep = CustomizationStep & {
  minSelect?: number;
  maxSelect?: number;
  required?: boolean;
  type?: string;
};

export function priceCheckout(
  itemsJson: string,
  menu: PricedItem[],
  total: number,
): OrderItem[] {
  const items: OrderItem[] = JSON.parse(itemsJson);
  if (!Array.isArray(items) || items.length < 1 || items.length > 100)
    throw new Error("Invalid cart");
  if (!Number.isSafeInteger(total) || total <= 0 || total > 1000000)
    throw new Error("Invalid total");
  const priced = items.map((item) => {
    const product = menu.find(
      (candidate) => candidate._id === item?.menuItemId,
    );
    if (!product || product.available === false)
      throw new Error("Item unavailable");
    if (
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    )
      throw new Error("Invalid quantity");
    if (!Number.isSafeInteger(product.price) || product.price < 0)
      throw new Error("Invalid menu price");
    const steps: LegacyStep[] = JSON.parse(product.customizations || "[]");
    if (!Array.isArray(steps)) throw new Error("Invalid customizations");
    const selected = item.customizations ?? [];
    if (!Array.isArray(selected) || selected.length > 100)
      throw new Error("Invalid selections");
    if (
      selected.some(
        (choice) =>
          !choice ||
          steps.filter((step) => step.name === choice.stepName).length !== 1,
      )
    )
      throw new Error("Unknown customization");
    const canonical: NonNullable<OrderItem["customizations"]> = [];
    let price = product.price;
    for (const step of steps) {
      const choices = selected.filter(
        (choice) => choice.stepName === step.name,
      );
      if (step.available === false) {
        if (choices.length) throw new Error("Customization unavailable");
        continue;
      }
      const min =
        step.minSelections ??
        step.minSelect ??
        (step.required || step.type === "singleChoice" ? 1 : 0);
      const max =
        step.maxSelections ??
        step.maxSelect ??
        (step.type === "singleChoice" ||
        (step.required && min === 1 && !step.maxSelect)
          ? 1
          : 99);
      if (
        choices.length < min ||
        choices.length > max ||
        new Set(choices.map((choice) => choice.optionName)).size !==
          choices.length
      )
        throw new Error("Invalid selection count");
      const options = choices
        .map((choice) => {
          const matches = step.options.filter(
            (option) => option.name === choice.optionName,
          );
          const option = matches[0];
          if (matches.length !== 1 || option.available === false)
            throw new Error("Option unavailable");
          const extraPrice =
            option.extraPrice ??
            (option as typeof option & { price?: number }).price ??
            0;
          if (!Number.isSafeInteger(extraPrice) || extraPrice < 0)
            throw new Error("Invalid option price");
          return { name: option.name, extraPrice };
        })
        .sort((a, b) => a.extraPrice - b.extraPrice);
      options.forEach((option, index) => {
        const extraPrice =
          index < (step.includedCount || 0) ? 0 : option.extraPrice;
        price += extraPrice;
        canonical.push({
          stepName: step.name,
          optionName: option.name,
          extraPrice,
        });
      });
    }
    if (!Number.isSafeInteger(price) || item.price !== price)
      throw new Error("Price changed");
    return {
      menuItemId: product._id,
      name: product.name,
      price,
      quantity: item.quantity,
      customizations: canonical,
    };
  });
  if (
    priced.reduce((sum, item) => sum + item.price * item.quantity, 0) !== total
  )
    throw new Error("Total mismatch");
  return priced;
}
