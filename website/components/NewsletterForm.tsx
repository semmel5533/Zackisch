"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, WarningCircle, CircleNotch } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const CONVEX_SITE_URL =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  "https://silent-narwhal-392.eu-west-1.convex.site";

export function NewsletterForm() {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isDe = locale !== "en";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(isDe ? "Bitte gib eine gültige E-Mail-Adresse ein." : "Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          regionId: "de",
          locale: isDe ? "de" : "en",
          source: "website_footer",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(
          isDe
            ? "Fast geschafft! Bitte bestätige die E-Mail in deinem Posteingang."
            : "Almost there! Please check your inbox to confirm your subscription."
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || (isDe ? "Anmeldung fehlgeschlagen." : "Subscription failed."));
      }
    } catch {
      setStatus("error");
      setMessage(isDe ? "Verbindungsfehler. Bitte versuche es später erneut." : "Network error. Please try again later.");
    }
  }

  return (
    <div className="w-full max-w-[460px] flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-foreground">
          {isDe ? "Zackisch Updates & Neuigkeiten" : "Zackisch Updates & News"}
        </h4>
        <p className="text-[13px] text-muted-foreground leading-normal">
          {isDe
            ? "Erfahre zuerst von neuen Funktionen, Gastronomie-Tipps und regionalen Updates."
            : "Be the first to learn about new features, hospitality insights, and regional updates."}
        </p>
      </div>

      {status === "success" ? (
        <div className="flex items-start gap-2.5 rounded-2xl bg-black/5 p-3.5 text-sm text-foreground">
          <CheckCircle size={20} className="shrink-0 text-emerald-600 mt-0.5" weight="fill" />
          <div className="leading-snug">{message}</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isDe ? "deine@email.de" : "you@company.com"}
              required
              aria-label={isDe ? "E-Mail-Adresse für Newsletter" : "Email address for newsletter"}
              className="h-11 flex-1 rounded-full border border-black/15 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-11 rounded-full px-5 text-sm font-semibold inline-flex items-center gap-1.5 shrink-0"
            >
              {status === "loading" ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{isDe ? "Anmelden" : "Subscribe"}</span>
                  <ArrowRight size={14} weight="bold" />
                </>
              )}
            </Button>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <WarningCircle size={14} weight="bold" />
              <span>{message}</span>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground leading-tight">
            {isDe ? (
              <>
                Double-Opt-In. Abmeldung jederzeit mit einem Klick möglich. Details in unserer{" "}
                <a href={t("privacyUrl")} className="underline hover:text-foreground">
                  Datenschutzerklärung
                </a>
                .
              </>
            ) : (
              <>
                Double opt-in. Unsubscribe at any time with one click. Read our{" "}
                <a href={t("privacyUrl")} className="underline hover:text-foreground">
                  Privacy Policy
                </a>
                .
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
