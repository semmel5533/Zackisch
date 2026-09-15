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
  WarningCircle,
  ReceiptX,
} from "@phosphor-icons/react";
import { Price } from "@/components/ui/price";
import { useTranslation } from "@/lib/i18n";
import { exportOrdersCSVAction, updateOrderStatusAction } from "@/actions/order-actions";
import { toast } from "sonner";
import type { Order } from "@/lib/types";

interface AllOrdersContentProps {
  orders: Order[];
  organizationId: string;
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
  organizationId,
  hideExport = false,
}: AllOrdersContentProps) {
  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

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
    if (order.status === "completed") {
      toast.error(t("cannotCancelCompleted"));
      setOrderToCancel(null);
      return;
    }

    const res = await updateOrderStatusAction(order.$id, "cancelled", organizationId);
    if (res?.error) {
      toast.error(res.error);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.$id === order.$id ? { ...o, status: "cancelled" } : o)),
      );
      toast.success(t("cancelledOrder"));
    }
    setOrderToCancel(null);
  }

  async function handleExportCSV() {
    const result = await exportOrdersCSVAction(organizationId);
    if (result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `zakkig-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="flex-1 space-y-4 @container">
      <div className="sticky top-0 z-30 pt-[22px] -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3 bg-background/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("allOrders")}</h1>
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
                className="pl-9 pr-9 bg-background h-11 rounded-full"
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
                    variant="default"
                    className="justify-between shrink-0 min-w-[110px] h-11 rounded-full font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <Funnel className="h-4 w-4 mr-2" />
                      {selectedTypes.length === 0 &&
                      selectedStatuses.length === 0 ? (
                        <span>{t("filters")}</span>
                      ) : (
                        <span className="text-primary-foreground font-semibold">
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
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap pl-4 sm:pl-6"
                    onClick={() => handleSort("$id")}
                  >
                    <div className="flex items-center">
                      {t("id")}
                      {renderSortIcon("$id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("orderNumber")}
                  >
                    <div className="flex items-center">
                      {t("orderNumber")}
                      {renderSortIcon("orderNumber")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("$createdAt")}
                  >
                    <div className="flex items-center">
                      {t("datetime")}
                      {renderSortIcon("$createdAt")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      {t("type")}
                      {renderSortIcon("type")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[200px] max-w-[340px]"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center">
                      {t("items")}
                      {renderSortIcon("items")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors text-right whitespace-nowrap"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center justify-end">
                      {t("total")}
                      {renderSortIcon("total")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      {t("status")}
                      {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap pr-4 sm:pr-6 w-[160px] min-w-[160px]">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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

                    return (
                      <TableRow
                        key={order.$id}
                        className={isCancelled ? "opacity-60 bg-muted/20" : ""}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap pl-4 sm:pl-6">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="cursor-help hover:text-foreground transition-colors">
                                {order.$id.slice(-6)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{order.$id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-medium font-inter tabular-nums text-sm">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm font-inter tabular-nums">
                          <span suppressHydrationWarning>
                            {dateFormatter.format(
                              new Date(order.$createdAt || order._creationTime || Date.now())
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
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
                        <TableCell className="text-sm min-w-[200px] max-w-[340px]">
                          <div className="flex flex-col gap-2 py-1">
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
                                          <span
                                            key={cIdx}
                                            className="inline-block max-w-full text-xs leading-normal text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md border border-border/40 break-words"
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
                                                  (+<Price cents={c.extraPrice} />)
                                                </span>
                                              </>
                                            )}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <Price cents={order.total} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isCancelled
                                ? undefined
                                : (statusVariants[order.status] as any)
                            }
                            className={
                              isCancelled
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent shadow-sm"
                                : ""
                            }
                          >
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap pr-4 sm:pr-6 w-[160px] min-w-[160px]">
                          {isCancellable ? (
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => setOrderToCancel(order)}
                              className="h-11 px-5 rounded-full text-sm font-semibold border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors cursor-pointer"
                            >
                              <ReceiptX className="w-4 h-4 mr-2 shrink-0" weight="bold" />
                              {t("cancelOrder")}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs select-none pr-3">
                              —
                            </span>
                          )}
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
                    className="h-11 rounded-full px-4 w-[90px] justify-between font-inter tabular-nums font-semibold"
                  >
                    {itemsPerPage}
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col">
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
              {orderToCancel
                ? t("cancelOrderTitle", {
                    orderNumber: orderToCancel.orderNumber,
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
    </div>
  );
}
