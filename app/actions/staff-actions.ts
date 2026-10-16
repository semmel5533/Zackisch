"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createStaffSession,
  deleteStaffSession,
  getStaffSessions,
} from "@/lib/convex/database";
import { requireOwner } from "@/lib/convex/auth";

export async function generateStaffSessionAction(businessId: string) {
  try {
    const { user } = await requireOwner(businessId);

    const existing = await getStaffSessions(businessId);
    await Promise.all(existing.map((s) => deleteStaffSession(s.$id)));
    const session = await createStaffSession(
      businessId,
      user.$id || user._id,
    );
    revalidatePath(`/dashboard/${businessId}/overview`);
    return { success: true, session: structuredClone(session) };
  } catch (error: unknown) {
    console.error("Fehler beim Generieren der Personal-Sitzung:", error);
    return {
      error: "Personal-Sitzung konnte nicht neu generiert werden.",
    };
  }
}

export async function signOutStaffAction(businessId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`staff_session_${businessId}`);
  cookieStore.delete(`order_session_${businessId}`);
  cookieStore.delete(`availability_session_${businessId}`);
  cookieStore.set(`staff_session_${businessId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.set(`order_session_${businessId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.set(`availability_session_${businessId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  redirect("https://zackisch.com");
}
