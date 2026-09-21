import React from "react";
import { useCartStore } from "@/store/cart-store";
import { createRoot } from "react-dom/client";
import { GuestFrontend } from "@/components/guest/guest-frontend";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { useLanguageStore } from "@/store/language-store";
import type { Organization, MenuCategory, MenuItem, Order } from "@/lib/types";
import "../../app/globals.css";
import "./preview.css";
const params = new URLSearchParams(location.search);
const locale = params.get("lang") === "en" ? "en" : "de";
useLanguageStore.getState().setLocale(locale);
const labels = {
  de: {
    menu: "Favoriten",
    mains: "Hauptgerichte",
    desserts: "Desserts",
    drink: "Zitronenlimonade",
    drinkDescription: "Frische Zitrone, Rosmarin und Eis",
    dessert: "Panna cotta",
    drinks: "Getränke",
    dish: "Burrata & Tomaten",
    description: "Burrata, reife Tomaten, Basilikum und Sauerteigbrot",
    second: "Pasta al Limone",
    secondDescription: "Zitrone, Parmesan und frischer Pfeffer",
  },
  en: {
    menu: "Favourites",
    mains: "Mains",
    desserts: "Desserts",
    drink: "Lemonade",
    drinkDescription: "Fresh lemon, rosemary and ice",
    dessert: "Panna cotta",
    drinks: "Drinks",
    dish: "Burrata & tomatoes",
    description: "Burrata, ripe tomatoes, basil and sourdough",
    second: "Pasta al Limone",
    secondDescription: "Lemon, Parmesan and fresh pepper",
  },
}[locale];
const base = { _creationTime: 1789992000000, organizationId: "demo" };
const organization: Organization = {
  ...base,
  _id: "demo",
  $id: "demo",
  name: "Bistro Zakkig",
  ownerId: "demo",
  stripeOnboardingComplete: true,
  stripeAccountId: "acct_demo",
  bannerFileId: "/restaurant.webp",
  logoFileId: "/logo.png",
  address: "Mannheim",
  isToGoEnabled: true,
  isToStayEnabled: true,
};
const categories: MenuCategory[] = [
  { ...base, _id: "food", $id: "food", name: labels.menu, sortOrder: 0 },
  { ...base, _id: "mains", $id: "mains", name: labels.mains, sortOrder: 1 },
  { ...base, _id: "drinks", $id: "drinks", name: labels.drinks, sortOrder: 2 },
  {
    ...base,
    _id: "desserts",
    $id: "desserts",
    name: labels.desserts,
    sortOrder: 3,
  },
];
const items: MenuItem[] = [
  {
    ...base,
    _id: "burrata",
    $id: "burrata",
    categoryId: "food",
    name: labels.dish,
    imageId: "/burrata.webp",
    description: labels.description,
    price: 1250,
    available: true,
    sortOrder: 0,
    taxRate: 19,
    customizations: "[]",
  },
  {
    ...base,
    _id: "pasta",
    $id: "pasta",
    categoryId: "mains",
    name: labels.second,
    description: labels.secondDescription,
    price: 1450,
    available: true,
    sortOrder: 1,
    taxRate: 19,
    customizations: "[]",
  },
];
items.push(
  {
    ...base,
    _id: "lemonade",
    $id: "lemonade",
    categoryId: "food",
    name: labels.drink,
    description: labels.drinkDescription,
    imageId: "/lemonade.webp",
    price: 450,
    available: true,
    sortOrder: 1,
    taxRate: 19,
    customizations: "[]",
  },
  {
    ...base,
    _id: "lemonade-drinks",
    $id: "lemonade-drinks",
    categoryId: "drinks",
    name: labels.drink,
    description: labels.drinkDescription,
    imageId: "/lemonade.webp",
    price: 450,
    available: true,
    sortOrder: 0,
    taxRate: 19,
    customizations: "[]",
  },
  {
    ...base,
    _id: "dessert",
    $id: "dessert",
    categoryId: "desserts",
    name: labels.dessert,
    price: 650,
    available: true,
    sortOrder: 0,
    taxRate: 19,
    customizations: "[]",
  },
);
useCartStore.setState({
  items: [
    {
      id: "burrata",
      menuItemId: "burrata",
      name: labels.dish,
      price: 1250,
      quantity: 1,
    },
  ],
});
const orders = [1, 2, 3].map((n): Order => ({
  ...base,
  _id: `order-${n}`,
  $id: `order-${n}`,
  createdAt: base._creationTime,
  orderNumber: String(n).padStart(3, "0"),
  type: n === 3 ? "takeaway" : "dine-in",
  tableNumber: n === 3 ? undefined : String(n),
  items: JSON.stringify([
    { name: labels.dish, price: 1250, quantity: 1 },
    { name: labels.second, price: 1450, quantity: 1 },
  ]),
  total: 2700,
  status: n === 3 ? "ready_for_pickup" : "in_progress",
  email: "demo@example.com",
  zakkigFee: 54,
  stripeFee: 0,
  netAmount: 2646,
  currency: "EUR",
}));
createRoot(document.getElementById("root")!).render(
  params.get("screen") === "kitchen" ? (
    <div className="kitchen-capture">
      <CurrentOrdersContent orders={orders} organizationId="demo" isStaffView />
    </div>
  ) : (
    <GuestFrontend
      organization={organization}
      categories={categories}
      items={items}
      type="dine-in"
      tableNumber="1"
    />
  ),
);
