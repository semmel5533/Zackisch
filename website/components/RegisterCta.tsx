"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";

interface RegisterCtaProps {
  variant?: "default" | "inverse";
  className?: string;
}

export function RegisterCta({
  variant = "default",
  className = "",
}: RegisterCtaProps = {}) {
  const { t } = useTranslation();

  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 h-11 px-5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] shrink-0 select-none";

  const colorStyles =
    variant === "inverse"
      ? "bg-white text-black hover:bg-zinc-200 border border-white"
      : "bg-black text-white hover:bg-zinc-800 border border-black";

  return (
    <a
      href={t("registerUrl")}
      className={`${baseStyles} ${colorStyles} ${className}`.trim()}
    >
      <span>{t("registerCta")}</span>
      <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
    </a>
  );
}

