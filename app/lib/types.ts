// Convex Document Base

export interface ConvexDocument {
  _id: string;
  _creationTime: number;
  /** Compatibility alias for _id */
  $id: string;
  /** Compatibility alias for _creationTime ISO string */
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  $databaseId?: string;
  $collectionId?: string;
}

// Businesses

export interface Business extends ConvexDocument {
  name: string;
  address?: string;
  logoStorageId?: string;
  logoFileId?: string; // compatibility
  logoUrl?: string | null;
  bannerStorageId?: string;
  bannerFileId?: string; // compatibility
  bannerUrl?: string | null;
  ownerId: string;
  stripeAccountId?: string;
  stripeAccountVersion?: "v1" | "v2";
  stripeDashboardAccess?: "none" | "express" | "full";
  stripeOnboardingComplete?: boolean;
  stripeChargesEnabled?: boolean;
  stripePayoutsEnabled?: boolean;
  stripeCurrentlyDue?: string[];
  stripePastDue?: string[];
  stripeDisabledReason?: string;
  posSystemName?: string;
  posExternalPaymentLabel?: string;
  posWorkflowAcknowledgedAt?: number;
  setupCompletedAt?: number;
  orderingPaused?: boolean;
  isToGoEnabled?: boolean;
  isToStayEnabled?: boolean;
  legalName?: string;
  legalRepresentative?: string;
  vatId?: string;
  taxId?: string;
  supportPhone?: string;
  supportEmail?: string;
  currency?: string;
  region?: string;
  deletionRequested?: boolean;
  tables?: string[];
}

export interface CreateBusinessData {
  name: string;
  address?: string;
  logoStorageId?: string;
  logoFileId?: string;
  bannerStorageId?: string;
  bannerFileId?: string;
  ownerId: string;
  legalName?: string;
  taxId?: string;
  currency?: string;
  region?: string;
  tables?: string[];
}

// Menu Categories

export interface MenuCategory extends ConvexDocument {
  businessId: string;
  name: string;
  sortOrder: number;
}

export interface CreateMenuCategoryData {
  businessId: string;
  name: string;
  sortOrder?: number;
  ownerId?: string;
}

// Menu Items

export interface CustomizationOption {
  id: string;
  name: string;
  nameEn?: string;
  extraPrice: number; // in cents, 0 if included
  available: boolean;
  sortOrder: number;
}

export interface CustomizationStep {
  id: string;
  name: string;
  nameEn?: string;
  minSelections: number;
  maxSelections: number;
  includedCount: number; // how many selections are free
  available?: boolean;
  sortOrder: number;
  options: CustomizationOption[];
}

export interface MenuItem extends ConvexDocument {
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number; // in cents
  imageStorageId?: string;
  imageId?: string; // compatibility
  imageUrl?: string | null;
  available: boolean;
  sortOrder: number;
  taxRate: number;
  customizations: string; // JSON serialized CustomizationStep[]
}

export interface CreateMenuItemData {
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageStorageId?: string;
  imageId?: string;
  available?: boolean;
  sortOrder?: number;
  ownerId?: string;
  taxRate?: number;
  customizations?: string;
}

// Orders

export interface OrderCustomization {
  stepName?: string;
  optionName?: string;
  extraPrice?: number;
  step?: string;
  choice?: string;
  name?: string;
}

export interface OrderItem {
  menuItemId?: string;
  id?: string;
  cartItemId?: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: OrderCustomization[];
}

export interface Order extends ConvexDocument {
  businessId: string;
  tableNumber?: string;
  type: "dine-in" | "takeaway";
  items: string; // JSON serialized OrderItem[]
  total: number; // in cents
  status: "in_progress" | "ready_for_pickup" | "completed" | "cancelled";
  completedAt?: number;
  readyAt?: number;
  createdAt?: number;
  paidAt?: number;
  email: string;
  orderNumber: string;
  stripePaymentId?: string;
  stripeSessionId?: string;
  connectedAccountId?: string;
  grossSubtotalCents?: number;
  discountCents?: number;
  eligibleGrossSubtotalCents?: number;
  tipCents?: number;
  totalChargeCents?: number;
  applicationFeeCents?: number;
  zakkigFee: number; // in cents
  stripeFee: number; // in cents
  netAmount: number; // in cents
  currency: string;
  isTestOrder?: boolean;
  posStatus?: "pending" | "recorded" | "discrepancy";
  posRecordedAt?: number;
  posRecordedBy?: string;
  posReceiptRef?: string;
  refundStatus?: "none" | "partial" | "full";
  refundedCents?: number;
  refundedFeeCents?: number;
  disputeStatus?: string;
}

export interface CreateOrderData {
  businessId: string;
  tableNumber?: string;
  type: "dine-in" | "takeaway";
  items: OrderItem[];
  total: number;
  email: string;
  stripePaymentId?: string;
  zakkigFee: number;
  stripeFee: number;
  netAmount: number;
  currency?: string;
}

// Order Sessions

export interface OrderSession extends ConvexDocument {
  businessId: string;
  token: string;
  expiresAt?: string | null;
}

// Availability Sessions

export interface AvailabilitySession extends ConvexDocument {
  businessId: string;
  token: string;
  expiresAt?: string | null;
}

// Staff Sessions

export interface StaffSession extends ConvexDocument {
  businessId: string;
  token: string;
  expiresAt?: string | null;
}

// Cart (Client State)

export interface CartItem {
  id: string; // Unique ID for this specific configured item
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: {
    stepName: string;
    optionName: string;
    extraPrice: number;
  }[];
}
