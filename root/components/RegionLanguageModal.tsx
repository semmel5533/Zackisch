"use client";

import { usePathname, useRouter } from "next/navigation";
import { createTranslator } from "next-intl";
import {
  RegionLanguageSelector,
  RegionFlag,
} from "@zackisch/design-system";
import { REGIONS, parseLocale } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/translations";

export { RegionFlag };

export function RegionLanguageModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { t } = useTranslation();
  const active = parseLocale(pathname);
  const region = REGIONS[active.regionCode] || REGIONS.de;

  function handleApply({ languageCode }: { regionCode: string; languageCode: string }) {
    document.cookie = `zackisch_locale=${languageCode}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("zackisch_locale", languageCode);
    } catch {
      /* Cookie remains authoritative when storage is unavailable. */
    }
    const { lang } = parseLocale(languageCode);
    const target = createTranslator({
      locale: lang,
      messages: translations[lang],
    });
    const route = pathname.split("/")[2];
    const key =
      route === "legal-notice" || route === "legal"
        ? "legalUrl"
        : route === "privacy-policy" || route === "privacy"
          ? "privacyUrl"
          : route === "gtc"
            ? "gtcUrl"
            : route === "data-processing"
              ? "dataProcessingUrl"
              : route === "accessibility"
                ? "accessibilityUrl"
                : "homeUrl";
    onClose();
    router.push(target(key));
  }

  return (
    <RegionLanguageSelector
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      regionCode={region.code}
      languageCode={active.locale}
      regions={[{ code: region.code, nativeName: region.nativeName, status: "active" }]}
      languages={region.locales.map((loc) => ({ code: loc.code, label: loc.label }))}
      labels={{
        title: t("regionSelectorTitle"),
        description: t("regionSelectorDescription"),
        regionLegend: t("regionLabel"),
        languageLegend: t("languageLabel"),
        cancel: t("cancel"),
        saveAndApply: t("saveAndContinue"),
      }}
      onApply={handleApply}
    />
  );
}
