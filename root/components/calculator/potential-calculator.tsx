"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  calculatePotential,
  convertRevenuePeriod,
  formatEuro,
  type CalculatorPeriod,
  type CalculatorBreakdown,
  OPENING_DAYS_PER_YEAR,
} from "@/lib/calculator";
import type { Locale } from "@/lib/content/site-data";

interface PotentialCalculatorProps {
  locale: Locale;
  initialPeriod?: CalculatorPeriod;
  initialRevenue?: number;
}

export function PotentialCalculator({
  locale,
  initialPeriod = "year",
  initialRevenue = 420000,
}: PotentialCalculatorProps) {
  const isDe = locale === "de-de";
  const [period, setPeriod] = useState<CalculatorPeriod>(initialPeriod);
  const [revenue, setRevenue] = useState<number>(initialRevenue);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const sliderId = useId();
  const inputId = useId();

  // Handle switching periods while preserving the annualized revenue scale
  const handlePeriodChange = (newPeriod: CalculatorPeriod) => {
    if (newPeriod === period) return;
    const converted = convertRevenuePeriod(revenue, period, newPeriod);
    setPeriod(newPeriod);
    setRevenue(converted);
  };

  const results: CalculatorBreakdown = calculatePotential(revenue, period);

  // Slider bounds based on period
  const sliderBounds = {
    year: { min: 60000, max: 2000000, step: 10000 },
    month: { min: 5000, max: 170000, step: 1000 },
    day: { min: 200, max: 7000, step: 50 },
  }[period];

  const periodLabels = {
    year: {
      unit: isDe ? "pro Jahr" : "per year",
      selector: isDe ? "Jahr" : "Year",
    },
    month: {
      unit: isDe ? "pro Monat" : "per month",
      selector: isDe ? "Monat" : "Month",
    },
    day: {
      unit: isDe ? `pro Tag (${OPENING_DAYS_PER_YEAR} Tage/Jahr)` : `per day (${OPENING_DAYS_PER_YEAR} days/yr)`,
      selector: isDe ? "Tag" : "Day",
    },
  }[period];

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E5E2] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300">
      {/* Header & Mode controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E2]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {isDe ? "Modellrechner v3" : "Model Calculator v3"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
            {isDe ? "Umsatz- & Potenzialrechner" : "Revenue & Potential Calculator"}
          </h3>
        </div>

        {/* Period Selector (Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E5E5E2] rounded-2xl self-start sm:self-auto shadow-xs">
          {(["day", "month", "year"] as CalculatorPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriodChange(p)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                period === p
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-[#646464] hover:text-[#111111]"
              }`}
            >
              {p === "day"
                ? isDe ? "Tag" : "Day"
                : p === "month"
                ? isDe ? "Monat" : "Month"
                : isDe ? "Jahr" : "Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Input Slider & Number Field */}
      <div className="py-6 border-b border-[#E5E5E2] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor={sliderId} className="text-sm font-bold text-[#111111]">
            {isDe ? "Dein bisheriger Nettoumsatz:" : "Your current net revenue:"}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                id={inputId}
                type="number"
                min="0"
                max="5000000"
                value={revenue || ""}
                onChange={(e) => setRevenue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-36 px-3 py-1.5 text-right font-mono font-bold text-base bg-white border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
              <span className="absolute right-9 top-2 pointer-events-none text-xs text-[#646464]">
                €
              </span>
            </div>
            <span className="text-xs text-[#646464] font-medium">
              {periodLabels.unit}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <input
            id={sliderId}
            type="range"
            min={sliderBounds.min}
            max={sliderBounds.max}
            step={sliderBounds.step}
            value={revenue}
            onChange={(e) => setRevenue(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E5E5E2] rounded-lg appearance-none cursor-pointer accent-[#111111]"
          />
          <div className="flex justify-between text-[11px] text-[#646464] font-mono mt-1.5">
            <span>{formatEuro(sliderBounds.min, isDe ? "de" : "en", 0)}</span>
            <span>{formatEuro(sliderBounds.max, isDe ? "de" : "en", 0)}</span>
          </div>
        </div>
      </div>

      {/* Primary Results Display (Two Big Numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
        {/* Result 1: Additional Net Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {isDe ? "Rechnerisches Mehrumsatzpotenzial" : "Estimated Revenue Uplift"}
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] mt-2 font-mono">
            +{formatEuro(results.uplift, isDe ? "de" : "en", period === "day" ? 2 : 0)}
          </div>
          <div className="text-xs text-[#646464] mt-1 font-medium">
            {periodLabels.unit} {isDe ? "zusätzlicher Nettoumsatz" : "additional net revenue"}
          </div>
          <p className="text-xs text-[#52525B] mt-4 leading-relaxed border-t border-[#E5E5E2] pt-3">
            {isDe
              ? "Aus 40 % digitaler Quote, 4 % Upselling auf digitale Körbe, Nachbestellungen, vermiedenen Abbrüchen und Wiederbesuchen."
              : "Derived from 40% digital share, 4% digital basket upselling, reorders, avoided drop-offs, and repeat visits."}
          </p>
        </div>

        {/* Result 2: Incremental Contribution Result */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            {isDe
              ? "Modellierter zusätzlicher Ergebnisbeitrag"
              : "Estimated Net Contribution"}
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-emerald-900 mt-2 font-mono">
            +{formatEuro(
              results.netIncrementalResult,
              isDe ? "de" : "en",
              period === "day" ? 2 : 0
            )}
          </div>
          <div className="text-xs text-emerald-800 mt-1 font-medium">
            {periodLabels.unit} {isDe ? "nach variablen Kosten & Gebühren" : "after variable costs & fees"}
          </div>
          <p className="text-xs text-emerald-800 mt-4 leading-relaxed border-t border-emerald-200 pt-3">
            {isDe
              ? "Nach 35 % variablen Kosten, 2 % Zackisch-Gebühr, Stripe-Modellpreis und Gutschrift bisheriger Kartenkosten. 0 € Personalkosteneinsparung."
              : "After 35% variable costs, 2% Zackisch fee, Stripe fee model, and previous card fee credit. 0 € labor savings."}
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer & Zero Labor Saving Declaration */}
      <div className="p-4 rounded-2xl bg-[#F0EFEB] border border-[#E5E5E2] text-xs text-[#52525B] space-y-1.5 leading-relaxed">
        <div className="font-bold text-[#111111] flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>
            {isDe
              ? "Transparente Modellannahmen · Kein statistischer Durchschnitt"
              : "Transparent Model Assumptions · Not a Guaranteed Average"}
          </span>
        </div>
        <p>
          {isDe
            ? "Dies ist ein illustratives, günstiges Szenario auf Basis nachvollziehbarer betriebswirtschaftlicher Parameter, keine garantierte Zackisch-Umsatzsteigerung. Frei gewordene Servicezeit verbessert die Gästeberatung und wird ausdrücklich NICHT als 0 € Lohnkosteneinsparung doppelt verrechnet."
            : "This is an illustrative scenario based on transparent operational parameters, not a guaranteed Zackisch revenue promise. Freed service time enhances hospitality and is strictly NOT monetized as labor cost reduction (0 € labor savings)."}
        </p>
      </div>

      {/* Expandable "So rechnen wir" Methodology Table */}
      <div className="mt-6 pt-4 border-t border-[#E5E5E2]">
        <button
          type="button"
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex items-center justify-between w-full py-2 text-left text-sm font-bold text-[#111111] hover:text-[#000000]"
        >
          <span>
            {isDe ? "So rechnen wir (Vollständige Aufschlüsselung)" : "How we calculate (Detailed breakdown)"}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#E5E5E2]">
            {showMethodology ? (isDe ? "Schließen ↑" : "Close ↑") : (isDe ? "Aufklappen ↓" : "Expand ↓")}
          </span>
        </button>

        {showMethodology && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-[#E5E5E2] space-y-4 animate-fadeIn">
            <div className="text-xs text-[#646464] leading-relaxed">
              {isDe
                ? "Alle vier Umsatztreiber und Kostenpositionen im gewählten Betrachtungszeitraum:"
                : "All four revenue drivers and cost components for the selected timeframe:"}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2]">
                <span className="font-medium text-[#111111]">
                  {isDe ? "+ Upselling (4 % auf digitale Grundkörbe)" : "+ Upselling (4% on base digital carts)"}
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{formatEuro(results.upselling, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2]">
                <span className="font-medium text-[#111111]">
                  {isDe ? "+ Zusätzliche Nachbestellungen (30 × 7 € bei 35k/Mo)" : "+ Additional reorders (30 × 7 € at 35k/mo)"}
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{formatEuro(results.reorders, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2]">
                <span className="font-medium text-[#111111]">
                  {isDe ? "+ Zurückgewonnene Bestellungen (25 × 20 € bei 35k/Mo)" : "+ Recovered orders (25 × 20 € at 35k/mo)"}
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{formatEuro(results.recovered, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2]">
                <span className="font-medium text-[#111111]">
                  {isDe ? "+ Zusätzliche Wiederbesuche (15 × 20 € bei 35k/Mo)" : "+ Repeat visits (15 × 20 € at 35k/mo)"}
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{formatEuro(results.returnVisits, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 font-bold text-[#111111] bg-stone-50 px-2 rounded">
                <span>{isDe ? "= Zusätzlicher Nettoumsatz" : "= Additional Net Revenue"}</span>
                <span className="font-mono">
                  +{formatEuro(results.uplift, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                <span>{isDe ? "− Variable Kosten (35 % vom Mehrumsatz)" : "− Variable costs (35% of uplift)"}</span>
                <span className="font-mono text-rose-700">
                  -{formatEuro(results.variableCost, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                <span>{isDe ? "− Zackisch-Plattformgebühr (2 % auf digitales Volumen)" : "− Zackisch platform fee (2% on digital sales)"}</span>
                <span className="font-mono text-rose-700">
                  -{formatEuro(results.zackischFee, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                <span>{isDe ? "− Stripe-Beispielgebühr (1,5 % + 0,25 € pro Transaktion)" : "− Stripe fee model (1.5% + 0.25 € per transaction)"}</span>
                <span className="font-mono text-rose-700">
                  -{formatEuro(results.stripeFee, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                <span>{isDe ? "+ Entfallene bisherige Kartengebühren (Modellannahme)" : "+ Displaced prior card fees (model assumption)"}</span>
                <span className="font-mono text-emerald-700">
                  +{formatEuro(results.previousCardFeeCredit, isDe ? "de" : "en", 2)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464] font-bold">
                <span>{isDe ? "− Eingesparte Personalkosten / Lohnkosten" : "− Labor cost savings"}</span>
                <span className="font-mono text-[#111111]">
                  0,00 € ({isDe ? "Keine Lohnkürzung" : "Zero staff cuts"})
                </span>
              </div>

              <div className="flex justify-between py-2 pt-3 font-bold text-sm text-emerald-900 bg-emerald-50 px-3 rounded-xl border border-emerald-200">
                <span>{isDe ? "= Zusätzlicher modellierter Ergebnisbeitrag" : "= Net Incremental Contribution"}</span>
                <span className="font-mono">
                  +{formatEuro(results.netIncrementalResult, isDe ? "de" : "en", 2)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Link
                href={`/${locale}/research`}
                className="text-xs font-bold text-[#111111] hover:underline"
              >
                {isDe ? "Wissenschaftliche Primärquellen ansehen →" : "View scientific primary sources →"}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button to App Registration */}
      <div className="mt-8 pt-6 border-t border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#646464]">
          {isDe
            ? "Möchtest du Zackisch in deinem Lokal unverbindlich testen?"
            : "Ready to test Zackisch in your venue without upfront risk?"}
        </div>
        <a
          href="https://app.zackisch.com/sign-up"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all text-center shadow-xs"
        >
          {isDe ? "Jetzt kostenlos registrieren" : "Sign up free now"}
        </a>
      </div>
    </div>
  );
}
