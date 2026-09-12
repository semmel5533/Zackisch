"use client";

import { useState } from "react";
import { Globe, Check } from "@phosphor-icons/react";
import { useRegionStore } from "@/store/region-store";
import { useLanguageStore } from "@/store/language-store";
import { SUPPORTED_REGIONS } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  // Local draft state when modal is open
  const [tempRegion, setTempRegion] = useState(region);
  const [tempLocale, setTempLocale] = useState(locale);

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
          "w-10 h-10 rounded-full p-0 flex items-center justify-center transition-all active:scale-[0.98]",
          className,
        )}
        aria-label={t("regionSelectorTitle")}
      >
        <Globe className="w-5 h-5 text-foreground" weight="bold" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] sm:w-full max-w-md max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] p-0 sm:p-0 flex flex-col bg-card text-card-foreground rounded-[20px] sm:rounded-[24px] border border-border shadow-2xl overflow-hidden gap-0"
        >
          {/* Header with edge-to-edge dividing line */}
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border shrink-0 bg-card text-left flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground leading-tight">
              {t("regionSelectorTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-normal leading-relaxed mt-0.5">
              {t("regionSelectorDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
            {/* Region Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
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
                          ? "border-foreground bg-muted/60 font-semibold text-foreground"
                          : "border-border hover:border-muted-foreground/40 text-foreground bg-background",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <RegionFlag code={reg.code} />
                        <span className="text-sm font-medium">
                          {reg.nativeName}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-foreground shrink-0" weight="bold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
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
                          ? "border-foreground bg-muted/60 font-semibold text-foreground"
                          : "border-border hover:border-muted-foreground/40 text-foreground bg-background",
                      )}
                    >
                      <span className="text-sm font-medium">{lang.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-foreground shrink-0" weight="bold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with edge-to-edge dividing line */}
          <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-border shrink-0 bg-card flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="w-full sm:flex-1 rounded-full h-11 border-border font-semibold text-foreground hover:bg-muted"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="w-full sm:flex-1 rounded-full h-11 bg-primary text-primary-foreground font-semibold active:scale-[0.98] transition-all"
            >
              {t("saveAndContinue")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
