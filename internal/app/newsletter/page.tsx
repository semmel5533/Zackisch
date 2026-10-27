"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { anyApi } from "convex/server";
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  Plus,
  Trash,
  Eye,
} from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";
import {
  Card,
  Button,
  Badge,
  StatusDot,
  TextField,
  TextareaField,
  SelectField,
  SegmentedControl,
  Divider,
  Spinner,
} from "@/components/ui/primitives";

type BlockType = "heading" | "paragraph" | "button" | "divider";

interface EmailBlock {
  id: string;
  type: BlockType;
  content: string;
  buttonUrl?: string;
}

export default function NewsletterStudioPage() {
  const { currentRegion, currentLocale, sessionToken } = useAdmin();
  const [activeTab, setActiveTab] = useState<
    "composer" | "subscribers" | "campaigns"
  >("composer");

  const [campaignTitle, setCampaignTitle] = useState(
    "Zackisch Produkt-Update · Oktober 2026"
  );
  const [subject, setSubject] = useState(
    "Neu bei Zackisch: Schnelleres QR-Bestellen & direktes POS-Tracking"
  );
  const [previewText, setPreviewText] = useState(
    "Entdecke die neuen Verbesserungen für deinen Gastronomiebetrieb."
  );
  const [targetLocale, setTargetLocale] = useState<string>(currentLocale);
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingBatch, setSendingBatch] = useState(false);

  const [blocks, setBlocks] = useState<EmailBlock[]>([
    {
      id: "b1",
      type: "heading",
      content: "Weniger Stress im Service, mehr zufriedene Gäste",
    },
    {
      id: "b2",
      type: "paragraph",
      content:
        "Hallo liebes Gastronomie-Team! Diesen Monat haben wir die Bestellübersicht und die Tisch-QR-Karten weiter optimiert, damit euer Team zu Stoßzeiten noch schneller arbeiten kann.",
    },
    {
      id: "b3",
      type: "button",
      content: "Zum Betreiber-Dashboard",
      buttonUrl: "https://app.zackisch.com/dashboard",
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
        "Wie immer gilt bei Zackisch: 0 € Grundgebühr, 0 € Einrichtungsgebühr und faire 2% nur bei echten Bestellungen.",
    },
  ]);

  const subscribers = useQuery(
    (anyApi as any).newsletter.listSubscribers,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const campaigns = useQuery(
    (anyApi as any).newsletter.listCampaigns,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const createCampaignMutation = useMutation(
    (anyApi as any).newsletter.createCampaign
  );
  const sendCampaignBatchAction = useAction(
    (anyApi as any).newsletter.sendCampaignBatch
  );
  const sendTestNewsletterAction = useAction(
    (anyApi as any).emails.sendNewsletterCampaignEmail
  );

  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = {
      id: `b_${Date.now()}`,
      type,
      content:
        type === "heading"
          ? "Neue Zwischenüberschrift"
          : type === "paragraph"
            ? "Neuer Textabschnitt für deine Abonnenten..."
            : type === "button"
              ? "Jetzt ansehen"
              : "",
      buttonUrl: type === "button" ? "https://zackisch.com" : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string, buttonUrl?: string) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content, buttonUrl } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const generateEmailHtml = () => {
    const bodyHtml = blocks
      .map((b) => {
        if (b.type === "heading") {
          return `<h2 style="margin:24px 0 12px;font-size:20px;font-weight:700;color:#000000;letter-spacing:-0.01em;">${b.content}</h2>`;
        }
        if (b.type === "paragraph") {
          return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#27272A;">${b.content}</p>`;
        }
        if (b.type === "button") {
          return `<div style="margin:24px 0;text-align:center;"><a href="${b.buttonUrl || "https://zackisch.com"}" style="display:inline-block;background-color:#000000;color:#FFFFFF;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">${b.content}</a></div>`;
        }
        if (b.type === "divider") {
          return `<hr style="border:none;border-top:1px solid #E4E4E0;margin:24px 0;" />`;
        }
        return "";
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="${targetLocale}">
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #FAFAF9; margin: 0; padding: 0; color: #000000; }
  </style>
</head>
<body style="background-color:#FAFAF9;padding:32px 16px;">
  <div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E4E0;border-radius:16px;padding:36px;">
    <div style="margin-bottom:24px;">
      <span style="font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#000000;">Zackisch</span>
    </div>
    ${bodyHtml}
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #E4E4E0;text-align:center;font-size:12px;color:#52525B;">
      <p style="margin:0 0 8px;">Zackisch Gastronomie-Plattform · zackisch.com</p>
      <p style="margin:0;"><a href="{{UNSUBSCRIBE_URL}}" style="color:#52525B;text-decoration:underline;">Newsletter abmelden (One-Click)</a></p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleSendTest = async () => {
    if (!testEmailRecipient) {
      toast.error("Bitte Test-Empfänger-Adresse eingeben.");
      return;
    }
    setSendingTest(true);
    try {
      await sendTestNewsletterAction({
        email: testEmailRecipient,
        subject: `[TEST] ${subject}`,
        htmlContent: generateEmailHtml(),
        unsubscribeToken: "test-token",
        sessionToken: sessionToken || "",
      });
      toast.success(
        `Test-E-Mail erfolgreich an ${testEmailRecipient} gesendet!`
      );
    } catch (err: any) {
      toast.error(`Fehler beim Testversand: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const handlePublishCampaign = async () => {
    setSendingBatch(true);
    try {
      const htmlContent = generateEmailHtml();
      const campaignId = await createCampaignMutation({
        title: campaignTitle,
        subject,
        previewText,
        blocksJson: JSON.stringify(blocks),
        htmlContent,
        regionId: currentRegion,
        locale: targetLocale,
        sessionToken: sessionToken || "",
      });

      const res = await sendCampaignBatchAction({
        campaignId,
        sessionToken: sessionToken || "",
      });

      toast.success(
        `Kampagne versendet! ${res.deliveredCount} von ${res.totalSubscribers} Abonnenten erreicht.`
      );
      setActiveTab("campaigns");
    } catch (err: any) {
      toast.error(`Fehler beim Kampagnenversand: ${err.message}`);
    } finally {
      setSendingBatch(false);
    }
  };

  const confirmedSubscribers = (subscribers || []).filter(
    (s: any) => s.status === "confirmed"
  );

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Newsletter Studio
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Erstelle, teste und versende markenkonsistente Newsletter über das Google Workspace SMTP-Relay.
          </p>
        </div>

        <SegmentedControl
          label="Newsletter Bereich"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "composer", label: "Visueller Editor" },
            {
              value: "subscribers",
              label: `Abonnenten (${confirmedSubscribers.length})`,
            },
            {
              value: "campaigns",
              label: `Historie (${(campaigns || []).length})`,
            },
          ]}
        />
      </div>

      {activeTab === "composer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-[var(--zk-text)]">
                Kampagnen-Einstellungen & Blöcke
              </h2>

              <TextField
                label="Interner Kampagnentitel"
                value={campaignTitle}
                onChange={setCampaignTitle}
              />

              <TextField
                label="E-Mail-Betreffzeile"
                value={subject}
                onChange={setSubject}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <TextField
                    label="Vorschautext (Preheader)"
                    value={previewText}
                    onChange={setPreviewText}
                  />
                </div>
                <SelectField
                  label="Zielsprache"
                  value={targetLocale}
                  onChange={setTargetLocale}
                  options={[
                    { value: "de", label: "Deutsch (DE)" },
                    { value: "en", label: "English (EN)" },
                    { value: "fr", label: "Français (FR)" },
                    { value: "it", label: "Italiano (IT)" },
                    { value: "es", label: "Español (ES)" },
                  ]}
                />
              </div>

              <Divider />

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="zk-label">Inhaltsblöcke</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => addBlock("heading")}
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span>Überschrift</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => addBlock("paragraph")}
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => addBlock("button")}
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span>Button</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => addBlock("divider")}
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span>Trennlinie</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {blocks.map((b, idx) => (
                    <Card key={b.id} padding="sm" variant="muted">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="neutral">
                            #{idx + 1} · {b.type.toUpperCase()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly
                            type="button"
                            aria-label="Block entfernen"
                            onClick={() => removeBlock(b.id)}
                          >
                            <Trash className="size-4 text-[var(--zk-error-text)]" aria-hidden="true" />
                          </Button>
                        </div>

                        {b.type === "heading" && (
                          <TextField
                            label="Überschrift"
                            hideLabel
                            value={b.content}
                            onChange={(val) => updateBlock(b.id, val)}
                          />
                        )}

                        {b.type === "paragraph" && (
                          <TextareaField
                            label="Textabschnitt"
                            hideLabel
                            rows={3}
                            value={b.content}
                            onChange={(val) => updateBlock(b.id, val)}
                          />
                        )}

                        {b.type === "button" && (
                          <div className="flex flex-col gap-2">
                            <TextField
                              label="Button-Beschriftung"
                              hideLabel
                              placeholder="Button-Beschriftung"
                              value={b.content}
                              onChange={(val) =>
                                updateBlock(b.id, val, b.buttonUrl)
                              }
                            />
                            <TextField
                              label="Ziel-URL"
                              hideLabel
                              placeholder="https://zackisch.com"
                              value={b.buttonUrl || ""}
                              onChange={(val) =>
                                updateBlock(b.id, b.content, val)
                              }
                            />
                          </div>
                        )}

                        {b.type === "divider" && <Divider />}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Divider />

              <div className="flex flex-col gap-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextField
                      type="email"
                      label="Test an E-Mail senden"
                      hideLabel
                      placeholder="Test an E-Mail senden"
                      value={testEmailRecipient}
                      onChange={setTestEmailRecipient}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    type="button"
                    loading={sendingTest}
                    onClick={handleSendTest}
                  >
                    Test-Mail
                  </Button>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  type="button"
                  loading={sendingBatch}
                  onClick={handlePublishCampaign}
                >
                  <PaperPlaneTilt className="size-4" aria-hidden="true" />
                  <span>
                    Kampagne an {confirmedSubscribers.length} Abonnenten starten
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="lg" variant="muted">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--zk-text)]">
                  <Eye className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
                  <span>Live E-Mail-Vorschau (Master Template)</span>
                </div>
                <span className="text-xs text-[var(--zk-text-secondary)]">
                  Google Workspace Relay
                </span>
              </div>

              <Card padding="lg">
                <div className="flex flex-col gap-4">
                  <img
                    src="/zackisch/combination-mark.svg"
                    alt="Zackisch"
                    className="h-7 w-auto block self-start"
                  />

                  <div className="flex flex-col gap-3">
                    {blocks.map((b) => (
                      <div key={b.id}>
                        {b.type === "heading" && (
                          <h2 className="text-xl font-bold text-[var(--zk-text)]">
                            {b.content}
                          </h2>
                        )}
                        {b.type === "paragraph" && (
                          <p className="text-sm leading-relaxed text-[var(--zk-text-body)]">
                            {b.content}
                          </p>
                        )}
                        {b.type === "button" && (
                          <div className="py-2 flex justify-center">
                            <Button
                              variant="primary"
                              href={b.buttonUrl || "#"}
                            >
                              {b.content}
                            </Button>
                          </div>
                        )}
                        {b.type === "divider" && <Divider />}
                      </div>
                    ))}
                  </div>

                  <Divider />

                  <div className="flex flex-col items-center gap-1 text-xs text-[var(--zk-text-secondary)]">
                    <span>Zackisch Gastronomie-Plattform · zackisch.com</span>
                    <span className="underline">Newsletter abmelden (One-Click)</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "subscribers" && (
        <Card padding="lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--zk-text)]">
                Double-Opt-In Abonnenten
              </h2>
              <Badge variant="neutral">
                {confirmedSubscribers.length} bestätigt / {(subscribers || []).length} gesamt
              </Badge>
            </div>

            {!subscribers ? (
              <div className="py-16 flex justify-center">
                <Spinner label="Lade Abonnenten..." />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <EnvelopeSimple className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
                <div className="text-base font-bold text-[var(--zk-text)]">
                  Keine Abonnenten
                </div>
                <p className="text-sm text-[var(--zk-text-secondary)]">
                  Bisher keine Newsletter-Abonnenten in dieser Region.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--zk-border)] text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                      <th className="py-3 pr-4">E-Mail-Adresse</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sprache</th>
                      <th className="py-3 px-4">Quelle</th>
                      <th className="py-3 pl-4 text-right">Registriert am</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--zk-border)]">
                    {subscribers.map((s: any) => (
                      <tr key={s._id} className="hover:bg-[var(--zk-surface-muted)]">
                        <td className="py-3 pr-4 font-semibold text-[var(--zk-text)]">
                          {s.email}
                        </td>
                        <td className="py-3 px-4">
                          {s.status === "confirmed" ? (
                            <div className="inline-flex items-center gap-1.5">
                              <StatusDot variant="success" label="Bestätigt" />
                              <span>Bestätigt</span>
                            </div>
                          ) : s.status === "pending" ? (
                            <Badge variant="warning">Ausstehend</Badge>
                          ) : (
                            <Badge variant="neutral">Abgemeldet</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {String(s.locale || "de").toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-[var(--zk-text-secondary)]">
                          {s.source || "Website"}
                        </td>
                        <td className="py-3 pl-4 text-right text-xs text-[var(--zk-text-secondary)] tabular-nums">
                          {new Date(s.createdAt).toLocaleDateString("de-DE")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "campaigns" && (
        <Card padding="lg">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Versendete Kampagnen
            </h2>

            {!campaigns || campaigns.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <PaperPlaneTilt className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
                <div className="text-base font-bold text-[var(--zk-text)]">
                  Keine Kampagnen
                </div>
                <p className="text-sm text-[var(--zk-text-secondary)]">
                  Bisher wurden keine Kampagnen versendet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--zk-border)] text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                      <th className="py-3 pr-4">Titel & Betreff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Zugestellt</th>
                      <th className="py-3 px-4">Erstellt von</th>
                      <th className="py-3 pl-4 text-right">Versanddatum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--zk-border)]">
                    {campaigns.map((c: any) => (
                      <tr key={c._id} className="hover:bg-[var(--zk-surface-muted)]">
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-[var(--zk-text)]">
                            {c.title}
                          </div>
                          <div className="text-xs text-[var(--zk-text-secondary)]">
                            {c.subject}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5">
                            <StatusDot variant="success" label="Versendet" />
                            <span>Versendet</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold tabular-nums">
                          {c.deliveredCount ?? "—"} Empfänger
                        </td>
                        <td className="py-3 px-4 text-[var(--zk-text-secondary)]">
                          {c.createdBy}
                        </td>
                        <td className="py-3 pl-4 text-right text-xs text-[var(--zk-text-secondary)] tabular-nums">
                          {c.sentAt
                            ? new Date(c.sentAt).toLocaleString("de-DE")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
