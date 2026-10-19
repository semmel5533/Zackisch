import "server-only";

import { getAuthenticatedConvexClient, getOwnerCredentials } from "./auth";
import { cookies } from "next/headers";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type {
  Business,
  PublicRestaurant,
  MenuCategory,
  MenuItem,
  Order,
  OrderSession,
  AvailabilitySession,
  StaffSession,
  CreateBusinessData,
  CreateMenuCategoryData,
  CreateMenuItemData,
} from "@/lib/types";

// Helper to normalize Convex documents with $id and $createdAt aliases
function toBusiness(doc: any): Business {
  return {
    ...doc,
    $id: doc._id,
    $createdAt: new Date(doc._creationTime).toISOString(),
    logoFileId: doc.logoStorageId || "",
    logoUrl: doc.logoUrl || null,
    bannerFileId: doc.bannerStorageId || "",
    bannerUrl: doc.bannerUrl || null,
  };
}

function toCat(doc: any): MenuCategory {
  return {
    ...doc,
    $id: doc._id,
    $createdAt: new Date(doc._creationTime).toISOString(),
  };
}

function toItem(doc: any): MenuItem {
  return {
    ...doc,
    $id: doc._id,
    $createdAt: new Date(doc._creationTime).toISOString(),
    imageId: doc.imageStorageId || "",
    imageUrl: doc.imageUrl || null,
  };
}

function toOrder(doc: any): Order {
  const time = doc.createdAt || doc._creationTime;
  return {
    ...doc,
    createdAt: time,
    $id: doc._id,
    $createdAt: new Date(time).toISOString(),
  };
}

function toSession(doc: any): OrderSession {
  return {
    ...doc,
    $id: doc._id,
    $createdAt: new Date(doc._creationTime).toISOString(),
  };
}

function toStorageId(id?: string | null): Id<"_storage"> | undefined {
  if (!id || typeof id !== "string" || id.trim() === "") return undefined;
  return id as Id<"_storage">;
}

// Businesses

export async function getBusinessByOwner(
  ownerId: string,
): Promise<Business | null> {
  const doc = await (
    await getAuthenticatedConvexClient()
  ).query(api.businesses.getByOwner, { ownerId, ...(await getOwnerCredentials()) });
  return doc ? toBusiness(doc) : null;
}

export async function getBusiness(
  id: string,
): Promise<Business | null> {
  try {
    const doc = await (
      await getAuthenticatedConvexClient()
    ).query(api.businesses.get, {
      id: id as Id<"businesses">,
      ...(await getOwnerCredentials()),
    });
    return doc ? toBusiness(doc) : null;
  } catch {
    return null;
  }
}

export async function getPublicRestaurant(id: string): Promise<PublicRestaurant | null> {
  const client = await getAuthenticatedConvexClient();
  const doc = await client.query(api.businesses.getPublicRestaurant, { id: id as Id<"businesses"> });
  return doc ? { ...doc, $id: doc._id } : null;
}

export async function createBusiness(
  data: CreateBusinessData,
): Promise<Business> {
  const id = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.businesses.create, {
    ...(await getOwnerCredentials()),
    name: data.name,
    ownerId: data.ownerId,
    address: data.address,
    logoStorageId: toStorageId(data.logoStorageId || data.logoFileId),
    legalName: data.legalName,
    taxId: data.taxId,
    currency: data.currency,
    region: data.region,
    tables: data.tables,
  });

  const created = await (
    await getAuthenticatedConvexClient()
  ).query(api.businesses.get, { id, ...(await getOwnerCredentials()) });
  return toBusiness(created!);
}

export async function updateBusiness(
  id: string,
  data: Partial<Pick<Business,
    "name" | "address" | "logoStorageId" | "logoFileId" | "bannerStorageId" | "bannerFileId" |
    "isToGoEnabled" | "isToStayEnabled" | "legalName" | "taxId" | "vatId" | "tables"
  >> & { clearLogo?: boolean; clearBanner?: boolean },
) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.businesses.update, {
    id: id as Id<"businesses">,
    ...(await getOwnerCredentials()),
    name: data.name,
    address: data.address,
    logoStorageId: toStorageId(data.logoStorageId || data.logoFileId),
    clearLogo: data.clearLogo,
    bannerStorageId: toStorageId(data.bannerStorageId || data.bannerFileId),
    clearBanner: data.clearBanner,
    isToGoEnabled: data.isToGoEnabled,
    isToStayEnabled: data.isToStayEnabled,
    legalName: data.legalName,
    taxId: data.taxId,
    vatId: data.vatId,
    tables: data.tables,
  });
}

