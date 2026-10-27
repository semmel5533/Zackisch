"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import {
  Card,
  Badge,
  Button,
  TextField,
  TextareaField,
  SelectField,
} from "@/components/ui/primitives";
import {
  Ticket,
  Plus,
  ArrowRight,
  Clock,
  Buildings,
  Lock,
  Info,
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
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isDe
                ? "Support-Tickets für Gastronomen"
                : "Merchant Support Tickets"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isDe
                ? "Erstelle ein neues Ticket oder verfolge den Status deiner laufenden Anfragen."
                : "Create a new support ticket or track your existing requests."}
            </p>
          </div>
          {businessName && (
            <Badge
              label={businessName}
              variant="neutral"
              icon={<Buildings className="size-3.5" />}
            />
          )}
        </div>

        {!sessionToken ? (
          <Card variant="default" padding={8}>
            <div className="flex flex-col items-center text-center gap-4 max-w-[520px] mx-auto py-4">
              <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-foreground">
                <Lock className="size-6" weight="bold" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold text-foreground">
                  {isDe
                    ? "Anmeldung mit Betriebskonto erforderlich"
                    : "Merchant Account Sign-in Required"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isDe
                    ? "Support-Tickets sind exklusiv für verifizierte Zackisch-Gastronomen verfügbar. Bitte melde dich mit deinem Betriebskonto an, um ein neues Ticket zu erstellen oder deine Anfragen einzusehen."
                    : "Support tickets are exclusively available for verified Zackisch merchants. Please sign in with your business account to open a new ticket or view your existing requests."}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                href={
                  mounted &&
                  typeof window !== "undefined" &&
                  window.location.hostname.includes("localhost")
                    ? "http://localhost:3001/sign-in"
                    : "https://app.zackisch.com/sign-in"
                }
              >
                <span>
                  {isDe
                    ? "Mit Zackisch-Konto anmelden"
                    : "Sign in with Zackisch"}
                </span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
            {/* Left: Create Ticket Form */}
            <Card variant="default" padding={6}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Plus className="size-5 shrink-0 text-foreground" weight="bold" />
                  <h2 className="text-lg font-bold text-foreground">
                    {isDe
                      ? "Neues Support-Ticket eröffnen"
                      : "Open a New Support Ticket"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      label={
                        isDe
                          ? "Deine geschäftliche E-Mail"
                          : "Your Business Email"
                      }
                      type="email"
                      value={customerEmail}
                      readOnly
                    />
                    <TextField
                      label={isDe ? "Name / Betrieb" : "Name / Venue"}
                      value={businessName || customerName}
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label={isDe ? "Themenbereich" : "Category"}
                      options={categoryOptions}
                      value={category}
                      onChange={(val) => setCategory(val)}
                    />
                    <SelectField
                      label={isDe ? "Dringlichkeit" : "Priority"}
                      options={priorityOptions}
                      value={priority}
                      onChange={(val) => setPriority(val)}
                    />
                  </div>

                  <TextField
                    label={isDe ? "Betreff" : "Subject"}
                    value={subject}
                    onChange={(val) => setSubject(val)}
                    placeholder={
                      isDe
                        ? "z. B. Frage zum Tagesabgleich in unserer Kasse"
                        : "e.g. Question about daily POS reconciliation"
                    }
                    required
                  />

                  <TextareaField
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
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    <Ticket className="size-4" />
                    <span>
                      {isSubmitting
                        ? isDe
                          ? "Ticket wird gesendet..."
                          : "Submitting ticket..."
                        : isDe
                          ? "Support-Ticket absenden"
                          : "Submit Support Ticket"}
                    </span>
                  </Button>
                </form>
              </div>
            </Card>

            {/* Right: Existing Tickets List */}
            <Card variant="default" padding={6}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    {isDe
                      ? "Deine bisherigen Tickets"
                      : "Your Existing Tickets"}
                  </h2>
                  <Badge
                    label={String(tickets ? tickets.length : 0)}
                    variant="neutral"
                  />
                </div>

                {!tickets || tickets.length === 0 ? (
                  <div className="flex flex-col items-center text-center gap-2 py-8">
                    <Info className="size-7 text-muted-foreground" />
                    <span className="font-semibold text-sm text-foreground">
                      {isDe
                        ? "Keine Tickets vorhanden"
                        : "No support tickets found"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isDe
                        ? "Für deine E-Mail-Adresse liegen noch keine Support-Tickets vor."
                        : "No support tickets found for your account yet."}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
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
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
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
                          </div>
                          <h3 className="text-sm font-bold text-foreground">
                            {t.subject}
                          </h3>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3.5" />
                              <span>
                                {new Date(t.updatedAt).toLocaleDateString(
                                  isDe ? "de-DE" : "en-US"
                                )}
                              </span>
                            </div>
                            <ArrowRight className="size-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </SupportShell>
  );
}
