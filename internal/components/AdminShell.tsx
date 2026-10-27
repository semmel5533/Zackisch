"use client";

import React, { ReactNode, useEffect } from "react";
import Link from "next/link";
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
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import {
  Card,
  Button,
  Badge,
  StatusDot,
  Spinner,
} from "@/components/ui/primitives";

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
      (!currentItem.permission ||
        !!adminUser?.permissions?.includes(currentItem.permission)));

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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--zk-bg)]">
        <Spinner
          size="lg"
          label={isDe ? "Lade Team Dashboard..." : "Loading Team Dashboard..."}
        />
      </div>
    );
  }

  const currentTitle = currentItem?.name || "Team Dashboard";

  const handleLogout = () => {
    logout();
    router.replace("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--zk-bg)] text-[var(--zk-text-body)]">
      {/* Sidebar */}
      <aside className="w-full lg:w-[272px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--zk-border)] bg-[var(--zk-surface)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-[var(--zk-border)]">
            <Link href={defaultRoute} className="inline-flex items-center gap-2">
              <img
                src="/zackisch/combination-mark.svg"
                alt="Zackisch"
                className="h-6 w-auto block"
              />
            </Link>
            <Badge variant="neutral">INTERNAL</Badge>
          </div>

          <nav
            aria-label={isDe ? "Verwaltung" : "Administration"}
            className="p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto"
          >
            {navigation.map((item) => {
              const IconComp = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[var(--zk-action)] text-[var(--zk-action-fg)]"
                      : "text-[var(--zk-text-body)] hover:bg-[var(--zk-surface-muted)] hover:text-[var(--zk-text)]"
                  }`}
                >
                  <IconComp
                    className="size-4 shrink-0"
                    weight={isActive ? "bold" : "regular"}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--zk-border)] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[var(--zk-text-secondary)]">
            <div className="inline-flex items-center gap-1.5">
              <StatusDot variant="success" label="Live Backend" />
              <span>Live Backend</span>
            </div>
            <span>Convex Cloud</span>
          </div>

          <Card padding="sm" variant="muted">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-[var(--zk-text)] truncate">
                {adminUser?.name || "Selim Eser"}
              </div>
              <div className="text-xs text-[var(--zk-text-secondary)] truncate">
                {adminEmail}
              </div>
              <div className="pt-1">
                <Badge variant="neutral">
                  {isRegionalAdmin
                    ? `Regional-Admin (${currentRegion.toUpperCase()})`
                    : `Mitarbeiter (${currentRegion.toUpperCase()})`}
                </Badge>
              </div>
            </div>
          </Card>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={handleLogout}
          >
            <SignOut className="size-4" aria-hidden="true" />
            <span>{isDe ? "Abmelden" : "Sign Out"}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="w-full border-b border-[var(--zk-border)] bg-[var(--zk-surface)] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-[var(--zk-text)]">
              {currentTitle}
            </h2>
            <Badge variant="neutral">Region {currentRegion.toUpperCase()}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RegionLanguageSwitcher />
            <Button variant="ghost" size="sm" href="https://zackisch.com">
              <span>Website</span>
              <ArrowSquareOut className="size-3.5" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm" href="https://app.zackisch.com">
              <span>App</span>
              <ArrowSquareOut className="size-3.5" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm" href="https://support.zackisch.com">
              <span>Support</span>
              <ArrowSquareOut className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          {hasAccessToCurrentRoute ? (
            children
          ) : (
            <div className="py-24 flex justify-center">
              <Card padding="lg" className="max-w-md text-center">
                <div className="flex flex-col items-center gap-3">
                  <ShieldWarning
                    className="size-10 text-[var(--zk-error-text)]"
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-bold text-[var(--zk-text)]">
                    {isDe ? "Zugriff eingeschränkt" : "Access Restricted"}
                  </h2>
                  <p className="text-sm text-[var(--zk-text-secondary)]">
                    {isDe
                      ? "Für diese Ansicht sind erweiterte Administrator-Rechte oder spezielle Modulberechtigungen erforderlich."
                      : "This section requires administrator privileges or specific permissions."}
                  </p>
                  <Button variant="primary" href={defaultRoute}>
                    {isDe ? "Zurück zur Hauptansicht" : "Back to Main View"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
