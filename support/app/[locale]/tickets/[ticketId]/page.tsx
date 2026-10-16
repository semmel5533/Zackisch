"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import { toast } from "sonner";
import { ArrowLeft, Send, ShieldCheck, User } from "lucide-react";

const STORAGE_KEY = "zackisch_support_customer_ctx";

export default function CustomerTicketThreadPage() {
  const params = useParams();
  const locale: SupportLocale =
    params?.locale === "de-en" ? "de-en" : "de-de";
  const isDe = locale === "de-de";
  const ticketId = String(params?.ticketId || "");

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionToken) setSessionToken(parsed.sessionToken);
      }
    } catch {
      // ignore
    }
  }, []);

  const thread = useQuery(
    api.support.getCustomerTicketThread,
    ticketId && sessionToken
      ? {
          ticketId: ticketId as any,
          sessionToken,
        }
      : "skip"
  );

  const addReply = useMutation(api.support.addCustomerReply);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !thread || !sessionToken) return;
    setIsSending(true);
    try {
      await addReply({
        ticketId: thread.ticket._id,
        sessionToken,
        body: replyBody.trim(),
      });
      setReplyBody("");
      toast.success(isDe ? "Antwort gesendet." : "Reply sent.");
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Senden.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SupportShell locale={locale}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <Link
          href={`/${locale}/tickets`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525252] hover:text-[#0A0A0A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isDe ? "Zurück zu allen Tickets" : "Back to all tickets"}</span>
        </Link>

        {!sessionToken ? (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 space-y-4 shadow-sm">
            <h1 className="text-lg font-bold text-[#0A0A0A] font-brand">
              {isDe
                ? "Anmeldung erforderlich"
                : "Authentication Required"}
            </h1>
            <p className="text-xs text-[#525252]">
              {isDe
                ? "Um auf dieses Ticket zuzugreifen, musst du mit deinem Betriebskonto angemeldet sein."
                : "To access this ticket, please sign in with your verified merchant account."}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/tickets`}
                className="h-10 px-5 rounded-full bg-[#161616] text-white hover:bg-[#252525] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <span>{isDe ? "Zu meinen Tickets" : "Go to my tickets"}</span>
              </Link>
            </div>
          </div>
        ) : !thread ? (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 space-y-4 shadow-sm">
            <h1 className="text-lg font-bold text-[#0A0A0A] font-brand">
              {isDe ? "Ticket wird geladen..." : "Loading ticket..."}
            </h1>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 space-y-6 shadow-sm">
            <header className="border-b border-[#E0E0E0] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-num px-2.5 py-0.5 rounded-full bg-[#161616] text-white">
                    {thread.ticket.ticketNumber}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F2F2] border border-[#E0E0E0] text-[#525252]">
                    {thread.ticket.status}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[#0A0A0A] font-brand">
                  {thread.ticket.subject}
                </h1>
              </div>
              <div className="text-xs text-[#525252] font-num">
                {new Date(thread.ticket.createdAt).toLocaleString(
                  isDe ? "de-DE" : "en-US"
                )}
              </div>
            </header>

            {/* Messages (strictly public-only from server) */}
            <div className="space-y-4">
              {thread.messages.map((msg) => {
                const isStaff = msg.authorType === "staff";
                return (
                  <div
                    key={msg._id}
                    className={`p-4 rounded-xl border ${
                      isStaff
                        ? "bg-[#F7F7F7] border-[#C4C4C4]"
                        : "bg-white border-[#E0E0E0]"
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold inline-flex items-center gap-1.5 text-[#0A0A0A]">
                        {isStaff ? (
                          <ShieldCheck className="w-4 h-4 text-[#161616]" />
                        ) : (
                          <User className="w-4 h-4 text-[#525252]" />
                        )}
                        <span>
                          {msg.authorName}{" "}
                          {isStaff ? "(Zackisch Support)" : ""}
                        </span>
                      </span>
                      <span className="text-[#525252] font-num">
                        {new Date(msg.createdAt).toLocaleString(
                          isDe ? "de-DE" : "en-US"
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#383838] whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Reply Form */}
            <form
              onSubmit={handleSendReply}
              className="pt-4 border-t border-[#E0E0E0] space-y-3"
            >
              <label className="text-xs font-semibold block text-[#383838]">
                {isDe ? "Antwort hinzufügen" : "Add a reply"}
              </label>
              <textarea
                rows={4}
                required
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder={
                  isDe
                    ? "Schreibe eine Nachricht an das Zackisch Support-Team..."
                    : "Write a reply to the Zackisch support team..."
                }
                className="w-full p-3.5 rounded-xl border border-[#E0E0E0] text-sm text-[#161616] focus:outline-none focus:ring-2 focus:ring-[#161616]"
              />
              <button
                type="submit"
                disabled={isSending}
                className="h-10 px-5 rounded-full bg-[#161616] text-white hover:bg-[#252525] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSending
                    ? isDe
                      ? "Wird gesendet..."
                      : "Sending..."
                    : isDe
                      ? "Antwort absenden"
                      : "Send Reply"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </SupportShell>
  );
}
