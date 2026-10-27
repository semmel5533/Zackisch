"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  ClipboardText,
  ForkKnife,
  Gear,
  SignOut,
  Archive,
  ArrowSquareOut,
  List,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/surfaces";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    navItems.find((item) => pathname === item.href)?.label ||
    business?.name ||
    "Dashboard";

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between gap-3 px-2 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/icon.svg"
              alt="Zackisch"
              className="w-7 h-7 rounded-md shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-[var(--zk-text)] truncate">
                {business?.name || "Zackisch"}
              </span>
              <span className="text-xs text-[var(--zk-text-secondary)] truncate">
                {business?.legalName || "Gastronomie"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[var(--zk-text)] hover:bg-[var(--zk-surface-muted)]"
            aria-label={t("close")}
          >
            <X size={20} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Dashboard Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComp = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--zk-action)] text-[var(--zk-action-fg)]"
                    : "text-[var(--zk-text-body)] hover:bg-[var(--zk-surface-muted)] hover:text-[var(--zk-text)]"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <IconComp
                    size={18}
                    weight={isActive ? "fill" : "regular"}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.count !== undefined && item.count > 0 && (
                  <Badge
                    variant={isActive ? "neutral" : "info"}
                    className="tabular-nums"
                  >
                    {item.count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2.5 p-4 border-t border-[var(--zk-border)]">
        {business?.$id && (
          <Link
            href={`/staff/${business.$id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="zk-button zk-button-secondary zk-button-md zk-full-width justify-between"
          >
            <span>Live-Terminal</span>
            <ArrowSquareOut size={16} weight="bold" aria-hidden="true" />
          </Link>
        )}
        <RegionLanguageSwitcher variant="secondary" size="md" isFullWidth />
        <form action={signOutAction} className="w-full">
          <Button variant="ghost" size="md" type="submit" fullWidth>
            <SignOut size={16} weight="bold" aria-hidden="true" />
            <span>{t("signOut")}</span>
          </Button>
        </form>
        {user?.email && (
          <p className="text-xs text-[var(--zk-text-secondary)] text-center truncate px-2">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--zk-page)] text-[var(--zk-text)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[var(--zk-border)] bg-[var(--zk-surface)] z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-[var(--zk-surface)] h-full shadow-xl z-10">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16 border-b border-[var(--zk-border)] bg-[var(--zk-surface)]/95 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--zk-text)] hover:bg-[var(--zk-surface-muted)]"
              aria-label="Open navigation"
            >
              <List size={22} weight="bold" aria-hidden="true" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--zk-text)] truncate">
              {currentTitle}
            </h1>
            {business?.name && (
              <Badge variant="neutral" className="hidden sm:inline-flex">
                {business.name}
              </Badge>
            )}
            {activeOrdersCount > 0 && (
              <Badge variant="info" className="tabular-nums">
                {activeOrdersCount} aktiv
              </Badge>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <div className="flex flex-col gap-6 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
