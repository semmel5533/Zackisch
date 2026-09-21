"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height,104px))] justify-between">
      <main id="content" className="not-found page-width flex-1 flex flex-col items-start justify-center">
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundText")}</p>
        <Link
          className="inline-flex items-center justify-center gap-2.5 h-11 px-5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] shrink-0 bg-black text-white hover:bg-zinc-800 border border-black"
          href={t("homeUrl")}
        >
          <span>{t("backHome")}</span>
        </Link>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
