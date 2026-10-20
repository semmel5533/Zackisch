import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { SubpageView } from "@/components/layout/subpage-layout";
import type { Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].quickService;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/solutions/quick-service",
    locale,
  });
}

export default async function QuickServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].quickService;

  return <SubpageView locale={locale} content={content} path="/solutions/quick-service" />;
}
