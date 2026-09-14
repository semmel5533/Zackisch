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

export async function generateStaffSessionAction(organizationId: string) {
  try {
    const { user } = await requireOwner(organizationId);

    const existing = await getStaffSessions(organizationId);
    await Promise.all(existing.map((s) => deleteStaffSession(s.$id)));
    const session = await createStaffSession(
      organizationId,
      user.$id || user._id,
    );
    revalidatePath(`/dashboard/${organizationId}/overview`);
    return { success: true, session: structuredClone(session) };
  } catch (error: unknown) {
    console.error("Fehler beim Generieren der Personal-Sitzung:", error);
    return {
      error: "Personal-Sitzung konnte nicht neu generiert werden.",
    };
  }
}

export async function signOutStaffAction(organizationId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`staff_session_${organizationId}`);
  cookieStore.delete(`order_session_${organizationId}`);
  cookieStore.delete(`availability_session_${organizationId}`);
  cookieStore.set(`staff_session_${organizationId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.set(`order_session_${organizationId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.set(`availability_session_${organizationId}`, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  redirect("https://www.zakkig.com");
}
