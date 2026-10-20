"use client";

import React from "react";
import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/gsap-reveals";
import type { Locale } from "@/lib/content/site-data";

export function RealitySplit({ locale }: { locale: Locale }) {
  const isDe = locale === "de-de";

  return (
    <section className="w-full bg-[#FAF9F6] border-y border-[#E5E5E2] py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Heading */}
        <RevealOnScroll className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
            {isDe ? "Branchenrealität im Alltag" : "Hospitality Realities"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.05]">
            {isDe
              ? "Guter Service sollte nicht am Warten scheitern."
              : "Great hospitality should never fail over waiting."}
          </h2>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {isDe
              ? "Wenn der Gastraum voll ist, rennt dein Team zwischen Kasse, Bon-Drucker und Tischen hin und her. Zackisch fängt Nachbestellungen digital ab – während deine Kasse und persönliche Gastfreundschaft unverändert bleiben."
              : "During peak rush hours, staff juggle bills, printers, and crowded tables. Zackisch absorbs digital reorders effortlessly while your existing POS and warm personal service stay intact."}
          </p>
        </RevealOnScroll>

        {/* 2 Big Contrasting Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Fact 1: 27 % Wait Time Drop-off */}
          <RevealOnScroll
            delay={0.1}
            className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E2] shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#111111] font-mono">
                27 %
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                {isDe
                  ? "Der Gäste verzichten auf Nachbestellungen bei langen Wartezeiten."
                  : "Of guests abandon reorders when wait times feel excessive."}
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed">
                {isDe
                  ? "Wenn das leere Glas 10 Minuten steht, sinkt die Bestellbereitschaft drastisch. Mit dem Tisch-QR-Code bestellen Gäste ihre zweite Runde in 20 Sekunden."
                  : "Empty glasses left unaddressed lead to lost revenues. With a table QR code, guests reorder second rounds within seconds."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between text-xs text-[#646464]">
              <span>Lightspeed × Medallia Studie (2025)</span>
              <Link
                href={`/${locale}/research`}
                className="font-semibold text-[#111111] hover:underline"
              >
                {isDe ? "Studie ansehen →" : "View research →"}
              </Link>
            </div>
          </RevealOnScroll>

          {/* Fact 2: 45 % Cash in Germany */}
          <RevealOnScroll
            delay={0.2}
            className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E2] shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#111111] font-mono">
                45 %
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                {isDe
                  ? "Bargeldanteil im Alltag – Zackisch bleibt 100 % hybrid."
                  : "Cash share in German dining – Zackisch is 100% hybrid."}
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed">
                {isDe
                  ? "Kein Gast wird zu einer App oder Kartenzahlung gezwungen. Wer mit Bargeld am Tresen oder Tisch zahlen möchte, tut das wie gewohnt. Zackisch ergänzt, statt zu ersetzen."
                  : "No guest is forced to download an app or pay by card. Guests who prefer cash or personal table service do so seamlessly."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between text-xs text-[#646464]">
              <span>Deutsche Bundesbank · Zahlungsverhalten 2024</span>
              <span className="font-semibold text-emerald-800">
                {isDe ? "Kein Kassenwechsel nötig" : "Keep your existing POS"}
              </span>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
