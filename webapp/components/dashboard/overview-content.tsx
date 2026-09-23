"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useTransition,
  useOptimistic,
  useId,
} from "react";
import {
  Plus,
  Trash,
  LinkSimple,
  ChartLineUp,
  ShoppingBag,
  Printer,
  Scissors,
  CaretDown,
  ClipboardText,
  ForkKnife,
  Gear,
  Archive,
  CheckSquare,
  Check,
  DotsSixVertical,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/ui/price";
import {
  toggleFeatureAction,
  updateTablesAction,
} from "@/actions/settings-actions";
import { cn } from "@/lib/utils";
import type { Organization, Order } from "@/lib/types";
import { ReactQRCode } from "@lglab/react-qr-code";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const OverviewChart = dynamic(() => import("./overview-chart"), { ssr: false });

const handlePrint = () => {
  window.print();
};

function StyledQRCode({ value, size }: { value: string; size: number }) {
  const logoWidth = Math.round((157 * size) / 280);
  const logoHeight = Math.round((50 * size) / 280);

  return (
    <div className="w-full flex items-center justify-center bg-white [&_svg]:w-full [&_svg]:h-auto [&_svg]:block [&_svg]:[shape-rendering:crispEdges]">
      <ReactQRCode
        value={value}
        size={size}
        marginSize={0}
        level="H"
        background="#FFFFFF"
        dataModulesSettings={{ color: "#000000", style: "square-sm" }}
        finderPatternOuterSettings={{ color: "#000000", style: "square" }}
        finderPatternInnerSettings={{ color: "#000000", style: "square" }}
        imageSettings={{
          src: "https://www.zakkig.com/full_qr.png",
          height: logoHeight,
          width: logoWidth,
          excavate: true,
        }}
      />
    </div>
  );
}

function getInkMetrics(
  text: string,
  font: string = "700 100px Inter, sans-serif",
) {
  if (typeof document === "undefined") {
    const estWidth = Math.max(text.length * 50, 200);
    return {
      viewBox: `0 -75 ${estWidth} 80`,
      ascent: 75,
      descent: 5,
      height: 80,
      width: estWidth,
      left: 0,
      right: estWidth,
    };
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const estWidth = Math.max(text.length * 50, 200);
    return {
      viewBox: `0 -75 ${estWidth} 80`,
      ascent: 75,
      descent: 5,
      height: 80,
      width: estWidth,
      left: 0,
      right: estWidth,
    };
  }
  ctx.font = font;
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent || 75;
  const descent = m.actualBoundingBoxDescent || 5;
  const left = m.actualBoundingBoxLeft || 0;
  const right = m.actualBoundingBoxRight || m.width;
  const height = ascent + descent;
  const width = left + right;

  return {
    viewBox: `${-left} ${-ascent} ${width} ${height}`,
    ascent,
    descent,
    height,
    width,
    left,
    right,
  };
}

function InkScaledText({
  text,
  uppercase = true,
  className,
}: {
  text: string;
  uppercase?: boolean;
  className?: string;
}) {
  const displayText = uppercase ? text.toUpperCase() : text;
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState(() => {
    const estWidth = Math.max(displayText.length * 50, 200);
    return `0 -75 ${estWidth} 80`;
  });

  useEffect(() => {
    const update = () => {
      if (textRef.current) {
        try {
          const bbox = textRef.current.getBBox();
          const ink = getInkMetrics(displayText, "700 100px Inter, sans-serif");
          setViewBox(`${bbox.x} ${-ink.ascent} ${bbox.width} ${ink.height}`);
        } catch (e) {}
      }
    };
    update();
    if (document.fonts?.ready) {
      document.fonts.ready.then(update);
    }
  }, [displayText]);

  return (
    <svg
      viewBox={viewBox}
      className={cn("w-full block overflow-visible", className)}
    >
      <text
        ref={textRef}
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fill="currentColor"
        className="font-bold tracking-tighter font-inter tabular-nums"
        style={{ font: "700 100px Inter, sans-serif" }}
      >
        {displayText}
      </text>
    </svg>
  );
}

function InkConnectorText({
  text,
  fontSize = 24,
  className,
}: {
  text: string;
  fontSize?: number;
  className?: string;
}) {
  const displayText = text.toLowerCase();
  const font = `700 ${fontSize}px Poppins, sans-serif`;
  const [metrics, setMetrics] = useState(() => ({
    viewBox: `0 -${fontSize} ${displayText.length * fontSize} ${fontSize}`,
    height: fontSize,
    width: displayText.length * fontSize,
  }));

  useEffect(() => {
    const update = () => {
      const m = getInkMetrics(displayText, font);
      setMetrics({
        viewBox: m.viewBox,
        height: m.height,
        width: m.width,
      });
    };
    update();
    if (document.fonts?.ready) {
      document.fonts.ready.then(update);
    }
  }, [displayText, font]);

  const rawId = useId();
  const patternId = `wave-${rawId.replace(/:/g, "")}`;

  return (
    <div
      className={cn("flex items-center w-full gap-2 leading-none", className)}
    >
      <svg
        className="flex-1 h-[8px] overflow-hidden text-current scale-x-[-1]"
        style={{ minWidth: 16 }}
      >
        <defs>
          <pattern
            id={patternId}
            width="12"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 4 Q 3 1, 6 4 T 12 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="8" fill={`url(#${patternId})`} />
      </svg>
      <svg
        viewBox={metrics.viewBox}
        style={{ height: `${metrics.height}px`, width: `${metrics.width}px` }}
        className="block overflow-visible text-current shrink-0"
      >
        <text
          x="0"
          y="0"
          textAnchor="start"
          dominantBaseline="alphabetic"
          fill="currentColor"
          className="font-bold font-poppins lowercase"
          style={{ font }}
        >
          {displayText}
        </text>
      </svg>
      <svg
        className="flex-1 h-[8px] overflow-hidden text-current"
        style={{ minWidth: 16 }}
      >
        <rect width="100%" height="8" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

type TimePeriod = "24h" | "30d" | "90d";

function filterOrdersByPeriod(orders: Order[], period: TimePeriod): Order[] {
  const now = Date.now();
  const ms = {
    "24h": 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
  };
  return orders.filter(
    (o) =>
      now - new Date(o.$createdAt || o._creationTime || Date.now()).getTime() <
      ms[period],
  );
}

function SortableTableItem({
  tNum,
  isSelected,
  onToggle,
}: {
  tNum: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tNum });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "flex items-center justify-between border rounded-xl px-3 py-2.5 h-11 transition-colors cursor-pointer select-none gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "border-primary bg-primary text-primary-foreground font-semibold"
          : "hover:border-primary/50 bg-background text-foreground hover:bg-muted/30 font-medium",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "cursor-grab active:cursor-grabbing p-1 -ml-1 rounded transition-colors shrink-0 touch-none",
          isSelected
            ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
        title={t("reorder")}
      >
        <DotsSixVertical className="h-4 w-4" weight="bold" />
      </div>
      <span className="truncate text-center flex-1 text-sm font-semibold">
        {tNum}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function StatisticsCard({ orders, period, setPeriod, isMobile, mounted }: any) {
  const { t } = useTranslation();

  const filtered = filterOrdersByPeriod(orders, period);
  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, o: any) => sum + o.total, 0);

  const chartConfig = {
    orders: {
      label: t("sales"),
      color: "hsl(var(--primary))",
    },
  };

  const chartData = useMemo(() => {
    if (!mounted) return [];
    const now = new Date();
    const dataMap = new Map<string, { orders: number; revenue: number }>();

    if (period === "24h") {
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        dataMap.set(`${d.getHours()}:00`, { orders: 0, revenue: 0 });
      }
      filtered.forEach((o) => {
        const d = new Date(o.$createdAt || o._creationTime || Date.now());
        const key = `${d.getHours()}:00`;
        if (dataMap.has(key)) {
          const entry = dataMap.get(key)!;
          entry.orders++;
          entry.revenue += o.total / 100;
        }
      });
    } else {
      const days = period === "30d" ? 30 : 90;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = `${d.getDate()}.${d.getMonth() + 1}.`;
        dataMap.set(key, { orders: 0, revenue: 0 });
      }
      filtered.forEach((o) => {
        const d = new Date(o.$createdAt || o._creationTime || Date.now());
        const key = `${d.getDate()}.${d.getMonth() + 1}.`;
        if (dataMap.has(key)) {
          const entry = dataMap.get(key)!;
          entry.orders++;
          entry.revenue += o.total / 100;
        }
      });
    }

    return Array.from(dataMap.entries()).map(([time, data]) => ({
      time,
      orders: data.orders,
      revenue: data.revenue,
    }));
  }, [filtered, period, mounted]);

  const xAxisTicks = useMemo(() => {
    if (chartData.length === 0) return [];
    const numTicks = isMobile ? 4 : 8;
    const ticks = [];
    const step = Math.max(
      1,
      Math.floor((chartData.length - 1) / (numTicks - 1)),
    );

    for (let i = 0; i < numTicks; i++) {
      const idx = chartData.length - 1 - i * step;
      if (idx >= 0) {
        ticks.unshift(chartData[idx].time);
      }
    }
    return ticks;
  }, [chartData, isMobile]);

  return (
    <Card className="h-full flex flex-col print:hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-none">
            {t("statistics")}
          </h3>
          <InfoTooltip content={t("statisticsDesc" as any)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-11 rounded-full font-semibold px-4 cursor-pointer active:scale-[0.98]"
              >
                {period === "24h"
                  ? t("last24h")
                  : period === "30d"
                    ? t("last30d")
                    : t("last90d")}
                <CaretDown className="ml-1 h-4 w-4" weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPeriod("24h")}>
              {t("last24h")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("30d")}>
              {t("last30d")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("90d")}>
              {t("last90d")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-wrap gap-12 shrink-0">
            <div className="flex flex-col">
              <div className="text-3xl font-bold font-inter tabular-nums">
                {totalOrders}
              </div>
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {t("sales")}
              </div>
            </div>
            <div className="flex flex-col">
              <Price cents={totalRevenue} className="text-3xl font-bold" />
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {t("revenue")}
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[260px] sm:min-h-[280px] min-w-0 mt-4">
            <OverviewChart
              chartData={chartData}
              chartConfig={chartConfig}
              xAxisTicks={xAxisTicks}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QrCodeGeneratorCard({
  organization,
  baseUrl,
}: {
  organization: Organization;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const [qrType, setQrType] = useState<"pickup" | "table">("pickup");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [newTableInput, setNewTableInput] = useState("");
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [deleteTablesDialogOpen, setDeleteTablesDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [tables, setTables] = useState<string[]>(organization.tables || []);
  const [isToGoEnabled, setIsToGoEnabled] = useState(
    organization.isToGoEnabled ?? false,
  );
  const [isToStayEnabled, setIsToStayEnabled] = useState(
    organization.isToStayEnabled ?? false,
  );

  useEffect(() => {
    setTables(organization.tables || []);
  }, [organization.tables]);

  useEffect(() => {
    setIsToGoEnabled(organization.isToGoEnabled ?? false);
  }, [organization.isToGoEnabled]);

  useEffect(() => {
    setIsToStayEnabled(organization.isToStayEnabled ?? false);
  }, [organization.isToStayEnabled]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tables.indexOf(active.id as string);
      const newIndex = tables.indexOf(over.id as string);

      const previousTables = [...tables];
      const newTables = arrayMove(tables, oldIndex, newIndex);

      setTables(newTables);
      const result = await updateTablesAction(organization.$id, newTables);
      if (result.error) {
        toast.error(result.error as string);
        setTables(previousTables);
      }
    }
  };

  const handleToggleFeature = async (
    type: "pickup" | "table",
    checked: boolean,
  ) => {
    if (type === "pickup") {
      const prev = isToGoEnabled;
      setIsToGoEnabled(checked);
      const result = await toggleFeatureAction(organization.$id, type, checked);
      if (result.error) {
        toast.error(result.error as string);
        setIsToGoEnabled(prev);
      }
    } else {
      const prev = isToStayEnabled;
      setIsToStayEnabled(checked);
      const result = await toggleFeatureAction(organization.$id, type, checked);
      if (result.error) {
        toast.error(result.error as string);
        setIsToStayEnabled(prev);
      }
    }
  };

  const handleAddTable = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setIsAddingTable(false);
      setNewTableInput("");
      return;
    }
    if (trimmed.length > 4) {
      toast.error(t("tableTooLong"));
      return;
    }
    const currentTables = tables;
    if (currentTables.includes(trimmed)) {
      toast.error(t("tableExists"));
      setIsAddingTable(false);
      setNewTableInput("");
      return;
    }
    setNewTableInput("");
    setIsAddingTable(false);
    const updatedTables = [...currentTables, trimmed];
    setTables(updatedTables);
    startTransition(async () => {
      const result = await updateTablesAction(organization.$id, updatedTables);
      if (result.error) {
        toast.error(result.error as string);
        setTables(currentTables);
        setNewTableInput(trimmed);
      } else {
        setSelectedTables((prev) => [...prev, trimmed]);
      }
    });
  };

  const handleRemoveSelectedTables = () => {
    if (selectedTables.length === 0) return;
    setDeleteTablesDialogOpen(true);
  };

  const confirmRemoveTables = () => {
    setDeleteTablesDialogOpen(false);
    const currentTables = tables;
    const selectedTablesSet = new Set(selectedTables);
    const updatedTables = currentTables.filter(
      (t) => !selectedTablesSet.has(t),
    );
    setTables(updatedTables);
    startTransition(async () => {
      const result = await updateTablesAction(organization.$id, updatedTables);
      if (result.error) {
        toast.error(result.error as string);
        setTables(currentTables);
      } else {
        const count = selectedTablesSet.size;
        setSelectedTables([]);
        toast.success(count === 1 ? t("tableDeleted") : t("tablesDeleted"));
      }
    });
  };

  const toggleTableSelection = (tNum: string) => {
    setSelectedTables((prev) =>
      prev.includes(tNum) ? prev.filter((t) => t !== tNum) : [...prev, tNum],
    );
  };

  const qrUrl =
    qrType === "pickup"
      ? `${baseUrl}/pickup/${organization.$id}`
      : `${baseUrl}/table/${organization.$id}?table=${encodeURIComponent(selectedTables[0] || "1")}`;

  const isActive = qrType === "pickup" ? isToGoEnabled : isToStayEnabled;

  return (
    <>
      <Card className="h-full flex flex-col bg-white print:hidden @container">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-none whitespace-nowrap">
              {t("qrManagement")}
            </h3>
            <InfoTooltip content={t("qrManagementDesc" as any)} />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) =>
                handleToggleFeature(qrType, checked)
              }
              disabled={isPending}
              aria-label={qrType === "pickup" ? t("toGo") : t("toStay")}
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-auto h-11 rounded-full font-semibold px-4 shrink-0 cursor-pointer active:scale-[0.98]"
                  >
                    {qrType === "pickup" ? t("toGo") : t("toStay")}
                    <CaretDown
                      className="ml-2 h-4 w-4 shrink-0"
                      weight="bold"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setQrType("pickup")}>
                  {t("toGo")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setQrType("table")}>
                  {t("toStay")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4 flex-1 flex flex-col min-h-0">
          {qrType === "table" ? (
            <div className="grid grid-cols-1 @min-[500px]:grid-cols-2 gap-6 flex-1 min-h-0 items-start">
              {/* Left Column: Table Management */}
              <div className="flex-1 min-w-0 w-full flex flex-col gap-4 h-full min-h-0">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <Button
                    type="button"
                    variant={
                      selectedTables.length === tables.length &&
                      selectedTables.length > 0
                        ? "default"
                        : "outline"
                    }
                    disabled={tables.length === 0}
                    onClick={() => {
                      if (tables.length === 0) return;
                      if (selectedTables.length === tables.length) {
                        setSelectedTables([]);
                      } else {
                        setSelectedTables(tables);
                      }
                    }}
                    className={cn(
                      "h-11 rounded-full gap-2 font-semibold text-sm transition-colors w-full cursor-pointer active:scale-[0.98]",
                      selectedTables.length > 0 ? "sm:flex-1" : "",
                    )}
                  >
                    <span>{t("selectAll")}</span>
                  </Button>

                  {selectedTables.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleRemoveSelectedTables}
                      className="h-11 rounded-full gap-2 text-sm font-semibold border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors w-full sm:flex-1 shrink-0 cursor-pointer active:scale-[0.98]"
                    >
                      <Trash className="h-4 w-4 shrink-0" weight="bold" />
                      <span>
                        {selectedTables.length} {t("delete")}
                      </span>
                    </Button>
                  )}
                </div>

                <ScrollArea className="w-full h-[370px]">
                  <DndContext
                    id="tables-dnd-context"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={tables}
                      strategy={rectSortingStrategy}
                    >
                      {tables.length === 0 && !isAddingTable && (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-xl mb-3">
                          <p className="mb-4">{t("noTablesAdded")}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 pb-3">
                        {(() => {
                          const selectedTablesSet = new Set(selectedTables);
                          return tables.map((tNum) => (
                            <SortableTableItem
                              key={tNum}
                              tNum={tNum}
                              isSelected={selectedTablesSet.has(tNum)}
                              onToggle={() => toggleTableSelection(tNum)}
                            />
                          ));
                        })()}
                        <div className="col-span-1">
                          {isAddingTable ? (
                            <Input
                              autoFocus
                              placeholder={t("tableNr")}
                              value={newTableInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 4) setNewTableInput(val);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddTable(newTableInput);
                                } else if (e.key === "Escape") {
                                  setIsAddingTable(false);
                                  setNewTableInput("");
                                }
                              }}
                              onBlur={() => {
                                if (newTableInput) {
                                  handleAddTable(newTableInput);
                                } else {
                                  setIsAddingTable(false);
                                }
                              }}
                              maxLength={4}
                              className="w-full h-11 text-center text-sm font-medium border border-dashed border-primary rounded-xl focus-visible:ring-0"
                            />
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsAddingTable(true)}
                              className="w-full h-11 border border-dashed border-muted-foreground/40 hover:border-primary font-semibold text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2 transition-colors rounded-full cursor-pointer active:scale-[0.98]"
                            >
                              <Plus
                                className="h-4 w-4 shrink-0"
                                weight="bold"
                              />
                              <span className="truncate">
                                {t("addTableFull")}
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </SortableContext>
                  </DndContext>
                </ScrollArea>
              </div>

              {/* Right Column: QR Code Preview + Centered Print Button */}
              <div className="flex flex-col items-center justify-between gap-3 h-full min-h-0 w-full">
                <div className="w-full flex justify-center items-center">
                  <Button
                    onClick={handlePrint}
                    variant="default"
                    disabled={selectedTables.length === 0}
                    className="w-auto"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    {selectedTables.length > 1
                      ? t("printMultipleCodes", {
                          count: selectedTables.length,
                        })
                      : t("printQrCode")}
                  </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-2">
                  <div
                    className={cn(
                      "flex flex-col items-center w-full max-w-[240px] gap-0",
                      selectedTables.length === 0 ? "opacity-50 grayscale" : "",
                    )}
                  >
                    <div className="text-center w-[84%] mx-auto flex flex-col items-center gap-[10px]">
                      <InkScaledText
                        text={t("qrCodeTitleLine1")}
                        className="text-foreground"
                      />
                      <InkScaledText
                        text={t("qrCodeTitleLine2")}
                        className="text-foreground"
                      />
                      <InkConnectorText
                        text={t("qrCodeAt")}
                        fontSize={22}
                        className="text-foreground"
                      />
                      <InkScaledText
                        text={`${t("table")} ${selectedTables.length > 0 ? selectedTables[0] : "?"}`}
                        className="text-foreground"
                      />

                      <a
                        href={qrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-[2px] relative bg-white flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
                        title={t("openQrLink")}
                      >
                        <StyledQRCode value={qrUrl} size={195} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Pickup Mode: Centered QR Code Preview + Centered Print Button */
            <div className="flex flex-col items-center justify-center gap-3 flex-1 min-h-0 w-full my-auto">
              <div className="w-full flex justify-center items-center">
                <Button
                  onClick={handlePrint}
                  variant="default"
                  className="w-auto"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  {t("printQrCode")}
                </Button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-2">
                <div className="flex flex-col items-center w-full max-w-[240px] gap-0">
                  <div className="text-center w-[84%] mx-auto flex flex-col items-center gap-[10px]">
                    <InkScaledText
                      text={t("qrCodeTitleLine1")}
                      className="text-foreground"
                    />
                    <InkScaledText
                      text={t("qrCodeTitleLine2")}
                      className="text-foreground"
                    />
                    <InkConnectorText
                      text={t("qrCodeFor")}
                      fontSize={22}
                      className="text-foreground"
                    />
                    <InkScaledText
                      text={t("pickup")}
                      className="text-foreground"
                    />

                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-[2px] relative bg-white flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
                      title={t("openQrLink")}
                    >
                      <StyledQRCode value={qrUrl} size={195} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none print:static print:opacity-100 print:pointer-events-auto print:grid print:grid-cols-2 print:gap-y-4 print:gap-x-4 bg-white print:content-start">
        {qrType === "table" ? (
          selectedTables.map((tNum) => {
            const tableQrUrl = `${baseUrl}/table/${organization.$id}?table=${encodeURIComponent(tNum)}`;
            return (
              <div
                key={tNum}
                className="relative origin-top print-color-adjust-exact break-inside-avoid flex justify-center items-start"
              >
                <Card className="flex flex-col items-center justify-center p-4 bg-white print:ring-0 print:rounded-none w-max print:border print:border-dashed print:border-black/40">
                  <div className="flex flex-col items-center w-[230px] gap-0">
                    <div className="text-center w-[84%] mx-auto flex flex-col items-center gap-[10px]">
                      <InkScaledText
                        text={t("qrCodeTitleLine1")}
                        className="text-foreground"
                      />
                      <InkScaledText
                        text={t("qrCodeTitleLine2")}
                        className="text-foreground"
                      />
                      <InkConnectorText
                        text={t("qrCodeAt")}
                        fontSize={21}
                        className="text-foreground"
                      />
                      <InkScaledText
                        text={`${t("table")} ${tNum}`}
                        className="text-foreground"
                      />

                      <div className="w-full mt-[2px] relative bg-white flex items-center justify-center">
                        <StyledQRCode value={tableQrUrl} size={193} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="relative origin-top print-color-adjust-exact break-inside-avoid flex justify-center items-start">
            <Card className="flex flex-col items-center justify-center p-4 bg-white print:ring-0 print:rounded-none w-max print:border print:border-dashed print:border-black/40">
              <div className="flex flex-col items-center w-[230px] gap-0">
                <div className="text-center w-[84%] mx-auto flex flex-col items-center gap-[10px]">
                  <InkScaledText
                    text={t("qrCodeTitleLine1")}
                    className="text-foreground"
                  />
                  <InkScaledText
                    text={t("qrCodeTitleLine2")}
                    className="text-foreground"
                  />
                  <InkConnectorText
                    text={t("qrCodeFor")}
                    fontSize={21}
                    className="text-foreground"
                  />
                  <InkScaledText
                    text={t("pickup")}
                    className="text-foreground"
                  />

                  <div className="w-full mt-[2px] relative bg-white flex items-center justify-center">
                    <StyledQRCode value={qrUrl} size={193} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Dialog
        open={deleteTablesDialogOpen}
        onOpenChange={setDeleteTablesDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {selectedTables.length === 1
                ? t("deleteTableTitle")
                : t("deleteTablesTitle")}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {selectedTables.length === 1
                ? t("deleteTableDesc")
                : t("deleteTablesDesc")}
            </p>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTablesDialogOpen(false)}
              className="w-full sm:flex-1"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRemoveTables}
              className="w-full sm:flex-1"
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface OverviewContentProps {
  organization: Organization;
  orders: Order[];
  children?: React.ReactNode;
}

export function OverviewContent({
  organization,
  orders,
  children,
}: OverviewContentProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width < 768);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const baseUrl =
    mounted && typeof window !== "undefined"
      ? window.location.origin
      : "https://app.zakkig.com";

  return (
    <>
      <div ref={containerRef} className="flex-1 space-y-4 @container">
        <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">
              {t("overview")}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 @min-[1300px]:grid-cols-2 gap-4 print:block">
          <StatisticsCard
            orders={orders}
            period={period}
            setPeriod={setPeriod}
            isMobile={isMobile}
            mounted={mounted}
          />
          <QrCodeGeneratorCard organization={organization} baseUrl={baseUrl} />
        </div>

        {children ? (
          <div className="grid grid-cols-1 @min-[1100px]:grid-cols-2 gap-4 items-stretch print:hidden">
            <div className="h-full">
              {children}
            </div>
            <div className="grid grid-cols-1 @min-[500px]:grid-cols-2 gap-3 h-full">
              <Link
                href={`/dashboard/${organization.$id}/menu`}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                    <ForkKnife className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base leading-none text-foreground truncate">
                    {t("menu")}
                  </span>
                </div>
                <InfoTooltip content={t("quickMenuDesc")} />
              </Link>
              <Link
                href={`/dashboard/${organization.$id}/current-orders`}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                    <ClipboardText className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base leading-none text-foreground truncate">
                    {t("currentOrders")}
                  </span>
                </div>
                <InfoTooltip content={t("quickOrdersDesc")} />
              </Link>
              <Link
                href={`/dashboard/${organization.$id}/all-orders`}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                    <Archive className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base leading-none text-foreground truncate">
                    {t("allOrders")}
                  </span>
                </div>
                <InfoTooltip content={t("quickArchiveDesc")} />
              </Link>
              <Link
                href={`/dashboard/${organization.$id}/settings`}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                    <Gear className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base leading-none text-foreground truncate">
                    {t("settings")}
                  </span>
                </div>
                <InfoTooltip content={t("quickSettingsDesc")} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 @min-[500px]:grid-cols-2 @min-[1100px]:grid-cols-4 gap-4 print:hidden">
            <Link
              href={`/dashboard/${organization.$id}/menu`}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                  <ForkKnife className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base leading-none text-foreground truncate">
                  {t("menu")}
                </span>
              </div>
              <InfoTooltip content={t("quickMenuDesc")} />
            </Link>
            <Link
              href={`/dashboard/${organization.$id}/current-orders`}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                  <ClipboardText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base leading-none text-foreground truncate">
                  {t("currentOrders")}
                </span>
              </div>
              <InfoTooltip content={t("quickOrdersDesc")} />
            </Link>
            <Link
              href={`/dashboard/${organization.$id}/all-orders`}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                  <Archive className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base leading-none text-foreground truncate">
                  {t("allOrders")}
                </span>
              </div>
              <InfoTooltip content={t("quickArchiveDesc")} />
            </Link>
            <Link
              href={`/dashboard/${organization.$id}/settings`}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors h-full"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shrink-0">
                  <Gear className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base leading-none text-foreground truncate">
                  {t("settings")}
                </span>
              </div>
              <InfoTooltip content={t("quickSettingsDesc")} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
