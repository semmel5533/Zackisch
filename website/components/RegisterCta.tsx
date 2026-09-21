"use client";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
export function RegisterCta() {
  const { t } = useTranslation();
  return (
    <a href={t("registerUrl")} className="button-primary">
      {t("registerCta")}
      <ArrowUpRight size={19} weight="bold" aria-hidden="true" />
    </a>
  );
}
