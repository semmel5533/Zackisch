import { LegalPage } from "@/components/LegalPage";
import { legalMetadata } from "@/lib/legal";
import { ALL_LOCALES } from "@/lib/regions";
export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return legalMetadata((await params).locale, "gtc");
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage locale={(await params).locale} kind="gtc" />;
}
