"use client";

import React, { useState } from "react";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { Icon } from "@astryxdesign/core/Icon";
import { SelectableCard } from "@astryxdesign/core/SelectableCard";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { useTranslation } from "@/lib/i18n";
import { SUPPORTED_REGIONS } from "@/lib/regions";
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
}: RegionLanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { region, setRegion } = useRegionStore();
  const { locale, setLocale } = useLanguageStore();
  const [draftRegion, setDraftRegion] = useState(region);
  const [draftLocale, setDraftLocale] = useState(locale);
  const { t } = useTranslation();

  function handleOpen() {
    setDraftRegion(region);
    setDraftLocale(locale);
    setOpen(true);
  }

  function handleSave() {
    setRegion(draftRegion);
    setLocale(draftLocale);
    setOpen(false);
  }

  const currentRegion = SUPPORTED_REGIONS[region] ?? SUPPORTED_REGIONS.DE;
  const currentLocaleLabel = locale === "de" ? "Deutsch" : "English";

  return (
    <>
      {isFullWidth ? (
        <Button
          variant={variant}
          size={size}
          label={`${currentRegion.nativeName} · ${currentLocaleLabel}`}
          icon={<Icon icon={Globe} size="sm" />}
          onClick={handleOpen}
          width="100%"
        />
      ) : (
        <Button
          variant={variant}
          size={size}
          isIconOnly
          label={t("regionSelectorTitle")}
          icon={<Icon icon={Globe} size="sm" />}
          onClick={handleOpen}
        />
      )}

      <Dialog isOpen={open} onOpenChange={setOpen} width={440} purpose="form">
        <VStack gap={4}>
          <DialogHeader
            title={t("regionSelectorTitle")}
            subtitle={
              locale === "en"
                ? "Choose your operating market and interface language"
                : "Wähle deine Geschäftsregion und die Anzeigesprache"
            }
            onOpenChange={setOpen}
          />

          <VStack gap={2}>
            <Text type="label" color="secondary">
              {t("regionLabel")}
            </Text>
            <VStack gap={2}>
              {Object.values(SUPPORTED_REGIONS).map((r) => {
                const isSelected = draftRegion === r.code;
                return (
                  <SelectableCard
                    key={r.code}
                    label={r.nativeName}
                    isSelected={isSelected}
                    onChange={() => setDraftRegion(r.code)}
                    padding={3}
                  >
                    <HStack justify="between" vAlign="center" gap={2}>
                      <HStack gap={2} vAlign="center">
                        <RegionFlag code={r.code} />
                        <Text weight="semibold">{r.nativeName}</Text>
                        <Badge
                          variant="green"
                          label={locale === "en" ? "Active" : "Aktiv"}
                        />
                      </HStack>
                      <Text color="secondary" type="supporting">
                        {r.defaultCurrency} (€)
                      </Text>
                    </HStack>
                  </SelectableCard>
                );
              })}
            </VStack>
          </VStack>

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
