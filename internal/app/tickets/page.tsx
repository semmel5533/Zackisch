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
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";
import {
  Card,
  Button,
  Badge,
  Banner,
  Divider,
  SelectField,
  TextareaField,
  SegmentedControl,
  Spinner,
} from "@/components/ui/primitives";

type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_customer"
  | "resolved"
  | "closed";

export default function TeamTicketsPage() {
  const { currentRegion, adminEmail, adminUser, sessionToken, currentLocale } =
    useAdmin();
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
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            {isDe ? "Support-Tickets" : "Support Tickets"}
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            {isDe
              ? `Händleranfragen, öffentliche Antworten und geschützte interne Team-Notizen für Region ${currentRegion.toUpperCase()}.`
              : `Merchant support requests, public replies, and internal team notes for region ${currentRegion.toUpperCase()}.`}
          </p>
        </div>

        <SegmentedControl
          label={isDe ? "Ticket-Status filtern" : "Filter ticket status"}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as TicketStatus | "all")}
          options={[
            { value: "all", label: isDe ? "Alle" : "All" },
            { value: "open", label: statusLabels.open },
            { value: "in_progress", label: statusLabels.in_progress },
            {
              value: "waiting_for_customer",
              label: statusLabels.waiting_for_customer,
            },
            { value: "resolved", label: statusLabels.resolved },
            { value: "closed", label: statusLabels.closed },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Ticket Queue */}
        <div className="lg:col-span-5">
          <Card padding="md">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--zk-text)]">
                  {isDe ? "Ticket-Warteschlange" : "Ticket Queue"}
                </h2>
                <Badge variant="neutral">
                  {String(tickets ? tickets.length : 0)}
                </Badge>
              </div>

              <Divider />

              {!tickets ? (
                <div className="py-12 flex justify-center">
                  <Spinner
                    label={
                      isDe ? "Lade Support-Tickets..." : "Loading support tickets..."
                    }
                  />
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-2">
                  <Lifebuoy className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
                  <div className="text-sm font-bold text-[var(--zk-text)]">
                    {isDe ? "Keine Support-Tickets" : "No support tickets"}
                  </div>
                  <p className="text-xs text-[var(--zk-text-secondary)]">
                    {isDe
                      ? "Keine Support-Tickets für diesen Filter vorhanden."
                      : "No support tickets found for this filter."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--zk-border)]">
                  {tickets.map((t: any) => {
                    const isSelected = selectedTicketId === String(t._id);
                    const lastActivityTs =
                      t.lastMessageAt ?? t.updatedAt ?? t.createdAt;
                    return (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => setSelectedTicketId(String(t._id))}
                        className={`w-full text-left py-3 px-3 rounded-lg transition-colors flex items-start justify-between gap-3 ${
                          isSelected
                            ? "bg-[var(--zk-info-bg)]"
                            : "hover:bg-[var(--zk-surface-muted)]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-[var(--zk-text)] truncate">
                            {t.subject}
                          </div>
                          <div className="text-xs text-[var(--zk-text-secondary)] mt-0.5 truncate">
                            {t.ticketNumber} · {t.category} · {t.requesterEmail} ·{" "}
                            {lastActivityTs
                              ? new Date(lastActivityTs).toLocaleDateString(
                                  isDe ? "de-DE" : "en-GB"
                                )
                              : "—"}
                          </div>
                        </div>
                        <Badge
                          variant={
                            t.status === "open"
                              ? "warning"
                              : t.status === "resolved" || t.status === "closed"
                                ? "success"
                                : "neutral"
                          }
                        >
                          {statusLabels[t.status as TicketStatus] || t.status}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Ticket Conversation & Controls */}
        <div className="lg:col-span-7">
          <Card padding="lg">
            {!selectedTicketId ? (
              <div className="py-24 text-center flex flex-col items-center gap-2">
                <Lifebuoy className="size-10 text-[var(--zk-text-secondary)]" aria-hidden="true" />
                <div className="text-base font-bold text-[var(--zk-text)]">
                  {isDe ? "Ticket auswählen" : "Select a ticket"}
                </div>
                <p className="text-sm text-[var(--zk-text-secondary)] max-w-sm">
                  {isDe
                    ? "Wähle links ein Support-Ticket aus, um den Verlauf und interne Notizen einzusehen."
                    : "Select a support ticket on the left to view conversation and internal notes."}
                </p>
              </div>
            ) : !ticketDetail ? (
              <div className="py-24 flex justify-center">
                <Spinner
                  label={
                    isDe ? "Lade Ticket-Details..." : "Loading ticket details..."
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[var(--zk-text-secondary)]">
                      {ticketDetail.ticket.ticketNumber} ·{" "}
                      {ticketDetail.ticket.category}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <SelectField
                        label="Status"
                        hideLabel
                        disabled={!canWritePublic}
                        value={ticketDetail.ticket.status}
                        onChange={(val) => handleStatusChange(val as TicketStatus)}
                        options={(Object.keys(statusLabels) as TicketStatus[]).map(
                          (st) => ({
                            value: st,
                            label: statusLabels[st],
                          })
                        )}
                      />

                      <SelectField
                        label="Priorität"
                        hideLabel
                        disabled={!canWritePublic}
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
                          type="button"
                          onClick={handleAssignToMe}
                        >
                          {ticketDetail.ticket.assignedToEmail === adminEmail
                            ? isDe
                              ? "Mir zugewiesen"
                              : "Assigned to me"
                            : isDe
                              ? "Mir zuweisen"
                              : "Assign to me"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--zk-text)]">
                    {ticketDetail.ticket.subject}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--zk-text-secondary)]">
                    <div className="inline-flex items-center gap-1.5">
                      <User className="size-4" aria-hidden="true" />
                      <span>
                        {ticketDetail.ticket.requesterName} (
                        {ticketDetail.ticket.requesterEmail})
                      </span>
                    </div>
                    {(ticketDetail.ticket.businessName ||
                      (ticketDetail as any).businessName) && (
                      <div className="inline-flex items-center gap-1.5 font-semibold text-[var(--zk-text)]">
                        <Storefront className="size-4" aria-hidden="true" />
                        <span>
                          {ticketDetail.ticket.businessName ||
                            (ticketDetail as any).businessName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Message Stream */}
                <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                  {ticketDetail.messages.map((msg: any) => {
                    const isInternal =
                      msg.visibility === "internal" ||
                      msg.visibility === "internal_note";
                    const isCustomer =
                      msg.authorType === "merchant" || msg.authorType === "customer";
                    const authorIdentifier = msg.authorEmail || msg.authorId;

                    return (
                      <div
                        key={msg._id}
                        className={`rounded-xl border p-3.5 flex flex-col gap-1.5 ${
                          isInternal
                            ? "bg-[var(--zk-warning-bg)] border-[var(--zk-warning-text)]/30"
                            : isCustomer
                              ? "bg-[var(--zk-surface-muted)] border-[var(--zk-border)]"
                              : "bg-[var(--zk-surface)] border-[var(--zk-border)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--zk-text)]">
                              {msg.authorName}
                              {authorIdentifier &&
                              authorIdentifier !== msg.authorName
                                ? ` (${authorIdentifier})`
                                : ""}
                            </span>
                            {isInternal ? (
                              <Badge variant="warning">
                                <LockSimple className="size-3.5" aria-hidden="true" />
                                <span>
                                  {isDe
                                    ? "Interne Notiz (Nur Team)"
                                    : "Internal Note (Team Only)"}
                                </span>
                              </Badge>
                            ) : (
                              <Badge variant="neutral">
                                {isCustomer
                                  ? isDe
                                    ? "Kundenanfrage"
                                    : "Merchant"
                                  : isDe
                                    ? "Öffentliche Antwort"
                                    : "Public Reply"}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-[var(--zk-text-secondary)] tabular-nums">
                            {new Date(msg.createdAt).toLocaleString(
                              isDe ? "de-DE" : "en-GB"
                            )}
                          </span>
                        </div>

                        <p className="text-sm text-[var(--zk-text-body)] whitespace-pre-wrap">
                          {msg.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Divider />

                {/* Composer */}
                <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                  <SegmentedControl
                    label={isDe ? "Antwortmodus" : "Reply mode"}
                    value={composerMode}
                    onChange={(val) =>
                      setComposerMode(val as "public" | "internal_note")
                    }
                    options={[
                      {
                        value: "public",
                        disabled: !canWritePublic,
                        label: (
                          <span className="inline-flex items-center gap-1.5">
                            <ChatText className="size-4" aria-hidden="true" />
                            <span>
                              {isDe
                                ? "Öffentliche Kundenantwort"
                                : "Public Customer Reply"}
                            </span>
                          </span>
                        ),
                      },
                      ...(canWriteNote
                        ? [
                            {
                              value: "internal_note" as const,
                              label: (
                                <span className="inline-flex items-center gap-1.5">
                                  <LockSimple className="size-4" aria-hidden="true" />
                                  <span>
                                    {isDe
                                      ? "Interne Team-Notiz (Nur intern)"
                                      : "Internal Team Note"}
                                  </span>
                                </span>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />

                  {composerMode === "internal_note" ? (
                    <Banner
                      status="warning"
                      title={
                        isDe ? "Nur für das interne Team sichtbar" : "Internal Only"
                      }
                      description={
                        isDe
                          ? "Diese Notiz wird niemals im Kundenportal angezeigt und löst keine E-Mail an den Gastronomen aus."
                          : "This note is never returned to the customer portal and sends no customer email."
                      }
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
                    />
                  )}

                  <TextareaField
                    label={
                      composerMode === "internal_note"
                        ? isDe
                          ? "Interne Team-Notiz"
                          : "Internal Team Note"
                        : isDe
                          ? "Kundenantwort"
                          : "Customer Reply"
                    }
                    hideLabel
                    rows={4}
                    required
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
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={sending}
                      disabled={
                        (composerMode === "public" && !canWritePublic) ||
                        (composerMode === "internal_note" && !canWriteNote)
                      }
                    >
                      {composerMode === "internal_note" ? (
                        <LockSimple className="size-4" aria-hidden="true" />
                      ) : (
                        <PaperPlaneTilt className="size-4" aria-hidden="true" />
                      )}
                      <span>
                        {composerMode === "internal_note"
                          ? isDe
                            ? "Interne Notiz speichern"
                            : "Save Internal Note"
                          : isDe
                            ? "Kundenantwort senden"
                            : "Send Public Reply"}
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
