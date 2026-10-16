"use client";

import { useRef, useState } from "react";
import { Check, Globe } from "@phosphor-icons/react";
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
import { SUPPORTED_REGIONS } from "@/lib/regions";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { useRegionStore } from "@/store/region-store";

interface RegionLanguageSwitcherProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function RegionFlag({ code, className }: { code: string; className?: string }) {
  if (code.toLowerCase() !== "de") return null;
  return (
    <svg
      viewBox="0 0 640 480"
      className={cn("h-4.5 w-6 shrink-0 overflow-hidden rounded-sm border border-black/10 object-cover", className)}
      aria-hidden="true"
    >
      <path fill="#000000" d="M0 0h640v160H0z" />
      <path fill="#DD0000" d="M0 160h640v160H0z" />
      <path fill="#FFCE00" d="M0 320h640v160H0z" />
    </svg>
  );
}

export function RegionLanguageSwitcher({
  className,
  variant = "outline",
  size = "icon",
}: RegionLanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const [draftRegion, setDraftRegion] = useState(region);
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
          setDraftRegion(region);
          setDraftLocale(locale);
          setOpen(true);
        }}
        aria-label={t("regionSelectorTitle")}
      >
        <Globe className="size-5" weight="regular" />
      </Button>
      <Dialog open={open} onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
        else close();
      }}>
        <DialogContent finalFocus={triggerRef}>
          <DialogHeader>
            <DialogTitle>{t("regionSelectorTitle")}</DialogTitle>
            <DialogDescription>{t("regionSelectorDescription")}</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-5">
            <fieldset>
              <legend className="mb-2.5 text-sm font-bold text-foreground">
                {t("regionLabel")}
              </legend>
              <div className="space-y-2">
                {Object.values(SUPPORTED_REGIONS).map((option) => {
                  const selected = draftRegion === option.code;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setDraftRegion(option.code)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected
                          ? "border-foreground bg-muted text-foreground"
                          : "border-border bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <RegionFlag code={option.code} />
                        {option.nativeName}
                      </span>
                      {selected && <Check className="size-4 shrink-0" weight="bold" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
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
                          : "border-border bg-background text-foreground hover:bg-muted",
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
            <Button type="button" variant="outline" onClick={close} className="w-full sm:flex-1 border-border">
              {t("cancel")}
            </Button>
            <Button type="button" onClick={() => {
              setRegion(draftRegion);
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
