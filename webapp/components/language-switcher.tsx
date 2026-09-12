"use client";

import { useState } from "react";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  // Local draft state while modal is open
  const [tempLocale, setTempLocale] = useState(locale);

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
        className={cn("gap-2", className)}
        onClick={openModal}
        aria-label={t("languageSelectorTitle")}
      >
        {children ? (
          children
        ) : (
          <>
            <Globe weight="regular" className={size === "sm" ? "w-4 h-4" : "w-4.5 h-4.5"} />
            <span suppressHydrationWarning>{locale.toUpperCase()}</span>
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] sm:w-full max-w-md p-0 sm:p-0 flex flex-col bg-card text-card-foreground rounded-[24px] border border-border shadow-2xl overflow-hidden gap-0"
        >
          {/* Header with edge-to-edge dividing line */}
          <DialogHeader className="px-6 py-4 sm:py-5 border-b border-border shrink-0 bg-card text-left flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground leading-tight">
              {t("languageSelectorTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-normal leading-relaxed mt-0.5">
              {t("languageSelectorDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto">
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
          <div className="px-6 py-4 border-t border-border shrink-0 bg-card flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
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
