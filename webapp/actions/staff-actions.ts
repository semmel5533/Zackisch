"use server";

import { revalidatePath } from "next/cache";
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
