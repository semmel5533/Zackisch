import { describe, expect, it } from "vitest";
import {
  parseGuestCustomizations,
  priceGuestSelections,
} from "../lib/guest-customizations";
const group = {
  name: "Extras",
  minSelections: 1,
  maxSelections: 2,
  includedCount: 1,
  options: [
    { name: "A", extraPrice: 100 },
    { name: "B", extraPrice: 300 },
    { name: "C", extraPrice: 500, available: false },
  ],
};
describe("guest option presentation", () => {
  it("keeps the cheapest included option free, matching checkout pricing", () => {
    const steps = parseGuestCustomizations(JSON.stringify([group]))!;
    expect(priceGuestSelections(steps, { Extras: ["B", "A"] })).toEqual([
      { stepName: "Extras", optionName: "A", extraPrice: 0 },
      { stepName: "Extras", optionName: "B", extraPrice: 300 },
    ]);
  });
  it("does not price unavailable or unknown selections", () => {
    expect(
      priceGuestSelections(parseGuestCustomizations(JSON.stringify([group]))!, {
        Extras: ["C", "missing"],
      }),
    ).toEqual([]);
  });
  it("omits disabled groups and preserves legacy limits", () => {
    expect(
      parseGuestCustomizations(
        JSON.stringify([{ ...group, available: false }]),
      ),
    ).toEqual([]);
    expect(
      parseGuestCustomizations(
        JSON.stringify([{ name: "Size", type: "singleChoice", options: [] }]),
      )?.[0],
    ).toMatchObject({ minSelections: 1, maxSelections: 1 });
  });
  it.each([
    "broken",
    "{}",
    '[{"name":"Bad"}]',
    JSON.stringify([{ ...group, maxSelections: 0 }]),
    JSON.stringify([{ ...group, options: [{ name: "A", extraPrice: -1 }] }]),
    JSON.stringify([group, group]),
  ])("fails closed for malformed definitions: %s", (input) => {
    expect(parseGuestCustomizations(input)).toBeNull();
  });
});

import { priceCheckout } from "../convex/checkoutPricing";
it("client review and trusted checkout agree for included and paid options", () => {
  const customizations = JSON.stringify([group]);
  const selected = priceGuestSelections(
    parseGuestCustomizations(customizations)!,
    { Extras: ["B", "A"] },
  );
  const price =
    1000 + selected.reduce((sum, option) => sum + option.extraPrice, 0);
  const result = priceCheckout(
    JSON.stringify([
      {
        menuItemId: "dish",
        name: "Dish",
        price,
        quantity: 2,
        customizations: selected,
      },
    ]),
    [
      {
        _id: "dish",
        name: "Dish",
        price: 1000,
        available: true,
        customizations,
      },
    ],
    price * 2,
  );
  expect(result[0].price).toBe(price);
  expect(result[0].customizations).toEqual(selected);
});
