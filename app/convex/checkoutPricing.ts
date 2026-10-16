import type { OrderItem, CustomizationStep } from "../lib/types";

type PricedItem = {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  customizations: string;
  taxRate?: number;
};

type LegacyStep = CustomizationStep & {
  minSelect?: number;
  maxSelect?: number;
  required?: boolean;
  type?: string;
};

export interface PlatformFeeBreakdown {
  eligibleSubtotalCents: number;
  tipCents: number;
  discountCents: number;
  totalChargeCents: number;
  platformFeeGrossCents: number; // 2% of eligibleSubtotalCents, inclusive of any B2B VAT
  platformFeeNetCents: number;
  platformFeeVatCents: number;
  platformFeeVatRate: number;
}

export interface ItemTaxBreakdown {
  tax7GrossCents: number;
  tax7NetCents: number;
  tax7VatCents: number;
  tax19GrossCents: number;
  tax19NetCents: number;
  tax19VatCents: number;
}

/**
 * Calculates the 2% Zackisch platform fee on the eligible captured gross goods/services value
 * after discounts, strictly excluding voluntary tips, and inclusive of any VAT applicable
 * to Zackisch's own B2B service (never adding VAT on top of the 2%).
 */
export function calculatePlatformFeeBreakdown(
  grossGoodsCents: number,
  options?: {
    tipCents?: number;
    discountCents?: number;
    platformFeePercent?: number;
    zackischB2bVatRatePercent?: number;
  },
): PlatformFeeBreakdown {
  if (!Number.isSafeInteger(grossGoodsCents) || grossGoodsCents < 0) {
    throw new Error("Invalid gross goods amount");
  }
  const tipCents = options?.tipCents ?? 0;
  const discountCents = options?.discountCents ?? 0;
  const platformFeePercent = options?.platformFeePercent ?? 2;
  const zackischB2bVatRatePercent = options?.zackischB2bVatRatePercent ?? 19;

  if (!Number.isSafeInteger(tipCents) || tipCents < 0) {
    throw new Error("Invalid tip amount");
  }
  if (!Number.isSafeInteger(discountCents) || discountCents < 0) {
    throw new Error("Invalid discount amount");
  }

  const eligibleSubtotalCents = Math.max(0, grossGoodsCents - discountCents);
  const totalChargeCents = eligibleSubtotalCents + tipCents;

  // 2% of eligible gross goods/services (excluding tips), VAT-inclusive
  const platformFeeGrossCents = Math.round(
    eligibleSubtotalCents * (platformFeePercent / 100),
  );

  let platformFeeNetCents = platformFeeGrossCents;
  let platformFeeVatCents = 0;

  if (zackischB2bVatRatePercent > 0 && platformFeeGrossCents > 0) {
    platformFeeNetCents = Math.round(
      platformFeeGrossCents / (1 + zackischB2bVatRatePercent / 100),
    );
    platformFeeVatCents = platformFeeGrossCents - platformFeeNetCents;
  }

  return {
    eligibleSubtotalCents,
    tipCents,
    discountCents,
    totalChargeCents,
    platformFeeGrossCents,
    platformFeeNetCents,
    platformFeeVatCents,
    platformFeeVatRate: zackischB2bVatRatePercent,
  };
}

/**
 * Calculates the proportional Zackisch platform fee reversal for full or partial refunds.
 * Tip refunds carry 0% platform fee and do not reduce the fee unless eligible goods are refunded.
 */
export function calculateProportionalFeeRefund(params: {
  originalEligibleSubtotalCents: number;
  originalPlatformFeeCents: number;
  refundAmountCents: number;
  alreadyRefundedAmountCents?: number;
  alreadyRefundedFeeCents?: number;
  tipCents?: number;
}): {
  refundFeeCents: number;
  newTotalRefundedAmountCents: number;
  newTotalRefundedFeeCents: number;
  isFullRefund: boolean;
} {
  const {
    originalEligibleSubtotalCents,
    originalPlatformFeeCents,
    refundAmountCents,
    alreadyRefundedAmountCents = 0,
    alreadyRefundedFeeCents = 0,
    tipCents = 0,
  } = params;

  const totalOriginalChargeCents = originalEligibleSubtotalCents + tipCents;
  if (
    !Number.isSafeInteger(refundAmountCents) ||
    refundAmountCents <= 0 ||
    alreadyRefundedAmountCents + refundAmountCents > totalOriginalChargeCents
  ) {
    throw new Error("Invalid refund amount");
  }

  const newTotalRefundedAmountCents =
    alreadyRefundedAmountCents + refundAmountCents;
  const isFullRefund = newTotalRefundedAmountCents >= totalOriginalChargeCents;

  if (originalEligibleSubtotalCents <= 0 || originalPlatformFeeCents <= 0) {
    return {
      refundFeeCents: 0,
      newTotalRefundedAmountCents,
      newTotalRefundedFeeCents: alreadyRefundedFeeCents,
      isFullRefund,
    };
  }

  const remainingFeeCents = Math.max(
    0,
    originalPlatformFeeCents - alreadyRefundedFeeCents,
  );

  if (isFullRefund) {
    return {
      refundFeeCents: remainingFeeCents,
      newTotalRefundedAmountCents,
      newTotalRefundedFeeCents:
        alreadyRefundedFeeCents + remainingFeeCents,
      isFullRefund: true,
    };
  }

  // Cap eligible refunded goods at originalEligibleSubtotalCents
  const cumulativeEligibleRefundedCents = Math.min(
    originalEligibleSubtotalCents,
    newTotalRefundedAmountCents,
  );
  const targetCumulativeFeeRefundCents = Math.min(
    originalPlatformFeeCents,
    Math.round(
      (cumulativeEligibleRefundedCents / originalEligibleSubtotalCents) *
        originalPlatformFeeCents,
    ),
  );
  const refundFeeCents = Math.max(
    0,
    Math.min(
      remainingFeeCents,
      targetCumulativeFeeRefundCents - alreadyRefundedFeeCents,
    ),
  );

  return {
    refundFeeCents,
    newTotalRefundedAmountCents,
    newTotalRefundedFeeCents: alreadyRefundedFeeCents + refundFeeCents,
    isFullRefund: false,
  };
}

/**
 * Splits priced order items into German hospitality VAT buckets (7% food / 19% drinks & standard).
 */
export function calculateItemTaxBreakdown(
  items: Array<OrderItem & { taxRate?: number }>,
): ItemTaxBreakdown {
  let tax7GrossCents = 0;
  let tax19GrossCents = 0;

  for (const item of items) {
    const lineGross = item.price * item.quantity;
    if (item.taxRate === 7) {
      tax7GrossCents += lineGross;
    } else {
      tax19GrossCents += lineGross;
    }
  }

  const tax7NetCents = Math.round(tax7GrossCents / 1.07);
  const tax7VatCents = tax7GrossCents - tax7NetCents;
  const tax19NetCents = Math.round(tax19GrossCents / 1.19);
  const tax19VatCents = tax19GrossCents - tax19NetCents;

  return {
    tax7GrossCents,
    tax7NetCents,
    tax7VatCents,
    tax19GrossCents,
    tax19NetCents,
    tax19VatCents,
  };
}

export function priceCheckout(
  itemsJson: string,
  menu: PricedItem[],
  total: number,
): Array<OrderItem & { taxRate: number }> {
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
      taxRate: product.taxRate === 7 ? 7 : 19,
    };
  });
  if (
    priced.reduce((sum, item) => sum + item.price * item.quantity, 0) !== total
  )
    throw new Error("Total mismatch");
  return priced;
}
