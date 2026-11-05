"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardText,
  Archive,
  SlidersHorizontal,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import type { PublicRestaurant, Order, MenuCategory, MenuItem } from "@/lib/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { AllOrdersContent } from "@/components/dashboard/all-orders-content";
import { AvailabilityContent } from "@/components/availability/availability-content";
import { signOutStaffAction } from "@/actions/staff-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
import { cn } from "@/lib/utils";

interface StaffTerminalShellProps {
  business: PublicRestaurant;
  initialOrders: Order[];
  categories: MenuCategory[];
  items: MenuItem[];
  initialTab?: "current-orders" | "all-orders" | "availability";
  token?: string;
}

export function StaffTerminalShell({
  business,
  initialOrders,
  categories,
  items,
  initialTab = "current-orders",
  token,
}: StaffTerminalShellProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "current-orders" | "all-orders" | "availability"
  >(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam === "current-orders" ||
        tabParam === "all-orders" ||
        tabParam === "availability"
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (
    tab: "current-orders" | "all-orders" | "availability",
  ) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      if (token) {
        url.searchParams.set("token", token);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  const liveOrders = useQuery(
    api.orders.getLiveOrders,
    business?.$id
      ? { businessId: business.$id as Id<"businesses"> }
      : "skip",
  );
  const activeOrdersCount =
    liveOrders?.filter(
      (o: any) => o.status === "in_progress" || o.status === "ready_for_pickup",
    ).length ?? 0;

  const navItems = [
    {
      id: "current-orders" as const,
      label: t("currentOrders"),
      icon: ClipboardText,
      count: activeOrdersCount,
    },
    {
      id: "all-orders" as const,
      label: t("allOrders"),
      icon: Archive,
    },
    {
      id: "availability" as const,
      label: "Verfügbarkeit",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-foreground">
      {/* Top Header */}
      <header
        aria-label="Zackisch Personal-Terminal Header"
        className="sticky top-0 z-40 h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4 print:hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
            className="lg:hidden inline-flex items-center justify-center size-10 rounded-lg border border-border bg-surface text-foreground"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <List className="size-5" />}
          </button>
          <img
            src="https://zackisch.com/brand/logo/lockups/signet--transparent--standard.svg"
            alt="Zackisch"
            className="size-6 rounded shrink-0"
          />
          <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">
            {business.name}
          </h2>
          <Badge label="Personal-Terminal" variant="neutral" />
          {activeOrdersCount > 0 && (
            <Badge
              label={`${activeOrdersCount} in Bearbeitung`}
              variant="info"
            />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <RegionLanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOutStaffAction(business.$id)}
          >
            <SignOut className="size-4" />
            <span>{t("signOut")}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop Side Navigation */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface p-4 gap-4 print:hidden">
          <div className="px-2 py-1">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Terminal
            </div>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Terminal">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <IconComp className="size-4 shrink-0" weight={isSelected ? "bold" : "regular"} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && item.count > 0 && (
                    <Badge
                      label={String(item.count)}
                      variant={isSelected ? "neutral" : "info"}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-10 w-72 max-w-[85vw] bg-surface border-r border-border p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-base">{business.name}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Schließen"
                  className="size-9 inline-flex items-center justify-center rounded-lg hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Terminal">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <IconComp className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge label={String(item.count)} variant="info" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="flex flex-col gap-6 w-full">
            {activeTab === "current-orders" && (
              <CurrentOrdersContent
                businessId={business.$id}
                orders={initialOrders}
                isStaffView={true}
              />
            )}
            {activeTab === "all-orders" && (
              <AllOrdersContent
                businessId={business.$id}
                orders={initialOrders}
              />
            )}
            {activeTab === "availability" && (
              <AvailabilityContent
                businessId={business.$id}
                categories={categories}
                items={items}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
