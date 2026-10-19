"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Storefront } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Token } from "@astryxdesign/core/Token";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";

export default function BusinessesPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [search, setSearch] = useState("");

  const businesses = useQuery(
    (anyApi as any).admin.listRegionalBusinesses,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const filtered = (businesses || []).filter(
    (r: any) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.address && r.address.toLowerCase().includes(search.toLowerCase())) ||
      (r.partnerCode && r.partnerCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <VStack gap={5} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>Betriebs- & Gastronomieverwaltung</Heading>
            <Text type="supporting">
              Alle registrierten Betriebe (Restaurants, Cafés, Imbisse, Bars) und Speisekarten in Region{" "}
              {currentRegion.toUpperCase()}.
            </Text>
          </VStack>
        </StackItem>

        <TextInput
          label="Betrieb suchen"
          isLabelHidden
          placeholder="Betrieb suchen..."
          startIcon="search"
          hasClear
          value={search}
          onChange={setSearch}
          width={280}
        />
      </HStack>

      {!businesses ? (
        <VStack hAlign="center" vAlign="center" minHeight={240}>
          <Spinner label="Lade Betriebe..." />
        </VStack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Storefront} size="lg" color="secondary" />}
          title="Keine Betriebe gefunden"
          description="Für diese Suchanfrage oder Region wurden keine Betriebe gefunden."
        />
      ) : (
        <Table
          data={filtered}
          idKey="_id"
          hasHover
          density="balanced"
          columns={[
            {
              key: "name",
              header: "Betrieb",
              width: proportional(2, { minWidth: 200 }),
              renderCell: (r: any) => (
                <VStack gap={0.5}>
                  <HStack gap={1.5} vAlign="center">
                    <Icon icon={Storefront} size="sm" color="secondary" />
                    <Text weight="semibold">{r.name}</Text>
                  </HStack>
                  <Text type="supporting">{r.address || "Keine Adresse angegeben"}</Text>
                </VStack>
              ),
            },
            {
              key: "stripeOnboardingComplete",
              header: "Stripe Onboarding",
              width: proportional(1, { minWidth: 150 }),
              renderCell: (r: any) => (
                <HStack gap={1.5} vAlign="center">
                  <StatusDot
                    variant={r.stripeOnboardingComplete ? "success" : "warning"}
                    label={r.stripeOnboardingComplete ? "Aktiv" : "Ausstehend"}
                  />
                  <Text type="body">
                    {r.stripeOnboardingComplete ? "Aktiv" : "Ausstehend"}
                  </Text>
                </HStack>
              ),
            },
            {
              key: "tablesCount",
              header: "Tische / QR",
              width: pixel(120),
              renderCell: (r: any) => (
                <Text weight="semibold" hasTabularNumbers>
                  {r.tablesCount} Tische
                </Text>
              ),
            },
            {
              key: "mode",
              header: "Modus",
              width: proportional(1, { minWidth: 150 }),
              renderCell: (r: any) => (
                <HStack gap={1} wrap="wrap">
                  {r.isToStayEnabled !== false && (
                    <Token label="Vor Ort" size="sm" />
                  )}
                  {r.isToGoEnabled && <Token label="Abholung" size="sm" />}
                </HStack>
              ),
            },
            {
              key: "partnerCode",
              header: "Partner-Code",
              width: pixel(130),
              renderCell: (r: any) =>
                r.partnerCode ? (
                  <Badge variant="neutral" label={r.partnerCode} />
                ) : (
                  <Text type="supporting">Direkt</Text>
                ),
            },
            {
              key: "actions",
              header: "Aktionen",
              align: "end",
              width: pixel(150),
              renderCell: (r: any) => (
                <Button
                  label="Menü ansehen"
                  href={`https://app.zackisch.com/menu/${r._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                  endContent={<Icon icon="externalLink" size="xsm" />}
                />
              ),
            },
          ]}
        />
      )}
    </VStack>
  );
}
