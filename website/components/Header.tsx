"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Globe, List, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageModal } from "./RegionLanguageModal";
import { buttonVariants } from "./ui/button-variants";
import { cn } from "@/lib/utils";

const navigation = [
  ["flowUrl", "navFlow"],
  ["pricingUrl", "navPricing"],
  ["faqUrl", "navFaq"],
] as const;

export function Header() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-md"
        href="#content"
      >
        {t("skipContent")}
      </a>
      <header ref={headerRef} className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] relative z-20 flex min-h-[72px] items-center justify-between gap-3 min-[721px]:min-h-[104px] min-[721px]:gap-6">
        <Link href={t("homeUrl")} className="shrink-0" onClick={() => setMenuOpen(false)}>
          <img src="/full.svg" width="122" height="40" alt={t("logoAlt")} fetchPriority="high" className="h-auto w-[96px] min-[721px]:w-[122px] max-[359px]:w-[76px]" />
        </Link>
        <nav
          id="main-navigation"
          aria-label={t("mainNavigation")}
          className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-[68px] z-50 flex-col rounded-[20px] border border-border bg-background p-4 shadow-[0_16px_32px_-8px_rgba(0,0,0,.12)] min-[721px]:static min-[721px]:flex min-[721px]:flex-row min-[721px]:items-center min-[721px]:gap-8 min-[721px]:border-0 min-[721px]:bg-transparent min-[721px]:p-0 min-[721px]:shadow-none`}
        >
          {navigation.map(([url, label]) => (
            <a
              key={url}
              href={t(url)}
              onClick={() => setMenuOpen(false)}
              className="group relative flex min-h-11 items-center rounded-[12px] px-3.5 text-sm font-semibold uppercase tracking-[.08em] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-[721px]:min-h-9 min-[721px]:px-0 min-[721px]:text-[13px] min-[721px]:hover:bg-transparent"
            >
              <span className="relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-250 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
                {t(label)}
              </span>
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2.5 border-t border-border pt-4 min-[721px]:hidden">
            <a href={t("signInUrl")} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              <span>{t("signIn")}</span>
              <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" />
            </a>
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), "w-full")} onClick={() => { setMenuOpen(false); setIsModalOpen(true); }}>
              <Globe size={18} aria-hidden="true" />{t("regionDisplay")}
            </button>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <a href={t("signInUrl")} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden min-[721px]:inline-flex")}>
            <span>{t("signIn")}</span>
            <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
          </a>
          <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden min-[721px]:inline-flex min-[721px]:px-3 min-[1101px]:px-4")} aria-label={t("regionSelectorTitle")} onClick={() => setIsModalOpen(true)}>
            <Globe size={16} aria-hidden="true" />
            <span className="hidden min-[1101px]:inline">{t("regionDisplay")}</span>
          </button>
          <button ref={menuButtonRef} type="button" className="grid size-11 place-items-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-[721px]:hidden" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={t(menuOpen ? "closeMenu" : "menuLabel")} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>
      {isModalOpen && <RegionLanguageModal isOpen onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
