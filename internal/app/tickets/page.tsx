"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Lifebuoy,
  LockSimple,
  ChatText,
  PaperPlaneTilt,
  User,
  Storefront,
} from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Grid } from "@astryxdesign/core/Grid";
import { Section } from "@astryxdesign/core/Section";
import { Card } from "@astryxdesign/core/Card";
import { List, ListItem } from "@astryxdesign/core/List";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { Selector } from "@astryxdesign/core/Selector";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { Banner } from "@astryxdesign/core/Banner";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";

type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_customer"
  | "resolved"
  | "closed";

export default function TeamTicketsPage() {
  const { currentRegion, adminEmail, adminUser, sessionToken, currentLocale } = useAdmin();
  const isDe = currentLocale !== "en";

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [composerMode, setComposerMode] = useState<"public" | "internal_note">(
    "public"
  );
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);

  const canWritePublic =
    adminUser?.role === "regional_admin" ||
    Boolean(adminUser?.permissions?.includes("tickets:write"));
  const canWriteNote =
    adminUser?.role === "regional_admin" ||
    Boolean(adminUser?.permissions?.includes("tickets:note"));

  const tickets = useQuery(
    (anyApi as any).support.getTeamTickets,
    sessionToken
      ? {
          sessionToken,
          regionId: currentRegion,
          actorEmail: adminEmail,
          status: statusFilter === "all" ? undefined : statusFilter,
        }
      : "skip"
  );

  const ticketDetail = useQuery(
    (anyApi as any).support.getTeamTicketThread,
    selectedTicketId && sessionToken
      ? {
          sessionToken,
          ticketId: selectedTicketId,
          actorEmail: adminEmail,
          regionId: currentRegion,
        }
      : "skip"
  );

  const addPublicReply = useMutation((anyApi as any).support.addTeamPublicReply);
  const addInternalNote = useMutation((anyApi as any).support.addTeamInternalNote);
  const updateStatusAndAssignee = useMutation(
    (anyApi as any).support.updateTicketStatusAndAssignee
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !messageBody.trim()) return;
    setSending(true);
    try {
      if (composerMode === "public") {
        await addPublicReply({
          sessionToken: sessionToken || undefined,
          ticketId: selectedTicketId,
          actorEmail: adminEmail,
          regionId: currentRegion,
          body: messageBody.trim(),
        });
        toast.success(
          isDe ? "Öffentliche Kundenantwort gesendet." : "Public customer reply sent."
        );
      } else {
        await addInternalNote({
          sessionToken: sessionToken || undefined,
          ticketId: selectedTicketId,
          actorEmail: adminEmail,
          regionId: currentRegion,
          body: messageBody.trim(),
        });
        toast.success(
          isDe ? "Interne Team-Notiz gespeichert." : "Internal team note saved."
        );
      }
      setMessageBody("");
    } catch (err: any) {
      toast.error(err?.message || "Fehler beim Speichern");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!selectedTicketId) return;
    try {
      await updateStatusAndAssignee({
        sessionToken: sessionToken || undefined,
        ticketId: selectedTicketId,
        actorEmail: adminEmail,
        regionId: currentRegion,
        status: newStatus,
      });
      toast.success(isDe ? "Ticket-Status aktualisiert." : "Ticket status updated.");
    } catch (err: any) {
      toast.error(err?.message || "Status-Update fehlgeschlagen");
    }
  };

  const handlePriorityChange = async (
    newPriority: "low" | "normal" | "high" | "urgent"
  ) => {
    if (!selectedTicketId || !ticketDetail?.ticket) return;
    try {
      await updateStatusAndAssignee({
        sessionToken: sessionToken || undefined,
        ticketId: selectedTicketId,
        actorEmail: adminEmail,
        regionId: currentRegion,
        status: ticketDetail.ticket.status,
        priority: newPriority,
      });
      toast.success(isDe ? "Priorität aktualisiert." : "Priority updated.");
    } catch (err: any) {
      toast.error(err?.message || "Update fehlgeschlagen");
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedTicketId || !ticketDetail?.ticket) return;
    try {
      await updateStatusAndAssignee({
        sessionToken: sessionToken || undefined,
        ticketId: selectedTicketId,
        actorEmail: adminEmail,
        regionId: currentRegion,
        status: ticketDetail.ticket.status,
        assignedToEmail: adminEmail,
        assignedToName: adminUser?.name || adminEmail,
      });
      toast.success(isDe ? "Ticket dir zugewiesen." : "Assigned to you.");
    } catch (err: any) {
      toast.error(err?.message || "Zuweisung fehlgeschlagen");
    }
  };

  const statusLabels: Record<TicketStatus, string> = {
    open: isDe ? "Offen" : "Open",
    in_progress: isDe ? "In Bearbeitung" : "In progress",
    waiting_for_customer: isDe ? "Wartet auf Kunde" : "Waiting for customer",
    resolved: isDe ? "Gelöst" : "Resolved",
    closed: isDe ? "Geschlossen" : "Closed",
  };

  return (
    <VStack gap={5} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>{isDe ? "Support-Tickets" : "Support Tickets"}</Heading>
            <Text type="supporting">
              {isDe
                ? `Händleranfragen, öffentliche Antworten und geschützte interne Team-Notizen für Region ${currentRegion.toUpperCase()}.`
                : `Merchant support requests, public replies, and internal team notes for region ${currentRegion.toUpperCase()}.`}
            </Text>
          </VStack>
        </StackItem>

        <SegmentedControl
          label={isDe ? "Ticket-Status filtern" : "Filter ticket status"}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as TicketStatus | "all")}
          size="sm"
        >
          <SegmentedControlItem value="all" label={isDe ? "Alle" : "All"} />
          <SegmentedControlItem value="open" label={statusLabels.open} />
          <SegmentedControlItem value="in_progress" label={statusLabels.in_progress} />
          <SegmentedControlItem
            value="waiting_for_customer"
            label={statusLabels.waiting_for_customer}
          />
          <SegmentedControlItem value="resolved" label={statusLabels.resolved} />
          <SegmentedControlItem value="closed" label={statusLabels.closed} />
        </SegmentedControl>
      </HStack>

      <Grid columns={{ minWidth: 340, max: 2, repeat: "fit" }} gap={5}>
        {/* Left: Ticket Queue */}
        <Section variant="section" padding={4}>
          <VStack gap={3}>
            <HStack justify="between" vAlign="center">
              <Heading level={3}>
                {isDe ? "Ticket-Warteschlange" : "Ticket Queue"}
              </Heading>
              <Badge
                variant="neutral"
                label={String(tickets ? tickets.length : 0)}
              />
            </HStack>

            <Divider />

            {!tickets ? (
              <VStack hAlign="center" vAlign="center" minHeight={200}>
                <Spinner
                  label={
                    isDe ? "Lade Support-Tickets..." : "Loading support tickets..."
                  }
                />
              </VStack>
            ) : tickets.length === 0 ? (
              <EmptyState
                isCompact
                icon={<Icon icon={Lifebuoy} size="lg" color="secondary" />}
                title={isDe ? "Keine Support-Tickets" : "No support tickets"}
                description={
                  isDe
                    ? "Keine Support-Tickets für diesen Filter vorhanden."
                    : "No support tickets found for this filter."
                }
              />
            ) : (
              <List hasDividers density="spacious">
                {tickets.map((t: any) => {
                  const isSelected = selectedTicketId === String(t._id);
                  const lastActivityTs =
                    t.lastMessageAt ?? t.updatedAt ?? t.createdAt;
                  return (
                    <ListItem
                      key={t._id}
                      label={t.subject}
                      description={`${t.ticketNumber} · ${t.category} · ${t.requesterEmail} · ${
                        lastActivityTs
                          ? new Date(lastActivityTs).toLocaleDateString(
                              isDe ? "de-DE" : "en-GB"
                            )
                          : "—"
                      }`}
                      isSelected={isSelected}
                      onClick={() => setSelectedTicketId(String(t._id))}
                      endContent={
                        <Badge
                          variant={
                            t.status === "open"
                              ? "warning"
                              : t.status === "resolved" || t.status === "closed"
                                ? "green"
                                : "neutral"
                          }
                          label={statusLabels[t.status as TicketStatus] || t.status}
                        />
                      }
                    />
                  );
                })}
              </List>
            )}
          </VStack>
        </Section>

        {/* Right: Ticket Conversation & Controls */}
        <Section variant="section" padding={5}>
          {!selectedTicketId ? (
            <VStack hAlign="center" vAlign="center" minHeight={400}>
              <EmptyState
                icon={<Icon icon={Lifebuoy} size="lg" color="secondary" />}
                title={isDe ? "Ticket auswählen" : "Select a ticket"}
                description={
                  isDe
                    ? "Wähle links ein Support-Ticket aus, um den Verlauf und interne Notizen einzusehen."
                    : "Select a support ticket on the left to view conversation and internal notes."
                }
              />
            </VStack>
          ) : !ticketDetail ? (
            <VStack hAlign="center" vAlign="center" minHeight={400}>
              <Spinner
                label={isDe ? "Lade Ticket-Details..." : "Loading ticket details..."}
              />
            </VStack>
          ) : (
            <VStack gap={4}>
              <VStack gap={2}>
                <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
                  <Text type="code" color="secondary">
                    {ticketDetail.ticket.ticketNumber} ·{" "}
                    {ticketDetail.ticket.category}
                  </Text>

                  <HStack gap={2} wrap="wrap" vAlign="center">
                    <Selector
                      label="Status"
                      isLabelHidden
                      size="sm"
                      variant="secondary"
                      isDisabled={!canWritePublic}
                      value={ticketDetail.ticket.status}
                      onChange={(val) => handleStatusChange(val as TicketStatus)}
                      options={(Object.keys(statusLabels) as TicketStatus[]).map(
                        (st) => ({
                          value: st,
                          label: statusLabels[st],
                        })
                      )}
                    />

                    <Selector
                      label="Priorität"
                      isLabelHidden
                      size="sm"
                      variant="secondary"
                      isDisabled={!canWritePublic}
                      value={ticketDetail.ticket.priority}
                      onChange={(val) => handlePriorityChange(val as any)}
                      options={[
                        {
                          value: "low",
                          label: isDe ? "Priorität: Niedrig" : "Priority: Low",
                        },
                        {
                          value: "normal",
                          label: isDe ? "Priorität: Normal" : "Priority: Normal",
                        },
                        {
                          value: "high",
                          label: isDe ? "Priorität: Hoch" : "Priority: High",
                        },
                        {
                          value: "urgent",
                          label: isDe ? "Priorität: Dringend" : "Priority: Urgent",
                        },
                      ]}
                    />

                    {canWritePublic && (
                      <Button
                        size="sm"
                        variant="secondary"
                        label={
                          ticketDetail.ticket.assignedToEmail === adminEmail
                            ? isDe
                              ? "Mir zugewiesen"
                              : "Assigned to me"
                            : isDe
                              ? "Mir zuweisen"
                              : "Assign to me"
                        }
                        onClick={handleAssignToMe}
                      />
                    )}
                  </HStack>
                </HStack>

                <Heading level={2}>{ticketDetail.ticket.subject}</Heading>

                <HStack gap={3} wrap="wrap" vAlign="center">
                  <HStack gap={1} vAlign="center">
                    <Icon icon={User} size="sm" color="secondary" />
                    <Text type="supporting">
                      {ticketDetail.ticket.requesterName} (
                      {ticketDetail.ticket.requesterEmail})
                    </Text>
                  </HStack>
                  {(ticketDetail.ticket.businessName ||
                    (ticketDetail as any).businessName) && (
                    <HStack gap={1} vAlign="center">
                      <Icon icon={Storefront} size="sm" color="secondary" />
                      <Text type="label">
                        {ticketDetail.ticket.businessName ||
                          (ticketDetail as any).businessName}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>

              <Divider />

              {/* Message Stream */}
              <VStack gap={3} height={340} isScrollable>
                {ticketDetail.messages.map((msg: any) => {
                  const isInternal =
                    msg.visibility === "internal" ||
                    msg.visibility === "internal_note";
                  const isCustomer =
                    msg.authorType === "merchant" || msg.authorType === "customer";
                  const authorIdentifier = msg.authorEmail || msg.authorId;

                  return (
                    <Card
                      key={msg._id}
                      padding={3}
                      variant={
                        isInternal ? "yellow" : isCustomer ? "muted" : "default"
                      }
                    >
                      <VStack gap={1.5}>
                        <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
                          <HStack gap={2} vAlign="center">
                            <Text weight="semibold">
                              {msg.authorName}
                              {authorIdentifier &&
                              authorIdentifier !== msg.authorName
                                ? ` (${authorIdentifier})`
                                : ""}
                            </Text>
                            {isInternal ? (
                              <Badge
                                variant="warning"
                                icon={<Icon icon={LockSimple} size="xsm" />}
                                label={
                                  isDe
                                    ? "Interne Notiz (Nur Team)"
                                    : "Internal Note (Team Only)"
                                }
                              />
                            ) : (
                              <Badge
                                variant="neutral"
                                label={
                                  isCustomer
                                    ? isDe
                                      ? "Kundenanfrage"
                                      : "Merchant"
                                    : isDe
                                      ? "Öffentliche Antwort"
                                      : "Public Reply"
                                }
                              />
                            )}
                          </HStack>
                          <Text type="supporting" hasTabularNumbers>
                            {new Date(msg.createdAt).toLocaleString(
                              isDe ? "de-DE" : "en-GB"
                            )}
                          </Text>
                        </HStack>

                        <Text>{msg.body}</Text>
                      </VStack>
                    </Card>
                  );
                })}
              </VStack>

              <Divider />

              {/* Composer */}
              <form onSubmit={handleSendMessage}>
                <VStack gap={3}>
                  <SegmentedControl
                    label={isDe ? "Antwortmodus" : "Reply mode"}
                    value={composerMode}
                    onChange={(val) =>
                      setComposerMode(val as "public" | "internal_note")
                    }
                    size="sm"
                  >
                    <SegmentedControlItem
                      value="public"
                      icon={<Icon icon={ChatText} size="sm" />}
                      label={
                        isDe
                          ? "Öffentliche Kundenantwort"
                          : "Public Customer Reply"
                      }
                      isDisabled={!canWritePublic}
                    />
                    {canWriteNote && (
                      <SegmentedControlItem
                        value="internal_note"
                        icon={<Icon icon={LockSimple} size="sm" />}
                        label={
                          isDe
                            ? "Interne Team-Notiz (Nur intern)"
                            : "Internal Team Note"
                        }
                      />
                    )}
                  </SegmentedControl>

                  {composerMode === "internal_note" ? (
                    <Banner
                      status="warning"
                      title={isDe ? "Nur für das interne Team sichtbar" : "Internal Only"}
                      description={
                        isDe
                          ? "Diese Notiz wird niemals im Kundenportal angezeigt und löst keine E-Mail an den Gastronomen aus."
                          : "This note is never returned to the customer portal and sends no customer email."
                      }
                      collapsible={false}
                    />
                  ) : (
                    <Banner
                      status="info"
                      title={isDe ? "Öffentliche Kundenantwort" : "Public Reply"}
                      description={
                        isDe
                          ? "Diese Antwort ist für den Gastronomen unter support.zackisch.com sichtbar und versendet eine E-Mail-Benachrichtigung."
                          : "This reply is visible to the merchant on support.zackisch.com and sends an email notification."
                      }
                      collapsible={false}
                    />
                  )}

                  <TextArea
                    label={
                      composerMode === "internal_note"
                        ? isDe
                          ? "Interne Team-Notiz"
                          : "Internal Team Note"
                        : isDe
                          ? "Kundenantwort"
                          : "Customer Reply"
                    }
                    isLabelHidden
                    rows={4}
                    isRequired
                    value={messageBody}
                    onChange={setMessageBody}
                    placeholder={
                      composerMode === "internal_note"
                        ? isDe
                          ? "Interne Notiz für das Zackisch-Team..."
                          : "Internal note for the Zackisch team..."
                        : isDe
                          ? "Antwort an den Gastronomen verfassen..."
                          : "Write reply to merchant..."
                    }
                    width="100%"
                  />

                  <HStack justify="end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={sending}
                      isDisabled={
                        (composerMode === "public" && !canWritePublic) ||
                        (composerMode === "internal_note" && !canWriteNote)
                      }
                      icon={
                        <Icon
                          icon={
                            composerMode === "internal_note"
                              ? LockSimple
                              : PaperPlaneTilt
                          }
                          size="sm"
                        />
                      }
                      label={
                        composerMode === "internal_note"
                          ? isDe
                            ? "Interne Notiz speichern"
                            : "Save Internal Note"
                          : isDe
                            ? "Kundenantwort senden"
                            : "Send Public Reply"
                      }
                    />
                  </HStack>
                </VStack>
              </form>
            </VStack>
          )}
        </Section>
      </Grid>
    </VStack>
  );
}
