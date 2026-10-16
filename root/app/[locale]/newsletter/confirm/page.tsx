import { Suspense } from "react";
import { Metadata } from "next";
import { ALL_LOCALES, parseLocale } from "@/lib/regions";
import { ConfirmContent } from "./ConfirmContent";
import { SiteFooter } from "@/components/SiteFooter";

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { lang } = parseLocale(locale);
  const isDe = lang === "de";

  return {
    title: isDe
      ? "Newsletter-Anmeldung bestätigen – Zackisch"
      : "Confirm Newsletter Subscription – Zackisch",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <main className="flex-1 flex items-center justify-center p-6 my-16">
        <Suspense
          fallback={
            <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
          }
        >
          <ConfirmContent locale={locale} />
        </Suspense>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
