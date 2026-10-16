"use server";

import { revalidatePath } from "next/cache";
import {
  createAvailabilitySession,
  deleteAvailabilitySession,
  getAvailabilitySessions,
} from "@/lib/convex/database";
import { requireOwner } from "@/lib/convex/auth";

export async function generateAvailabilitySessionAction(
  businessId: string,
) {
  try {
    const { user } = await requireOwner(businessId);

    const existing = await getAvailabilitySessions(businessId);
    await Promise.all(existing.map((s) => deleteAvailabilitySession(s.$id)));
    const session = await createAvailabilitySession(businessId, user.$id || user._id);
    revalidatePath(`/dashboard/${businessId}/overview`);
    return { success: true, session: structuredClone(session) };
  } catch (error: unknown) {
    console.error(
      "Fehler beim Neu-Generieren der Availability Session:",
      error,
    );
    return {
      error: "Sitzungen konnten nicht neu generiert werden.",
    };
  }
}
