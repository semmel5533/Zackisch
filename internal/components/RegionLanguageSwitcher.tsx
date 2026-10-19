"use client";

import React, { useState } from "react";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Icon } from "@astryxdesign/core/Icon";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { SelectableCard } from "@astryxdesign/core/SelectableCard";
import { Badge } from "@astryxdesign/core/Badge";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Text } from "@astryxdesign/core/Text";
import { Divider } from "@astryxdesign/core/Divider";
import { useAdmin } from "@/lib/admin-context";

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

  const activeRegionObj =
    ADMIN_SUPPORTED_REGIONS.find((r) => r.code === currentRegion) || ADMIN_SUPPORTED_REGIONS[0];

  const triggerLabel = `${activeRegionObj.code.toUpperCase()} · ${currentLocale.toUpperCase()}`;

  return (
    <>
      {variant === "pill" ? (
        <Button
          label={t("regionSelectorTitle") || triggerLabel}
          variant="secondary"
          size="sm"
          icon={<Icon icon={Globe} />}
          onClick={handleOpen}
        >
          {triggerLabel}
        </Button>
      ) : (
        <IconButton
          label={t("regionSelectorTitle") || "Region & Sprache"}
          tooltip={t("regionSelectorTitle") || "Region & Sprache"}
          icon={<Icon icon={Globe} />}
          variant="secondary"
          size="sm"
          onClick={handleOpen}
        />
      )}

      <Dialog isOpen={open} onOpenChange={setOpen} width={440} purpose="form">
        <VStack gap={4}>
          <DialogHeader
            title={
              currentLocale === "en" ? "Select Region & Language" : "Region & Sprache auswählen"
            }
            subtitle={
              currentLocale === "en"
                ? "Choose your operating market and interface language"
                : "Wähle deine Geschäftsregion und die Anzeigesprache"
            }
            onOpenChange={setOpen}
          />

          <VStack gap={2}>
            <Text type="label" color="secondary">
              {currentLocale === "en" ? "Operating Region" : "Geschäftsregion"}
            </Text>
            <VStack gap={1.5}>
              {ADMIN_SUPPORTED_REGIONS.map((r) => {
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
                          variant={r.status === "active" ? "green" : "neutral"}
                          label={
                            r.status === "active"
                              ? currentLocale === "en"
                                ? "Active"
                                : "Aktiv"
                              : currentLocale === "en"
                                ? "Planned"
                                : "In Vorbereitung"
                          }
                        />
                      </HStack>
                      {isSelected && <Icon icon="check" color="accent" size="sm" />}
                    </HStack>
                  </SelectableCard>
                );
              })}
            </VStack>
          </VStack>

          <VStack gap={2}>
            <Text type="label" color="secondary">
              {currentLocale === "en" ? "Interface Language" : "Anzeigesprache"}
            </Text>
            <Grid columns={2} gap={2}>
              {languages.map((l) => {
                const isSelected = draftLocale === l.code;
                return (
                  <SelectableCard
                    key={l.code}
                    label={l.label}
                    isSelected={isSelected}
                    onChange={() => setDraftLocale(l.code)}
                    padding={3}
                  >
                    <HStack justify="between" vAlign="center">
                      <Text weight="semibold">{l.label}</Text>
                      {isSelected && <Icon icon="check" color="accent" size="sm" />}
                    </HStack>
                  </SelectableCard>
                );
              })}
            </Grid>
          </VStack>

          <Divider />

          <HStack justify="end" gap={2}>
            <Button
              label={currentLocale === "en" ? "Cancel" : "Abbrechen"}
              variant="secondary"
              onClick={() => setOpen(false)}
            />
            <Button
              label={currentLocale === "en" ? "Save & Apply" : "Speichern & Anwenden"}
              variant="primary"
              onClick={handleSave}
            />
          </HStack>
        </VStack>
      </Dialog>
    </>
  );
}
