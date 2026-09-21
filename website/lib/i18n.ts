"use client";

import { useMemo } from "react";
import { createTranslator } from "next-intl";
import { usePathname } from "next/navigation";
import { translations } from "./translations";
import { parseLocale } from "./regions";

export function useTranslation() {
  const pathname = usePathname() || "";
  const { lang, regionCode, locale: currentLocale } = parseLocale(pathname);

  const t = useMemo(
    () => createTranslator({ locale: lang, messages: translations[lang] }),
    [lang],
  );

  return { t, locale: lang, regionCode, currentLocale };
}
