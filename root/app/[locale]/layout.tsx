import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { generateOrganizationJsonLd, generateSoftwareApplicationJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/content/site-data";

export function generateStaticParams() {
  return [{ locale: "de-de" }, { locale: "de-en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }

  const locale = rawLocale as Locale;
  const orgJsonLd = generateOrganizationJsonLd();
  const softwareJsonLd = generateSoftwareApplicationJsonLd(locale);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] selection:bg-[#111111] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      {/* Skip to Content for A11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#111111] text-white rounded-lg font-bold text-xs shadow-lg"
      >
        {locale === "de-de" ? "Direkt zum Inhalt springen" : "Skip to main content"}
      </a>

      <SmoothScroll>
        <Header locale={locale} />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </SmoothScroll>
    </div>
  );
}
