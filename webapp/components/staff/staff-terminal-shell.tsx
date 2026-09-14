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
import type { Organization, Order, MenuCategory, MenuItem } from "@/lib/types";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { AllOrdersContent } from "@/components/dashboard/all-orders-content";
import { AvailabilityContent } from "@/components/availability/availability-content";
import { signOutStaffAction } from "@/actions/staff-actions";

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
    organization?.$id
      ? { organizationId: organization.$id as Id<"organizations"> }
      : "skip",
  );
  const activeOrdersCount =
    liveOrders?.filter(
      (o: any) => o.status === "in_progress" || o.status === "ready_for_pickup",
    ).length ?? 0;

  const zakkigUrl = t("homepageUrl");

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
    await signOutStaffAction(organization.$id || organization._id);
  };

  return (
    <div className="flex h-screen w-full bg-primary overflow-hidden print:h-auto print:overflow-visible print:block">
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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-l border-primary-foreground/10 bg-primary text-primary-foreground lg:relative print:hidden",
          isExpanded ? "w-64" : "w-16",
          "max-lg:w-64", // Always wide on mobile
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-primary-foreground/10 shrink-0",
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
            <Link
              href={zakkigUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden"
            >
              <Image
                src="https://www.zakkig.com/full.svg"
                alt="zakkig logo"
                width={100}
                height={24}
                priority
                loading="eager"
                className="h-6 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex shrink-0 h-9 w-9 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer"
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
            className="lg:hidden shrink-0 h-9 w-9 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X weight="bold" className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
          <div className="px-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="default"
                    className={cn(
                      "w-full h-11 transition-colors relative overflow-visible rounded-full font-semibold cursor-pointer",
                      isExpanded
                        ? "justify-start px-4"
                        : "justify-center px-0 w-11 h-11 mx-auto",
                      isActive
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary shadow-xs"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground",
                    )}
                    aria-label={!isExpanded ? item.label : undefined}
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleTabChange(item.id);
                    }}
                  >
                    <div className="relative flex items-center justify-center shrink-0">
                      <item.icon
                        weight={isActive ? "fill" : "regular"}
                        className="h-5 w-5 shrink-0"
                      />
                      {!isExpanded &&
                        item.id === "current-orders" &&
                        activeOrdersCount > 0 && (
                          <span
                            className={cn(
                              "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full shadow-sm",
                              isActive
                                ? "bg-primary ring-2 ring-primary-foreground"
                                : "bg-primary-foreground ring-2 ring-primary",
                            )}
                          >
                            <span className="sr-only">{activeOrdersCount}</span>
                          </span>
                        )}
                    </div>
                    {isExpanded && (
                      <>
                        <span className="ml-2.5 flex-1 text-left truncate">
                          {item.label}
                        </span>
                        {item.id === "current-orders" &&
                          activeOrdersCount > 0 && (
                            <span
                              className={cn(
                                "h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 font-inter tabular-nums leading-none shadow-xs",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary-foreground text-primary",
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
            "border-t border-primary-foreground/10 flex flex-col gap-4 shrink-0",
            isExpanded ? "p-4" : "p-3 py-4",
          )}
        >
          {isExpanded ? (
            <div className="flex flex-col gap-2">
              {/* Mini Lieferando-style Banner Card with bottom-left logo */}
              <div className="relative w-full aspect-[2.3/1] rounded-[16px] overflow-hidden bg-black border border-white/15 shadow-sm">
                {organization?.bannerFileId ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getImagePreviewUrl(organization.bannerFileId)}
                    alt={organization?.name ?? "Banner"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black" />
                )}

                {/* Bottom-left logo box */}
                <div className="absolute bottom-2 left-2 z-10 w-10 h-10 rounded-[8px] bg-neutral-900 flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
                  {organization?.logoFileId ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImagePreviewUrl(organization.logoFileId)}
                      alt={organization?.name ?? "Logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900" />
                  )}
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-hidden px-0.5">
                <span className="truncate font-semibold text-sm leading-tight text-primary-foreground">
                  {organization?.name ?? "Zakkig"}
                </span>
                {organization?.address && (
                  <span className="text-xs text-primary-foreground/70 whitespace-pre-wrap leading-tight mt-1">
                    {organization.address}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              title={organization?.name ?? "Restaurant"}
            >
              <div className="w-10 h-10 rounded-[10px] bg-black flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
                {organization?.logoFileId ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getImagePreviewUrl(organization.logoFileId)}
                    alt={organization?.name ?? "Logo"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900" />
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
                  isExpanded ? "px-3" : "px-2.5 w-full",
                  "text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground",
                )}
              >
                <SignOut className="h-5 w-5 shrink-0" />
                {isExpanded && <span className="ml-1">{t("signOut")}</span>}
              </Button>
            </form>
            <LanguageSwitcher
              variant="ghost"
              className="w-10 h-10 rounded-full p-0 flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground shrink-0 cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background lg:rounded-l-[1.5rem] shadow-sm print:overflow-visible print:block print:bg-white print:shadow-none @container">
        {/* Mobile Header (lg:hidden) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary-foreground/10 px-4 lg:hidden print:hidden bg-primary text-primary-foreground">
          <Link href={zakkigUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src="https://www.zakkig.com/full.svg"
              alt="Zakkig"
              width={100}
              height={24}
              priority
              loading="eager"
              className="h-6 w-auto brightness-0 invert"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground cursor-pointer"
            aria-label="Open menu"
          >
            <List weight="bold" className="h-6 w-6" />
          </Button>
        </header>

        {/* Content View */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 pt-0 lg:pt-0 print:overflow-visible print:p-0 print:block">
          {activeTab === "current-orders" && (
            <CurrentOrdersContent
              organizationId={organization.$id}
              orders={structuredClone(initialOrders)}
              isStaffView={true}
            />
          )}

          {activeTab === "all-orders" && (
            <AllOrdersContent
              organizationId={organization.$id}
              orders={structuredClone(initialOrders)}
              hideExport={true}
            />
          )}

          {activeTab === "availability" && (
            <AvailabilityContent
              organizationId={organization.$id}
              categories={structuredClone(categories)}
              items={structuredClone(items)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
