import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { websiteStructuredData } from "@/lib/structured-data";
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
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData(locale)).replace(/</g, "\\u003c") }} />
    <WebsiteHome locale={locale} />
  </>;
}
