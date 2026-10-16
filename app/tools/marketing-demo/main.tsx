import React from "react";
import { useCartStore } from "@/store/cart-store";
import { createRoot } from "react-dom/client";
import { GuestFrontend } from "@/components/guest/guest-frontend";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { StaffTerminalShell } from "@/components/staff/staff-terminal-shell";
import { useSidebarStore } from "@/store/sidebar-store";
import { useLanguageStore } from "@/store/language-store";
import type { Business, MenuCategory, MenuItem, Order } from "@/lib/types";
import "../../app/globals.css";
import "./preview.css";
const params = new URLSearchParams(location.search);
const scenario = params.get("scenario");
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
    dish: "Pizza Margherita",
    description: "Tomatensauce, Mozzarella und frisches Basilikum",
    second: "Pasta al Limone",
    secondDescription: "Zitrone, Parmesan und frischer Pfeffer",
    crustStep: "Teig",
    crustOpt: "Sauerteig",
    extrasStep: "Extras",
    extrasOpt: "Oliven",
    extrasOpt2: "Knoblauch",
  },
  en: {
    menu: "Favourites",
    mains: "Mains",
    desserts: "Desserts",
    drink: "Lemonade",
    drinkDescription: "Fresh lemon, rosemary and ice",
    dessert: "Panna cotta",
    drinks: "Drinks",
    dish: "Pizza Margherita",
    description: "Tomato sauce, mozzarella and fresh basil",
    second: "Pasta al Limone",
    secondDescription: "Lemon, Parmesan and fresh pepper",
    crustStep: "Dough",
    crustOpt: "Sourdough",
    extrasStep: "Extras",
    extrasOpt: "Olives",
    extrasOpt2: "Garlic",
  },
}[locale];
const base = { _creationTime: 1789992000000, businessId: "demo" };
const business: Business = {
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
    _id: "pizza",
    $id: "pizza",
    categoryId: "food",
    name: labels.dish,
    imageId: "/pizza.webp",
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
const pizzaCustomizations = [
  { stepName: labels.crustStep, optionName: labels.crustOpt, extraPrice: 0 },
  {
    stepName: labels.extrasStep,
    optionName: labels.extrasOpt,
    extraPrice: 100,
  },
  {
    stepName: labels.extrasStep,
    optionName: labels.extrasOpt2,
    extraPrice: 150,
  },
];
if (scenario === "modifiers") {
  items.push({
    ...base,
    _id: "custom-pizza",
    $id: "custom-pizza",
    categoryId: "food",
    name: labels.dish,
    description: labels.description,
    price: 1250,
    available: true,
    sortOrder: 2,
    taxRate: 19,
    customizations: JSON.stringify([
      {
        id: "crust",
        name: labels.crustStep,
        minSelections: 1,
        maxSelections: 1,
        includedCount: 1,
        sortOrder: 0,
        options: [
          {
            id: "sourdough",
            name: labels.crustOpt,
            extraPrice: 0,
            available: true,
            sortOrder: 0,
          },
          {
            id: "unavailable",
            name: "Unavailable",
            extraPrice: 0,
            available: false,
            sortOrder: 1,
          },
        ],
      },
      {
        id: "extras",
        name: labels.extrasStep,
        minSelections: 1,
        maxSelections: 2,
        includedCount: 1,
        sortOrder: 1,
        options: [
          {
            id: "olives",
            name: labels.extrasOpt,
            extraPrice: 100,
            available: true,
            sortOrder: 0,
          },
          {
            id: "garlic",
            name: labels.extrasOpt2,
            extraPrice: 150,
            available: true,
            sortOrder: 1,
          },
        ],
      },
    ]),
  });
}
useCartStore.setState({
  items:
    scenario === "empty-cart" || scenario === "modifiers"
      ? []
      : scenario === "single-item"
        ? [
            {
              id: "pizza",
              menuItemId: "pizza",
              name: labels.dish,
              price: 1250,
              quantity: 1,
            },
          ]
        : [
            {
              id: "pizza-custom",
              menuItemId: "pizza",
              name: labels.dish,
              price: 1500,
              quantity: 1,
              customizations: pizzaCustomizations,
            },
            {
              id: "lemonade",
              menuItemId: "lemonade",
              name: labels.drink,
              price: 450,
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
    {
      name: labels.dish,
      price: 1500,
      quantity: 1,
      customizations: pizzaCustomizations,
    },
    {
      name: labels.drink,
      price: 450,
      quantity: 1,
    },
  ]),
  total: 1950,
  status: n === 3 ? "ready_for_pickup" : "in_progress",
  email: "demo@example.com",
  zakkigFee: 39,
  stripeFee: 0,
  netAmount: 1911,
  currency: "EUR",
}));
function StaffDemoScreen() {
  React.useEffect(() => {
    useSidebarStore.getState().setExpanded(false);
  }, []);

  return (
    <StaffTerminalShell
      business={business}
      initialOrders={orders}
      categories={categories}
      items={items}
      initialTab="current-orders"
    />
  );
}

useSidebarStore.getState().setExpanded(false);

createRoot(document.getElementById("root")!).render(
  params.get("screen") === "kitchen" ? (
    <StaffDemoScreen />
  ) : (
    <GuestFrontend
      business={business}
      categories={categories}
      items={items}
      type={
        scenario === "tracker-ready" || scenario === "tracker-completed"
          ? "takeaway"
          : "dine-in"
      }
      tableNumber="1"
      initialActiveTab={
        params.get("screen") === "pay" ||
        params.get("screen") === "cart" ||
        params.get("screen") === "checkout"
          ? "cart"
          : "menu"
      }
      initialCheckoutOpen={params.get("screen") === "checkout"}
      initialSendEmailConfirmation={params.get("screen") === "checkout"}
      initialDineInSuccess={
        scenario === "dine-in-success"
          ? { orderNumber: "001", order: orders[0] }
          : null
      }
      orderId={
        scenario === "tracker-ready" || scenario === "tracker-completed"
          ? "order-3"
          : undefined
      }
      initialOrder={
        scenario === "tracker-ready"
          ? { ...orders[2], readyAt: Date.now() }
          : scenario === "tracker-completed"
            ? { ...orders[2], status: "completed", completedAt: Date.now() }
            : undefined
      }
    />
  ),
);
