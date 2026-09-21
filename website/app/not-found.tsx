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
        <Link className="button-primary" href={t("homeUrl")}>
          {t("backHome")}
        </Link>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
