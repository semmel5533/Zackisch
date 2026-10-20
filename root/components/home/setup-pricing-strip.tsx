"use client";

import React from "react";
import Link from "next/link";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import { RevealOnScroll } from "@/components/motion/gsap-reveals";

export function SetupPricingStrip({ locale }: { locale: Locale }) {
  const isDe = locale === "de-de";

  const steps = [
    {
      num: "01",
      title: isDe ? "Menü im Browser erfassen" : "Setup menu in browser",
      desc: isDe
        ? "Kategorien, Preise und Optionen in wenigen Minuten selbst eintragen."
        : "Add categories, prices, and options directly within minutes.",
    },
    {
      num: "02",
      title: isDe ? "QR-Codes selbst drucken" : "Print your own QR stands",
      desc: isDe
        ? "Als druckfertige PDF herunterladen. Keine teure Spezialhardware nötig."
        : "Download print-ready PDF codes. No proprietary terminal rental.",
    },
    {
      num: "03",
      title: isDe ? "Vorhandene Kasse behalten" : "Keep your existing POS",
      desc: isDe
        ? "Bestellungen treffen bezahlt am Tablet ein und werden manuell in die Kasse gebucht."
        : "Paid orders arrive on your tablet and are recorded manually into your POS.",
    },
    {
      num: "04",
      title: isDe ? "2 % nur bei Erfolg" : "2% only on success",
      desc: isDe
        ? "Keine Grundgebühr, kein Risiko. 2 % pro bezahlter Bestellung zzgl. Stripe."
        : "No monthly base fee. 2% per paid order plus direct Stripe processing.",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 space-y-16">
      {/* Editorial Heading */}
      <RevealOnScroll className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
          {isDe ? "Einfachheit ohne Risiko" : "Zero Risk Setup"}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.05]">
          {isDe
            ? "Du brauchst weniger, als du denkst."
            : "Less hardware than you think."}
        </h2>
        <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
          {isDe
            ? "Keine Techniker-Termine, keine Kassenwechsel und keine monatlichen Knebelverträge."
            : "No technician appointments, no POS swap, and no lock-in monthly contracts."}
        </p>
      </RevealOnScroll>

      {/* 4 Steps Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st, i) => (
          <RevealOnScroll
            key={st.num}
            delay={i * 0.08}
            className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] flex flex-col justify-between space-y-6 hover:border-stone-400 transition-colors"
          >
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#646464]">
                {st.num}
              </div>
              <h3 className="text-lg font-bold text-[#111111]">{st.title}</h3>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                {st.desc}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Big 2 % Pricing Highlight Card */}
      <RevealOnScroll className="rounded-3xl bg-[#111111] text-white p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-200">
            {isDe ? "Erfolgsabhängiges Gebührenmodell" : "Usage-based fee structure"}
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {isDe
              ? "0 € Grundgebühr. 2 % Plattformgebühr pro bezahlter Bestellung."
              : "0 € monthly base fee. 2% platform fee per paid order."}
          </h3>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed">
            {isDe
              ? "Zackisch berechnet 2 % auf Speisen und Getränke. Trinkgelder gehören zu 100 % deinem Team – Zackisch erhebt keine Plattformgebühr auf Trinkgelder. Die Zahlungsabwicklung erfolgt direkt über dein eigenes Stripe-Konto."
              : "Zackisch charges 2% on eligible food & beverage subtotals. Tips belong 100% to your staff – zero Zackisch platform fees on tips. Processing runs directly through your own connected Stripe account."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/pricing`}
              className="text-xs sm:text-sm font-bold text-white underline hover:no-underline"
            >
              {isDe ? "Vollständige Preisdetails & FAQ ansehen →" : "View complete pricing details & FAQ →"}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-2 border-t lg:border-t-0 lg:border-l border-stone-800 pt-6 lg:pt-0 lg:pl-8">
          <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white">
            2 %
          </div>
          <div className="text-xs sm:text-sm font-semibold text-stone-300">
            {isDe ? "pro bezahlter Bestellung" : "per paid order"}
          </div>
          <div className="text-[11px] text-stone-500 max-w-xs">
            {isDe
              ? "zzgl. Stripe-Zahlungsgebühren · 0 € Einrichtungsgebühr"
              : "plus Stripe card fees · 0 € setup fee"}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
