import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import { RegionLanguageDialog } from "@/components/dialogs/region-language-dialog";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const isDe = locale === "de-de";

  return (
    <footer className="w-full bg-[#111111] text-white pt-16 pb-0 overflow-hidden">
      {/* 1. Final Call-to-Action Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-stone-900/60 p-8 sm:p-12 rounded-3xl border border-stone-800">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isDe ? "In 10 Minuten startklar" : "Ready in 10 minutes"}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-2">
              {isDe ? "Bereit für einfacheres Bestellen?" : "Ready for effortless ordering?"}
            </h3>
            <p className="text-sm sm:text-base text-stone-400 mt-3 leading-relaxed">
              {isDe
                ? "Keine monatliche Grundgebühr. Keine Einrichtungsgebühr. Du behältst deine bestehende Kasse und dein Team arbeitet wie gewohnt weiter."
                : "No monthly license fees. No setup costs. Keep your existing register and service routines intact."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={EXTERNAL_URLS.signup}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white text-[#111111] text-sm font-bold hover:bg-stone-100 transition-all text-center shadow-lg active:scale-98"
            >
              {isDe ? "Kostenlos registrieren" : "Sign up free now"}
            </a>
            <Link
              href={`/${locale}/pricing`}
              className="px-6 py-4 rounded-full border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-sm font-semibold transition-all text-center"
            >
              {isDe ? "Preise im Detail" : "View pricing"}
            </Link>
          </div>
        </div>

        {/* 2. Newsletter Teaser (Explicit external link to app) */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-stone-900/30 border border-stone-800/80">
          <div>
            <div className="font-bold text-sm text-white">
              {isDe ? "Neues von Zackisch. Ohne unnötige Mails." : "News from Zackisch. No spam."}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {isDe
                ? "Produktupdates, Einblicke in unseren Aufbau und neue Regionen. Anmeldung erfolgt DSGVO-konform auf app.zackisch.com."
                : "Product updates, feature releases, and regional launches. Double opt-in registration on app.zackisch.com."}
            </div>
          </div>
          <a
            href={EXTERNAL_URLS.newsletter}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-stone-700 text-xs font-bold text-white hover:bg-stone-800 transition-all self-start md:self-auto flex items-center gap-2"
          >
            <span>{isDe ? "Zur Newsletter-Anmeldung" : "Go to newsletter sign-up"}</span>
            <span className="text-stone-400">↗</span>
          </a>
        </div>
      </div>

      {/* 3. Multi-Column Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isDe ? "Produkt" : "Product"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/product`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Produktübersicht" : "Product Overview"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/product/smart-menu`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Intelligentes Menü" : "Smart Menu"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/product/staff-dashboard`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Personal- & Küchenansicht" : "Staff Tablet"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isDe ? "Lösungen" : "Solutions"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/solutions/restaurants-bars`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Restaurants & Bars" : "Restaurants & Bars"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/solutions/cafes-bakeries`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Cafés & Bäckereien" : "Cafés & Bakeries"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/solutions/quick-service`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Imbisse & Fast-Casual" : "Quick-Service"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/solutions/pickup`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Abholung & To-go" : "Pickup & Takeaway"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isDe ? "Unternehmen" : "Company"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/about`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Über Zackisch" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/research`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Forschung & Studien" : "Research & Evidence"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Kontakt" : "Contact"}
                </Link>
              </li>
              <li>
                <a href={EXTERNAL_URLS.email} className="text-stone-400 hover:text-white transition-colors">
                  selim@zackisch.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Pricing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isDe ? "Ressourcen" : "Resources"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/pricing`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Preise & Gebühren" : "Pricing & Fees"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/potential-calculator`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Potenzialrechner" : "Revenue Calculator"}
                </Link>
              </li>
              <li>
                <a href={EXTERNAL_URLS.support} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1">
                  <span>{isDe ? "Hilfe & Support" : "Help & Support"}</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a href={EXTERNAL_URLS.signin} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1">
                  <span>{isDe ? "Betreiber-Login" : "Merchant Sign In"}</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal Hub */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isDe ? "Rechtliches" : "Legal Hub"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/legal-notice`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Impressum (§ 5 DDG)" : "Legal Notice (Imprint)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Datenschutzerklärung" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Cookie-Richtlinie" : "Cookie Policy"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/business-terms`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "B2B-Bedingungen" : "Merchant Terms"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/guest-terms`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Gast-Bedingungen" : "Guest Terms"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/payments`} className="text-stone-400 hover:text-white transition-colors">
                  {isDe ? "Zahlungsmodell & Stripe" : "Payment Architecture"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Language / Region Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © 2026 Zackisch · {isDe ? "Entwickelt in Mannheim" : "Built in Mannheim, Germany"}.
          </div>

          <div className="flex items-center gap-4">
            <RegionLanguageDialog locale={locale} variant="footer" />
          </div>
        </div>
      </div>

      {/* 5. GANZ UNTEN: TINDER-STYLE OVERSIZED WORDMARK */}
      <div className="w-full pt-8 pb-4 sm:pb-8 flex justify-center items-end select-none pointer-events-none opacity-20 hover:opacity-30 transition-opacity">
        <Image
          src="/branding/word_mark.svg"
          alt=""
          width={1800}
          height={320}
          className="w-full max-w-[95vw] h-auto object-contain filter invert"
          aria-hidden="true"
        />
      </div>
    </footer>
  );
}
