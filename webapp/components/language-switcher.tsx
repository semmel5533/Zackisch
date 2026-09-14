"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  children?: React.ReactNode;
}

export function LanguageSwitcher({
  className,
  variant = "outline",
  size = "default",
  children,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  // Local draft state while modal is open
  const [tempLocale, setTempLocale] = useState(locale);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTempLocale(locale);
    }
  }, [isOpen, locale]);

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
    setTempLocale(locale);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
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
        className={cn(
          "w-10 h-10 rounded-full p-0 flex items-center justify-center transition-all active:scale-[0.98] cursor-pointer shrink-0",
          className,
        )}
        onClick={openModal}
        aria-label={t("languageSelectorTitle")}
      >
        {children ? (
          children
        ) : (
          <Globe weight="regular" className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
        )}
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
            aria-labelledby="language-dialog-title"
            aria-describedby="language-dialog-description"
            className="relative w-full max-w-md sm:max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[85vh] bg-white text-zinc-900 rounded-[20px] sm:rounded-[24px] border border-zinc-200 shadow-2xl overflow-hidden p-0 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
          >
            {/* Header with edge-to-edge dividing line */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-col gap-1">
              <h2
                id="language-dialog-title"
                className="text-xl font-bold tracking-tight text-zinc-900 leading-tight"
              >
                {t("languageSelectorTitle")}
              </h2>
              <p
                id="language-dialog-description"
                className="text-xs text-zinc-500 font-normal leading-relaxed mt-0.5"
              >
                {t("languageSelectorDescription")}
              </p>
            </div>

            {/* Content */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
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
