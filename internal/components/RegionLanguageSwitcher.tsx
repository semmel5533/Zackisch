"use client";

import React, { useState } from "react";
import { Globe, Check } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { Button, Modal, Badge, Divider } from "@/components/ui/primitives";

export function RegionFlag({ code, className }: { code: string; className?: string }) {
  const c = code.toLowerCase();
  if (c === "de") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={`h-4 w-5 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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
        className={`h-4 w-5 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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
        className={`h-4 w-5 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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

export const ADMIN_SUPPORTED_REGIONS = [
  { code: "de", name: "Deutschland", nativeName: "Deutschland", status: "active" },
  { code: "at", name: "Österreich", nativeName: "Österreich", status: "planned" },
  { code: "ch", name: "Schweiz", nativeName: "Schweiz", status: "planned" },
] as const;

export function RegionLanguageSwitcher({
  variant = "pill",
  className = "",
}: {
  className?: string;
  variant?: "pill" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const { currentRegion, setCurrentRegion, currentLocale, setCurrentLocale, t } =
    useAdmin();

  const [draftRegion, setDraftRegion] = useState(currentRegion);
  const [draftLocale, setDraftLocale] = useState<"de" | "en">(currentLocale);

  const languages = [
    { code: "de" as const, label: "Deutsch" },
    { code: "en" as const, label: "English" },
  ];

  const handleOpen = () => {
    setDraftRegion(currentRegion);
    setDraftLocale(currentLocale);
    setOpen(true);
  };

  const handleSave = () => {
    setCurrentRegion(draftRegion);
    setCurrentLocale(draftLocale);
    setOpen(false);
  };

  const activeRegionObj =
    ADMIN_SUPPORTED_REGIONS.find((r) => r.code === currentRegion) ||
    ADMIN_SUPPORTED_REGIONS[0];

  const triggerLabel = `${activeRegionObj.code.toUpperCase()} · ${currentLocale.toUpperCase()}`;

  return (
    <>
      {variant === "pill" ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpen}
          className={className}
        >
          <Globe className="size-4" aria-hidden="true" />
          <span>{triggerLabel}</span>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          iconOnly
          aria-label={t("regionSelectorTitle") || "Region & Sprache"}
          onClick={handleOpen}
          className={className}
        >
          <Globe className="size-4" aria-hidden="true" />
        </Button>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={
          currentLocale === "en"
            ? "Select Region & Language"
            : "Region & Sprache auswählen"
        }
        description={
          currentLocale === "en"
            ? "Choose your operating market and interface language"
            : "Wähle deine Geschäftsregion und die Anzeigesprache"
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              {currentLocale === "en" ? "Cancel" : "Abbrechen"}
            </Button>
            <Button variant="primary" type="button" onClick={handleSave}>
              {currentLocale === "en" ? "Save & Apply" : "Speichern & Anwenden"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="zk-label">
              {currentLocale === "en" ? "Operating Region" : "Geschäftsregion"}
            </span>
            <div className="flex flex-col gap-2">
              {ADMIN_SUPPORTED_REGIONS.map((r) => {
                const isSelected = draftRegion === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => setDraftRegion(r.code)}
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "border-[var(--zk-link)] bg-[var(--zk-info-bg)]"
                        : "border-[var(--zk-border)] bg-[var(--zk-surface)] hover:bg-[var(--zk-surface-muted)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <RegionFlag code={r.code} />
                      <span className="font-semibold text-sm text-[var(--zk-text)]">
                        {r.nativeName}
                      </span>
                      <Badge variant={r.status === "active" ? "success" : "neutral"}>
                        {r.status === "active"
                          ? currentLocale === "en"
                            ? "Active"
                            : "Aktiv"
                          : currentLocale === "en"
                            ? "Planned"
                            : "In Vorbereitung"}
                      </Badge>
                    </div>
                    {isSelected && (
                      <Check
                        className="size-4 text-[var(--zk-link)]"
                        weight="bold"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-2">
            <span className="zk-label">
              {currentLocale === "en" ? "Interface Language" : "Anzeigesprache"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => {
                const isSelected = draftLocale === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setDraftLocale(l.code)}
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "border-[var(--zk-link)] bg-[var(--zk-info-bg)]"
                        : "border-[var(--zk-border)] bg-[var(--zk-surface)] hover:bg-[var(--zk-surface-muted)]"
                    }`}
                  >
                    <span className="font-semibold text-sm text-[var(--zk-text)]">
                      {l.label}
                    </span>
                    {isSelected && (
                      <Check
                        className="size-4 text-[var(--zk-link)]"
                        weight="bold"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
