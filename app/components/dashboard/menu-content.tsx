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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  PencilSimple,
  Trash,
  DotsSixVertical,
  SlidersHorizontal,
  CaretDown,
  CaretUp,
  Check,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, Badge, SwitchField } from "@/components/ui/surfaces";
import { Modal } from "@/components/ui/modal";
import { ItemWorkspace } from "./menu/item-workspace";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/common/price";
import { getMenuItemImageUrl } from "@/lib/menu-images";
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
  businessId: string;
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
  if (args.active.data.current?.type === "category") {
    const categoryContainers = args.droppableContainers.filter(
      (c) => c.data?.current?.type === "category",
    );
    return closestCenter({ ...args, droppableContainers: categoryContainers });
  }

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
  businessId,
}: MenuContentProps) {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop(containerRef);

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

  const [showItemSheet, setShowItemSheet] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [autoEditCategoryId, setAutoEditCategoryId] = useState<string | null>(
    null,
  );
  const isCreatingCategoryRef = useRef(false);
  const pendingAvailabilityIdsRef = useRef(new Set<string>());

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
    imageId?: string;
  } | null>(null);

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

  const { leftCategories, rightCategories } = useMemo(() => {
    const left: MenuCategory[] = [];
    const right: MenuCategory[] = [];
    categories.forEach((cat, i) => {
      if (i % 2 === 0) left.push(cat);
      else right.push(cat);
    });
    return { leftCategories: left, rightCategories: right };
  }, [categories]);

  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(
    null,
  );

  const initialItemsRef = useRef<MenuItem[]>([]);

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

  const handleDragCancel = () => {
    setActiveItem(null);
    setActiveCategory(null);
    if (initialItemsRef.current.length > 0) {
      setItems(initialItemsRef.current);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type !== "item") return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const overType = over.data.current?.type;

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

      if (currentCatId !== overCategoryId) {
        const updated = [...prevItems];
        updated[activeIdx] = {
          ...updated[activeIdx],
          categoryId: overCategoryId,
        };
        return arrayMove(updated, activeIdx, overIdx);
      }

      return prevItems;
    });
  };

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
              businessId,
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

      if (overType === "item") {
        if (initialCatId === overCategoryId) {
          if (activeId !== overId) {
            const overIdx = currentItems.findIndex((i) => i.$id === overId);
            if (overIdx !== -1) {
              currentItems = arrayMove(currentItems, activeIdx, overIdx);
            }
          }
        } else {
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
      } else if (overType === "category" && overCategoryId) {
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
          const res = await reorderItemsAction(businessId, updates);
          if (res?.error) {
            toast.error(res.error);
            setItems(previousItems);
          }
        });
      }
    }
  };

  const moveCategory = useCallback((categoryId: string, direction: -1 | 1) => {
    const index = categories.findIndex((category) => category.$id === categoryId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= categories.length) return;
    const next = arrayMove(categories, index, target);
    setCategories(next);
    startTransition(async () => {
      try {
        const result = await reorderCategoriesAction(businessId, next.map((category) => category.$id));
        if (result?.error) {
          toast.error(result.error);
          setCategories(categories);
        }
      } catch {
        toast.error(t("error"));
        setCategories(categories);
      }
    });
  }, [categories, businessId, t]);

  const moveItem = useCallback((itemId: string, direction: -1 | 1) => {
    const item = items.find((entry) => entry.$id === itemId);
    if (!item) return;
    const siblings = items.filter((entry) => entry.categoryId === item.categoryId);
    const index = siblings.findIndex((entry) => entry.$id === itemId);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    const moved = arrayMove(siblings, index, target);
    const orderById = new Map(moved.map((entry, position) => [entry.$id, position]));
    const next = items.map((entry) =>
      entry.categoryId === item.categoryId
        ? { ...entry, sortOrder: orderById.get(entry.$id) ?? entry.sortOrder }
        : entry,
    ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setItems(next);
    const updates = next.map((entry) => ({ id: entry.$id, sortOrder: entry.sortOrder, categoryId: entry.categoryId }));
    startTransition(async () => {
      try {
        const result = await reorderItemsAction(businessId, updates);
        if (result?.error) {
          toast.error(result.error);
          setItems(items);
        }
      } catch {
        toast.error(t("error"));
        setItems(items);
      }
    });
  }, [items, businessId, t]);

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
      businessId,
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
    formData.append("businessId", businessId);
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

  async function confirmDelete() {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "category") {
      const res = await deleteCategoryAction(deleteConfirm.id, businessId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(t("categoryDeleted"));
      }
    } else if (deleteConfirm.type === "item") {
      const res = await deleteMenuItemAction(
        deleteConfirm.id,
        businessId,
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
      if (pendingAvailabilityIdsRef.current.has(itemId)) return;
      pendingAvailabilityIdsRef.current.add(itemId);
      void (async () => {
        try {
          const res = await toggleMenuItemAvailability(itemId, available, businessId);
          if (res?.error) {
            toast.error(res.error);
            return;
          }
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
        } catch {
          toast.error(t("error"));
        } finally {
          pendingAvailabilityIdsRef.current.delete(itemId);
        }
      })();
    },
    [businessId, t],
  );

  return (
    <div ref={containerRef} className="flex-1 space-y-4 @container">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">{t("menu")}</h1>
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
            variant="secondary"
            onClick={openNewCategory}
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

          <SortableContext
            items={categories.map((c) => c.$id)}
            strategy={rectSortingStrategy}
          >
            {isDesktop ? (
              <div className="flex gap-6 items-start w-full">
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
                      onMoveCategory={moveCategory}
                      onMoveItem={moveItem}
                      canMoveUp={categories.indexOf(category) > 0}
                      canMoveDown={categories.indexOf(category) < categories.length - 1}
                    />
                  ))}
                  {categories.length % 2 === 0 && (
                    <AddCategoryCardButton onClick={openNewCategory} />
                  )}
                </div>

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
                      onMoveCategory={moveCategory}
                      onMoveItem={moveItem}
                      canMoveUp={categories.indexOf(category) > 0}
                      canMoveDown={categories.indexOf(category) < categories.length - 1}
                    />
                  ))}
                  {categories.length % 2 === 1 && (
                    <AddCategoryCardButton onClick={openNewCategory} />
                  )}
                </div>
              </div>
            ) : (
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
                    onMoveCategory={moveCategory}
                    onMoveItem={moveItem}
                    canMoveUp={categories.indexOf(category) > 0}
                    canMoveDown={categories.indexOf(category) < categories.length - 1}
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
              <div className="opacity-95 scale-[1.02] border-2 border-primary rounded-xl overflow-hidden bg-background">
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
        businessId={businessId}
      />

      <Modal
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title={
          deleteConfirm?.type === "category"
            ? t("confirmDeleteCategoryTitle", {
                name: deleteConfirm?.name || "",
              })
            : t("confirmDeleteItemTitle", {
                name: deleteConfirm?.name || "",
              })
        }
        description={
          deleteConfirm?.type === "category"
            ? t("confirmDeleteCategoryDesc", {
                name: deleteConfirm?.name || "",
              })
            : t("confirmDeleteItemDesc", {
                name: deleteConfirm?.name || "",
              })
        }
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setDeleteConfirm(null)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={confirmDelete}
            >
              <Trash className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("delete")}</span>
            </Button>
          </div>
        }
      />
    </div>
  );
}

function AddCategoryCardButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      fullWidth
    >
      <Plus className="h-5 w-5 shrink-0" weight="bold" />
      <span>{t("addCategory")}</span>
    </Button>
  );
}

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
  onMoveCategory: (categoryId: string, direction: -1 | 1) => void;
  onMoveItem: (itemId: string, direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
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
  onMoveCategory,
  onMoveItem,
  canMoveUp,
  canMoveDown,
}: SortableCategoryCardProps) {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(autoEditName);
  const [nameVal, setNameVal] = useState(category.name);
  const [isSavingName, setIsSavingName] = useState(false);

  const { isOver } = useDroppable({
    id: category.$id,
    data: { type: "category", category },
  });

  const { active } = useDndContext();
  const isDraggingItem = active?.data.current?.type === "item";

  const [prevCategoryName, setPrevCategoryName] = useState(category.name);
  if (category.name !== prevCategoryName) {
    setPrevCategoryName(category.name);
    setNameVal(category.name);
  }

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
    formData.append("businessId", category.businessId);
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
        elevation="low"
        variant="default"
        padding={4}
        className={cn(
          "transition-colors @container",
          isOver &&
            isDraggingItem &&
            (isCollapsed || categoryItems.length === 0) &&
            "ring-2 ring-primary bg-primary/5",
        )}
      >
        <div className="flex flex-col pb-2 gap-2 w-full">
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
                <input
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
                  className="h-8 text-lg font-semibold px-2 py-0 border border-border rounded-lg bg-background text-foreground"
                />
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={t("save")}
                  onClick={handleSaveName}
                  disabled={isSavingName}
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
                  variant="ghost"
                  iconOnly
                  aria-label={t("editCategory")}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                >
                  <PencilSimple className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isEditingName && (
              <div className="ml-auto shrink-0">
                <Badge label={String(categoryItems.length)} variant="neutral" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-1.5 shrink-0 border-t border-border/40 pt-2 w-full">
            <Button
              variant="ghost"
              iconOnly
              aria-label={isCollapsed ? t("expand") : t("collapse")}
              onClick={() => onToggleCollapse(category.$id)}
            >
              {isCollapsed ? (
                <CaretDown className="h-4 w-4" weight="bold" />
              ) : (
                <CaretUp className="h-4 w-4" weight="bold" />
              )}
            </Button>

            <div className="flex items-center gap-1.5 shrink-0">
              {canMoveUp && (
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={t("moveUp")}
                  onClick={() => onMoveCategory(category.$id, -1)}
                >
                  <ArrowUp className="size-4" weight="bold" />
                </Button>
              )}
              {canMoveDown && (
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={t("moveDown")}
                  onClick={() => onMoveCategory(category.$id, 1)}
                >
                  <ArrowDown className="size-4" weight="bold" />
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => onDeleteCategory(category)}
              >
                <Trash className="h-4 w-4 shrink-0" weight="bold" />
                <span>{t("delete")}</span>
              </Button>
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="pt-2 flex flex-col gap-3">
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
                  categoryItems.map((item, index) => (
                    <SortableItemRow
                      key={item.$id}
                      item={item}
                      onEdit={onEditItem}
                      onDelete={onDeleteItem}
                      onToggleAvailability={onToggleAvailability}
                      onMove={onMoveItem}
                      canMoveUp={index > 0}
                      canMoveDown={index < categoryItems.length - 1}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            <Button
              variant="ghost"
              onClick={() => onNewItem(category.$id)}
              fullWidth
            >
              <Plus className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("addItem")}</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
});

interface ItemRowViewProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (available: boolean) => void;
  onMove?: (direction: -1 | 1) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
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
  onMove,
  canMoveUp,
  canMoveDown,
  attributes,
  listeners,
  isDragging,
  style,
  setNodeRef,
}: ItemRowViewProps) {
  const { t } = useTranslation();

  let customizationStepCount = 0;
  try {
    const parsed: CustomizationStep[] = JSON.parse(item.customizations || "[]");
    if (Array.isArray(parsed)) customizationStepCount = parsed.length;
  } catch {}

  const imageUrl = useMemo(
    () => getMenuItemImageUrl(item),
    [item],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col h-full rounded-xl border overflow-hidden touch-none transition-colors",
        isDragging
          ? "opacity-20 bg-muted/30 border-border/40"
          : !item.available
          ? "opacity-65 bg-muted/30 border-dashed border-border/70"
          : "opacity-100 bg-background hover:border-foreground/25",
      )}
    >
      {imageUrl && (
        <div className="relative w-full h-40 sm:h-48 bg-muted border-b border-border/40 shrink-0">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className={cn(
              "object-cover transition-[filter,opacity] duration-150",
              !item.available && "grayscale opacity-75",
            )}
            unoptimized
          />
        </div>
      )}

      <div className="flex items-start p-3 sm:p-4 gap-3 flex-1">
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

        <div className="flex flex-col flex-1 min-w-0 justify-between h-full gap-2">
          <div className="flex flex-col gap-2">
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
                    label={String(customizationStepCount)}
                    variant="info"
                    icon={<SlidersHorizontal className="w-3 h-3" weight="bold" />}
                  />
                )}
                <SwitchField
                  checked={item.available}
                  onCheckedChange={(checked) => onToggleAvailability(checked)}
                  label={item.available ? t("itemAvailable") : t("itemSoldOut")}
                  hideLabel
                  aria-label={item.available ? t("itemAvailable") : t("itemSoldOut")}
                />
              </div>
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 mt-auto">
            <Price
              cents={item.price}
              from={hasPaidCustomizations(item.customizations)}
              className="text-sm font-bold text-foreground shrink-0"
            />

            <div className="flex items-center gap-1.5 shrink-0">
              {onMove && canMoveUp && (
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={t("moveUp")}
                  onClick={() => onMove(-1)}
                >
                  <ArrowUp className="size-4" weight="bold" />
                </Button>
              )}
              {onMove && canMoveDown && (
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={t("moveDown")}
                  onClick={() => onMove(1)}
                >
                  <ArrowDown className="size-4" weight="bold" />
                </Button>
              )}
              <Button
                variant="ghost"
                iconOnly
                aria-label={t("edit")}
                onClick={onEdit}
              >
                <PencilSimple className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                iconOnly
                aria-label={t("delete")}
                onClick={onDelete}
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
  onMove: (itemId: string, direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
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
      onMove={(direction) => props.onMove(props.item.$id, direction)}
      canMoveUp={props.canMoveUp}
      canMoveDown={props.canMoveDown}
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
    <Card elevation="low" variant="default" padding={4} className="w-full opacity-95 scale-[1.02] border-2 border-primary rounded-xl overflow-hidden bg-background @container pointer-events-none">
      <div className="flex flex-col pb-2 gap-2 w-full">
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
              variant="ghost"
              iconOnly
              aria-label={t("editCategory")}
            >
              <PencilSimple className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-auto shrink-0">
            <Badge label={String(categoryItems.length)} variant="neutral" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5 shrink-0 border-t border-border/40 pt-2 w-full">
          <Button
            variant="ghost"
            iconOnly
            aria-label={isCollapsed ? t("expand") : t("collapse")}
          >
            {isCollapsed ? <CaretDown className="h-4 w-4" weight="bold" /> : <CaretUp className="h-4 w-4" weight="bold" />}
          </Button>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="danger"
            >
              <Trash className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("delete")}</span>
            </Button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="pt-2 flex flex-col gap-3">
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
            variant="ghost"
            fullWidth
          >
            <Plus className="h-4 w-4 shrink-0" weight="bold" />
            <span>{t("addItem")}</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
