"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Selector } from "@astryxdesign/core/Selector";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import {
  Ticket,
  Plus,
  ArrowRight,
  Clock,
  Buildings,
  Lock,
} from "@phosphor-icons/react";

const STORAGE_KEY = "zackisch_support_customer_ctx";

export default function SupportTicketsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale: SupportLocale =
    params?.locale === "de-en" ? "de-en" : "de-de";
  const isDe = locale === "de-de";

  const exchangeToken = useMutation(api.support.exchangeCrossAppToken);
  const createTicket = useMutation(api.support.createTicket);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [businessId, setBusinessId] = useState<string | undefined>(
    undefined
  );
  const [businessName, setBusinessName] = useState<string | undefined>(
    undefined
  );
  const [category, setCategory] = useState<string>(
    (searchParams.get("category") as any) || "pos_reconciliation"
  );
  const [priority, setPriority] = useState<string>("normal");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore saved customer session or exchange cross-subdomain handoff token
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionToken) setSessionToken(parsed.sessionToken);
        if (parsed.email) setCustomerEmail(parsed.email);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.businessId) setBusinessId(parsed.businessId);
        if (parsed.businessName) setBusinessName(parsed.businessName);
      }
    } catch {
      // ignore
    }

    const handoff = searchParams.get("handoff");
    if (handoff) {
      exchangeToken({ token: handoff })
        .then((res) => {
          if (res) {
            setSessionToken(res.sessionToken);
            setCustomerEmail(res.email);
            setCustomerName(res.name);
            setBusinessId(res.businessId as any);
            setBusinessName(res.businessName);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res));

            // Remove handoff token from history immediately (P0-05)
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("handoff");
              window.history.replaceState({}, "", url.toString());
            }
          }
        })
        .catch(() => {});
    }
  }, [searchParams, exchangeToken, isDe]);

  // Verify support session server-side
  const verifiedSession = useQuery(
    api.support.verifySupportSession,
    sessionToken ? { sessionToken } : "skip"
  );

  useEffect(() => {
    if (verifiedSession) {
      setCustomerEmail(verifiedSession.email);
      setCustomerName(verifiedSession.name);
      setBusinessId(verifiedSession.businessId as any);
      setBusinessName(verifiedSession.businessName);
    } else if (verifiedSession === null && sessionToken) {
      // Session expired
      setSessionToken(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [verifiedSession, sessionToken]);

  const tickets = useQuery(
    api.support.getCustomerTickets,
    sessionToken
      ? {
          sessionToken,
        }
      : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createTicket({
        sessionToken: sessionToken || undefined,
        businessId: businessId as any,
        requesterEmail: customerEmail.trim(),
        requesterName: customerName.trim() || customerEmail.trim(),
        category: category as any,
        priority: priority as any,
        subject,
        body,
      });

      router.push(`/${locale}/tickets/${res.ticketId}`);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    {
      value: "pos_reconciliation",
      label: isDe
        ? "Kassenerfassung (POS) & Kassenabgleich"
        : "POS Recording & Reconciliation",
    },
    {
      value: "payments_payouts",
      label: isDe
        ? "Stripe Connect, Zahlungen & 2 % Provision"
        : "Stripe Connect, Payments & 2% Fee",
    },
    {
      value: "onboarding",
      label: isDe
        ? "Erste Schritte & Speisekarte (7 % / 19 %)"
        : "Setup & Menu (7% / 19% VAT)",
    },
    {
      value: "qr_tables",
      label: isDe
        ? "QR-Codes, Tische & Druckvorlagen"
        : "QR Codes, Tables & Printing",
    },
    {
      value: "orders_tablet",
      label: isDe
        ? "Personal-Tablet & Live-Bestellungen"
        : "Staff Tablet & Live Orders",
    },
    {
      value: "account_legal",
      label: isDe
        ? "Konto, Rechtliches & Datenschutz"
        : "Account, Legal & Privacy",
    },
    {
      value: "other",
      label: isDe ? "Sonstiges Anliegen" : "Other Inquiry",
    },
  ];

  const priorityOptions = [
    { value: "low", label: isDe ? "Niedrig" : "Low" },
    { value: "normal", label: isDe ? "Normal" : "Normal" },
    { value: "high", label: isDe ? "Hoch" : "High" },
    {
      value: "urgent",
      label: isDe
        ? "Dringend (Schichtbetrieb betroffen)"
        : "Urgent (Live service affected)",
    },
  ];

  return (
    <SupportShell locale={locale}>
      <VStack gap={8} width="100%">
        <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
          <VStack gap={1}>
            <Heading level={1}>
              {isDe
                ? "Support-Tickets für Gastronomen"
                : "Merchant Support Tickets"}
            </Heading>
            <Text color="secondary">
              {isDe
                ? "Erstelle ein neues Ticket oder verfolge den Status deiner laufenden Anfragen."
                : "Create a new support ticket or track your existing requests."}
            </Text>
          </VStack>
          {businessName && (
            <Badge
              label={businessName}
              variant="neutral"
              icon={<Icon icon={Buildings} size="sm" />}
            />
          )}
        </HStack>

        {!sessionToken ? (
          <Card variant="default" padding={8}>
            <VStack
              gap={4}
              align="center"
              style={{ maxWidth: 520, margin: "0 auto" }}
            >
              <EmptyState
                title={
                  isDe
                    ? "Anmeldung mit Betriebskonto erforderlich"
                    : "Merchant Account Sign-in Required"
                }
                description={
                  isDe
                    ? "Support-Tickets sind exklusiv für verifizierte Zackisch-Gastronomen verfügbar. Bitte melde dich mit deinem Betriebskonto an, um ein neues Ticket zu erstellen oder deine Anfragen einzusehen."
                    : "Support tickets are exclusively available for verified Zackisch merchants. Please sign in with your business account to open a new ticket or view your existing requests."
                }
                icon={<Icon icon={Lock} size="lg" />}
                actions={
                  <Button
                    label={
                      isDe
                        ? "Mit Zackisch-Konto anmelden"
                        : "Sign in with Zackisch"
                    }
                    variant="primary"
                    size="md"
                    href={
                      mounted &&
                      typeof window !== "undefined" &&
                      window.location.hostname.includes("localhost")
                        ? "http://localhost:3001/sign-in"
                        : "https://app.zackisch.com/sign-in"
                    }
                    endContent={<Icon icon={ArrowRight} size="sm" />}
                  />
                }
              />
            </VStack>
          </Card>
        ) : (
          <Grid columns={{ minWidth: 320, max: 2 }} gap={6} width="100%">
            {/* Left: Create Ticket Form */}
            <Card variant="default" padding={6}>
              <VStack gap={4}>
                <HStack gap={2} vAlign="center">
                  <Icon icon={Plus} size="sm" />
                  <Heading level={2}>
                    {isDe
                      ? "Neues Support-Ticket eröffnen"
                      : "Open a New Support Ticket"}
                  </Heading>
                </HStack>

                <form onSubmit={handleSubmit}>
                  <VStack gap={4}>
                    <Grid columns={2} gap={4}>
                      <TextInput
                        label={
                          isDe
                            ? "Deine geschäftliche E-Mail"
                            : "Your Business Email"
                        }
                        type="email"
                        value={customerEmail}
                        isReadOnly
                      />
                      <TextInput
                        label={isDe ? "Name / Betrieb" : "Name / Venue"}
                        value={businessName || customerName}
                        isReadOnly
                      />
                    </Grid>

                    <Grid columns={2} gap={4}>
                      <Selector
                        label={isDe ? "Themenbereich" : "Category"}
                        options={categoryOptions}
                        value={category}
                        onChange={(val) => setCategory(val)}
                      />
                      <Selector
                        label={isDe ? "Dringlichkeit" : "Priority"}
                        options={priorityOptions}
                        value={priority}
                        onChange={(val) => setPriority(val)}
                      />
                    </Grid>

                    <TextInput
                      label={isDe ? "Betreff" : "Subject"}
                      value={subject}
                      onChange={(val) => setSubject(val)}
                      placeholder={
                        isDe
                          ? "z. B. Frage zum Tagesabgleich in unserer Kasse"
                          : "e.g. Question about daily POS reconciliation"
                      }
                      isRequired
                    />

                    <TextArea
                      label={
                        isDe
                          ? "Beschreibung deines Anliegens"
                          : "Description"
                      }
                      value={body}
                      onChange={(val) => setBody(val)}
                      placeholder={
                        isDe
                          ? "Beschreibe kurz dein Anliegen (gerne mit Bestellnummer oder Tischnummer)..."
                          : "Describe your question (include order or table number if applicable)..."
                      }
                      rows={5}
                      isRequired
                    />

                    <Button
                      label={
                        isSubmitting
                          ? isDe
                            ? "Ticket wird gesendet..."
                            : "Submitting ticket..."
                          : isDe
                            ? "Support-Ticket absenden"
                            : "Submit Support Ticket"
                      }
                      variant="primary"
                      size="md"
                      isLoading={isSubmitting}
                      icon={<Icon icon={Ticket} size="sm" />}
                      onClick={(e: any) => handleSubmit(e)}
                    />
                  </VStack>
                </form>
              </VStack>
            </Card>

            {/* Right: Existing Tickets List */}
            <Card variant="default" padding={6}>
              <VStack gap={4}>
                <HStack justify="between" vAlign="center">
                  <Heading level={2}>
                    {isDe
                      ? "Deine bisherigen Tickets"
                      : "Your Existing Tickets"}
                  </Heading>
                  <Badge
                    label={String(tickets ? tickets.length : 0)}
                    variant="neutral"
                  />
                </HStack>

                {!tickets || tickets.length === 0 ? (
                  <EmptyState
                    title={
                      isDe
                        ? "Keine Tickets vorhanden"
                        : "No support tickets found"
                    }
                    description={
                      isDe
                        ? "Für deine E-Mail-Adresse liegen noch keine Support-Tickets vor."
                        : "No support tickets found for your account yet."
                    }
                    icon={<Icon icon="info" size="lg" />}
                  />
                ) : (
                  <VStack gap={2}>
                    {tickets.map((t) => (
                      <Card
                        key={t._id}
                        variant="muted"
                        padding={4}
                        onClick={() =>
                          router.push(
                            `/${locale}/tickets/${t._id}?email=${encodeURIComponent(customerEmail.trim().toLowerCase())}`
                          )
                        }
                      >
                        <VStack gap={2}>
                          <HStack justify="between" vAlign="center">
                            <Badge
                              label={t.ticketNumber}
                              variant="neutral"
                            />
                            <Badge
                              label={t.status}
                              variant={
                                t.status === "resolved" ||
                                t.status === "closed"
                                  ? "neutral"
                                  : "info"
                              }
                            />
                          </HStack>
                          <Heading level={3}>
                            {t.subject}
                          </Heading>
                          <HStack justify="between" vAlign="center">
                            <HStack gap={1} vAlign="center">
                              <Icon
                                icon={Clock}
                                size="sm"
                              />
                              <Text color="secondary">
                                {new Date(t.updatedAt).toLocaleDateString(
                                  isDe ? "de-DE" : "en-US"
                                )}
                              </Text>
                            </HStack>
                            <Icon
                              icon={ArrowRight}
                              size="sm"
                            />
                          </HStack>
                        </VStack>
                      </Card>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Card>
          </Grid>
        )}
      </VStack>
    </SupportShell>
  );
}
