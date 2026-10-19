"use server";

import { revalidatePath } from "next/cache";
import {
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItem,
  getMenuCategories,
  updateCategorySortOrders,
  updateItemSortOrders,
} from "@/lib/convex/database";
import { uploadFileToConvex } from "@/lib/convex/storage";
import { getUser, requireOwner, requireStaffOrOwner } from "@/lib/convex/auth";
import { MAX_IMAGE_SIZE_BYTES, isAllowedImageFile } from "@/lib/constants";
import { parseDietaryLabels } from "@/lib/dietary-labels";
import type { CustomizationStep, MenuItem } from "@/lib/types";

export interface MenuActionState {
  error?: string;
  errorKey?: "invalidDietaryLabels";
  success?: boolean;
  categoryId?: string;
}

// Categories

export async function createCategoryAction(
  _prevState: MenuActionState,
  formData: FormData,
): Promise<MenuActionState> {
  const businessId = formData.get("businessId") as string;
  const name = formData.get("name") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!businessId) return { error: "Betriebs-ID fehlt." };
  if (!name) return { error: "Name ist erforderlich." };
  if (name.length > 100) return { error: "Der Kategoriename darf maximal 100 Zeichen lang sein." };

  try {
    const { user } = await requireOwner(businessId);

    const newDoc = await createMenuCategory({
      businessId,
      name,
      sortOrder,
      ownerId: user.$id || user._id,
    });

    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true, categoryId: newDoc.$id };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Kategorie konnte nicht erstellt werden.";
    return { error: message };
  }
}

export async function updateCategoryAction(
  _prevState: MenuActionState,
  formData: FormData,
): Promise<MenuActionState> {
  const categoryId = formData.get("categoryId") as string;
  const name = formData.get("name") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string);
  const businessId = formData.get("businessId") as string;

  if (!businessId) return { error: "Betriebs-ID fehlt." };
  if (!name) return { error: "Name ist erforderlich." };
  if (name.length > 100) return { error: "Der Kategoriename darf maximal 100 Zeichen lang sein." };

  try {
    await requireOwner(businessId);

    const categories = await getMenuCategories(businessId);
    if (!categories.some((c) => c.$id === categoryId)) {
      return { error: "Kategorie nicht gefunden oder unberechtigt." };
    }

    await updateMenuCategory(categoryId, {
      name,
      ...(isNaN(sortOrder) ? {} : { sortOrder }),
    });

    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Kategorie konnte nicht aktualisiert werden.";
    return { error: message };
  }
}

export async function deleteCategoryAction(
  categoryId: string,
  businessId: string,
) {
  try {
    await requireOwner(businessId);

    const categories = await getMenuCategories(businessId);
    if (!categories.some((c) => c.$id === categoryId)) {
      return { error: "Kategorie nicht gefunden oder unberechtigt." };
    }

    await deleteMenuCategory(categoryId);
    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Kategorie konnte nicht gelöscht werden.";
    return { error: message };
  }
}

export async function reorderCategoriesAction(
  businessId: string,
  orderedIds: string[],
) {
  try {
    await requireOwner(businessId);

    const updates = orderedIds.map((id, index) => ({
      id,
      sortOrder: index,
    }));
    await updateCategorySortOrders(updates);
    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Reihenfolge konnte nicht aktualisiert werden.";
    return { error: message };
  }
}

