"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Globe, List, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageModal } from "./RegionLanguageModal";

export function Header() {
  const { t, locale } = useTranslation();
  const pathname = usePathname() || "";
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

    if (
      pathname === targetPath ||
      pathname === `${targetPath}/` ||
      pathname.endsWith(targetPath)
    ) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - 32;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };
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
            <Link
              onClick={(e) => handleNavClick(e, url)}
              key={url}
              href={t(url)}
            >
              <span className="link-label">{t(label)}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a href={t("signInUrl")} className="button-primary">
            {t("signIn")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            className="button-outline header-region"
            aria-label={t("regionSelectorTitle")}
            onClick={() => setIsModalOpen(true)}
          >
            <Globe size={18} aria-hidden="true" />
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
