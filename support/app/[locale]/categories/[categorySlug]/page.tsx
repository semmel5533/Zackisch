"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SupportShell } from "@/components/SupportShell";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const locale: SupportLocale =
    params?.locale === "de-en" ? "de-en" : "de-de";
  const categorySlug = String(params?.categorySlug || "");
  const isDe = locale === "de-de";

  const category = getCategoryBySlug(categorySlug);
  const articles = getArticlesByCategory(categorySlug);

  if (!category) {
    return (
      <SupportShell locale={locale}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold">
            {isDe ? "Kategorie nicht gefunden" : "Category not found"}
          </h1>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#173C2B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isDe ? "Zurück zur Übersicht" : "Back to Help Center"}</span>
          </Link>
        </div>
      </SupportShell>
    );
  }

  return (
    <SupportShell locale={locale}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#495A52] hover:text-[#14231D]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isDe ? "Alle Themenbereiche" : "All Categories"}</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245740]">
            <BookOpen className="w-4 h-4" />
            <span>{category.badge[locale]}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {category.title[locale]}
          </h1>
          <p className="text-sm text-[#495A52]">
            {category.description[locale]}
          </p>
        </div>

        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${locale}/articles/${article.slug}`}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-5 hover:border-[#245740] transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-[#14231D]">
                  {article.title[locale]}
                </h2>
                <p className="text-xs text-[#495A52] leading-relaxed">
                  {article.summary[locale]}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#245740] shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </SupportShell>
  );
}
