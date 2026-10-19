import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportHomeView } from "@/components/SupportHomeView";
import type { SupportLocale } from "@/lib/knowledge-base";

export function generateStaticParams() {
  return [{ locale: "de-de" }, { locale: "de-en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de-de" && locale !== "de-en") {
    return {};
  }
  const isDe = locale === "de-de";

  const title = isDe
    ? "Zackisch Hilfe & Support — Wissensdatenbank & Anleitungen"
    : "Zackisch Help & Support — Knowledge Base & Guides";
  const description = isDe
    ? "Schritt-für-Schritt-Anleitungen zur einfachen Einrichtung, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
    : "Step-by-step guides for simple onboarding, single-entry POS recording, and Stripe Connect direct charges.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://support.zackisch.com/${locale}`,
      languages: {
        "de-DE": "https://support.zackisch.com/de-de",
        "en-DE": "https://support.zackisch.com/de-en",
        "x-default": "https://support.zackisch.com/de-de",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://support.zackisch.com/${locale}`,
      siteName: "Zackisch",
      images: ["/og_image.png"],
      locale: isDe ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og_image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SupportHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const locale: SupportLocale = rawLocale;

  return <SupportHomeView locale={locale} />;
}
