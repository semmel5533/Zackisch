"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  LifeBuoy,
  Lock,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Store,
} from "lucide-react";
import { toast } from "sonner";

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
    "public",
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
    (anyApi as any).support.listTicketsForTeam,
    sessionToken
      ? {
          sessionToken,
          regionId: currentRegion,
          actorEmail: adminEmail,
          status: statusFilter === "all" ? undefined : statusFilter,
        }
      : "skip",
  );

  const ticketDetail = useQuery(
    (anyApi as any).support.getTicketForTeam,
    selectedTicketId && sessionToken
      ? {
          sessionToken,
          ticketId: selectedTicketId,
          actorEmail: adminEmail,
          regionId: currentRegion,
        }
      : "skip",
  );

  const addPublicReply = useMutation(
    (anyApi as any).support.addTeamPublicReply,
  );
  const addInternalNote = useMutation(
    (anyApi as any).support.addTeamInternalNote,
  );
  const updateStatusAndAssignee = useMutation(
    (anyApi as any).support.updateTicketStatusAndAssignee,
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
          isDe
            ? "Öffentliche Kundenantwort gesendet."
            : "Public customer reply sent.",
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
          isDe
            ? "Interne Team-Notiz gespeichert."
            : "Internal team note saved.",
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
    newPriority: "low" | "normal" | "high" | "urgent",
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {isDe ? "Support-Tickets" : "Support Tickets"}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isDe
              ? `Händleranfragen, öffentliche Antworten und geschützte interne Team-Notizen für Region ${currentRegion.toUpperCase()}.`
              : `Merchant support requests, public replies, and internal team notes for region ${currentRegion.toUpperCase()}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-zinc-200 rounded-full p-1">
          {(
            [
              "all",
              "open",
              "in_progress",
              "waiting_for_customer",
              "resolved",
              "closed",
            ] as const
          ).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {st === "all"
                ? isDe
                  ? "Alle"
                  : "All"
                : statusLabels[st as TicketStatus]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Ticket queue */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">
              {isDe ? "Ticket-Warteschlange" : "Ticket Queue"}
            </span>
            <span className="text-xs text-zinc-400">
              {tickets ? tickets.length : 0}
            </span>
          </div>

          <div className="divide-y divide-zinc-100 max-h-[680px] overflow-y-auto">
            {!tickets ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                {isDe ? "Lade Support-Tickets..." : "Loading support tickets..."}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                {isDe
                  ? "Keine Support-Tickets für diesen Filter vorhanden."
                  : "No support tickets found for this filter."}
              </div>
            ) : (
              tickets.map((t: any) => {
                const isSelected = selectedTicketId === String(t._id);
                return (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => setSelectedTicketId(String(t._id))}
                    className={`w-full text-left p-4 transition-colors ${
                      isSelected ? "bg-zinc-900 text-white" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[11px] font-mono ${
                          isSelected ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {t.ticketNumber} · {t.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-white/15 text-white"
                            : t.status === "open"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : t.status === "resolved" || t.status === "closed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {statusLabels[t.status as TicketStatus] || t.status}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-semibold line-clamp-1 ${
                        isSelected ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {t.subject}
                    </div>
                    <div
                      className={`mt-1.5 flex items-center justify-between text-[11px] ${
                        isSelected ? "text-zinc-300" : "text-zinc-500"
                      }`}
                    >
                      <span className="truncate">{t.requesterEmail}</span>
                      <span>
                        {new Date(t.lastActivityAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Ticket conversation & controls */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[560px]">
          {!selectedTicketId ? (
            <div className="my-auto text-center py-12">
              <LifeBuoy className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-zinc-600">
                {isDe
                  ? "Wähle links ein Support-Ticket aus, um den Verlauf und interne Notizen einzusehen."
                  : "Select a support ticket on the left to view conversation and internal notes."}
              </p>
            </div>
          ) : !ticketDetail ? (
            <div className="my-auto text-center py-12 text-xs text-zinc-400">
              {isDe ? "Lade Ticket-Details..." : "Loading ticket details..."}
            </div>
          ) : (
            <>
              <div>
                {/* Ticket header & metadata */}
                <div className="border-b border-zinc-100 pb-4 mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-500">
                      {ticketDetail.ticket.ticketNumber} ·{" "}
                      {ticketDetail.ticket.category}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={ticketDetail.ticket.status}
                        disabled={!canWritePublic}
                        onChange={(e) =>
                          handleStatusChange(e.target.value as TicketStatus)
                        }
                        className="h-8 rounded-full border border-zinc-200 px-3 text-xs font-semibold bg-white text-zinc-900"
                      >
                        {(Object.keys(statusLabels) as TicketStatus[]).map(
                          (st) => (
                            <option key={st} value={st}>
                              {statusLabels[st]}
                            </option>
                          ),
                        )}
                      </select>

                      <select
                        value={ticketDetail.ticket.priority}
                        disabled={!canWritePublic}
                        onChange={(e) =>
                          handlePriorityChange(e.target.value as any)
                        }
                        className="h-8 rounded-full border border-zinc-200 px-3 text-xs font-semibold bg-white text-zinc-900"
                      >
                        <option value="low">Priorität: Niedrig</option>
                        <option value="normal">Priorität: Normal</option>
                        <option value="high">Priorität: Hoch</option>
                        <option value="urgent">Priorität: Dringend</option>
                      </select>

                      {canWritePublic && (
                        <button
                          type="button"
                          onClick={handleAssignToMe}
                          className="h-8 px-3 rounded-full border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          {ticketDetail.ticket.assignedStaffEmail === adminEmail
                            ? isDe
                              ? "Mir zugewiesen"
                              : "Assigned to me"
                            : isDe
                              ? "Mir zuweisen"
                              : "Assign to me"}
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900">
                    {ticketDetail.ticket.subject}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {ticketDetail.ticket.requesterName} (
                      {ticketDetail.ticket.requesterEmail})
                    </span>
                    {ticketDetail.businessName && (
                      <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                        <Store className="w-3.5 h-3.5" />
                        {ticketDetail.businessName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message stream */}
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 mb-5">
                  {ticketDetail.messages.map((msg: any) => {
                    const isInternal = msg.visibility === "internal_note";
                    const isCustomer = msg.authorType === "customer";
                    return (
                      <div
                        key={msg._id}
                        className={`rounded-xl p-4 border ${
                          isInternal
                            ? "bg-amber-50/90 border-amber-300"
                            : isCustomer
                              ? "bg-zinc-50 border-zinc-200"
                              : "bg-white border-zinc-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900">
                              {msg.authorName} ({msg.authorEmail})
                            </span>
                            {isInternal ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-semibold text-[10px]">
                                <Lock className="w-2.5 h-2.5" />
                                {isDe
                                  ? "Interne Notiz (Nur Team)"
                                  : "Internal Note (Team Only)"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium text-[10px]">
                                {isCustomer
                                  ? isDe
                                    ? "Kundenanfrage"
                                    : "Customer"
                                  : isDe
                                    ? "Öffentliche Antwort"
                                    : "Public Reply"}
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-500">
                            {new Date(msg.createdAt).toLocaleString("de-DE")}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">
                          {msg.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Composer with explicit separation between Public Reply and Internal Note */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-zinc-100 pt-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canWritePublic}
                    onClick={() => setComposerMode("public")}
                    className={`h-9 px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      composerMode === "public"
                        ? "bg-black text-white"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {isDe
                      ? "Öffentliche Kundenantwort"
                      : "Public Customer Reply"}
                  </button>

                  {canWriteNote && (
                    <button
                      type="button"
                      onClick={() => setComposerMode("internal_note")}
                      className={`h-9 px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                        composerMode === "internal_note"
                          ? "bg-amber-500 text-black"
                          : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {isDe
                        ? "Interne Team-Notiz (Nur intern)"
                        : "Internal Team Note"}
                    </button>
                  )}
                </div>

                {composerMode === "internal_note" ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isDe
                        ? "NUR INTERN: Diese Notiz wird niemals im Kundenportal angezeigt und löst keine E-Mail an den Gastronomen aus."
                        : "INTERNAL ONLY: This note is never returned to the customer portal and sends no customer email."}
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 py-2 text-[11px] text-zinc-600 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isDe
                        ? "ÖFFENTLICH: Diese Antwort ist für den Gastronomen unter support.zackisch.com sichtbar und versendet eine E-Mail-Benachrichtigung."
                        : "PUBLIC: This reply is visible to the merchant on support.zackisch.com and sends an email notification."}
                    </span>
                  </div>
                )}

                <textarea
                  rows={4}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder={
                    composerMode === "internal_note"
                      ? isDe
                        ? "Interne Notiz für das Zackisch-Team..."
                        : "Internal note for the Zackisch team..."
                      : isDe
                        ? "Antwort an den Gastronomen verfassen..."
                        : "Write reply to merchant..."
                  }
                  className={`w-full rounded-xl border p-3 text-xs focus:outline-hidden ${
                    composerMode === "internal_note"
                      ? "border-amber-300 bg-amber-50/40 focus:border-amber-500"
                      : "border-zinc-200 bg-white focus:border-zinc-900"
                  }`}
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      sending ||
                      (composerMode === "public" && !canWritePublic) ||
                      (composerMode === "internal_note" && !canWriteNote)
                    }
                    className={`h-10 px-5 rounded-full text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-50 ${
                      composerMode === "internal_note"
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-black text-white hover:bg-zinc-800"
                    }`}
                  >
                    {composerMode === "internal_note" ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        {isDe
                          ? "Interne Notiz speichern"
                          : "Save Internal Note"}
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        {isDe ? "Kundenantwort senden" : "Send Public Reply"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
