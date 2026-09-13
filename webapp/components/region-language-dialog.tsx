"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Globe, Check } from "@phosphor-icons/react";
import { useRegionStore } from "@/store/region-store";
import { useLanguageStore } from "@/store/language-store";
import { SUPPORTED_REGIONS } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RegionLanguageSwitcherProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function RegionFlag({ code, className }: { code: string; className?: string }) {
  if (code.toLowerCase() === "de") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={cn("w-6 h-4.5 rounded-[3px] shadow-xs object-cover shrink-0 overflow-hidden border border-black/10", className)}
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

export function RegionLanguageSwitcher({
  className,
  variant = "outline",
  size = "default",
}: RegionLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  // Local draft state when modal is open
  const [tempRegion, setTempRegion] = useState(region);
  const [tempLocale, setTempLocale] = useState(locale);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTempRegion(region);
      setTempLocale(locale);
    }
  }, [isOpen, region, locale]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openModal = () => {
    setTempRegion(region);
    setTempLocale(locale);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    setRegion(tempRegion);
    setLocale(tempLocale);
    closeModal();
  };

  const languages = [
    { code: "de" as const, label: t("german") },
    { code: "en" as const, label: t("english") },
  ];

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={openModal}
        className={cn(
          "w-10 h-10 rounded-full p-0 flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer shrink-0",
          className,
        )}
        aria-label={t("regionSelectorTitle")}
      >
        <Globe className="w-5 h-5 text-foreground" weight="regular" />
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Dialog Surface */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-dialog-title"
            aria-describedby="region-dialog-description"
            className="relative w-full max-w-md sm:max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[85vh] bg-white text-zinc-900 rounded-[20px] sm:rounded-[24px] border border-zinc-200 shadow-2xl overflow-hidden p-0 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
          >
            {/* Header with edge-to-edge dividing line */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-col gap-1">
              <h2
                id="region-dialog-title"
                className="text-xl font-bold tracking-tight text-zinc-900 leading-tight"
              >
                {t("regionSelectorTitle")}
              </h2>
              <p
                id="region-dialog-description"
                className="text-xs text-zinc-500 font-normal leading-relaxed mt-0.5"
              >
                {t("regionSelectorDescription")}
              </p>
            </div>

            {/* Content */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
              {/* Region Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                  {t("regionLabel")}
                </label>
                <div className="space-y-2">
                  {Object.values(SUPPORTED_REGIONS).map((reg) => {
                    const isSelected = tempRegion === reg.code;
                    return (
                      <button
                        key={reg.code}
                        type="button"
                        onClick={() => setTempRegion(reg.code)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-black bg-zinc-50 font-semibold text-black"
                            : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RegionFlag code={reg.code} />
                          <span className="text-sm font-medium">
                            {reg.nativeName}
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
                  {languages.map((lang) => {
                    const isSelected = tempLocale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTempLocale(lang.code)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-black bg-zinc-50 font-semibold text-black"
                            : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white",
                        )}
                      >
                        <span className="text-sm font-medium">{lang.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-black shrink-0" weight="bold" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer with edge-to-edge dividing line */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
              >
                {t("cancel")}
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
        </div>,
        document.body
      )}
    </>
  );
}
