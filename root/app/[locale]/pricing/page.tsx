import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { SubpageView } from "@/components/layout/subpage-layout";
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
  const content = PAGES_CONTENT[locale].pricing;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/pricing",
    locale,
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].pricing;

  return (
    <div className="w-full">
      <SubpageView locale={locale} content={content} path="/pricing" />

      {/* Embedded Potential Calculator on Pricing */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E5E5E2]">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {locale === "de-de" ? "Interaktive Berechnung" : "Interactive Estimation"}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#111111]">
            {locale === "de-de"
              ? "Rechne dein individuelles Potenzial durch"
              : "Estimate your individual venue potential"}
          </h2>
          <p className="text-sm text-[#52525B]">
            {locale === "de-de"
              ? "Trage deinen Umsatz ein und sieh, wie sich die 2 % Plattformgebühr und Mehrumsätze verhalten."
              : "Enter your revenue and see how the 2% platform fee and incremental uplifts balance out."}
          </p>
        </div>

        <PotentialCalculator locale={locale} />
      </section>
    </div>
  );
}
