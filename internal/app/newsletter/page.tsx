"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { anyApi } from "convex/server";
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  Trash,
  Eye,
} from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Grid } from "@astryxdesign/core/Grid";
import { Section } from "@astryxdesign/core/Section";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TabList, Tab } from "@astryxdesign/core/TabList";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Selector } from "@astryxdesign/core/Selector";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Icon } from "@astryxdesign/core/Icon";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "sonner";

interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "button" | "divider" | "hero_image";
  content: string;
  buttonUrl?: string;
}

export default function NewsletterHubPage() {
  const { currentRegion, adminEmail } = useAdmin();
  const [activeTab, setActiveTab] = useState<"subscribers" | "editor" | "campaigns">(
    "editor"
  );

  const subscribers = useQuery((anyApi as any).newsletter.listSubscribers, {
    regionId: currentRegion,
  });

  const campaigns = useQuery((anyApi as any).newsletter.listCampaigns, {
    regionId: currentRegion,
  });

  const [campaignTitle, setCampaignTitle] = useState(
    "Herbst-Aktion 2026: Zackisch QR-Bestellen"
  );
  const [campaignSubject, setCampaignSubject] = useState(
    "Mehr Umsatz, weniger Wartezeit – Neuigkeiten von Zackisch"
  );
  const [campaignLocale, setCampaignLocale] = useState("de");
  const [testEmailRecipient, setTestEmailRecipient] = useState(adminEmail);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingBatch, setSendingBatch] = useState(false);

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: "b1",
      type: "heading",
      content: "Schneller bestellen, direkt genießen.",
    },
    {
      id: "b2",
      type: "paragraph",
      content:
        "Mit Zackisch bestellen Gäste direkt am Tisch per Smartphone – ohne App-Download und ohne Wartezeiten. Entdecke jetzt die neuen Features für deinen Betrieb.",
    },
    {
      id: "b3",
      type: "button",
      content: "Jetzt Betrieb entdecken",
      buttonUrl: "https://zackisch.com",
    },
    {
      id: "b4",
      type: "divider",
      content: "",
    },
    {
      id: "b5",
      type: "paragraph",
      content:
        "Ohne Grundgebühr. Keine Einrichtungsgebühr. Du zahlst nur 2% bei erfolgreicher Bestellung.",
    },
  ]);

  const createCampaignMutation = useMutation(
    (anyApi as any).newsletter.createCampaign
  );
  const sendBatchAction = useAction((anyApi as any).emails.sendNewsletterBatch);
  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `b_${Date.now()}`,
      type,
      content:
        type === "heading"
          ? "Neuer Titel"
          : type === "paragraph"
            ? "Schreibe hier deinen Nachrichtentext..."
            : type === "button"
              ? "Mehr erfahren"
              : "",
      buttonUrl: type === "button" ? "https://zackisch.com" : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, content: string, buttonUrl?: string) => {
    setBlocks(
      blocks.map((b) =>
        b.id === id ? { ...b, content, buttonUrl: buttonUrl ?? b.buttonUrl } : b
      )
    );
  };

  const generateEmailHtml = () => {
    let bodyHtml = "";
    for (const b of blocks) {
      if (b.type === "heading") {
        bodyHtml += `<h2 style="font-size: 22px; font-weight: 800; color: #000000; margin: 24px 0 12px; letter-spacing: -0.5px;">${b.content}</h2>`;
      } else if (b.type === "paragraph") {
        bodyHtml += `<p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">${b.content}</p>`;
      } else if (b.type === "button") {
        bodyHtml += `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${b.buttonUrl || "https://zackisch.com"}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 9999px;">
              ${b.content}
            </a>
          </div>
        `;
      } else if (b.type === "divider") {
        bodyHtml += `<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />`;
      }
    }

    return `<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="light">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 540px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 40px;">
    <div style="margin-bottom: 32px;">
      <a href="https://zackisch.com" style="display: inline-block; text-decoration: none;">
        <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 38px; width: auto; display: block;" />
      </a>
    </div>
    <div>${bodyHtml}</div>
  </div>
</body>
</html>`;
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      const res = await testSmtpAction({ testRecipient: testEmailRecipient });
      if (res.success) {
        toast.success(`Testnachricht an ${testEmailRecipient} gesendet!`);
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const handlePublishCampaign = async () => {
    const confirmedCount = (subscribers || []).filter(
      (s: any) => s.status === "confirmed"
    ).length;
    if (confirmedCount === 0) {
      toast.warning("Keine bestätigten Abonnenten in dieser Region vorhanden.");
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du diese Kampagne wirklich an alle ${confirmedCount} bestätigten Abonnenten in Region ${currentRegion.toUpperCase()} versenden?`
    );
    if (!confirmed) return;

    setSendingBatch(true);
    try {
      const htmlContent = generateEmailHtml();
      const textContent = blocks
        .map((b) => b.content)
        .filter(Boolean)
        .join("\n\n");

      const campaignId = await createCampaignMutation({
        title: campaignTitle,
        subject: campaignSubject,
        regionId: currentRegion,
        locale: campaignLocale,
        htmlContent,
        textContent,
        blocks: JSON.stringify(blocks),
        createdBy: adminEmail,
      });

      const res = await sendBatchAction({
        campaignId,
        subject: campaignSubject,
        htmlContent,
        textContent,
        regionId: currentRegion,
        actorEmail: adminEmail,
      });

      toast.success(
        `Kampagne versendet! ${res.sentCount} zugestellt${
          res.failedCount > 0 ? `, ${res.failedCount} fehlgeschlagen` : ""
        }.`
      );
      setActiveTab("campaigns");
    } catch (err: any) {
      toast.error(`Fehler beim Kampagnenversand: ${err.message}`);
    } finally {
      setSendingBatch(false);
    }
  };

  const confirmedSubscribers = (subscribers || []).filter(
    (s: any) => s.status === "confirmed"
  );

  return (
    <VStack gap={5} maxWidth={1200}>
      <VStack gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Newsletter Zentrale</Heading>
          <Text type="supporting">
            Integrierter No-Code Block-Editor, Double-Opt-in Abonnenten und Kampagnen für Region{" "}
            {currentRegion.toUpperCase()}.
          </Text>
        </VStack>

        <TabList
          value={activeTab}
          onChange={(val) =>
            setActiveTab(val as "subscribers" | "editor" | "campaigns")
          }
          hasDivider
        >
          <Tab value="editor" label="No-Code Editor" />
          <Tab
            value="subscribers"
            label={`Abonnenten (${confirmedSubscribers.length})`}
          />
          <Tab
            value="campaigns"
            label={`Kampagnen-Historie (${campaigns?.length || 0})`}
          />
        </TabList>
      </VStack>

      {activeTab === "editor" && (
        <Grid columns={{ minWidth: 360, max: 2, repeat: "fit" }} gap={6}>
          <Section variant="section" padding={5}>
            <VStack gap={4}>
              <HStack gap={2} vAlign="center">
                <Icon icon={EnvelopeSimple} size="sm" color="secondary" />
                <Heading level={3}>Kampagnen-Einstellungen</Heading>
              </HStack>

              <TextInput
                label="Interner Kampagnen-Titel"
                value={campaignTitle}
                onChange={setCampaignTitle}
                width="100%"
              />

              <TextInput
                label="E-Mail-Betreffzeile"
                value={campaignSubject}
                onChange={setCampaignSubject}
                width="100%"
              />

              <HStack gap={3} wrap="wrap" vAlign="end">
                <StackItem size="fill">
                  <Selector
                    label="Sprache"
                    value={campaignLocale}
                    onChange={setCampaignLocale}
                    options={[
                      { value: "de", label: "Deutsch (DE)" },
                      { value: "en", label: "Englisch (EN)" },
                    ]}
                    width="100%"
                  />
                </StackItem>
                <Badge
                  variant="neutral"
                  label={`${confirmedSubscribers.length} bestätigte Abonnenten`}
                />
              </HStack>

              <Divider />

              <VStack gap={3}>
                <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
                  <Text type="label">Inhalts-Blöcke</Text>
                  <HStack gap={1} wrap="wrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      label="+ Überschrift"
                      onClick={() => addBlock("heading")}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      label="+ Text"
                      onClick={() => addBlock("paragraph")}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      label="+ Button"
                      onClick={() => addBlock("button")}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      label="+ Trenner"
                      onClick={() => addBlock("divider")}
                    />
                  </HStack>
                </HStack>

                <VStack gap={2} height={360} isScrollable>
                  {blocks.map((b) => (
                    <Card key={b.id} variant="muted" padding={3}>
                      <VStack gap={2}>
                        <HStack justify="between" vAlign="center">
                          <Text type="supporting">
                            {b.type === "heading" && "Überschrift"}
                            {b.type === "paragraph" && "Absatz / Text"}
                            {b.type === "button" && "Call-To-Action Button"}
                            {b.type === "divider" && "Trennlinie"}
                          </Text>
                          <IconButton
                            label="Block löschen"
                            tooltip="Block löschen"
                            variant="ghost"
                            size="sm"
                            icon={<Icon icon={Trash} size="sm" />}
                            onClick={() => removeBlock(b.id)}
                          />
                        </HStack>

                        {b.type === "heading" && (
                          <TextInput
                            label="Überschrift"
                            isLabelHidden
                            size="sm"
                            value={b.content}
                            onChange={(val) => updateBlock(b.id, val)}
                            width="100%"
                          />
                        )}

                        {b.type === "paragraph" && (
                          <TextArea
                            label="Absatz"
                            isLabelHidden
                            rows={2}
                            size="sm"
                            value={b.content}
                            onChange={(val) => updateBlock(b.id, val)}
                            width="100%"
                          />
                        )}

                        {b.type === "button" && (
                          <VStack gap={2}>
                            <TextInput
                              label="Button-Beschriftung"
                              isLabelHidden
                              size="sm"
                              placeholder="Button-Beschriftung"
                              value={b.content}
                              onChange={(val) =>
                                updateBlock(b.id, val, b.buttonUrl)
                              }
                              width="100%"
                            />
                            <TextInput
                              label="Ziel-URL"
                              isLabelHidden
                              size="sm"
                              placeholder="https://zackisch.com"
                              value={b.buttonUrl || ""}
                              onChange={(val) =>
                                updateBlock(b.id, b.content, val)
                              }
                              width="100%"
                            />
                          </VStack>
                        )}

                        {b.type === "divider" && <Divider />}
                      </VStack>
                    </Card>
                  ))}
                </VStack>
              </VStack>

              <Divider />

              <VStack gap={3}>
                <HStack gap={2} vAlign="end">
                  <StackItem size="fill">
                    <TextInput
                      type="email"
                      label="Test an E-Mail senden"
                      isLabelHidden
                      placeholder="Test an E-Mail senden"
                      value={testEmailRecipient}
                      onChange={setTestEmailRecipient}
                      width="100%"
                    />
                  </StackItem>
                  <Button
                    label="Test-Mail"
                    variant="secondary"
                    isLoading={sendingTest}
                    onClick={handleSendTest}
                  />
                </HStack>

                <Button
                  label={`Kampagne an ${confirmedSubscribers.length} Abonnenten starten`}
                  variant="primary"
                  width="100%"
                  isLoading={sendingBatch}
                  icon={<Icon icon={PaperPlaneTilt} size="sm" />}
                  onClick={handlePublishCampaign}
                />
              </VStack>
            </VStack>
          </Section>

          <Section variant="muted" padding={5}>
            <VStack gap={4}>
              <HStack justify="between" vAlign="center">
                <HStack gap={1.5} vAlign="center">
                  <Icon icon={Eye} size="sm" color="secondary" />
                  <Text type="label">Live E-Mail-Vorschau (Master Template)</Text>
                </HStack>
                <Text type="supporting">Google Workspace Relay</Text>
              </HStack>

              <Card padding={6}>
                <VStack gap={4}>
                  <img
                    src="/combination_mark.svg"
                    alt="Zackisch"
                    className="h-7 w-auto block"
                  />

                  <VStack gap={3}>
                    {blocks.map((b) => (
                      <div key={b.id}>
                        {b.type === "heading" && (
                          <Heading level={2}>{b.content}</Heading>
                        )}
                        {b.type === "paragraph" && <Text>{b.content}</Text>}
                        {b.type === "button" && (
                          <HStack justify="center" paddingBlock={2}>
                            <Button
                              label={b.content}
                              variant="primary"
                              href={b.buttonUrl || "#"}
                            />
                          </HStack>
                        )}
                        {b.type === "divider" && <Divider />}
                      </div>
                    ))}
                  </VStack>

                  <Divider />

                  <VStack gap={0.5} hAlign="center">
                    <Text type="supporting">
                      Zackisch Gastronomie-Plattform · zackisch.com
                    </Text>
                    <Text type="supporting">Newsletter abmelden (One-Click)</Text>
                  </VStack>
                </VStack>
              </Card>
            </VStack>
          </Section>
        </Grid>
      )}

      {activeTab === "subscribers" && (
        <Section variant="section" padding={5}>
          <VStack gap={4}>
            <HStack justify="between" vAlign="center">
              <Heading level={3}>Double-Opt-In Abonnenten</Heading>
              <Badge
                variant="neutral"
                label={`${confirmedSubscribers.length} bestätigt / ${
                  (subscribers || []).length
                } gesamt`}
              />
            </HStack>

            {!subscribers ? (
              <VStack hAlign="center" vAlign="center" minHeight={200}>
                <Spinner label="Lade Abonnenten..." />
              </VStack>
            ) : subscribers.length === 0 ? (
              <EmptyState
                isCompact
                icon={<Icon icon={EnvelopeSimple} size="lg" color="secondary" />}
                title="Keine Abonnenten"
                description="Bisher keine Newsletter-Abonnenten in dieser Region."
              />
            ) : (
              <Table
                data={subscribers}
                idKey="_id"
                hasHover
                density="balanced"
                columns={[
                  {
                    key: "email",
                    header: "E-Mail-Adresse",
                    width: proportional(2, { minWidth: 200 }),
                    renderCell: (s: any) => (
                      <Text weight="semibold">{s.email}</Text>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    width: pixel(150),
                    renderCell: (s: any) => {
                      if (s.status === "confirmed") {
                        return (
                          <HStack gap={1.5} vAlign="center">
                            <StatusDot variant="success" label="Bestätigt" />
                            <Text>Bestätigt</Text>
                          </HStack>
                        );
                      }
                      if (s.status === "pending") {
                        return <Badge variant="warning" label="Ausstehend" />;
                      }
                      return <Badge variant="neutral" label="Abgemeldet" />;
                    },
                  },
                  {
                    key: "locale",
                    header: "Sprache",
                    width: pixel(110),
                    renderCell: (s: any) => (
                      <Text type="code">{String(s.locale || "de").toUpperCase()}</Text>
                    ),
                  },
                  {
                    key: "source",
                    header: "Quelle",
                    width: pixel(130),
                    renderCell: (s: any) => (
                      <Text type="supporting">{s.source || "Website"}</Text>
                    ),
                  },
                  {
                    key: "createdAt",
                    header: "Registriert am",
                    align: "end",
                    width: pixel(150),
                    renderCell: (s: any) => (
                      <Text type="supporting" hasTabularNumbers>
                        {new Date(s.createdAt).toLocaleDateString("de-DE")}
                      </Text>
                    ),
                  },
                ]}
              />
            )}
          </VStack>
        </Section>
      )}

      {activeTab === "campaigns" && (
        <Section variant="section" padding={5}>
          <VStack gap={4}>
            <Heading level={3}>Versendete Kampagnen</Heading>

            {!campaigns || campaigns.length === 0 ? (
              <EmptyState
                isCompact
                icon={<Icon icon={PaperPlaneTilt} size="lg" color="secondary" />}
                title="Keine Kampagnen"
                description="Bisher wurden keine Kampagnen versendet."
              />
            ) : (
              <Table
                data={campaigns}
                idKey="_id"
                hasHover
                density="balanced"
                columns={[
                  {
                    key: "title",
                    header: "Titel & Betreff",
                    width: proportional(2, { minWidth: 220 }),
                    renderCell: (c: any) => (
                      <VStack gap={0.5}>
                        <Text weight="semibold">{c.title}</Text>
                        <Text type="supporting">{c.subject}</Text>
                      </VStack>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    width: pixel(140),
                    renderCell: () => (
                      <HStack gap={1.5} vAlign="center">
                        <StatusDot variant="success" label="Versendet" />
                        <Text>Versendet</Text>
                      </HStack>
                    ),
                  },
                  {
                    key: "deliveredCount",
                    header: "Zugestellt",
                    width: pixel(150),
                    renderCell: (c: any) => (
                      <Text weight="semibold" hasTabularNumbers>
                        {c.deliveredCount ?? "—"} Empfänger
                      </Text>
                    ),
                  },
                  {
                    key: "createdBy",
                    header: "Erstellt von",
                    width: proportional(1, { minWidth: 160 }),
                    renderCell: (c: any) => (
                      <Text type="supporting">{c.createdBy}</Text>
                    ),
                  },
                  {
                    key: "sentAt",
                    header: "Versanddatum",
                    align: "end",
                    width: pixel(170),
                    renderCell: (c: any) => (
                      <Text type="supporting" hasTabularNumbers>
                        {c.sentAt
                          ? new Date(c.sentAt).toLocaleString("de-DE")
                          : "—"}
                      </Text>
                    ),
                  },
                ]}
              />
            )}
          </VStack>
        </Section>
      )}
    </VStack>
  );
}
