"use client";

import React from "react";
import { numericText } from "@/lib/numeric-text";
import { Plus, Check, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { QrCodeShowcase } from "./QrCodeShowcase";
import { AnimatedBenefitStat } from "./AnimatedBenefitStat";
import { SiteFooter } from "./SiteFooter";
import { NewsletterForm } from "./NewsletterForm";
import { resolveMediaAsset } from "@zackisch/design-system";

export function MainPage() {
  const { t, locale } = useTranslation();
  const isDe = locale.startsWith("de");

  const steps = ["setupFirst", "setupSecond", "setupThird"] as const;

  const questions = [
    "faqApp",
    "faqDevices",
    "faqPickup",
    "faqMenu",
    "faqUnavailable",
    "faqOptions",
    "faqPayment",
    "faqTips",
    "faqStart",
    "faqPos",
    "faqPayout",
    "faqContract",
    "faqCosts",
  ] as const;

  return (
    <main id="content" className="min-h-screen bg-white text-[#161616] font-sans">
      {/* 1. HERO SECTION (MKT-01) */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 border-b border-[#E0E0E0] overflow-hidden bg-white">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left copy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F2F2] border border-[#E0E0E0] text-[11px] font-semibold uppercase tracking-[.08em] text-[#525252]">
                <span className="size-1.5 rounded-full bg-[#161616]" aria-hidden="true" />
                {isDe ? "Zackisch Gastronomie-System" : "Zackisch Hospitality System"}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#0A0A0A] leading-[1.08] font-brand">
                <span className="block">{t("heroLeft")}</span>
                <span className="block mt-1 sm:mt-2 text-[#525252]">{t("heroRight")}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-xl">
                {t("heroSummary")}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <RegisterCta size="lg" />
                <a
                  href={t("flowUrl")}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#C4C4C4] bg-white px-6 text-sm font-semibold text-[#161616] hover:bg-[#F2F2F2] transition-colors"
                >
                  {t("navFlow")}
                </a>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-[#525252] flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#12744B]" aria-hidden="true" />
                  0 € Einrichtung
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#12744B]" aria-hidden="true" />
                  0 € Grundgebühr
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#12744B]" aria-hidden="true" />
                  Keine Vertragslaufzeit
                </span>
              </div>
            </div>

            {/* Right visuals */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E0E0E0] shadow-md bg-[#F7F7F7]">
                <img
                  src={resolveMediaAsset("heroHospitality", { site: "root" })}
                  alt={isDe ? "Servicekraft serviert Speisen am Tisch im Restaurant" : "Staff serving dishes at a café table"}
                  width={1400}
                  height={933}
                  fetchPriority="high"
                  className="w-full h-[360px] sm:h-[480px] object-cover block"
                />
                {/* Floating physical table tent QR card preview */}
                <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 scale-90 sm:scale-95 origin-bottom-right drop-shadow-xl hidden min-[480px]:block">
                  <QrCodeShowcase />
                </div>
              </div>
              <div className="min-[480px]:hidden mt-6 flex justify-center">
                <QrCodeShowcase />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS / PROCESS STORY (MKT-02) */}
      <section className="py-16 sm:py-24 border-b border-[#E0E0E0] bg-[#F7F7F7]">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3">
            <h2 id="ablauf" className="scroll-mt-8 text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
              {t("flowTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
              {isDe
                ? "Drei unkomplizierte Schritte von der Tischauswahl bis zur frischen Zubereitung in der Küche."
                : "Three straightforward steps from table selection to kitchen preparation."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Scan */}
            <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-full bg-[#161616] text-white flex items-center justify-center font-semibold text-xs font-numeric">
                    1
                  </span>
                  <span className="text-xs font-semibold text-[#525252] uppercase tracking-wider">
                    {isDe ? "Am Tisch" : "At Table"}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E0E0E0] h-48 bg-[#F7F7F7]">
                  <img
                    src={resolveMediaAsset("guestPhoneTable", { site: "root" })}
                    alt={isDe ? "Gast öffnet Speisekarte mit Smartphone" : "Guest browsing menu on smartphone"}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#161616] tracking-tight">
                  {t("flowScan")}
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                  {t("flowScanText")}
                </p>
              </div>
            </div>

            {/* Step 2: Pay */}
            <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-full bg-[#161616] text-white flex items-center justify-center font-semibold text-xs font-numeric">
                    2
                  </span>
                  <span className="text-xs font-semibold text-[#525252] uppercase tracking-wider">
                    {isDe ? "Online Zahlen" : "Digital Payment"}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E0E0E0] h-48 bg-[#F7F7F7]">
                  <img
                    src={isDe ? "/product/de-pay.webp" : "/product/en-pay.webp"}
                    alt={isDe ? "Sichere Bezahlung via Apple Pay und Karte" : "Secure payment via digital wallet"}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#161616] tracking-tight">
                  {t("flowPay")}
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                  {t("flowPayText")}
                </p>
              </div>
            </div>

            {/* Step 3: Kitchen & POS */}
            <div className="bg-white rounded-3xl border border-[#E0E0E0] p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-full bg-[#161616] text-white flex items-center justify-center font-semibold text-xs font-numeric">
                    3
                  </span>
                  <span className="text-xs font-semibold text-[#525252] uppercase tracking-wider">
                    {isDe ? "Küche & Service" : "Service"}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E0E0E0] h-48 bg-[#F7F7F7]">
                  <img
                    src={resolveMediaAsset("staffService", { site: "root" })}
                    alt={isDe ? "Kellner serviert Bestellungen" : "Staff serving ordered dishes"}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#161616] tracking-tight">
                  {t("flowKitchen")}
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                  {t("flowKitchenText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SETUP IN 3 STEPS (SET-01) */}
      <section className="py-16 sm:py-24 border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-3xl overflow-hidden border border-[#E0E0E0] shadow-sm bg-[#F7F7F7]">
                <img
                  src={resolveMediaAsset("posCounter", { site: "root" })}
                  alt={isDe ? "Mitarbeiterin an der Theke mit bestehender Kasse" : "Staff at checkout counter with register"}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[400px] object-cover block"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
                {t("setupTitle")}
              </h2>
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                {t("setupNote")}
              </p>

              <ol className="space-y-4 pt-2">
                {steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-[#E0E0E0] bg-[#F7F7F7]"
                  >
                    <span className="size-7 rounded-full bg-[#161616] text-white flex items-center justify-center font-semibold text-xs font-numeric shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-[#161616] leading-snug">
                      {t(step)}
                    </h3>
                  </li>
                ))}
              </ol>

              <div className="pt-2">
                <RegisterCta size="default" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFIT / STATS SECTION */}
      <section className="py-16 sm:py-24 border-b border-[#E0E0E0] bg-[#F7F7F7]">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
                {t("benefitTitle")}
              </h2>
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                {t("benefitService")}
              </p>

              <div className="p-6 rounded-3xl border border-[#E0E0E0] bg-white space-y-2 max-w-md shadow-xs">
                <p className="text-xs uppercase tracking-wider text-[#525252] font-semibold">
                  {t("benefitPrefix")}
                </p>
                <div className="text-4xl sm:text-5xl font-bold font-numeric text-[#161616] tracking-tight">
                  <AnimatedBenefitStat target={30} unit="%" />
                </div>
                <h3 className="text-base font-semibold text-[#161616]">
                  {t("benefitMetric")}
                </h3>
                <a
                  href={t("benefitSourceUrl")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#161616] underline underline-offset-4 pt-1"
                >
                  <span>{t("benefitSource")}</span>
                  <ArrowRight size={12} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#E0E0E0] shadow-sm bg-white">
                <img
                  src={resolveMediaAsset("restaurantInterior", { site: "root" })}
                  alt={isDe ? "Gemütliche Restaurant-Atmosphäre" : "Atmospheric dining ambiance"}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[420px] object-cover block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING CLARITY (MKT-03) */}
      <section className="py-16 sm:py-24 border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 id="kosten" className="scroll-mt-8 text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
              {t("feeTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
              {t("feePromise")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Base conditions */}
            <div className="rounded-3xl border border-[#E0E0E0] bg-[#F7F7F7] p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E0E0E0] text-xs font-semibold text-[#525252]">
                  {isDe ? "Grundkonditionen" : "Base Pricing"}
                </span>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check size={20} className="text-[#12744B] shrink-0" aria-hidden="true" />
                    <p className="text-xl sm:text-2xl font-semibold text-[#161616]">
                      {t("feeNoSetup")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check size={20} className="text-[#12744B] shrink-0" aria-hidden="true" />
                    <p className="text-xl sm:text-2xl font-semibold text-[#161616]">
                      {t("feeNoMonthly")}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#525252] leading-relaxed">
                {isDe
                  ? "Keine Mindestumsätze, keine Einrichtungsgebühr, keine Bindung. Du zahlst nur, wenn Gäste tatsächlich bestellen."
                  : "No minimum revenue, no setup fee, no lock-in. You only pay when guests actually place orders."}
              </p>
            </div>

            {/* Variable fee */}
            <div className="rounded-3xl border-2 border-[#161616] bg-white p-8 space-y-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#161616] text-white text-xs font-semibold">
                  {isDe ? "Bei erfolgreicher Bestellung" : "Per Successful Order"}
                </span>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold font-numeric text-[#161616] tracking-tight">
                    <span>{t("feeNumber")}</span>
                    <span>{t("feeUnit")}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#525252] mt-1">
                    {t("feeLabel")}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                  {t("feeNote")}
                </p>
              </div>
              <div className="pt-2">
                <RegisterCta size="default" />
              </div>
            </div>
          </div>

          {/* POS Clarification Banner */}
          <div className="mt-8 max-w-4xl mx-auto p-5 rounded-2xl border border-[#E0E0E0] bg-[#F7F7F7] flex items-start gap-4">
            <div className="size-6 rounded-full bg-[#161616] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold" aria-hidden="true">
              i
            </div>
            <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
              <strong className="text-[#161616]">
                {isDe ? "Kassenunabhängig: " : "Register-independent: "}
              </strong>
              {t("flowPayText")}
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 sm:py-24 border-b border-[#E0E0E0] bg-[#F7F7F7]">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <h2 id="faq" className="scroll-mt-8 text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
                {t("faqTitle")}
              </h2>
              <p className="text-sm text-[#525252] leading-relaxed">
                {isDe
                  ? "Häufige Fragen von Gastronomen rund um Betrieb, Hardware, Kasse und Zahlungsabwicklung."
                  : "Common questions from restaurateurs regarding operation, hardware, register and payouts."}
              </p>
              <div className="pt-2">
                <a
                  href={t("supportUrl")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#161616] underline underline-offset-4 hover:text-[#525252]"
                >
                  <span>{isDe ? "Zum Hilfe-Center" : "Visit Support Center"}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {questions.map((question) => (
                <details
                  key={question}
                  className="group rounded-2xl border border-[#E0E0E0] bg-white p-5 transition-colors"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#161616] [&::-webkit-details-marker]:hidden">
                    <span>{t(question)}</span>
                    <Plus
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-[#525252] transition-transform duration-150 group-open:rotate-45"
                    />
                  </summary>
                  <div className="pt-3 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-[#E0E0E0] mt-3">
                    {numericText(t(`${question}Answer`))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="py-14 sm:py-20 border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1280px]">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0A0A0A] font-brand">
              {t("newsletterSectionTitle")}
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed">
              {t("newsletterSectionDesc")}
            </p>
            <div className="pt-2">
              <NewsletterForm showHeader={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <SiteFooter variant="full" />
    </main>
  );
}
