"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  updateOrderStatus,
  getOrders,
  getOrder,
  createOrderSession,
  deleteOrderSession,
  getOrderSessions,
} from "@/lib/convex/database";
import {
  getAuthenticatedConvexClient,
  requireOwner,
  requireKitchenOrOwner,
} from "@/lib/convex/auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export interface OrderActionState {
  error?: string;
  success?: boolean;
  orderId?: string;
  orderNumber?: string;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: "in_progress" | "ready_for_pickup" | "completed" | "cancelled",
  organizationId: string,
) {
  try {
    await requireKitchenOrOwner(organizationId);

    const order = await getOrder(orderId);
    if (!order || order.organizationId !== organizationId) {
      return { error: "Bestellung nicht gefunden oder unberechtigt." };
    }

    // Defense-in-depth: Completed orders can never be cancelled
    if (status === "cancelled" && order.status === "completed") {
      return {
        error: "Abgeschlossene Bestellungen können nicht mehr storniert werden.",
      };
    }

    await updateOrderStatus(orderId, status);
    revalidatePath(`/dashboard/${organizationId}/current-orders`);
    revalidatePath(`/dashboard/${organizationId}/all-orders`);
    revalidatePath(`/dashboard/${organizationId}/live-orders`);
    revalidatePath(`/dashboard/${organizationId}/archive`);
    revalidatePath(`/staff/${organizationId}`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Status konnte nicht geändert werden.";
    return { error: message };
  }
}

export async function recordOrderInPosAction(
  orderId: string,
  organizationId: string,
  posReceiptRef?: string,
) {
  try {
    await requireKitchenOrOwner(organizationId);

    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get(`staff_session_${organizationId}`)?.value ||
      cookieStore.get(`order_session_${organizationId}`)?.value ||
      undefined;

    const client = await getAuthenticatedConvexClient();
    const res = await client.mutation(api.orders.recordOrderInPos, {
      orderId: orderId as Id<"orders">,
      sessionToken,
      posReference: posReceiptRef?.trim() || undefined,
    });

    revalidatePath(`/dashboard/${organizationId}/current-orders`);
    revalidatePath(`/dashboard/${organizationId}/all-orders`);
    revalidatePath(`/dashboard/${organizationId}/overview`);
    revalidatePath(`/staff/${organizationId}`);

    return {
      success: true,
      posRecordedAt: res.posRecordedAt,
      posStatus: "recorded" as const,
      posReference: res.posReference,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Kassenerfassung konnte nicht gespeichert werden.";
    return { error: message };
  }
}

export async function refundOrderAction(
  orderId: string,
  organizationId: string,
  refundAmountCents?: number,
  reason?: string,
) {
  try {
    await requireOwner(organizationId);

    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.refundOrder, {
      orderId: orderId as Id<"orders">,
      refundAmountCents,
      reason,
    });

    if (res.error) {
      return { error: res.error };
    }

    revalidatePath(`/dashboard/${organizationId}/all-orders`);
    revalidatePath(`/dashboard/${organizationId}/overview`);

    return {
      success: true,
      refundId: res.refundId,
      refundedAmountCents: res.refundedAmountCents,
      refundedFeeCents: res.refundedFeeCents,
      refundStatus: refundAmountCents ? ("partial" as const) : ("full" as const),
      cumulativeRefundedCents: res.refundedAmountCents,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erstattung konnte nicht durchgeführt werden.";
    return { error: message };
  }
}

export async function exportOrdersCSVAction(organizationId: string) {
  try {
    await requireOwner(organizationId);

    const orders = await getOrders(organizationId);

    const headers = [
      "Belegdatum",
      "Bestell-ID",
      "Bestellnummer",
      "Typ",
      "Brutto-Warenwert",
      "Trinkgeld (freiwillig)",
      "Gesamtbelastung",
      "S/H",
      "Währung",
      "Zackisch-Provision (2 % inkl. USt.)",
      "Kassenstatus (POS)",
      "In Kasse erfasst am",
      "Kassen-Referenz",
      "Erstattungsstatus",
      "Erstattet (EUR)",
    ].join(";");

    const rows = orders.map((order) => {
      const grossGoods =
        (order.eligibleGrossSubtotalCents ??
          Math.max(0, order.total - (order.tipCents || 0))) / 100;
      const tip = (order.tipCents || 0) / 100;
      const totalCharge = order.total / 100;
      const zakkigFee =
        (order.applicationFeeCents ?? order.zakkigFee ?? 0) / 100;
      const refunded = (order.refundedCents || 0) / 100;

      const posStatusLabel =
        order.posStatus === "recorded"
          ? "In Kasse erfasst"
          : order.posStatus === "discrepancy"
            ? "Abweichung prüfen"
            : "Offen";

      const posRecordedDate = order.posRecordedAt
        ? new Date(order.posRecordedAt).toLocaleString("de-DE")
        : "";

      return [
        new Date(order.$createdAt || order._creationTime).toLocaleDateString(
          "de-DE",
        ),
        order.$id || order._id,
        order.orderNumber,
        order.type === "dine-in" ? "Vor Ort" : "Zum Mitnehmen",
        grossGoods.toFixed(2).replace(".", ","),
        tip.toFixed(2).replace(".", ","),
        totalCharge.toFixed(2).replace(".", ","),
        "S",
        order.currency || "EUR",
        zakkigFee.toFixed(2).replace(".", ","),
        posStatusLabel,
        posRecordedDate,
        order.posReceiptRef || "",
        order.refundStatus || "none",
        refunded.toFixed(2).replace(".", ","),
      ].join(";");
    });

    return { success: true, csv: [headers, ...rows].join("\n") };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "CSV-Export fehlgeschlagen.";
    return { error: message };
  }
}

export async function generateOrderSessionAction(organizationId: string) {
  try {
    const { user } = await requireOwner(organizationId);

    const existing = await getOrderSessions(organizationId);
    await Promise.all(existing.map((s) => deleteOrderSession(s.$id)));
    const session = await createOrderSession(
      organizationId,
      user.$id || user._id,
    );
    revalidatePath(`/dashboard/${organizationId}/overview`);
    return { success: true, session: structuredClone(session) };
  } catch (error: unknown) {
    console.error("Fehler beim Neu-Generieren der Order Session:", error);
    return {
      error: "Sitzungen konnten nicht neu generiert werden.",
    };
  }
}
