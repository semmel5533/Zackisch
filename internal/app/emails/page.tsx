"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import {
  Card,
  Badge,
  StatusDot,
  TextField,
  Spinner,
} from "@/components/ui/primitives";

export default function EmailsAuditPage() {
  const { currentRegion, sessionToken, currentLocale } = useAdmin();
  const isDe = currentLocale !== "en";
  const [search, setSearch] = useState("");

  const logs = useQuery(
    (anyApi as any).admin.listAuditLogs,
    sessionToken ? { regionId: currentRegion, sessionToken, limit: 250 } : "skip"
  );

  const emailLogs = (logs || []).filter((log: any) => {
    const isEmailRelated =
      log.action.includes("newsletter") ||
      log.action.includes("otp") ||
      log.action.includes("ticket") ||
      log.action.includes("staff.invite") ||
      log.targetType.includes("newsletter") ||
      log.targetType.includes("ticket");

    if (!isEmailRelated) return false;
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      log.actorEmail.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.targetId && log.targetId.toLowerCase().includes(q)) ||
      (log.metadataJson && log.metadataJson.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            {isDe
              ? "E-Mail-Verkehr & Systembenachrichtigungen"
              : "Email Traffic & System Notifications"}
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            {isDe
              ? `Übersicht über ausgehende E-Mail-Ereignisse (OTP-Codes, Ticket-Benachrichtigungen, Newsletter & Einladungen) über Google Workspace Relay (noreply@zackisch.com) in Region ${currentRegion.toUpperCase()}.`
              : `Outbound email events (OTP codes, ticket notifications, newsletters & invitations) via Google Workspace Relay (noreply@zackisch.com) in region ${currentRegion.toUpperCase()}.`}
          </p>
        </div>

        <Badge variant="success">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot variant="success" label="Verbunden" />
            <span>SMTP Relay: smtp.gmail.com:587</span>
          </span>
        </Badge>
      </div>

      {/* SMTP Configuration Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
              <EnvelopeSimple className="size-4" aria-hidden="true" />
              <span>{isDe ? "Absender (From)" : "Sender (From)"}</span>
            </div>
            <div className="font-mono text-sm font-bold text-[var(--zk-text)]">
              noreply@zackisch.com
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              Auth: selim@zackisch.com (Google Workspace)
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
              <ShieldCheck className="size-4" aria-hidden="true" />
              <span>{isDe ? "Transaktions-Typen" : "Transactional Types"}</span>
            </div>
            <div className="text-sm font-bold text-[var(--zk-text)]">
              OTP · Support · Receipts · Newsletter
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              {isDe
                ? "Alle E-Mails nutzen das zentrale Zackisch HTML-Template"
                : "All emails use the canonical Zackisch HTML template"}
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
              {isDe ? "Protokollierte Ereignisse" : "Logged Events"}
            </span>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {emailLogs.length}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              {isDe
                ? `In Region ${currentRegion.toUpperCase()} erfasst`
                : `Recorded in region ${currentRegion.toUpperCase()}`}
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="max-w-md">
        <TextField
          type="search"
          label={
            isDe
              ? "Nach Empfänger, Ticket-Nummer oder Aktion filtern"
              : "Filter by recipient, ticket number, or action"
          }
          hideLabel
          value={search}
          onChange={setSearch}
          placeholder={
            isDe
              ? "Nach Empfänger, Ticket-Nummer oder Aktion filtern..."
              : "Filter by recipient, ticket number, or action..."
          }
        />
      </div>

      {/* Log Table */}
      <Card padding="none">
        {!logs ? (
          <div className="py-16 flex justify-center">
            <Spinner
              label={
                isDe ? "Lade E-Mail-Protokolle..." : "Loading email logs..."
              }
            />
          </div>
        ) : emailLogs.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-2">
            <EnvelopeSimple className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <div className="text-base font-bold text-[var(--zk-text)]">
              {isDe ? "Keine Einträge gefunden" : "No entries found"}
            </div>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              {isDe
                ? "Keine E-Mail-Ereignisse für diesen Filter gefunden."
                : "No email events found for this filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  <th className="py-3 px-4">{isDe ? "Zeitpunkt" : "Timestamp"}</th>
                  <th className="py-3 px-4">{isDe ? "Ereignis / Typ" : "Event / Type"}</th>
                  <th className="py-3 px-4">{isDe ? "Auslöser" : "Actor"}</th>
                  <th className="py-3 px-4">{isDe ? "Ziel / Referenz" : "Target / Ref"}</th>
                  <th className="py-3 px-4">{isDe ? "Details" : "Details"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {emailLogs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-[var(--zk-surface-muted)]">
                    <td className="py-3 px-4 text-xs text-[var(--zk-text-secondary)] tabular-nums whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString(
                        isDe ? "de-DE" : "en-GB"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--zk-text)]">
                      {log.actorEmail}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--zk-text)]">
                      {log.targetType}
                      {log.targetId ? ` · ${log.targetId}` : ""}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--zk-text-secondary)] max-w-xs truncate">
                      {log.metadataJson || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
