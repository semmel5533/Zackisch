"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { ShieldCheck } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { Token } from "@astryxdesign/core/Token";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";

export default function AuditTrailPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [entityFilter, setEntityFilter] = useState("all");
  const [search, setSearch] = useState("");

  const auditLogs = useQuery(
    (anyApi as any).audit.getAuditLogs,
    sessionToken
      ? {
          regionId: currentRegion,
          sessionToken,
          entityType: entityFilter === "all" ? undefined : entityFilter,
          limit: 100,
        }
      : "skip"
  );

  const filtered = (auditLogs || []).filter(
    (log: any) =>
      log.actorId.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VStack gap={5} maxWidth={1200}>
      <VStack gap={1}>
        <Heading level={1}>Audit-Trail & Aktivitätshistorie</Heading>
        <Text type="supporting">
          Chronologische, filterbare Detaildokumentation aller relevanten Team- und Adminaktionen in Region{" "}
          {currentRegion.toUpperCase()}.
        </Text>
      </VStack>

      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <SegmentedControl
          label="Entitäten filtern"
          value={entityFilter}
          onChange={setEntityFilter}
          size="sm"
        >
          <SegmentedControlItem value="all" label="Alle Entitäten" />
          <SegmentedControlItem value="staff" label="Mitarbeiter" />
          <SegmentedControlItem value="partner" label="Partner" />
          <SegmentedControlItem value="newsletter" label="Newsletter" />
          <SegmentedControlItem value="restaurant" label="Betriebe" />
        </SegmentedControl>

        <TextInput
          label="Aktion oder Akteur suchen"
          isLabelHidden
          placeholder="Aktion / Akteur suchen..."
          startIcon="search"
          hasClear
          value={search}
          onChange={setSearch}
          width={280}
        />
      </HStack>

      {!auditLogs ? (
        <VStack hAlign="center" vAlign="center" minHeight={240}>
          <Spinner label="Lade Audit-Trail..." />
        </VStack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Icon icon={ShieldCheck} size="lg" color="secondary" />}
          title="Keine Audit-Einträge gefunden"
          description="Für diesen Filter liegen keine protokollierten Ereignisse vor."
        />
      ) : (
        <Table
          data={filtered}
          idKey="_id"
          hasHover
          density="balanced"
          columns={[
            {
              key: "actorId",
              header: "Akteur",
              width: proportional(1.5, { minWidth: 180 }),
              renderCell: (log: any) => (
                <Text weight="semibold">{log.actorId}</Text>
              ),
            },
            {
              key: "actorRole",
              header: "Rolle",
              width: pixel(140),
              renderCell: (log: any) => (
                <Badge variant="neutral" label={log.actorRole} />
              ),
            },
            {
              key: "action",
              header: "Aktion",
              width: proportional(1.2, { minWidth: 160 }),
              renderCell: (log: any) => (
                <Text type="code" weight="semibold">
                  {log.action}
                </Text>
              ),
            },
            {
              key: "entityType",
              header: "Entität",
              width: pixel(130),
              renderCell: (log: any) => (
                <Token label={log.entityType} size="sm" />
              ),
            },
            {
              key: "details",
              header: "Details (Sanitized JSON)",
              width: proportional(2, { minWidth: 220 }),
              renderCell: (log: any) => (
                <Text type="code" color="secondary" maxLines={1}>
                  {log.details}
                </Text>
              ),
            },
            {
              key: "timestamp",
              header: "Zeitstempel",
              align: "end",
              width: pixel(170),
              renderCell: (log: any) => (
                <Text type="supporting" hasTabularNumbers>
                  {new Date(log.timestamp).toLocaleString("de-DE")}
                </Text>
              ),
            },
          ]}
        />
      )}
    </VStack>
  );
}
