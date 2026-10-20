"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react";
import type { Locale } from "@/lib/content/site-data";

interface RegionLanguageDialogProps {
  locale: Locale;
  trigger?: React.ReactNode;
  variant?: "pill" | "footer" | "icon";
}

export function RegionLanguageDialog({
  locale,
  trigger,
  variant = "pill",
}: RegionLanguageDialogProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";
  const router = useRouter();
  const isDe = locale === "de-de";

  // Compute current subpath without the locale prefix
  const subpath = pathname.replace(/^\/(de-de|de-en)/, "") || "";

  function handleLanguageSelect(targetLocale: Locale) {
    if (targetLocale === locale) {
      setOpen(false);
      return;
    }
    const targetUrl = `/${targetLocale}${subpath}`;
    setOpen(false);
    router.push(targetUrl);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={
          variant === "footer"
            ? "flex items-center gap-2 text-stone-400 hover:text-white transition-colors cursor-pointer text-xs group focus:outline-none"
            : "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111] hover:border-[#111111] hover:bg-white transition-all cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        }
        aria-label={
          isDe
            ? "Region und Sprache auswählen"
            : "Select region and language"
        }
      >
        {trigger ? (
          trigger
        ) : variant === "footer" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="underline-offset-4 group-hover:underline">
              {isDe
                ? "Region: Deutschland · Deutsch (Ändern)"
                : "Region: Germany · English (Change)"}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm">🇩🇪</span>
            <span className="font-mono text-[11px] font-bold">
              {isDe ? "DE · Deutsch" : "DE · English"}
            </span>
            <span className="text-[10px] text-[#646464] transition-transform group-hover:translate-y-0.5">
              ▾
            </span>
          </>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <Dialog.Popup className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E5E2] shadow-2xl space-y-6 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E5E2] pb-5">
              <div className="space-y-1">
                <Dialog.Title className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                  {isDe ? "Region & Sprache" : "Region & Language"}
                </Dialog.Title>
                <Dialog.Description className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                  {isDe
                    ? "Wähle deine Betriebsregion und bevorzugte Sprache für Zackisch."
                    : "Select your operating region and language preference for Zackisch."}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="w-9 h-9 rounded-full border border-[#E5E5E2] bg-[#FAF9F6] text-[#646464] hover:text-[#111111] hover:bg-stone-100 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                aria-label={isDe ? "Schließen" : "Close"}
              >
                ✕
              </Dialog.Close>
            </div>

            {/* Section 1: Region / Country */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#646464]">
                <span>{isDe ? "Betriebsregion" : "Operating Region"}</span>
                <span className="text-[11px] font-normal lowercase tracking-normal text-[#646464]">
                  {isDe
                    ? "Zurzeit ausschließlich Deutschland aktiv"
                    : "Currently only Germany active"}
                </span>
              </div>

              <div className="space-y-2">
                {/* Germany (Active) */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#111111] bg-[#FAF9F6] shadow-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl shrink-0">🇩🇪</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#111111] flex items-center gap-2">
                        <span>Deutschland (DE)</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      </div>
                      <div className="text-xs text-[#52525B] truncate">
                        {isDe
                          ? "KassenSichV-Ergänzung · Stripe DACH · EUR (€)"
                          : "German POS supplementary model · Stripe DACH · EUR (€)"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#111111] text-white shrink-0">
                    {isDe ? "Aktiv" : "Active"}
                  </span>
                </div>

                {/* Austria (Coming soon) */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5E5E2] bg-white opacity-60 cursor-not-allowed gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl shrink-0">🇦🇹</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#111111]">
                        Österreich (AT)
                      </div>
                      <div className="text-xs text-[#646464] break-words">
                        {isDe
                          ? "RKSV-Fiskalisierung in Vorbereitung"
                          : "RKSV fiscal regulation in preparation"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-[#646464] border border-[#E5E5E2] shrink-0">
                    {isDe ? "Demnächst" : "Coming soon"}
                  </span>
                </div>

                {/* Switzerland (Coming soon) */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5E5E2] bg-white opacity-60 cursor-not-allowed gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl shrink-0">🇨🇭</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#111111]">
                        Schweiz (CH)
                      </div>
                      <div className="text-xs text-[#646464] break-words">
                        {isDe
                          ? "CHF-Abrechnung & MWST in Vorbereitung"
                          : "CHF currency billing & VAT in preparation"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-[#646464] border border-[#E5E5E2] shrink-0">
                    {isDe ? "Demnächst" : "Coming soon"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Language */}
            <div className="space-y-3 pt-2 border-t border-[#E5E5E2]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#646464]">
                {isDe ? "Sprache der Website" : "Website Language"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* German Button */}
                <button
                  type="button"
                  onClick={() => handleLanguageSelect("de-de")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isDe
                      ? "border-2 border-[#111111] bg-[#FAF9F6] shadow-xs"
                      : "border-[#E5E5E2] bg-white hover:border-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111111]">
                      Deutsch (DE)
                    </span>
                    {isDe && (
                      <span className="w-2 h-2 rounded-full bg-[#111111]" />
                    )}
                  </div>
                  <span className="text-xs text-[#52525B]">
                    {isDe
                      ? "Ausführliche deutsche Version mit regionalen Begriffen."
                      : "German localized content and German legal disclosures."}
                  </span>
                </button>

                {/* English Button */}
                <button
                  type="button"
                  onClick={() => handleLanguageSelect("de-en")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    !isDe
                      ? "border-2 border-[#111111] bg-[#FAF9F6] shadow-xs"
                      : "border-[#E5E5E2] bg-white hover:border-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#111111]">
                      English (EN)
                    </span>
                    {!isDe && (
                      <span className="w-2 h-2 rounded-full bg-[#111111]" />
                    )}
                  </div>
                  <span className="text-xs text-[#52525B]">
                    {isDe
                      ? "International verständliche englische Sprachfassung."
                      : "International English version for DACH venues."}
                  </span>
                </button>
              </div>
            </div>

            {/* Note & Close info */}
            <div className="pt-2 border-t border-[#E5E5E2] flex items-center justify-between text-xs text-[#646464]">
              <span>
                {isDe
                  ? "Auswahl wechselt die Sprache sofort auf der aktuellen Seite."
                  : "Selection updates language immediately on current page."}
              </span>
              <Dialog.Close className="px-4 py-2 rounded-full bg-[#111111] text-white font-semibold hover:bg-black transition-all cursor-pointer">
                {isDe ? "Fertig" : "Done"}
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
