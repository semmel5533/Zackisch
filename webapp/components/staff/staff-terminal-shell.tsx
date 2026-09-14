"use client";

import { useState, useEffect } from "react";
import {
  ClipboardText,
  Archive,
  SlidersHorizontal,
  CaretLeft,
  CaretRight,
  Globe,
  UsersThree,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Organization, Order, MenuCategory, MenuItem } from "@/lib/types";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { AllOrdersContent } from "@/components/dashboard/all-orders-content";
import { AvailabilityContent } from "@/components/availability/availability-content";

interface StaffTerminalShellProps {
  organization: Organization;
  initialOrders: Order[];
  categories: MenuCategory[];
  items: MenuItem[];
  initialTab?: "current-orders" | "all-orders" | "availability";
  token?: string;
}

export function StaffTerminalShell({
  organization,
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
  const [isExpanded, setIsExpanded] = useState(true);

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
    organization?.$id
      ? { organizationId: organization.$id as Id<"organizations"> }
      : "skip",
  );
  const activeOrdersCount =
    liveOrders?.filter(
      (o: any) => o.status === "in_progress" || o.status === "ready_for_pickup",
    ).length ?? 0;

  const logoUrl = organization.logoFileId
    ? getImagePreviewUrl(organization.logoFileId)
    : organization.logoUrl || null;

  const navItems = [
    {
      id: "current-orders" as const,
      label: t("currentOrders"),
      icon: ClipboardText,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
    },
    {
      id: "all-orders" as const,
      label: t("allOrders"),
      icon: Archive,
      badge: null,
    },
    {
      id: "availability" as const,
      label: t("availability"),
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  return (
    <div className="flex h-screen h-dvh w-full bg-background overflow-hidden">
      {/* Desktop & Landscape Tablet Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-primary-foreground/10 bg-primary text-primary-foreground select-none shrink-0 transition-all duration-300 relative z-30",
          isExpanded ? "w-64" : "w-16",
        )}
      >
        {/* Sidebar Header: Organization Branding */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-primary-foreground/10 shrink-0",
            isExpanded ? "justify-between px-4" : "justify-center px-2",
          )}
        >
          {isExpanded ? (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 rounded-xl border border-primary-foreground/15 shrink-0 bg-white/10">
                {logoUrl ? (
                  <AvatarImage
                    src={logoUrl}
                    alt={organization.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold text-xs rounded-xl">
                  {organization.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm leading-tight text-primary-foreground truncate">
                  {organization.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70 bg-white/10 px-1.5 py-0.2 rounded-md border border-white/10">
                    {t("staff")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Avatar className="h-9 w-9 rounded-xl border border-primary-foreground/15 bg-white/10">
              {logoUrl ? (
                <AvatarImage
                  src={logoUrl}
                  alt={organization.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold text-xs rounded-xl">
                {organization.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center rounded-full transition-all duration-150 cursor-pointer",
                  isExpanded
                    ? "px-3.5 py-2.5 gap-3 justify-between"
                    : "h-11 w-full justify-center p-0",
                  isActive
                    ? "bg-white text-black font-bold shadow-xs hover:bg-white"
                    : "text-primary-foreground/75 font-semibold hover:bg-white/10 hover:text-primary-foreground",
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-black" : "text-primary-foreground/80",
                    )}
                    weight={isActive ? "bold" : "regular"}
                  />
                  {isExpanded && (
                    <span className="text-sm truncate leading-none">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Badge for active orders */}
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full font-inter font-bold tabular-nums shrink-0",
                      isExpanded
                        ? "px-2 py-0.5 text-xs"
                        : "absolute top-1.5 right-1.5 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center",
                      isActive
                        ? "bg-black text-white"
                        : "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Language Switcher & Collapse Button */}
        <div
          className={cn(
            "p-3 border-t border-primary-foreground/10 flex items-center gap-2",
            isExpanded ? "justify-between" : "flex-col justify-center",
          )}
        >
          <LanguageSwitcher
            variant="ghost"
            className="w-10 h-10 rounded-full p-0 flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground shrink-0 cursor-pointer"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full h-9 w-9 shrink-0 cursor-pointer"
            aria-label={isExpanded ? "Sidebar einklappen" : "Sidebar ausklappen"}
          >
            {isExpanded ? (
              <CaretLeft className="h-4 w-4" weight="bold" />
            ) : (
              <CaretRight className="h-4 w-4" weight="bold" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Mobile & Tablet Header (< 1024px) */}
        <header className="lg:hidden flex h-14 items-center justify-between border-b border-border bg-card px-4 shrink-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 rounded-lg border border-border shrink-0 bg-muted">
              {logoUrl ? (
                <AvatarImage
                  src={logoUrl}
                  alt={organization.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-muted text-foreground font-bold text-xs">
                {organization.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm text-foreground truncate">
                {organization.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md border border-border shrink-0">
                {t("staff")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher
              variant="outline"
              className="h-9 px-3 rounded-full text-xs font-semibold cursor-pointer"
            />
          </div>
        </header>

        {/* Active Tab View */}
        <main
          className={cn(
            "flex-1 min-h-0 overflow-hidden flex flex-col",
            "pb-16 lg:pb-0", // Space for mobile bottom tab bar
          )}
        >
          {activeTab === "current-orders" && (
            <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4 md:p-5 flex flex-col @container">
              <CurrentOrdersContent
                organizationId={organization.$id}
                orders={structuredClone(initialOrders)}
                isStaffView={true}
              />
            </div>
          )}

          {activeTab === "all-orders" && (
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 @container">
              <AllOrdersContent
                organizationId={organization.$id}
                orders={structuredClone(initialOrders)}
                hideExport={true}
              />
            </div>
          )}

          {activeTab === "availability" && (
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-6 pt-0 @container">
              <AvailabilityContent
                organizationId={organization.$id}
                categories={structuredClone(categories)}
                items={structuredClone(items)}
              />
            </div>
          )}
        </main>

        {/* Mobile & Tablet Bottom Tab Bar (iOS Style) (< 1024px) */}
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-background/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-2"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 relative cursor-pointer transition-colors",
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground font-medium hover:text-foreground",
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive ? "scale-110" : "scale-100",
                    )}
                    weight={isActive ? "bold" : "regular"}
                  />
                  {item.badge !== null && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-inter font-bold tabular-nums flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-none truncate max-w-[90px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
