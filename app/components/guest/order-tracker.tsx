"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@astryxdesign/core/Card";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CookingPot, X, Check, DownloadSimple } from "@phosphor-icons/react";
import { playOrderReadySound, initAudioContext } from "@/lib/audio";
import { downloadOrderConfirmation } from "@/lib/confirmation-generator";
import { RestaurantHeroHeader } from "@/components/guest/restaurant-hero-header";
import type { PublicRestaurant, Order } from "@/lib/types";

interface OrderTrackerProps {
  orderId: string;
  business: PublicRestaurant;
  initialOrder?: Order | null;
}

const statusSteps = [
  { id: "in_progress", labelKey: "inProgress" },
  { id: "ready_for_pickup", labelKey: "readyForPickup" },
  { id: "completed", labelKey: "completed" },
];

export function OrderTracker({
  orderId,
  business,
  initialOrder,
}: OrderTrackerProps) {
  const { t, locale } = useTranslation();

  const liveOrder = useQuery(api.orders.getOrder, {
    id: orderId as Id<"orders">,
  });

  const order: Order | null = liveOrder
    ? {
        ...liveOrder,
        $id: liveOrder._id,
        $createdAt: new Date(liveOrder._creationTime).toISOString(),
      }
    : initialOrder || null;

  const prevStatusRef = useRef<string | null>(initialOrder?.status || null);

  useEffect(() => {
    const handleInteract = () => initAudioContext();
    window.addEventListener("click", handleInteract, { once: true });
    return () => window.removeEventListener("click", handleInteract);
  }, []);

  useEffect(() => {
    if (
      order?.status === "ready_for_pickup" &&
      prevStatusRef.current &&
      prevStatusRef.current !== "ready_for_pickup"
    ) {
      playOrderReadySound();
    }
    if (order?.status) {
      prevStatusRef.current = order.status;
    }
  }, [order?.status]);

  const error = !order && liveOrder === null;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <Heading level={1}>{t("error")}</Heading>
        <Text type="supporting">{t("trackingExpired")}</Text>
        <Button
          label={t("orderAgain")}
          variant="primary"
          size="lg"
          onClick={() => (window.location.href = t("pickupUrl", { businessId: business.$id }))}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="h-64 w-full max-w-sm bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (order.status === "cancelled") {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-clip">
        <RestaurantHeroHeader
          className="max-w-[500px] mx-auto px-4 pt-6"
          business={business}
          type="takeaway"
          showOrderingSubtitle={false}
        />
        <main className="flex-1 px-4 py-6 max-w-[500px] mx-auto w-full flex flex-col items-center justify-center">
          <Card padding={6} variant="muted" width="100%">
            <div className="text-center space-y-4">
              <div className="mx-auto size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <X className="size-6" weight="bold" />
              </div>
              <Heading level={2}>{t("orderCancelledTitle")}</Heading>
              <Text type="supporting">{t("orderCancelledDesc")}</Text>
            </div>
          </Card>
        </main>
        <footer className="p-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
          <p className="text-xs text-muted-foreground">
            {t("processedViaZakkigPrefix")}
            <a
              href={t("homepageUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-foreground font-medium hover:opacity-80 transition-opacity"
            >
              zackisch.com
            </a>
            {t("processedViaZakkigSuffix")}
          </p>
        </footer>
      </div>
    );
  }

  const currentStepIndex =
    order.status === "completed"
      ? 2
      : order.status === "ready_for_pickup"
      ? 1
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-clip">
      <RestaurantHeroHeader
        className="max-w-[500px] mx-auto px-4 pt-6"
        business={business}
        type="takeaway"
        showOrderingSubtitle={false}
      />

      <main className="flex-1 px-4 py-6 max-w-[500px] mx-auto w-full flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <Text type="supporting" weight="medium">{t("yourOrderNumber")}</Text>
          <div className="text-7xl sm:text-8xl font-black tracking-wider text-foreground font-inter tabular-nums">
            {order.orderNumber}
          </div>
        </div>

        {order.status === "in_progress" && (
          <div className="w-full bg-muted/40 border border-border rounded-xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto">
              <CookingPot className="size-6" weight="bold" />
            </div>
            <Heading level={2}>{t("inProgress")}</Heading>
            <Text type="supporting">{t("inProgressDesc" as any)}</Text>
          </div>
        )}

        {order.status === "ready_for_pickup" && (
          <div className="w-full bg-muted/40 border border-border rounded-xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto">
              <Check className="size-6" weight="bold" />
            </div>
            <Heading level={2}>{t("orderReadyForPickup")}</Heading>
            <Text type="supporting">{t("orderReadyDesc")}</Text>
          </div>
        )}

        {order.status === "completed" && (
          <div className="w-full bg-muted/30 border border-border rounded-xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto">
              <Check className="size-6" weight="bold" />
            </div>
            <Heading level={2}>{t("orderPickedUp")}</Heading>
            <Text type="supporting">{t("orderPickedUpDesc")}</Text>
          </div>
        )}

        <Card padding={5} width="100%">
          <div className="space-y-6">
            <Heading level={3}>{t("orderStatus")}</Heading>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
              {statusSteps.map((step, index) => {
                const isDone = index < currentStepIndex || (order.status === "completed" && index === 2);
                const isCurrent = index === currentStepIndex && order.status !== "completed";

                return (
                  <div
                    key={step.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-inter tabular-nums transition-colors",
                        isDone
                          ? "border-foreground bg-foreground text-background"
                          : isCurrent
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground bg-background"
                      )}
                    >
                      {isDone ? (
                        <Check className="size-5" weight="bold" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border transition-colors",
                        isCurrent || (order.status === "completed" && index === 2)
                          ? "border-border bg-muted/40 font-bold"
                          : "bg-background"
                      )}
                    >
                      <span
                        className={cn(
                          "font-bold text-sm sm:text-base",
                          isCurrent || (order.status === "completed" && index === 2)
                            ? "text-foreground"
                            : isDone
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {t(step.labelKey as any)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Download Order & Payment Confirmation Action */}
        <div className="w-full flex flex-col items-center gap-2">
          <Button
            label={t("downloadConfirmation")}
            icon={<DownloadSimple className="size-4 shrink-0" weight="bold" />}
            variant="secondary"
            width="100%"
            size="lg"
            onClick={() => downloadOrderConfirmation(order, business, locale)}
          />
          <p className="text-[11px] leading-relaxed text-muted-foreground text-center px-2">
            {t("confirmationDisclaimerPrefix")}
            <a
              href={t("homepageUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              zackisch.com
            </a>
            {t("confirmationDisclaimerSuffix")}
          </p>
        </div>

        {order.status === "completed" && (
          <Button
            label={t("orderAgain")}
            variant="secondary"
            width="100%"
            size="lg"
            onClick={() =>
              (window.location.href = t("pickupUrl", { businessId: business.$id }))
            }
          />
        )}
      </main>

      <footer className="p-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
        <p className="text-xs text-muted-foreground">
          {t("processedViaZakkigPrefix")}
          <a
            href={t("homepageUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-foreground font-medium hover:opacity-80 transition-opacity"
          >
            zackisch.com
          </a>
          {t("processedViaZakkigSuffix")}
        </p>
      </footer>
    </div>
  );
}
