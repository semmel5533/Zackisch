"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  Storefront,
  Receipt,
  Lifebuoy,
  Users,
  Handshake,
  EnvelopeSimple,
  ClockCounterClockwise,
  ShieldCheck,
  ShieldWarning,
  GearSix,
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
import { Layout, LayoutHeader, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";

interface AdminShellProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  requiresAdmin?: boolean;
  permission?: string | null;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    currentRegion,
    adminEmail,
    adminUser,
    logout,
    currentLocale,
  } = useAdmin();

  const isDe = currentLocale !== "en";
  const isSignInPage = pathname === "/sign-in";
  const isRegionalAdmin = adminUser?.role === "regional_admin";

  const ALL_NAV_ITEMS: NavItem[] = [
    {
      name: isDe ? "Übersicht" : "Overview",
      href: "/",
      icon: SquaresFour,
      requiresAdmin: true,
      permission: null,
    },
    {
      name: isDe ? "Betriebe" : "Businesses",
      href: "/businesses",
      icon: Storefront,
      requiresAdmin: false,
      permission: "restaurants:read",
    },
    {
      name: isDe ? "Bestellungen" : "Orders",
      href: "/orders",
      icon: Receipt,
      requiresAdmin: false,
      permission: "orders:read",
    },
    {
      name: isDe ? "Support-Tickets" : "Support Tickets",
      href: "/tickets",
      icon: Lifebuoy,
      requiresAdmin: false,
      permission: "tickets:read",
    },
    {
      name: isDe ? "Mitarbeiter" : "Staff",
      href: "/staff",
      icon: Users,
      requiresAdmin: false,
      permission: "staff:manage",
    },
    {
      name: isDe ? "Vertriebspartner" : "Partners",
      href: "/partners",
      icon: Handshake,
      requiresAdmin: false,
      permission: "partners:read",
    },
    {
      name: "Newsletter",
      href: "/newsletter",
      icon: EnvelopeSimple,
      requiresAdmin: false,
      permission: "newsletter:read",
    },
    {
      name: isDe ? "E-Mail-Log" : "Email Log",
      href: "/emails",
      icon: ClockCounterClockwise,
      requiresAdmin: true,
      permission: null,
    },
    {
      name: isDe ? "Audit-Trail" : "Audit Trail",
      href: "/audit",
      icon: ShieldCheck,
      requiresAdmin: false,
      permission: "audit:read",
    },
    {
      name: isDe ? "Einstellungen" : "Settings",
      href: "/settings",
      icon: GearSix,
      requiresAdmin: true,
      permission: null,
    },
  ];

  const navigation = ALL_NAV_ITEMS.filter((item) => {
    if (isRegionalAdmin) return true;
    if (item.requiresAdmin) return false;
    if (!item.permission) return true;
    return !!adminUser?.permissions?.includes(item.permission);
  });

  const defaultRoute = isRegionalAdmin ? "/" : navigation[0]?.href || "/orders";

  const currentItem = ALL_NAV_ITEMS.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
  );

  const hasAccessToCurrentRoute =
    !currentItem ||
    isRegionalAdmin ||
    (!currentItem.requiresAdmin &&
      (!currentItem.permission || !!adminUser?.permissions?.includes(currentItem.permission)));

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isSignInPage) {
        router.replace("/sign-in");
      } else if (isAuthenticated && isSignInPage) {
        router.replace(defaultRoute);
      }
    }
  }, [isLoading, isAuthenticated, isSignInPage, router, defaultRoute]);

  if (isSignInPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) {
    return (
      <AppShell height="fill" variant="wash">
        <Layout height="fill">
          <LayoutContent>
            <VStack gap={3} hAlign="center" vAlign="center" height="100%">
              <Spinner
                size="lg"
                label={isDe ? "Lade Team Dashboard..." : "Loading Team Dashboard..."}
              />
            </VStack>
          </LayoutContent>
        </Layout>
      </AppShell>
    );
  }

  const currentTitle = currentItem?.name || "Team Dashboard";

  const handleLogout = () => {
    logout();
    router.replace("/sign-in");
  };

  return (
    <AppShell
      height="fill"
      variant="elevated"
      topNav={
        <TopNav
          label="Team Dashboard Header Navigation"
          startContent={
            <HStack gap={2} vAlign="center">
              <Heading level={4}>{currentTitle}</Heading>
              <Badge
                variant="neutral"
                label={`Region ${currentRegion.toUpperCase()}`}
              />
            </HStack>
          }
          endContent={
            <HStack gap={2} vAlign="center">
              <RegionLanguageSwitcher />
              <Button
                label="Website"
                href="https://zackisch.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                endContent={<Icon icon="externalLink" size="xsm" />}
              />
              <Button
                label="App"
                href="https://app.zackisch.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                endContent={<Icon icon="externalLink" size="xsm" />}
              />
              <Button
                label="Support"
                href="https://support.zackisch.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                endContent={<Icon icon="externalLink" size="xsm" />}
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
                  className="h-6 w-6 rounded-sm"
                />
              }
              heading="Zackisch"
              subheading={
                isRegionalAdmin
                  ? isDe
                    ? "Team Dashboard"
                    : "Team Dashboard"
                  : isDe
                    ? "Mitarbeiter-Portal"
                    : "Staff Portal"
              }
              headingHref={defaultRoute}
            />
          }
          footer={
            <VStack gap={2} padding={2}>
              <HStack justify="between" vAlign="center">
                <HStack gap={1.5} vAlign="center">
                  <StatusDot variant="success" label="Live Backend" isPulsing />
                  <Text type="supporting">Live Backend</Text>
                </HStack>
                <Text type="supporting">Convex Cloud</Text>
              </HStack>

              <VStack gap={0.5}>
                <Text type="label" maxLines={1}>
                  {adminUser?.name || "Selim Eser"}
                </Text>
                <Text type="supporting" maxLines={1}>
                  {adminEmail}
                </Text>
                <HStack gap={1} vAlign="center">
                  <Badge
                    variant="neutral"
                    label={
                      isRegionalAdmin
                        ? `Regional-Admin (${currentRegion.toUpperCase()})`
                        : `Mitarbeiter (${currentRegion.toUpperCase()})`
                    }
                  />
                </HStack>
              </VStack>

              <Button
                label={isDe ? "Abmelden" : "Sign Out"}
                variant="secondary"
                size="sm"
                width="100%"
                icon={<Icon icon={SignOut} size="sm" />}
                onClick={handleLogout}
              />
            </VStack>
          }
        >
          <SideNavSection
            title={isDe ? "Verwaltung" : "Administration"}
            isHeaderHidden
          >
            {navigation.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <SideNavItem
                  key={item.href}
                  label={item.name}
                  href={item.href}
                  icon={item.icon}
                  selectedIcon={item.icon}
                  isSelected={isActive}
                />
              );
            })}
          </SideNavSection>
        </SideNav>
      }
    >
      <Layout height="fill">
        <LayoutContent padding={6}>
          {hasAccessToCurrentRoute ? (
            children
          ) : (
            <VStack hAlign="center" vAlign="center" minHeight={420}>
              <EmptyState
                icon={<Icon icon={ShieldWarning} size="lg" color="error" />}
                title={isDe ? "Zugriff eingeschränkt" : "Access Restricted"}
                description={
                  isDe
                    ? "Für diese Ansicht sind erweiterte Administrator-Rechte oder spezielle Modulberechtigungen erforderlich."
                    : "This section requires administrator privileges or specific permissions."
                }
                actions={
                  <Button
                    label={isDe ? "Zurück zur Hauptansicht" : "Back to Main View"}
                    variant="primary"
                    href={defaultRoute}
                  />
                }
              />
            </VStack>
          )}
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
