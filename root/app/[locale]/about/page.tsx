import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].about;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const isDe = locale === "de-de";
  const content = PAGES_CONTENT[locale].about;

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
            <li className="font-semibold text-[#111111]">{content.title}</li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111]">
            {content.hero.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {content.hero.h1}
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {content.hero.lead}
          </p>
        </div>
      </section>

      {/* Main Founder Story Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border border-[#E5E5E2] shadow-lg bg-stone-100">
              <Image
                src="/derived/selim_full.webp"
                alt="Selim Eser — Gründer von Zackisch"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E2] text-xs text-[#646464] space-y-1">
              <div className="font-bold text-[#111111]">Selim Eser</div>
              <div>
                {isDe
                  ? "Informatikstudent an der Technischen Hochschule Mannheim & Gründer von Zackisch."
                  : "Computer Science Student at Mannheim University of Applied Sciences & Founder of Zackisch."}
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                {isDe ? "Vom studentischen Alltag zum eigenen Startup" : "From everyday student frustration to startup"}
              </h2>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                {isDe
                  ? "Die Idee für Zackisch entstand nicht in einem Konferenzraum, sondern an einem ganz gewöhnlichen Nachmittag in einem Mannheimer Café. Ich wollte einfach nur bestellen. Doch das Lokal war voll, das Team im Stress, und ehe der Blickkontakt zur Bedienung stand, waren 15 Minuten vergangen. Als ich später noch ein Wasser und einen Espresso nachbestellen wollte, begann das Warten von Neuem."
                  : "The idea for Zackisch wasn't hatched in a corporate boardroom, but on a busy afternoon in a café in Mannheim. I just wanted to place an order. But the venue was packed, staff were rushing, and 15 minutes passed before eye contact was even possible. When I wanted to order another water and espresso later on, the waiting cycle started all over again."}
              </p>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                {isDe
                  ? "Mir wurde klar: Die Digitalisierung in der Gastronomie darf nicht bedeuten, Personal wegzurationalisieren oder die menschliche Herzlichkeit durch seelenlose Bestellkioske zu ersetzen. Die Lösung muss sein, Gästen und Servicekräften ein Werkzeug an die Hand zu geben, das Routineabläufe beschleunigt – sodass mehr Zeit für echte Gastfreundschaft bleibt."
                  : "It became obvious to me: Digitalization in hospitality must not mean replacing human warmth with sterile kiosks or laying off dedicated staff. The solution must be providing guests and teams with an intuitive tool that removes routine bottlenecks — freeing up time for genuine hospitality."}
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E2] space-y-1">
                <div className="font-bold text-xs text-[#111111]">
                  {isDe ? "Bodenständig aus Mannheim" : "Rooted in Mannheim"}
                </div>
                <div className="text-xs text-[#646464] leading-relaxed">
                  {isDe
                    ? "Der Name 'Zackisch' ist eine Hommage an den kurpfälzischen Dialekt und steht für prompte, zackige Bedienung ohne Hektik."
                    : "The name 'Zackisch' is an homage to local Mannheim dialect, signifying prompt service without stress."}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E2] space-y-1">
                <div className="font-bold text-xs text-[#111111]">
                  {isDe ? "Wahlfreiheit & Bargeld" : "Freedom of Choice & Cash"}
                </div>
                <div className="text-xs text-[#646464] leading-relaxed">
                  {isDe
                    ? "Kein Digitalzwang. Klassischer Kellnerservice und Barzahlung bleiben für Gäste und Betriebe immer vollwertig erhalten."
                    : "No digital coercion. Traditional waiter service and cash payments remain fully welcome."}
                </div>
              </div>
            </div>

            {/* MARS Center of Entrepreneurship Section */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E5E2] shadow-xs flex flex-col sm:flex-row items-center gap-6">
              <div className="w-36 h-16 relative shrink-0">
                <Image
                  src="/partners/mars_combination_mark.svg"
                  alt="MARS Center of Entrepreneurship"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-1 text-xs text-[#52525B]">
                <div className="font-bold text-sm text-[#111111]">
                  {isDe ? "Unterstützt durch das MARS Center" : "Supported by the MARS Center"}
                </div>
                <p className="leading-relaxed">
                  {isDe
                    ? "Zackisch wird vom MARS Center of Entrepreneurship der Hochschule Mannheim auf dem Weg zur Unternehmensgründung fachlich und beratend begleitet."
                    : "Zackisch is mentored and supported on its entrepreneurial journey by the MARS Center of Entrepreneurship at Mannheim University of Applied Sciences."}
                </p>
                <div className="text-[10px] text-[#646464] pt-1">
                  {isDe
                    ? "Hinweis: Rein institutionelle Unterstützung; keine behördliche Produktzertifizierung."
                    : "Note: Institutional entrepreneurial guidance; not an official accreditation."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="w-full bg-[#FAF9F6] border-t border-[#E5E5E2] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-[#111111]">
              {isDe ? "Möchtest du dich austauschen?" : "Would you like to connect?"}
            </h4>
            <p className="text-xs sm:text-sm text-[#646464] mt-1">
              {isDe
                ? "Ich freue mich über jedes Feedback von Gastronomen und Entwicklern."
                : "I welcome any direct feedback from restaurateurs, baristas, and developers."}
            </p>
          </div>
          <a
            href={EXTERNAL_URLS.email}
            className="px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all shadow-sm"
          >
            {isDe ? "E-Mail an Selim schreiben" : "Send email to Selim"}
          </a>
        </div>
      </section>
    </div>
  );
}