// Menu Categories

export async function getMenuCategories(
  businessId: string,
): Promise<MenuCategory[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.menu.getCategories, {
    businessId: businessId as Id<"businesses">,
  });
  return docs.map(toCat);
}

export async function createMenuCategory(
  data: CreateMenuCategoryData,
): Promise<MenuCategory> {
  const id = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.createCategory, {
    ...(await getOwnerCredentials()),
    businessId: data.businessId as Id<"businesses">,
    name: data.name,
    sortOrder: data.sortOrder ?? 0,
  });

  return {
    _id: id,
    $id: id,
    _creationTime: Date.now(),
    businessId: data.businessId,
    name: data.name,
    sortOrder: data.sortOrder ?? 0,
  };
}

export async function updateMenuCategory(
  id: string,
  data: { name?: string; sortOrder?: number },
) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.updateCategory, {
    ...(await getOwnerCredentials()),
    id: id as Id<"menuCategories">,
    name: data.name,
    sortOrder: data.sortOrder,
  });
}

export async function deleteMenuCategory(id: string) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.deleteCategory, {
    ...(await getOwnerCredentials()),
    id: id as Id<"menuCategories">,
  });
}

export async function updateCategorySortOrders(
  updates: { id: string; sortOrder: number }[],
) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.updateCategorySortOrders, {
    ...(await getOwnerCredentials()),
    updates: updates.map((u) => ({
      id: u.id as Id<"menuCategories">,
      sortOrder: u.sortOrder,
    })),
  });
}

// Menu Items

export async function getMenuItems(
  businessId: string,
): Promise<MenuItem[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.menu.getItems, {
    businessId: businessId as Id<"businesses">,
  });
  return docs
    .map(toItem)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const doc = await (
      await getAuthenticatedConvexClient()
    ).query(api.menu.getItem, {
      id: id as Id<"menuItems">,
    });
    return doc ? toItem(doc) : null;
  } catch {
    return null;
  }
}

export async function getAvailableMenuItems(
  businessId: string,
): Promise<MenuItem[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.menu.getAvailableItems, {
    businessId: businessId as Id<"businesses">,
  });
  return docs
    .map(toItem)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function createMenuItem(
  data: CreateMenuItemData,
): Promise<MenuItem> {
  const id = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.createItem, {
    ...(await getOwnerCredentials()),
    businessId: data.businessId as Id<"businesses">,
    categoryId: data.categoryId as Id<"menuCategories">,
    name: data.name,
    description: data.description,
    price: data.price,
    imageStorageId: toStorageId(data.imageStorageId || data.imageId),
    available: data.available ?? true,
    sortOrder: data.sortOrder ?? 0,
    taxRate: data.taxRate ?? 19.0,
    customizations: data.customizations ?? "[]",
    dietaryLabels: data.dietaryLabels,
  });

  const doc = await (
    await getAuthenticatedConvexClient()
  ).query(api.menu.getItem, { id });
  return toItem(doc!);
}

export async function updateMenuItem(
  id: string,
  data: Partial<CreateMenuItemData> & { clearImage?: boolean },
) {
  const item = await getMenuItem(id);
  const cookieStore = await cookies();
  const businessId = item?.businessId;
  const terminalToken =
    cookieStore.get(`staff_session_${businessId}`)?.value ||
    cookieStore.get(`availability_session_${businessId}`)?.value;
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.updateItem, {
    ...(await getOwnerCredentials()),
    terminalToken,
    id: id as Id<"menuItems">,
    categoryId: data.categoryId as Id<"menuCategories"> | undefined,
    name: data.name,
    description: data.description,
    price: data.price,
    imageStorageId: toStorageId(data.imageStorageId || data.imageId),
    clearImage: data.clearImage,
    available: data.available,
    sortOrder: data.sortOrder,
    taxRate: data.taxRate,
    customizations: data.customizations,
    dietaryLabels: data.dietaryLabels,
  });
}

