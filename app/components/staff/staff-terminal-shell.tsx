"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardText,
  Archive,
  SlidersHorizontal,
  SignOut,
} from "@phosphor-icons/react";
import { AppShell } from "@astryxdesign/core/AppShell";
import {
  SideNav,
  SideNavHeading,
  SideNavSection,
  SideNavItem,
} from "@astryxdesign/core/SideNav";
import { TopNav } from "@astryxdesign/core/TopNav";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
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
    <AppShell
      height="fill"
      variant="elevated"
      topNav={
        <TopNav
          label="Zackisch Personal-Terminal Header"
          startContent={
            <HStack gap={3} vAlign="center">
              <Heading level={4}>{business.name}</Heading>
              <Badge
                label="Personal-Terminal"
                variant="neutral"
              />
              {activeOrdersCount > 0 && (
                <Badge
                  label={`${activeOrdersCount} in Bearbeitung`}
                  variant="info"
                />
              )}
            </HStack>
          }
          endContent={
            <HStack gap={2} vAlign="center">
              <RegionLanguageSwitcher />
              <Button
                label={t("signOut")}
                variant="ghost"
                size="sm"
                icon={<Icon icon={SignOut} size="sm" />}
                onClick={() => signOutStaffAction(business.$id)}
              />
            </HStack>
          }
        />
      }
      sideNav={
        <SideNav
          collapsible
          header={
            <SideNavHeading
              icon={
                <img
                  src="/icon.svg"
                  alt="Zackisch"
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                />
              }
              heading={business.name}
              subheading="Personal-Terminal"
            />
          }
        >
          <SideNavSection title="Terminal">
            {navItems.map((item) => (
              <SideNavItem
                key={item.id}
                label={item.label}
                icon={<Icon icon={item.icon} size="sm" />}
                isSelected={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
                endContent={
                  item.count && item.count > 0 ? (
                    <Badge
                      label={String(item.count)}
                      variant="info"
                    />
                  ) : undefined
                }
              />
            ))}
          </SideNavSection>
        </SideNav>
      }
    >
      <Layout>
        <LayoutContent>
          <VStack gap={6} width="100%">
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
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
