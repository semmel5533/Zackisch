"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TextField, CheckboxField } from "@/components/ui/form-controls";
import { Badge, Card } from "@/components/ui/surfaces";
import {
  Funnel,
  CaretDown,
  CaretUp,
  CaretUpDown,
  DownloadSimple,
  MagnifyingGlass,
  ReceiptX,
  Check,
} from "@phosphor-icons/react";
import { Price } from "@/components/common/price";
import { useTranslation } from "@/lib/i18n";
import {
  exportOrdersCSVAction,
  updateOrderStatusAction,
  recordOrderInPosAction,
  refundOrderAction,
} from "@/actions/order-actions";
import { toast } from "@/components/common/toast";
import type { Order } from "@/lib/types";

interface AllOrdersContentProps {
  orders: Order[];
  businessId: string;
  hideExport?: boolean;
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

type SortConfig = {
  key: keyof Order | "items";
  direction: "asc" | "desc";
} | null;

const statusVariants: Record<string, "neutral" | "warning" | "success" | "error"> = {
  in_progress: "neutral",
  ready_for_pickup: "warning",
  completed: "success",
  cancelled: "error",
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function AllOrdersContent({
  orders: initialOrders,
  businessId,
  hideExport = false,
}: AllOrdersContentProps) {
  const { t, locale } = useTranslation();
  const isDe = locale.startsWith("de");

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null);
  const [refundAmountEur, setRefundAmountEur] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);
  const [recordingOrderId, setRecordingOrderId] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "$createdAt",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  let processedOrders = [...orders];

