"use client";

import React from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { getImagePreviewUrl } from "@/lib/convex/client";
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

  const logoSrc =
    business.logoUrl ||
    ((business as any).logoFileId ? getImagePreviewUrl((business as any).logoFileId) : null) ||
    "/brand_mark_512.png";
  const bannerSrc =
    business.bannerUrl ||
    ((business as any).bannerFileId ? getImagePreviewUrl((business as any).bannerFileId) : null) ||
    "/restaurant.webp";

  return (
    <header className={`w-full text-foreground ${className}`}>
      <VStack gap={4} width="100%">
        {/* Banner at top if present */}
        {bannerSrc && (
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[3/1] bg-muted border border-border/40 shadow-sm shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerSrc}
              alt={business.name}
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </div>
        )}

        {/* Restaurant Profile Row */}
        <HStack justify="between" vAlign="start" gap={4} width="100%">
          <HStack gap={4} vAlign="start">
            {logoSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoSrc}
                alt=""
                width={72}
                height={72}
                className="size-16 sm:size-20 shrink-0 rounded-2xl border border-border bg-background p-1 object-contain shadow-xs"
              />
            )}
            <VStack gap={1}>
              <Heading level={2}>{business.name}</Heading>
              {showOrderingSubtitle && (
                <HStack gap={2} vAlign="center">
                  <Badge
                    label={orderingSubtitle}
                    variant={type === "takeaway" ? "neutral" : "info"}
                  />
                </HStack>
              )}
              {business.address && (
                <Text type="supporting" size="sm">
                  {business.address}
                </Text>
              )}
            </VStack>
          </HStack>

          <LanguageSwitcher variant="secondary" size="lg" />
        </HStack>
      </VStack>
    </header>
  );
}
