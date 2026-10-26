import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { PublicRestaurant } from "../lib/types";

vi.mock("@/components/language-switcher", () => ({
  LanguageSwitcher: () => null,
}));
vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({
    t: (key: string, values?: { table?: string }) =>
      `${key}${values?.table ? ` ${values.table}` : ""}`,
  }),
}));
import { RestaurantHeroHeader } from "../components/guest/restaurant-hero-header";

const business: PublicRestaurant = {
  _id: "venue",
  $id: "venue",
  name: "Café Beispiel",
  address: "Teststraße 1",
  canOrder: true,
  isPaused: false,
};
function render(
  extra: Partial<PublicRestaurant> = {},
  type: "dine-in" | "takeaway" = "dine-in",
) {
  return renderToStaticMarkup(
    createElement(RestaurantHeroHeader, {
      business: { ...business, ...extra },
      type,
      tableNumber: "12",
    }),
  );
}

describe("guest venue identity", () => {
  it("shows the venue as the main heading without substituting platform or stock images", () => {
    const html = render();
    expect(html).toContain("<h1>Café Beispiel</h1>");
    expect(html).toContain("Teststraße 1");
    expect(html).not.toContain("<img");
    expect(html).not.toMatch(/Zackisch|restaurant\.webp|brand_mark/);
    expect(html).toContain("titleToStay 12");
  });
  it("keeps pickup distinct from a table", () => {
    const html = render({}, "takeaway");
    expect(html).toContain("titleToGo");
    expect(html).not.toContain("titleToStay");
  });
  it("uses the actual merchant logo and banner", () => {
    const html = render({
      logoUrl: "/merchant-logo.svg",
      bannerUrl: "/merchant-banner.webp",
    });
    expect(html).toContain("/merchant-logo.svg");
    expect(html).toMatch(/(?:\/|%2F)merchant-banner\.webp/);
    expect(html.match(/<img/g)).toHaveLength(2);
  });
});

import { MenuItemRow } from "../components/guest/menu-item-row";
import type { MenuItem } from "../lib/types";
const dish: MenuItem = {
  _id: "dish",
  $id: "dish",
  _creationTime: 0,
  businessId: "venue",
  categoryId: "food",
  name: "Pizza Margherita",
  price: 990,
  available: false,
  sortOrder: 0,
  taxRate: 7,
  customizations: "[]",
};
it("keeps unavailable dishes visible and disables their add control", () => {
  const html = renderToStaticMarkup(
    createElement(MenuItemRow, {
      item: dish,
      quantity: 0,
      onAdd() {},
      onDecrease() {},
    }),
  );
  expect(html).toContain("Pizza Margherita");
  expect(html).toContain("unavailable");
  expect(html).toMatch(/<button[^>]*disabled/);
  expect(html).toContain('aria-label="addToCart: Pizza Margherita"');
  expect(html).not.toContain("<img");
});
it("leaves removal available when an item already in the cart becomes unavailable", () => {
  const html = renderToStaticMarkup(
    createElement(MenuItemRow, {
      item: dish,
      quantity: 2,
      onAdd() {},
      onDecrease() {},
    }),
  );
  const buttons = html.match(/<button[^>]*>/g) ?? [];
  expect(buttons).toHaveLength(2);
  expect(buttons[0]).not.toContain("disabled");
  expect(buttons[1]).toContain("disabled");
});
