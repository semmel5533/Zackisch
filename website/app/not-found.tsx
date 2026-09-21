"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <main id="content" className="not-found page-width">
      <h1>{t("notFoundTitle")}</h1>
      <p>{t("notFoundText")}</p>
      <Link className="button-primary" href={t("homeUrl")}>
        {t("backHome")}
      </Link>
    </main>
  );
}
