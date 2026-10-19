"use client";

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaretDown, CaretUp, SlidersHorizontal } from "@phosphor-icons/react";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/ui/price";
import { toast } from "sonner";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  toggleMenuItemAvailability,
  toggleCustomizationAvailabilityAction,
} from "@/actions/menu-actions";
import type { MenuCategory, MenuItem, CustomizationStep } from "@/lib/types";

interface AvailabilityContentProps {
  categories: MenuCategory[];
  items: MenuItem[];
  businessId?: string;
}

function parseCustomizations(customizations?: string): CustomizationStep[] {
  if (!customizations) return [];
  try {
    const parsed = JSON.parse(customizations);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function useIsTwoColumns(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [isTwoColumns, setIsTwoColumns] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsTwoColumns(entry.contentRect.width >= 700);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return isTwoColumns;
}

export function AvailabilityContent({
  categories,
  items: initialItems,
  businessId,
}: AvailabilityContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(new Set());
  const pendingItemIdsRef = useRef(new Set<string>());
  const containerRef = useRef<HTMLDivElement>(null);
  const isTwoColumns = useIsTwoColumns(containerRef);

  const { leftCategories, rightCategories } = useMemo(() => {
    const left: MenuCategory[] = [];
    const right: MenuCategory[] = [];
    categories.forEach((cat, i) => {
      if (i % 2 === 0) left.push(cat);
      else right.push(cat);
    });
    return { leftCategories: left, rightCategories: right };
  }, [categories]);

  const business = useQuery(
    api.businesses.getPublicRestaurant,
    businessId ? { id: businessId as Id<"businesses"> } : "skip"
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("token=")) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      window.history.replaceState({}, "", cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""));
    }
  }, []);

  useEffect(() => {
    if (businessId && business === null) {
      router.push("/");
    }
  }, [businessId, business, router]);

  const runAvailabilityChange = useCallback(async (
    itemId: string,
    action: () => Promise<{ success?: boolean; error?: string }>,
    apply: () => void,
  ) => {
    if (pendingItemIdsRef.current.has(itemId)) return;
    pendingItemIdsRef.current.add(itemId);
    setPendingItemIds(new Set(pendingItemIdsRef.current));
    try {
      const result = await action();
      if (result.success) apply();
      else toast.error(result.error || t("error"));
    } catch {
      toast.error(t("error"));
    } finally {
      pendingItemIdsRef.current.delete(itemId);
      setPendingItemIds(new Set(pendingItemIdsRef.current));
    }
  }, [t]);

  const handleToggleItem = useCallback(
    (itemId: string, available: boolean) => {
      void runAvailabilityChange(itemId, () => toggleMenuItemAvailability(itemId, available, businessId), () => {
        setItems((prevItems) =>
        prevItems.map((i) => {
          if (i.$id !== itemId) return i;
          if (i.customizations) {
            try {
              const steps = parseCustomizations(i.customizations);
              const updatedSteps = steps.map((step) => ({
                ...step,
                available,
                options: (step.options || []).map((opt) => ({
                  ...opt,
                  available,
                })),
              }));
              return {
                ...i,
                available,
                customizations: JSON.stringify(updatedSteps),
              };
            } catch {
              return { ...i, available };
            }
          }
          return { ...i, available };
        }),
        );
      });
    },
    [businessId, runAvailabilityChange],
  );

  const handleToggleCustomization = useCallback(
    (
      itemId: string,
      stepId: string,
      optionId: string | null,
      available: boolean,
    ) => {
      void runAvailabilityChange(itemId, () => toggleCustomizationAvailabilityAction(itemId, stepId, optionId, available, businessId), () => {
        setItems((prevItems) =>
        prevItems.map((i) => {
          if (i.$id !== itemId) return i;
          const steps = parseCustomizations(i.customizations);
          const updatedSteps = steps.map((step) => {
            const currentStepId = step.id || (step as any).$id;
            if (currentStepId !== stepId) return step;
            if (!optionId) {
              // Toggle entire step and cascade to all its options automatically
              const updatedOptions = (step.options || []).map((opt) => ({
                ...opt,
                available,
              }));
              return { ...step, available, options: updatedOptions };
            } else {
              // Toggle specific option (only if step is not disabled)
              if (step.available === false && available === true) return step;
              const updatedOptions = (step.options || []).map((opt) => {
                const currentOptId = opt.id || (opt as any).$id;
                return currentOptId === optionId ? { ...opt, available } : opt;
              });
              return { ...step, options: updatedOptions };
            }
          });
          return { ...i, customizations: JSON.stringify(updatedSteps) };
        }),
        );
      });
    },
    [businessId, runAvailabilityChange],
  );

  return (
    <div ref={containerRef} className="flex-1 space-y-4 pb-24 @container">
      {/* Sticky Page Header */}
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">
            {t("availability")}
          </h1>
        </div>
      </div>

      {/* Categories Grid utilizing horizontal space */}
      <div className="flex flex-col gap-6 w-full">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed rounded-xl">
            <p>{t("menuEmpty")}</p>
          </div>
        ) : isTwoColumns ? (
          <div className="flex gap-6 items-start w-full">
            {/* Left Column (Even Index: 0, 2, 4...) */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              {leftCategories.map((category) => {
                const categoryItems = items.filter(
                  (i) => i.categoryId === category.$id,
                );
                return (
                  <CategorySection
                    key={category.$id}
                    category={category}
                    items={categoryItems}
                    onToggleItem={handleToggleItem}
                    onToggleCustomization={handleToggleCustomization}
                    pendingItemIds={pendingItemIds}
                  />
                );
              })}
            </div>

            {/* Right Column (Odd Index: 1, 3, 5...) */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              {rightCategories.map((category) => {
                const categoryItems = items.filter(
                  (i) => i.categoryId === category.$id,
                );
                return (
                  <CategorySection
                    key={category.$id}
                    category={category}
                    items={categoryItems}
                    onToggleItem={handleToggleItem}
                    onToggleCustomization={handleToggleCustomization}
                    pendingItemIds={pendingItemIds}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {categories.map((category) => {
              const categoryItems = items.filter(
                (i) => i.categoryId === category.$id,
              );
              return (
                <CategorySection
                  key={category.$id}
                  category={category}
                  items={categoryItems}
                  onToggleItem={handleToggleItem}
                  onToggleCustomization={handleToggleCustomization}
                  pendingItemIds={pendingItemIds}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  items,
  onToggleItem,
  onToggleCustomization,
  pendingItemIds,
}: {
  category: MenuCategory;
  items: MenuItem[];
  onToggleItem: (id: string, available: boolean) => void;
  onToggleCustomization: (
    itemId: string,
    stepId: string,
    optionId: string | null,
    available: boolean,
  ) => void;
  pendingItemIds: Set<string>;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();

  return (
    <Card className="transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2 gap-4 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            className="text-lg font-semibold text-foreground text-left bg-transparent border-0 p-0 cursor-pointer min-w-0 flex-1 break-words"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {category.name}
          </button>
          <Badge className="w-6 h-6 min-w-6 aspect-square rounded-full p-0 flex items-center justify-center bg-primary text-secondary font-bold text-xs shrink-0 font-inter tabular-nums leading-none">
            {items.length}
          </Badge>
        </div>

        <div className="flex items-center justify-end gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full text-muted-foreground hover:text-foreground shrink-0"
            title={isExpanded ? t("collapse") : t("expand")}
          >
            {isExpanded ? (
              <CaretUp className="h-4 w-4" weight="bold" />
            ) : (
              <CaretDown className="h-4 w-4" weight="bold" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 p-3 sm:p-4 sm:pt-0">
          <div className="flex flex-col gap-2.5 p-1.5 rounded-lg">
            {items.length === 0 ? (
              <div className="py-6 text-center flex flex-col items-center justify-center gap-1 border border-dashed rounded-lg bg-muted/10">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("noItems")}
                </p>
              </div>
            ) : (
              <ItemsList
                items={items}
                onToggleItem={onToggleItem}
                onToggleCustomization={onToggleCustomization}
                pendingItemIds={pendingItemIds}
              />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function ItemsList({
  items,
  onToggleItem,
  onToggleCustomization,
  pendingItemIds,
}: {
  items: MenuItem[];
  onToggleItem: (id: string, available: boolean) => void;
  onToggleCustomization: (
    itemId: string,
    stepId: string,
    optionId: string | null,
    available: boolean,
  ) => void;
  pendingItemIds: Set<string>;
}) {
  return (
    <div className="grid grid-cols-1 min-[1900px]:grid-cols-2 gap-3">
      {items.map((item) => (
        <ItemCardView
          key={item.$id}
          item={item}
          onToggleItem={onToggleItem}
          onToggleCustomization={onToggleCustomization}
          pending={pendingItemIds.has(item.$id)}
        />
      ))}
    </div>
  );
}

function ItemCardView({
  item,
  onToggleItem,
  onToggleCustomization,
  pending,
}: {
  item: MenuItem;
  onToggleItem: (id: string, available: boolean) => void;
  onToggleCustomization: (
    itemId: string,
    stepId: string,
    optionId: string | null,
    available: boolean,
  ) => void;
  pending: boolean;
}) {
  const steps = parseCustomizations(item.customizations);
  const [showOptions, setShowOptions] = useState(false);
  const { t } = useTranslation();

  const imageUrl = useMemo(
    () => item.imageUrl || (item.imageId ? getImagePreviewUrl(item.imageId) : null),
    [item.imageUrl, item.imageId]
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl border overflow-hidden transition-colors duration-150",
        item.available
          ? "bg-background border-border"
          : "bg-muted/40 border-dashed border-border/70 opacity-65"
      )}
    >
      {/* Top Image Banner matching menu & ordering page */}
      {imageUrl && (
        <div className="relative w-full h-40 sm:h-48 bg-muted border-b border-border/40 shrink-0">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className={cn(
              "object-cover transition-all",
              !item.available && "grayscale opacity-75"
            )}
            unoptimized
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4 gap-3">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span
              className={cn(
                "font-semibold text-base break-words",
                item.available
                  ? "text-foreground"
                  : "text-muted-foreground line-through decoration-muted-foreground/50"
              )}
            >
              {item.name}
            </span>
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
                {item.description}
              </p>
            )}
            <Price
              cents={item.price}
              from={hasPaidCustomizations(item.customizations)}
              className="text-sm font-bold text-foreground mt-0.5"
            />
          </div>

          {/* Main Item Switch & Customization Badge */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {steps.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-primary/40 text-primary bg-primary/5 shrink-0"
              >
                <SlidersHorizontal className="w-3 h-3" weight="bold" />
                <span className="font-inter tabular-nums">{steps.length}</span>
              </Badge>
            )}
            <Switch
              checked={item.available}
              disabled={pending}
              onCheckedChange={(checked) => onToggleItem(item.$id, checked)}
              title={item.available ? t("itemAvailable") : t("itemSoldOut")}
            />
          </div>
        </div>

      {/* Customizations Section */}
      {steps.length > 0 && (
        <div className="pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center justify-between w-full py-1 hover:text-foreground transition-colors group cursor-pointer"
          >
            <span className="text-sm font-bold text-foreground">
              {t("customization")}
            </span>
            {showOptions ? (
              <CaretUp className="h-3.5 w-3.5 text-foreground" weight="bold" />
            ) : (
              <CaretDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" weight="bold" />
            )}
          </button>

          {showOptions && (
            <div className="mt-2 space-y-3">
              {steps.map((step, sIdx) => {
                const stepId = step.id || (step as any).$id || `step-${sIdx}`;
                const stepAvailable = item.available && step.available !== false;
                return (
                  <div key={stepId} className="space-y-2">
                    {/* Step Header Row */}
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {step.name}
                      </span>
                      <div className="flex items-center shrink-0">
                        <Switch
                          checked={stepAvailable}
                          disabled={pending || !item.available}
                          onCheckedChange={(checked) =>
                            onToggleCustomization(
                              item.$id,
                              stepId,
                              null,
                              checked,
                            )
                          }
                          title={t("toggleStepAvailability")}
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="pt-1 space-y-1 pl-3 border-l-2 border-border/50 ml-1">
                      {(step.options || []).map((opt, oIdx) => {
                        const optId =
                          opt.id || (opt as any).$id || `opt-${oIdx}`;
                        const optPrice =
                          typeof opt.extraPrice === "number"
                            ? opt.extraPrice
                            : typeof (opt as any).price === "number"
                            ? (opt as any).price
                            : 0;
                        const optAvailable =
                          item.available && stepAvailable && opt.available !== false;
                        return (
                          <div
                            key={optId}
                            className={cn(
                              "flex items-center justify-between gap-2 text-xs py-1 transition-opacity",
                              optAvailable ? "opacity-100" : "opacity-50"
                            )}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span
                                className={cn(
                                  "font-medium truncate",
                                  optAvailable
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {opt.name}
                              </span>
                              {optPrice > 0 && (
                                <span className="text-muted-foreground shrink-0 font-medium">
                                  (+<Price cents={optPrice} />)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center shrink-0">
                              <Switch
                                checked={optAvailable}
                                disabled={pending || !item.available || !stepAvailable}
                                onCheckedChange={(checked) =>
                                  onToggleCustomization(
                                    item.$id,
                                    stepId,
                                    optId,
                                    checked,
                                  )
                                }
                                title={t("toggleOptionAvailability")}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
