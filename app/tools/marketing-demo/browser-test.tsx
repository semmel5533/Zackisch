import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { useLanguageStore } from "@/store/language-store";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { MenuCategory, MenuItem, Order, Organization } from "@/lib/types";
import "../../app/globals.css";
import "./preview.css";

const OverviewContent = lazy(() =>
  import("@/components/dashboard/overview-content").then((m) => ({
    default: m.OverviewContent,
  })),
);
const StaffSessionCard = lazy(() =>
  import("@/components/dashboard/staff-session-card").then((m) => ({
    default: m.StaffSessionCard,
  })),
);
const AllOrdersContent = lazy(() =>
  import("@/components/dashboard/all-orders-content").then((m) => ({
    default: m.AllOrdersContent,
  })),
);
const MenuContent = lazy(() =>
  import("@/components/dashboard/menu-content").then((m) => ({
    default: m.MenuContent,
  })),
);
const SettingsContent = lazy(() =>
  import("@/components/dashboard/settings-content").then((m) => ({
    default: m.SettingsContent,
  })),
);
const AvailabilityContent = lazy(() =>
  import("@/components/availability/availability-content").then((m) => ({
    default: m.AvailabilityContent,
  })),
);
const OrderTracker = lazy(() =>
  import("@/components/guest/order-tracker").then((m) => ({
    default: m.OrderTracker,
  })),
);

const params = new URLSearchParams(location.search);
const screen = params.get("screen") || "overview";
useLanguageStore
  .getState()
  .setLocale(params.get("lang") === "en" ? "en" : "de");

const base = { _creationTime: Date.now(), organizationId: "demo" };
const organization: Organization = {
  ...base,
  _id: "demo",
  $id: "demo",
  name: "Bistro Zakkig",
  ownerId: "demo",
  address: "Mannheim",
  stripeOnboardingComplete: true,
  isToGoEnabled: true,
  isToStayEnabled: true,
  tables: ["1", "2", "3"],
};
const categories: MenuCategory[] = [
  { ...base, _id: "food", $id: "food", name: "Speisen", sortOrder: 0 },
  { ...base, _id: "drinks", $id: "drinks", name: "Getränke", sortOrder: 1 },
];
const items: MenuItem[] = Array.from(
  { length: params.get("list") === "long" ? 80 : 8 },
  (_, i) => ({
    ...base,
    _id: `item-${i}`,
    $id: `item-${i}`,
    categoryId: i % 2 ? "drinks" : "food",
    name: `Artikel ${i + 1}`,
    description: `Beschreibung ${i + 1}`,
    price: 500 + i * 25,
    available: i % 5 !== 0,
    sortOrder: i,
    taxRate: 19,
    customizations: "[]",
  }),
);
const orders: Order[] = Array.from(
  { length: params.get("list") === "long" ? 80 : 8 },
  (_, i) => ({
    ...base,
    _id: `order-${i}`,
    $id: `order-${i}`,
    createdAt: Date.now() - i * 60_000,
    orderNumber: String(i + 1).padStart(3, "0"),
    type: i % 2 ? "takeaway" : "dine-in",
    tableNumber: i % 2 ? undefined : "1",
    items: JSON.stringify([
      { name: items[i % items.length].name, price: 500, quantity: 1 },
    ]),
    total: 500,
    email: "demo@example.invalid",
    zakkigFee: 0,
    stripeFee: 0,
    netAmount: 500,
    status:
      screen === "tracker-completed"
        ? "completed"
        : screen === "tracker-ready"
          ? "ready_for_pickup"
          : i % 3
            ? "completed"
            : "in_progress",
    currency: "EUR",
  }),
);

const screens: Record<string, React.ReactNode> = {
  overview: (
    <OverviewContent organization={organization} orders={orders}>
      <StaffSessionCard
        staffToken="demo-token"
        organizationId="demo"
        baseUrl="http://localhost:3001"
      />
    </OverviewContent>
  ),
  archive: <AllOrdersContent orders={orders} organizationId="demo" />,
  menu: (
    <MenuContent categories={categories} items={items} organizationId="demo" />
  ),
  settings: (
    <SettingsContent
      organization={organization}
      user={{ name: "Demo", email: "demo@example.invalid" }}
    />
  ),
  availability: (
    <AvailabilityContent
      categories={categories}
      items={items}
      organizationId="demo"
    />
  ),
  "tracker-ready": (
    <OrderTracker
      orderId="order-0"
      organization={organization}
      initialOrder={orders[0]}
    />
  ),
  "tracker-completed": (
    <OrderTracker
      orderId="order-0"
      organization={organization}
      initialOrder={orders[0]}
    />
  ),
};

const isDashboardScreen = [
  "overview",
  "archive",
  "menu",
  "settings",
  "availability",
].includes(screen);
const content = screens[screen] || screens.overview;

createRoot(document.getElementById("root")!).render(
  isDashboardScreen ? (
    <div data-browser-test-screen={screen}>
      <Suspense fallback={null}>
        <DashboardShell
          organization={organization}
          user={{ name: "Demo User", email: "demo@example.invalid" }}
        >
          {content}
        </DashboardShell>
      </Suspense>
    </div>
  ) : (
    <main className="@container min-h-dvh p-6" data-browser-test-screen={screen}>
      <Suspense fallback={null}>{content}</Suspense>
    </main>
  ),
);
