"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Mail,
  Send,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  UserX,
  FileText,
  AlertTriangle,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { toast } from "sonner";

interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "button" | "divider" | "hero_image";
  content: string;
  buttonUrl?: string;
}

export default function NewsletterHubPage() {
  const { currentRegion, adminEmail } = useAdmin();
  const [activeTab, setActiveTab] = useState<"subscribers" | "editor" | "campaigns">("editor");

  // Subscribers Query
  const subscribers = useQuery((anyApi as any).newsletter.listSubscribers, {
    regionId: currentRegion,
  });

  // Campaigns Query
  const campaigns = useQuery((anyApi as any).newsletter.listCampaigns, {
    regionId: currentRegion,
  });

  // Editor State
  const [campaignTitle, setCampaignTitle] = useState("Herbst-Aktion 2026: Zackisch QR-Bestellen");
  const [campaignSubject, setCampaignSubject] = useState("Mehr Umsatz, weniger Wartezeit – Neuigkeiten von Zackisch");
  const [campaignLocale, setCampaignLocale] = useState("de");
  const [testEmailRecipient, setTestEmailRecipient] = useState(adminEmail);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingBatch, setSendingBatch] = useState(false);

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: "b1",
      type: "heading",
      content: "Schneller bestellen, direkt genießen.",
    },
    {
      id: "b2",
      type: "paragraph",
      content:
        "Mit Zackisch bestellen Gäste direkt am Tisch per Smartphone – ohne App-Download und ohne Wartezeiten. Entdecke jetzt die neuen Features für dein Restaurant.",
    },
    {
      id: "b3",
      type: "button",
      content: "Jetzt Restaurant entdecken",
      buttonUrl: "https://zackisch.com",
    },
    {
      id: "b4",
      type: "divider",
      content: "",
    },
    {
      id: "b5",
      type: "paragraph",
      content:
        "Ohne Grundgebühr. Keine Einrichtungsgebühr. Du zahlst nur 2% bei erfolgreicher Bestellung.",
    },
  ]);

  // Mutations & Actions
  const createCampaignMutation = useMutation((anyApi as any).newsletter.createCampaign);
  const sendBatchAction = useAction((anyApi as any).emails.sendNewsletterBatch);
  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `b_${Date.now()}`,
      type,
      content:
        type === "heading"
          ? "Neuer Titel"
          : type === "paragraph"
          ? "Schreibe hier deinen Nachrichtentext..."
          : type === "button"
          ? "Mehr erfahren"
          : "",
      buttonUrl: type === "button" ? "https://zackisch.com" : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, content: string, buttonUrl?: string) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content, buttonUrl: buttonUrl ?? b.buttonUrl } : b))
    );
  };

  // Compile visual blocks to master email HTML template
  const generateEmailHtml = () => {
    let bodyHtml = "";
    for (const b of blocks) {
      if (b.type === "heading") {
        bodyHtml += `<h2 style="font-size: 22px; font-weight: 800; color: #000000; margin: 24px 0 12px; letter-spacing: -0.5px;">${b.content}</h2>`;
      } else if (b.type === "paragraph") {
        bodyHtml += `<p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">${b.content}</p>`;
      } else if (b.type === "button") {
        bodyHtml += `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${b.buttonUrl || "https://zackisch.com"}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 9999px;">
              ${b.content}
            </a>
          </div>
        `;
      } else if (b.type === "divider") {
        bodyHtml += `<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />`;
      }
    }

    return `<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="light">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 540px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 40px;">
    <div style="margin-bottom: 32px;">
      <a href="https://zackisch.com" style="display: inline-block; text-decoration: none;">
        <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 38px; width: auto; display: block;" />
      </a>
    </div>
    <div>${bodyHtml}</div>
  </div>
</body>
</html>`;
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      const res = await testSmtpAction({ testRecipient: testEmailRecipient });
      if (res.success) {
        toast.success(`Testnachricht an ${testEmailRecipient} gesendet!`);
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const handlePublishCampaign = async () => {
    const confirmedCount = (subscribers || []).filter((s: any) => s.status === "confirmed").length;
    if (confirmedCount === 0) {
      toast.warning("Keine bestätigten Abonnenten in dieser Region vorhanden.");
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du diese Kampagne wirklich an alle ${confirmedCount} bestätigten Abonnenten in Region ${currentRegion.toUpperCase()} versenden?`
    );
    if (!confirmed) return;

    setSendingBatch(true);
    try {
      const htmlContent = generateEmailHtml();
      const textContent = blocks.map((b) => b.content).filter(Boolean).join("\n\n");

      const campaignId = await createCampaignMutation({
        title: campaignTitle,
        subject: campaignSubject,
        regionId: currentRegion,
        locale: campaignLocale,
        htmlContent,
        textContent,
        blocks: JSON.stringify(blocks),
        createdBy: adminEmail,
      });

      const res = await sendBatchAction({
        campaignId,
        subject: campaignSubject,
        htmlContent,
        textContent,
        regionId: currentRegion,
        actorEmail: adminEmail,
      });

      toast.success(
        `Kampagne versendet! ${res.sentCount} zugestellt${res.failedCount > 0 ? `, ${res.failedCount} fehlgeschlagen` : ""}.`
      );
      setActiveTab("campaigns");
    } catch (err: any) {
      toast.error(`Fehler beim Kampagnenversand: ${err.message}`);
    } finally {
      setSendingBatch(false);
    }
  };

  const confirmedSubscribers = (subscribers || []).filter((s: any) => s.status === "confirmed");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Newsletter Zentrale
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Integrierter No-Code Block-Editor, Double-Opt-in Abonnenten und Kampagnen für Region {currentRegion.toUpperCase()}.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "editor" ? "bg-white text-black shadow-2xs" : "text-zinc-600 hover:text-black"
            }`}
          >
            No-Code Editor
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "subscribers" ? "bg-white text-black shadow-2xs" : "text-zinc-600 hover:text-black"
            }`}
          >
            Abonnenten ({confirmedSubscribers.length})
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "campaigns" ? "bg-white text-black shadow-2xs" : "text-zinc-600 hover:text-black"
            }`}
          >
            Kampagnen-Historie ({campaigns?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: No-Code Visual Editor */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Editor Controls */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-500" />
              Kampagnen-Einstellungen
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Interner Kampagnen-Titel</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">E-Mail-Betreffzeile</label>
                <input
                  type="text"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Sprache</label>
                  <select
                    value={campaignLocale}
                    onChange={(e) => setCampaignLocale(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                  >
                    <option value="de">Deutsch (DE)</option>
                    <option value="en">Englisch (EN)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Empfänger-Segment</label>
                  <div className="text-xs bg-zinc-100 rounded-xl px-3 py-2 font-medium text-zinc-800">
                    {confirmedSubscribers.length} bestätigte Abonnenten
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-zinc-100" />

            {/* Block List Editor */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Inhalts-Blöcke</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addBlock("heading")}
                    className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2 py-1 rounded-lg"
                  >
                    + Überschrift
                  </button>
                  <button
                    onClick={() => addBlock("paragraph")}
                    className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2 py-1 rounded-lg"
                  >
                    + Text
                  </button>
                  <button
                    onClick={() => addBlock("button")}
                    className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2 py-1 rounded-lg"
                  >
                    + Button
                  </button>
                  <button
                    onClick={() => addBlock("divider")}
                    className="text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2 py-1 rounded-lg"
                  >
                    + Trenner
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {blocks.map((b, index) => (
                  <div key={b.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {b.type === "heading" && "Überschrift"}
                        {b.type === "paragraph" && "Absatz / Text"}
                        {b.type === "button" && "Call-To-Action Button"}
                        {b.type === "divider" && "Trennlinie"}
                      </span>
                      <button
                        onClick={() => removeBlock(b.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {b.type === "heading" && (
                      <input
                        type="text"
                        value={b.content}
                        onChange={(e) => updateBlock(b.id, e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                      />
                    )}

                    {b.type === "paragraph" && (
                      <textarea
                        rows={2}
                        value={b.content}
                        onChange={(e) => updateBlock(b.id, e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                    )}

                    {b.type === "button" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Button-Beschriftung"
                          value={b.content}
                          onChange={(e) => updateBlock(b.id, e.target.value, b.buttonUrl)}
                          className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Ziel-URL (z.B. https://zackisch.com)"
                          value={b.buttonUrl || ""}
                          onChange={(e) => updateBlock(b.id, b.content, e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-[11px]"
                        />
                      </div>
                    )}

                    {b.type === "divider" && (
                      <div className="h-0.5 bg-zinc-200 rounded-full my-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-zinc-100" />

            {/* Test Email & Dispatch */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Test an E-Mail senden"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={sendingTest}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  {sendingTest ? "Sendet..." : "Test-Mail"}
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublishCampaign}
                disabled={sendingBatch}
                className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sendingBatch ? "Versand läuft..." : `Kampagne an ${confirmedSubscribers.length} Abonnenten starten`}
              </button>
            </div>
          </div>

          {/* Right: Live Responsive Preview */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live E-Mail-Vorschau (Master Template)
              </span>
              <span className="text-[11px] text-zinc-400">Google Workspace Relay-Format</span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xs border border-zinc-200/80 max-w-md mx-auto space-y-6">
              <img
                src="/combination_mark.svg"
                alt="Zackisch"
                className="h-7 w-auto block mb-6"
              />

              <div className="space-y-4">
                {blocks.map((b) => (
                  <div key={b.id}>
                    {b.type === "heading" && (
                      <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug">
                        {b.content}
                      </h2>
                    )}
                    {b.type === "paragraph" && (
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {b.content}
                      </p>
                    )}
                    {b.type === "button" && (
                      <div className="text-center my-6">
                        <a
                          href={b.buttonUrl || "#"}
                          className="inline-block bg-black text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors"
                        >
                          {b.content}
                        </a>
                      </div>
                    )}
                    {b.type === "divider" && (
                      <hr className="border-t border-zinc-100 my-6" />
                    )}
                  </div>
                ))}
              </div>

              {/* Master Footer */}
              <div className="mt-8 pt-6 border-t border-zinc-100 text-center text-[11px] text-zinc-400 space-y-1">
                <p>Zackisch Gastronomie-Plattform · zackisch.com</p>
                <p>
                  <span className="underline cursor-pointer">Newsletter abmelden (One-Click)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subscribers Table */}
      {activeTab === "subscribers" && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Double-Opt-In Abonnenten</h3>
            <span className="text-xs text-zinc-500">
              {confirmedSubscribers.length} bestätigt / {(subscribers || []).length} gesamt
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-3.5 px-6">E-Mail-Adresse</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sprache</th>
                  <th className="py-3.5 px-4">Quelle</th>
                  <th className="py-3.5 px-6 text-right">Registriert am</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {!subscribers ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">
                      Lade Abonnenten...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">
                      Bisher keine Newsletter-Abonnenten in dieser Region.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s: any) => (
                    <tr key={s._id} className="hover:bg-zinc-50/50">
                      <td className="py-3.5 px-6 font-semibold text-zinc-900">{s.email}</td>
                      <td className="py-3.5 px-4">
                        {s.status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Bestätigt
                          </span>
                        )}
                        {s.status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> Ausstehend
                          </span>
                        )}
                        {s.status === "unsubscribed" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            <UserX className="w-3 h-3" /> Abgemeldet
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-zinc-600">{s.locale}</td>
                      <td className="py-3.5 px-4 text-zinc-500">{s.source || "Website"}</td>
                      <td className="py-3.5 px-6 text-right font-num text-zinc-400 text-[11px]">
                        {new Date(s.createdAt).toLocaleDateString("de-DE")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Campaigns History */}
      {activeTab === "campaigns" && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Versendete Kampagnen</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-3.5 px-6">Titel & Betreff</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Zugestellt</th>
                  <th className="py-3.5 px-4">Erstellt von</th>
                  <th className="py-3.5 px-6 text-right">Versanddatum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {!campaigns || campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">
                      Bisher keine Kampagnen versendet.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c: any) => (
                    <tr key={c._id} className="hover:bg-zinc-50/50">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-900 text-sm">{c.title}</div>
                        <div className="text-[11px] text-zinc-500">{c.subject}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Versendet
                        </span>
                      </td>
                      <td className="py-4 px-4 font-num font-semibold text-zinc-900">
                        {c.deliveredCount ?? "—"} Empfänger
                      </td>
                      <td className="py-4 px-4 text-zinc-500">{c.createdBy}</td>
                      <td className="py-4 px-6 text-right font-num text-zinc-400 text-[11px]">
                        {c.sentAt ? new Date(c.sentAt).toLocaleString("de-DE") : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
