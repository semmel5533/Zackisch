"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  History,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  MailCheck,
} from "lucide-react";
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
          type: typeFilter === "all" ? undefined : typeFilter,
          limit: 100,
          sessionToken,
        }
      : "skip"
  );

  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await testSmtpAction({ testRecipient: adminEmail });
      if (res.success) {
        toast.success("Testnachricht über Google Workspace SMTP erfolgreich zugestellt!");
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  const filtered = (emailLogs || []).filter((log: any) =>
    log.recipient.toLowerCase().includes(search.toLowerCase()) ||
    log.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            E-Mail-Versandprotokoll
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Alle durch das Zackisch-Backend ausgelösten E-Mails (Google Workspace SMTP). Keine manuellen Postfach-Mails.
          </p>
        </div>

        <button
          onClick={handleTestSmtp}
          disabled={testingSmtp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-50 transition-all shadow-2xs disabled:opacity-50"
        >
          {testingSmtp ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          SMTP Testmail senden
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              typeFilter === "all" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Alle Typen
          </button>
          <button
            onClick={() => setTypeFilter("otp")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              typeFilter === "otp" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            OTP / Auth
          </button>
          <button
            onClick={() => setTypeFilter("newsletter")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              typeFilter === "newsletter" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Newsletter
          </button>
          <button
            onClick={() => setTypeFilter("test")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              typeFilter === "test" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Testnachrichten
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Empfänger / Betreff suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Empfänger</th>
                <th className="py-3.5 px-4">Anlass / Typ</th>
                <th className="py-3.5 px-4">Betreff</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Zeitpunkt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!emailLogs ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    Lade E-Mail-Protokoll...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    Keine E-Mail-Einträge gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map((log: any) => (
                  <tr key={log._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-zinc-900 font-mono text-xs">
                      {log.recipient}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-800 max-w-sm truncate">
                      {log.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      {log.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Gesendet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full" title={log.error}>
                          <XCircle className="w-3 h-3" /> Fehlgeschlagen
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right font-num text-zinc-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString("de-DE")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
