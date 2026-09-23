"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { buttonVariants } from "./ui/button-variants";
import { cn } from "@/lib/utils";

interface RegisterCtaProps {
  variant?: "default" | "inverse";
  className?: string;
}

export function RegisterCta({
  variant = "default",
  className = "",
}: RegisterCtaProps = {}) {
  const { t } = useTranslation();

  return (
    <a
      href={t("registerUrl")}
      className={cn(
        buttonVariants({ variant: variant === "inverse" ? "outline" : "default" }),
        variant === "inverse" && "border-background focus-visible:ring-white",
        className,
      )}
    >
      <span>{t("registerCta")}</span>
      <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
    </a>
  );
}
