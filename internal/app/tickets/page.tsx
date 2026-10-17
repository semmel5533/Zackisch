"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  LifeBuoy,
  Lock,
  MessageSquare,
  Send,
  User,
  Store,
  ExternalLink,
  Search,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [composerMode, setComposerMode] = useState<"public" | "internal_note">("public");
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

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(
      (t: any) =>
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.businessName?.toLowerCase().includes(q) ||
        t.requesterEmail?.toLowerCase().includes(q) ||
        t.requesterName?.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  // Set default selection once tickets load if none is selected
  React.useEffect(() => {
    if (!selectedTicketId && filteredTickets.length > 0) {
      setSelectedTicketId(String(filteredTickets[0]._id));
    }
  }, [selectedTicketId, filteredTickets]);

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
  const updateStatusAndAssignee = useMutation((anyApi as any).support.updateTicketStatusAndAssignee);

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

  const handlePriorityChange = async (newPriority: "low" | "normal" | "high" | "urgent") => {
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
    in_progress: isDe ? "In Bearbeitung" : "In Progress",
    waiting_for_customer: isDe ? "Warten auf Kunde" : "Waiting for Customer",
    resolved: isDe ? "Gelöst" : "Resolved",
    closed: isDe ? "Geschlossen" : "Closed",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Headrow (ops.html .headrow) */}
      <div className="headrow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <p className="label text-[11px] font-semibold uppercase tracking-[.08em] text-muted-foreground">
            {isDe ? "Arbeitsbereich / Support" : "Workspace / Support"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            {isDe ? "Supportanfragen" : "Support Inquiries"}
          </h1>
          <p className="lead text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {isDe
              ? "Anfragen prüfen, zuordnen und beantworten. Zugriff nur auf berechtigte Region und Rolle."
              : "Review, assign, and resolve support requests. Access restricted to authorized region and role."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://support.zackisch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn white inline-flex min-h-[38px] items-center justify-center rounded-full border border-border bg-white px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors gap-1.5 shadow-2xs"
          >
            <span>{isDe ? "Hilfeartikel ansehen" : "View Help Articles"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted/30 border border-border rounded-full p-1 w-fit">
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
            className={`min-h-[32px] px-3.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === st
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {st === "all" ? (isDe ? "Alle" : "All") : statusLabels[st as TicketStatus]}
          </button>
        ))}
      </div>

      {/* Three-Pane Operations Workbench (ops.html .ops) */}
      <div className="ops grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-border bg-card rounded-xl overflow-hidden shadow-xs">
        {/* Pane 1: Ticket Queue (ops.html .ops-pane) */}
        <section className="ops-pane lg:col-span-4 border-r border-border flex flex-col justify-between overflow-hidden">
          <div>
            <div className="ops-head px-4 py-3.5 border-b border-border flex items-center justify-between text-xs font-semibold text-foreground bg-muted/20">
              <span>{isDe ? "Eingang" : "Inbox"}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {filteredTickets.length} {isDe ? "Tickets" : "tickets"}
              </span>
            </div>

            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isDe ? "Suche nach Ticket oder Betrieb…" : "Search ticket or business…"}
                  className="w-full h-9 pl-9 pr-3 text-xs rounded-full border border-border bg-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            <div className="divide-y divide-border/60 max-h-[560px] overflow-y-auto">
              {!tickets ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {isDe ? "Lade Support-Tickets…" : "Loading tickets…"}
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {isDe
                    ? "Keine Tickets für diesen Filter gefunden."
                    : "No tickets found for this filter."}
                </div>
              ) : (
                filteredTickets.map((t: any) => {
                  const isSelected = selectedTicketId === String(t._id);
                  const lastActivityTs = t.lastMessageAt ?? t.updatedAt ?? t.createdAt;
                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => setSelectedTicketId(String(t._id))}
                      className={`ticket w-full text-left p-4 transition-colors cursor-pointer border-l-2 ${
                        isSelected
                          ? "bg-muted/70 border-foreground"
                          : "border-transparent hover:bg-muted/30"
                      }`}
                    >
                      <div className="tiny-label flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                          #{t.ticketNumber} · {statusLabels[t.status as TicketStatus] || t.status}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            t.status === "open"
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : t.status === "resolved" || t.status === "closed"
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {statusLabels[t.status as TicketStatus] || t.status}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                        {t.subject}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                        <span className="truncate">
                          {t.businessName || t.requesterName || t.requesterEmail}
                        </span>
                        <span className="shrink-0 ml-2">
                          {lastActivityTs
                            ? new Date(lastActivityTs).toLocaleDateString(
                                isDe ? "de-DE" : "en-GB"
                              )
                            : "—"}
                        </span>
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Pane 2: Conversation Thread & Composer (ops.html .ops-pane) */}
        <section className="ops-pane lg:col-span-5 border-r border-border flex flex-col justify-between overflow-hidden">
          {!selectedTicketId ? (
            <div className="my-auto text-center py-16 px-4">
              <LifeBuoy className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                {isDe
                  ? "Wähle links ein Support-Ticket aus"
                  : "Select a support ticket on the left"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isDe
                  ? "Verlauf einsehen, interne Notizen verfassen oder dem Betrieb antworten."
                  : "View history, write internal notes, or reply to the merchant."}
              </p>
            </div>
          ) : !ticketDetail ? (
            <div className="my-auto text-center py-16 text-xs text-muted-foreground">
              {isDe ? "Lade Ticket-Details…" : "Loading ticket details…"}
            </div>
          ) : (
            <>
              <div>
                {/* Ops Head with Status & Assignee Controls */}
                <div className="ops-head px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 bg-muted/20">
                  <span className="text-xs font-mono font-bold text-foreground">
                    #{ticketDetail.ticket.ticketNumber}{" "}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      · {statusLabels[ticketDetail.ticket.status as TicketStatus]}
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={ticketDetail.ticket.status}
                      disabled={!canWritePublic}
                      onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                      className="h-7 rounded-full border border-border px-2 text-[11px] font-semibold bg-background text-foreground"
                    >
                      {(Object.keys(statusLabels) as TicketStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {statusLabels[st]}
                        </option>
                      ))}
                    </select>

                    <select
                      value={ticketDetail.ticket.priority}
                      disabled={!canWritePublic}
                      onChange={(e) => handlePriorityChange(e.target.value as any)}
                      className="h-7 rounded-full border border-border px-2 text-[11px] font-semibold bg-background text-foreground"
                    >
                      <option value="low">{isDe ? "Niedrig" : "Low"}</option>
                      <option value="normal">{isDe ? "Normal" : "Normal"}</option>
                      <option value="high">{isDe ? "Hoch" : "High"}</option>
                      <option value="urgent">{isDe ? "Dringend" : "Urgent"}</option>
                    </select>

                    {canWritePublic && (
                      <button
                        type="button"
                        onClick={handleAssignToMe}
                        className="h-7 px-2.5 rounded-full border border-border text-[11px] font-semibold text-foreground hover:bg-muted cursor-pointer"
                      >
                        {ticketDetail.ticket.assignedToEmail === adminEmail
                          ? isDe
                            ? "Mir zugewiesen"
                            : "Assigned"
                          : isDe
                          ? "Mir zuweisen"
                          : "Assign"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Thread Header */}
                <div className="p-5 border-b border-border/60">
                  <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                    {ticketDetail.ticket.subject}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticketDetail.ticket.businessName || ticketDetail.ticket.requesterName} ·{" "}
                    {ticketDetail.ticket.category} · {ticketDetail.ticket.regionId.toUpperCase()}
                  </p>
                </div>

                {/* Messages stream */}
                <div className="thread p-5 space-y-3.5 max-h-[360px] overflow-y-auto">
                  {ticketDetail.messages.map((msg: any) => {
                    const isInternal =
                      msg.visibility === "internal" || msg.visibility === "internal_note";
                    const isCustomer =
                      msg.authorType === "merchant" || msg.authorType === "customer";
                    const authorIdentifier = msg.authorEmail || msg.authorId;

                    return (
                      <div
                        key={msg._id}
                        className={`msg rounded-xl p-4 border text-xs leading-relaxed ${
                          isInternal
                            ? "internal bg-amber-50/70 border-amber-200 text-amber-950"
                            : isCustomer
                            ? "bg-muted/40 border-border text-foreground"
                            : "bg-card border-border text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {msg.authorName}
                              {authorIdentifier && authorIdentifier !== msg.authorName
                                ? ` (${authorIdentifier})`
                                : ""}
                            </span>
                            {isInternal ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-950">
                                <Lock className="w-2.5 h-2.5" />
                                {isDe ? "Interne Notiz · nur Team" : "Internal Note · Team Only"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                                {isCustomer
                                  ? isDe
                                    ? "Betrieb"
                                    : "Merchant"
                                  : isDe
                                  ? "Team-Antwort"
                                  : "Team Reply"}
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground text-[10px]">
                            {new Date(msg.createdAt).toLocaleTimeString(isDe ? "de-DE" : "en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap mt-1">{msg.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Composer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canWritePublic}
                    onClick={() => setComposerMode("public")}
                    className={`h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      composerMode === "public"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isDe ? "Öffentliche Antwort" : "Public Reply"}</span>
                  </button>

                  {canWriteNote && (
                    <button
                      type="button"
                      onClick={() => setComposerMode("internal_note")}
                      className={`h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                        composerMode === "internal_note"
                          ? "bg-amber-400 text-amber-950 font-bold"
                          : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isDe ? "Interne Notiz" : "Internal Note"}</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={3}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder={
                    composerMode === "internal_note"
                      ? isDe
                        ? "Interne Notiz eingeben (nur Team)…"
                        : "Enter internal note (team only)…"
                      : isDe
                      ? "Antwort eingeben…"
                      : "Enter reply to merchant…"
                  }
                  className={`composer w-full rounded-lg border p-3 text-xs focus:outline-hidden ${
                    composerMode === "internal_note"
                      ? "border-amber-300 bg-amber-50/40 focus:border-amber-500 text-amber-950"
                      : "border-border bg-background focus:border-foreground text-foreground"
                  }`}
                />

                <div className="flex items-center justify-between gap-3">
                  <span className="small muted text-[11px] text-muted-foreground">
                    {composerMode === "internal_note"
                      ? isDe
                        ? "NUR TEAM: Nicht für den Betrieb sichtbar."
                        : "TEAM ONLY: Not visible to merchant."
                      : isDe
                      ? "Die Antwort ist für den Betrieb sichtbar."
                      : "Visible to merchant via support."}
                  </span>

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      (composerMode === "public" && !canWritePublic) ||
                      (composerMode === "internal_note" && !canWriteNote)
                    }
                    className={`btn min-h-[36px] px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
                      composerMode === "internal_note"
                        ? "bg-amber-400 text-amber-950 hover:bg-amber-300"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    <span>
                      {composerMode === "internal_note"
                        ? isDe
                          ? "Notiz speichern →"
                          : "Save Note →"
                        : isDe
                        ? "Antwort senden →"
                        : "Send Reply →"}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        {/* Pane 3: Business Context Rail (ops.html aside.ops-pane) */}
        <aside className="ops-pane lg:col-span-3 bg-muted/10 p-0 hidden lg:block overflow-hidden">
          <div className="ops-head px-5 py-3 border-b border-border text-xs font-semibold text-foreground bg-muted/20">
            {isDe ? "Betriebskontext" : "Business Context"}
          </div>

          {!ticketDetail?.ticket ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {isDe ? "Kein Ticket ausgewählt." : "No ticket selected."}
            </div>
          ) : (
            <dl className="context p-5 space-y-4 text-xs">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Betrieb" : "Business"}
                </dt>
                <dd className="font-semibold text-foreground mt-1">
                  {ticketDetail.ticket.businessName ||
                    ticketDetail.ticket.requesterName ||
                    "—"}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Region" : "Region"}
                </dt>
                <dd className="font-semibold text-foreground mt-1">
                  {ticketDetail.ticket.regionId === "de"
                    ? "Deutschland (DE)"
                    : ticketDetail.ticket.regionId.toUpperCase()}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Kontakt E-Mail" : "Contact Email"}
                </dt>
                <dd className="font-semibold text-foreground mt-1 break-all">
                  {ticketDetail.ticket.requesterEmail}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Kategorie" : "Category"}
                </dt>
                <dd className="font-semibold text-foreground mt-1">
                  {ticketDetail.ticket.category}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Priorität" : "Priority"}
                </dt>
                <dd className="font-semibold text-foreground mt-1 capitalize">
                  {ticketDetail.ticket.priority}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Zugewiesen an" : "Assigned To"}
                </dt>
                <dd className="font-semibold text-foreground mt-1">
                  {ticketDetail.ticket.assignedToName ||
                    ticketDetail.ticket.assignedToEmail ||
                    (isDe ? "Nicht zugewiesen" : "Unassigned")}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isDe ? "Verknüpfte Bestellungen" : "Linked Orders"}
                </dt>
                <dd className="text-muted-foreground mt-1">
                  {isDe
                    ? "Nur berechtigte Daten sichtbar"
                    : "Only authorized data visible"}
                </dd>
              </div>
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}
