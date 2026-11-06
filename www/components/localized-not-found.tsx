"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SectionNavigationProvider } from "./section-navigation";

const titles = {
  de: "Seite nicht gefunden | Zackisch",
  en: "Page not found | Zackisch",
};

export function LocalizedNotFound({
  german,
  english,
}: {
  german: ReactNode;
  english: ReactNode;
}) {
  const pathname = usePathname();
  const language =
    pathname?.startsWith("/de-en/") || pathname === "/de-en" ? "en" : "de";
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
    <SectionNavigationProvider>
      <title>{titles[language]}</title>
      {language === "en" ? english : german}
    </SectionNavigationProvider>
  );
}
