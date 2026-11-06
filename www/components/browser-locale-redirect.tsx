"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { resolveBrowserLocale } from "@/lib/content";

export function BrowserLocaleRedirect() {
  const router = useRouter();
  useEffect(() => {
    const locale = resolveBrowserLocale(
      typeof navigator !== "undefined" ? navigator.languages : undefined,
      typeof navigator !== "undefined" ? navigator.language : undefined,
    );
    router.replace(`/${locale}`);
  }, [router]);
  return null;
}
