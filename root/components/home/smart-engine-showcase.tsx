"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/content/site-data";

interface SmartEngineShowcaseProps {
  locale: Locale;
}

export function SmartEngineShowcase({ locale }: SmartEngineShowcaseProps) {
  const isDe = locale === "de-de";

  const features = [
    {
      id: "bestsellers",
      badge: isDe ? "Bestellhistorie" : "Order History",
      title: isDe ? "Beliebteste Speisen zuerst" : "Popular Items Ranked",
      desc: isDe
        ? "Sortiert Speisen dynamisch nach den meistbestellten Gerichten deines Lokals – basierend ausschließlich auf echten Zackisch-Bestellungen."
        : "Ranks items dynamically by real venue orders, helping guests decide faster without endless scrolling.",
      metric: isDe ? "40 % schnellere Gäste-Entscheidung" : "40% faster guest decision time",
    },
    {
      id: "upsell",
      badge: isDe ? "Warenkorb-Begleiter" : "Smart Add-ons",
      title: isDe ? "Passende Empfehlungen" : "Relevant Companions",
      desc: isDe
        ? "Gäste, die eine Pinsa wählen, sehen dezent passenden Wein oder Tiramisu im Warenkorb. Kein aggressives Pop-up, sondern natürliche Gastfreundschaft."
        : "Recommends natural pairings (wine with pasta, dessert with coffee) inside the cart without annoying popups.",
      metric: isDe ? "+4 % Durchschnittlicher Warenkorb" : "+4% average order value increase",
    },
    {
      id: "availability",
      badge: isDe ? "Echtzeit 86" : "Real-time 86",
      title: isDe ? "Zutaten & Artikel sperren" : "Instant Sold-Out Toggles",
      desc: isDe
        ? "Hafermilch leer? Burrata ausverkauft? Ein Fingertipp am Personal-Tablet deaktiviert die Zutat in Echtzeit auf allen Gäste-Smartphones."
        : "Run out of oat milk or truffle oil? Staff disables the option with one tap, updating all guest menus immediately.",
      metric: isDe ? "0 Fehlbestellungen in der Küche" : "Zero kitchen order discrepancies",
    },
    {
      id: "reorder",
      badge: isDe ? "Zweite Runde" : "One-Tap Reorder",
      title: isDe ? "Nachbestellung am Tisch" : "Frictionless Table Reorders",
      desc: isDe
        ? "Gläser leer? Gäste rufen das Menü erneut auf und können mit einem Klick die Getränke der Vorrunde nachbestellen."
        : "Empty glasses? Guests reopen the menu and reorder their previous drink round with a single tap.",
      metric: isDe ? "Kein Warten auf Servicekräfte" : "No waving down busy servers",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left Editorial Text */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {isDe ? "Intelligente Plattform" : "Intelligent Platform"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.05]">
            {isDe
              ? "Ein Menü, das mitdenkt."
              : "A menu designed to assist, not confuse."}
          </h2>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {isDe
              ? "Keine unleserlichen PDF-Downloads und keine App-Downloads. Deine Gäste entdecken eine Speisekarte, die sich an Vorlieben orientiert und dem Personal Routinearbeiten abnimmt."
              : "No clunky PDF downloads or required app installations. Your guests browse an interactive menu that adapts to tastes and streamlines staff operations."}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={`/${locale}/product/smart-menu`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:underline"
          >
            <span>{isDe ? "Alle Menü-Funktionen im Detail ansehen" : "Explore all smart menu features"}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Right Interactive Feature Selector */}
      <div className="lg:col-span-7 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveIdx(idx)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "bg-white border-[#111111] shadow-md ring-1 ring-[#111111]"
                    : "bg-[#FAF9F6] border-[#E5E5E2] hover:border-stone-400"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-[#111111]">
                      {feat.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#111111]" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#111111]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E5E2] text-xs font-semibold text-[#111111]">
                  {feat.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
