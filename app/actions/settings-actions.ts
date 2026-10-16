"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { updateBusiness } from "@/lib/convex/database";
import { uploadFileToConvex } from "@/lib/convex/storage";
import { getUser, getAuthenticatedConvexClient, requireOwner } from "@/lib/convex/auth";
import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, MAX_IMAGE_SIZE_BYTES, isAllowedImageFile } from "@/lib/constants";

export interface SettingsActionState {
  error?: string;
  success?: boolean;
}

export async function logoutAllDevicesAction(): Promise<void> {
  redirect("/sign-in");
}

export async function updateBusinessAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const businessId = formData.get("businessId") as string;
  if (!businessId) return { error: "Betriebs-ID fehlt." };

  try {
    const { user } = await requireOwner(businessId);
    const businessName = formData.get("businessName") as string;
    const userName = formData.get("userName") as string;
    const address = formData.get("address") as string;
    const logoFile = formData.get("logo") as File | null;
    const existingLogoId = formData.get("existingLogoId") as string;
    const removeLogo = formData.get("removeLogo") === "true";
    const bannerFile = formData.get("banner") as File | null;
    const existingBannerId = formData.get("existingBannerId") as string;
    const removeBanner = formData.get("removeBanner") === "true";

    if (!businessName) return { error: "Name des Betriebs ist erforderlich." };
    if (businessName.length > 100) return { error: "Der Name des Betriebs darf maximal 100 Zeichen lang sein." };
    if (!userName) return { error: "Vertretername ist erforderlich." };
    if (userName.length > 100) return { error: "Der Name darf maximal 100 Zeichen lang sein." };
    if (address && address.length > 200) return { error: "Die Adresse darf maximal 200 Zeichen lang sein." };

    if (logoFile && logoFile.size > 0) {
      if (!isAllowedImageFile(logoFile)) {
        return { error: "Nur Bilder im JPG- oder PNG-Format sind für das Logo erlaubt." };
      }
      if (logoFile.size > MAX_IMAGE_SIZE_BYTES) {
        return { error: "Das Logo darf maximal 10 MB groß sein." };
      }
    }

    if (bannerFile && bannerFile.size > 0) {
      if (!isAllowedImageFile(bannerFile)) {
        return { error: "Nur Bilder im JPG- oder PNG-Format sind für das Banner erlaubt." };
      }
      if (bannerFile.size > MAX_IMAGE_SIZE_BYTES) {
        return { error: "Das Banner darf maximal 10 MB groß sein." };
      }
    }

  const client = await getAuthenticatedConvexClient();
    try {
      await client.mutation(api.users.updateName, { name: userName });
    } catch {
      // ignore if auth context is separate
    }

    let logoStorageId: string | undefined = existingLogoId || undefined;
    if (removeLogo) {
      logoStorageId = undefined;
    } else if (logoFile && logoFile.size > 0) {
      logoStorageId = await uploadFileToConvex(logoFile);
    }

    let bannerStorageId: string | undefined = existingBannerId || undefined;
    if (removeBanner) {
      bannerStorageId = undefined;
    } else if (bannerFile && bannerFile.size > 0) {
      bannerStorageId = await uploadFileToConvex(bannerFile);
    }

    await updateBusiness(businessId, {
      name: businessName,
      address,
      logoStorageId,
      clearLogo: removeLogo,
      bannerStorageId,
      clearBanner: removeBanner,
    });

    revalidatePath(`/dashboard/${businessId}/settings`);
    revalidatePath(`/dashboard/${businessId}/overview`);
    revalidatePath(`/pickup/${businessId}`);
    revalidatePath(`/table/${businessId}`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Daten konnten nicht gespeichert werden.";
    return { error: message };
  }
}

export async function requestAccountDeletionAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Nicht authentifiziert." };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("Missing required environment variable: NEXT_PUBLIC_APP_URL is not set");
    }
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "de";

    const res = await convexServer.mutation(api.users.requestAccountDeletionEmail, {
      userId: user._id,
      sessionToken,
      appUrl,
      locale,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Bestätigungs-E-Mail konnte nicht gesendet werden." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Account deletion request failed:", error);
    return { success: false, error: error.message || "Fehler beim Anfordern der Kontolöschung." };
  }
}

