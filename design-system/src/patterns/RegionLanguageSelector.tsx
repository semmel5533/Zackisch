"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import { Button } from "../components/Button";
import { cn } from "../utils/cn";

export interface RegionOption {
  code: string;
  nativeName: string;
  status?: "active" | "planned";
}

export interface LanguageOption {
  code: string;
  label: string;
}

export interface RegionLanguageLabels {
  title: string;
  description: string;
  regionLegend: string;
  languageLegend: string;
  activeBadge: string;
  plannedBadge: string;
  cancel: string;
  saveAndApply: string;
  triggerAriaLabel: string;
}

export const DEFAULT_REGIONS: RegionOption[] = [
  { code: "de", nativeName: "Deutschland", status: "active" },
];

export const DACH_REGIONS: RegionOption[] = [
  { code: "de", nativeName: "Deutschland", status: "active" },
  { code: "at", nativeName: "Österreich", status: "planned" },
  { code: "ch", nativeName: "Schweiz", status: "planned" },
];

export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

export function getRegionLanguageLabels(
  languageCode: string,
  overrides?: Partial<RegionLanguageLabels>
): RegionLanguageLabels {
  const isEn = languageCode.toLowerCase().startsWith("en") || languageCode.toLowerCase().endsWith("-en");
  const defaults: RegionLanguageLabels = isEn
    ? {
        title: "Region & Language",
        description: "Select your operating region and interface display language.",
        regionLegend: "Operating Region",
        languageLegend: "Display Language",
        activeBadge: "Active",
        plannedBadge: "Coming soon",
        cancel: "Cancel",
        saveAndApply: "Save & Apply",
        triggerAriaLabel: "Change region and language",
      }
    : {
        title: "Region & Sprache",
        description: "Wähle deine Geschäftsregion und die gewünschte Anzeigesprache.",
        regionLegend: "Geschäftsregion",
        languageLegend: "Anzeigesprache",
        activeBadge: "Aktiv",
        plannedBadge: "In Vorbereitung",
        cancel: "Abbrechen",
        saveAndApply: "Speichern & Anwenden",
        triggerAriaLabel: "Region und Sprache ändern",
      };
  return { ...defaults, ...overrides };
}

export function RegionFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const c = code.toLowerCase();
  if (c === "de") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={cn(
          "h-4 w-5.5 shrink-0 overflow-hidden rounded-xs border border-black/15 object-cover",
          className
        )}
        aria-hidden="true"
      >
        <path fill="#000000" d="M0 0h640v160H0z" />
        <path fill="#DD0000" d="M0 160h640v160H0z" />
        <path fill="#FFCE00" d="M0 320h640v160H0z" />
      </svg>
    );
  }
  if (c === "at") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={cn(
          "h-4 w-5.5 shrink-0 overflow-hidden rounded-xs border border-black/15 object-cover",
          className
        )}
        aria-hidden="true"
      >
        <path fill="#ED2939" d="M0 0h640v160H0z" />
        <path fill="#FFFFFF" d="M0 160h640v160H0z" />
        <path fill="#ED2939" d="M0 320h640v160H0z" />
      </svg>
    );
  }
  if (c === "ch") {
    return (
      <svg
        viewBox="0 0 512 512"
        className={cn(
          "h-4 w-5.5 shrink-0 overflow-hidden rounded-xs border border-black/15 object-cover",
          className
        )}
        aria-hidden="true"
      >
        <path fill="#D52B1E" d="M0 0h512v512H0z" />
        <path fill="#FFFFFF" d="M206 100h100v312H206z" />
        <path fill="#FFFFFF" d="M100 206h312v100H100z" />
      </svg>
    );
  }
  return null;
}

function GlobeSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={cn("size-4 shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15" />
      <path d="M10 2.5c2.2 2.1 3.4 4.7 3.4 7.5S12.2 15.4 10 17.5c-2.2-2.1-3.4-4.7-3.4-7.5S7.8 4.6 10 2.5z" />
    </svg>
  );
}

function CheckSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("size-4 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 4.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface RegionLanguageTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  regionCode: string;
  languageCode: string;
  languageLabel?: string;
  variant?: "pill" | "icon" | "compact";
  ariaLabel?: string;
}

export const RegionLanguageTrigger = forwardRef<
  HTMLButtonElement,
  RegionLanguageTriggerProps
