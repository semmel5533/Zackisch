import React from "react";
import Link from "next/link";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";
import type { LegalDocument } from "@/lib/content/legal-data";

interface LegalDocumentViewProps {
  locale: Locale;
  docKey: string;
  doc: LegalDocument;
}

const LEGAL_DOC_LINKS: Array<{ key: string; path: string; labelDe: string; labelEn: string }> = [
  { key: "legal-notice", path: "/legal-notice", labelDe: "Impressum", labelEn: "Legal Notice" },
  { key: "privacy", path: "/privacy", labelDe: "Datenschutz", labelEn: "Privacy Policy" },
  { key: "cookies", path: "/cookies", labelDe: "Cookies", labelEn: "Cookie Policy" },
  { key: "business-terms", path: "/legal/business-terms", labelDe: "B2B-Bedingungen", labelEn: "Merchant Terms" },
  { key: "guest-terms", path: "/legal/guest-terms", labelDe: "Gast-Bedingungen", labelEn: "Guest Terms" },
  { key: "payments", path: "/legal/payments", labelDe: "Zahlungen & Stripe", labelEn: "Payment Processing" },
];

export function LegalDocumentView({ locale, docKey, doc }: LegalDocumentViewProps) {
  const isDe = locale === "de-de";

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero / Header */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 border-b border-[#E5E5E2]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#646464]">
            <li>
              <Link href={`/${locale}`} className="hover:text-[#111111]">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#646464]">{isDe ? "Rechtliches" : "Legal Hub"}</li>
            <li>/</li>
            <li className="font-semibold text-[#111111]">{doc.title}</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111]">
              {doc.statusBadge}
            </span>
            <span className="text-xs text-[#646464]">
              {isDe ? "Stand:" : "Last updated:"} {doc.lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {doc.title}
          </h1>
          <p className="text-base text-[#52525B] leading-relaxed max-w-3xl">
            {doc.metaDescription}
          </p>
        </div>

        {/* Quick Hub Navigation Pills */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E2]">
          <div className="text-xs font-semibold text-[#646464] mb-3">
            {isDe ? "Zentraler Legal-Hub Dokumente:" : "Legal Hub Documents:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {LEGAL_DOC_LINKS.map((item) => {
              const isActive = item.key === docKey;
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.path}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#111111] text-white shadow-sm"
                      : "bg-[#FAF9F6] border border-[#E5E5E2] text-[#52525B] hover:text-[#111111] hover:bg-stone-100"
                  }`}
                >
                  {isDe ? item.labelDe : item.labelEn}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Document Body */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents (sticky on desktop) */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-8 p-6 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                {isDe ? "Inhaltsverzeichnis" : "Table of Contents"}
              </h2>
              <nav aria-label="Table of contents">
                <ol className="space-y-2 text-xs">
                  {doc.sections.map((section, idx) => (
                    <li key={idx}>
                      <a
                        href={`#section-${idx + 1}`}
                        className="text-[#52525B] hover:text-[#111111] hover:underline block leading-snug"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="pt-4 border-t border-[#E5E5E2] space-y-2 text-xs text-[#646464]">
                <div className="font-semibold text-[#111111]">
                  {isDe ? "Rechtlicher Ansprechpartner" : "Legal Inquiries"}
                </div>
                <div>Selim Eser · Zackisch</div>
                <a
                  href={EXTERNAL_URLS.email}
                  className="text-[#111111] underline hover:no-underline font-medium block"
                >
                  selim@zackisch.com
                </a>
              </div>
            </div>
          </aside>

          {/* Sections List */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            {doc.sections.map((section, idx) => (
              <section
                key={idx}
                id={`section-${idx + 1}`}
                className="scroll-mt-8 space-y-4 pb-8 border-b border-[#E5E5E2] last:border-0"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                  {section.heading}
                </h2>
                <div className="text-sm text-[#52525B] leading-relaxed whitespace-pre-line space-y-3">
                  {section.text}
                </div>

                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-6 space-y-4 pt-4">
                    {section.subsections.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E2] space-y-2"
                      >
                        <h3 className="font-bold text-xs sm:text-sm text-[#111111]">
                          {sub.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed whitespace-pre-line">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      </section>

      {/* Footer Notice */}
      <section className="w-full bg-[#FAF9F6] border-t border-[#E5E5E2] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#646464]">
          <div>
            {isDe
              ? "Kanonischer Legal-Hub für zackisch.com, app.zackisch.com und support.zackisch.com."
              : "Canonical Legal Hub for zackisch.com, app.zackisch.com and support.zackisch.com."}
          </div>
          <a
            href={EXTERNAL_URLS.email}
            className="font-semibold text-[#111111] hover:underline"
          >
            {isDe ? "Fragen? E-Mail senden" : "Questions? Email us"}
          </a>
        </div>
      </section>
    </div>
  );
}
