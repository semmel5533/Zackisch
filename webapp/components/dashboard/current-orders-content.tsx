"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { updateOrderStatusAction } from "@/actions/order-actions";
import {
  SpeakerHigh,
  SpeakerSlash,
  Clock,
  ReceiptX,
  Check,
  ClipboardText,
  Info,
  WarningCircle,
  ArrowDown,
  ArrowLeft,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { playNewOrderSound, initAudioContext } from "@/lib/audio";
import { toast } from "sonner";
import type { Order, OrderItem } from "@/lib/types";

interface CurrentOrdersContentProps {
  orders: Order[];
  organizationId: string;
  isStaffView?: boolean;
}

function getItemCustomizations(item: any) {
  if (Array.isArray(item.customizations) && item.customizations.length > 0) {
    return item.customizations;
  }
  if (typeof item.customizations === "string") {
    try {
      const parsed = JSON.parse(item.customizations);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

function formatOrderTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function CurrentOrdersContent({
  orders,
  organizationId,
  isStaffView,
}: CurrentOrdersContentProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"in_progress" | "ready_for_pickup">("in_progress");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [inProgressTooltipOpen, setInProgressTooltipOpen] = useState(false);
  const [readyTooltipOpen, setReadyTooltipOpen] = useState(false);

  const [hasMoreBelow, setHasMoreBelow] = useState(false);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = itemsContainerRef.current;
    if (!el) {
      setHasMoreBelow(false);
      return;
    }
    const canScrollMore = el.scrollHeight - el.scrollTop - el.clientHeight > 12;
    setHasMoreBelow(canScrollMore);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 80);
    return () => clearTimeout(timer);
  }, [selectedOrderId, localOrders, checkScroll]);

  useEffect(() => {
    const el = itemsContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [checkScroll]);

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

  // Column 1: in_progress orders (FIFO: oldest active order first)
  const inProgressOrders = useMemo(
    () =>
      localOrders
        .filter((o) => o.status === "in_progress")
        .sort((a, b) => {
          const timeA =
            a.createdAt ||
            a._creationTime ||
            (a.$createdAt ? new Date(a.$createdAt).getTime() : 0);
          const timeB =
            b.createdAt ||
            b._creationTime ||
            (b.$createdAt ? new Date(b.$createdAt).getTime() : 0);
          return timeA - timeB;
        }),
    [localOrders],
  );

  // Column 2: ready_for_pickup orders (FIFO: ready longest first)
  const readyOrders = useMemo(
    () =>
      localOrders
        .filter((o) => o.status === "ready_for_pickup")
        .sort((a, b) => {
          const timeA =
            a.completedAt ||
            (a.$updatedAt ? new Date(a.$updatedAt).getTime() : a.createdAt || a._creationTime || 0);
          const timeB =
            b.completedAt ||
            (b.$updatedAt ? new Date(b.$updatedAt).getTime() : b.createdAt || b._creationTime || 0);
          return timeA - timeB;
        }),
    [localOrders],
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
      const firstReady = readyOrders[0]?.$id;
      setSelectedOrderId(firstActive || firstReady || null);
    }
  }, [localOrders, selectedOrderId, inProgressOrders, readyOrders]);

  const selectedOrder = useMemo(() => {
    return localOrders.find((o) => o.$id === selectedOrderId) || null;
  }, [localOrders, selectedOrderId]);

  if (!mounted) {
    return null;
  }

  const isSelectedReady = selectedOrder?.status === "ready_for_pickup";
  const selectedOrderTimestamp = selectedOrder
    ? isSelectedReady
      ? selectedOrder.readyAt ||
        (selectedOrder.$updatedAt ? new Date(selectedOrder.$updatedAt).getTime() : 0) ||
        selectedOrder._creationTime ||
        (selectedOrder.$createdAt ? new Date(selectedOrder.$createdAt).getTime() : 0)
      : selectedOrder.createdAt ||
        selectedOrder._creationTime ||
        (selectedOrder.$createdAt ? new Date(selectedOrder.$createdAt).getTime() : 0)
    : 0;
  const selectedOrderTime = formatOrderTime(selectedOrderTimestamp);
  const targetOrderToCancel = localOrders.find((o) => o.$id === orderToCancel);
  const targetOrderToComplete = localOrders.find((o) => o.$id === orderToComplete);

  async function handleStatusChange(
    orderId: string,
    newStatus: "in_progress" | "ready_for_pickup" | "completed" | "cancelled",
  ) {
    const timestamp = Date.now();

    // If completing or cancelling the currently selected order, pick the next available order
    if ((newStatus === "completed" || newStatus === "cancelled") && selectedOrderId === orderId) {
      const remainingOrders = localOrders.filter((o) => o.$id !== orderId);
      const nextActive = remainingOrders.find((o) => o.status === "in_progress") || remainingOrders[0];
      setSelectedOrderId(nextActive ? nextActive.$id : null);
    }

    // Optimistic UI update
    setLocalOrders((prev) => {
      if (newStatus === "completed" || newStatus === "cancelled") {
        return prev.filter((o) => o.$id !== orderId);
      }
      return prev.map((o) =>
        o.$id === orderId
          ? {
              ...o,
              status: newStatus,
              readyAt: newStatus === "ready_for_pickup" ? timestamp : o.readyAt,
              $updatedAt: new Date(timestamp).toISOString(),
            }
          : o,
      );
    });

    const res = await updateOrderStatusAction(orderId, newStatus, organizationId);
    if (res?.error) {
      toast.error(res.error);
    }
  }

  const renderMiniCard = (order: Order, isReady: boolean) => {
    const isSelected = selectedOrderId === order.$id;
    const timestamp = isReady
      ? order.readyAt ||
        (order.$updatedAt ? new Date(order.$updatedAt).getTime() : 0) ||
        order.createdAt ||
        order._creationTime
      : order.createdAt ||
        order._creationTime ||
        (order.$createdAt ? new Date(order.$createdAt).getTime() : 0);
    const clockTime = formatOrderTime(timestamp);

    return (
      <div
        key={order.$id}
        role="button"
        tabIndex={0}
        onClick={() => {
          setSelectedOrderId(order.$id);
          setMobileView("detail");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedOrderId(order.$id);
            setMobileView("detail");
          }
        }}
        className={cn(
          "w-full h-11 text-left rounded-full transition-all relative flex items-center justify-between gap-2 select-none bg-card text-foreground border border-border hover:bg-muted/50 hover:border-foreground/20 px-3.5 sm:px-4 font-semibold cursor-pointer active:scale-[0.98]",
          isSelected &&
            "desktop:bg-primary desktop:text-primary-foreground desktop:border-primary desktop:shadow-xs desktop:hover:bg-primary desktop:hover:border-primary",
        )}
      >
        {/* Left: Optional Back-to-Progress Arrow, Number and Type */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          {isReady && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                await handleStatusChange(order.$id, "in_progress");
                toast.info(t("backToInProgressSuccess"));
              }}
              className={cn(
                "w-7 h-7 -ml-1 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-90",
                isSelected
                  ? "hover:bg-white/20 text-white"
                  : "hover:bg-muted text-foreground border border-border/60 bg-muted/30",
                !isSelected && "desktop:hidden",
              )}
              title={t("backToInProgress")}
              aria-label={t("backToInProgress")}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" weight="bold" />
            </button>
          )}

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
              "text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1 border bg-muted text-foreground/80 border-transparent",
              isSelected && "desktop:bg-white/15 desktop:text-white desktop:border-white/20",
            )}
          >
            {order.type === "dine-in" || order.tableNumber ? (
              <>
                <span>{t("table")}</span>{" "}
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
          <span
            className={cn(
              "text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 border bg-muted text-foreground/80 border-transparent",
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
            <span className="font-inter tabular-nums">{clockTime}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 pt-[22px]">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0 print:hidden sm:-mt-[10.4px]">
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
            className="h-11 text-sm px-5 gap-2 rounded-full cursor-pointer active:scale-[0.98] transition-all font-semibold shadow-xs"
          >
            {soundEnabled ? (
              <>
                <SpeakerHigh className="w-4 h-4 text-primary-foreground" weight="fill" />
                <span>{t("soundOn")}</span>
              </>
            ) : (
              <>
                <SpeakerSlash className="w-4 h-4 text-primary-foreground/70" />
                <span>{t("soundOff")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col desktop:flex-row gap-3 sm:gap-4 overflow-hidden">
        {/* Left Side: Master Queue Panel */}
        <div
          className={cn(
            "flex flex-col min-h-0 h-full desktop:w-[580px] desktop:min-w-[580px] desktop:max-w-[580px] shrink-0",
            mobileView === "detail" ? "hidden desktop:flex" : "flex",
          )}
        >
          {/* Mobile Status Tabs (< 500px) */}
          <div className="flex tablet:hidden gap-2 pb-2 shrink-0">
            <Button
              variant={mobileTab === "in_progress" ? "default" : "outline"}
              size="default"
              onClick={() => setMobileTab("in_progress")}
              className="flex-1 font-semibold gap-2 h-11 text-sm px-4 rounded-full"
            >
              <span>{t("inProgress")}</span>
              <span
                className={cn(
                  "h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-bold font-inter tabular-nums leading-none",
                  inProgressOrders.length > 9
                    ? "px-1.5"
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
              variant={mobileTab === "ready_for_pickup" ? "default" : "outline"}
              size="default"
              onClick={() => setMobileTab("ready_for_pickup")}
              className="flex-1 font-semibold gap-2 h-11 text-sm px-4 rounded-full"
            >
              <span>{t("ready")}</span>
              <span
                className={cn(
                  "h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-bold font-inter tabular-nums leading-none",
                  readyOrders.length > 9
                    ? "px-1.5"
                    : "aspect-square p-0",
                  mobileTab === "ready_for_pickup"
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {readyOrders.length}
              </span>
            </Button>
          </div>

          {/* Dual Columns Side-by-Side */}
          <TooltipProvider delay={100}>
            <div className="flex-1 min-h-0 grid grid-cols-1 tablet:grid-cols-2 current-orders-queue-grid gap-3 h-full w-full">
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
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground truncate">
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

              {/* Column 2: Abholbereit */}
              <div
                className={cn(
                  "w-full flex flex-col min-h-0 h-full rounded-lg sm:rounded-xl border border-border bg-card/60 overflow-hidden shrink-0",
                  mobileTab !== "ready_for_pickup" && "hidden tablet:flex",
                )}
              >
                {/* Header: Edge-to-Edge Divider */}
                <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground truncate">
                      {t("ready")}
                    </span>
                    <Tooltip
                      open={readyTooltipOpen}
                      onOpenChange={setReadyTooltipOpen}
                    >
                      <TooltipTrigger
                        type="button"
                        onClick={() => setReadyTooltipOpen((v) => !v)}
                        className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0 cursor-pointer"
                        aria-label={t("info")}
                      >
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-[240px] p-2.5 text-xs">
                        <p className="font-medium leading-relaxed">
                          {t("readySubline")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge
                    className={cn(
                      "h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold font-inter tabular-nums shrink-0 p-0 flex items-center justify-center leading-none",
                      readyOrders.length > 9
                        ? "px-1"
                        : "aspect-square",
                    )}
                  >
                    {readyOrders.length}
                  </Badge>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 space-y-2">
                  {readyOrders.length === 0 ? (
                    <div className="py-3.5 px-3 text-center text-xs text-muted-foreground font-medium border border-dashed border-border/80 rounded-lg">
                      {t("noReadyOrders")}
                    </div>
                  ) : (
                    readyOrders.map((order) => renderMiniCard(order, true))
                  )}
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Right Side: Order Detail Card View */}
        <div
          className={cn(
            "flex-1 min-h-0 h-full flex flex-col gap-3 desktop:gap-0",
            mobileView === "list" ? "hidden desktop:flex" : "flex",
          )}
        >
          {/* Mobile Back Button (above order card) */}
          <div className="desktop:hidden shrink-0">
            <Button
              variant="outline"
              size="default"
              className="h-11 px-4 sm:px-5 text-sm font-semibold rounded-full border-border bg-card hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-xs"
              onClick={() => setMobileView("list")}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" weight="bold" />
              <span>{t("backToList")}</span>
            </Button>
          </div>

          {selectedOrder ? (
            <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col overflow-hidden shadow-xs">
              {/* Header: Edge-to-Edge Divider */}
              <div className="p-3.5 sm:p-4 border-b border-border bg-muted/20 shrink-0 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-xl sm:text-2xl font-black tracking-tight font-inter tabular-nums text-foreground shrink-0">
                    {selectedOrder.orderNumber}
                  </span>
                  {/* Status Badge directly next to order number */}
                  <Badge
                    variant="outline"
                    className="h-7 px-2.5 sm:px-3 rounded-full text-xs font-bold uppercase tracking-wider text-foreground border-border bg-card shrink-0"
                  >
                    {selectedOrder.status === "ready_for_pickup"
                      ? t("ready")
                      : t("inProgress")}
                  </Badge>
                </div>

                {/* Right-aligned Badges: Table or Pickup, and Time */}
                <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
                  <Badge
                    variant="outline"
                    className="h-7 px-3 rounded-full text-xs font-bold uppercase tracking-wider text-foreground border-border bg-card shrink-0"
                  >
                    {selectedOrder.type === "dine-in" || selectedOrder.tableNumber ? (
                      <>
                        <span>{t("table")}</span>{" "}
                        <span className="font-inter tabular-nums">
                          {selectedOrder.tableNumber || ""}
                        </span>
                      </>
                    ) : (
                      t("pickup")
                    )}
                  </Badge>
                  {selectedOrderTime && (
                    <Badge
                      variant="outline"
                      className="h-7 px-3 rounded-full text-xs font-semibold text-foreground border-border bg-card shrink-0 inline-flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-foreground/80 shrink-0" weight="bold" />
                      <span className="font-inter tabular-nums">{selectedOrderTime}</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Items List Body */}
              <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
                <div
                  ref={itemsContainerRef}
                  onScroll={checkScroll}
                  className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4"
                >
                  {(() => {
                    let items: OrderItem[] = [];
                    try {
                      items =
                        typeof selectedOrder.items === "string"
                          ? JSON.parse(selectedOrder.items)
                          : selectedOrder.items;
                    } catch {
                      items = [];
                    }

                    return items.map((item, idx) => {
                      const customizations = getItemCustomizations(item);

                      return (
                        <div
                          key={`${item.name}-${idx}`}
                          className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm sm:text-base font-inter tabular-nums text-foreground">
                                {item.quantity}×
                              </span>
                              <span className="font-semibold text-sm sm:text-base text-foreground">
                                {item.name}
                              </span>
                            </div>

                            {customizations.length > 0 && (
                              <div className="flex flex-col items-start gap-1.5 mt-1.5 pl-5">
                                {customizations.map((c: any, cIdx: number) => {
                                  const stepName = c.stepName || c.step;
                                  const optName =
                                    c.optionName ||
                                    c.choice ||
                                    c.name ||
                                    (typeof c === "string" ? c : "");
                                  if (!optName || !String(optName).trim()) return null;

                                  return (
                                    <span
                                      key={cIdx}
                                      className="inline-flex items-center text-xs text-muted-foreground bg-muted/60 border border-border/60 px-2 py-0.5 rounded-md"
                                    >
                                      {stepName ? (
                                        <span className="font-medium text-foreground/80 mr-1">
                                          {stepName}:
                                        </span>
                                      ) : null}
                                      <span>{optName}</span>
                                      {typeof c.extraPrice === "number" && c.extraPrice > 0 && (
                                        <span className="text-muted-foreground/80 ml-1">
                                          (+<Price cents={c.extraPrice} />)
                                        </span>
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <Price
                            cents={item.price * item.quantity}
                            className="font-bold text-sm sm:text-base text-foreground shrink-0"
                          />
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Sticky "More Items Below" pill indicator */}
                {hasMoreBelow && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 animate-in fade-in duration-200">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/90 text-background text-xs font-semibold shadow-md backdrop-blur-xs">
                      <ArrowDown className="w-3.5 h-3.5 shrink-0" weight="bold" />
                      <span>{t("moreItemsBelow")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Footer: Edge-to-Edge Divider & Action Buttons */}
              <div className="p-3.5 sm:p-4 border-t border-border bg-muted/20 shrink-0 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold uppercase tracking-wider text-foreground">
                      {t("total")}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {t("taxNote")}
                    </span>
                  </div>
                  <Price
                    cents={selectedOrder.total}
                    className="text-xl sm:text-2xl font-black text-foreground"
                  />
                </div>

                {/* Touch Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {selectedOrder.status === "in_progress" ? (
                    <>
                      <Button
                        size="default"
                        variant="outline"
                        className="h-11 text-sm font-semibold px-5 rounded-full border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0 cursor-pointer"
                        onClick={() => setOrderToCancel(selectedOrder.$id)}
                      >
                        <ReceiptX className="w-4 h-4 mr-2 shrink-0" weight="bold" />
                        {t("cancelOrder")}
                      </Button>
                      <Button
                        size="default"
                        className="flex-1 h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full active:scale-[0.98] transition-all cursor-pointer"
                        onClick={() =>
                          handleStatusChange(selectedOrder.$id, "ready_for_pickup")
                        }
                      >
                        <Check className="w-4 h-4 mr-2 shrink-0" weight="bold" />
                        {t("markReady")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="default"
                        variant="outline"
                        className="h-11 text-sm font-semibold px-4 sm:px-5 rounded-full border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0 cursor-pointer"
                        onClick={() => setOrderToCancel(selectedOrder.$id)}
                      >
                        <ReceiptX className="w-4 h-4 mr-2 shrink-0" weight="bold" />
                        {t("cancelOrder")}
                      </Button>
                      <Button
                        size="default"
                        className="flex-1 h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full active:scale-[0.98] transition-all cursor-pointer"
                        onClick={() => setOrderToComplete(selectedOrder.$id)}
                      >
                        <Check className="w-4 h-4 mr-2 shrink-0" weight="bold" />
                        {t("complete")}
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


      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col">
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
              {targetOrderToCancel
                ? t("cancelOrderTitle", {
                    orderNumber: targetOrderToCancel.orderNumber,
                  })
                : t("cancelOrderTitleFallback")}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <div className="p-5 sm:p-6 text-sm text-zinc-900">
            <div className="flex items-start gap-2.5 text-xs text-left text-zinc-600 font-medium bg-zinc-50 py-2.5 px-3.5 rounded-2xl w-full border border-zinc-200">
              <WarningCircle
                className="w-4 h-4 shrink-0 mt-0.5 text-zinc-900"
                weight="fill"
              />
              <span>{t("cancelOrderWarning")}</span>
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
            <Button
              variant="outline"
              className="w-full sm:flex-1 rounded-full h-11 border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              onClick={() => setOrderToCancel(null)}
            >
              {t("abortCancel")}
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:flex-1 rounded-full h-11 font-semibold cursor-pointer active:scale-[0.98] transition-all"
              onClick={async () => {
                if (orderToCancel) {
                  await handleStatusChange(orderToCancel, "cancelled");
                  setOrderToCancel(null);
                  toast.success(t("cancelledOrder"));
                }
              }}
            >
              {t("confirmCancelOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Order Confirmation Dialog */}
      <Dialog
        open={!!orderToComplete}
        onOpenChange={(open) => !open && setOrderToComplete(null)}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col">
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
                {t("completeOrderTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-normal leading-relaxed mt-0.5">
                {targetOrderToComplete
                  ? `#${targetOrderToComplete.orderNumber}`
                  : ""}
              </DialogDescription>
            </div>
            <DialogCloseButton />
          </DialogHeader>

          <div className="p-5 sm:p-6 space-y-4 text-sm text-zinc-900">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {t("completeOrderDesc")}
            </p>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
            <Button
              variant="outline"
              className="w-full sm:flex-1 rounded-full h-11 border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              onClick={() => setOrderToComplete(null)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="w-full sm:flex-1 rounded-full h-11 font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer active:scale-[0.98] transition-all"
              onClick={async () => {
                if (orderToComplete) {
                  await handleStatusChange(orderToComplete, "completed");
                  setOrderToComplete(null);
                  toast.success(t("completed"));
                }
              }}
            >
              <Check className="w-4 h-4 mr-2 shrink-0" weight="bold" />
              {t("completeConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
