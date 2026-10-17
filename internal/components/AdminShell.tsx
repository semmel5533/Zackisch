"use client";

import React, { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import {
  LayoutDashboard,
  Store,
  Receipt,
  Users,
  Handshake,
  Mail,
  History,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Circle,
  ExternalLink,
  LogOut,
  Loader2,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import { resolveBrandAsset } from "@zackisch/design-system";

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
      icon: LayoutDashboard,
      requiresAdmin: true,
      permission: null,
    },
    {
      name: isDe ? "Betriebe" : "Businesses",
      href: "/businesses",
      icon: Store,
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
      icon: LifeBuoy,
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
      icon: Mail,
      requiresAdmin: false,
      permission: "newsletter:read",
    },
    {
      name: isDe ? "E-Mail-Log" : "Email Log",
      href: "/emails",
      icon: History,
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
      icon: Settings,
      requiresAdmin: true,
      permission: null,
    },
  ];

  // Dynamic navigation filtered by role and permissions
  const navigation = ALL_NAV_ITEMS.filter((item) => {
    if (isRegionalAdmin) return true;
    if (item.requiresAdmin) return false;
    if (!item.permission) return true;
    return !!adminUser?.permissions?.includes(item.permission);
  });

  // Calculate default landing route for this user
  const defaultRoute = isRegionalAdmin
    ? "/"
    : navigation[0]?.href || "/orders";

  // Check access to current route
  const currentItem = ALL_NAV_ITEMS.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
  );

  const hasAccessToCurrentRoute =
    !currentItem ||
    isRegionalAdmin ||
    (!currentItem.requiresAdmin &&
      (!currentItem.permission || !!adminUser?.permissions?.includes(currentItem.permission)));

  // Route protection and redirection
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isSignInPage) {
        router.replace("/sign-in");
      } else if (isAuthenticated && isSignInPage) {
        router.replace(defaultRoute);
      }
    }
  }, [isLoading, isAuthenticated, isSignInPage, router, defaultRoute]);

  // Unauthenticated dedicated layout for /sign-in
  if (isSignInPage) {
    return <>{children}</>;
  }

  // Loading or redirecting state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] text-zinc-900 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
            {isDe ? "Lade Team Dashboard..." : "Loading Team Dashboard..."}
          </span>
        </div>
      </div>
    );
  }

  const currentTitle =
    currentItem?.name || (isDe ? "Team Dashboard" : "Team Dashboard");

  const handleLogout = () => {
    logout();
    router.replace("/sign-in");
  };

  return (
    <div className="min-h-screen flex bg-[#f9f9fb] text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0 select-none">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-zinc-100 flex flex-col gap-2">
          <Link href={defaultRoute} className="inline-block">
            <img
              src={resolveBrandAsset("combinationMarkSvg", { site: "internal" })}
              alt="Zackisch"
              className="h-8 w-auto block"
            />
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
              {isRegionalAdmin
                ? isDe ? "Team Dashboard" : "Team Dashboard"
                : isDe ? "Mitarbeiter-Portal" : "Staff Portal"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Region & Live Status & User Info */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 space-y-3">
          <div className="flex items-center justify-between text-[12px] text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              Live Backend
            </span>
            <span className="text-[11px] text-zinc-500">Convex Cloud</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-zinc-200/80">
            <div className="text-[12px] font-semibold text-zinc-900 truncate">
              {adminUser?.name || "Selim Eser"}
            </div>
            <div className="text-[11px] text-zinc-500 truncate">{adminEmail}</div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
              {isRegionalAdmin ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Regional-Admin ({currentRegion.toUpperCase()})</span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 text-zinc-600" />
                  <span>Mitarbeiter ({currentRegion.toUpperCase()})</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold text-zinc-600 transition-all shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isDe ? "Abmelden" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
              {currentTitle}
            </h1>
          </div>

          {/* Region Switcher & External Links */}
          <div className="flex items-center gap-3">
            <RegionLanguageSwitcher />

            {/* Quick Links */}
            <a
              href="https://zackisch.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-zinc-500 hover:text-black flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Website <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://app.zackisch.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-zinc-500 hover:text-black flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              App <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://support.zackisch.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-zinc-500 hover:text-black flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Support <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Page Content or Restricted View */}
        <main className="flex-1 p-8 overflow-y-auto">
          {hasAccessToCurrentRoute ? (
            children
          ) : (
            <div className="max-w-md mx-auto my-16 bg-white border border-zinc-200/80 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">
                  {isDe ? "Zugriff eingeschränkt" : "Access Restricted"}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {isDe
                    ? "Für diese Ansicht sind erweiterte Administrator-Rechte oder spezielle Modulberechtigungen erforderlich."
                    : "This section requires administrator privileges or specific permissions."}
                </p>
              </div>
              <Link
                href={defaultRoute}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-sm"
              >
                <span>{isDe ? "Zurück zur Hauptansicht" : "Back to Main View"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
