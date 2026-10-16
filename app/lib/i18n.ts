"use client";
import { useState, useEffect, useMemo } from "react";
import { createTranslator } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { translations, Locale, TranslationKeys } from "./translations";

export type { Locale, TranslationKeys };
export { translations };

export function useTranslation() {
  const storeLocale = useLanguageStore((state) => state.locale);
  const [locale, setLocale] = useState<Locale>("de");

  useEffect(() => {
    setLocale(storeLocale);
  }, [storeLocale]);

  const t = useMemo(
    () =>
      createTranslator({
        locale,
        messages: translations[locale] as Record<TranslationKeys, string>,
      }),
    [locale],
  );

  return { t, locale };
}

/**
 * Format price from cents to display string.
 */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}
