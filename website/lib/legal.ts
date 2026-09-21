import { createTranslator } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations } from "./translations";
import { ALL_LOCALES, parseLocale } from "./regions";
export type LegalKind = "legal" | "privacy" | "gtc";
export function legalTranslator(locale: string) {
  if (!ALL_LOCALES.includes(locale)) notFound();
  const { lang } = parseLocale(locale);
  return createTranslator({ locale: lang, messages: translations[lang] });
}
export function legalMetadata(locale: string, kind: LegalKind): Metadata {
  const t = legalTranslator(locale);
  return {
    title: t(`${kind}Title`),
    description: t(`${kind}Description`),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    alternates: { canonical: `https://www.zakkig.com${t(`${kind}Url`)}` },
    openGraph: {
      title: t(`${kind}Title`),
      description: t(`${kind}Description`),
      locale: t("openGraphLocale"),
      images: ["/og_image.png"],
      type: "website",
    },
  };
}
