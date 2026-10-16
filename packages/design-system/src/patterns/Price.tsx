import React from "react";
import { cn } from "../utils/cn";

export interface PriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  cents: number;
  currency?: string;
  locale?: string;
  showZeroAsFree?: boolean;
}

export function formatPrice(
  cents: number,
  currency = "EUR",
  locale = "de-DE"
): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function Price({
  cents,
  currency = "EUR",
  locale = "de-DE",
  showZeroAsFree = false,
  className,
  ...props
}: PriceProps) {
  if (showZeroAsFree && cents === 0) {
    return (
      <span className={cn("font-semibold text-[#12744B]", className)} {...props}>
        {locale.startsWith("de") ? "Kostenlos" : "Free"}
      </span>
    );
  }

  const formatted = formatPrice(cents, currency, locale);

  return (
    <span
      className={cn("font-numeric font-semibold text-[#161616] tabular-nums", className)}
      {...props}
    >
      {formatted}
    </span>
  );
}
