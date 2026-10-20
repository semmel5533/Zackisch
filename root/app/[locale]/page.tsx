import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HOMEPAGE_CONTENT, EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import { constructMetadata } from "@/lib/seo";
import { SignatureDemo } from "@/components/demo/signature-demo";
import { PotentialCalculator } from "@/components/calculator/potential-calculator";
import { VenueShowcase } from "@/components/home/venue-showcase";
import { SmartEngineShowcase } from "@/components/home/smart-engine-showcase";
import { RealitySplit } from "@/components/home/reality-split";
import { SetupPricingStrip } from "@/components/home/setup-pricing-strip";
import { RevealOnScroll } from "@/components/motion/gsap-reveals";
import { RESEARCH_STUDIES } from "@/lib/research";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    return {};
  }
  const locale = rawLocale as Locale;
  const isDe = locale === "de-de";

  return constructMetadata({
    title: isDe
      ? "Bestellen & Bezahlen im Handumdrehen"
      : "Effortless Hospitality Ordering & Payment",
    description: isDe
      ? "QR-Code-Bestellungen und Zahlungen für Restaurants, Cafés, Bars und Imbisse. Intelligentes Menü, bestehende Kasse behalten und nur 2 % Plattformgebühr pro Bestellung zzgl. Zahlungsabwicklung."
      : "Digital QR-code ordering and payments for restaurants, cafés, and bars. Smart menu, keep your existing POS register, and pay just 2% platform fee per order plus payment processing.",
    path: "",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const locale = rawLocale as Locale;
  const isDe = locale === "de-de";
  const content = HOMEPAGE_CONTENT[locale];

  // Top 3 featured studies for homepage
  const featuredStudies = RESEARCH_STUDIES.slice(0, 3);

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      {/* 1. HERO SECTION (AWWWARDS POSTER COMPOSITION) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Typography & Actions */}
          <div className="lg:col-span-7 space-y-8 max-w-2xl">
            <RevealOnScroll className="space-y-4">
              {/* Qualifier Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{content.hero.qualifier}</span>
              </div>

              {/* H1 (VERBATIM FOUNDER COPY) */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#111111] leading-[1.0] text-balance">
                {content.hero.h1}
              </h1>

              {/* Subtitle (VERBATIM FOUNDER COPY) */}
              <p className="text-lg sm:text-xl text-[#52525B] leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>
            </RevealOnScroll>

            {/* CTAs */}
            <RevealOnScroll delay={0.1} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={EXTERNAL_URLS.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#111111] text-white text-base font-bold hover:bg-black transition-all text-center shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>{content.hero.primaryCta}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#signature-demo"
                className="px-6 py-4 rounded-full border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#FAF9F6] text-base font-semibold transition-all text-center cursor-pointer shadow-2xs"
              >
                {content.hero.secondaryCta}
              </a>
            </RevealOnScroll>

            {/* Compact Pricing Note */}
            <RevealOnScroll delay={0.2} className="pt-4 border-t border-[#E5E5E2] text-xs text-[#646464] flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="font-medium">{content.hero.pricingBadge}</span>
            </RevealOnScroll>
          </div>

          {/* Right Column: Hero Visual Frame with Live QR Component */}
          <div className="lg:col-span-5 relative">
            <RevealOnScroll delay={0.15} className="relative rounded-3xl overflow-hidden border border-[#E5E5E2] shadow-2xl bg-stone-100 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group">
              <Image
                src="/media/hero-hospitality.webp"
                alt="Hospitality Dining Atmosphere"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Live Table Indicator */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-[#111111] rounded-xl flex items-center justify-center p-2.5 shrink-0 shadow-sm">
                  <Image
                    src="/branding/brand_mark.svg"
                    alt=""
                    width={32}
                    height={32}
                    className="filter invert"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#111111] truncate flex items-center gap-2">
                    <span>{isDe ? "Tisch 04 · Live-Speisekarte" : "Table 04 · Digital Menu"}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-[#646464] truncate">
                    {isDe ? "QR-Code scannen & ohne App bestellen" : "Scan QR code & order without app"}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 2. REALITY SPLIT (27 % WAITING LOSS & 45 % CASH HABIT) */}
      <RealitySplit locale={locale} />

      {/* 3. MULTI-VENUE OPERATING CONTEXTS (INTERACTIVE SHOWCASE) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 space-y-12">
        <RevealOnScroll className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.solutionsIntro.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {content.solutionsIntro.h2}
          </h2>
          <p className="text-base sm:text-lg text-[#52525B]">
            {content.solutionsIntro.lead}
          </p>
        </RevealOnScroll>

        <VenueShowcase locale={locale} />
      </section>

      {/* 4. THE SIGNATURE DEMO CONSOLE ("EINE BESTELLUNG. DREI PERSPEKTIVEN.") */}
      <section id="signature-demo" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 scroll-mt-24">
        <RevealOnScroll className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            {content.signatureDemo.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {content.signatureDemo.h2}
          </h2>
          <p className="text-base sm:text-lg text-[#52525B]">
            {content.signatureDemo.subtitle}
          </p>
        </RevealOnScroll>

        <SignatureDemo locale={locale} />
      </section>

      {/* 5. THE SMART ENGINE (FEATURES DEMONSTRATION) */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmartEngineShowcase locale={locale} />
        </div>
      </section>

      {/* 6. REVENUE POTENTIAL CALCULATOR v3 (MATHEMATICAL TERMINAL) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <RevealOnScroll className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.calculator.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {content.calculator.h2}
          </h2>
          <p className="text-base sm:text-lg text-[#52525B]">
            {content.calculator.lead}
          </p>
        </RevealOnScroll>

        <PotentialCalculator locale={locale} />
      </section>

      {/* 7. ZERO-FRICTION SETUP & 2% FLAT PRICING */}
      <SetupPricingStrip locale={locale} />

      {/* 8. SCIENTIFIC EVIDENCE & STUDIES */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
                {content.research.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                {content.research.h2}
              </h2>
              <p className="text-base text-[#52525B]">
                {content.research.lead}
              </p>
            </div>
            <Link
              href={`/${locale}/research`}
              className="px-6 py-3 rounded-full bg-white border border-[#E5E5E2] text-[#111111] text-xs font-bold hover:border-[#111111] transition-all self-start md:self-auto shadow-2xs"
            >
              {content.research.cta} →
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStudies.map((st, i) => (
              <RevealOnScroll
                key={st.id}
                delay={i * 0.1}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#646464] font-mono">
                    <span>{st.id} · {st.year}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100">
                      {st.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {st.claim[locale === "de-de" ? "de" : "en"]}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                  <span className="text-[11px] text-[#646464]">{st.authors}</span>
                  <a
                    href={st.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
                  >
                    <span>DOI / Quelle</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOUNDER STORY (SELIM ESER, MANNHEIM) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <RevealOnScroll className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.founder.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
              {content.founder.h2}
            </h2>
            <blockquote className="text-base sm:text-xl text-[#111111] font-semibold italic border-l-2 border-[#111111] pl-5 my-4 leading-relaxed">
              "{content.founder.quote}"
            </blockquote>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed max-w-2xl">
              {content.founder.story}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#646464]">
              <span className="text-[#111111] font-bold">Selim Eser</span>
              <span>· Gründer von Zackisch</span>
              <span className="text-stone-300">•</span>
              <span>{content.founder.institution}</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-[#E5E5E2] shadow-lg bg-stone-100">
              <Image
                src="/derived/selim_full.webp"
                alt="Selim Eser"
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:pb-24">
        <RevealOnScroll className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.faq.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {content.faq.h2}
          </h2>
        </RevealOnScroll>

        <div className="space-y-3">
          {content.faq.questions.map((faq, i) => (
            <details
              key={i}
              className="group p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E2] [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-2xs hover:border-stone-400 transition-colors"
            >
              <summary className="flex items-center justify-between text-sm sm:text-base font-bold text-[#111111] focus:outline-none">
                <span>{faq.q}</span>
                <span className="transition-transform group-open:rotate-180 text-stone-400 text-sm">
                  ↓
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mt-4 pt-4 border-t border-[#E5E5E2]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
