"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Ticket } from "lucide-react";
import { searchArticles, type SupportLocale } from "@/lib/knowledge-base";

export function SupportSearch({ locale }: { locale: SupportLocale }) {
  const isDe = locale === "de-de";
  const [query, setQuery] = useState("");
  const searchResults = query.trim() ? searchArticles(locale, query) : [];

  return (
    <>
      <div className="max-w-2xl mx-auto relative">
        <Search className="w-5 h-5 text-[#495A52] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isDe
              ? "Suche nach Kasse, POS, TSE, Stripe, Trinkgeld, QR-Druck, Tablet..."
              : "Search for POS, receipt, Stripe, tips, QR printing, tablet..."
          }
          className="w-full h-13 pl-12 pr-4 rounded-full bg-white text-[#14231D] placeholder:text-[#6C7B73] text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#DCEFE5]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#DCEFE5]">
        <span>{isDe ? "Häufig gesucht:" : "Popular searches:"}</span>
        {["Kasse erfassen", "Kein Kassenbeleg", "2 % Provision", "QR Ruhezone", "Tablet koppeln"].map(
          (term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-3 py-1 rounded-full bg-[#245740]/80 hover:bg-[#245740] transition-colors cursor-pointer"
            >
              {term}
            </button>
          )
        )}
      </div>

      {query.trim() !== "" && (
        <section className="bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-4 shadow-xs text-left max-w-6xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#14231D]">
              {isDe
                ? `Suchergebnisse für „${query}“ (${searchResults.length})`
                : `Search results for "${query}" (${searchResults.length})`}
            </h2>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-[#173C2B] hover:underline cursor-pointer"
            >
              {isDe ? "Suche zurücksetzen" : "Clear search"}
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[#495A52]">
                {isDe
                  ? "Kein passender Artikel gefunden. Unser Team hilft dir gerne direkt per Support-Ticket weiter."
                  : "No matching article found. Our team is happy to help you via a support ticket."}
              </p>
              <Link
                href={`/${locale}/tickets`}
                className="inline-flex h-10 px-5 rounded-full bg-[#173C2B] text-white text-xs font-semibold items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>{isDe ? "Support-Ticket erstellen" : "Create Support Ticket"}</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#DDD7CA]">
              {searchResults.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${locale}/articles/${article.slug}`}
                  className="py-4 flex items-start justify-between gap-4 hover:bg-[#F7F5EF]/60 px-3 rounded-2xl transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#14231D]">
                      {article.title[locale]}
                    </h3>
                    <p className="text-xs text-[#495A52]">
                      {article.summary[locale]}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#245740] shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
