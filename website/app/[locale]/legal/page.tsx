import { ALL_LOCALES } from "@/lib/regions";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export default async function LegalRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/legal-notice`);
}
