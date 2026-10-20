import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HOMEPAGE_CONTENT, EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import { constructMetadata } from "@/lib/seo";
import { SignatureDemo } from "@/components/demo/signature-demo";
import { PotentialCalculator } from "@/components/calculator/potential-calculator";
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
    <div className="w-full flex flex-col items-center">
      {/* SEKTION 1 — HERO */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy (Left) */}
          <div className="lg:col-span-7 space-y-6 max-w-2xl">
            {/* Qualifier Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span>{content.hero.qualifier}</span>
            </div>

            {/* H1 (VERBATIM FOUNDER COPY) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] leading-[1.1]">
              {content.hero.h1}
            </h1>

            {/* Subtitle (VERBATIM FOUNDER COPY) */}
            <p className="text-lg sm:text-xl text-[#52525B] leading-relaxed">
              {content.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={EXTERNAL_URLS.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#111111] text-white text-base font-bold hover:bg-black transition-all text-center shadow-md active:scale-98"
              >
                {content.hero.primaryCta}
              </a>
              <a
                href="#signature-demo"
                className="px-6 py-4 rounded-full border border-[#E5E5E2] text-[#111111] hover:bg-[#F7F7F8] text-base font-semibold transition-all text-center"
              >
                {content.hero.secondaryCta}
              </a>
            </div>

            {/* Compact Pricing Note */}
            <div className="pt-3 border-t border-[#E5E5E2] text-xs text-[#646464] flex items-center gap-2 leading-relaxed">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>{content.hero.pricingBadge}</span>
            </div>
          </div>

          {/* Hero Visual Composition (Right) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#E5E5E2] shadow-xl bg-stone-100 aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
              <Image
                src="/media/hero-hospitality.webp"
                alt="Hospitality Dining"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating QR Card Accent */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-[#111111] rounded-xl flex items-center justify-center p-2 shrink-0">
                  <Image
                    src="/branding/brand_mark.svg"
                    alt=""
                    width={32}
                    height={32}
                    className="filter invert"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#111111] truncate">
                    {isDe ? "Tisch 04 · Live-Menü" : "Table 04 · Live Menu"}
                  </div>
                  <div className="text-[11px] text-[#646464] truncate">
                    {isDe ? "Scannen & direkt loslegen" : "Scan to discover & pay"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 2 — SOCIETY & WAIT TIMES (27 % STAT) */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
                {content.society.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                {content.society.h2}
              </h2>
              <p className="text-base text-[#52525B] leading-relaxed">
                {content.society.lead}
              </p>
              <div className="pt-2">
                <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {content.society.conclusion}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs space-y-3">
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#111111] font-mono">
                {content.society.statNumber}
              </div>
              <p className="text-sm font-semibold text-[#111111] leading-snug">
                {content.society.statLabel}
              </p>
              <div className="pt-3 border-t border-[#E5E5E2] text-xs text-[#646464] space-y-1">
                <div className="font-semibold text-[#111111]">{content.society.source}</div>
                <div className="text-[11px] leading-relaxed">{content.society.sourceNote}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 3 — MULTI-VENUE SOLUTIONS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.solutionsIntro.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {content.solutionsIntro.h2}
          </h2>
          <p className="text-base text-[#52525B] leading-relaxed">
            {content.solutionsIntro.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.solutionsIntro.modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/${locale}${mode.href}`}
              className="group rounded-3xl border border-[#E5E5E2] bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <Image
                  src={mode.image}
                  alt={mode.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#646464]">
                    {mode.tagline}
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mt-1 group-hover:text-black">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
                <div className="pt-4 text-xs font-bold text-[#111111] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isDe ? "Mehr erfahren" : "Learn more"}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEKTION 4 — THE SIGNATURE DEMO ("EINE BESTELLUNG. DREI PERSPEKTIVEN.") */}
      <section id="signature-demo" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {content.signatureDemo.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {content.signatureDemo.h2}
          </h2>
          <p className="text-base text-[#52525B]">
            {content.signatureDemo.subtitle}
          </p>
        </div>

        <SignatureDemo locale={locale} />
      </section>

      {/* SEKTION 5 — SMART MENU FEATURES */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.smartMenu.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
              {content.smartMenu.h2}
            </h2>
            <p className="text-base text-[#52525B]">
              {content.smartMenu.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.smartMenu.features.map((feat) => (
              <div
                key={feat.id}
                className="p-6 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F4F4F5] text-[#111111] mb-3">
                    {feat.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#111111]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-[#646464] max-w-xl mx-auto">
            {content.smartMenu.legalNote}
          </div>
        </div>
      </section>

      {/* SEKTION 6 — HYBRID SERVICE & CASH INTEGRATION (45 % CASH STAT) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.freedom.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
              {content.freedom.h2}
            </h2>
            <p className="text-base text-[#52525B] leading-relaxed">
              {content.freedom.lead}
            </p>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-stone-50 border border-[#E5E5E2] space-y-3">
            <div className="text-5xl font-extrabold text-[#111111] font-mono">
              {content.freedom.factNumber}
            </div>
            <p className="text-sm font-semibold text-[#111111]">
              {content.freedom.factLabel}
            </p>
            <div className="pt-3 border-t border-[#E5E5E2] text-xs text-[#646464]">
              {content.freedom.factSource}
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 7 — ZERO FRICTION SETUP */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.setup.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
              {content.setup.h2}
            </h2>
            <p className="text-base text-[#52525B]">
              {content.setup.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.setup.points.map((pt, i) => (
              <div
                key={pt.title}
                className="p-6 rounded-3xl bg-white border border-[#E5E5E2] space-y-2 shadow-xs"
              >
                <div className="text-xs font-mono font-bold text-[#646464]">
                  0{i + 1}
                </div>
                <h3 className="text-base font-bold text-[#111111]">{pt.title}</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKTION 8 — PRICING OVERVIEW */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.pricing.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
              {content.pricing.h2}
            </h2>
            <p className="text-base text-[#52525B] leading-relaxed">
              {content.pricing.copy}
            </p>
            <div className="pt-2 text-xs text-[#646464] italic">
              {content.pricing.seasonNote}
            </div>
            <div className="pt-3">
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#111111] hover:underline"
              >
                <span>{content.pricing.detailsLink}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#111111] text-white shadow-xl space-y-4">
            <div className="text-6xl font-extrabold font-mono tracking-tight text-white">
              {content.pricing.rate}
            </div>
            <div className="text-sm font-semibold text-stone-200">
              {content.pricing.rateLabel}
            </div>
            <p className="text-xs text-stone-400 pt-2 border-t border-stone-800">
              {isDe
                ? "Auf den Bestellwert ohne Trinkgeld. Zzgl. Stripe-Zahlungsabwicklung."
                : "Calculated on food & drink subtotal excluding tips. Plus standard Stripe processing."}
            </p>
          </div>
        </div>
      </section>

      {/* SEKTION 9 — REVENUE POTENTIAL CALCULATOR v3 */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.calculator.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            {content.calculator.h2}
          </h2>
          <p className="text-base text-[#52525B]">
            {content.calculator.lead}
          </p>
        </div>

        <PotentialCalculator locale={locale} />
      </section>

      {/* SEKTION 10 — RESEARCH EVIDENCE */}
      <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStudies.map((st) => (
              <div
                key={st.id}
                className="p-6 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#646464] mb-2 font-mono">
                    <span>{st.id} · {st.year}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100">
                      {st.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#111111] leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-3 leading-relaxed">
                    {st.claim[locale === "de-de" ? "de" : "en"]}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E5E2] mt-4 flex items-center justify-between">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKTION 11 — FOUNDER STORY */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {content.founder.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
              {content.founder.h2}
            </h2>
            <blockquote className="text-base sm:text-lg text-[#111111] font-semibold italic border-l-2 border-[#111111] pl-4 my-3 leading-relaxed">
              "{content.founder.quote}"
            </blockquote>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
              {content.founder.story}
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#646464]">
              <span>Selim Eser · Gründer von Zackisch</span>
              <span className="text-stone-300">•</span>
              <span>{content.founder.institution}</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-[#E5E5E2] shadow-md bg-stone-100">
              <Image
                src="/derived/selim_full.webp"
                alt="Selim Eser"
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 12 — FAQ & FINAL ACCORDION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {content.faq.badge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#111111]">
            {content.faq.h2}
          </h2>
        </div>

        <div className="space-y-3">
          {content.faq.questions.map((faq, i) => (
            <details
              key={i}
              className="group p-5 rounded-2xl bg-white border border-[#E5E5E2] [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-2xs"
            >
              <summary className="flex items-center justify-between text-sm font-bold text-[#111111] focus:outline-none">
                <span>{faq.q}</span>
                <span className="transition-transform group-open:rotate-180 text-stone-400">
                  ↓
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mt-3 pt-3 border-t border-[#E5E5E2]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
