"use client";

import { useState, type ReactNode } from "react";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export function LanguageSwitcher({
  variant = "secondary",
  size = "lg",
  children,
  className,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLanguageStore();
  const [draftLocale, setDraftLocale] = useState(locale);
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setDraftLocale(locale);
        setOpen(next);
      }}
      title={t("languageSelectorTitle")}
      description={t("languageSelectorDescription")}
      closeLabel={t("close")}
      trigger={
        <Button
          variant={variant}
          size={size}
          className={className}
          iconOnly={!children}
          aria-label={t("languageSelectorTitle")}
        >
          {children ?? <Globe size={20} aria-hidden="true" />}
        </Button>
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              setLocale(draftLocale);
              setOpen(false);
            }}
          >
            {t("saveAndContinue")}
          </Button>
        </>
      }
    >
      <ChoiceGroup
        label={t("languageLabel")}
        value={draftLocale}
        onChange={setDraftLocale}
        options={[
          { value: "de", label: t("german") },
          { value: "en", label: t("english") },
        ]}
      />
    </Modal>
  );
}