  // 1. Filter
  if (selectedTypes.length > 0) {
    const typesSet = new Set(selectedTypes);
    processedOrders = processedOrders.filter((o) => {
      const isDineIn = o.type === "dine-in" || !!o.tableNumber;
      if (typesSet.has("dine-in") && isDineIn) return true;
      if (typesSet.has("takeaway") && !isDineIn) return true;
      return false;
    });
  }
  if (selectedStatuses.length > 0) {
    const statusesSet = new Set(selectedStatuses);
    processedOrders = processedOrders.filter((o) => statusesSet.has(o.status));
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "in_progress":
        return t("inProgress");
      case "ready_for_pickup":
        return t("ready");
      case "completed":
        return t("completed");
      case "cancelled":
        return t("cancelledOrder");
      default:
        return status;
    }
  }

  function formatPrice(cents: number) {
    return (cents / 100).toFixed(2).replace(".", ",");
  }

  // 2. Search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    processedOrders = processedOrders.filter((o) => {
      const searchString = [
        o.orderNumber,
        o.$id,
        o.email || "",
        getStatusLabel(o.status),
        o.type === "dine-in" || o.tableNumber
          ? `${t("toTable")} ${o.tableNumber || ""}`.trim()
          : t("toPickUp"),
        formatPrice(o.total),
        o.items,
      ]
        .join(" ")
        .toLowerCase();

      return searchString.includes(query);
    });
  }

  // 3. Sort
  if (sortConfig !== null) {
    processedOrders.sort((a, b) => {
      if (sortConfig.key === "$createdAt") {
        const timeA = a.createdAt || a._creationTime || (a.$createdAt ? new Date(a.$createdAt).getTime() : 0);
        const timeB = b.createdAt || b._creationTime || (b.$createdAt ? new Date(b.$createdAt).getTime() : 0);
        if (timeA < timeB) return sortConfig.direction === "asc" ? -1 : 1;
        if (timeA > timeB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }

      let aValue: any = a[sortConfig.key as keyof Order];
      let bValue: any = b[sortConfig.key as keyof Order];

      if (sortConfig.key === "items") {
        try {
          const aItems = typeof a.items === "string" ? JSON.parse(a.items) : a.items;
          const bItems = typeof b.items === "string" ? JSON.parse(b.items) : b.items;
          aValue = Array.isArray(aItems) ? aItems.length : 0;
          bValue = Array.isArray(bItems) ? bItems.length : 0;
        } catch {
          aValue = 0;
          bValue = 0;
        }
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // 4. Pagination
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handleSort(key: keyof Order | "items") {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  }

  function handleTypeToggle(type: string, checked?: boolean) {
    setSelectedTypes((prev) => {
      const isChecked = checked ?? !prev.includes(type);
      return isChecked ? [...prev, type] : prev.filter((t) => t !== type);
    });
    setCurrentPage(1);
  }

  function handleStatusToggle(status: string, checked?: boolean) {
    setSelectedStatuses((prev) => {
      const isChecked = checked ?? !prev.includes(status);
      return isChecked ? [...prev, status] : prev.filter((s) => s !== status);
    });
    setCurrentPage(1);
  }

  function renderSortIcon(columnKey: keyof Order | "items") {
    if (sortConfig?.key !== columnKey) {
      return <CaretUpDown className="ml-1.5 size-3.5 opacity-40" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp className="ml-1.5 size-3.5 text-foreground" />
    ) : (
      <CaretDown className="ml-1.5 size-3.5 text-foreground" />
    );
  }

  async function handleCancelOrder(order: Order) {
    setIsCancelling(true);
    try {
      const res = await updateOrderStatusAction(order.$id, "cancelled", businessId);
      if (!res?.success) {
        toast.error(res?.error || t("error"));
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.$id === order.$id ? { ...o, status: "cancelled" } : o)),
      );
      toast.success(t("cancelledOrder"));
      setOrderToCancel(null);
    } catch {
      toast.error(t("error"));
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleRecordPos(order: Order) {
    if (recordingOrderId) return;
    setRecordingOrderId(order.$id);
    try {
      const res = await recordOrderInPosAction(order.$id, businessId);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.$id === order.$id
            ? {
                ...o,
                posStatus: "recorded",
                posRecordedAt: res.posRecordedAt || Date.now(),
              }
            : o,
        ),
      );
      toast.success(
        isDe
          ? "Als einmalig in der Kasse erfasst gespeichert."
          : "Saved as recorded once in POS.",
      );
    } catch {
      toast.error(t("error"));
    } finally {
      setRecordingOrderId(null);
    }
  }

  async function handleRefundOrder() {
    if (!orderToRefund || isRefunding) return;
    setIsRefunding(true);
    try {
      const parsedAmount = refundAmountEur.trim()
        ? Math.round(parseFloat(refundAmountEur.replace(",", ".")) * 100)
        : undefined;
      const res = await refundOrderAction(
        orderToRefund.$id,
        businessId,
        parsedAmount,
        "requested_by_customer",
      );
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.$id === orderToRefund.$id
            ? {
                ...o,
                refundStatus: (res.refundStatus as any) || "full",
                refundedCents: res.cumulativeRefundedCents || o.total,
              }
            : o,
        ),
      );
      toast.success(
        isDe
          ? "Rückerstattung (inkl. anteiliger 2 %-Provisionsgutschrift) durchgeführt."
          : "Refund (incl. proportional 2% fee reversal) completed.",
      );
      setOrderToRefund(null);
      setRefundAmountEur("");
    } catch {
      toast.error(t("error"));
    } finally {
      setIsRefunding(false);
    }
  }

  async function handleExportCSV() {
    const result = await exportOrdersCSVAction(businessId);
    if (result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `zackisch-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  async function handleCopyOrderId(id: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = id;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success(t("orderIdCopied"));
    } catch {
      toast.error(t("error"));
    }
  }

  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 @container">
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <h1 className="text-xl font-bold tracking-tight text-[var(--zk-text)]">{t("allOrders")}</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Controls Layout */}
        <div className="flex flex-col @min-[700px]:flex-row gap-3 @min-[700px]:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full @min-[700px]:w-auto @min-[700px]:max-w-xl">
            {/* Search Input */}
            <div className="flex-1 min-w-0 relative">
              <MagnifyingGlass className="size-4 text-[var(--zk-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                aria-label={t("search")}
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="zk-input pl-10"
              />
            </div>

            {/* Filter Popover */}
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFilterOpen((o) => !o)}
              >
                <Funnel className="size-4" aria-hidden="true" />
                <span>
                  {selectedTypes.length + selectedStatuses.length === 0
                    ? t("filters")
                    : `${selectedTypes.length + selectedStatuses.length} ${t("filters")}`}
                </span>
              </Button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--zk-border)] bg-[var(--zk-surface)] p-4 shadow-lg z-40 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <CheckboxField
                      label={t("toPickUp")}
                      checked={selectedTypes.includes("takeaway")}
                      onChange={(c) => handleTypeToggle("takeaway", c)}
                    />
                    <CheckboxField
                      label={t("toTable")}
                      checked={selectedTypes.includes("dine-in")}
                      onChange={(c) => handleTypeToggle("dine-in", c)}
                    />
                  </div>
                  <hr className="zk-divider" />
                  <div className="flex flex-col gap-1">
                    <CheckboxField
                      label={getStatusLabel("in_progress")}
                      checked={selectedStatuses.includes("in_progress")}
                      onChange={(c) => handleStatusToggle("in_progress", c)}
                    />
                    <CheckboxField
                      label={getStatusLabel("ready_for_pickup")}
                      checked={selectedStatuses.includes("ready_for_pickup")}
                      onChange={(c) => handleStatusToggle("ready_for_pickup", c)}
                    />
                    <CheckboxField
                      label={getStatusLabel("completed")}
                      checked={selectedStatuses.includes("completed")}
                      onChange={(c) => handleStatusToggle("completed", c)}
                    />
                    <CheckboxField
                      label={getStatusLabel("cancelled")}
                      checked={selectedStatuses.includes("cancelled")}
                      onChange={(c) => handleStatusToggle("cancelled", c)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!hideExport && (
            <Button
              variant="primary"
              onClick={handleExportCSV}
            >
              <DownloadSimple className="size-4" weight="bold" aria-hidden="true" />
              <span>{t("exportCSV")}</span>
            </Button>
          )}
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                <tr>
                  <th
                    className="cursor-pointer whitespace-nowrap py-3 pl-4 pr-3 min-w-[90px]"
                    onClick={() => handleSort("$id")}
                  >
                    <div className="flex items-center">
                      {t("id")}
                      {renderSortIcon("$id")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap py-3 px-3 min-w-[90px]"
                    onClick={() => handleSort("orderNumber")}
                  >
                    <div className="flex items-center">
                      {t("orderNumber")}
                      {renderSortIcon("orderNumber")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap py-3 px-3 min-w-[140px]"
                    onClick={() => handleSort("$createdAt")}
                  >
                    <div className="flex items-center">
                      {t("datetime")}
                      {renderSortIcon("$createdAt")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap py-3 px-3 min-w-[110px]"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      {t("type")}
                      {renderSortIcon("type")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer min-w-[260px] max-w-[400px] py-3 px-4"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center">
                      {t("items")}
                      {renderSortIcon("items")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer text-right whitespace-nowrap min-w-[110px] py-3 px-4"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center justify-end">
                      {t("total")}
                      {renderSortIcon("total")}
                    </div>
                  </th>
                  <th className="whitespace-nowrap min-w-[140px] py-3 px-4">
                    {isDe ? "Kassenstatus (POS)" : "POS Status"}
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap min-w-[130px] py-3 px-4"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      {t("status")}
                      {renderSortIcon("status")}
                    </div>
                  </th>
                  <th className="text-right whitespace-nowrap py-3 pr-4 pl-3 w-[200px] min-w-[200px]">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("noAllOrders")}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    let items: any[] = [];
                    try {
                      items =
                        typeof order.items === "string"
                          ? JSON.parse(order.items)
                          : order.items;
                      if (!Array.isArray(items)) items = [];
                    } catch {
                      items = [];
                    }

                    const isCancelled = order.status === "cancelled";
                    const isCancellable =
                      order.status === "in_progress" || order.status === "ready_for_pickup";
                    const canRefund =
                      !hideExport &&
                      Boolean(order.stripePaymentId) &&
                      order.refundStatus !== "full" &&
                      !order.isTestOrder;

                    return (
                      <tr
                        key={order.$id}
                        className={isCancelled ? "opacity-60 bg-muted/20" : "hover:bg-[var(--zk-surface-muted)]/50"}
                      >
                        <td className="font-mono text-xs text-muted-foreground whitespace-nowrap py-3 pl-4 pr-3 min-w-[90px]">
                          <button
                            type="button"
                            title={order.$id}
                            onClick={() => handleCopyOrderId(order.$id)}
                            className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:underline"
                            aria-label={order.$id}
                          >
                            {order.$id.length > 8 ? order.$id.slice(-6) : order.$id}
                          </button>
                        </td>
                        <td className="font-medium font-inter tabular-nums text-sm whitespace-nowrap py-3 px-3 min-w-[90px]">
                          {order.orderNumber}
                        </td>
                        <td className="whitespace-nowrap text-sm font-inter tabular-nums py-3 px-3 min-w-[140px]">
                          <span suppressHydrationWarning>
                            {dateFormatter.format(
                              new Date(order.$createdAt || order._creationTime || Date.now())
                            )}
                          </span>
                        </td>
                        <td className="text-sm font-medium whitespace-nowrap py-3 px-3 min-w-[110px]">
                          {order.type === "dine-in" || order.tableNumber ? (
                            <span className="inline-flex items-center gap-1">
                              <span>{t("toTable")}</span>
                              <span className="font-inter tabular-nums">
                                {order.tableNumber || ""}
                              </span>
                            </span>
                          ) : (
                            t("toPickUp")
                          )}
                        </td>
                        <td className="text-sm whitespace-normal min-w-[260px] max-w-[400px] px-4 py-3">
                          <div className="flex flex-col gap-2 py-1 max-w-[380px]">
                            {items.map((item: any, index: number) => {
                              const customizations = getItemCustomizations(item);
                              return (
                                <div
                                  key={`${item.cartItemId || item.id || item.menuItemId || item.name}-${index}`}
                                  className="flex flex-col gap-1"
                                >
                                  <div className="leading-snug">
                                    <span className="font-semibold text-foreground">
                                      <span className="font-inter tabular-nums">{item.quantity}</span>×
                                    </span>{" "}
                                    <span className="font-medium text-foreground">
                                      {item.name}
                                    </span>
                                  </div>
                                  {customizations.length > 0 && (
                                    <div className="flex flex-col items-start gap-1 mt-1 pl-3.5">
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
                                            className="max-w-full text-xs leading-normal text-muted-foreground break-words whitespace-normal"
                                          >
                                            {stepName ? (
                                              <span className="font-medium text-foreground/80">
                                                {stepName}:{" "}
                                              </span>
                                            ) : null}
                                            <span>{optName}</span>
                                            {typeof c.extraPrice === "number" && c.extraPrice > 0 && (
                                              <>
                                                {" "}
                                                <span className="text-muted-foreground/80 font-normal whitespace-nowrap">
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
                              );
                            })}
                          </div>
                        </td>
                        <td className="text-right font-medium whitespace-nowrap min-w-[110px] py-3 px-4">
                          <div className="flex flex-col items-end">
                            <Price cents={order.total} />
                            {order.refundStatus && order.refundStatus !== "none" && (
                              <span className="text-[11px] text-amber-700 font-semibold">
                                {order.refundStatus === "full"
                                  ? isDe
                                    ? "Erstattet"
                                    : "Refunded"
                                  : isDe
                                    ? "Teilerstattet"
                                    : "Partial refund"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap min-w-[140px] py-3 px-4">
                          {order.posStatus === "recorded" ? (
                            <Badge variant="success">
                              <Check className="size-3" weight="bold" aria-hidden="true" />
                              <span>{isDe ? "In Kasse erfasst" : "Recorded in POS"}</span>
                            </Badge>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={recordingOrderId === order.$id}
                              onClick={() => handleRecordPos(order)}
                            >
                              <Check className="size-3" weight="bold" aria-hidden="true" />
                              <span>{isDe ? "In Kasse erfasst" : "Record in POS"}</span>
                            </Button>
                          )}
                        </td>
                        <td className="whitespace-nowrap min-w-[130px] py-3 px-4">
                          <Badge variant={statusVariants[order.status] || "neutral"}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="text-right whitespace-nowrap py-3 pr-4 pl-3 w-[200px] min-w-[200px]">
                          <div className="flex items-center justify-end gap-2">
                            {canRefund && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setOrderToRefund(order);
                                  setRefundAmountEur(
                                    ((order.total - (order.refundedCents || 0)) / 100)
                                      .toFixed(2)
                                      .replace(".", ","),
                                  );
                                }}
                              >
                                {isDe ? "Erstattung" : "Refund"}
                              </Button>
                            )}
                            {isCancellable ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setOrderToCancel(order)}
                              >
                                <ReceiptX className="size-3.5" weight="bold" aria-hidden="true" />
                                <span>{t("cancelOrder")}</span>
                              </Button>
                            ) : !canRefund ? (
                              <span className="text-muted-foreground text-xs select-none pr-3">
                                —
                              </span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination & Items Per Page Controls */}
        <div className="mt-4 flex flex-col @min-[700px]:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <label htmlFor="orders-per-page">{t("itemsPerPage")}</label>
            <select
              id="orders-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-[var(--zk-border-strong)] bg-[var(--zk-surface)] px-2.5 py-1.5 text-sm font-medium text-[var(--zk-text)]"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Zurück
              </Button>
              <span className="text-sm font-medium tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Weiter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      <Modal
        open={!!orderToCancel}
        onOpenChange={(open: boolean) => !open && setOrderToCancel(null)}
        title={
          orderToCancel
            ? t("cancelOrderTitle", {
                orderNumber: orderToCancel.orderNumber,
              })
            : t("cancelOrderTitleFallback")
        }
        closeLabel={t("close")}
        footer={
          <>
            <Button
              variant="secondary"
              size="lg"
              disabled={isCancelling}
              onClick={() => setOrderToCancel(null)}
            >
              {t("abortCancel")}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              disabled={isCancelling}
              loading={isCancelling}
              onClick={() => {
                if (orderToCancel) {
                  handleCancelOrder(orderToCancel);
                }
              }}
            >
              {t("confirmCancelOrder")}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--zk-error-text)] font-medium">
          {t("cancelOrderWarning")}
        </p>
      </Modal>

      {/* Full / Partial Refund Modal with Proportional 2% Fee Reversal */}
      <Modal
        open={!!orderToRefund}
        onOpenChange={(open: boolean) => !open && setOrderToRefund(null)}
        title={
          isDe
            ? `Rückerstattung #${orderToRefund?.orderNumber || ""}`
            : `Refund #${orderToRefund?.orderNumber || ""}`
        }
        closeLabel={t("close")}
        footer={
          <>
            <Button
              variant="secondary"
              size="lg"
              disabled={isRefunding}
              onClick={() => setOrderToRefund(null)}
            >
              {t("abortCancel")}
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={isRefunding}
              loading={isRefunding}
              onClick={handleRefundOrder}
            >
              {isDe ? "Jetzt erstatten" : "Process refund"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--zk-text-secondary)] leading-relaxed">
            {isDe
              ? "Die Rückerstattung erfolgt direkt über dein verbundenes Stripe-Händlerkonto. Die 2 % Zackisch-Provision wird anteilig auf den erstatteten Warenwert automatisch gutgeschrieben."
              : "The refund is processed on your connected Stripe account. The 2% Zackisch fee is proportionally reversed on the refunded goods value."}
          </p>
          <TextField
            label={isDe ? "Erstattungsbetrag in EUR" : "Refund amount in EUR"}
            value={refundAmountEur}
            onChange={setRefundAmountEur}
            placeholder="0,00"
          />
        </div>
      </Modal>
    </div>
  );
}
