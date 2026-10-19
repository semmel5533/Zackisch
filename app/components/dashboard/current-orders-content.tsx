"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@astryxdesign/core/Button";
import { Badge } from "@astryxdesign/core/Badge";
import { Tooltip } from "@astryxdesign/core/Tooltip";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Heading";
import { Price } from "@/components/common/price";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  updateOrderStatusAction,
  recordOrderInPosAction,
} from "@/actions/order-actions";
import {
  SpeakerHigh,
  SpeakerSlash,
  Clock,
  ReceiptX,
  Check,
  ClipboardText,
  Info,
  ArrowDown,
  ArrowLeft,
} from "@phosphor-icons/react";
import { playNewOrderSound, initAudioContext } from "@/lib/audio";
import { toast } from "@/components/common/toast";
import type { Order, OrderItem } from "@/lib/types";

interface CurrentOrdersContentProps {
  orders: Order[];
  businessId: string;
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
  businessId,
  isStaffView,
}: CurrentOrdersContentProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const pendingOrderRef = useRef<string | null>(null);
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
    businessId: businessId as Id<"businesses">,
  });
  const business = useQuery(api.businesses.getPublicRestaurant, {
    id: businessId as Id<"businesses">,
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
    if (business === null) {
      toast.error(t("businessNotFound"));
      router.push("/");
    }
  }, [business, router, t]);

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
    if (pendingOrderRef.current) return false;
    pendingOrderRef.current = orderId;
    setPendingOrderId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus, businessId);
      if (!res?.success) {
        toast.error(res?.error || t("error"));
        return false;
      }
      const timestamp = Date.now();
      setLocalOrders((prev) => {
        if (newStatus === "completed" || newStatus === "cancelled") {
          return prev.filter((order) => order.$id !== orderId);
        }
        return prev.map((order) =>
          order.$id === orderId
            ? {
                ...order,
                status: newStatus,
                readyAt: newStatus === "ready_for_pickup" ? timestamp : order.readyAt,
                $updatedAt: new Date(timestamp).toISOString(),
              }
            : order,
        );
      });
      if (newStatus === "completed" || newStatus === "cancelled") {
        setSelectedOrderId((current) => (current === orderId ? null : current));
      }
      return true;
    } catch {
      toast.error(t("error"));
      return false;
    } finally {
      pendingOrderRef.current = null;
      setPendingOrderId(null);
    }
  }

  const isDe = locale.startsWith("de");
  const unrecordedActiveCount = localOrders.filter(
    (o) =>
      (o.status === "in_progress" || o.status === "ready_for_pickup") &&
      o.posStatus !== "recorded",
  ).length;

  async function handleRecordInPos(orderId: string) {
    if (pendingOrderRef.current) return;
    pendingOrderRef.current = orderId;
    setPendingOrderId(orderId);
    try {
      const res = await recordOrderInPosAction(orderId, businessId);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      const recordedAt = res.posRecordedAt || Date.now();
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.$id === orderId
            ? { ...o, posStatus: "recorded", posRecordedAt: recordedAt }
            : o,
        ),
      );
      toast.success(
        isDe
          ? "Als einmalig in der Kasse erfasst markiert."
          : "Marked as recorded once in POS.",
      );
    } catch {
      toast.error(t("error"));
    } finally {
      pendingOrderRef.current = null;
      setPendingOrderId(null);
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
          "w-full min-h-11 text-left rounded-full transition-[color,background-color,border-color,transform] duration-150 motion-reduce:transition-none motion-reduce:active:scale-100 relative flex items-center justify-between gap-2 select-none bg-card text-foreground border border-border hover:bg-muted/50 hover:border-foreground/20 px-3.5 sm:px-4 font-semibold cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isSelected &&
            "desktop:bg-primary desktop:text-primary-foreground desktop:border-primary desktop:hover:bg-primary desktop:hover:border-primary",
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
              }}
              disabled={pendingOrderId !== null}
              className={cn(
                "w-8 h-8 -ml-1 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 text-foreground border border-border bg-background hover:bg-muted disabled:opacity-50",
                isSelected
                  ? "desktop:hover:bg-white/20 desktop:text-white desktop:border-transparent desktop:bg-transparent"
                  : "desktop:hidden",
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
          <Badge
            variant="neutral"
            label={order.type === "dine-in" || order.tableNumber ? `${t("table")} ${order.tableNumber || ""}` : t("pickup")}
          />
        </div>

        {/* Right: Time badge */}
        <div className="shrink-0 flex items-center pl-1">
          <Badge
            variant="neutral"
            icon={<Clock className="w-3 h-3 shrink-0" weight="bold" />}
            label={clockTime}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col gap-4">
      {/* Top Header */}
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <Heading level={1}>{t("orders")}</Heading>
          {unrecordedActiveCount > 0 && (
            <Badge
              variant="warning"
              label={isDe
                ? `Kassenabgleich offen: ${unrecordedActiveCount}`
                : `POS pending: ${unrecordedActiveCount}`}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={soundEnabled ? "primary" : "secondary"}
            label={soundEnabled ? t("soundOn") : t("soundOff")}
            icon={soundEnabled ? <SpeakerHigh className="w-4 h-4" weight="fill" /> : <SpeakerSlash className="w-4 h-4" />}
            onClick={() => {
              initAudioContext();
              const next = !soundEnabled;
              setSoundEnabled(next);
              localStorage.setItem("zakkig_kitchen_sound", next ? "1" : "0");
              if (next) playNewOrderSound();
            }}
          />
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
              variant={mobileTab === "in_progress" ? "primary" : "secondary"}
              label={`${t("inProgress")} (${inProgressOrders.length})`}
              onClick={() => setMobileTab("in_progress")}
              className="flex-1"
            />
            <Button
              variant={mobileTab === "ready_for_pickup" ? "primary" : "secondary"}
              label={`${t("ready")} (${readyOrders.length})`}
              onClick={() => setMobileTab("ready_for_pickup")}
              className="flex-1"
            />
          </div>

          {/* Dual Columns Side-by-Side */}
          <div className="flex-1 min-h-0 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-[255px_1fr] gap-3 h-full w-full">
            {/* Column 1: In Bearbeitung */}
            <div
              className={cn(
                "w-full flex flex-col min-h-0 h-full rounded-xl border border-border bg-card overflow-hidden shrink-0",
                mobileTab !== "in_progress" && "hidden tablet:flex",
              )}
            >
              {/* Header: Edge-to-Edge Divider */}
              <div className="h-[60px] px-3 sm:px-4 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-foreground truncate">
                    {t("inProgress")}
                  </span>
                  <Tooltip content={t("inProgressSubline")} touchTrigger="tap">
                    <span className="inline-flex items-center justify-center p-1 text-muted-foreground hover:text-foreground cursor-help">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </Tooltip>
                </div>
                <Badge
                  variant="neutral"
                  label={inProgressOrders.length}
                />
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
                "w-full flex flex-col min-h-0 h-full rounded-xl border border-border bg-card overflow-hidden shrink-0",
                mobileTab !== "ready_for_pickup" && "hidden tablet:flex",
              )}
            >
              {/* Header: Edge-to-Edge Divider */}
              <div className="h-[60px] px-3 sm:px-4 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-foreground truncate">
                    {t("ready")}
                  </span>
                  <Tooltip content={t("readySubline")} touchTrigger="tap">
                    <span className="inline-flex items-center justify-center p-1 text-muted-foreground hover:text-foreground cursor-help">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </Tooltip>
                </div>
                <Badge
                  variant="neutral"
                  label={readyOrders.length}
                />
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
              variant="secondary"
              label={t("backToList")}
              icon={<ArrowLeft className="w-4 h-4 shrink-0" weight="bold" />}
              onClick={() => setMobileView("list")}
            />
          </div>

          {selectedOrder ? (
            <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
              {/* Header: Edge-to-Edge Divider */}
              <div className="h-[60px] px-3.5 sm:px-4 border-b border-border bg-muted/20 shrink-0 flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-xl sm:text-2xl font-black tracking-tight font-inter tabular-nums text-foreground shrink-0 leading-none">
                    {selectedOrder.orderNumber}
                  </span>
                  {/* Status Badge directly next to order number */}
                  <Badge
                    variant="neutral"
                    label={selectedOrder.status === "ready_for_pickup"
                      ? t("ready")
                      : t("inProgress")}
                  />
                </div>

                {/* Right-aligned Badges: Table or Pickup, and Time */}
                <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
                  <Badge
                    variant="neutral"
                    label={selectedOrder.type === "dine-in" || selectedOrder.tableNumber
                      ? `${t("table")} ${selectedOrder.tableNumber || ""}`
                      : t("pickup")}
                  />
                  {selectedOrderTime && (
                    <Badge
                      variant="neutral"
                      icon={<Clock className="w-3.5 h-3.5 shrink-0" weight="bold" />}
                      label={selectedOrderTime}
                    />
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
                              <span className="font-bold text-sm sm:text-base text-foreground">
                                <span className="font-inter tabular-nums">{item.quantity}</span>×
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
                                    <p
                                      key={cIdx}
                                      className="max-w-full text-xs leading-relaxed text-muted-foreground break-words"
                                    >
                                      {stepName ? (
                                        <span className="font-semibold text-foreground/90">
                                          {stepName}:{" "}
                                        </span>
                                      ) : null}
                                      <span className="text-foreground/80">{optName}</span>
                                      {typeof c.extraPrice === "number" && c.extraPrice > 0 && (
                                        <>
                                          {" "}
                                          <span className="text-muted-foreground font-normal whitespace-nowrap">
                                            (<Price cents={c.extraPrice} prefix="+" />)
                                          </span>
                                        </>
                                      )}
                                    </p>
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/90 text-background text-xs font-semibold backdrop-blur-xs">
                      <ArrowDown className="w-3.5 h-3.5 shrink-0" weight="bold" />
                      <span>{t("moreItemsBelow")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Footer: Edge-to-Edge Divider & Action Buttons */}
              <div className="p-3.5 sm:p-4 border-t border-border bg-muted/20 shrink-0 flex flex-col gap-3">
                {/* Payment & Single-Entry POS Reconciliation Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/50">
                  <Badge
                    variant="success"
                    icon={<Check className="w-3.5 h-3.5 shrink-0" weight="bold" />}
                    label={isDe ? "Bereits mit Zackisch bezahlt" : "Already paid via Zackisch"}
                  />

                  {selectedOrder.posStatus === "recorded" ? (
                    <Badge
                      variant="neutral"
                      icon={<Check className="w-3.5 h-3.5 shrink-0" weight="bold" />}
                      label={isDe ? "In Kasse erfasst" : "Recorded in POS"}
                    />
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      isDisabled={pendingOrderId !== null}
                      onClick={() => handleRecordInPos(selectedOrder.$id)}
                      icon={<Check className="w-3.5 h-3.5 mr-1.5 shrink-0" weight="bold" />}
                      label={isDe ? "In Kasse erfasst" : "Record in POS"}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-foreground">
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
                        variant="secondary"
                        isDisabled={pendingOrderId !== null}
                        label={t("cancelOrder")}
                        icon={<ReceiptX className="w-4 h-4 mr-2 shrink-0" weight="bold" />}
                        onClick={() => setOrderToCancel(selectedOrder.$id)}
                      />
                      <Button
                        variant="primary"
                        isDisabled={pendingOrderId !== null}
                        className="flex-1"
                        label={t("markReady")}
                        icon={<Check className="w-4 h-4 mr-2 shrink-0" weight="bold" />}
                        onClick={() =>
                          handleStatusChange(selectedOrder.$id, "ready_for_pickup")
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        isDisabled={pendingOrderId !== null}
                        label={t("cancelOrder")}
                        icon={<ReceiptX className="w-4 h-4 mr-2 shrink-0" weight="bold" />}
                        onClick={() => setOrderToCancel(selectedOrder.$id)}
                      />
                      <Button
                        variant="primary"
                        isDisabled={pendingOrderId !== null}
                        className="flex-1"
                        label={t("complete")}
                        icon={<Check className="w-4 h-4 mr-2 shrink-0" weight="bold" />}
                        onClick={() => setOrderToComplete(selectedOrder.$id)}
                      />
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
        isOpen={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
        width={460}
        purpose="required"
      >
        <Layout
          header={
            <DialogHeader
              title={targetOrderToCancel
                ? t("cancelOrderTitle", {
                    orderNumber: targetOrderToCancel.orderNumber,
                  })
                : t("cancelOrderTitleFallback")}
              onOpenChange={(open: boolean) => !open && setOrderToCancel(null)}
            />
          }
          content={
            <LayoutContent>
              <p className="text-sm text-destructive font-medium p-4">
                {t("cancelOrderWarning")}
              </p>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-border/40 w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  isDisabled={pendingOrderId !== null}
                  label={t("abortCancel")}
                  onClick={() => setOrderToCancel(null)}
                />
                <Button
                  variant="destructive"
                  size="lg"
                  isDisabled={pendingOrderId !== null}
                  label={t("confirmCancelOrder")}
                  onClick={async () => {
                    if (orderToCancel) {
                      if (await handleStatusChange(orderToCancel, "cancelled")) {
                        setOrderToCancel(null);
                        toast.success(t("cancelledOrder"));
                      }
                    }
                  }}
                />
              </div>
            </LayoutFooter>
          }
        />
      </Dialog>

      {/* Complete Order Confirmation Dialog */}
      <Dialog
        isOpen={!!orderToComplete}
        onOpenChange={(open) => !open && setOrderToComplete(null)}
        width={460}
        purpose="required"
      >
        <Layout
          header={
            <DialogHeader
              title={targetOrderToComplete
                ? t("completeOrderTitle", {
                    orderNumber: targetOrderToComplete.orderNumber,
                  })
                : t("completeOrderTitleFallback")}
              onOpenChange={(open: boolean) => !open && setOrderToComplete(null)}
            />
          }
          content={
            <LayoutContent>
              <p className="text-sm text-muted-foreground leading-relaxed p-4">
                {t("completeOrderDesc")}
              </p>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-border/40 w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  isDisabled={pendingOrderId !== null}
                  label={t("abortCancel")}
                  onClick={() => setOrderToComplete(null)}
                />
                <Button
                  variant="primary"
                  size="lg"
                  isDisabled={pendingOrderId !== null}
                  label={t("completeConfirm")}
                  onClick={async () => {
                    if (orderToComplete) {
                      if (await handleStatusChange(orderToComplete, "completed")) {
                        setOrderToComplete(null);
                        toast.success(t("completed"));
                      }
                    }
                  }}
                />
              </div>
            </LayoutFooter>
          }
        />
      </Dialog>

    </div>
  );
}
