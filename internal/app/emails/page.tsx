"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { anyApi } from "convex/server";
import { ClockCounterClockwise, PaperPlaneTilt } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Token } from "@astryxdesign/core/Token";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "sonner";

export default function EmailLogPage() {
  const { currentRegion, adminEmail, sessionToken } = useAdmin();
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [testingSmtp, setTestingSmtp] = useState(false);

  const emailLogs = useQuery(
    (anyApi as any).emailLogs.listEmailLogs,
    sessionToken
      ? {
          regionId: currentRegion,
          sessionToken,
          type: typeFilter === "all" ? undefined : typeFilter,
          limit: 100,
        }
      : "skip"
  );

  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await testSmtpAction({ testRecipient: adminEmail });
      if (res.success) {
        toast.success(
          "Testnachricht über Google Workspace SMTP erfolgreich zugestellt!"
        );
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  const filtered = (emailLogs || []).filter(
    (log: any) =>
      log.recipient.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VStack gap={5} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>E-Mail-Versandprotokoll</Heading>
            <Text type="supporting">
              Alle durch das Zackisch-Backend ausgelösten E-Mails (Google Workspace SMTP). Keine manuellen Postfach-Mails.
            </Text>
          </VStack>
        </StackItem>

        <Button
          label="SMTP Testmail senden"
          variant="secondary"
          isLoading={testingSmtp}
          icon={<Icon icon={PaperPlaneTilt} size="sm" />}
          onClick={handleTestSmtp}
        />
      </HStack>

      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <SegmentedControl
          label="E-Mail-Typ filtern"
          value={typeFilter}
          onChange={setTypeFilter}
          size="sm"
        >
          <SegmentedControlItem value="all" label="Alle Typen" />
          <SegmentedControlItem value="otp" label="OTP / Auth" />
          <SegmentedControlItem value="newsletter" label="Newsletter" />
          <SegmentedControlItem value="test" label="Testnachrichten" />
        </SegmentedControl>

        <TextInput
          label="Empfänger oder Betreff suchen"
          isLabelHidden
          placeholder="Empfänger / Betreff suchen..."
          startIcon="search"
          hasClear
          value={search}
          onChange={setSearch}
          width={280}
        />
      </HStack>

      {!emailLogs ? (
        <VStack hAlign="center" vAlign="center" minHeight={240}>
          <Spinner label="Lade E-Mail-Protokoll..." />
        </VStack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Icon icon={ClockCounterClockwise} size="lg" color="secondary" />}
          title="Keine E-Mail-Einträge gefunden"
          description="Es liegen keine Versandprotokolle für diesen Filter vor."
        />
      ) : (
        <Table
          data={filtered}
          idKey="_id"
          hasHover
          density="balanced"
          columns={[
            {
              key: "recipient",
              header: "Empfänger",
              width: proportional(1.5, { minWidth: 180 }),
              renderCell: (log: any) => (
                <Text type="code" weight="semibold">
                  {log.recipient}
                </Text>
              ),
            },
            {
              key: "type",
              header: "Anlass / Typ",
              width: pixel(140),
              renderCell: (log: any) => (
                <Token label={String(log.type).toUpperCase()} size="sm" />
              ),
            },
            {
              key: "subject",
              header: "Betreff",
              width: proportional(2, { minWidth: 220 }),
              renderCell: (log: any) => (
                <Text maxLines={1}>{log.subject}</Text>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: pixel(140),
              renderCell: (log: any) =>
                log.status === "sent" ? (
                  <HStack gap={1.5} vAlign="center">
                    <StatusDot variant="success" label="Gesendet" />
                    <Text>Gesendet</Text>
                  </HStack>
                ) : (
                  <Badge variant="error" label="Fehlgeschlagen" />
                ),
            },
            {
              key: "timestamp",
              header: "Zeitpunkt",
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
