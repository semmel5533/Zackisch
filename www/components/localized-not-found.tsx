"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  content,
  localeConfigs,
  resolveLocaleFromPathname,
  type Locale,
} from "@/lib/content";
import { SectionNavigationProvider } from "./section-navigation";

export function LocalizedNotFound({
  pages,
}: {
  pages: Record<Locale, ReactNode>;
}) {
  const pathname = usePathname();
  const locale = resolveLocaleFromPathname(pathname);
  const lang = localeConfigs[locale].lang;
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <SectionNavigationProvider>
      <title>{content[locale].notFoundTitle}</title>
      {pages[locale]}
    </SectionNavigationProvider>
  );
}
