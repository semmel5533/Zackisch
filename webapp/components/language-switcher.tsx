"use client";

import { useRef, useState } from "react";
import { Globe, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";

interface LanguageSwitcherProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  children?: React.ReactNode;
}

export function LanguageSwitcher({
  className,
  variant = "outline",
  size = "icon",
  children,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLanguageStore();
  const [draftLocale, setDraftLocale] = useState(locale);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  function close() {
    setOpen(false);
  }

  const languages = [
    { code: "de" as const, label: t("german") },
    { code: "en" as const, label: t("english") },
  ];

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={variant}
        size={size}
        className={cn("shrink-0", className)}
        onClick={() => {
          setDraftLocale(locale);
          setOpen(true);
        }}
        aria-label={t("languageSelectorTitle")}
      >
        {children ?? <Globe weight="regular" className="size-5" />}
      </Button>
      <Dialog open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
        else close();
      }}>
        <DialogContent finalFocus={triggerRef}>
          <DialogHeader>
            <DialogTitle>{t("languageSelectorTitle")}</DialogTitle>
            <DialogDescription>{t("languageSelectorDescription")}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <fieldset>
              <legend className="mb-2.5 text-sm font-bold text-foreground">
                {t("languageLabel")}
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {languages.map((language) => {
                  const selected = draftLocale === language.code;
                  return (
                    <button
                      key={language.code}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setDraftLocale(language.code)}
                      className={cn(
                        "flex min-h-11 items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected
                          ? "border-foreground bg-muted text-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {language.label}
                      {selected && <Check className="size-4 shrink-0" weight="bold" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} className="w-full sm:flex-1">
              {t("cancel")}
            </Button>
            <Button type="button" onClick={() => {
              setLocale(draftLocale);
              close();
            }} className="w-full sm:flex-1">
              {t("saveAndContinue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