>(
  (
    {
      regionCode,
      languageCode,
      languageLabel,
      variant = "pill",
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const normalizedLang = languageCode.includes("-")
      ? languageCode.split("-")[1] || languageCode
      : languageCode;
    const displayLang =
      languageLabel ?? (normalizedLang.toLowerCase() === "en" ? "English" : "Deutsch");
    const computedAriaLabel =
      ariaLabel ??
      `${getRegionLanguageLabels(normalizedLang).triggerAriaLabel} (${regionCode.toUpperCase()} · ${displayLang})`;

    if (variant === "icon") {
      return (
        <button
          ref={ref}
          type="button"
          aria-label={computedAriaLabel}
          className={cn(
            "inline-flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-(--zds-border) bg-(--zds-surface-card) text-(--zds-text-primary) transition-colors hover:bg-(--zds-surface-muted) focus-visible:outline-2 focus-visible:outline-(--zds-focus) focus-visible:outline-offset-2",
            className
          )}
          {...props}
        >
          <GlobeSvg className="size-5" />
        </button>
      );
    }

    if (variant === "compact") {
      return (
        <button
          ref={ref}
          type="button"
          aria-label={computedAriaLabel}
          className={cn(
            "inline-flex min-h-9 items-center gap-2 rounded-full border border-(--zds-border-subtle) bg-(--zds-surface-card) px-3 py-1.5 text-xs font-semibold text-(--zds-text-primary) transition-colors hover:bg-(--zds-surface-muted) focus-visible:outline-2 focus-visible:outline-(--zds-focus) focus-visible:outline-offset-2",
            className
          )}
          {...props}
        >
          <RegionFlag code={regionCode} />
          <span>
            {regionCode.toUpperCase()} · {normalizedLang.toUpperCase()}
          </span>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={computedAriaLabel}
        className={cn(
          "inline-flex min-h-11 items-center gap-2.5 rounded-full border border-(--zds-border) bg-(--zds-surface-card) px-4 py-2 text-xs font-semibold text-(--zds-text-primary) transition-colors hover:bg-(--zds-surface-muted) focus-visible:outline-2 focus-visible:outline-(--zds-focus) focus-visible:outline-offset-2",
          className
        )}
        {...props}
      >
        <RegionFlag code={regionCode} />
        <span>{displayLang}</span>
        <GlobeSvg className="size-4 text-(--zds-text-secondary)" />
      </button>
    );
  }
);

RegionLanguageTrigger.displayName = "RegionLanguageTrigger";

export interface RegionLanguageSelectorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  regionCode: string;
  languageCode: string;
  regions?: RegionOption[];
  languages?: LanguageOption[];
  allowPlannedRegions?: boolean;
  rbacNotice?: string;
  labels?: Partial<RegionLanguageLabels>;
  onApply: (selection: { regionCode: string; languageCode: string }) => void;
  showTrigger?: boolean;
  triggerVariant?: "pill" | "icon" | "compact";
  triggerClassName?: string;
  triggerLanguageLabel?: string;
}

/**
 * Shared Region & Language Selector Pattern across root, app, support, and internal.
 * Separates Operating Region / Market from Display Language and preserves accessible focus.
 */
export function RegionLanguageSelector({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  regionCode,
  languageCode,
  regions = DEFAULT_REGIONS,
  languages = DEFAULT_LANGUAGES,
  allowPlannedRegions = false,
  rbacNotice,
  labels: labelOverrides,
  onApply,
  showTrigger = false,
  triggerVariant = "pill",
  triggerClassName,
  triggerLanguageLabel,
}: RegionLanguageSelectorProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    controlledOnOpenChange?.(nextOpen);
  };

  const [draftRegion, setDraftRegion] = useState(regionCode);
  const [draftLanguage, setDraftLanguage] = useState(languageCode);

  useEffect(() => {
    if (isOpen) {
      setDraftRegion(regionCode);
      setDraftLanguage(languageCode);
    }
  }, [isOpen, regionCode, languageCode]);

  const labels = getRegionLanguageLabels(draftLanguage || languageCode, labelOverrides);

  const handleConfirm = () => {
    onApply({ regionCode: draftRegion, languageCode: draftLanguage });
    setOpen(false);
  };

  return (
    <>
      {showTrigger && (
        <RegionLanguageTrigger
          regionCode={regionCode}
          languageCode={languageCode}
          languageLabel={triggerLanguageLabel}
          variant={triggerVariant}
          className={triggerClassName}
          ariaLabel={labels.triggerAriaLabel}
          onClick={() => setOpen(true)}
        />
      )}
      <BaseDialog.Root open={isOpen} onOpenChange={setOpen}>
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
            <BaseDialog.Popup
              data-testid="zds-region-language-dialog"
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-(--zds-border-subtle) bg-(--zds-surface-card) p-6 sm:p-8 shadow-xl space-y-6 transition-all duration-150 animate-in fade-in-0 zoom-in-95"
            >
              <div className="flex items-start justify-between gap-4 border-b border-(--zds-border-subtle) pb-4">
                <div className="space-y-1">
                  <BaseDialog.Title className="text-lg sm:text-xl font-semibold tracking-tight text-(--zds-text-strong) font-brand">
                    {labels.title}
                  </BaseDialog.Title>
                  <BaseDialog.Description className="text-xs sm:text-sm text-(--zds-text-secondary) leading-relaxed">
                    {labels.description}
                  </BaseDialog.Description>
                </div>
                <BaseDialog.Close
                  aria-label={labels.cancel}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-(--zds-text-secondary) hover:bg-(--zds-surface-muted) hover:text-(--zds-text-strong) focus-visible:outline-2 focus-visible:outline-(--zds-focus)"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden="true"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </BaseDialog.Close>
              </div>

              <div className="space-y-5">
                <fieldset className="space-y-2.5">
                  <legend className="text-xs font-semibold uppercase tracking-wider text-(--zds-text-secondary)">
                    {labels.regionLegend}
                  </legend>
                  <div className="space-y-2">
                    {regions.map((region) => {
                      const isSelected = draftRegion.toLowerCase() === region.code.toLowerCase();
                      const isPlanned = region.status === "planned";
                      const isDisabled = isPlanned && !allowPlannedRegions;
                      return (
                        <button
                          key={region.code}
                          type="button"
                          disabled={isDisabled}
                          aria-pressed={isSelected}
                          onClick={() => {
                            if (!isDisabled) {
                              setDraftRegion(region.code);
                            }
                          }}
                          className={cn(
                            "flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-(--zds-focus) focus-visible:outline-offset-2",
                            isSelected
                              ? "border-(--zds-neutral-900) bg-(--zds-surface-muted) text-(--zds-text-strong) font-semibold"
                              : "border-(--zds-border-subtle) bg-(--zds-surface-card) text-(--zds-text-primary) hover:bg-(--zds-surface-page)",
                            isDisabled && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <RegionFlag code={region.code} />
                            <span>{region.nativeName}</span>
                            {regions.length > 1 && (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                  isPlanned
                                    ? "bg-(--zds-surface-muted) text-(--zds-text-secondary)"
                                    : "bg-(--zds-success-bg) text-(--zds-success)"
                                )}
                              >
                                {isPlanned ? labels.plannedBadge : labels.activeBadge}
                              </span>
                            )}
                          </span>
                          {isSelected && <CheckSvg className="text-(--zds-text-strong)" />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="space-y-2.5">
                  <legend className="text-xs font-semibold uppercase tracking-wider text-(--zds-text-secondary)">
                    {labels.languageLegend}
                  </legend>
                  <div className="grid grid-cols-2 gap-2.5">
                    {languages.map((lang) => {
                      const isSelected = draftLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setDraftLanguage(lang.code)}
                          className={cn(
                            "flex min-h-11 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-(--zds-focus) focus-visible:outline-offset-2",
                            isSelected
                              ? "border-(--zds-neutral-900) bg-(--zds-surface-muted) text-(--zds-text-strong) font-semibold"
                              : "border-(--zds-border-subtle) bg-(--zds-surface-card) text-(--zds-text-primary) hover:bg-(--zds-surface-page)"
                          )}
                        >
                          <span>{lang.label}</span>
                          {isSelected && <CheckSvg className="text-(--zds-text-strong)" />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {rbacNotice && (
                  <p className="rounded-xl border border-(--zds-border-subtle) bg-(--zds-surface-page) px-3.5 py-2.5 text-xs text-(--zds-text-secondary) leading-relaxed">
                    {rbacNotice}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 border-t border-(--zds-border-subtle) pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  className="w-full sm:flex-1"
                >
                  {labels.cancel}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleConfirm}
                  className="w-full sm:flex-1"
                >
                  {labels.saveAndApply}
                </Button>
              </div>
            </BaseDialog.Popup>
          </div>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}
