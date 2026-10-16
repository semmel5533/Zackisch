"use client";

import { getImagePreviewUrl } from "@/lib/convex/client";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WaveLine } from "@/components/ui/wave-line";
import { useTranslation } from "@/lib/i18n";
import type { Business } from "@/lib/types";

interface RestaurantHeroHeaderProps {
  business: Business;
  type?: "dine-in" | "takeaway";
  tableNumber?: string;
  showOrderingSubtitle?: boolean;
}

export function RestaurantHeroHeader({
  business,
  type,
  tableNumber,
  showOrderingSubtitle = true,
}: RestaurantHeroHeaderProps) {
  const { t } = useTranslation();

  const orderingSubtitle =
    type === "takeaway"
      ? t("titleToGo")
      : tableNumber
      ? t("titleToStay", { table: tableNumber })
      : t("titleToStayNoTable");

  return (
    <header className="bg-background text-foreground relative z-20 flex flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-6 pb-3 sm:pb-3.5 shrink-0 w-full max-w-[500px] mx-auto">
      <div className="w-full flex flex-col items-stretch">
        {/* Merchant banner and logo */}
        <div className="relative w-full aspect-[2.3/1] rounded-xl sm:rounded-2xl overflow-hidden bg-muted border border-border">
          {business.bannerFileId ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getImagePreviewUrl(business.bannerFileId)}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}

          {/* Bottom Row: Logo Box (Left), Language Switcher (Right) */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-end justify-between gap-2">
            {/* Left: Logo Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
              {business.logoFileId ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={getImagePreviewUrl(business.logoFileId)}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-background" />
              )}
            </div>

            {/* Right: Language Switcher */}
            <div className="shrink-0 flex items-center justify-end">
              <LanguageSwitcher
                variant="outline"
                className="size-11 bg-background text-foreground border border-border hover:bg-muted shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div id="header-text" className="w-full mt-3.5 flex flex-col">
          {showOrderingSubtitle && (
            <p className="text-sm sm:text-base font-semibold text-foreground leading-snug mb-1">
              {orderingSubtitle}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
            {business.name}
          </h1>
          {business.address && (
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 whitespace-pre-wrap">
              {business.address}
            </p>
          )}
        </div>

        {/* Wavy divider line in zakkig QR style */}
        <WaveLine className="w-full mt-4 text-black" strokeWidth={2.25} />
      </div>
    </header>
  );
}
