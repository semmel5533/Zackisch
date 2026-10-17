"use client";

import React from "react";
import {
  RegionLanguageSelector,
  RegionFlag,
  DACH_REGIONS,
  type RegionOption,
} from "@zackisch/design-system";
import { useAdmin } from "@/lib/admin-context";

export { RegionFlag };

export const ADMIN_SUPPORTED_REGIONS: RegionOption[] = DACH_REGIONS;

export function RegionLanguageSwitcher({
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "icon";
}) {
  const {
    currentRegion,
    setCurrentRegion,
    currentLocale,
    setCurrentLocale,
    isRegionalAdmin,
  } = useAdmin();

  const isEn = currentLocale === "en";
  const rbacNotice =
    isRegionalAdmin
      ? isEn
        ? "Regional Admin: Region selection filters operational queues while backend RBAC remains bound to your authorized regions."
        : "Regional-Admin: Die Regionsauswahl filtert operative Warteschlangen; Backend-Berechtigungen bleiben an deine autorisierten Regionen gebunden."
      : isEn
        ? "Note: Your backend RBAC permissions remain strictly bound to your assigned region."
        : "Hinweis: Deine Backend-Berechtigungen bleiben strikt an deine zugewiesene Region gebunden.";

  return (
    <RegionLanguageSelector
      showTrigger
      triggerVariant={variant === "icon" ? "icon" : "compact"}
      triggerClassName={className}
      regionCode={currentRegion}
      languageCode={currentLocale}
      regions={ADMIN_SUPPORTED_REGIONS}
      allowPlannedRegions={isRegionalAdmin}
      rbacNotice={rbacNotice}
      onApply={({ regionCode, languageCode }) => {
        setCurrentRegion(regionCode as Parameters<typeof setCurrentRegion>[0]);
        setCurrentLocale(languageCode as Parameters<typeof setCurrentLocale>[0]);
      }}
    />
  );
}
