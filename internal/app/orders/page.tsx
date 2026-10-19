"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Receipt } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";

export default function OrdersPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = useQuery(
    (anyApi as any).admin.listRegionalOrders,
    sessionToken ? { regionId: currentRegion, sessionToken, limit: 100 } : "skip"
  );

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const filtered = (orders || []).filter((o: any) => {
    if (statusFilter === "all") return true;
    return o.status === statusFilter;
  });

  return (
    <VStack gap={5} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>Bestell- und Zahlungsübersicht</Heading>
            <Text type="supporting">
              Reale Transaktionen, 2% Plattformgebühr und Zahlungsstatus in Region{" "}
              {currentRegion.toUpperCase()}.
            </Text>
          </VStack>
        </StackItem>

        <SegmentedControl
          label="Bestellstatus filtern"
          value={statusFilter}
          onChange={setStatusFilter}
          size="sm"
        >
          <SegmentedControlItem value="all" label="Alle" />
          <SegmentedControlItem value="in_progress" label="In Zubereitung" />
          <SegmentedControlItem value="ready_for_pickup" label="Abholbereit" />
          <SegmentedControlItem value="completed" label="Abgeschlossen" />
        </SegmentedControl>
      </HStack>

      {!orders ? (
        <VStack hAlign="center" vAlign="center" minHeight={240}>
          <Spinner label="Lade Bestellungen..." />
        </VStack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Receipt} size="lg" color="secondary" />}
          title="Keine Bestellungen vorhanden"
          description="Es wurden keine Bestellungen mit diesem Status in dieser Region gefunden."
        />
      ) : (
        <Table
          data={filtered}
          idKey="_id"
          hasHover
          density="balanced"
          columns={[
            {
              key: "orderNumber",
              header: "Bestellung",
              width: pixel(110),
              renderCell: (o: any) => (
                <Text type="code" weight="bold" hasTabularNumbers>
                  #{o.orderNumber}
                </Text>
              ),
            },
            {
              key: "type",
              header: "Typ / Tisch",
              width: proportional(1, { minWidth: 140 }),
              renderCell: (o: any) => (
                <VStack gap={0.5}>
                  <Text weight="semibold">
                    {o.type === "dine-in" ? "Vor Ort" : "Abholung"}
                  </Text>
                  <Text type="supporting">
                    {o.tableNumber ? `Tisch ${o.tableNumber}` : "Ohne Tisch"}
                  </Text>
                </VStack>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: proportional(1, { minWidth: 150 }),
              renderCell: (o: any) => {
                if (o.status === "completed") {
                  return (
                    <HStack gap={1.5} vAlign="center">
                      <StatusDot variant="success" label="Erledigt" />
                      <Text>Erledigt</Text>
                    </HStack>
                  );
                }
                if (o.status === "ready_for_pickup") {
                  return <Badge variant="blue" label="Abholbereit" />;
                }
                if (o.status === "in_progress") {
                  return <Badge variant="warning" label="In Zubereitung" />;
                }
                if (o.status === "cancelled") {
                  return <Badge variant="error" label="Storniert" />;
                }
                return <Text>{o.status}</Text>;
              },
            },
            {
              key: "total",
              header: "Gesamtbetrag",
              width: pixel(130),
              renderCell: (o: any) => (
                <Text weight="bold" hasTabularNumbers>
                  {formatEuro(o.total)}
                </Text>
              ),
            },
            {
              key: "zackischFee",
              header: "Zackisch (2%)",
              width: pixel(130),
              renderCell: (o: any) => (
                <Text weight="semibold" hasTabularNumbers>
                  {formatEuro(o.zackischFee)}
                </Text>
              ),
            },
            {
              key: "stripePaymentId",
              header: "Stripe ID",
              width: proportional(1, { minWidth: 150 }),
              renderCell: (o: any) => (
                <Text type="code" color="secondary" maxLines={1}>
                  {o.stripePaymentId ? `${o.stripePaymentId.slice(0, 16)}...` : "—"}
                </Text>
              ),
            },
            {
              key: "createdAt",
              header: "Zeitstempel",
              align: "end",
              width: pixel(170),
              renderCell: (o: any) => (
                <Text type="supporting" hasTabularNumbers>
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("de-DE") : "—"}
                </Text>
              ),
            },
          ]}
        />
      )}
    </VStack>
  );
}
