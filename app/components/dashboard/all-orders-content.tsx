"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import {
  Funnel,
  CaretDown,
  CaretUp,
  CaretUpDown,
  DownloadSimple,
  MagnifyingGlass,
  X,
  ReceiptX,
  Check,
} from "@phosphor-icons/react";
import { Price } from "@/components/ui/price";
import { useTranslation } from "@/lib/i18n";
import {
  exportOrdersCSVAction,
  updateOrderStatusAction,
  recordOrderInPosAction,
  refundOrderAction,
} from "@/actions/order-actions";
import { toast } from "sonner";
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

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  in_progress: "secondary",
  ready_for_pickup: "default",
  completed: "outline",
  cancelled: "destructive",
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

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue === undefined) return sortConfig.direction === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // 4. Pagination
  const totalItems = processedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = processedOrders.slice(startIndex, startIndex + itemsPerPage);

  function formatPrice(cents: number) {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  }

  const handleSort = (key: keyof Order | "items") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Order | "items") => {
    if (!sortConfig || sortConfig.key !== key)
      return (
        <CaretUpDown className="ml-1.5 h-4 w-4 text-muted-foreground shrink-0" />
      );
    return sortConfig.direction === "asc" ? (
      <CaretUp className="ml-1.5 h-3.5 w-3.5 shrink-0" weight="bold" />
    ) : (
      <CaretDown className="ml-1.5 h-3.5 w-3.5 shrink-0" weight="bold" />
    );
  };

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      in_progress: t("inProgress"),
      ready_for_pickup: t("ready"),
      completed: t("completed"),
      cancelled: t("cancelledOrder"),
    };
    return labels[status] || status;
  }

  function handleTypeToggle(type: string, checked: boolean) {
    if (checked) {
      setSelectedTypes((prev) => [...prev, type]);
    } else {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    }
    setCurrentPage(1);
  }

  function handleStatusToggle(status: string, checked: boolean) {
    if (checked) {
      setSelectedStatuses((prev) => [...prev, status]);
    } else {
      setSelectedStatuses((prev) => prev.filter((s) => s !== status));
    }
    setCurrentPage(1);
  }

  async function handleCancelOrder(order: Order) {
    if (isCancelling) return;
    if (order.status === "completed") {
      toast.error(t("cannotCancelCompleted"));
      setOrderToCancel(null);
      return;
    }

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

  return (
    <div className="flex-1 space-y-4 @container">
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">{t("allOrders")}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Controls Layout */}
        <div className="flex flex-col @min-[700px]:flex-row gap-3 @min-[700px]:items-center justify-between">
          <div className="flex items-center gap-2 flex-1 w-full @min-[700px]:w-auto @min-[700px]:max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                maxLength={100}
                className="pl-9 pr-9 bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                  title={t("clearSearch")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Multi-Select */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-between shrink-0 min-w-[110px] h-11 rounded-full font-semibold cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2">
                      <Funnel className="h-4 w-4 mr-2" />
                      {selectedTypes.length === 0 &&
                      selectedStatuses.length === 0 ? (
                        <span>{t("filters")}</span>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {selectedTypes.length + selectedStatuses.length}{" "}
                          {t("filters")}
                        </span>
                      )}
                    </div>
                    <CaretDown className="h-4 w-4 opacity-50" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("filterType")}</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("takeaway")}
                    onCheckedChange={(c) => handleTypeToggle("takeaway", c)}
                  >
                    {t("toPickUp")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("dine-in")}
                    onCheckedChange={(c) => handleTypeToggle("dine-in", c)}
                  >
                    {t("toTable")}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("filterStatus")}</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("in_progress")}
                    onCheckedChange={(c) =>
                      handleStatusToggle("in_progress", c)
                    }
                  >
                    {t("inProgress")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("ready_for_pickup")}
                    onCheckedChange={(c) =>
                      handleStatusToggle("ready_for_pickup", c)
                    }
                  >
                    {t("ready")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("completed")}
                    onCheckedChange={(c) => handleStatusToggle("completed", c)}
                  >
                    {t("completed")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("cancelled")}
                    onCheckedChange={(c) => handleStatusToggle("cancelled", c)}
                  >
                    {t("cancelledOrder")}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!hideExport && (
            <Button
              variant="default"
              onClick={handleExportCSV}
              className="w-full @min-[700px]:w-auto shrink-0 h-11 rounded-full font-semibold"
            >
              <DownloadSimple className="mr-2 h-4 w-4" weight="bold" />
              {t("exportCSV")}
            </Button>
          )}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table aria-label="Orders list">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap pl-4 sm:pl-6 pr-3 min-w-[90px]"
                    onClick={() => handleSort("$id")}
                  >
                    <div className="flex items-center">
                      {t("id")}
                      {renderSortIcon("$id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap px-3 min-w-[90px]"
                    onClick={() => handleSort("orderNumber")}
                  >
                    <div className="flex items-center">
                      {t("orderNumber")}
                      {renderSortIcon("orderNumber")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap px-3 min-w-[140px]"
                    onClick={() => handleSort("$createdAt")}
                  >
                    <div className="flex items-center">
                      {t("datetime")}
                      {renderSortIcon("$createdAt")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap px-3 min-w-[110px]"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      {t("type")}
                      {renderSortIcon("type")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[260px] max-w-[400px] px-4"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center">
                      {t("items")}
                      {renderSortIcon("items")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right whitespace-nowrap min-w-[110px] px-4"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center justify-end">
                      {t("total")}
                      {renderSortIcon("total")}
                    </div>
                  </TableHead>
                  <TableHead className="whitespace-nowrap min-w-[140px] px-4">
                    {isDe ? "Kassenstatus (POS)" : "POS Status"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap min-w-[130px] px-4"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      {t("status")}
                      {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap pr-4 sm:pr-6 pl-3 w-[200px] min-w-[200px]">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("noAllOrders")}
                    </TableCell>
                  </TableRow>
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
                      <TableRow
                        key={order.$id}
                        className={isCancelled ? "opacity-60 bg-muted/20" : ""}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap pl-4 sm:pl-6 pr-3 min-w-[90px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                type="button"
                                onClick={() => handleCopyOrderId(order.$id)}
                                className="cursor-pointer hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
                                aria-label={order.$id}
                              >
                                {order.$id.length > 8 ? order.$id.slice(-6) : order.$id}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{order.$id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-medium font-inter tabular-nums text-sm whitespace-nowrap px-3 min-w-[90px]">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm font-inter tabular-nums px-3 min-w-[140px]">
                          <span suppressHydrationWarning>
                            {dateFormatter.format(
                              new Date(order.$createdAt || order._creationTime || Date.now())
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-medium whitespace-nowrap px-3 min-w-[110px]">
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
                        </TableCell>
                        <TableCell className="text-sm whitespace-normal min-w-[260px] max-w-[400px] px-4 py-3">
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
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap min-w-[110px] px-4">
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
                        </TableCell>
                        <TableCell className="whitespace-nowrap min-w-[140px] px-4">
                          {order.posStatus === "recorded" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                              <Check className="w-3 h-3 shrink-0" weight="bold" />
                              {isDe ? "In Kasse erfasst" : "Recorded in POS"}
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={recordingOrderId === order.$id}
                              onClick={() => handleRecordPos(order)}
                              className="h-8 px-3 rounded-full text-xs font-semibold"
                            >
                              <Check className="w-3 h-3 mr-1 shrink-0" weight="bold" />
                              {isDe ? "In Kasse erfasst" : "Record in POS"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap min-w-[130px] px-4">
                          <Badge
                            variant={
                              isCancelled
                                ? undefined
                                : (statusVariants[order.status] as any)
                            }
                            className={
                              isCancelled
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent"
                                : ""
                            }
                          >
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap pr-4 sm:pr-6 pl-3 w-[200px] min-w-[200px]">
                          <div className="flex items-center justify-end gap-2">
                            {canRefund && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setOrderToRefund(order);
                                  setRefundAmountEur(
                                    ((order.total - (order.refundedCents || 0)) / 100)
                                      .toFixed(2)
                                      .replace(".", ","),
                                  );
                                }}
                                className="h-9 px-3 rounded-full text-xs font-semibold"
                              >
                                {isDe ? "Erstattung" : "Refund"}
                              </Button>
                            )}
                            {isCancellable ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrderToCancel(order)}
                                className="h-9 px-3.5 rounded-full text-xs font-semibold border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors cursor-pointer"
                              >
                                <ReceiptX className="w-3.5 h-3.5 mr-1.5 shrink-0" weight="bold" />
                                {t("cancelOrder")}
                              </Button>
                            ) : !canRefund ? (
                              <span className="text-muted-foreground text-xs select-none pr-3">
                                —
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination & Items Per Page Controls */}
        <div className="mt-4 flex flex-col @min-[700px]:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("itemsPerPage")}</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11 rounded-full px-4 w-[90px] justify-between font-semibold"
                  >
                    <span className="font-inter tabular-nums">{itemsPerPage}</span>
                    <CaretDown className="h-4 w-4 opacity-50" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {[10, 20, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    className="font-inter tabular-nums"
                    onClick={() => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                    }}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center flex-1">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    },
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {orderToCancel
                ? t("cancelOrderTitle", {
                    orderNumber: orderToCancel.orderNumber,
                  })
                : t("cancelOrderTitleFallback")}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <p className="text-sm text-destructive font-medium">
              {t("cancelOrderWarning")}
            </p>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isCancelling}
              className="w-full sm:flex-1 border-border"
              onClick={() => setOrderToCancel(null)}
            >
              {t("abortCancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isCancelling}
              className="w-full sm:flex-1"
              onClick={() => {
                if (orderToCancel) {
                  handleCancelOrder(orderToCancel);
                }
              }}
            >
              {t("confirmCancelOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full / Partial Refund Dialog with Proportional 2% Fee Reversal */}
      <Dialog
        open={!!orderToRefund}
        onOpenChange={(open) => !open && setOrderToRefund(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {isDe
                ? `Rückerstattung für Bestellung #${orderToRefund?.orderNumber || ""}`
                : `Refund for Order #${orderToRefund?.orderNumber || ""}`}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <DialogBody className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isDe
                ? "Die Rückerstattung erfolgt direkt über dein verbundenes Stripe-Händlerkonto. Die 2 % Zackisch-Provision wird anteilig auf den erstatteten Warenwert automatisch gutgeschrieben. Denke daran, auch den Storno-/Korrekturbeleg in deiner Kasse zu erfassen."
                : "The refund is processed on your connected Stripe account. The 2% Zackisch fee is proportionally reversed on the refunded goods value. Remember to record the corresponding POS reversal in your cash register."}
            </p>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {isDe ? "Erstattungsbetrag in EUR" : "Refund amount in EUR"}
              </label>
              <Input
                type="text"
                value={refundAmountEur}
                onChange={(e) => setRefundAmountEur(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isRefunding}
              className="w-full sm:flex-1 border-border"
              onClick={() => setOrderToRefund(null)}
            >
              {t("abortCancel")}
            </Button>
            <Button
              disabled={isRefunding}
              className="w-full sm:flex-1"
              onClick={handleRefundOrder}
            >
              {isDe ? "Jetzt erstatten" : "Process refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
