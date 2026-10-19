"use client";

import React, { useState } from "react";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function LanguageSwitcher({
  variant = "secondary",
  size = "lg",
  children,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLanguageStore();
  const [draftLocale, setDraftLocale] = useState(locale);
  const { t } = useTranslation();

  function handleOpen() {
    setDraftLocale(locale);
    setOpen(true);
  }

  function handleSave() {
    setLocale(draftLocale);
    setOpen(false);
  }

  return (
    <>
      {children ? (
        <Button
          variant={variant}
          size={size}
          label={t("languageSelectorTitle")}
          onClick={handleOpen}
        >
          {children}
        </Button>
      ) : (
        <Button
          variant={variant}
          size={size}
          isIconOnly
          label={t("languageSelectorTitle")}
          icon={<Icon icon={Globe} size="sm" />}
          onClick={handleOpen}
        />
      )}

      <Dialog isOpen={open} onOpenChange={setOpen} width={400} purpose="form">
        <VStack gap={4}>
          <DialogHeader
            title={t("languageSelectorTitle")}
            subtitle={
              locale === "en"
                ? "Choose your preferred language"
                : "Wähle deine bevorzugte Sprache"
            }
            onOpenChange={setOpen}
          />

          <VStack gap={2}>
            <Text type="label" color="secondary">
              {t("languageLabel")}
            </Text>
            <SegmentedControl
              label={t("languageLabel")}
              value={draftLocale}
              onChange={(val) => setDraftLocale(val as "de" | "en")}
              size="lg"
            >
              <SegmentedControlItem value="de" label={t("german")} />
              <SegmentedControlItem value="en" label={t("english")} />
            </SegmentedControl>
          </VStack>

          <HStack justify="end" gap={2}>
            <Button
              variant="secondary"
              label={t("cancel")}
              size="lg"
              onClick={() => setOpen(false)}
            />
            <Button
              variant="primary"
              label={t("saveAndContinue")}
              size="lg"
              onClick={handleSave}
            />
          </HStack>
        </VStack>
      </Dialog>
    </>
  );
}
