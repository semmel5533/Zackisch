"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, ALL_LOCALES } from "@/lib/regions";

export default function RootRouterPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check persistent cookie preference
    const matchCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("zackisch_locale=") || row.startsWith("zakkig_locale="));
    if (matchCookie) {
      const val = matchCookie.split("=")[1];
      if (ALL_LOCALES.includes(val)) {
        router.replace(`/${val}`);
        return;
      }
    }

    // 2. Check localStorage preference
    try {
      const stored = localStorage.getItem("zackisch_locale") || localStorage.getItem("zakkig_locale");
      if (stored && ALL_LOCALES.includes(stored)) {
        router.replace(`/${stored}`);
        return;
      }
    } catch {
      // ignore
    }

    // 3. Detect from browser language
    const navLang = (navigator.language || "").toLowerCase();
    if (navLang.startsWith("de")) {
      router.replace("/de-de");
    } else {
      router.replace("/de-en");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
    </div>
  );
}
