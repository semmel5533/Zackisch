"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardText,
  Archive,
  SlidersHorizontal,
  CaretLeft,
  CaretRight,
  X,
  List,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useSidebarStore } from "@/store/sidebar-store";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { PublicRestaurant, Order, MenuCategory, MenuItem } from "@/lib/types";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { AllOrdersContent } from "@/components/dashboard/all-orders-content";
import { AvailabilityContent } from "@/components/availability/availability-content";
import { signOutStaffAction } from "@/actions/staff-actions";

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
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "current-orders" | "all-orders" | "availability"
  >(initialTab);

  // Read initial tab from URL if present
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

  // Update URL on tab change without full reload
  const handleTabChange = (
    tab: "current-orders" | "all-orders" | "availability",
  ) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      if (token) {
        url.searchParams.set("token", token);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Real-time active orders subscription
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
    },
    {
      id: "all-orders" as const,
      label: t("allOrders"),
      icon: Archive,
    },
    {
      id: "availability" as const,
      label: t("availability"),
      icon: SlidersHorizontal,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOutStaffAction(business.$id || business._id);
    } catch {
      // Ignore redirect error
    }
    window.location.replace("https://zackisch.com");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden print:h-auto print:overflow-visible print:block">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden block w-full h-full cursor-default border-none p-0"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:relative print:hidden",
          isExpanded ? "w-72" : "w-16",
          "max-lg:w-72", // Always wide on mobile
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 max-lg:hidden",
        )}
      >

        {/* Sidebar Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border shrink-0",
            isExpanded
              ? "justify-between px-4"
              : "lg:justify-center lg:px-2 justify-between px-4",
          )}
        >
          {/* Logo on desktop when expanded OR on mobile in drawer */}
          <div
            className={cn(
              isExpanded ? "flex" : "lg:hidden flex",
              "flex-1",
            )}
          >
            <div className="overflow-hidden">
              <img
                src={"/combination_mark.svg"}
                alt="Zackisch logo"
                width={100}
                height={24}
                loading="eager"
                className="h-6 w-auto brightness-0 select-none"
              />
            </div>
          </div>

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            {isExpanded ? (
              <CaretLeft weight="bold" />
            ) : (
              <CaretRight weight="bold" />
            )}
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label="Close sidebar"
          >
            <X weight="bold" className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
          <div className="px-2.5">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="default"
                    className={cn(
                      "h-11 transition-colors relative overflow-visible rounded-full font-semibold cursor-pointer p-0 justify-start",
                      isExpanded ? "w-full" : "w-11 mx-auto",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    aria-label={!isExpanded ? item.label : undefined}
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleTabChange(item.id);
                    }}
                  >
                    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                      <item.icon
                        weight={isActive ? "fill" : "regular"}
                        className="size-5 shrink-0"
                      />
                      {!isExpanded &&
                        item.id === "current-orders" &&
                        activeOrdersCount > 0 && (
                          <span
                            className={cn(
                              "absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full shadow-sm",
                              isActive
                                ? "bg-background ring-2 ring-primary"
                                : "bg-primary ring-2 ring-background",
                            )}
                          >
                            <span className="sr-only">{activeOrdersCount}</span>
                          </span>
                        )}
                    </div>
                    {isExpanded && (
                      <>
                        <span className="flex-1 text-left truncate">
                          {item.label}
                        </span>
                        {item.id === "current-orders" &&
                          activeOrdersCount > 0 && (
                            <span
                              className={cn(
                                "mr-2.5 h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 font-inter tabular-nums leading-none shadow-xs",
                                isActive
                                  ? "bg-background text-foreground"
                                  : "bg-primary text-primary-foreground",
                              )}
                            >
                              {activeOrdersCount}
                            </span>
                          )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div
          className={cn(
            "border-t border-border flex flex-col gap-4 shrink-0",
            isExpanded ? "p-4" : "p-3 py-4",
          )}
        >
          {isExpanded ? (
            <div className="flex flex-col gap-2">
              {/* Mini Lieferando-style Banner Card with bottom-left logo */}
              <div className="relative w-full aspect-[2.3/1] rounded-[16px] overflow-hidden bg-muted border border-border shadow-sm">
                {business.bannerUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getImagePreviewUrl(business.bannerUrl)}
                    alt={business?.name ?? "Banner"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}

                {/* Bottom-left logo box */}
                <div className="absolute bottom-2 left-2 z-10 w-10 h-10 rounded-[8px] bg-card flex items-center justify-center overflow-hidden border border-border shrink-0">
                  {business.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImagePreviewUrl(business.logoUrl)}
                      alt={business?.name ?? "Logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-hidden px-0.5">
                <span className="truncate font-semibold text-sm leading-tight text-foreground">
                  {business?.name ?? "Zakkig"}
                </span>
                {business?.address && (
                  <span className="text-xs text-muted-foreground whitespace-pre-wrap leading-tight mt-1">
                    {business.address}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              title={business?.name ?? "Restaurant"}
            >
              <div className="w-10 h-10 rounded-[10px] bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                {business.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getImagePreviewUrl(business.logoUrl)}
                    alt={business?.name ?? "Logo"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex items-center gap-2",
              !isExpanded ? "flex-col" : "justify-between",
            )}
          >
            <form action={handleSignOut} className={cn(!isExpanded && "w-full")}>
              <Button
                type="submit"
                variant="ghost"
                className={cn(
                  "justify-start h-10 overflow-hidden cursor-pointer",
                  isExpanded ? "px-3 rounded-full font-semibold" : "px-2.5 w-full rounded-full",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-label={!isExpanded ? t("signOut") : undefined}
              >
                <SignOut className="h-5 w-5 shrink-0" />
                {isExpanded && <span className="ml-1">{t("signOut")}</span>}
              </Button>
            </form>
            <LanguageSwitcher
              variant="ghost"
              className="w-10 h-10 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-canvas print:overflow-visible print:block print:bg-white print:shadow-none @container">
        {/* Mobile Header (lg:hidden) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 lg:hidden print:hidden bg-canvas text-foreground">
          <div className="flex items-center">
            <img
              src={"/combination_mark.svg"}
              alt="Zackisch"
              width={100}
              height={24}
              loading="eager"
              className="h-6 w-auto brightness-0 select-none"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Open menu"
          >
            <List weight="bold" className="h-6 w-6" />
          </Button>
        </header>

        {/* Content View */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 pt-0 lg:pt-0 print:overflow-visible print:p-0 print:block">
          {activeTab === "current-orders" && (
            <CurrentOrdersContent
              businessId={business.$id}
              orders={structuredClone(initialOrders)}
              isStaffView={true}
            />
          )}

          {activeTab === "all-orders" && (
            <AllOrdersContent
              businessId={business.$id}
              orders={structuredClone(initialOrders)}
              hideExport={true}
            />
          )}

          {activeTab === "availability" && (
            <AvailabilityContent
              businessId={business.$id}
              categories={structuredClone(categories)}
              items={structuredClone(items)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
