"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  ClipboardText,
  ForkKnife,
  Gear,
  SignOut,
  Archive,
} from "@phosphor-icons/react";
import { AppShell } from "@astryxdesign/core/AppShell";
import {
  SideNav,
  SideNavHeading,
  SideNavSection,
  SideNavItem,
} from "@astryxdesign/core/SideNav";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import type { Business } from "@/lib/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { signOutAction } from "@/actions/auth-actions";

interface DashboardShellProps {
  business: Business | null;
  user: { name?: string; email?: string; [key: string]: any };
  children: React.ReactNode;
}

export function DashboardShell({
  business,
  user,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const liveOrders = useQuery(
    api.orders.getLiveOrders,
    business?.$id
      ? { businessId: business.$id as Id<"businesses"> }
      : "skip"
  );
  const activeOrdersCount =
    liveOrders?.filter(
      (o: any) => o.status === "in_progress" || o.status === "ready_for_pickup",
    ).length ?? 0;

  const navItems = [
    {
      label: t("overview"),
      href: `/dashboard/${business?.$id ?? "new"}/overview`,
      icon: ChartBar,
    },
    {
      label: t("menu"),
      href: `/dashboard/${business?.$id ?? "new"}/menu`,
      icon: ForkKnife,
    },
    {
      label: t("currentOrders"),
      href: `/dashboard/${business?.$id ?? "new"}/current-orders`,
      icon: ClipboardText,
      count: activeOrdersCount,
    },
    {
      label: t("allOrders"),
      href: `/dashboard/${business?.$id ?? "new"}/all-orders`,
      icon: Archive,
    },
    {
      label: t("settings"),
      href: `/dashboard/${business?.$id ?? "new"}/settings`,
      icon: Gear,
    },
  ];

  const currentTitle =
    navItems.find((item) => pathname === item.href)?.label || business?.name || "Dashboard";

  return (
    <AppShell
      height="fill"
      variant="elevated"
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
              heading={business?.name || "Zackisch"}
              subheading={business?.legalName || "Gastronomie"}
            />
          }
          footer={
            <VStack gap={2} padding={3} width="100%">
              {business?.$id && (
                <Button
                  label="Live-Terminal"
                  variant="secondary"
                  size="lg"
                  href={`/staff/${business.$id}`}
                  target="_blank"
                  endContent={<Icon icon="externalLink" size="sm" />}
                  width="100%"
                />
              )}
              <RegionLanguageSwitcher variant="secondary" size="lg" isFullWidth />
              <form action={signOutAction} style={{ width: "100%" }}>
                <Button
                  label={t("signOut")}
                  variant="ghost"
                  size="lg"
                  type="submit"
                  icon={<Icon icon={SignOut} size="sm" />}
                  width="100%"
                />
              </form>
              {user?.email && (
                <Text color="secondary" type="supporting" justify="center">
                  {user.email}
                </Text>
              )}
            </VStack>
          }
        >
          <SideNavSection title="Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SideNavItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  icon={<Icon icon={item.icon} size="sm" />}
                  isSelected={isActive}
                  endContent={
                    item.count && item.count > 0 ? (
                      <Badge
                        label={String(item.count)}
                        variant="info"
                      />
                    ) : undefined
                  }
                />
              );
            })}
          </SideNavSection>
        </SideNav>
      }
    >
      <Layout>
        <LayoutContent>
          <VStack gap={6} width="100%">
            <HStack justify="between" vAlign="center" width="100%">
              <HStack gap={3} vAlign="center">
                <Heading level={3}>{currentTitle}</Heading>
                {business?.name && (
                  <Badge
                    label={business.name}
                    variant="neutral"
                  />
                )}
                {activeOrdersCount > 0 && (
                  <Badge
                    label={`${activeOrdersCount} aktiv`}
                    variant="info"
                  />
                )}
              </HStack>
            </HStack>
            {children}
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
