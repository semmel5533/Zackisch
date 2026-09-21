"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Globe, List, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageModal } from "./RegionLanguageModal";

export function Header() {
  const { t, locale } = useTranslation();
  const pathname = usePathname() || "";
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    urlKey: Parameters<typeof t>[0],
  ) => {
    setMenuOpen(false);
    const href = t(urlKey);
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const targetId = href.slice(hashIndex + 1);
    const targetPath = href.slice(0, hashIndex);

    e.preventDefault();

    const isCurrentPage =
      pathname === targetPath ||
      pathname === `${targetPath}/` ||
      pathname.endsWith(targetPath);

    if (isCurrentPage) {
      const el = document.getElementById(targetId);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - 32;
        window.scrollTo({ top, behavior: "smooth" });
      }
      if (window.location.hash) {
        window.history.replaceState(null, "", targetPath);
      }
    } else {
      try {
        sessionStorage.setItem("zakkig_scroll_target", targetId);
      } catch {
        // ignore
      }
      router.push(targetPath, { scroll: false });
    }
  };
  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-full focus:shadow-md focus:font-semibold focus:text-sm"
        href="#content"
      >
        {t("skipContent")}
      </a>
      <header className="site-header page-width">
        <Link href={t("homeUrl")} className="brand">
          <img
            src="/full.svg"
            width="122"
            height="40"
            alt={t("logoAlt")}
            fetchPriority="high"
          />
        </Link>
        <nav
          id="main-navigation"
          aria-label={t("mainNavigation")}
          className={`header-nav ${menuOpen ? "is-open" : ""}`}
        >
          <div className="header-nav-links">
            {(
              [
                ["flowUrl", "navFlow"],
                ["pricingUrl", "navPricing"],
                ["faqUrl", "navFaq"],
              ] as const
            ).map(([url, label]) => {
              const fullUrl = t(url);
              const targetPath = fullUrl.split("#")[0];
              return (
                <Link
                  onClick={(e) => handleNavClick(e, url)}
                  key={url}
                  href={targetPath}
                >
                  <span className="link-label">{t(label)}</span>
                </Link>
              );
            })}
          </div>
          <div className="mobile-nav-actions">
            <a
              href={t("signInUrl")}
              className="w-full inline-flex items-center justify-center gap-2.5 h-11 px-5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] shrink-0 bg-black text-white hover:bg-zinc-800 border border-black"
            >
              <span>{t("signIn")}</span>
              <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
            </a>
            <button
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-sm font-semibold border border-[var(--site-line)] hover:bg-[var(--site-soft)] transition-all active:scale-[0.98] shrink-0"
              aria-label={t("regionSelectorTitle")}
              onClick={() => {
                setMenuOpen(false);
                setIsModalOpen(true);
              }}
            >
              <Globe size={18} className="shrink-0" aria-hidden="true" />
              <span>{t("regionDisplay")}</span>
            </button>
          </div>
        </nav>
        <div className="header-actions">
          <a
            href={t("signInUrl")}
            className="inline-flex items-center justify-center gap-2.5 h-11 px-5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] shrink-0 bg-black text-white hover:bg-zinc-800 border border-black desktop-only"
          >
            <span>{t("signIn")}</span>
            <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
          </a>
          <button
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-sm font-semibold border border-[var(--site-line)] hover:bg-[var(--site-soft)] transition-all active:scale-[0.98] shrink-0 header-region desktop-only"
            aria-label={t("regionSelectorTitle")}
            onClick={() => setIsModalOpen(true)}
          >
            <Globe size={18} className="shrink-0" aria-hidden="true" />
            <span className="link-label">{t("regionDisplay")}</span>
          </button>
          <button
            className="icon-control menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={t(menuOpen ? "closeMenu" : "menuLabel")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </header>
      {isModalOpen && (
        <RegionLanguageModal isOpen onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
