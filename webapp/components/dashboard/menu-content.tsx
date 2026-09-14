"use client";

import {
  useState,
  useEffect,
  useTransition,
  useRef,
  memo,
  useMemo,
  useCallback,
} from "react";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  PencilSimple,
  Trash,
  Eye,
  EyeSlash,
  DotsSixVertical,
  SlidersHorizontal,
  CaretDown,
  CaretUp,
  Check,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { ItemWorkspace } from "./menu/item-workspace";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/ui/price";
import { getImagePreviewUrl } from "@/lib/convex/client";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  deleteMenuItemAction,
  toggleMenuItemAvailability,
  reorderCategoriesAction,
  reorderItemsAction,
} from "@/actions/menu-actions";
import type { MenuCategory, MenuItem, CustomizationStep } from "@/lib/types";

interface MenuContentProps {
  categories: MenuCategory[];
  items: MenuItem[];
  organizationId: string;
}

const EMPTY_ITEMS: MenuItem[] = [];

function useIsDesktop(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsDesktop(entry.contentRect.width >= 700);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);
  return isDesktop;
}

const customItemCollisionDetection: CollisionDetection = (args) => {
  // If dragging a category, only collide with other categories using closestCenter
  if (args.active.data.current?.type === "category") {
    const categoryContainers = args.droppableContainers.filter(
      (c) => c.data?.current?.type === "category",
    );
    return closestCenter({ ...args, droppableContainers: categoryContainers });
  }

  // If dragging an item:
  // 1. If pointer is within a category card, prioritize items in that category using closestCenter
  const pointerCollisions = pointerWithin(args);
  const overCategory = pointerCollisions.find((c) => {
    const container = args.droppableContainers.find((dc) => dc.id === c.id);
    return container?.data?.current?.type === "category";
  });

  if (overCategory) {
    const categoryContainer = args.droppableContainers.find(
      (dc) => dc.id === overCategory.id,
    );
    const categoryId = (categoryContainer?.data?.current?.category?.$id ||
      overCategory.id) as string;
    const categoryItemContainers = args.droppableContainers.filter(
      (c) =>
        c.data?.current?.type === "item" &&
        c.data?.current?.item?.categoryId === categoryId,
    );
    if (categoryItemContainers.length > 0) {
      const closest = closestCenter({
        ...args,
        droppableContainers: categoryItemContainers,
      });
      if (closest.length > 0) return closest;
    }
    return [overCategory];
  }

  // 2. Fallback to closestCenter on all items
  const itemContainers = args.droppableContainers.filter(
    (c) => c.data?.current?.type === "item",
  );
  if (itemContainers.length > 0) {
    const closest = closestCenter({ ...args, droppableContainers: itemContainers });
    if (closest.length > 0) return closest;
  }

  return rectIntersection(args);
};

