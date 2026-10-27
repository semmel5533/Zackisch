"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { ShieldCheck } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { Card, Badge, TextField, Spinner } from "@/components/ui/primitives";

export default function AuditPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [filterActor, setFilterActor] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const logs = useQuery(
    (anyApi as any).admin.listAuditLogs,
    sessionToken ? { regionId: currentRegion, sessionToken, limit: 200 } : "skip"
  );

  const filteredLogs = (logs || []).filter((log: any) => {
    const matchActor = filterActor
      ? log.actorEmail.toLowerCase().includes(filterActor.toLowerCase())
      : true;
    const matchAction = filterAction
      ? log.action.toLowerCase().includes(filterAction.toLowerCase())
      : true;
    return matchActor && matchAction;
  });

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Revisionssicherer Audit-Trail
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Lückenlose Protokollierung aller administrativen und operativen Aktionen in Region{" "}
            {currentRegion.toUpperCase()}.
          </p>
        </div>

        <Badge variant="neutral">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            <span>Unveränderliches Protokoll</span>
          </span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
        <TextField
          type="search"
          label="Nach Mitarbeiter-E-Mail filtern"
          hideLabel
          placeholder="Nach Mitarbeiter-E-Mail filtern..."
          value={filterActor}
          onChange={setFilterActor}
        />

        <TextField
          type="search"
          label="Nach Aktion filtern"
          hideLabel
          placeholder="Nach Aktion filtern (z.B. newsletter, partner, staff)..."
          value={filterAction}
          onChange={setFilterAction}
        />
      </div>

      <Card padding="none">
        {!logs ? (
          <div className="py-16 flex justify-center">
            <Spinner label="Lade Audit-Trail..." />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-2">
            <ShieldCheck className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <div className="text-base font-bold text-[var(--zk-text)]">
              Keine Einträge gefunden
            </div>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              Es wurden keine passenden Audit-Einträge gefunden.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  <th className="py-3 px-4">Zeitstempel</th>
                  <th className="py-3 px-4">Akteur & Rolle</th>
                  <th className="py-3 px-4">Aktion</th>
                  <th className="py-3 px-4">Zielobjekt</th>
                  <th className="py-3 px-4">Metadaten (JSON)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {filteredLogs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-[var(--zk-surface-muted)]">
                    <td className="py-3 px-4 text-xs text-[var(--zk-text-secondary)] tabular-nums whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("de-DE")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--zk-text)]">
                        {log.actorEmail}
                      </div>
                      <div className="text-xs text-[var(--zk-text-secondary)]">
                        {log.actorRole}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral">{log.action}</Badge>
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
