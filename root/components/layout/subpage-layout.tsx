import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import type { SubpageContent } from "@/lib/content/pages-data";
import { RevealOnScroll } from "@/components/motion/gsap-reveals";

interface SubpageViewProps {
  locale: Locale;
  content: SubpageContent;
  path: string;
}

export function SubpageView({ locale, content, path }: SubpageViewProps) {
  const isDe = locale === "de-de";

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      {/* Subpage Hero */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 border-b border-[#E5E5E2]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#646464]">
            <li>
              <Link href={`/${locale}`} className="hover:text-[#111111]">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#111111]">{content.title}</li>
          </ol>
        </nav>

        <RevealOnScroll className="max-w-3xl space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111] shadow-2xs">
            {content.hero.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-[#111111] leading-[1.05]">
            {content.hero.h1}
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {content.hero.lead}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            {content.hero.ctaPrimary && (
              <a
                href={EXTERNAL_URLS.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all shadow-sm active:scale-98"
              >
                {content.hero.ctaPrimary}
              </a>
            )}
            {content.hero.ctaSecondary && (
              <Link
                href={`/${locale}/#signature-demo`}
                className="px-6 py-3.5 rounded-full border border-[#E5E5E2] bg-white text-[#111111] text-sm font-semibold hover:bg-[#FAF9F6] transition-all shadow-2xs"
              >
                {content.hero.ctaSecondary}
              </Link>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {/* Main Content Sections */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-20">
        {content.sections.map((sec, idx) => (
          <RevealOnScroll
            key={sec.id || idx}
            delay={idx * 0.05}
            className={`grid grid-cols-1 ${
              sec.image ? "lg:grid-cols-12" : "max-w-3xl"
            } gap-10 items-center`}
          >
            <div className={sec.image ? "lg:col-span-7 space-y-4" : "space-y-4"}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                {sec.title}
              </h2>
              {sec.subtitle && (
                <div className="text-xs sm:text-sm font-semibold text-[#646464] uppercase tracking-wider">
                  {sec.subtitle}
                </div>
              )}
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed whitespace-pre-line">
                {sec.content}
              </p>

              {sec.points && sec.points.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {sec.points.map((pt) => (
                    <div
                      key={pt.title}
                      className="p-5 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] space-y-1.5 hover:border-stone-400 transition-colors"
                    >
                      <div className="font-bold text-xs sm:text-sm text-[#111111]">
                        {pt.title}
                      </div>
                      <div className="text-xs text-[#646464] leading-relaxed">
                        {pt.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sec.image && (
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E5E5E2] shadow-lg bg-stone-100 group">
                  <Image
                    src={sec.image}
                    alt={sec.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            )}
          </RevealOnScroll>
        ))}

        {/* Section FAQ if present */}
        {content.faq && content.faq.length > 0 && (
          <RevealOnScroll className="pt-12 border-t border-[#E5E5E2] max-w-3xl space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              {isDe ? "Häufige Fragen" : "Frequently Asked Questions"}
            </h3>
            <div className="space-y-3">
              {content.faq.map((item, i) => (
                <details
                  key={i}
                  className="group p-5 rounded-2xl bg-white border border-[#E5E5E2] [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-2xs hover:border-stone-400 transition-colors"
                >
                  <summary className="flex items-center justify-between text-sm font-bold text-[#111111] focus:outline-none">
                    <span>{item.q}</span>
                    <span className="transition-transform group-open:rotate-180 text-stone-400 text-xs">
                      ↓
                    </span>
                  </summary>
                  <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mt-3 pt-3 border-t border-[#E5E5E2]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </section>

      {/* Bottom Conversion Banner */}
      <section className="w-full bg-[#FAF9F6] border-t border-[#E5E5E2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              {isDe
                ? "Bereit für Zackisch in deinem Betrieb?"
                : "Ready to launch Zackisch in your venue?"}
            </h4>
            <p className="text-xs sm:text-sm text-[#646464]">
              {isDe
                ? "Keine Grundgebühr, keine Vertragslaufzeit. In wenigen Minuten eingerichtet."
                : "No monthly base fee, no lock-in contract. Set up in minutes."}
            </p>
          </div>
          <a
            href={EXTERNAL_URLS.signup}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-[#111111] text-white text-sm font-bold hover:bg-black transition-all shadow-md active:scale-98 shrink-0"
          >
            {isDe ? "Kostenlos registrieren" : "Sign up free"}
          </a>
        </div>
      </section>
    </div>
  );
}