export function MenuContent({
  categories: initialCategories,
  items: initialItems,
  organizationId,
}: MenuContentProps) {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop(containerRef);

  // Persistent client state for categories and items to eliminate drag & drop flickering
  const [categories, setCategories] = useState<MenuCategory[]>(() =>
    Array.from(
      new Map(
        [...initialCategories]
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((c) => [c.$id, c]),
      ).values(),
    ),
  );
  const [items, setItems] = useState<MenuItem[]>(() =>
    Array.from(
      new Map(
        [...initialItems]
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((i) => [i.$id, i]),
      ).values(),
    ),
  );

  useEffect(() => {
    setCategories(
      Array.from(
        new Map(
          [...initialCategories]
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((c) => [c.$id, c]),
        ).values(),
      ),
    );
    setItems(
      Array.from(
        new Map(
          [...initialItems]
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((i) => [i.$id, i]),
        ).values(),
      ),
    );
  }, [initialCategories, initialItems]);

  // Dialog & Sheet states
  const [showItemSheet, setShowItemSheet] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [autoEditCategoryId, setAutoEditCategoryId] = useState<string | null>(
    null,
  );
  const isCreatingCategoryRef = useRef(false);

  // Collapsed categories state (map of categoryId -> isCollapsed)
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  // Delete alert dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
    imageId?: string;
  } | null>(null);

  // DnD sensors
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

  // Memoized items mapped by category ID for zero-alloc prop stability
  const itemsByCategory = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    categories.forEach((cat) => {
      map[cat.$id] = [];
    });
    items.forEach((item) => {
      if (map[item.categoryId]) {
        map[item.categoryId].push(item);
      } else {
        map[item.categoryId] = [item];
      }
    });
    return map;
  }, [categories, items]);

  // Partition categories for masonry-like two column layout
  const { leftCategories, rightCategories } = useMemo(() => {
    const left: MenuCategory[] = [];
    const right: MenuCategory[] = [];
    categories.forEach((cat, i) => {
      if (i % 2 === 0) left.push(cat);
      else right.push(cat);
    });
    return { leftCategories: left, rightCategories: right };
  }, [categories]);

  // Active item or category for drag preview overlay
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(
    null,
  );

  const initialItemsRef = useRef<MenuItem[]>([]);

  // Handle Drag Start
  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === "item") {
      initialItemsRef.current = items;
      const item = items.find((i) => i.$id === event.active.id);
      if (item) setActiveItem(item);
    } else if (type === "category") {
      const cat = categories.find((c) => c.$id === event.active.id);
      if (cat) setActiveCategory(cat);
    }
  };

  // Handle Drag Cancel
  const handleDragCancel = () => {
    setActiveItem(null);
    setActiveCategory(null);
    if (initialItemsRef.current.length > 0) {
      setItems(initialItemsRef.current);
    }
  };

  // Handle Drag Over (live move only across different categories)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type !== "item") return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const overType = over.data.current?.type;

    // Only reorder live if hovering over another visible ITEM in a DIFFERENT category.
    // Intra-category sorting is handled automatically by @dnd-kit SortableContext transforms.
    if (overType !== "item") return;

    const overCategoryId = over.data.current?.item?.categoryId;
    if (!overCategoryId) return;

    setItems((prevItems) => {
      const activeIdx = prevItems.findIndex((i) => i.$id === activeId);
      if (activeIdx === -1) return prevItems;

      const activeItem = prevItems[activeIdx];
      const currentCatId = activeItem.categoryId;
      const overIdx = prevItems.findIndex((i) => i.$id === overId);
      if (overIdx === -1) return prevItems;

      // Cross-category item hover: move item to target category's SortableContext
      if (currentCatId !== overCategoryId) {
        const updated = [...prevItems];
        updated[activeIdx] = {
          ...updated[activeIdx],
          categoryId: overCategoryId,
        };
        return arrayMove(updated, activeIdx, overIdx);
      }

      // Intra-category sorting: do NOT modify items state during drag.
      // SortableContext handles CSS transform animations cleanly.
      return prevItems;
    });
  };

  // Handle Drag End (persist final category or item positions to Convex)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setActiveCategory(null);

    if (!over) return;

    const activeType = active.data.current?.type;

    if (activeType === "category") {
      if (active.id !== over.id) {
        const oldIndex = categories.findIndex((c) => c.$id === active.id);
        const newIndex = categories.findIndex((c) => c.$id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const previousCategories = [...categories];
          const newCategories = arrayMove(categories, oldIndex, newIndex);
          setCategories(newCategories);

          startTransition(async () => {
            const res = await reorderCategoriesAction(
              organizationId,
              newCategories.map((c) => c.$id),
            );
            if (res?.error) {
              toast.error(res.error);
              setCategories(previousCategories);
            }
          });
        }
      }
      return;
    }

    if (activeType === "item") {
      const activeId = active.id as string;
      const overId = over.id as string;
      const overType = over.data.current?.type;
      const overCategoryId =
        overType === "category"
          ? (over.data.current?.category?.$id || overId)
          : over.data.current?.item?.categoryId;

      let currentItems = [...items];
      const activeIdx = currentItems.findIndex((i) => i.$id === activeId);
      if (activeIdx === -1) return;

      const previousItems = [...items];
      const initialItem = initialItemsRef.current.find(
        (i) => i.$id === activeId,
      );
      const initialCatId = initialItem?.categoryId;

      // 1. Intra-category item drop or inter-item drop
      if (overType === "item") {
        if (initialCatId === overCategoryId) {
          // Intra-category: items state was not mutated during drag. Apply arrayMove now.
          if (activeId !== overId) {
            const overIdx = currentItems.findIndex((i) => i.$id === overId);
            if (overIdx !== -1) {
              currentItems = arrayMove(currentItems, activeIdx, overIdx);
            }
          }
        } else {
          // Cross-category: ensure target categoryId is updated on active item
          if (
            overCategoryId &&
            currentItems[activeIdx].categoryId !== overCategoryId
          ) {
            currentItems[activeIdx] = {
              ...currentItems[activeIdx],
              categoryId: overCategoryId,
            };
          }
        }
      }
      // 2. Drop onto category card directly (e.g. collapsed or empty category)
      else if (overType === "category" && overCategoryId) {
        if (currentItems[activeIdx].categoryId !== overCategoryId) {
          const catItems = currentItems.filter(
            (i) => i.categoryId === overCategoryId,
          );
          const lastCatItem =
            catItems.length > 0 ? catItems[catItems.length - 1] : null;
          const overIdx = lastCatItem
            ? currentItems.findIndex((i) => i.$id === lastCatItem.$id) + 1
            : currentItems.length;

          currentItems[activeIdx] = {
            ...currentItems[activeIdx],
            categoryId: overCategoryId,
          };
          currentItems = arrayMove(
            currentItems,
            activeIdx,
            Math.min(overIdx, currentItems.length - 1),
          );
        }
      }

      const updates: { id: string; sortOrder: number; categoryId: string }[] =
        [];
      categories.forEach((cat) => {
        const catItems = currentItems.filter((i) => i.categoryId === cat.$id);
        catItems.forEach((item, idx) => {
          updates.push({
            id: item.$id,
            sortOrder: idx,
            categoryId: cat.$id,
          });
        });
      });

      currentItems = currentItems.map((item) => {
        const u = updates.find((x) => x.id === item.$id);
        return u
          ? { ...item, sortOrder: u.sortOrder, categoryId: u.categoryId }
          : item;
      });
      setItems(currentItems);

      if (updates.length > 0) {
        startTransition(async () => {
          const res = await reorderItemsAction(organizationId, updates);
          if (res?.error) {
            toast.error(res.error);
            setItems(previousItems);
          }
        });
      }
    }
  };

  // In-place category creation handler
  async function openNewCategory() {
    if (isCreatingCategoryRef.current) return;
    isCreatingCategoryRef.current = true;

    const tempId = `temp-${Date.now()}`;
    const defaultName = t("newCategory");
    const newSortOrder = categories.length;

    const tempCategory: MenuCategory = {
      _id: tempId as any,
      _creationTime: Date.now(),
      $id: tempId,
      organizationId,
      name: defaultName,
      sortOrder: newSortOrder,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $databaseId: "",
      $collectionId: "",
    };

    setCategories((prev) => [...prev, tempCategory]);
    setCollapsedCategories((prev) => ({ ...prev, [tempId]: false }));
    setAutoEditCategoryId(tempId);

    const formData = new FormData();
    formData.append("organizationId", organizationId);
    formData.append("name", defaultName);
    formData.append("sortOrder", newSortOrder.toString());

    try {
      const res = await createCategoryAction({}, formData);
      if (res?.error) {
        toast.error(res.error);
        setCategories((prev) => prev.filter((c) => c.$id !== tempId));
        setAutoEditCategoryId(null);
      } else if (res?.categoryId) {
        const realId = res.categoryId;
        setCategories((prev) =>
          prev.map((c) => (c.$id === tempId ? { ...c, $id: realId } : c)),
        );
        setCollapsedCategories((prev) => {
          const next = { ...prev };
          delete next[tempId];
          next[realId] = false;
          return next;
        });
        setAutoEditCategoryId(realId);
      }
    } finally {
      isCreatingCategoryRef.current = false;
    }
  }

  const openNewItem = useCallback((categoryId: string) => {
    setEditingItem(null);
    setSelectedCategoryId(categoryId);
    setShowItemSheet(true);
  }, []);

  const openEditItem = useCallback((item: MenuItem) => {
    setEditingItem(item);
    setSelectedCategoryId(item.categoryId);
    setShowItemSheet(true);
  }, []);

  const toggleCategoryCollapse = useCallback((categoryId: string) => {
    setCollapsedCategories((prev) => {
      const isCurrentlyCollapsed = prev[categoryId] ?? true;
      return {
        ...prev,
        [categoryId]: !isCurrentlyCollapsed,
      };
    });
  }, []);

  const handleEditComplete = useCallback(() => {
    setAutoEditCategoryId(null);
  }, []);

  const handleDeleteCategory = useCallback((category: MenuCategory) => {
    setDeleteConfirm({
      type: "category",
      id: category.$id,
      name: category.name,
    });
  }, []);

  const handleDeleteItem = useCallback((item: MenuItem) => {
    setDeleteConfirm({
      type: "item",
      id: item.$id,
      name: item.name,
      imageId: item.imageId,
    });
  }, []);

  // Delete Action Confirmations
  async function confirmDelete() {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "category") {
      const res = await deleteCategoryAction(deleteConfirm.id, organizationId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(t("categoryDeleted"));
      }
    } else if (deleteConfirm.type === "item") {
      const res = await deleteMenuItemAction(
        deleteConfirm.id,
        organizationId,
        deleteConfirm.imageId,
      );
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(t("itemDeleted"));
      }
    }
    setDeleteConfirm(null);
  }

  const handleToggleAvailability = useCallback(
    (itemId: string, available: boolean) => {
      setItems((prevItems) =>
        prevItems.map((i) => {
          if (i.$id !== itemId) return i;
          if (i.customizations) {
            try {
              const steps = JSON.parse(i.customizations);
              if (Array.isArray(steps)) {
                const updatedSteps = steps.map((step: any) => ({
                  ...step,
                  available,
                  options: (step.options || []).map((opt: any) => ({
                    ...opt,
                    available,
                  })),
                }));
                return {
                  ...i,
                  available,
                  customizations: JSON.stringify(updatedSteps),
                };
              }
            } catch {
              return { ...i, available };
            }
          }
          return { ...i, available };
        }),
      );
      startTransition(async () => {
        const res = await toggleMenuItemAvailability(
          itemId,
          available,
          organizationId,
        );
        if (res?.error) {
          toast.error(res.error);
          // Rollback optimistic update
          setItems(initialItems);
        }
      });
    },
    [initialItems, organizationId],
  );

  return (
    <div ref={containerRef} className="flex-1 space-y-4 @container">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 pt-[22px] -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3 bg-background/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("menu")}</h1>
        </div>
      </div>

      {/* Categories Cards View */}
      {categories.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              {t("noCategories")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("noCategoriesHint")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={openNewCategory}
            className="border border-dashed border-muted-foreground/40 hover:border-primary font-semibold text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2 transition-colors cursor-pointer mt-2"
          >
            <Plus className="h-4 w-4 shrink-0" weight="bold" />
            <span>{t("addCategory")}</span>
          </Button>
        </div>
      ) : (
        <DndContext
          id="menu-dnd-context"
          sensors={sensors}
          collisionDetection={customItemCollisionDetection}
          autoScroll={{ threshold: { x: 0.05, y: 0.05 }, acceleration: 5 }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("categories")}
            </h3>
          </div>

          <SortableContext
            items={categories.map((c) => c.$id)}
            strategy={rectSortingStrategy}
          >
            {isDesktop ? (
              <div className="flex gap-6 items-start w-full">
                {/* Left Column (Even Index: 0, 2, 4...) */}
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                  {leftCategories.map((category) => (
                    <SortableCategoryCard
                      key={category.$id}
                      category={category}
                      categoryItems={
                        itemsByCategory[category.$id] || EMPTY_ITEMS
                      }
                      isCollapsed={collapsedCategories[category.$id] ?? true}
                      autoEditName={autoEditCategoryId === category.$id}
                      onEditComplete={handleEditComplete}
                      onToggleCollapse={toggleCategoryCollapse}
                      onDeleteCategory={handleDeleteCategory}
                      onNewItem={openNewItem}
                      onEditItem={openEditItem}
                      onDeleteItem={handleDeleteItem}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
                  {categories.length % 2 === 0 && (
                    <AddCategoryCardButton onClick={openNewCategory} />
                  )}
                </div>

                {/* Right Column (Odd Index: 1, 3, 5...) */}
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                  {rightCategories.map((category) => (
                    <SortableCategoryCard
                      key={category.$id}
                      category={category}
                      categoryItems={
                        itemsByCategory[category.$id] || EMPTY_ITEMS
                      }
                      isCollapsed={collapsedCategories[category.$id] ?? true}
                      autoEditName={autoEditCategoryId === category.$id}
                      onEditComplete={handleEditComplete}
                      onToggleCollapse={toggleCategoryCollapse}
                      onDeleteCategory={handleDeleteCategory}
                      onNewItem={openNewItem}
                      onEditItem={openEditItem}
                      onDeleteItem={handleDeleteItem}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
                  {categories.length % 2 === 1 && (
                    <AddCategoryCardButton onClick={openNewCategory} />
                  )}
                </div>
              </div>
            ) : (
              /* Mobile Layout (Single Column) */
              <div className="flex flex-col gap-6 w-full">
                {categories.map((category) => (
                  <SortableCategoryCard
                    key={category.$id}
                    category={category}
                    categoryItems={itemsByCategory[category.$id] || EMPTY_ITEMS}
                    isCollapsed={collapsedCategories[category.$id] ?? true}
                    autoEditName={autoEditCategoryId === category.$id}
                    onEditComplete={handleEditComplete}
                    onToggleCollapse={toggleCategoryCollapse}
                    onDeleteCategory={handleDeleteCategory}
                    onNewItem={openNewItem}
                    onEditItem={openEditItem}
                    onDeleteItem={handleDeleteItem}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}

                <AddCategoryCardButton onClick={openNewCategory} />
              </div>
            )}
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              duration: 150,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {activeItem ? (
              <div className="opacity-95 shadow-2xl scale-[1.02] border-2 border-primary rounded-xl overflow-hidden bg-background">
                <ItemRowView
                  item={activeItem}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onToggleAvailability={() => {}}
                />
              </div>
            ) : activeCategory ? (
              <CategoryCardOverlay
                category={activeCategory}
                categoryItems={
                  itemsByCategory[activeCategory.$id] || EMPTY_ITEMS
                }
                isCollapsed={collapsedCategories[activeCategory.$id] ?? true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Item Create/Edit Dual-Pane Workspace */}
      <ItemWorkspace
        open={showItemSheet}
        onOpenChange={setShowItemSheet}
        editingItem={editingItem}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        organizationId={organizationId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col">
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
              {deleteConfirm?.type === "category"
                ? t("confirmDeleteCategoryTitle", {
                    name: deleteConfirm?.name || "",
                  })
                : t("confirmDeleteItemTitle", {
                    name: deleteConfirm?.name || "",
                  })}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <div className="p-5 sm:p-6 space-y-4 text-sm text-zinc-900">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {deleteConfirm?.type === "category"
                ? t("confirmDeleteCategoryDesc", {
                    name: deleteConfirm?.name || "",
                  })
                : t("confirmDeleteItemDesc", {
                    name: deleteConfirm?.name || "",
                  })}
            </p>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:flex-1 rounded-full h-11 gap-2 font-semibold cursor-pointer active:scale-[0.98] transition-all"
            >
              <Trash className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("delete")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddCategoryCardButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="w-full h-[140px] rounded-xl border border-dashed border-muted-foreground/40 hover:border-primary font-semibold text-sm sm:text-base text-muted-foreground hover:text-primary hover:bg-primary/5 gap-2 transition-all cursor-pointer active:scale-[0.99]"
    >
      <Plus className="h-5 w-5 shrink-0" weight="bold" />
      <span>{t("addCategory")}</span>
    </Button>
  );
}

// Sortable Category Card

interface SortableCategoryCardProps {
  category: MenuCategory;
  categoryItems: MenuItem[];
  isCollapsed: boolean;
  autoEditName?: boolean;
  onEditComplete?: () => void;
  onToggleCollapse: (categoryId: string) => void;
  onDeleteCategory: (category: MenuCategory) => void;
  onNewItem: (categoryId: string) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onToggleAvailability: (itemId: string, available: boolean) => void;
}

const SortableCategoryCard = memo(function SortableCategoryCard({
  category,
  categoryItems,
  isCollapsed,
  autoEditName = false,
  onEditComplete,
  onToggleCollapse,
  onDeleteCategory,
  onNewItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
}: SortableCategoryCardProps) {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(autoEditName);
  const [nameVal, setNameVal] = useState(category.name);
  const [isSavingName, setIsSavingName] = useState(false);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: category.$id,
    data: { type: "category", category },
  });

  const { active } = useDndContext();
  const isDraggingItem = active?.data.current?.type === "item";

  // Sync nameVal when category.name changes (render-time update)
  const [prevCategoryName, setPrevCategoryName] = useState(category.name);
  if (category.name !== prevCategoryName) {
    setPrevCategoryName(category.name);
    setNameVal(category.name);
  }

  // Sync isEditingName when autoEditName changes (render-time update)
  const [prevAutoEditName, setPrevAutoEditName] = useState(autoEditName);
  if (autoEditName !== prevAutoEditName) {
    setPrevAutoEditName(autoEditName);
    if (autoEditName) {
      setIsEditingName(true);
    }
  }

  const handleSaveName = async () => {
    onEditComplete?.();
    const trimmed = nameVal.trim();
    if (!trimmed || trimmed === category.name) {
      setNameVal(category.name);
      setIsEditingName(false);
      return;
    }
    if (trimmed.length > 100) {
      toast.error(t("nameTooLong"));
      return;
    }
    setIsSavingName(true);
    const formData = new FormData();
    formData.append("categoryId", category.$id);
    formData.append("organizationId", category.organizationId);
    formData.append("name", trimmed);
    formData.append("sortOrder", category.sortOrder.toString());

    try {
      const res = await updateCategoryAction({}, formData);
      if (res?.error) {
        toast.error(res.error);
        setNameVal(category.name);
      }
    } finally {
      setIsSavingName(false);
      setIsEditingName(false);
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.$id, data: { type: "category", category } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        ref={setDroppableRef}
        className={cn(
          "transition-colors @container",
          isOver &&
            isDraggingItem &&
            (isCollapsed || categoryItems.length === 0) &&
            "ring-2 ring-primary bg-primary/5",
        )}
      >
        <CardHeader className="flex flex-col pb-2 gap-2 w-full">
          <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted text-muted-foreground transition-colors touch-none shrink-0"
              title={t("reorderCategories" as any)}
            >
              <DotsSixVertical className="h-5 w-5" weight="bold" />
            </button>
            {isEditingName ? (
              <div className="flex items-center gap-1.5 flex-1 max-w-xs">
                <Input
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") {
                      onEditComplete?.();
                      setNameVal(category.name);
                      setIsEditingName(false);
                    }
                  }}
                  autoFocus
                  maxLength={100}
                  disabled={isSavingName}
                  className="h-8 text-lg font-semibold px-2 py-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="h-8 w-8 text-primary hover:text-primary shrink-0"
                  title={t("save")}
                >
                  <Check className="h-4 w-4" weight="bold" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <button
                  type="button"
                  className="text-lg font-semibold text-foreground text-left bg-transparent border-0 p-0 cursor-pointer min-w-0 break-words hover:text-foreground/80 transition-colors"
                  onClick={() => onToggleCollapse(category.$id)}
                >
                  {category.name}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-colors cursor-pointer"
                  title="Kategoriename bearbeiten"
                >
                  <PencilSimple className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isEditingName && (
              <Badge className="w-6 h-6 min-w-6 aspect-square rounded-full p-0 flex items-center justify-center bg-primary text-secondary font-bold text-xs shrink-0 ml-auto font-inter tabular-nums leading-none">
                {categoryItems.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-1.5 shrink-0 border-t border-border/40 pt-2 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCollapse(category.$id)}
              className="rounded-full text-muted-foreground hover:text-foreground shrink-0"
              title={isCollapsed ? "Aufklappen" : "Einklappen"}
            >
              {isCollapsed ? (
                <CaretDown className="h-4 w-4" weight="bold" />
              ) : (
                <CaretUp className="h-4 w-4" weight="bold" />
              )}
            </Button>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="default"
                onClick={() => onDeleteCategory(category)}
                className="gap-2 font-medium border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
                title={t("delete")}
              >
                <Trash className="h-4 w-4 shrink-0" weight="bold" />
                <span>{t("delete")}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="pt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1.5 pt-1">
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                {t("items")}
              </span>
            </div>
            <SortableContext
              items={categoryItems.map((i) => i.$id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 @min-[1500px]:grid-cols-2 gap-2.5 min-h-[60px] p-1.5 transition-colors rounded-lg">
                {categoryItems.length === 0 ? (
                  <div className="col-span-full py-6 text-center flex flex-col items-center justify-center gap-1 border border-dashed rounded-lg bg-muted/10">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("noItems")}
                    </p>
                  </div>
                ) : (
                  categoryItems.map((item) => (
                    <SortableItemRow
                      key={item.$id}
                      item={item}
                      onEdit={onEditItem}
                      onDelete={onDeleteItem}
                      onToggleAvailability={onToggleAvailability}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            <Button
              type="button"
              variant="ghost"
              onClick={() => onNewItem(category.$id)}
              className="w-full border border-dashed border-muted-foreground/40 hover:border-primary font-semibold text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("addItem")}</span>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
});
// Sortable Item Row

interface ItemRowViewProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (available: boolean) => void;
  attributes?: Record<string, any>;
  listeners?: Record<string, any>;
  isDragging?: boolean;
  style?: React.CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
}

const ItemRowView = memo(function ItemRowView({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
  attributes,
  listeners,
  isDragging,
  style,
  setNodeRef,
}: ItemRowViewProps) {
  const { t } = useTranslation();

  // Parse customization step count
  let customizationStepCount = 0;
  try {
    const parsed: CustomizationStep[] = JSON.parse(item.customizations || "[]");
    if (Array.isArray(parsed)) customizationStepCount = parsed.length;
  } catch {}

  const imageUrl = useMemo(
    () => (item.imageId ? getImagePreviewUrl(item.imageId) : null),
    [item.imageId],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col h-full rounded-xl border overflow-hidden touch-none shadow-sm transition-all",
        isDragging
          ? "opacity-20 bg-muted/30 border-border/40"
          : !item.available
          ? "opacity-65 bg-muted/30 border-dashed border-border/70"
          : "opacity-100 bg-background hover:shadow-md",
      )}
    >
      {/* Top Image */}
      {imageUrl && (
        <div className="relative w-full h-40 sm:h-48 bg-muted border-b border-border/40 shrink-0">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className={cn(
              "object-cover transition-all",
              !item.available && "grayscale opacity-75",
            )}
            unoptimized
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex items-start p-3 sm:p-4 gap-3 flex-1">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0 touch-none mt-0.5"
          aria-label={t("reorder")}
          title={t("reorder")}
        >
          <DotsSixVertical className="h-5 w-5" weight="bold" />
        </button>

        {/* Content Column to right of handle */}
        <div className="flex flex-col flex-1 min-w-0 justify-between h-full gap-2">
          {/* Top section: Title, Switch, Description */}
          <div className="flex flex-col gap-2">
            {/* Row 1: Title on left, Badge & Switch on right */}
            <div className="flex items-start justify-between gap-2.5">
              <span
                className={cn(
                  "font-semibold text-base leading-snug break-words min-w-0 flex-1",
                  item.available ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
              </span>

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {customizationStepCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs gap-1 border-primary/40 text-primary bg-primary/5 shrink-0 px-2 py-0.5"
                  >
                    <SlidersHorizontal className="w-3 h-3" weight="bold" />
                    <span>{customizationStepCount}</span>
                  </Badge>
                )}
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) => onToggleAvailability(checked)}
                  title={item.available ? t("itemAvailable") : t("itemSoldOut")}
                />
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
                {item.description}
              </p>
            )}
          </div>

          {/* Row 2: Price on left, Actions on right */}
          <div className="flex items-center justify-between gap-3 pt-2 mt-auto">
            <Price
              cents={item.price}
              from={hasPaidCustomizations(item.customizations)}
              className="text-sm font-bold text-foreground shrink-0"
            />

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="rounded-full text-muted-foreground hover:text-foreground shrink-0"
                title={t("edit")}
              >
                <PencilSimple className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                className="rounded-full border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
                title={t("delete")}
              >
                <Trash className="h-4 w-4 shrink-0" weight="bold" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

interface SortableItemRowProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (itemId: string, available: boolean) => void;
}

const SortableItemRow = memo(function SortableItemRow(
  props: SortableItemRowProps,
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.item.$id,
    data: { type: "item", item: props.item },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging
      ? undefined
      : transition || "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    zIndex: isDragging ? 50 : undefined,
  };

  const handleEdit = useCallback(
    () => props.onEdit(props.item),
    [props.onEdit, props.item],
  );
  const handleDelete = useCallback(
    () => props.onDelete(props.item),
    [props.onDelete, props.item],
  );
  const handleToggle = useCallback(
    (available: boolean) =>
      props.onToggleAvailability(props.item.$id, available),
    [props.onToggleAvailability, props.item.$id],
  );

  return (
    <ItemRowView
      item={props.item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleAvailability={handleToggle}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
});

interface CategoryCardOverlayProps {
  category: MenuCategory;
  categoryItems: MenuItem[];
  isCollapsed: boolean;
}

function CategoryCardOverlay({
  category,
  categoryItems,
  isCollapsed,
}: CategoryCardOverlayProps) {
  const { t } = useTranslation();

  return (
    <Card className="w-full opacity-95 shadow-2xl scale-[1.02] border-2 border-primary rounded-xl overflow-hidden bg-background @container pointer-events-none">
      <CardHeader className="flex flex-col pb-2 gap-2 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
          <button
            type="button"
            className="cursor-grabbing p-1 rounded text-muted-foreground transition-colors touch-none shrink-0"
            title={t("reorderCategories" as any)}
          >
            <DotsSixVertical className="h-5 w-5" weight="bold" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-lg font-semibold text-foreground text-left bg-transparent border-0 p-0 min-w-0 break-words">
              {category.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground shrink-0"
              title="Kategoriename bearbeiten"
            >
              <PencilSimple className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="w-6 h-6 min-w-6 aspect-square rounded-full p-0 flex items-center justify-center bg-primary text-secondary font-bold text-xs shrink-0 ml-auto font-inter tabular-nums leading-none">
            {categoryItems.length}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-1.5 shrink-0 border-t border-border/40 pt-2 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground shrink-0"
            title={isCollapsed ? "Aufklappen" : "Einklappen"}
          >
            {isCollapsed ? (
              <CaretDown className="h-4 w-4" weight="bold" />
            ) : (
              <CaretUp className="h-4 w-4" weight="bold" />
            )}
          </Button>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="default"
              className="gap-2 font-medium border-border text-foreground shrink-0"
              title={t("delete")}
            >
              <Trash className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("delete")}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-2 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1.5 pt-1">
            <span className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("items")}
            </span>
          </div>
          <div className="grid grid-cols-1 @min-[1500px]:grid-cols-2 gap-2.5 min-h-[60px] p-1.5 transition-colors rounded-lg">
            {categoryItems.length === 0 ? (
              <div className="col-span-full py-6 text-center flex flex-col items-center justify-center gap-1 border border-dashed rounded-lg bg-muted/10">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("noItems")}
                </p>
              </div>
            ) : (
              categoryItems.map((item) => (
                <ItemRowView
                  key={item.$id}
                  item={item}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onToggleAvailability={() => {}}
                />
              ))
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full border border-dashed border-muted-foreground/40 font-semibold text-sm text-muted-foreground gap-2"
          >
            <Plus className="h-4 w-4 shrink-0" weight="bold" />
            <span>{t("addItem")}</span>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
