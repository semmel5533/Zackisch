"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, WarningCircle, CircleNotch } from "@phosphor-icons/react";
import { parseLocale } from "@/lib/regions";
import { Button } from "@/components/ui/button";

const CONVEX_SITE_URL =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  "https://silent-narwhal-392.eu-west-1.convex.site";

export function UnsubscribeContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";
  const { lang } = parseLocale(locale);
  const isDe = lang === "de";

  const [token] = useState(initialToken);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleUnsubscribe(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/newsletter/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          email: !token ? email.trim() : undefined,
          regionId: "de",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          data.message ||
            (isDe
              ? "Abmeldung fehlgeschlagen. Bitte prüfe deine Eingabe."
              : "Unsubscription failed. Please check your input.")
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        isDe
          ? "Verbindungsfehler beim Abmelden. Bitte versuche es später erneut."
          : "Network error during unsubscription. Please try again later."
      );
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8 sm:p-10 shadow-sm text-center flex flex-col items-center">
      {status === "success" ? (
        <>
          <div className="w-14 h-14 rounded-full bg-[#161616] text-white flex items-center justify-center mb-4">
            <CheckCircle size={32} weight="fill" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-[#0A0A0A] font-brand">
            {isDe ? "Erfolgreich abgemeldet" : "Successfully unsubscribed"}
          </h1>
          <p className="text-sm text-[#525252] leading-relaxed mb-6">
            {isDe
              ? "Du wurdest aus dem Newsletter-Verteiler ausgetragen und erhältst keine Marketing-E-Mails mehr von Zackisch."
              : "You have been removed from the newsletter list and will no longer receive marketing emails from Zackisch."}
          </p>
          <Link href={`/${locale}`}>
            <Button className="rounded-full px-6 h-11 text-sm font-semibold bg-[#161616] text-white hover:bg-[#252525]">
              {isDe ? "Zurück zur Startseite" : "Back to Home"}
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-[#0A0A0A] font-brand">
            {isDe ? "Newsletter abmelden" : "Unsubscribe from Newsletter"}
          </h1>
          <p className="text-sm text-[#525252] leading-relaxed mb-6">
            {token
              ? isDe
                ? "Möchtest du dich wirklich vom Zackisch-Newsletter abmelden?"
                : "Are you sure you want to unsubscribe from the Zackisch newsletter?"
              : isDe
                ? "Gib deine E-Mail-Adresse ein, um dich vom Zackisch-Newsletter abzumelden."
                : "Enter your email address to unsubscribe from the Zackisch newsletter."}
          </p>

          {status === "error" && (
            <div className="w-full flex items-center gap-2 p-3 bg-[#FFF1EF] border border-[#FECDCA] rounded-xl text-xs text-[#B42318] font-medium mb-4 text-left">
              <WarningCircle size={16} weight="bold" className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {token ? (
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => handleUnsubscribe()}
                disabled={status === "loading"}
                className="w-full h-11 rounded-full text-sm font-semibold bg-[#161616] text-white hover:bg-[#252525] inline-flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <span>{isDe ? "Jetzt abmelden" : "Unsubscribe now"}</span>
                )}
              </Button>
              <Link href={`/${locale}`} className="w-full">
                <Button variant="outline" className="w-full h-11 rounded-full text-sm font-semibold border-[#E0E0E0] text-[#161616] hover:bg-[#F7F7F7]">
                  {isDe ? "Abbrechen" : "Cancel"}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="flex flex-col gap-3 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isDe ? "deine@email.de" : "you@company.com"}
                required
                className="h-11 rounded-full border border-[#E0E0E0] bg-white px-4 text-sm text-[#161616] placeholder:text-[#959595] focus-visible:border-[#161616] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#161616] text-center"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-11 rounded-full text-sm font-semibold bg-[#161616] text-white hover:bg-[#252525] inline-flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <span>{isDe ? "Abmelden" : "Unsubscribe"}</span>
                )}
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
