"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SupportShell } from "@/components/SupportShell";
import type { SupportLocale } from "@/lib/knowledge-base";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
} from "lucide-react";

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

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [organizationName, setOrganizationName] = useState<string | undefined>(
    undefined
  );
  const [category, setCategory] = useState<
    | "onboarding"
    | "qr_tables"
    | "orders_tablet"
    | "payments_payouts"
    | "account_legal"
    | "pos_reconciliation"
    | "other"
  >((searchParams.get("category") as any) || "pos_reconciliation");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">(
    "normal"
  );
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore saved customer context or exchange cross-subdomain handoff token
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) setCustomerEmail(parsed.email);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.organizationId) setOrganizationId(parsed.organizationId);
        if (parsed.organizationName)
          setOrganizationName(parsed.organizationName);
      }
    } catch {
      // ignore
    }

    const handoff = searchParams.get("handoff");
    if (handoff) {
      exchangeToken({ token: handoff })
        .then((res) => {
          if (res) {
            setCustomerEmail(res.email);
            setCustomerName(res.name);
            setOrganizationId(res.organizationId as any);
            setOrganizationName(res.organizationName);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
            toast.success(
              isDe
                ? `Angemeldet als ${res.organizationName || res.email}`
                : `Signed in as ${res.organizationName || res.email}`
            );
          }
        })
        .catch(() => {});
    }
  }, [searchParams, exchangeToken, isDe]);

  const tickets = useQuery(
    api.support.getCustomerTickets,
    customerEmail.includes("@")
      ? {
          requesterEmail: customerEmail,
          organizationId: organizationId as any,
        }
      : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createTicket({
        organizationId: organizationId as any,
        requesterEmail: customerEmail.trim(),
        requesterName: customerName.trim() || customerEmail.trim(),
        category,
        priority,
        subject,
        body,
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          email: customerEmail.trim().toLowerCase(),
          name: customerName.trim(),
          organizationId,
          organizationName,
        })
      );

      toast.success(
        isDe
          ? `Support-Ticket ${res.ticketNumber} wurde erstellt.`
          : `Support ticket ${res.ticketNumber} created.`
      );
      router.push(
        `/${locale}/tickets/${res.ticketId}?email=${encodeURIComponent(customerEmail.trim().toLowerCase())}`
      );
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Erstellen des Tickets.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SupportShell locale={locale}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isDe
                ? "Support-Tickets für Gastronomen"
                : "Merchant Support Tickets"}
            </h1>
            <p className="text-sm text-[#495A52]">
              {isDe
                ? "Erstelle ein neues Ticket oder verfolge den Status deiner laufenden Anfragen."
                : "Create a new support ticket or track your existing requests."}
            </p>
          </div>
          {organizationName && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#DCEFE5] text-[#173C2B] text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              <span>{organizationName}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Create Ticket Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold">
              <Plus className="w-5 h-5 text-[#245740]" />
              <h2>
                {isDe ? "Neues Support-Ticket eröffnen" : "Open a New Support Ticket"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block">
                    {isDe ? "Deine geschäftliche E-Mail" : "Your Business Email"}
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="inhaber@mein-restaurant.de"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DDD7CA] text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block">
                    {isDe ? "Name / Betrieb" : "Name / Venue"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isDe ? "Muster Bistro" : "Sample Bistro"}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DDD7CA] text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block">
                    {isDe ? "Themenbereich" : "Category"}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DDD7CA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                  >
                    <option value="pos_reconciliation">
                      {isDe
                        ? "Kassenerfassung (POS) & Kassenabgleich"
                        : "POS Recording & Reconciliation"}
                    </option>
                    <option value="payments_payouts">
                      {isDe
                        ? "Stripe Connect, Zahlungen & 2 % Provision"
                        : "Stripe Connect, Payments & 2% Fee"}
                    </option>
                    <option value="onboarding">
                      {isDe
                        ? "Erste Schritte & Speisekarte (7 % / 19 %)"
                        : "Setup & Menu (7% / 19% VAT)"}
                    </option>
                    <option value="qr_tables">
                      {isDe
                        ? "QR-Codes, Tische & Druckvorlagen"
                        : "QR Codes, Tables & Printing"}
                    </option>
                    <option value="orders_tablet">
                      {isDe
                        ? "Personal-Tablet & Live-Bestellungen"
                        : "Staff Tablet & Live Orders"}
                    </option>
                    <option value="account_legal">
                      {isDe
                        ? "Konto, Rechtliches & Datenschutz"
                        : "Account, Legal & Privacy"}
                    </option>
                    <option value="other">
                      {isDe ? "Sonstiges Anliegen" : "Other Inquiry"}
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block">
                    {isDe ? "Dringlichkeit" : "Priority"}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DDD7CA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                  >
                    <option value="low">{isDe ? "Niedrig" : "Low"}</option>
                    <option value="normal">{isDe ? "Normal" : "Normal"}</option>
                    <option value="high">{isDe ? "Hoch" : "High"}</option>
                    <option value="urgent">
                      {isDe ? "Dringend (Schichtbetrieb betroffen)" : "Urgent (Live service affected)"}
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold block">
                  {isDe ? "Betreff" : "Subject"}
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    isDe
                      ? "z. B. Frage zum Tagesabgleich in unserer Kasse"
                      : "e.g. Question about daily POS reconciliation"
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-[#DDD7CA] text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold block">
                  {isDe ? "Beschreibung deines Anliegens" : "Description"}
                </label>
                <textarea
                  required
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    isDe
                      ? "Beschreibe kurz dein Anliegen (gerne mit Bestellnummer oder Tischnummer)..."
                      : "Describe your question (include order or table number if applicable)..."
                  }
                  className="w-full p-3.5 rounded-xl border border-[#DDD7CA] text-sm focus:outline-none focus:ring-2 focus:ring-[#173C2B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-full bg-[#173C2B] text-white hover:bg-[#245740] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Ticket className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isDe
                      ? "Ticket wird gesendet..."
                      : "Submitting ticket..."
                    : isDe
                      ? "Support-Ticket absenden"
                      : "Submit Support Ticket"}
                </span>
              </button>
            </form>
          </div>

          {/* Right: Existing Tickets List */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">
                {isDe ? "Deine bisherigen Tickets" : "Your Existing Tickets"}
              </h2>
              <span className="text-xs font-num text-[#495A52]">
                {tickets ? tickets.length : 0}
              </span>
            </div>

            {!customerEmail.includes("@") ? (
              <p className="text-xs text-[#495A52] leading-relaxed">
                {isDe
                  ? "Gib links deine geschäftliche E-Mail-Adresse ein oder öffne das Support-Center direkt aus deinem Restaurant-Dashboard, um deine bestehenden Tickets einzusehen."
                  : "Enter your business email on the left or open the Support Center directly from your restaurant dashboard to view your existing tickets."}
              </p>
            ) : !tickets || tickets.length === 0 ? (
              <p className="text-xs text-[#495A52]">
                {isDe
                  ? "Für diese E-Mail-Adresse liegen noch keine Support-Tickets vor."
                  : "No support tickets found for this email address yet."}
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <Link
                    key={t._id}
                    href={`/${locale}/tickets/${t._id}?email=${encodeURIComponent(customerEmail.trim().toLowerCase())}`}
                    className="block p-4 rounded-2xl border border-[#DDD7CA] hover:border-[#245740] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold font-num text-[#173C2B]">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          t.status === "resolved" || t.status === "closed"
                            ? "bg-[#DCEFE5] text-[#173C2B]"
                            : "bg-[#ECE7DC] text-[#14231D]"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#14231D] line-clamp-1">
                      {t.subject}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-[#6C7B73]">
                      <span className="inline-flex items-center gap-1 font-num">
                        <Clock className="w-3 h-3" />
                        {new Date(t.updatedAt).toLocaleDateString(
                          isDe ? "de-DE" : "en-US"
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#173C2B]">
                        {isDe ? "Verlauf öffnen" : "Open thread"}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SupportShell>
  );
}
