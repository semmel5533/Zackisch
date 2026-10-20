"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_NAVIGATION, EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import { RegionLanguageDialog } from "@/components/dialogs/region-language-dialog";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname() || `/${locale}`;
  const isDe = locale === "de-de";
  const nav = SITE_NAVIGATION[locale];

  const [productOpen, setProductOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to switch locale while keeping the current page slug
  const getSwitchedLocalePath = (targetLocale: Locale) => {
    const currentPrefix = `/${locale}`;
    if (pathname.startsWith(currentPrefix)) {
      const rest = pathname.slice(currentPrefix.length);
      return `/${targetLocale}${rest}`;
    }
    return `/${targetLocale}`;
  };

  return (
    <header className="relative w-full bg-white border-b border-[#E5E5E2] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg p-1"
          aria-label="Zackisch Home"
        >
          <Image
            src="/branding/combination_mark.svg"
            alt="Zackisch"
            width={140}
            height={36}
            priority
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#111111]" aria-label="Main Navigation">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button
              type="button"
              onClick={() => setProductOpen(!productOpen)}
              className="flex items-center gap-1.5 py-2 text-[#52525B] hover:text-[#111111] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-md px-2"
              aria-expanded={productOpen}
            >
              <span>{nav.product.label}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {productOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E5E2] p-2 mt-1 z-50 animate-fadeIn">
                {nav.product.items.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    onClick={() => setProductOpen(false)}
                    className="block p-3 rounded-xl hover:bg-[#F7F7F8] transition-colors"
                  >
                    <div className="font-semibold text-xs text-[#111111]">{item.label}</div>
                    <div className="text-[11px] text-[#646464] mt-0.5 leading-snug">{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className="flex items-center gap-1.5 py-2 text-[#52525B] hover:text-[#111111] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-md px-2"
              aria-expanded={solutionsOpen}
            >
              <span>{nav.solutions.label}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {solutionsOpen && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E5E2] p-2 mt-1 z-50 animate-fadeIn">
                {nav.solutions.items.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    onClick={() => setSolutionsOpen(false)}
                    className="block p-3 rounded-xl hover:bg-[#F7F7F8] transition-colors"
                  >
                    <div className="font-semibold text-xs text-[#111111]">{item.label}</div>
                    <div className="text-[11px] text-[#646464] mt-0.5 leading-snug">{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            href={`/${locale}/pricing`}
            className="py-2 px-2 text-[#52525B] hover:text-[#111111] transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            {nav.pricing.label}
          </Link>

          {/* Potential Calculator */}
          <Link
            href={`/${locale}/potential-calculator`}
            className="py-2 px-2 text-[#52525B] hover:text-[#111111] transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            {nav.calculator.label}
          </Link>

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1.5 py-2 text-[#52525B] hover:text-[#111111] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-md px-2"
              aria-expanded={moreOpen}
            >
              <span>{nav.more.label}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E5E2] p-2 mt-1 z-50 animate-fadeIn">
                {nav.more.items.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl hover:bg-[#F7F7F8] transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#111111]">{item.label}</span>
                        <span className="text-[10px] text-[#646464]">↗</span>
                      </div>
                      <div className="text-[11px] text-[#646464] mt-0.5 leading-snug">{item.desc}</div>
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      onClick={() => setMoreOpen(false)}
                      className="block p-3 rounded-xl hover:bg-[#F7F7F8] transition-colors"
                    >
                      <div className="font-semibold text-xs text-[#111111]">{item.label}</div>
                      <div className="text-[11px] text-[#646464] mt-0.5 leading-snug">{item.desc}</div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Area & Region/Language Dialog */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Region & Language Dialog */}
          <RegionLanguageDialog locale={locale} />

          {/* Login button */}
          <a
            href={EXTERNAL_URLS.signin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2.5 text-[#111111] hover:bg-[#F7F7F8] rounded-xl transition-colors"
          >
            {nav.cta.login}
          </a>

          {/* Sign up Free (Primary CTA) */}
          <a
            href={EXTERNAL_URLS.signup}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-5 py-2.5 bg-[#111111] text-white hover:bg-black rounded-full transition-all shadow-xs"
          >
            {nav.cta.signup}
          </a>
        </div>

        {/* Mobile Menu Button & Region/Language */}
        <div className="flex sm:hidden items-center gap-2">
          <RegionLanguageDialog locale={locale} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111111] rounded-xl hover:bg-[#F7F7F8] focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E5E5E2] bg-white px-4 pt-4 pb-6 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#646464] uppercase tracking-wider px-2 py-1">
              {nav.product.label}
            </div>
            {nav.product.items.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-[#E5E5E2]">
            <div className="text-xs font-bold text-[#646464] uppercase tracking-wider px-2 py-1">
              {nav.solutions.label}
            </div>
            {nav.solutions.items.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-[#E5E5E2]">
            <Link
              href={`/${locale}/pricing`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {nav.pricing.label}
            </Link>
            <Link
              href={`/${locale}/potential-calculator`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {nav.calculator.label}
            </Link>
            <Link
              href={`/${locale}/research`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {isDe ? "Forschung & Studien" : "Research & Evidence"}
            </Link>
            <Link
              href={`/${locale}/about`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {isDe ? "Über uns" : "About Us"}
            </Link>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {isDe ? "Kontakt" : "Contact"}
            </Link>
          </div>

          <div className="pt-4 border-t border-[#E5E5E2] space-y-2">
            <a
              href={EXTERNAL_URLS.signup}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-full bg-[#111111] text-white text-center text-sm font-bold shadow-xs"
            >
              {nav.cta.signup}
            </a>
            <a
              href={EXTERNAL_URLS.signin}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 rounded-xl border border-[#E5E5E2] text-center text-xs font-semibold text-[#111111] hover:bg-[#F7F7F8]"
            >
              {nav.cta.login}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
