import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { PotentialCalculator } from "@/components/calculator/potential-calculator";
import type { Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].calculator;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/potential-calculator",
    locale,
  });
}

export default async function PotentialCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const isDe = locale === "de-de";

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 border-b border-[#E5E5E2]">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#646464]">
            <li>
              <Link href={`/${locale}`} className="hover:text-[#111111]">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#111111]">
              {isDe ? "Potenzialrechner" : "Revenue Calculator"}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111]">
            {isDe ? "Wirtschaftlichkeit & Simulation" : "Economics & Estimation"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {isDe
              ? "Was könnte mit Zackisch in deinem Lokal möglich sein?"
              : "What could be possible with Zackisch in your venue?"}
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {isDe
              ? "Rechne das rechnerische Mehrumsatzpotenzial für deinen Betrieb durch. Nur zwei Eingaben, transparente Annahmen, keine erfundenen Versprechen."
              : "Estimate the revenue growth potential for your venue. Just two inputs, transparent assumptions, zero fabricated promises."}
          </p>
        </div>
      </section>

      {/* Main Interactive Calculator */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PotentialCalculator locale={locale} />
      </section>

      {/* Methodology and Scientific Context */}
      <section className="w-full bg-[#FAF9F6] border-t border-[#E5E5E2] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111111]">
              {isDe ? "Hintergrund & Methodik des Modells" : "Methodology & Economic Model Context"}
            </h2>
            <p className="text-sm text-[#52525B] leading-relaxed">
              {isDe
                ? "Unser Modell basiert auf fundierten, vorsichtigen Annahmen und trennt sauber zwischen belegten Mechanismen und freien Schätzungen:"
                : "Our model is built on transparent, cautious assumptions, clearly distinguishing between verified mechanisms and estimates:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] space-y-3">
              <h3 className="font-bold text-base text-[#111111]">
                {isDe ? "1. Vier disjunkte Umsatztreiber" : "1. Four Disjoint Revenue Drivers"}
              </h3>
              <ul className="text-xs text-[#52525B] space-y-2 leading-relaxed">
                <li>
                  <strong>{isDe ? "4 % Upselling:" : "4% Upselling:"}</strong>{" "}
                  {isDe
                    ? "Gilt ausschließlich für die initial digitalisierten 40 % der Warenkörbe."
                    : "Applies exclusively to the initial 40% digital order volume."}
                </li>
                <li>
                  <strong>{isDe ? "Zusätzliche Nachbestellungen:" : "Additional Reorders:"}</strong>{" "}
                  {isDe
                    ? "Spontane Zwischenrunden (modelliert als 30 Vorgänge à 7 € bei 35k Monatsumsatz)."
                    : "Spontaneous drink/dessert reorders (modeled as 30 orders of 7 € at 35k/mo)."}
                </li>
                <li>
                  <strong>{isDe ? "Gerettete Bestellungen:" : "Recovered Orders:"}</strong>{" "}
                  {isDe
                    ? "Gäste, die sonst wegen Warteschlangen vorzeitig gegangen wären (25 Vorgänge à 20 €)."
                    : "Guests who otherwise would walk out due to wait times (25 orders of 20 €)."}
                </li>
                <li>
                  <strong>{isDe ? "Wiederkehrende Besuche:" : "Repeat Visits:"}</strong>{" "}
                  {isDe
                    ? "Höhere Kundenzufriedenheit führt zu mehr Wiedereinkehr (15 Vorgänge à 20 €)."
                    : "Higher satisfaction driving customer loyalty (15 orders of 20 €)."}
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] space-y-3">
              <h3 className="font-bold text-base text-[#111111]">
                {isDe ? "2. Ehrliche Kostengrenzen" : "2. Honest Cost Boundaries"}
              </h3>
              <ul className="text-xs text-[#52525B] space-y-2 leading-relaxed">
                <li>
                  <strong>{isDe ? "0 € Personalkosteneinsparung:" : "0 € Labor Cost Savings:"}</strong>{" "}
                  {isDe
                    ? "Zackisch führt zu keinem Personalabbau und keinen Lohnkürzungen. Zeit wird für besseren Service genutzt."
                    : "Zackisch causes zero layoffs or wage cuts. Time is redirected into hospitality."}
                </li>
                <li>
                  <strong>{isDe ? "35 % variable Kosten:" : "35% Variable Costs:"}</strong>{" "}
                  {isDe
                    ? "Für Wareneinsatz und Zubereitung der zusätzlichen Speisen/Getränke."
                    : "For ingredients and preparation of incremental orders."}
                </li>
                <li>
                  <strong>{isDe ? "Zahlungs- & Plattformgebühren:" : "Processing & Platform Fees:"}</strong>{" "}
                  {isDe
                    ? "2 % Zackisch-Gebühr sowie beispielhafte 1,5 % + 0,25 € Stripe-Gebühren werden voll abgezogen."
                    : "2% Zackisch platform fee and illustrative Stripe fees are fully deducted."}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href={`/${locale}/research`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:underline"
            >
              <span>{isDe ? "Wissenschaftliche Primärquellen ansehen" : "Explore scientific primary sources"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