export async function reorderItemsAction(
  businessId: string,
  itemsPayload: (
    string | { id: string; sortOrder: number; categoryId?: string }
  )[],
) {
  try {
    await requireOwner(businessId);

    const updates = itemsPayload.map((item, index) => {
      if (typeof item === "string") {
        return { id: item, sortOrder: index };
      }
      return item;
    });
    await updateItemSortOrders(updates);
    revalidatePath(`/dashboard/${businessId}/menu`);
    revalidatePath(`/pickup/${businessId}`);
    revalidatePath(`/table/${businessId}`);
    revalidatePath(`/availability/${businessId}`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Reihenfolge konnte nicht aktualisiert werden.";
    return { error: message };
  }
}

// Menu Items

export async function createMenuItemAction(
  _prevState: MenuActionState,
  formData: FormData,
): Promise<MenuActionState> {
  const businessId = formData.get("businessId") as string;
  const categoryId = formData.get("categoryId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const rawPrice = ((formData.get("price") as string) || "").trim().replace(",", ".");
  const price = Math.round(parseFloat(rawPrice) * 100);
  const rawTax = ((formData.get("taxRate") as string) || "").trim().replace(",", ".");
  const taxRate = parseFloat(rawTax) || 19.0;
  const rawSortOrder = formData.get("sortOrder") as string;
  let sortOrder = parseInt(rawSortOrder);
  if (isNaN(sortOrder)) {
    const existingItems = await getMenuItems(businessId);
    const categoryItems = existingItems.filter(
      (i) => i.categoryId === categoryId,
    );
    const maxSortOrder = categoryItems.reduce(
      (max, i) =>
        typeof i.sortOrder === "number" && i.sortOrder > max
          ? i.sortOrder
          : max,
      -1,
    );
    sortOrder = maxSortOrder + 1;
  }
  const imageFile = formData.get("image") as File | null;
  const customizations = (formData.get("customizations") as string) || "[]";

  if (!businessId) return { error: "Betriebs-ID fehlt." };
  if (!name || isNaN(price)) {
    return { error: "Name und Preis sind erforderlich." };
  }
  if (name.length > 100) {
    return { error: "Der Artikelname darf maximal 100 Zeichen lang sein." };
  }
  if (description && description.length > 500) {
    return { error: "Die Beschreibung darf maximal 500 Zeichen lang sein." };
  }
  if (price < 0 || price > 10000000) {
    return { error: "Der Preis ist ungültig." };
  }

  if (imageFile && imageFile.size > 0) {
    if (!isAllowedImageFile(imageFile)) {
      return { error: "Nur Bilder im JPG- oder PNG-Format sind erlaubt." };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { error: "Das Bild darf maximal 10 MB groß sein." };
    }
  }

  try {
    const { user } = await requireOwner(businessId);

    const categories = await getMenuCategories(businessId);
    if (!categories.some((c) => c.$id === categoryId)) {
      return { error: "Kategorie nicht gefunden oder unberechtigt." };
    }

    const dietaryLabels = parseDietaryLabels(formData.getAll("dietaryLabels"));

    let imageStorageId: string | undefined = undefined;
    if (imageFile && imageFile.size > 0) {
      imageStorageId = await uploadFileToConvex(imageFile, businessId);
    }

    await createMenuItem({
      businessId,
      categoryId,
      name,
      description,
      price,
      imageStorageId,
      imageId: imageStorageId,
      sortOrder,
      ownerId: user.$id || user._id,
      taxRate,
      customizations,
      dietaryLabels,
    });

    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INVALID_DIETARY_LABELS") return { errorKey: "invalidDietaryLabels" };
    const message =
      error instanceof Error
        ? error.message
        : "Artikel konnte nicht erstellt werden.";
    return { error: message };
  }
}

export async function updateMenuItemAction(
  _prevState: MenuActionState,
  formData: FormData,
): Promise<MenuActionState> {
  const itemId = formData.get("itemId") as string;
  const businessId = formData.get("businessId") as string;
  const categoryId = formData.get("categoryId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const rawPrice = ((formData.get("price") as string) || "").trim().replace(",", ".");
  const price = Math.round(parseFloat(rawPrice) * 100);
  const hasAvailable = formData.has("available");
  const availableFromForm = formData.get("available") === "true";
  const rawTax = ((formData.get("taxRate") as string) || "").trim().replace(",", ".");
  const taxRate = parseFloat(rawTax) || 19.0;
  const imageFile = formData.get("image") as File | null;
  const existingImageId = formData.get("existingImageId") as string;
  const removeExistingImage = formData.get("removeImage") === "true";
  const customizations = (formData.get("customizations") as string) || "[]";

  if (!businessId) return { error: "Betriebs-ID fehlt." };
  if (!name || isNaN(price)) {
    return { error: "Name und Preis sind erforderlich." };
  }
  if (name.length > 100) {
    return { error: "Der Artikelname darf maximal 100 Zeichen lang sein." };
  }
  if (description && description.length > 500) {
    return { error: "Die Beschreibung darf maximal 500 Zeichen lang sein." };
  }
  if (price < 0 || price > 10000000) {
    return { error: "Der Preis ist ungültig." };
  }

  if (imageFile && imageFile.size > 0) {
    if (!isAllowedImageFile(imageFile)) {
      return { error: "Nur Bilder im JPG- oder PNG-Format sind erlaubt." };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { error: "Das Bild darf maximal 10 MB groß sein." };
    }
  }

  try {
    await requireOwner(businessId);

    const existingItem = await getMenuItem(itemId);
    if (!existingItem || existingItem.businessId !== businessId) {
      return { error: "Artikel nicht gefunden oder unberechtigt." };
    }

    if (categoryId) {
      const categories = await getMenuCategories(businessId);
      if (!categories.some((c) => c.$id === categoryId)) {
        return { error: "Kategorie nicht gefunden oder unberechtigt." };
      }
    }

    let sortOrder = existingItem.sortOrder;
    if (categoryId && categoryId !== existingItem.categoryId) {
      const existingItems = await getMenuItems(businessId);
      const targetCategoryItems = existingItems.filter(
        (i) => i.categoryId === categoryId,
      );
      const maxSortOrder = targetCategoryItems.reduce(
        (max, i) =>
          typeof i.sortOrder === "number" && i.sortOrder > max
            ? i.sortOrder
            : max,
        -1,
      );
      sortOrder = maxSortOrder + 1;
    }

    const dietaryLabels = parseDietaryLabels(formData.getAll("dietaryLabels"));

    let imageStorageId: string | undefined = existingImageId || undefined;

    if (removeExistingImage) {
      imageStorageId = undefined;
    } else if (imageFile && imageFile.size > 0) {
      imageStorageId = await uploadFileToConvex(imageFile, businessId);
    }

    await updateMenuItem(itemId, {
      categoryId: categoryId || undefined,
      sortOrder,
      name,
      description,
      price,
      available: hasAvailable ? availableFromForm : existingItem.available,
      imageStorageId,
      imageId: imageStorageId,
      clearImage: removeExistingImage,
      taxRate,
      customizations,
      dietaryLabels,
    });

    revalidatePath(`/dashboard/${businessId}/menu`);
    revalidatePath(`/pickup/${businessId}`);
    revalidatePath(`/table/${businessId}`);
    revalidatePath(`/availability/${businessId}`);
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INVALID_DIETARY_LABELS") return { errorKey: "invalidDietaryLabels" };
    const message =
      error instanceof Error
        ? error.message
        : "Artikel konnte nicht aktualisiert werden.";
    return { error: message };
  }
}

export async function deleteMenuItemAction(
  itemId: string,
  businessId: string,
  _imageId?: string,
) {
  try {
    await requireOwner(businessId);

    const existingItem = await getMenuItem(itemId);
    if (!existingItem || existingItem.businessId !== businessId) {
      return { error: "Artikel nicht gefunden oder unberechtigt." };
    }

    await deleteMenuItem(itemId);
    revalidatePath(`/dashboard/${businessId}/menu`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Artikel konnte nicht gelöscht werden.";
    return { error: message };
  }
}

export async function toggleMenuItemAvailability(
  itemId: string,
  available: boolean,
  businessId?: string,
) {
  try {
    const item = await getMenuItem(itemId);
    if (!item) return { error: "Artikel nicht gefunden." };
    if (businessId && item.businessId !== businessId) {
      return { error: "Nicht berechtigt." };
    }
    const resolvedBusinessId = item.businessId;

    await requireStaffOrOwner(resolvedBusinessId);

    const updates: Partial<MenuItem> = { available };

    if (item.customizations) {
      try {
        const steps: CustomizationStep[] = JSON.parse(item.customizations);
        if (Array.isArray(steps)) {
          const cascadedSteps = steps.map((step) => ({
            ...step,
            available,
            options: (step.options || []).map((opt) => ({
              ...opt,
              available,
            })),
          }));
          updates.customizations = JSON.stringify(cascadedSteps);
        }
      } catch {
        // ignore parse error
      }
    }

    await updateMenuItem(itemId, updates);
    if (resolvedBusinessId) {
      revalidatePath(`/dashboard/${resolvedBusinessId}/menu`);
      revalidatePath(`/availability/${resolvedBusinessId}`);
    }
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Verfügbarkeit konnte nicht geändert werden.";
    return { error: message };
  }
}

export async function toggleCustomizationAvailabilityAction(
  itemId: string,
  stepId: string,
  optionId: string | null,
  available: boolean,
  businessId?: string,
) {
  try {
    const item = await getMenuItem(itemId);
    if (!item) return { error: "Artikel nicht gefunden." };
    if (businessId && item.businessId !== businessId) {
      return { error: "Nicht berechtigt." };
    }
    const resolvedBusinessId = item.businessId;

    await requireStaffOrOwner(resolvedBusinessId);

    let steps: CustomizationStep[] = [];
    try {
      if (item.customizations) {
        steps = JSON.parse(item.customizations);
      }
    } catch {
      steps = [];
    }

    const updatedSteps = steps.map((step) => {
      const currentStepId = step.id || (step as any).$id;
      if (currentStepId !== stepId) return step;
      if (!optionId) {
        const updatedOptions = (step.options || []).map((opt) => ({
          ...opt,
          available,
        }));
        return { ...step, available, options: updatedOptions };
      } else {
        if (step.available === false && available === true) return step;
        const updatedOptions = (step.options || []).map((opt) => {
          const currentOptId = opt.id || (opt as any).$id;
          return currentOptId === optionId ? { ...opt, available } : opt;
        });
        return { ...step, options: updatedOptions };
      }
    });

    await updateMenuItem(itemId, {
      customizations: JSON.stringify(updatedSteps),
    });
    if (resolvedBusinessId) {
      revalidatePath(`/dashboard/${resolvedBusinessId}/menu`);
      revalidatePath(`/availability/${resolvedBusinessId}`);
    }
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Customization Verfügbarkeit konnte nicht geändert werden.";
    return { error: message };
  }
}
