"use client";

import React, { useState } from "react";
import { Globe, Check, X } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

export function RegionFlag({ code, className }: { code: string; className?: string }) {
  const c = code.toLowerCase();
  if (c === "de") {
    return (
      <svg
        viewBox="0 0 640 480"
        className={`h-4.5 w-6 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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
        className={`h-4.5 w-6 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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
        className={`h-4.5 w-6 shrink-0 overflow-hidden rounded-xs border border-black/10 object-cover ${className || ""}`}
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
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const { currentRegion, setCurrentRegion, currentLocale, setCurrentLocale, t } = useAdmin();

  const [draftRegion, setDraftRegion] = useState(currentRegion);
  const [draftLocale, setDraftLocale] = useState(currentLocale);

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

  const activeRegionObj = ADMIN_SUPPORTED_REGIONS.find((r) => r.code === currentRegion) || ADMIN_SUPPORTED_REGIONS[0];

  return (
    <>
      {variant === "pill" ? (
        <button
          type="button"
          onClick={handleOpen}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-all shadow-2xs ${className || ""}`}
          aria-label={t("regionSelectorTitle") || "Region & Sprache"}
        >
          <RegionFlag code={currentRegion} />
          <span>{activeRegionObj.code.toUpperCase()} · {currentLocale.toUpperCase()}</span>
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className={`p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-all shadow-2xs ${className || ""}`}
          aria-label={t("regionSelectorTitle") || "Region & Sprache"}
        >
          <Globe className="w-4 h-4 text-zinc-600" />
        </button>
      )}

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  {currentLocale === "en" ? "Select Region & Language" : "Region & Sprache auswählen"}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentLocale === "en"
                    ? "Choose your operating market and interface language"
                    : "Wähle deine Geschäftsregion und die Anzeigesprache"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Region Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                {currentLocale === "en" ? "Operating Region" : "Geschäftsregion"}
              </label>
              <div className="space-y-1.5">
                {ADMIN_SUPPORTED_REGIONS.map((r) => {
                  const isSelected = draftRegion === r.code;
                  return (
                    <button
                      key={r.code}
                      type="button"
                      onClick={() => setDraftRegion(r.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "border-black bg-zinc-50 text-black font-semibold shadow-2xs"
                          : "border-zinc-200/80 bg-white text-zinc-700 hover:bg-zinc-50/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RegionFlag code={r.code} />
                        <span>{r.nativeName}</span>
                        {r.status === "active" ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            {currentLocale === "en" ? "Active" : "Aktiv"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
                            {currentLocale === "en" ? "Planned" : "In Vorbereitung"}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                {currentLocale === "en" ? "Interface Language" : "Anzeigesprache"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((l) => {
                  const isSelected = draftLocale === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setDraftLocale(l.code)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "border-black bg-zinc-50 text-black font-semibold shadow-2xs"
                          : "border-zinc-200/80 bg-white text-zinc-700 hover:bg-zinc-50/60"
                      }`}
                    >
                      <span>{l.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-50 transition-all"
              >
                {currentLocale === "en" ? "Cancel" : "Abbrechen"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-2xs"
              >
                {currentLocale === "en" ? "Save & Apply" : "Speichern & Anwenden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
