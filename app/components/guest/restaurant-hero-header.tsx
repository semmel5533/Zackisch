"use client";

import Image from "next/image";
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

export function RestaurantHeroHeader({
  business,
  type,
  tableNumber,
  showOrderingSubtitle = true,
  className = "",
}: RestaurantHeroHeaderProps) {
  const { t } = useTranslation();
  const orderingSubtitle =
    type === "takeaway"
      ? t("titleToGo")
      : tableNumber
        ? t("titleToStay", { table: tableNumber })
        : t("titleToStayNoTable");
  return (
    <header className={`guest-venue ${className}`}>
      {business.bannerUrl && (
        <div className="guest-venue-banner">
          <Image
            unoptimized
            src={business.bannerUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="guest-venue-banner-image"
            priority
          />
        </div>
      )}
      <div className="guest-venue-profile">
        {business.logoUrl && (
          <Image
            unoptimized
            src={business.logoUrl}
            alt=""
            width={72}
            height={72}
            className="guest-venue-logo"
          />
        )}
        <div className="guest-venue-identity">
          <h1>{business.name}</h1>
          {showOrderingSubtitle && (
            <p className="guest-venue-context">{orderingSubtitle}</p>
          )}
          {business.address && (
            <p className="guest-venue-address">{business.address}</p>
          )}
        </div>
        <LanguageSwitcher variant="secondary" size="md" />
      </div>
    </header>
  );
}
