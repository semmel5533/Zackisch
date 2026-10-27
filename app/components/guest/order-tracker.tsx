"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4 bg-[var(--zk-page)] text-[var(--zk-text)]">
        <h1 className="text-2xl font-bold tracking-tight">{t("error")}</h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">{t("trackingExpired")}</p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => (window.location.href = t("pickupUrl", { businessId: business.$id }))}
        >
          {t("orderAgain")}
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[var(--zk-page)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-[var(--zk-surface-muted)] rounded"></div>
          <div className="h-64 w-full max-w-sm bg-[var(--zk-surface-muted)] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (order.status === "cancelled") {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--zk-page)] text-[var(--zk-text)] overflow-x-clip">
        <RestaurantHeroHeader
          className="max-w-[500px] mx-auto px-4 pt-6"
          business={business}
          type="takeaway"
          showOrderingSubtitle={false}
        />
        <main className="flex-1 px-4 py-6 max-w-[500px] mx-auto w-full flex flex-col items-center justify-center">
          <section className="w-full rounded-2xl border border-[var(--zk-border)] bg-[var(--zk-surface)] p-6 shadow-xs">
            <div className="text-center space-y-4">
              <div className="mx-auto size-12 rounded-full bg-[var(--zk-error-bg)] flex items-center justify-center text-[var(--zk-error-text)]">
                <X className="size-6" weight="bold" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--zk-text)]">{t("orderCancelledTitle")}</h2>
              <p className="text-sm text-[var(--zk-text-secondary)] leading-relaxed">{t("orderCancelledDesc")}</p>
            </div>
          </section>
        </main>
        <footer className="p-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
          <p className="text-xs text-[var(--zk-text-secondary)]">
            {t("processedViaZakkigPrefix")}
            <a
              href={t("homepageUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-[var(--zk-text)] font-medium hover:opacity-80 transition-opacity"
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
    <div className="flex flex-col min-h-screen bg-[var(--zk-page)] text-[var(--zk-text)] overflow-x-clip">
      <RestaurantHeroHeader
        className="max-w-[500px] mx-auto px-4 pt-6"
        business={business}
        type="takeaway"
        showOrderingSubtitle={false}
      />

      <main className="flex-1 px-4 py-6 max-w-[500px] mx-auto w-full flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-[var(--zk-text-secondary)]">{t("yourOrderNumber")}</p>
          <div className="text-7xl sm:text-8xl font-black tracking-wider text-[var(--zk-text)] font-inter tabular-nums">
            {order.orderNumber}
          </div>
        </div>

        {order.status === "in_progress" && (
          <div className="w-full bg-[var(--zk-surface-muted)] border border-[var(--zk-border)] rounded-2xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-[var(--zk-text)] text-[var(--zk-white)] flex items-center justify-center mx-auto">
              <CookingPot className="size-6" weight="bold" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--zk-text)]">{t("inProgress")}</h2>
            <p className="text-sm text-[var(--zk-text-secondary)] leading-relaxed">{t("inProgressDesc" as any)}</p>
          </div>
        )}

        {order.status === "ready_for_pickup" && (
          <div className="w-full bg-[var(--zk-success-bg)] border border-[var(--zk-success-text)]/25 rounded-2xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-[var(--zk-success-text)] text-[var(--zk-white)] flex items-center justify-center mx-auto">
              <Check className="size-6" weight="bold" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--zk-text)]">{t("orderReadyForPickup")}</h2>
            <p className="text-sm text-[var(--zk-text-body)] leading-relaxed">{t("orderReadyDesc")}</p>
          </div>
        )}

        {order.status === "completed" && (
          <div className="w-full bg-[var(--zk-surface-muted)] border border-[var(--zk-border)] rounded-2xl p-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-[var(--zk-text)] text-[var(--zk-white)] flex items-center justify-center mx-auto">
              <Check className="size-6" weight="bold" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--zk-text)]">{t("orderPickedUp")}</h2>
            <p className="text-sm text-[var(--zk-text-secondary)] leading-relaxed">{t("orderPickedUpDesc")}</p>
          </div>
        )}

        <section className="w-full rounded-2xl border border-[var(--zk-border)] bg-[var(--zk-surface)] p-5 shadow-xs">
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-tight text-[var(--zk-text)]">{t("orderStatus")}</h3>

            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isDone = index < currentStepIndex || (order.status === "completed" && index === 2);
                const isCurrent = index === currentStepIndex && order.status !== "completed";

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-10 rounded-full border-2 shrink-0 font-inter tabular-nums transition-colors",
                        isDone || isCurrent
                          ? "border-[var(--zk-text)] bg-[var(--zk-text)] text-[var(--zk-white)]"
                          : "border-[var(--zk-border-strong)] text-[var(--zk-text-secondary)] bg-[var(--zk-surface)]"
                      )}
                    >
                      {isDone ? (
                        <Check className="size-5" weight="bold" aria-hidden="true" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex-1 p-4 rounded-xl border transition-colors",
                        isCurrent || (order.status === "completed" && index === 2)
                          ? "border-[var(--zk-border-strong)] bg-[var(--zk-surface-muted)] font-bold"
                          : "border-[var(--zk-border)] bg-[var(--zk-surface)]"
                      )}
                    >
                      <span
                        className={cn(
                          "font-bold text-sm sm:text-base",
                          isCurrent || isDone || (order.status === "completed" && index === 2)
                            ? "text-[var(--zk-text)]"
                            : "text-[var(--zk-text-secondary)]"
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
        </section>

        {/* Download Order & Payment Confirmation Action */}
        <div className="w-full flex flex-col items-center gap-2">
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={() => downloadOrderConfirmation(order, business, locale)}
          >
            <DownloadSimple className="size-4 shrink-0" weight="bold" aria-hidden="true" />
            <span>{t("downloadConfirmation")}</span>
          </Button>
          <p className="text-[11px] leading-relaxed text-[var(--zk-text-secondary)] text-center px-2">
            {t("confirmationDisclaimerPrefix")}
            <a
              href={t("homepageUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--zk-text)] font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              zackisch.com
            </a>
            {t("confirmationDisclaimerSuffix")}
          </p>
        </div>

        {order.status === "completed" && (
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={() =>
              (window.location.href = t("pickupUrl", { businessId: business.$id }))
            }
          >
            {t("orderAgain")}
          </Button>
        )}
      </main>

      <footer className="p-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
        <p className="text-xs text-[var(--zk-text-secondary)]">
          {t("processedViaZakkigPrefix")}
          <a
            href={t("homepageUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-[var(--zk-text)] font-medium hover:opacity-80 transition-opacity"
          >
            zackisch.com
          </a>
          {t("processedViaZakkigSuffix")}
        </p>
      </footer>
    </div>
  );
}
