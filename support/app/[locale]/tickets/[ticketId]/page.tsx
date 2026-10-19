"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Divider } from "@astryxdesign/core/Divider";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
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
      <VStack gap={6} width="100%" style={{ maxWidth: 840, margin: "0 auto" }}>
        <HStack>
          <Button
            label={isDe ? "Zurück zu allen Tickets" : "Back to all tickets"}
            variant="ghost"
            size="sm"
            href={`/${locale}/tickets`}
            icon={<Icon icon={ArrowLeft} size="sm" />}
          />
        </HStack>

        {!sessionToken ? (
          <Card variant="default" padding={6}>
            <VStack gap={4}>
              <Heading level={2}>
                {isDe ? "Anmeldung erforderlich" : "Authentication Required"}
              </Heading>
              <Text color="secondary">
                {isDe
                  ? "Um auf dieses Ticket zuzugreifen, musst du mit deinem Betriebskonto angemeldet sein."
                  : "To access this ticket, please sign in with your verified merchant account."}
              </Text>
              <HStack>
                <Button
                  label={isDe ? "Zu meinen Tickets" : "Go to my tickets"}
                  variant="primary"
                  size="sm"
                  href={`/${locale}/tickets`}
                />
              </HStack>
            </VStack>
          </Card>
        ) : !thread ? (
          <Card variant="default" padding={6}>
            <Heading level={2}>
              {isDe ? "Ticket wird geladen..." : "Loading ticket..."}
            </Heading>
          </Card>
        ) : (
          <Card variant="default" padding={6}>
            <VStack gap={6}>
              <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
                <VStack gap={1}>
                  <HStack gap={2} vAlign="center">
                    <Badge
                      label={thread.ticket.ticketNumber}
                      variant="neutral"
                    />
                    <Badge
                      label={thread.ticket.status}
                      variant="info"
                    />
                  </HStack>
                  <Heading level={1}>
                    {thread.ticket.subject}
                  </Heading>
                </VStack>
                <Text color="secondary">
                  {new Date(thread.ticket.createdAt).toLocaleString(
                    isDe ? "de-DE" : "en-US"
                  )}
                </Text>
              </HStack>

              <Divider />

              {/* Message Thread */}
              <VStack gap={3}>
                {thread.messages.map((msg) => {
                  const isStaff = msg.authorType === "staff";
                  return (
                    <Card
                      key={msg._id}
                      variant={isStaff ? "muted" : "default"}
                      padding={4}
                    >
                      <VStack gap={2}>
                        <HStack justify="between" vAlign="center">
                          <HStack gap={1} vAlign="center">
                            <Icon
                              icon={isStaff ? ShieldCheck : User}
                              size="sm"
                            />
                            <Text weight="bold">
                              {msg.authorName}{" "}
                              {isStaff ? "(Zackisch Support)" : ""}
                            </Text>
                          </HStack>
                          <Text color="secondary">
                            {new Date(msg.createdAt).toLocaleString(
                              isDe ? "de-DE" : "en-US"
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

              {/* Reply Form */}
              <form onSubmit={handleSendReply}>
                <VStack gap={3}>
                  <TextArea
                    label={isDe ? "Antwort hinzufügen" : "Add a reply"}
                    value={replyBody}
                    onChange={(val) => setReplyBody(val)}
                    placeholder={
                      isDe
                        ? "Schreibe eine Nachricht an das Zackisch Support-Team..."
                        : "Write a reply to the Zackisch support team..."
                    }
                    rows={4}
                    isRequired
                  />
                  <HStack>
                    <Button
                      label={
                        isSending
                          ? isDe
                            ? "Wird gesendet..."
                            : "Sending..."
                          : isDe
                            ? "Antwort absenden"
                            : "Send Reply"
                      }
                      variant="primary"
                      size="md"
                      isLoading={isSending}
                      icon={<Icon icon={PaperPlaneRight} size="sm" />}
                      onClick={(e: any) => handleSendReply(e)}
                    />
                  </HStack>
                </VStack>
              </form>
            </VStack>
          </Card>
        )}
      </VStack>
    </SupportShell>
  );
}
