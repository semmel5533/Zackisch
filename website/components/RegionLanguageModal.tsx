"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { createTranslator } from "next-intl";
import { REGIONS, parseLocale } from "@/lib/regions";
import { useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/translations";

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
      className="region-dialog"
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
      <div className="region-dialog-inner">
        <header className="region-dialog-header">
          <h2 id="region-title">{t("regionSelectorTitle")}</h2>
          <p id="region-description">{t("regionSelectorDescription")}</p>
        </header>
        <div className="region-dialog-body">
          <fieldset>
            <legend>{t("regionLabel")}</legend>
            <div className="region-option selected">
              <span>{region.nativeName}</span>
              <Check size={18} aria-hidden="true" />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t("languageLabel")}</legend>
            <div className="language-options">
              {region.locales.map((loc) => (
                <label
                  key={loc.code}
                  className={`region-option ${selectedLocale === loc.code ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={loc.code}
                    checked={selectedLocale === loc.code}
                    onChange={() => setSelectedLocale(loc.code)}
                  />
                  <span>{loc.label}</span>
                  {selectedLocale === loc.code && (
                    <Check size={18} aria-hidden="true" />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <footer className="region-dialog-footer">
          <button type="button" className="button-outline" onClick={onClose}>
            {t("cancel")}
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={handleApply}
          >
            {t("saveAndContinue")}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
