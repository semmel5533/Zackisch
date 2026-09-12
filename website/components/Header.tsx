"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "@phosphor-icons/react";
import { parseLocale } from "@/lib/regions";
import { RegionLanguageModal } from "./RegionLanguageModal";

export function Header() {
  const pathname = usePathname() || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { regionCode, lang, locale } = parseLocale(pathname);
  const isEn = lang === "en";

  const homeTarget = `/${locale}`;

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-8 md:px-10 max-w-7xl mx-auto">
        <Link href={homeTarget} className="flex items-center">
          <img
            src="/full.svg"
            alt="zakkig Logo"
            className="h-9 md:h-10 w-auto block"
            loading="eager"
            fetchPriority="high"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>
        <nav className="flex items-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 text-black flex items-center justify-center transition-all active:scale-[0.98] shadow-sm cursor-pointer border-0"
            aria-label="Select Region and Language"
          >
            <Globe className="w-5 h-5 text-black" weight="regular" />
          </button>
        </nav>
      </header>

      {isModalOpen && (
        <RegionLanguageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
