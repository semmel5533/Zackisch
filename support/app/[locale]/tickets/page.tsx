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

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [businessId, setBusinessId] = useState<string | undefined>(
    undefined
  );
  const [businessName, setBusinessName] = useState<string | undefined>(
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

  // Restore saved customer session or exchange cross-subdomain handoff token
  useEffect(() => {
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

            toast.success(
              isDe
                ? `Angemeldet als ${res.businessName || res.email}`
                : `Signed in as ${res.businessName || res.email}`
            );
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
        category,
        priority,
        subject,
        body,
      });

      toast.success(
        isDe
          ? `Support-Ticket ${res.ticketNumber} wurde erstellt.`
          : `Support ticket ${res.ticketNumber} created.`
      );
      router.push(`/${locale}/tickets/${res.ticketId}`);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] font-brand">
              {isDe
                ? "Support-Tickets für Gastronomen"
                : "Merchant Support Tickets"}
            </h1>
            <p className="text-sm text-[#525252]">
              {isDe
                ? "Erstelle ein neues Ticket oder verfolge den Status deiner laufenden Anfragen."
                : "Create a new support ticket or track your existing requests."}
            </p>
          </div>
          {businessName && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2F2F2] border border-[#E0E0E0] text-[#161616] text-xs font-semibold">
              <Building2 className="w-4 h-4 text-[#161616]" />
              <span>{businessName}</span>
            </div>
          )}
        </div>

        {!sessionToken ? (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center mx-auto text-[#161616]">
              <Ticket className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] font-brand">
                {isDe ? "Anmeldung mit Betriebskonto erforderlich" : "Merchant Account Sign-in Required"}
              </h2>
              <p className="text-sm text-[#525252] leading-relaxed max-w-lg mx-auto">
                {isDe
                  ? "Support-Tickets sind exklusiv für verifizierte Zackisch-Gastronomen verfügbar. Bitte melde dich mit deinem Betriebskonto an, um ein neues Ticket zu erstellen oder deine Anfragen einzusehen."
                  : "Support tickets are exclusively available for verified Zackisch merchants. Please sign in with your business account to open a new ticket or view your existing requests."}
              </p>
            </div>
            <div className="pt-2">
              <a
                href={
                  typeof window !== "undefined" && window.location.hostname.includes("localhost")
                    ? "http://localhost:3001/sign-in"
                    : "https://app.zackisch.com/sign-in"
                }
                className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full bg-[#161616] text-white hover:bg-[#252525] text-sm font-semibold transition-colors"
              >
                <span>{isDe ? "Mit Zackisch-Konto anmelden" : "Sign in with Zackisch"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Create Ticket Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-[#0A0A0A] font-brand">
                <Plus className="w-5 h-5 text-[#161616]" />
                <h2>
                  {isDe ? "Neues Support-Ticket eröffnen" : "Open a New Support Ticket"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-[#383838]">
                      {isDe ? "Deine geschäftliche E-Mail" : "Your Business Email"}
                    </label>
                    <input
                      type="email"
                      required
                      readOnly
                      value={customerEmail}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E0E0E0] bg-[#F9F9F9] text-sm text-[#161616] cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-[#383838]">
                      {isDe ? "Name / Betrieb" : "Name / Venue"}
                    </label>
                    <input
                      type="text"
                      required
                      readOnly
                      value={businessName || customerName}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E0E0E0] bg-[#F9F9F9] text-sm text-[#161616] cursor-not-allowed"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block text-[#383838]">
                    {isDe ? "Themenbereich" : "Category"}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E0E0E0] bg-white text-sm text-[#161616] focus:outline-none focus:ring-2 focus:ring-[#161616]"
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
                  <label className="text-xs font-semibold block text-[#383838]">
                    {isDe ? "Dringlichkeit" : "Priority"}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E0E0E0] bg-white text-sm text-[#161616] focus:outline-none focus:ring-2 focus:ring-[#161616]"
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
                <label className="text-xs font-semibold block text-[#383838]">
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
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E0E0E0] text-sm text-[#161616] focus:outline-none focus:ring-2 focus:ring-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold block text-[#383838]">
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
                  className="w-full p-3.5 rounded-xl border border-[#E0E0E0] text-sm text-[#161616] focus:outline-none focus:ring-2 focus:ring-[#161616]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-full bg-[#161616] text-white hover:bg-[#252525] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
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
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0A0A0A] font-brand">
                {isDe ? "Deine bisherigen Tickets" : "Your Existing Tickets"}
              </h2>
              <span className="text-xs font-num text-[#525252] px-2 py-0.5 rounded-full bg-[#F2F2F2]">
                {tickets ? tickets.length : 0}
              </span>
            </div>

            {!customerEmail.includes("@") ? (
              <p className="text-xs text-[#525252] leading-relaxed">
                {isDe
                  ? "Gib links deine geschäftliche E-Mail-Adresse ein oder öffne das Support-Center direkt aus deinem Restaurant-Dashboard, um deine bestehenden Tickets einzusehen."
                  : "Enter your business email on the left or open the Support Center directly from your restaurant dashboard to view your existing tickets."}
              </p>
            ) : !tickets || tickets.length === 0 ? (
              <p className="text-xs text-[#525252]">
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
                    className="block p-4 rounded-xl border border-[#E0E0E0] hover:border-[#161616] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold font-num text-[#161616]">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          t.status === "resolved" || t.status === "closed"
                            ? "bg-[#F2F2F2] border-[#E0E0E0] text-[#525252]"
                            : "bg-[#161616] border-[#161616] text-white"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0A] line-clamp-1">
                      {t.subject}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-[#525252]">
                      <span className="inline-flex items-center gap-1 font-num">
                        <Clock className="w-3 h-3" />
                        {new Date(t.updatedAt).toLocaleDateString(
                          isDe ? "de-DE" : "en-US"
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#161616]">
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
        )}
      </div>
    </SupportShell>
  );
}
