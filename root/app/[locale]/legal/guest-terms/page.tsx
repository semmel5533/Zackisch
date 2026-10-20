import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEGAL_DOCS } from "@/lib/content/legal-data";
import { constructMetadata } from "@/lib/seo";
import { LegalDocumentView } from "@/components/layout/legal-document-view";
import type { Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const doc = LEGAL_DOCS[locale]["guest-terms"];

  return constructMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: "/legal/guest-terms",
    locale,
  });
}

export default async function GuestTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const doc = LEGAL_DOCS[locale]["guest-terms"];

  return <LegalDocumentView locale={locale} docKey="guest-terms" doc={doc} />;
}
