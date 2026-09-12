"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, X, Check } from "@phosphor-icons/react";
import { REGIONS, parseLocale, ALL_LOCALES } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface RegionLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegionFlag({ code, className }: { code: string; className?: string }) {
  if (code.toLowerCase() === "de") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={`w-6 h-4.5 rounded-[3px] shadow-xs object-cover shrink-0 overflow-hidden border border-black/10 ${className || ""}`}
        aria-hidden="true"
      >
        <path fill="#000000" d="M0 0h640v160H0z" />
        <path fill="#DD0000" d="M0 160h640v160H0z" />
        <path fill="#FFCE00" d="M0 320h640v160H0z" />
      </svg>
    );
  }
  return null;
}

export function RegionLanguageModal({
  isOpen,
  onClose,
}: RegionLanguageModalProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { t } = useTranslation();

  const getActiveRoute = () => {
    const activePath = (typeof window !== "undefined" ? window.location.pathname : "") || pathname;
    return parseLocale(activePath);
  };

  const [selectedRegion, setSelectedRegion] = useState(() => getActiveRoute().regionCode);
  const [selectedLocale, setSelectedLocale] = useState(() => getActiveRoute().locale);

  // Synchronize draft selection with active URL whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      const active = getActiveRoute();
      setSelectedRegion(active.regionCode);
      setSelectedLocale(active.locale);
    }
  }, [isOpen, pathname]);

  if (!isOpen) return null;

  const currentRegionConfig = REGIONS[selectedRegion] || REGIONS.de;

  const handleApply = () => {
    // Set persistent preference cookie (1 year)
    document.cookie = `zakkig_locale=${selectedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("zakkig_locale", selectedLocale);
    } catch {
      // ignore
    }

    // Determine target URL: preserve subpath if on legal/privacy/gtc
    let targetPath = `/${selectedLocale}`;
    if (pathname.includes("/legal")) {
      targetPath = `/${selectedLocale}/legal`;
    } else if (pathname.includes("/privacy")) {
      targetPath = `/${selectedLocale}/privacy`;
    } else if (pathname.includes("/gtc")) {
      targetPath = `/${selectedLocale}/gtc`;
    }

    onClose();
    router.push(targetPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div role="dialog" aria-modal="true" className="relative w-full max-w-lg bg-white text-zinc-900 rounded-[24px] border border-zinc-200 shadow-2xl overflow-hidden p-0 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header with edge-to-edge dividing line */}
        <div className="px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
            {t("regionSelectorTitle")}
          </h2>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed mt-0.5">
            {t("regionSelectorDescription")}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto">
          {/* Region Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
              {t("regionLabel")}
            </label>
            <div className="space-y-2">
              {Object.values(REGIONS).map((region) => {
                const isSelected = selectedRegion === region.code;
                return (
                  <button
                    key={region.code}
                    type="button"
                    onClick={() => {
                      setSelectedRegion(region.code);
                      setSelectedLocale(region.defaultLocale);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-zinc-50 font-semibold text-black"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RegionFlag code={region.code} />
                      <span className="text-sm font-medium">
                        {region.nativeName}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-black shrink-0" weight="bold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
              {t("languageLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {currentRegionConfig.locales.map((loc) => {
                const isSelected = selectedLocale === loc.code;
                return (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => setSelectedLocale(loc.code)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-zinc-50 font-semibold text-black"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{loc.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-black shrink-0" weight="bold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions with edge-to-edge dividing line */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
          >
            {t("cancel" as any)}
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="w-full sm:flex-1 h-11 rounded-full bg-black text-white hover:bg-zinc-800 font-semibold active:scale-[0.98] transition-all cursor-pointer"
          >
            {t("saveAndContinue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
