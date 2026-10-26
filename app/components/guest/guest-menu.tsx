"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import type { MenuCategory, MenuItem, PublicRestaurant } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { RestaurantHeroHeader } from "./restaurant-hero-header";
import { MenuItemRow } from "./menu-item-row";

type GuestMenuProps = {
  business: PublicRestaurant;
  categories: MenuCategory[];
  items: MenuItem[];
  popularItems: MenuItem[];
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  onAdd: (item: MenuItem) => void;
};

export function GuestMenu({
  business,
  categories,
  items,
  popularItems,
  type,
  tableNumber,
  onAdd,
}: GuestMenuProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const { items: cartItems, updateQuantity } = useCartStore();
  const showPopular =
    business.isPopularCategoryEnabled !== false && popularItems.length > 0;
  const sections = [
    ...(showPopular
      ? [{ id: "popular", title: t("popularMenuItems"), items: popularItems }]
      : []),
    ...categories
      .map((category) => ({
        id: category.$id,
        title: category.name,
        items: items.filter((item) => item.categoryId === category.$id),
      }))
      .filter((section) => section.items.length > 0),
  ];
  function navigate(id: string) {
    setActiveCategory(id);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "instant"
      : "smooth";
    const target = document.getElementById(id);
    const top =
      id === "all"
        ? 0
        : target
          ? Math.max(
              0,
              target.getBoundingClientRect().top + window.scrollY - 75,
            )
          : window.scrollY;
    window.scrollTo({ top, behavior });
  }
  return (
    <section className="guest-menu lg:col-span-7 xl:col-span-8">
      <RestaurantHeroHeader
        business={business}
        type={type}
        tableNumber={tableNumber}
      />
      <nav className="guest-category-nav" aria-label={t("menuCategories")}>
        {[{ id: "all", title: t("allCategories") }, ...sections].map(
          (section) => (
            <button
              key={section.id}
              type="button"
              aria-pressed={activeCategory === section.id}
              onClick={() => navigate(section.id)}
            >
              {section.title}
            </button>
          ),
        )}
      </nav>
      {items.length === 0 && (
        <p className="guest-menu-empty">{t("menuEmpty")}</p>
      )}
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="guest-menu-section"
          aria-label={section.title}
        >
          <h2>{section.title}</h2>
          {section.items.map((item) => {
            const id = item.$id || item._id;
            const entries = cartItems.filter(
              (entry) => entry.menuItemId === id,
            );
            const quantity = entries.reduce(
              (sum, entry) => sum + entry.quantity,
              0,
            );
            return (
              <MenuItemRow
                key={id}
                item={item}
                quantity={quantity}
                onAdd={() => onAdd(item)}
                onDecrease={() => {
                  const entry = entries[0];
                  if (entry) updateQuantity(entry.id, entry.quantity - 1);
                }}
              />
            );
          })}
        </section>
      ))}
    </section>
  );
}
