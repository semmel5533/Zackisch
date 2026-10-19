"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { anyApi } from "convex/server";
import {
  TrendUp,
  Storefront,
  Receipt,
  Handshake,
  EnvelopeSimple,
  PaperPlaneTilt,
  Plus,
} from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Section } from "@astryxdesign/core/Section";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { List, ListItem } from "@astryxdesign/core/List";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";

export default function AdminOverviewPage() {
  const { currentRegion, adminEmail, sessionToken } = useAdmin();
  const [testingSmtp, setTestingSmtp] = useState(false);

  const overview = useQuery(
    (anyApi as any).admin.getRegionalOverview,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await testSmtpAction({ testRecipient: adminEmail });
      if (res.success) {
        toast.success("Google Workspace SMTP Testnachricht erfolgreich versendet!");
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (e: any) {
      toast.error(`Fehler beim Senden: ${e.message}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  return (
    <VStack gap={6} maxWidth={1200}>
      {/* Header Section */}
      <Section variant="section" padding={5} dividers={["bottom"]}>
        <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
          <VStack gap={1.5}>
            <HStack gap={2} vAlign="center">
              <StatusDot
                variant="success"
                label={`Region ${currentRegion.toUpperCase()} Aktiv`}
                isPulsing
              />
              <Badge
                variant="green"
                label={`Region Deutschland (${currentRegion.toUpperCase()}) Aktiv`}
              />
            </HStack>
            <Heading level={1}>Willkommen in der Zackisch Zentrale</Heading>
            <Text type="supporting">
              Operative Übersicht für Betriebe und Gastronomie, Zahlungen, Partner und E-Mail-Marketing in deiner Region.
            </Text>
          </VStack>

          <HStack gap={2} wrap="wrap">
            <Button
              label="SMTP-Verbindung testen"
              variant="secondary"
              isLoading={testingSmtp}
              icon={<Icon icon={PaperPlaneTilt} size="sm" />}
              onClick={handleTestSmtp}
            />
            <Button
              label="Newsletter verfassen"
              variant="primary"
              href="/newsletter"
              icon={<Icon icon={Plus} size="sm" />}
            />
          </HStack>
        </HStack>
      </Section>

      {/* KPI Metric Cards */}
      <Grid columns={{ minWidth: 260, max: 3, repeat: "fit" }} gap={4}>
        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Umsatzvolumen (GMV)
              </Text>
              <Icon icon={TrendUp} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? formatEuro(overview.gmvCents) : "—"}
              </Text>
            </Heading>
            <Text type="supporting">
              Gesamtes über QR abgewickeltes Bestellvolumen
            </Text>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Plattform-Gebühr (2%)
              </Text>
              <Icon icon={Receipt} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? formatEuro(overview.platformFeeCents) : "—"}
              </Text>
            </Heading>
            <Text type="supporting">
              Zackisch Einnahmen (2% pro relevanter Bestellung)
            </Text>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Partner-Provision (50%)
              </Text>
              <Icon icon={Handshake} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? formatEuro(overview.partnerCommissionCents) : "—"}
              </Text>
            </Heading>
            <Text type="supporting">
              50% der Plattformgebühr für regionale Partner
            </Text>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Betriebe
              </Text>
              <Icon icon={Storefront} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? overview.totalBusinesses : "—"}
              </Text>
            </Heading>
            <Text type="supporting">
              {overview?.activeBusinesses || 0} mit abgeschlossenem Stripe Onboarding
            </Text>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Bestellungen
              </Text>
              <Icon icon={Receipt} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? overview.totalOrders : "—"}
              </Text>
            </Heading>
            <Text type="supporting">
              Tisch- und Abholbestellungen in Region {currentRegion.toUpperCase()}
            </Text>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={2}>
            <HStack justify="between" vAlign="center">
              <Text type="label" color="secondary">
                Newsletter Abonnenten
              </Text>
              <Icon icon={EnvelopeSimple} color="secondary" size="sm" />
            </HStack>
            <Heading level={2}>
              <Text type="inherit" hasTabularNumbers>
                {overview ? overview.subscriberCount : "—"}
              </Text>
            </Heading>
            <Text type="supporting">Bestätigte Double-Opt-In Abonnenten</Text>
          </VStack>
        </Card>
      </Grid>

      {/* System Infrastructure Status */}
      <Section variant="section" padding={5}>
        <VStack gap={3}>
          <Heading level={3}>Infrastruktur & Anbieterstatus</Heading>
          <List hasDividers density="spacious">
            <ListItem
              label="Google Workspace SMTP"
              description="Host: smtp.gmail.com:587 · Absender: noreply@zackisch.com · Reply-To: noreply@zackisch.com"
              startContent={<StatusDot variant="success" label="Aktiv" />}
              endContent={<Badge variant="green" label="Verbunden" />}
            />
            <ListItem
              label="Stripe Connect Direct Charges"
              description="Modell: Direct Charges auf verbundenem Gastronomie-Konto · Gebühr: 2% Plattformanteil (exkl. Trinkgeld)"
              startContent={<StatusDot variant="success" label="Aktiv" />}
              endContent={<Badge variant="green" label="Aktiv" />}
            />
            <ListItem
              label="Convex Cloud Backend"
              description="Region: eu-west-1 (Frankfurt) · Architektur: Single DB mit strikter Regionstrennung · Echtzeit Live Queries"
              startContent={<StatusDot variant="success" label="Aktiv" />}
              endContent={<Badge variant="green" label="Live" />}
            />
          </List>
        </VStack>
      </Section>
    </VStack>
  );
}
