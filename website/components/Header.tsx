"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, List, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageModal } from "./RegionLanguageModal";

export function Header() {
  const { t, locale } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <>
      <a className="skip-link" href="#content">
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
          {(
            [
              ["flowUrl", "navFlow"],
              ["pricingUrl", "navPricing"],
              ["faqUrl", "navFaq"],
            ] as const
          ).map(([url, label]) => (
            <Link onClick={() => setMenuOpen(false)} key={url} href={t(url)}>
              {t(label)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-control header-region"
            aria-label={t("regionSelectorTitle")}
            onClick={() => setIsModalOpen(true)}
          >
            <Globe size={21} aria-hidden="true" />
            <span>{t("regionDisplay")}</span>
          </button>
          <a href={t("signInUrl")} className="button-outline">
            {t("signIn")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
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
