"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { createTranslator } from "next-intl";
import { REGIONS, parseLocale } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const region = REGIONS[active.regionCode];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      dialog.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen]);

  function handleApply() {
    document.cookie = `zakkig_locale=${selectedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("zakkig_locale", selectedLocale);
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
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(480px,calc(100%-32px))] overflow-hidden rounded-[20px] border border-border bg-background text-foreground shadow-[0_24px_48px_-12px_rgba(0,0,0,.18)] backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 motion-reduce:animate-none sm:rounded-[24px]"
      aria-labelledby="region-title"
      aria-describedby="region-description"
      onClick={(e) => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          onClose();
        }
      }}
      onCancel={onClose}
    >
      <div className="flex flex-col">
        <header className="shrink-0 border-b border-border bg-background px-5 py-4 text-left sm:px-6 sm:py-5">
          <h2 id="region-title" className="text-xl font-bold leading-tight tracking-tight text-foreground">{t("regionSelectorTitle")}</h2>
          <p id="region-description" className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t("regionSelectorDescription")}</p>
        </header>
        <div className="grid gap-5 overflow-y-auto p-5 sm:p-6">
          <fieldset className="border-0 p-0 m-0 min-w-0">
            <legend className="text-sm font-semibold text-foreground mb-2 normal-case tracking-normal">
              {t("regionLabel")}
            </legend>
            <div className="flex min-h-12 items-center justify-between gap-3 rounded-[12px] border border-foreground bg-muted px-4 py-3 text-sm font-semibold text-foreground">
              <span>{region.nativeName}</span>
              <Check size={16} weight="bold" aria-hidden="true" />
            </div>
          </fieldset>
          <fieldset className="border-0 p-0 m-0 min-w-0">
            <legend className="text-sm font-semibold text-foreground mb-2 normal-case tracking-normal">
              {t("languageLabel")}
            </legend>
            <div className="grid gap-2.5 min-[441px]:grid-cols-2">
              {region.locales.map((loc) => (
                <label
                  key={loc.code}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-[12px] border px-4 py-3 text-sm font-medium transition-colors duration-150 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring motion-reduce:transition-none text-foreground",
                    selectedLocale === loc.code
                      ? "border-foreground bg-muted font-semibold"
                      : "border-input bg-background hover:border-foreground/30 hover:bg-muted",
                  )}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="language"
                    value={loc.code}
                    checked={selectedLocale === loc.code}
                    onChange={() => setSelectedLocale(loc.code)}
                  />
                  <span>{loc.label}</span>
                  {selectedLocale === loc.code && (
                    <Check size={16} weight="bold" aria-hidden="true" />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <footer className="flex w-full shrink-0 flex-col-reverse items-center justify-end gap-2.5 border-t border-border bg-background px-5 py-3.5 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
          <button
            type="button"
            className="h-11 w-full rounded-full border border-input bg-background text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-1"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="h-11 w-full rounded-full border border-primary bg-primary text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-1"
            onClick={handleApply}
          >
            {t("saveAndContinue")}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
