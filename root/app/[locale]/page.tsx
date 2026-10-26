import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { WebsiteHome } from "@/components/website-home";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale);
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <WebsiteHome locale={locale} />;
}
