"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { createTranslator } from "next-intl";
import { REGIONS, parseLocale } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
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

export function RegionLanguageModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { t } = useTranslation();
  const active = parseLocale(pathname);
  const [selectedLocale, setSelectedLocale] = useState(active.locale);
  const region = REGIONS[active.regionCode] || REGIONS.de;

  useEffect(() => {
    if (isOpen) {
      setSelectedLocale(active.locale);
    }
  }, [isOpen, active.locale]);

  function handleApply() {
    document.cookie = `zackisch_locale=${selectedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("zackisch_locale", selectedLocale);
    } catch {
      /* Cookie remains authoritative when storage is unavailable. */
    }
    const { lang } = parseLocale(selectedLocale);
    const target = createTranslator({
      locale: lang,
      messages: translations[lang],
    });
    const route = pathname.split("/")[2];
    const key =
      route === "legal-notice" || route === "legal"
        ? "legalUrl"
        : route === "privacy-policy" || route === "privacy"
          ? "privacyUrl"
          : route === "gtc"
            ? "gtcUrl"
            : "homeUrl";
    onClose();
    router.push(target(key));
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent>
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
              <button
                type="button"
                aria-pressed={true}
                className="flex min-h-11 w-full items-center justify-between rounded-lg border border-foreground bg-muted px-4 py-3 text-left text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex items-center gap-3">
                  <RegionFlag code={region.code} />
                  {region.nativeName}
                </span>
                <Check className="size-4 shrink-0" weight="bold" aria-hidden="true" />
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2.5 text-sm font-bold text-foreground">
              {t("languageLabel")}
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              {region.locales.map((loc) => {
                const selected = selectedLocale === loc.code;
                return (
                  <button
                    key={loc.code}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedLocale(loc.code)}
                    className={cn(
                      "flex min-h-11 items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selected
                        ? "border-foreground bg-muted text-foreground"
                        : "border-input bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    {loc.label}
                    {selected && <Check className="size-4 shrink-0" weight="bold" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:flex-1">
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleApply} className="w-full sm:flex-1">
            {t("saveAndContinue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
