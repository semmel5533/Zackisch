"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import { toast } from "@/components/common/toast";
import {
  Card,
  Button,
  Badge,
  Banner,
  StatusDot,
  Divider,
  TextField,
} from "@/components/ui/primitives";

export function AdminLoginForm() {
  const router = useRouter();
  const { initiateLogin, completeLoginWithOtp, resendOtp, currentLocale } =
    useAdmin();
  const [email, setEmail] = useState("selim@zackisch.com");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isDe = currentLocale !== "en";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage(
        isDe
          ? "Bitte gib eine gültige Administrator-E-Mail ein."
          : "Please enter a valid administrator email."
      );
      return;
    }

    if (!password || password.trim().length === 0) {
      setErrorMessage(
        isDe
          ? "Bitte gib dein Administrator-Passwort ein."
          : "Please enter your administrator password."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await initiateLogin(email.trim(), password);
      if (res.success) {
        setStep("otp");
        toast.success(
          isDe
            ? `6-stelliger Sicherheitscode an ${email} gesendet!`
            : `6-digit security code sent to ${email}!`
        );
      } else {
        setErrorMessage(
          res.error ||
            (isDe
              ? "Anmeldedaten ungültig oder Account nicht berechtigt."
              : "Invalid credentials or unauthorized account.")
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || (isDe ? "Verbindungsfehler." : "Network error.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.replace(/\D/g, "").trim();

    if (cleanOtp.length !== 6) {
      setErrorMessage(
        isDe
          ? "Bitte gib den vollständigen 6-stelligen Bestätigungscode ein."
          : "Please enter the complete 6-digit verification code."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await completeLoginWithOtp(email.trim(), cleanOtp);
      if (res.success) {
        toast.success(
          isDe
            ? "Zwei-Faktor-Authentifizierung erfolgreich! Willkommen im Team Dashboard."
            : "Two-factor authentication successful! Welcome to the Team Dashboard."
        );
        if (res.admin?.role === "staff") {
          const perms = res.admin.permissions || [];
          if (perms.includes("tickets:read")) {
            router.replace("/tickets");
          } else if (perms.includes("orders:read")) {
            router.replace("/orders");
          } else if (perms.includes("restaurants:read")) {
            router.replace("/businesses");
          } else if (perms.includes("newsletter:read")) {
            router.replace("/newsletter");
          } else {
            router.replace("/orders");
          }
        } else {
          router.replace("/");
        }
      } else {
        setErrorMessage(
          res.error ||
            (isDe
              ? "Ungültiger oder abgelaufener Sicherheitscode."
              : "Invalid or expired security code.")
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isDe ? "Fehler bei der Bestätigung." : "Verification error.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMessage("");

    try {
      const res = await resendOtp(email.trim());
      if (res.success) {
        toast.success(
          isDe
            ? `Neuer Sicherheitscode an ${email} gesendet!`
            : `New security code sent to ${email}!`
        );
      } else {
        setErrorMessage(
          res.error ||
            (isDe
              ? "Code konnte nicht erneut gesendet werden."
              : "Could not resend code.")
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isDe
            ? "Verbindungsfehler beim erneuten Senden."
            : "Network error during resend.")
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--zk-bg)] text-[var(--zk-text-body)]">
      <header className="w-full border-b border-[var(--zk-border)] bg-[var(--zk-surface)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://zackisch.com/brand/logo/lockups/wordmark--transparent--standard.svg"
            alt="Zackisch"
            className="h-6 w-auto block"
          />
          <Badge variant="neutral">INTERNAL</Badge>
        </div>
        <RegionLanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <Card padding="lg">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Badge variant="neutral">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>
                    {step === "credentials"
                      ? isDe
                        ? "1. Passwort"
                        : "1. Password"
                      : isDe
                        ? "2. E-Mail-Code"
                        : "2. Email OTP"}
                  </span>
                </Badge>

                <h1 className="text-xl font-bold text-[var(--zk-text)]">
                  {step === "credentials"
                    ? "Zackisch Team Dashboard"
                    : isDe
                      ? "Zwei-Faktor-Bestätigung"
                      : "Two-Factor Verification"}
                </h1>

                <p className="text-sm text-[var(--zk-text-secondary)]">
                  {step === "credentials"
                    ? isDe
                      ? "Interne Oberfläche für Mitarbeiter und Administratoren. Passwort und E-Mail-Einmalkennwort erforderlich."
                      : "Internal interface for staff and administrators. Password and email verification code required."
                    : isDe
                      ? `Wir haben einen 6-stelligen Sicherheitscode an ${email} gesendet.`
                      : `We sent a 6-digit security code to ${email}.`}
                </p>
              </div>

              {errorMessage ? (
                <Banner
                  status="error"
                  title={
                    isDe ? "Anmeldung fehlgeschlagen" : "Authentication error"
                  }
                  description={errorMessage}
                />
              ) : null}

              {step === "credentials" ? (
                <form onSubmit={handleRequestOtp} className="flex flex-col gap-3">
                  <TextField
                    type="email"
                    label={isDe ? "E-Mail-Adresse" : "Email Address"}
                    value={email}
                    onChange={(val) => setEmail(val)}
                    placeholder="selim@zackisch.com"
                    required
                  />

                  <TextField
                    type="password"
                    label={isDe ? "Administrator-Passwort" : "Password"}
                    value={password}
                    onChange={(val) => setPassword(val)}
                    placeholder="••••••••••••"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                  >
                    <span>
                      {isDe
                        ? "Sicherheitscode anfordern"
                        : "Request Security Code"}
                    </span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                  <TextField
                    type="text"
                    label={
                      isDe
                        ? "6-stelliger Bestätigungscode"
                        : "6-digit verification code"
                    }
                    description={
                      isDe
                        ? "Code per Google Workspace SMTP gesendet (15 Min. gültig)"
                        : "Code sent via Google Workspace SMTP (valid 15 min)"
                    }
                    value={otp}
                    onChange={(val) =>
                      setOtp(val.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    disabled={otp.length !== 6}
                  >
                    <span>
                      {isDe
                        ? "Im Team Dashboard einloggen"
                        : "Sign into Team Dashboard"}
                    </span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>

                  <Divider />

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setStep("credentials");
                        setErrorMessage("");
                        setOtp("");
                      }}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      <span>
                        {isDe ? "Zurück zu Passwort" : "Back to password"}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      loading={isResending}
                      onClick={handleResendOtp}
                    >
                      <ArrowsClockwise className="size-4" aria-hidden="true" />
                      <span>{isDe ? "Code erneut senden" : "Resend code"}</span>
                    </Button>
                  </div>
                </form>
              )}

              <Divider />

              <div className="flex items-center justify-between text-xs text-[var(--zk-text-secondary)]">
                <div className="inline-flex items-center gap-1.5">
                  <StatusDot variant="success" label="Convex Cloud Live" />
                  <span>Convex Cloud Live</span>
                </div>
                <span>Regional-Admin DE</span>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-[var(--zk-text-secondary)]">
            {isDe
              ? "© 2026 Zackisch Team Dashboard. Alle Rechte vorbehalten. Nur für autorisiertes Personal."
              : "© 2026 Zackisch Team Dashboard. All rights reserved. Authorized personnel only."}
          </p>
        </div>
      </main>
    </div>
  );
}
