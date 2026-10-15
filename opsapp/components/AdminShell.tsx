"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
  Circle,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import { AdminLoginForm } from "./AdminLoginForm";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
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

  const navigation = [
    { name: isDe ? "Übersicht" : "Overview", href: "/", icon: LayoutDashboard },
    { name: isDe ? "Betriebe" : "Organizations", href: "/organizations", icon: Store },
    { name: isDe ? "Bestellungen" : "Orders", href: "/orders", icon: Receipt },
    { name: isDe ? "Mitarbeiter" : "Staff", href: "/staff", icon: Users },
    { name: isDe ? "Vertriebspartner" : "Partners", href: "/partners", icon: Handshake },
    { name: "Newsletter", href: "/newsletter", icon: Mail },
    { name: isDe ? "E-Mail-Log" : "Email Log", href: "/emails", icon: History },
    { name: isDe ? "Audit-Trail" : "Audit Trail", href: "/audit", icon: ShieldCheck },
    { name: isDe ? "Einstellungen" : "Settings", href: "/settings", icon: Settings },
  ];

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] text-zinc-900 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
            {isDe ? "Lade Zentrale..." : "Loading Hub..."}
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Show Admin Login Form
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  // 3. Authenticated State -> Show Admin Shell
  const currentTitle =
    navigation.find((n) =>
      n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
    )?.name || (isDe ? "Zentrale" : "Hub");

  return (
    <div className="min-h-screen flex bg-[#f9f9fb] text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0 select-none">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-zinc-100 flex flex-col gap-2">
          <Link href="/" className="inline-block">
            <img
              src="/combination_mark.svg"
              alt="Zackisch"
              className="h-8 w-auto block"
            />
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
              {isDe ? "Operative Zentrale" : "Operations Hub"}
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
            <div className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
              {adminUser?.role === "regional_admin" ? "Regional-Admin" : "Staff"} ({currentRegion.toUpperCase()})
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
