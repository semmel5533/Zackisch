"use client";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PriceProps {
  cents: number;
  from?: boolean;
  prefix?: string;
  className?: string;
  currencyClassName?: string;
  digitsClassName?: string;
}

/**
 * Renders prices with digits (and decimal comma) strictly in Inter (tabular-nums),
 * with the same self-hosted Inter face for the currency, prefix and surrounding text.
 */
export function Price({
  cents,
  from = false,
  prefix,
  className,
  currencyClassName,
  digitsClassName,
}: PriceProps) {
  const { t } = useTranslation();
  const digits = (cents / 100).toFixed(2).replace(".", ",");

  return (
    <span className={cn("inline-flex items-baseline whitespace-nowrap font-sans", className)}>
      {from && <span className="mr-1">{t("from")}</span>}
      {prefix && <span className="mr-1">{prefix}</span>}
      <span className={cn("font-inter tabular-nums", digitsClassName)}>{digits}</span>
      <span className={cn("ml-1", currencyClassName)}>€</span>
    </span>
  );
}
