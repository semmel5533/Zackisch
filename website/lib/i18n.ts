"use client";

import { usePathname } from "next/navigation";
import { translations, Locale, TranslationKeys } from "./translations";
import { parseLocale } from "./regions";

export function useTranslation() {
  const pathname = usePathname() || "";
  const { lang, regionCode, locale: currentLocale } = parseLocale(pathname);

  const t = (key: TranslationKeys): string => {
    return translations[lang][key];
  };

  return { t, locale: lang, regionCode, currentLocale };
}