export async function deleteMenuItem(id: string) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.deleteItem, {
    ...(await getOwnerCredentials()),
    id: id as Id<"menuItems">,
  });
}

export async function updateItemSortOrders(
  updates: { id: string; sortOrder: number; categoryId?: string }[],
) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.menu.updateItemSortOrders, {
    ...(await getOwnerCredentials()),
    updates: updates.map((u) => ({
      id: u.id as Id<"menuItems">,
      sortOrder: u.sortOrder,
      categoryId: u.categoryId as Id<"menuCategories"> | undefined,
    })),
  });
}

// Orders

export async function getOrders(
  businessId: string,
  status?: "in_progress" | "ready_for_pickup" | "completed" | "cancelled",
): Promise<Order[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.orders.getOrders, {
    businessId: businessId as Id<"businesses">,
    status,
  });
  return docs.map(toOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const doc = await (
      await getAuthenticatedConvexClient()
    ).query(api.orders.getOrder, {
      id: id as Id<"orders">,
    });
    return doc ? toOrder(doc) : null;
  } catch {
    return null;
  }
}

export async function getOrderByPaymentIntent(
  stripePaymentId: string,
): Promise<Order | null> {
  const doc = await (
    await getAuthenticatedConvexClient()
  ).query(api.orders.getOrderByPaymentIntent, {
    stripePaymentId,
  });
  return doc ? toOrder(doc) : null;
}

export async function updateOrderStatus(
  orderId: string,
  status: "in_progress" | "ready_for_pickup" | "completed" | "cancelled",
) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.orders.updateStatus, {
    id: orderId as Id<"orders">,
    status,
  });
}

// Order Sessions

export async function getOrderSessions(
  businessId: string,
): Promise<OrderSession[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.sessions.getOrderSessions, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return docs.map(toSession);
}

export async function createOrderSession(
  businessId: string,
  _userId: string,
): Promise<OrderSession> {
  const res = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.createOrderSession, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return {
    $id: res._id,
    $createdAt: new Date().toISOString(),
    _id: res._id,
    _creationTime: Date.now(),
    businessId,
    token: res.token,
  };
}

export async function deleteOrderSession(id: string): Promise<void> {
  await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.deleteOrderSession, {
    ...(await getOwnerCredentials()),
    id: id as Id<"orderSessions">,
  });
}

// Availability Sessions

export async function getAvailabilitySessions(
  businessId: string,
): Promise<AvailabilitySession[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.sessions.getAvailabilitySessions, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return docs.map(toSession);
}

export async function createAvailabilitySession(
  businessId: string,
  _ownerId?: string,
): Promise<AvailabilitySession> {
  const res = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.createAvailabilitySession, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return {
    _id: res._id,
    $id: res._id,
    _creationTime: Date.now(),
    businessId,
    token: res.token,
    expiresAt: null,
  };
}

export async function deleteAvailabilitySession(id: string) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.deleteAvailabilitySession, {
    ...(await getOwnerCredentials()),
    id: id as Id<"availabilitySessions">,
  });
}

// Staff Sessions

export async function getStaffSessions(
  businessId: string,
): Promise<StaffSession[]> {
  const docs = await (
    await getAuthenticatedConvexClient()
  ).query(api.sessions.getStaffSessions, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return docs.map(toSession);
}

export async function createStaffSession(
  businessId: string,
  _ownerId?: string,
): Promise<StaffSession> {
  const res = await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.createStaffSession, {
    ...(await getOwnerCredentials()),
    businessId: businessId as Id<"businesses">,
  });
  return {
    _id: res._id,
    $id: res._id,
    _creationTime: Date.now(),
    businessId,
    token: res.token,
    expiresAt: null,
  };
}

export async function deleteStaffSession(id: string) {
  return await (
    await getAuthenticatedConvexClient()
  ).mutation(api.sessions.deleteStaffSession, {
    ...(await getOwnerCredentials()),
    id: id as Id<"staffSessions">,
  });
}
