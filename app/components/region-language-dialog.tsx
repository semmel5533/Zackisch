"use client";

import { useState } from "react";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { useTranslation } from "@/lib/i18n";
import { SUPPORTED_REGIONS, getRegion } from "@/lib/regions";
import { useLanguageStore } from "@/store/language-store";
import { useRegionStore } from "@/store/region-store";

interface RegionLanguageSwitcherProps {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isFullWidth?: boolean;
}

export function RegionFlag({ code }: { code: string; className?: string }) {
  if (code.toLowerCase() !== "de") return null;
  return (
    <svg
      viewBox="0 0 640 480"
      style={{ width: 22, height: 16, borderRadius: 2, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path fill="#000000" d="M0 0h640v160H0z" />
      <path fill="#DD0000" d="M0 160h640v160H0z" />
      <path fill="#FFCE00" d="M0 320h640v160H0z" />
    </svg>
  );
}

export function RegionLanguageSwitcher({
  variant = "ghost",
  size = "lg",
  isFullWidth = false,
  className,
}: RegionLanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const [draftRegion, setDraftRegion] = useState(region);
  const [draftLocale, setDraftLocale] = useState(locale);
  const { t } = useTranslation();
  const currentRegion = getRegion(region);
  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setDraftRegion(region);
          setDraftLocale(locale);
        }
        setOpen(next);
      }}
      title={t("regionSelectorTitle")}
      description={t("regionSelectorDescription")}
      closeLabel={t("close")}
      trigger={
        <Button
          variant={variant}
          size={size}
          fullWidth={isFullWidth}
          iconOnly={!isFullWidth}
          className={className}
          aria-label={t("regionSelectorTitle")}
        >
          <Globe size={20} aria-hidden="true" />
          {isFullWidth &&
            `${currentRegion.name[locale]} · ${t(locale === "de" ? "german" : "english")}`}
        </Button>
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              setRegion(draftRegion);
              setLocale(draftLocale);
              setOpen(false);
            }}
          >
            {t("saveAndContinue")}
          </Button>
        </>
      }
    >
      <div className="zk-preferences">
        <ChoiceGroup
          label={t("regionLabel")}
          value={draftRegion}
          onChange={setDraftRegion}
          options={Object.values(SUPPORTED_REGIONS).map((r) => ({
            value: r.code,
            label: `${r.name[locale]} · ${r.defaultCurrency}`,
          }))}
        />
        <ChoiceGroup
          label={t("languageLabel")}
          value={draftLocale}
          onChange={setDraftLocale}
          options={[
            { value: "de", label: t("german") },
            { value: "en", label: t("english") },
          ]}
        />
      </div>
    </Modal>
  );
}
