import { getBusiness } from "@/lib/convex/database";
import { getUser } from "@/lib/convex/auth";
import { SettingsContent } from "@/components/dashboard/settings-content";

import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.settings,
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const [business, user] = await Promise.all([
    getBusiness(businessId),
    getUser(),
  ]);

  if (!business || !user) return null;

  return (
    <SettingsContent
      business={structuredClone(business)}
      user={structuredClone(user)}
    />
  );
}
