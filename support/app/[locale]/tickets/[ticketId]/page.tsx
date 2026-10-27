"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import {
  Card,
  Badge,
  Button,
  TextareaField,
  Divider,
} from "@/components/ui/primitives";
import {
  ArrowLeft,
  PaperPlaneRight,
  ShieldCheck,
  User,
} from "@phosphor-icons/react";

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
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SupportShell locale={locale}>
      <div className="flex flex-col gap-6 w-full max-w-[840px] mx-auto">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            href={`/${locale}/tickets`}
          >
            <ArrowLeft className="size-4" />
            <span>{isDe ? "Zurück zu allen Tickets" : "Back to all tickets"}</span>
          </Button>
        </div>

        {!sessionToken ? (
          <Card variant="default" padding={6}>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground">
                {isDe ? "Anmeldung erforderlich" : "Authentication Required"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isDe
                  ? "Um auf dieses Ticket zuzugreifen, musst du mit deinem Betriebskonto angemeldet sein."
                  : "To access this ticket, please sign in with your verified merchant account."}
              </p>
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  href={`/${locale}/tickets`}
                >
                  {isDe ? "Zu meinen Tickets" : "Go to my tickets"}
                </Button>
              </div>
            </div>
          </Card>
        ) : !thread ? (
          <Card variant="default" padding={6}>
            <h2 className="text-lg font-bold text-foreground">
              {isDe ? "Ticket wird geladen..." : "Loading ticket..."}
            </h2>
          </Card>
        ) : (
          <Card variant="default" padding={6}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      label={thread.ticket.ticketNumber}
                      variant="neutral"
                    />
                    <Badge
                      label={thread.ticket.status}
                      variant="info"
                    />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    {thread.ticket.subject}
                  </h1>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(thread.ticket.createdAt).toLocaleString(
                    isDe ? "de-DE" : "en-US"
                  )}
                </span>
              </div>

              <Divider />

              {/* Message Thread */}
              <div className="flex flex-col gap-3">
                {thread.messages.map((msg) => {
                  const isStaff = msg.authorType === "staff";
                  return (
                    <Card
                      key={msg._id}
                      variant={isStaff ? "muted" : "default"}
                      padding={4}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                            {isStaff ? (
                              <ShieldCheck className="size-4 shrink-0" />
                            ) : (
                              <User className="size-4 shrink-0" />
                            )}
                            <span>
                              {msg.authorName}{" "}
                              {isStaff ? "(Zackisch Support)" : ""}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleString(
                              isDe ? "de-DE" : "en-US"
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {msg.body}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Divider />

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex flex-col gap-3">
                <TextareaField
                  label={isDe ? "Antwort hinzufügen" : "Add a reply"}
                  value={replyBody}
                  onChange={(val) => setReplyBody(val)}
                  placeholder={
                    isDe
                      ? "Schreibe eine Nachricht an das Zackisch Support-Team..."
                      : "Write a reply to the Zackisch support team..."
                  }
                  rows={4}
                  required
                />
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSending}
                    disabled={isSending}
                  >
                    <PaperPlaneRight className="size-4" />
                    <span>
                      {isSending
                        ? isDe
                          ? "Wird gesendet..."
                          : "Sending..."
                        : isDe
                          ? "Antwort absenden"
                          : "Send Reply"}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
      </div>
    </SupportShell>
  );
}
