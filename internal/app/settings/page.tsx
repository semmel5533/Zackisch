"use client";

import React from "react";
import { Coins, Globe, EnvelopeSimple } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Section } from "@astryxdesign/core/Section";
import { Card } from "@astryxdesign/core/Card";
import { List, ListItem } from "@astryxdesign/core/List";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { useAdmin } from "@/lib/admin-context";

export default function SettingsPage() {
  const { currentRegion, regions } = useAdmin();

  return (
    <VStack gap={6} maxWidth={1000}>
      <VStack gap={1}>
        <Heading level={1}>Regionale Einstellungen & Parameter</Heading>
        <Text type="supporting">
          Konfiguration für Region {currentRegion.toUpperCase()} und Überblick über Expansionsmärkte.
        </Text>
      </VStack>

      {/* Pricing & Business Policy Section */}
      <Section variant="section" padding={5}>
        <VStack gap={4}>
          <HStack gap={2} vAlign="center">
            <Icon icon={Coins} size="sm" color="secondary" />
            <Heading level={3}>Gebührenmodell & Richtlinien</Heading>
          </HStack>

          <Grid columns={{ minWidth: 220, max: 3, repeat: "fit" }} gap={4}>
            <Card padding={4} variant="muted">
              <VStack gap={1}>
                <Text type="label" color="secondary">
                  Grundgebühr
                </Text>
                <Heading level={2}>
                  <Text type="inherit" hasTabularNumbers>
                    0,00 €
                  </Text>
                </Heading>
                <Text type="supporting">
                  Keine monatliche Fixgebühr für Betriebe
                </Text>
              </VStack>
            </Card>

            <Card padding={4} variant="muted">
              <VStack gap={1}>
                <Text type="label" color="secondary">
                  Einrichtungsgebühr
                </Text>
                <Heading level={2}>
                  <Text type="inherit" hasTabularNumbers>
                    0,00 €
                  </Text>
                </Heading>
                <Text type="supporting">
                  Kostenlose Registrierung und Bereitstellung
                </Text>
              </VStack>
            </Card>

            <Card padding={4} variant="muted">
              <VStack gap={1}>
                <Text type="label" color="secondary">
                  Zackisch Plattformgebühr
                </Text>
                <Heading level={2}>
                  <Text type="inherit" hasTabularNumbers>
                    2,0 %
                  </Text>
                </Heading>
                <Text type="supporting">
                  Nur bei tatsächlich erfolgter Bestellung
                </Text>
              </VStack>
            </Card>
          </Grid>

          <Card padding={4} variant="muted">
            <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
              <VStack gap={0.5}>
                <Text weight="semibold">Partner-Provisionsanspruch</Text>
                <Text type="supporting">
                  50 % der Zackisch-Plattformgebühr (entspricht rechnerisch 1 % der Umsatzbasis)
                </Text>
              </VStack>
              <Badge variant="green" label="50 %" />
            </HStack>
          </Card>
        </VStack>
      </Section>

      {/* Supported Regions */}
      <Section variant="section" padding={5}>
        <VStack gap={4}>
          <HStack gap={2} vAlign="center">
            <Icon icon={Globe} size="sm" color="secondary" />
            <Heading level={3}>Geschäftsregionen</Heading>
          </HStack>

          <List hasDividers density="spacious">
            {(regions || []).map((r: any) => (
              <ListItem
                key={r.code}
                label={`${r.name} (${r.code.toUpperCase()})`}
                description={`Währung: ${r.currency} · Steuersätze: ${r.taxRates.join(
                  "%, "
                )}% · Sprachen: ${r.supportedLocales.join(", ").toUpperCase()}`}
                startContent={
                  <StatusDot
                    variant={r.status === "active" ? "success" : "neutral"}
                    label={r.status === "active" ? "Aktiv" : "In Vorbereitung"}
                  />
                }
                endContent={
                  <Badge
                    variant={r.status === "active" ? "green" : "neutral"}
                    label={
                      r.status === "active"
                        ? "Aktiv (Startmarkt)"
                        : "In Vorbereitung"
                    }
                  />
                }
              />
            ))}
          </List>
        </VStack>
      </Section>

      {/* E-Mail & Google Workspace Status */}
      <Section variant="section" padding={5}>
        <VStack gap={4}>
          <HStack gap={2} vAlign="center">
            <Icon icon={EnvelopeSimple} size="sm" color="secondary" />
            <Heading level={3}>Google Workspace E-Mail-Konfiguration</Heading>
          </HStack>

          <List hasDividers density="balanced">
            <ListItem
              label="SMTP Relay Host"
              endContent={<Text type="code">smtp.gmail.com:587 (STARTTLS)</Text>}
            />
            <ListItem
              label="SMTP Auth User"
              endContent={<Text type="code">selim@zackisch.com</Text>}
            />
            <ListItem
              label="From-Absenderadresse"
              endContent={<Text type="code">noreply@zackisch.com</Text>}
            />
            <ListItem
              label="Reply-To Adresse"
              endContent={<Text type="code">noreply@zackisch.com</Text>}
            />
            <ListItem
              label="App-Passwort Status"
              endContent={
                <Badge
                  variant="green"
                  label="In Convex Deployment synchronisiert (16 Zeichen)"
                />
              }
            />
          </List>
        </VStack>
      </Section>
    </VStack>
  );
}
