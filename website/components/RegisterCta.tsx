"use client";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
export function RegisterCta() {
  const { t } = useTranslation();
  return (
    <a href={t("registerUrl")} className="button-primary">
      {t("registerCta")}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