export async function confirmAccountDeletionAction(
  userId: string,
  token: string
) {
  try {
    const res = await convexServer.mutation(api.users.confirmAccountDeletion, {
      userId: userId as Id<"users">,
      token,
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    // Sign out user by clearing the session cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return { success: true };
  } catch (error: any) {
    console.error("Account deletion confirm failed:", error);
    return { success: false, error: error.message || "Fehler beim Löschen des Kontos." };
  }
}

export async function requestEmailChangeAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Nicht authentifiziert." };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("Missing required environment variable: NEXT_PUBLIC_APP_URL is not set");
    }
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "de";

    const res = await convexServer.mutation(api.users.requestEmailChangeEmail, {
      userId: user._id,
      sessionToken,
      appUrl,
      locale,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Bestätigungs-E-Mail konnte nicht gesendet werden." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Email change request failed:", error);
    return { success: false, error: error.message || "Fehler beim Anfordern der E-Mail-Änderung." };
  }
}

export async function sendEmailChangeOtpAction(
  _prevState: { success?: boolean; error?: string; email?: string; userId?: string; token?: string },
  formData: FormData
) {
  try {
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;
    const newEmail = formData.get("newEmail") as string;

    if (!userId || !token || !newEmail) {
      return { success: false, error: "Bitte fülle alle Pflichtfelder aus." };
    }

    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "de";

    const res = await convexServer.mutation(api.users.sendEmailChangeOtpWithEmail, {
      userId: userId as Id<"users">,
      token,
      newEmail,
      locale,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Fehler beim Senden des Bestätigungscodes." };
    }

    return { success: true, email: newEmail, userId, token };
  } catch (error: any) {
    console.error("Email change send OTP failed:", error);
    return { success: false, error: error.message || "Fehler beim Senden des Bestätigungscodes." };
  }
}

export async function confirmEmailChangeOtpAction(
  _prevState: { success?: boolean; error?: string },
  formData: FormData
) {
  try {
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;
    const email = formData.get("email") as string;
    const otp = formData.get("otp") as string;

    if (!userId || !token || !email || !otp) {
      return { success: false, error: "Bitte fülle alle Pflichtfelder aus." };
    }

    const res = await convexServer.mutation(api.users.confirmEmailChangeWithOtp, {
      userId: userId as Id<"users">,
      token,
      newEmail: email,
      otp,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Fehler beim Bestätigen der E-Mail-Adresse." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Email change confirm OTP failed:", error);
    return { success: false, error: error?.message || "Fehler beim Bestätigen der E-Mail-Adresse." };
  }
}

export async function toggleFeatureAction(
  businessId: string,
  feature: "pickup" | "table" | "to-go" | "to-stay",
  value: boolean,
): Promise<SettingsActionState> {
  try {
    await requireOwner(businessId);

    const updateData =
      feature === "pickup" || feature === "to-go"
        ? { isToGoEnabled: value }
        : { isToStayEnabled: value };

    await updateBusiness(businessId, updateData);

    revalidatePath(`/dashboard/${businessId}/overview`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Feature konnte nicht umgeschaltet werden.";
    return { error: message };
  }
}

export async function updateTablesAction(
  businessId: string,
  tables: string[],
): Promise<SettingsActionState> {
  try {
    await requireOwner(businessId);

    // Validate tables array: max 100 tables, each between 1 and 4 characters
    if (!Array.isArray(tables) || tables.length > 100) {
      return { error: "Ungültige Tischanzahl (maximal 100 Tische)." };
    }
    const cleanTables: string[] = [];
    for (const t of tables) {
      const trimmed = String(t).trim();
      if (trimmed.length < 1 || trimmed.length > 4) {
        return {
          error: "Tischnummern müssen zwischen 1 und 4 Zeichen lang sein.",
        };
      }
      cleanTables.push(trimmed);
    }

    await updateBusiness(businessId, { tables: cleanTables });
    revalidatePath(`/dashboard/${businessId}/overview`);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Tische konnten nicht aktualisiert werden.";
    return { error: message };
  }
}
