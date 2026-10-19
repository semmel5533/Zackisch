"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthenticatedConvexClient, getOwnerCredentials, requireOwner } from "@/lib/convex/auth";

export async function createConnectV2AccountAction(
  businessId: string,
  dashboardAccess: "none" | "full" = "none",
) {
  try {
    await requireOwner(businessId);
    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.createEmbeddedAccountSession, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
      dashboardMode: dashboardAccess,
    });
    if (res.error) return { error: res.error };
    revalidatePath(`/dashboard/${businessId}/settings`);
    revalidatePath(`/dashboard/${businessId}/overview`);
    return {
      stripeAccountId: res.accountId,
      accountVersion: "v2",
      dashboardAccess: res.dashboardType,
    };
  } catch (error: any) {
    console.error("createConnectV2AccountAction error:", error);
    return { error: error.message || "Failed to create Stripe Connect v2 account" };
  }
}

export async function createEmbeddedAccountSessionAction(
  businessId: string,
) {
  try {
    await requireOwner(businessId);
    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.createEmbeddedAccountSession, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
    });
    if (res.error) return { error: res.error };
    return {
      clientSecret: res.clientSecret,
      stripeAccountId: res.accountId,
    };
  } catch (error: any) {
    console.error("createEmbeddedAccountSessionAction error:", error);
    return { error: error.message || "Failed to create embedded account session" };
  }
}

export async function connectStripeAction(businessId: string) {
  try {
    await requireOwner(businessId);

    const headerList = await headers();
    const origin = headerList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
    if (!origin) {
      throw new Error("Missing origin header and NEXT_PUBLIC_APP_URL is not set");
    }

    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.connectStripe, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
      origin,
    });

    if (res.error) return { error: res.error };
    return { url: res.url };
  } catch (error: any) {
    console.error("connectStripeAction error:", error);
    return { error: error.message || "Failed to connect Stripe" };
  }
}

export async function getStripeAccountStatusAction(businessId: string) {
  try {
    await requireOwner(businessId);

    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.getStripeAccountStatus, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
    });

    if (res.error) return { error: res.error };
    revalidatePath(`/dashboard/${businessId}/settings`);
    revalidatePath(`/dashboard/${businessId}/overview`);

    return {
      isConnected: res.isConnected,
      isOnboardingComplete: res.isOnboardingComplete,
      chargesEnabled: res.chargesEnabled,
      payoutsEnabled: res.payoutsEnabled,
      currentlyDue: res.currentlyDue,
      pastDue: res.pastDue,
      disabledReason: res.requirementsStatus,
    };
  } catch (error: any) {
    console.error("getStripeAccountStatusAction error:", error);
    return { error: error.message };
  }
}

export async function createStripeDashboardLinkAction(businessId: string) {
  try {
    await requireOwner(businessId);

    const headerList = await headers();
    const origin = headerList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
    if (!origin) {
      throw new Error("Missing origin header and NEXT_PUBLIC_APP_URL is not set");
    }

    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.createStripeDashboardLink, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
      origin,
    });

    if (res.error) return { error: res.error };
    return { url: res.url };
  } catch (error: any) {
    console.error("createStripeDashboardLinkAction error:", error);
    return { error: error.message };
  }
}

export async function completeTestStripeOnboardingAction(businessId: string) {
  try {
    await requireOwner(businessId);

    const client = await getAuthenticatedConvexClient();
    const res = await client.action(api.stripe.completeTestStripeOnboarding, {
      businessId: businessId as Id<"businesses">,
      ...(await getOwnerCredentials()),
    });

    if (res.error) return { error: res.error };
    revalidatePath(`/dashboard/${businessId}/settings`);
    revalidatePath(`/dashboard/${businessId}/overview`);
    return { success: res.success, accountId: res.accountId };
  } catch (error: any) {
    console.error("completeTestStripeOnboardingAction error:", error);
    return { error: error.message };
  }
}
