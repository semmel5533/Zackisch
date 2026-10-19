"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import type { PublicRestaurant } from "@/lib/types";

interface RestaurantHeroHeaderProps {
  business: PublicRestaurant;
  className?: string;
  type?: "dine-in" | "takeaway";
  tableNumber?: string;
  showOrderingSubtitle?: boolean;
}

export function RestaurantHeroHeader({ business, type, tableNumber, showOrderingSubtitle = true, className = "" }: RestaurantHeroHeaderProps) {
  const { t } = useTranslation();
  const orderingSubtitle = type === "takeaway"
    ? t("titleToGo")
    : tableNumber ? t("titleToStay", { table: tableNumber }) : t("titleToStayNoTable");

  return (
    <header className={`w-full text-foreground ${className}`}>
      <div className="flex items-start justify-between gap-4 pb-6">
        <div className="flex min-w-0 items-start gap-4">
          {business.logoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={business.logoUrl} alt="" width={64} height={64} className="size-16 shrink-0 rounded-lg object-contain" />
          )}
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{business.name}</h1>
            {showOrderingSubtitle && <p className="mt-2 text-sm text-muted-foreground">{orderingSubtitle}</p>}
            {business.address && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{business.address}</p>}
          </div>
        </div>
        <LanguageSwitcher variant="outline" className="size-11 shrink-0 rounded-lg" />
      </div>
      {business.bannerUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={business.bannerUrl} alt="" width={1200} height={600} fetchPriority="high" className="aspect-[2/1] w-full rounded-lg object-cover" />
      )}
    </header>
  );
}
