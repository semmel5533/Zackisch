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

const urlKeyMap: Record<LegalKind, "legalUrl" | "privacyUrl" | "gtcUrl"> = {
  legal: "legalUrl",
  privacy: "privacyUrl",
  gtc: "gtcUrl",
};

export function legalMetadata(locale: string, kind: LegalKind): Metadata {
  const t = legalTranslator(locale);
  const tDe = createTranslator({ locale: "de", messages: translations.de });
  const tEn = createTranslator({ locale: "en", messages: translations.en });
  const urlKey = urlKeyMap[kind];

  return {
    title: t(`${kind}Title`),
    description: t(`${kind}Description`),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `https://www.zakkig.com${t(urlKey)}`,
      languages: {
        "de-DE": `https://www.zakkig.com${tDe(urlKey)}`,
        "en-DE": `https://www.zakkig.com${tEn(urlKey)}`,
        "x-default": `https://www.zakkig.com${tDe(urlKey)}`,
      },
    },
    openGraph: {
      title: t(`${kind}Title`),
      description: t(`${kind}Description`),
      url: `https://www.zakkig.com${t(urlKey)}`,
      locale: t("openGraphLocale"),
      images: ["/og_image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t(`${kind}Title`),
      description: t(`${kind}Description`),
      images: ["/og_image.png"],
    },
  };
}
