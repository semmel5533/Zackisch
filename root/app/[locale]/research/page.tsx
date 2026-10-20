import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { RESEARCH_STUDIES } from "@/lib/research";
import type { Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].research;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/research",
    locale,
  });
}

export default async function ResearchPage({
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
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 border-b border-[#E5E5E2]">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#646464]">
            <li>
              <Link href={`/${locale}`} className="hover:text-[#111111]">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#111111]">
              {isDe ? "Forschung & Studien" : "Research & Evidence"}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111]">
            {isDe ? "Wissenschaftliche Primärquellen" : "Scientific Primary Sources"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {isDe ? "Die Forschung hinter Zackisch." : "The Research Behind Zackisch."}
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {isDe
              ? "Wir zeigen transparent, welche wissenschaftlichen Erkenntnisse und Primärstudien unsere Produktentscheidungen inspirieren – und wo die Grenzen der Übertragbarkeit liegen. Keine erfundenen Erfolgsstatistiken."
              : "We openly disclose the peer-reviewed evidence and primary sources that inspire our design decisions — along with clear boundaries of applicability. Zero fabricated claims."}
          </p>
        </div>
      </section>

      {/* Studies Directory */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESEARCH_STUDIES.map((study) => (
            <article
              key={study.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[#646464]">
                    <span className="font-bold text-[#111111]">{study.id}</span>
                    <span>•</span>
                    <span>{study.year}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-[#111111]">
                    {study.type}
                  </span>
                </div>

                {/* Title & Author */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111111] leading-snug">
                    {study.title}
                  </h2>
                  <div className="text-xs text-[#646464] mt-1 font-medium">
                    {study.authors} · <span className="italic">{study.publication}</span>
                  </div>
                </div>

                {/* Sample Context */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E5E2] text-xs text-[#52525B]">
                  <strong>{isDe ? "Untersuchte Stichprobe:" : "Sample & Context:"}</strong>{" "}
                  {study.sample}
                </div>

                {/* What it shows */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{isDe ? "Was die Untersuchung zeigt:" : "Key Findings:"}</span>
                  </div>
                  <p className="text-[#52525B] leading-relaxed pl-4 border-l border-emerald-300">
                    {study.claim[isDe ? "de" : "en"]}
                  </p>
                </div>

                {/* Limitations */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-stone-700 flex items-center gap-1.5">
                    <span>ℹ️</span>
                    <span>{isDe ? "Grenzen der Übertragbarkeit:" : "Limitations & Scope:"}</span>
                  </div>
                  <p className="text-[#646464] leading-relaxed pl-4 border-l border-stone-300">
                    {study.limitations[isDe ? "de" : "en"]}
                  </p>
                </div>
              </div>

              {/* DOI / Source Link */}
              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                <span className="text-[11px] text-[#646464]">
                  {isDe ? "Verifiziert: Oktober 2026" : "Verified: October 2026"}
                </span>
                <a
                  href={study.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E2] text-[#111111] text-xs font-bold hover:bg-[#F7F7F8] hover:border-[#111111] transition-all flex items-center gap-1.5"
                >
                  <span>{isDe ? "Originalquelle / DOI öffnen" : "Open Primary Source / DOI"}</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
