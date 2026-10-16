"use client";

/**
 * Convex uses reactive useQuery hooks instead of manual websocket subscriptions.
 * These helper stubs maintain compatibility for any legacy callers.
 */

export function subscribeToOrders(
  _businessId: string,
  _callback: (event: any) => void
) {
  return () => {};
}

export function subscribeToOrder(
  _orderId: string,
  _callback: (event: any) => void
) {
  return () => {};
}

export function subscribeToBusiness(
  _businessId: string,
  _callback: (event: any) => void
) {
  return () => {};
}
