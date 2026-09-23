"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle, CookingPot, X, Clock, Check } from "@phosphor-icons/react";
import { playOrderReadySound, initAudioContext } from "@/lib/audio";
import { TRACKING_EXPIRY_MS } from "@/lib/constants";
import type { Organization, Order } from "@/lib/types";

interface OrderTrackerProps {
  orderId: string;
  organization: Organization;
  initialOrder?: Order | null;
}

const statusSteps = [
  { id: "in_progress", labelKey: "inProgress" },
  { id: "ready_for_pickup", labelKey: "readyForPickup" },
  { id: "completed", labelKey: "completed" },
];

export function OrderTracker({
  orderId,
  organization,
  initialOrder,
}: OrderTrackerProps) {
  const { t } = useTranslation();

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
  const [now, setNow] = useState(Date.now());

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

  useEffect(() => {
    if (order?.status === "ready_for_pickup" || order?.status === "completed") {
      const interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  const readyTime =
    order?.readyAt ||
    order?.completedAt ||
    (order?.$updatedAt ? new Date(order.$updatedAt).getTime() : 0) ||
    order?._creationTime ||
    (order?.$createdAt ? new Date(order.$createdAt).getTime() : Date.now());

  const remainingMs = Math.max(0, TRACKING_EXPIRY_MS - (now - readyTime));
  const isExpired = (order?.status === "ready_for_pickup" || order?.status === "completed") && remainingMs <= 0;

  const error = (!order && liveOrder === null) || isExpired;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-xl font-bold mb-2">{t("error")}</h1>
        <p className="text-muted-foreground mb-6">{t("trackingExpired")}</p>
        <Button
          variant="outline"
          className="font-semibold"
          onClick={() => (window.location.href = t("pickupUrl", { organizationId: organization.$id }))}
        >
          {t("orderAgain" as any)}
        </Button>
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
      <div className="flex flex-col min-h-screen bg-muted/10 items-center justify-center p-6">
        <Card className="max-w-[500px] w-full p-6 text-center space-y-4 border-destructive/20 bg-destructive/5">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <X className="w-6 h-6" weight="bold" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("orderCancelledTitle")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("orderCancelledDesc")}
          </p>
        </Card>
      </div>
    );
  }

  const currentStepIndex =
    order.status === "completed"
      ? 2
      : order.status === "ready_for_pickup"
      ? 1
      : 0;
  const remainingTotalSeconds = Math.ceil(remainingMs / 1000);
  const remainingMins = Math.floor(remainingTotalSeconds / 60);
  const remainingSecs = remainingTotalSeconds % 60;
  const remainingParts = t("trackingActiveRemaining", { time: "%%" }).split("%%");
  const minuteParts = t("trackingMinutes", { count: "%%" }).split("%%");

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 overflow-x-clip">
      <header className="bg-background text-foreground border-b border-border px-6 py-4 flex items-center justify-between shrink-0 max-w-[500px] mx-auto w-full">
        <div className="w-10" />
        <h1 className="text-lg font-bold flex-1 text-center">
          {organization.name}
        </h1>
        <LanguageSwitcher
          className="w-11 h-11 p-0 flex items-center justify-center text-foreground hover:text-foreground hover:bg-muted rounded-full shrink-0"
          variant="ghost"
        />
      </header>

      {/* Main Content Card */}
      <div className="flex-1 bg-background text-foreground overflow-hidden flex flex-col max-w-[500px] mx-auto w-full md:my-4 md:rounded-[24px] md:border border-border">
        <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t("yourOrderNumber")}</p>
            <div className="text-6xl font-black tracking-wider text-primary font-inter tabular-nums">
              {order.orderNumber}
            </div>
          </div>

          {order.status === "in_progress" && (
            <div className="w-full bg-muted/40 border border-border rounded-xl p-5 text-center space-y-2 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <CookingPot className="w-5 h-5" weight="bold" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                {t("inProgress")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("inProgressDesc" as any)}
              </p>
            </div>
          )}

          {order.status === "ready_for_pickup" && (
            <div className="w-full bg-muted/40 border border-border rounded-xl p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
              <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" weight="fill" />
              </div>
              <h2 className="text-xl font-bold text-primary">
                {t("orderReadyForPickup")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("orderReadyDesc")}
              </p>
            </div>
          )}

          {order.status === "completed" && (
              <div className="w-full bg-muted/30 border border-border rounded-xl p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" weight="fill" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {t("orderPickedUp")}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("orderPickedUpDesc")}
                </p>
              </div>
          )}

          {(order.status === "ready_for_pickup" || order.status === "completed") && (
            <p className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground text-center">
              <Clock className="size-4 shrink-0" />
              <span>{remainingParts[0]}</span>
              <span>
                {minuteParts[0]}
                <span className="font-inter tabular-nums font-bold text-foreground">
                  {remainingMins}:{remainingSecs.toString().padStart(2, "0")}
                </span>
                {minuteParts[1]}
              </span>
              <span>{remainingParts[1]}</span>
            </p>
          )}

          <Card className="w-full p-5 sm:p-6">
            <div>
              <h2 className="font-semibold text-lg mb-6">{t("orderStatus")}</h2>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                {statusSteps.map((step, index) => {
                  const isDone = index < currentStepIndex || (order.status === "completed" && index === 2);
                  const isCurrent = index === currentStepIndex && order.status !== "completed";

                  return (
                    <div
                      key={step.id}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-inter tabular-nums transition-colors",
                          isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted text-muted-foreground bg-background",
                        )}
                      >
                        {isDone ? (
                          <Check className="w-5 h-5" weight="bold" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-colors",
                          isCurrent || (order.status === "completed" && index === 2)
                            ? "border-primary/50 bg-primary/5"
                            : "bg-background",
                        )}
                      >
                        <h3
                          className={cn(
                            "font-bold text-sm sm:text-base",
                            isCurrent || (order.status === "completed" && index === 2)
                              ? "text-primary"
                              : isDone
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {t(step.labelKey as any)}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {order.status === "completed" && (
            <Button
              variant="outline"
              className="w-full h-11 rounded-full text-base font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
              onClick={() =>
                (window.location.href = t("pickupUrl", { organizationId: organization.$id }))
              }
            >
              {t("orderAgain" as any)}
            </Button>
          )}
        </main>
      </div>

      <footer className="p-4 pb-6 text-center max-w-[500px] mx-auto w-full shrink-0">
        <p className="text-xs text-muted-foreground">
          {t("processedViaZakkigPrefix")}
          <a
            href={t("homepageUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-foreground font-medium hover:opacity-80 transition-opacity"
          >
            zakkig.com
          </a>
          {t("processedViaZakkigSuffix")}
        </p>
      </footer>
    </div>
  );
}
