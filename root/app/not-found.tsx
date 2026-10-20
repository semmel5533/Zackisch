import React from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seite nicht gefunden - Zackisch",
  description: "Die gewünschte Seite existiert nicht auf Zackisch.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function RootNotFound() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isGerman = pathname.startsWith("/de-de");

  const homeHref = isGerman ? "/de-de" : "/de-en";
  const h1 = isGerman
    ? "Hier ist gerade nichts zu bestellen."
    : "There is nothing to order here.";
  const lead = isGerman
    ? "Die Seite scheint nicht mehr da zu sein. Auf der Startseite findest du sicher weiter."
    : "The page you requested could not be found. Head back to the homepage to explore Zackisch.";
  const cta = isGerman ? "Zur Startseite" : "Back to homepage";
  const footerNote = isGerman
    ? "© 2026 Zackisch · Digitales Bestellsystem Gastronomie"
    : "© 2026 Zackisch · Hospitality Ordering & Payment";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col justify-between p-6 sm:p-12">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          <Image
            src="/branding/combination_mark.svg"
            alt="Zackisch"
            width={130}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="text-xs font-semibold text-[#646464] border border-[#E5E5E2] rounded-lg px-2.5 py-1 bg-white">
          HTTP 404
        </div>
      </header>

      <main className="max-w-xl mx-auto my-auto text-center py-16 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-200/80 text-2xl font-bold">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          {h1}
        </h1>
        <p className="text-sm sm:text-base text-[#646464] leading-relaxed max-w-md mx-auto">
          {lead}
        </p>
        <div className="pt-2">
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all shadow-sm"
          >
            {cta}
          </Link>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto text-center text-xs text-[#646464] pt-8 border-t border-[#E5E5E2]">
        {footerNote}
      </footer>
    </div>
  );
}
