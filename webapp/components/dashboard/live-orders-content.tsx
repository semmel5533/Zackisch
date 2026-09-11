"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Check,
  ReceiptX,
  SpeakerHigh,
  SpeakerSlash,
  Clock,
  ArrowCounterClockwise,
  ArrowLeft,
  ClipboardText,
  Info,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/ui/price";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { updateOrderStatusAction } from "@/actions/order-actions";
import { playNewOrderSound, initAudioContext } from "@/lib/audio";
import {
  KITCHEN_CLEANUP_MINUTES,
  KITCHEN_CLEANUP_TIMEOUT,
} from "@/lib/constants";
import type { Order, OrderItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LiveOrdersContentProps {
  orders: Order[];
  organizationId: string;
  isStaffView?: boolean;
}

function parseItems(itemsJson: string): OrderItem[] {
  try {
    return JSON.parse(itemsJson);
  } catch {
    return [];
  }
}

// Compact time badge for single-line mini cards (e.g. "Jetzt", "4m", "18:42")
function formatMiniOrderTime(order: Order, _now?: number): string {
  const timeMs =
    order.createdAt ||
    order._creationTime ||
    (order.$createdAt ? new Date(order.$createdAt).getTime() : 0);
  if (!timeMs) return "";
  return new Date(timeMs).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Detailed time label for header in detail explorer pane
function formatDetailOrderTime(order: Order, _now?: number): string {
  const timeMs =
    order.createdAt ||
    order._creationTime ||
    (order.$createdAt ? new Date(order.$createdAt).getTime() : 0);
  if (!timeMs) return "";
  const timeStr = new Date(timeMs).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${timeStr} Uhr`;
}

function getRemainingArchiveMins(order: Order, now: number): number {
  const completedTime =
    order.completedAt ||
    (order.$updatedAt ? new Date(order.$updatedAt).getTime() : 0) ||
    order._creationTime ||
    (order.$createdAt ? new Date(order.$createdAt).getTime() : now);
  const elapsedMs = Math.max(0, now - completedTime);
  const remainingMs = Math.max(0, KITCHEN_CLEANUP_TIMEOUT - elapsedMs);
  return Math.min(
    KITCHEN_CLEANUP_MINUTES,
    Math.max(1, Math.ceil(remainingMs / (60 * 1000))),
  );
}

export function LiveOrdersContent({
  orders,
  organizationId,
  isStaffView,
}: LiveOrdersContentProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [now, setNow] = useState<number>(Date.now());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"in_progress" | "completed">("in_progress");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [inProgressTooltipOpen, setInProgressTooltipOpen] = useState(false);
  const [completedTooltipOpen, setCompletedTooltipOpen] = useState(false);

  // Reactive Convex queries
  const liveOrders = useQuery(api.orders.getLiveOrders, {
    organizationId: organizationId as Id<"organizations">,
  });
  const org = useQuery(api.organizations.get, {
    id: organizationId as Id<"organizations">,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.location.search.includes("token=")) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      window.history.replaceState(
        {},
        "",
        cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""),
      );
    }
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const isInitialRef = useRef(true);
  const knownOrderIdsRef = useRef<Set<string>>(
    new Set(orders.map((o) => o.$id || (o as any)._id)),
  );

  useEffect(() => {
    const saved = localStorage.getItem("zakkig_kitchen_sound");
    if (saved !== null) {
      setSoundEnabled(saved === "1");
    }
    const handleFirstClick = () => initAudioContext();
    window.addEventListener("click", handleFirstClick, { once: true });
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    if (liveOrders) {
      const normalized = liveOrders.map((o: any) => ({
        ...o,
        $id: o._id,
        $createdAt: new Date(o._creationTime).toISOString(),
      }));

      // Detect incoming active orders
      if (!isInitialRef.current) {
        const newOrders = liveOrders.filter(
          (o: any) =>
            o.status === "in_progress" && !knownOrderIdsRef.current.has(o._id),
        );

        if (newOrders.length > 0) {
          if (soundEnabled) {
            playNewOrderSound();
          }
          newOrders.forEach((o: any) => {
            toast.info(`${t("newOrderReceived" as any)} #${o.orderNumber}`);
          });
        }
      }

      liveOrders.forEach((o: any) => {
        knownOrderIdsRef.current.add(o._id);
      });
      isInitialRef.current = false;
      setLocalOrders(normalized);
    }
  }, [liveOrders, soundEnabled, t]);

  useEffect(() => {
    if (org === null) {
      toast.error(t("orgDeletedToast" as any));
      router.push("/");
    }
  }, [org, router, t]);

  // Split orders into in_progress and recently completed
  // Oldest active order stands at the top (FIFO kitchen order)
  const inProgressOrders = useMemo(
    () =>
      localOrders
        .filter((o) => o.status !== "completed" && o.status !== "cancelled")
        .sort((a, b) => {
          const timeA =
            a.createdAt ||
            a._creationTime ||
            (a.$createdAt ? new Date(a.$createdAt).getTime() : 0);
          const timeB =
            b.createdAt ||
            b._creationTime ||
            (b.$createdAt ? new Date(b.$createdAt).getTime() : 0);
          return timeA - timeB; // ascending: oldest active order first
        }),
    [localOrders],
  );

  // Oldest completed order (expiring/archiving soonest) stands at the top
  const completedOrders = useMemo(
    () =>
      localOrders
        .filter((o) => {
          if (o.status !== "completed") return false;
          const timestamp = o.completedAt
            ? o.completedAt
            : o.$updatedAt
            ? new Date(o.$updatedAt).getTime()
            : new Date(o.$createdAt || o._creationTime || Date.now()).getTime();
          return now - timestamp < KITCHEN_CLEANUP_TIMEOUT;
        })
        .sort((a, b) => {
          const timeA =
            a.completedAt ||
            (a.$updatedAt ? new Date(a.$updatedAt).getTime() : a.createdAt || a._creationTime || 0);
          const timeB =
            b.completedAt ||
            (b.$updatedAt ? new Date(b.$updatedAt).getTime() : b.createdAt || b._creationTime || 0);
          return timeA - timeB; // ascending: oldest completed (expiring next) first
        }),
    [localOrders, now],
  );

  // Auto-selection of active order
  useEffect(() => {
    if (localOrders.length === 0) {
      setSelectedOrderId(null);
      return;
    }
    const currentStillExists = localOrders.some((o) => o.$id === selectedOrderId);
    if (!selectedOrderId || !currentStillExists) {
      const firstActive = inProgressOrders[0]?.$id;
      const firstCompleted = completedOrders[0]?.$id;
      setSelectedOrderId(firstActive || firstCompleted || null);
    }
  }, [localOrders, selectedOrderId, inProgressOrders, completedOrders]);

  if (!mounted) {
    return null;
  }

  const selectedOrder = localOrders.find((o) => o.$id === selectedOrderId) || null;
  const targetOrderToCancel = localOrders.find((o) => o.$id === orderToCancel);

  async function handleStatusChange(
    orderId: string,
    newStatus: "in_progress" | "completed" | "cancelled",
  ) {
    const timestamp = Date.now();
    setNow(timestamp);

    // If completing the currently selected order, pick the next in-progress order
    if (newStatus === "completed" && selectedOrderId === orderId) {
      const nextInProgress = inProgressOrders.find((o) => o.$id !== orderId);
      if (nextInProgress) {
        setSelectedOrderId(nextInProgress.$id);
      }
    }

    // Optimistic UI update
    setLocalOrders((prev) =>
      prev.map((o) =>
        o.$id === orderId
          ? {
              ...o,
              status: newStatus as any,
              completedAt: newStatus === "completed" ? timestamp : o.completedAt,
              $updatedAt: new Date(timestamp).toISOString(),
            }
          : o,
      ),
    );

    await updateOrderStatusAction(orderId, newStatus, organizationId);
  }

  const renderMiniCard = (order: Order, isCompleted: boolean) => {
    const isSelected = selectedOrderId === order.$id;
    const timeLabel = formatMiniOrderTime(order, now);
    const remainingMins = getRemainingArchiveMins(order, now);

    return (
      <button
        key={order.$id}
        type="button"
        onClick={() => {
          setSelectedOrderId(order.$id);
          setMobileView("detail");
        }}
        className={cn(
          "w-full h-10 sm:h-11 text-left rounded-lg transition-colors relative flex items-center justify-between gap-1 sm:gap-1.5 select-none bg-card text-foreground border border-border/60 hover:bg-muted/50 hover:border-border px-2 sm:px-2.5",
          isSelected &&
            "desktop:bg-primary desktop:text-primary-foreground desktop:border-2 desktop:border-primary desktop:shadow-xs desktop:px-[9px] desktop:hover:bg-primary desktop:hover:border-primary",
        )}
      >
        {/* Left: Number and Type */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
          <span
            className={cn(
              "font-black tracking-tight font-inter tabular-nums text-xs sm:text-sm shrink-0 text-foreground",
              isSelected && "desktop:text-primary-foreground",
            )}
          >
            {order.orderNumber}
          </span>
          <span
            className={cn(
              "text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1 border bg-muted text-foreground/80 border-transparent",
              isSelected && "desktop:bg-white/15 desktop:text-white desktop:border-white/20",
            )}
          >
            {order.type === "dine-in" || order.tableNumber ? (
              <>
                <span>{t("table")}</span>
                <span className="font-inter tabular-nums">
                  {order.tableNumber || ""}
                </span>
              </>
            ) : (
              t("pickup")
            )}
          </span>
        </div>

        {/* Right: Time badge */}
        <div className="shrink-0 flex items-center pl-1">
          {isCompleted ? (
            <span
              className={cn(
                "text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 border bg-muted text-foreground/80 border-transparent",
                isSelected && "desktop:bg-white/15 desktop:text-white desktop:border-white/20",
              )}
            >
              <Clock
                className={cn(
                  "w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-foreground/80",
                  isSelected && "desktop:text-white",
                )}
                weight="bold"
              />
              <span>
                <span className="font-inter tabular-nums">{remainingMins}</span>{" "}
                <span>{locale === "de" ? "Min." : "min."}</span>
              </span>
            </span>
          ) : (
            <span
              className={cn(
                "text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 border bg-muted text-foreground/80 border-transparent",
                isSelected && "desktop:bg-white/15 desktop:text-white desktop:border-white/20",
              )}
            >
              <Clock
                className={cn(
                  "w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-foreground/80",
                  isSelected && "desktop:text-white",
                )}
                weight="bold"
              />
              <span className="font-inter tabular-nums">{timeLabel}</span>
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col gap-3 sm:gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("orders")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="default"
            onClick={() => {
              initAudioContext();
              const next = !soundEnabled;
              setSoundEnabled(next);
              localStorage.setItem("zakkig_kitchen_sound", next ? "1" : "0");
              if (next) playNewOrderSound();
            }}
            className="h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-4 gap-1.5 sm:gap-2 rounded-full cursor-pointer active:scale-[0.98] transition-all font-semibold shadow-xs"
          >
            {soundEnabled ? (
              <>
                <SpeakerHigh className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" weight="fill" />
                <span>{t("soundOn")}</span>
              </>
            ) : (
              <>
                <SpeakerSlash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground/70" />
                <span>{t("soundOff")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col desktop:flex-row gap-3 sm:gap-4 overflow-hidden">
        {/* Left Side: Master Queue Panel (Strict fixed 540px width on desktop, full width on mobile/tablet) */}
        <div
          className={cn(
            "flex flex-col min-h-0 h-full desktop:w-[540px] desktop:min-w-[540px] desktop:max-w-[540px] shrink-0",
            mobileView === "detail" ? "hidden desktop:flex" : "flex",
          )}
        >
          {/* Mobile Status Tabs (< 500px) */}
          <div className="flex tablet:hidden gap-2 pb-2 shrink-0">
            <Button
              variant={mobileTab === "in_progress" ? "default" : "outline"}
              size="default"
              onClick={() => setMobileTab("in_progress")}
              className="flex-1 font-semibold gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3"
            >
              <span>{t("inProgress")}</span>
              <span
                className={cn(
                  "h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-inter tabular-nums leading-none",
                  inProgressOrders.length > 9
                    ? "px-1 sm:px-1.5"
                    : "aspect-square p-0",
                  mobileTab === "in_progress"
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {inProgressOrders.length}
              </span>
            </Button>
            <Button
              variant={mobileTab === "completed" ? "default" : "outline"}
              size="default"
              onClick={() => setMobileTab("completed")}
              className="flex-1 font-semibold gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3"
            >
              <span>{t("completed")}</span>
              <span
                className={cn(
                  "h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-inter tabular-nums leading-none",
                  completedOrders.length > 9
                    ? "px-1 sm:px-1.5"
                    : "aspect-square p-0",
                  mobileTab === "completed"
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {completedOrders.length}
              </span>
            </Button>
          </div>

          {/* Dual Compact Columns Side-by-Side (side-by-side on >= 500px, tabbed on < 500px) */}
          <TooltipProvider delay={100}>
            <div className="flex-1 min-h-0 grid grid-cols-1 tablet:grid-cols-2 gap-3 h-full w-full">
              {/* Column 1: In Bearbeitung */}
              <div
                className={cn(
                  "w-full flex flex-col min-h-0 h-full rounded-lg sm:rounded-xl border border-border bg-card/60 overflow-hidden shrink-0",
                  mobileTab !== "in_progress" && "hidden tablet:flex",
                )}
              >
                {/* Header: Edge-to-Edge Divider */}
                <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {t("inProgress")}
                    </span>
                    <Tooltip
                      open={inProgressTooltipOpen}
                      onOpenChange={setInProgressTooltipOpen}
                    >
                      <TooltipTrigger
                        type="button"
                        onClick={() => setInProgressTooltipOpen((v) => !v)}
                        className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0 cursor-pointer"
                        aria-label={t("info")}
                      >
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-[240px] p-2.5 text-xs">
                        <p className="font-medium leading-relaxed">
                          {t("inProgressSubline")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge
                    className={cn(
                      "h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold font-inter tabular-nums shrink-0 p-0 flex items-center justify-center leading-none",
                      inProgressOrders.length > 9
                        ? "px-1"
                        : "aspect-square",
                    )}
                  >
                    {inProgressOrders.length}
                  </Badge>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 space-y-2">
                  {inProgressOrders.length === 0 ? (
                    <div className="py-3.5 px-3 text-center text-xs text-muted-foreground font-medium border border-dashed border-border/80 rounded-lg">
                      {t("noInProgressOrders")}
                    </div>
                  ) : (
                    inProgressOrders.map((order) => renderMiniCard(order, false))
                  )}
                </div>
              </div>

              {/* Column 2: Abgeschlossen */}
              <div
                className={cn(
                  "w-full flex flex-col min-h-0 h-full rounded-lg sm:rounded-xl border border-border bg-card/60 overflow-hidden shrink-0",
                  mobileTab !== "completed" && "hidden tablet:flex",
                )}
              >
                {/* Header: Edge-to-Edge Divider */}
                <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {t("completed")}
                    </span>
                    <Tooltip
                      open={completedTooltipOpen}
                      onOpenChange={setCompletedTooltipOpen}
                    >
                      <TooltipTrigger
                        type="button"
                        onClick={() => setCompletedTooltipOpen((v) => !v)}
                        className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0 cursor-pointer"
                        aria-label={t("info")}
                      >
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-[240px] p-2.5 text-xs">
                        <p className="font-medium leading-relaxed">
                          {t("completedSubline")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge
                    className={cn(
                      "h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold font-inter tabular-nums shrink-0 p-0 flex items-center justify-center leading-none",
                      completedOrders.length > 9
                        ? "px-1"
                        : "aspect-square",
                    )}
                  >
                    {completedOrders.length}
                  </Badge>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 space-y-2">
                  {completedOrders.length === 0 ? (
                    <div className="py-3.5 px-3 text-center text-xs text-muted-foreground font-medium border border-dashed border-border/80 rounded-lg">
                      {t("noCompletedRecentOrders")}
                    </div>
                  ) : (
                    completedOrders.map((order) => renderMiniCard(order, true))
                  )}
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Right Side: Selected Order Details (Docked on desktop, full screen overlay on mobile) */}
        <div
          className={cn(
            "flex-1 min-w-0 min-h-0 h-full flex flex-col shrink-0",
            mobileView === "list" ? "hidden desktop:flex" : "flex",
          )}
        >
          {/* Mobile/Tablet Back Button (< 1110px) */}
          <div className="desktop:hidden pb-2 shrink-0">
            <Button
              variant="outline"
              size="default"
              onClick={() => setMobileView("list")}
              className="gap-1.5 sm:gap-2 font-semibold h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" weight="bold" />
              <span>{t("backToList")}</span>
            </Button>
          </div>

          <div className="flex-1 min-w-0 min-h-0 h-full flex flex-col rounded-lg sm:rounded-xl border border-border bg-card overflow-hidden shadow-xs shrink-0">
            {selectedOrder ? (
              <div className="flex-1 min-h-0 flex flex-col h-full">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-border bg-muted/20 shrink-0">
                  <div className="flex items-center justify-between gap-2 sm:gap-2.5 flex-wrap">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap">
                      <h2 className="text-lg sm:text-xl desktop:text-2xl font-black text-foreground tracking-tight font-inter tabular-nums shrink-0">
                        {selectedOrder.orderNumber}
                      </h2>
                      <span className="text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground border border-transparent shrink-0">
                        {selectedOrder.status === "completed"
                          ? t("completed")
                          : t("inProgress")}
                      </span>
                      <span className="text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/40 shrink-0 inline-flex items-center gap-1">
                        {selectedOrder.type === "dine-in" || selectedOrder.tableNumber ? (
                          <>
                            <span>{t("toTable")}</span>
                            <span className="font-inter tabular-nums">
                              {selectedOrder.tableNumber || ""}
                            </span>
                          </>
                        ) : (
                          t("toPickUp")
                        )}
                      </span>
                    </div>

                    {/* Timestamp Badge */}
                    <div className="shrink-0 flex items-center ml-auto">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/40 shrink-0">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80" weight="bold" />
                        <span>
                          {selectedOrder.status === "completed" ? (
                            <>
                              <span className="font-inter tabular-nums">
                                {getRemainingArchiveMins(selectedOrder, now)}
                              </span>{" "}
                              <span>{locale === "de" ? "Min." : "min."}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-inter tabular-nums">
                                {formatMiniOrderTime(selectedOrder, now)}
                              </span>{" "}
                              <span>{locale === "de" ? "Uhr" : ""}</span>
                            </>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List (Scrollable) */}
                <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  {parseItems(selectedOrder.items).map((item: any, idx: number) => {
                    const itemKey = `${item.cartItemId || item.id || item.menuItemId || item.name}-${idx}`;
                    return (
                      <div
                        key={itemKey}
                        className="flex flex-col pb-3 border-b border-border/40 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start gap-2.5 sm:gap-3">
                          <div className="flex items-baseline gap-2 sm:gap-2.5 min-w-0">
                            <span className="text-sm sm:text-base font-bold text-primary shrink-0">
                              <span className="font-inter tabular-nums">{item.quantity}</span>×
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-foreground leading-snug break-words">
                              {item.name}
                            </span>
                          </div>
                          <Price
                            cents={item.price * item.quantity}
                            className="text-xs sm:text-sm font-semibold text-foreground shrink-0 ml-2"
                          />
                        </div>

                        {/* Customizations / Toppings - size preserved per user instruction */}
                        {Array.isArray(item.customizations) &&
                          item.customizations.length > 0 && (
                            <div className="pl-5 sm:pl-7 pt-1 sm:pt-1.5 flex flex-col items-start gap-1 sm:gap-1.5">
                              {item.customizations.map((c: any, cIdx: number) => {
                                const stepName = c.stepName || c.step;
                                const label =
                                  c.optionName ||
                                  c.choice ||
                                  c.name ||
                                  (typeof c === "string" ? c : "");
                                if (!label || !String(label).trim()) return null;
                                return (
                                  <span
                                    key={cIdx}
                                    className="inline-block max-w-full text-xs sm:text-sm font-medium text-foreground/90 bg-muted/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border/40 leading-relaxed break-words"
                                  >
                                    {stepName ? (
                                      <span className="font-bold text-foreground mr-1">
                                        {stepName}:
                                      </span>
                                    ) : null}
                                    <span>{label}</span>
                                    {typeof c.extraPrice === "number" &&
                                    c.extraPrice > 0 ? (
                                      <span className="text-muted-foreground whitespace-nowrap ml-1 font-normal">
                                        (+<Price cents={c.extraPrice} />)
                                      </span>
                                    ) : null}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>

                {/* Total & Action Bar (Docked Footer) */}
                <div className="p-3 sm:p-4 md:p-5 border-t border-border bg-card shrink-0 space-y-3 sm:space-y-4">
                  {/* Total Sum */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                        {t("total")}
                      </span>
                      <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                        {t("taxNote")}
                      </span>
                    </div>
                    <Price
                      cents={selectedOrder.total}
                      className="text-lg sm:text-xl font-black text-foreground"
                    />
                  </div>

                  {/* Touch Action Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {selectedOrder.status === "in_progress" ? (
                      <>
                        <Button
                          size="default"
                          variant="outline"
                          className="h-9 sm:h-10 text-xs sm:text-sm font-semibold px-3 sm:px-6 rounded-lg sm:rounded-xl border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
                          onClick={() => setOrderToCancel(selectedOrder.$id)}
                        >
                          <ReceiptX className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" weight="bold" />
                          {t("cancelOrder")}
                        </Button>
                        <Button
                          size="default"
                          className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg sm:rounded-xl"
                          onClick={() =>
                            handleStatusChange(selectedOrder.$id, "completed")
                          }
                        >
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" weight="bold" />
                          {t("completeAction")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="default"
                          variant="outline"
                          className="h-9 sm:h-10 text-xs sm:text-sm font-semibold px-3 sm:px-6 rounded-lg sm:rounded-xl border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
                          onClick={() => setOrderToCancel(selectedOrder.$id)}
                        >
                          <ReceiptX className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" weight="bold" />
                          {t("cancelOrder")}
                        </Button>
                        <Button
                          size="default"
                          className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg sm:rounded-xl"
                          onClick={() => {
                            handleStatusChange(selectedOrder.$id, "in_progress");
                            toast.success(t("inProgress"));
                          }}
                        >
                          <ArrowCounterClockwise
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0"
                            weight="bold"
                          />
                          {t("reopenOrder")}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <ClipboardText className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">
                {t("noActiveOrders")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {t("selectOrderPrompt")}
              </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {targetOrderToCancel
                ? t("cancelOrderTitle", {
                    orderNumber: targetOrderToCancel.orderNumber,
                  })
                : t("cancelOrderTitleFallback")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed mt-1">
              {t("cancelOrderWarning")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full gap-3 mt-3">
            <Button
              variant="outline"
              onClick={() => setOrderToCancel(null)}
              className="flex-1 rounded-full font-semibold"
            >
              {t("abortCancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (orderToCancel) {
                  handleStatusChange(orderToCancel, "cancelled");
                  setOrderToCancel(null);
                  toast.success(t("orderCancelledTitle"));
                }
              }}
              className="flex-1 rounded-full gap-2 font-semibold"
            >
              <ReceiptX className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("confirmCancelOrder")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
