"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, WarningCircle, CircleNotch } from "@phosphor-icons/react";
import { parseLocale } from "@/lib/regions";
import { Button } from "@/components/ui/button";

const CONVEX_SITE_URL =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  "https://silent-narwhal-392.eu-west-1.convex.site";

export function ConfirmContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { lang } = parseLocale(locale);
  const isDe = lang === "de";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : isDe ? "Kein Bestätigungs-Token angegeben." : "No confirmation token provided."
  );

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function confirm() {
      try {
        const res = await fetch(`${CONVEX_SITE_URL}/api/newsletter/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!isMounted) return;

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(
            data.message ||
              (isDe
                ? "Der Bestätigungslink ist ungültig oder abgelaufen."
                : "The confirmation link is invalid or has expired.")
          );
        }
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          isDe
            ? "Verbindungsfehler beim Bestätigen. Bitte versuche es später erneut."
            : "Network error during confirmation. Please try again later."
        );
      }
    }

    confirm();
    return () => {
      isMounted = false;
    };
  }, [token, isDe]);

  return (
    <div className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8 sm:p-10 shadow-sm text-center flex flex-col items-center">
      {status === "loading" && (
        <>
          <CircleNotch size={44} className="animate-spin text-[#161616] mb-4" />
          <h1 className="text-xl font-semibold mb-2 text-[#0A0A0A] font-brand">
            {isDe ? "Anmeldung wird bestätigt..." : "Confirming subscription..."}
          </h1>
          <p className="text-sm text-[#525252]">
            {isDe ? "Einen kleinen Augenblick bitte." : "Just a moment please."}
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-14 h-14 rounded-full bg-[#161616] text-white flex items-center justify-center mb-4">
            <CheckCircle size={32} weight="fill" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-[#0A0A0A] font-brand">
            {isDe ? "Anmeldung erfolgreich!" : "Subscription confirmed!"}
          </h1>
          <p className="text-sm text-[#525252] leading-relaxed mb-6">
            {isDe
              ? "Vielen Dank! Du bist nun für den Zackisch-Newsletter eingetragen und erhältst Neuigkeiten und Updates rund um unsere Plattform."
              : "Thank you! You are now subscribed to the Zackisch newsletter and will receive news and updates about our platform."}
          </p>
          <Link href={`/${locale}`}>
            <Button className="rounded-full px-6 h-11 text-sm font-semibold bg-[#161616] text-white hover:bg-[#252525]">
              {isDe ? "Zurück zur Startseite" : "Back to Home"}
            </Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-14 h-14 rounded-full bg-[#FFF1EF] border border-[#FECDCA] text-[#B42318] flex items-center justify-center mb-4">
            <WarningCircle size={32} weight="fill" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-[#0A0A0A] font-brand">
            {isDe ? "Bestätigung fehlgeschlagen" : "Confirmation failed"}
          </h1>
          <p className="text-sm text-[#525252] leading-relaxed mb-6">
            {errorMessage}
          </p>
          <div className="flex gap-3">
            <Link href={`/${locale}`}>
              <Button variant="outline" className="rounded-full px-5 h-11 text-sm font-semibold border-[#E0E0E0] text-[#161616] hover:bg-[#F7F7F7]">
                {isDe ? "Zur Startseite" : "To Home"}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
