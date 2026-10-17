"use client";

import React from "react";
import {
  RegionLanguageSelector,
  RegionFlag,
} from "@zackisch/design-system";
import { useTranslation, type Locale } from "@/lib/i18n";
import { SUPPORTED_REGIONS } from "@/lib/regions";
import { useLanguageStore } from "@/store/language-store";
import { useRegionStore } from "@/store/region-store";

export { RegionFlag };

interface RegionLanguageSwitcherProps {
  className?: string;
  variant?: string;
  size?: string;
}

export function RegionLanguageSwitcher({
  className,
  size = "icon",
}: RegionLanguageSwitcherProps) {
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  const regions = Object.values(SUPPORTED_REGIONS).map((r) => ({
    code: r.code,
    nativeName: r.nativeName,
    status: "active" as const,
  }));

  const languages = [
    { code: "de", label: t("german") },
    { code: "en", label: t("english") },
  ];

  return (
    <RegionLanguageSelector
      showTrigger
      triggerVariant={size === "icon" ? "icon" : "pill"}
      triggerClassName={className}
      regionCode={region}
      languageCode={locale}
      regions={regions}
      languages={languages}
      labels={{
        title: t("regionSelectorTitle"),
        description: t("regionSelectorDescription"),
        regionLegend: t("regionLabel"),
        languageLegend: t("languageLabel"),
        cancel: t("cancel"),
        saveAndApply: t("saveAndContinue"),
        triggerAriaLabel: t("regionSelectorTitle"),
      }}
      onApply={({ regionCode, languageCode }) => {
        setRegion(regionCode);
        setLocale(languageCode as Locale);
      }}
    />
  );
}
