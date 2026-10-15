"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import { toast } from "sonner";

export function AdminLoginForm() {
  const router = useRouter();
  const { initiateLogin, completeLoginWithOtp, resendOtp, currentLocale } = useAdmin();
  const [email, setEmail] = useState("selim@zackisch.com");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isDe = currentLocale !== "en";

  // Step 1: Validate email + password and dispatch 6-digit OTP
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

  // Step 2: Verify 6-digit OTP and complete 2FA login
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
            ? "Zwei-Faktor-Authentifizierung erfolgreich! Willkommen in der Zentrale."
            : "Two-factor authentication successful! Welcome to Operations."
        );
        if (res.admin?.role === "staff") {
          const perms = res.admin.permissions || [];
          if (perms.includes("orders:read")) {
            router.replace("/orders");
          } else if (perms.includes("restaurants:read")) {
            router.replace("/organizations");
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
          (isDe
            ? "Fehler bei der Bestätigung."
            : "Verification error.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP code
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
    <div className="min-h-screen flex flex-col justify-between bg-[#f9f9fb] text-zinc-900 font-sans p-6 sm:p-10 relative">
      {/* Top Bar with Region & Language */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/icon.svg"
            alt="Zackisch"
            className="w-8 h-8 rounded-lg shadow-2xs border border-zinc-200"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-900">
              Zackisch Operations
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              ops.zackisch.com
            </span>
          </div>
        </div>
        <RegionLanguageSwitcher />
      </div>

      {/* Main Centered Auth Window */}
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-lg p-8 sm:p-10 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 mb-2">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full">
                {isDe ? "Operative Zentrale" : "Operations Hub"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              {step === "credentials"
                ? isDe
                  ? "Zackisch Operations"
                  : "Zackisch Operations"
                : isDe
                ? "Zwei-Faktor-Bestätigung"
                : "Two-Factor Verification"}
            </h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
              {step === "credentials"
                ? isDe
                  ? "Zentrale für Mitarbeiter und Administratoren. Passwort und E-Mail-Einmalkennwort erforderlich."
                  : "Operations hub for staff and administrators. Password and email verification code required."
                : isDe
                ? `Wir haben einen 6-stelligen Sicherheitscode an ${email} gesendet.`
                : `We sent a 6-digit security code to ${email}.`}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-zinc-500">
            <span
              className={`px-2.5 py-0.5 rounded-full ${
                step === "credentials"
                  ? "bg-black text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              1. {isDe ? "Passwort" : "Password"}
            </span>
            <span className="text-zinc-300">→</span>
            <span
              className={`px-2.5 py-0.5 rounded-full ${
                step === "otp"
                  ? "bg-black text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              2. {isDe ? "E-Mail-Code" : "Email OTP"}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 leading-snug animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Email + Password */}
          {step === "credentials" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 block">
                  {isDe ? "E-Mail-Adresse" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="selim@zackisch.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 block">
                  {isDe ? "Administrator-Passwort" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-full bg-black text-white font-semibold text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isDe ? "Wird überprüft..." : "Verifying..."}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isDe
                        ? "Sicherheitscode anfordern"
                        : "Request Security Code"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: 6-digit OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 block text-center">
                  {isDe
                    ? "6-stelligen Bestätigungscode eingeben"
                    : "Enter 6-digit verification code"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 text-center font-mono text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 text-center">
                  {isDe
                    ? "Code per Google Workspace SMTP gesendet (15 Min. gültig)"
                    : "Code sent via Google Workspace SMTP (valid 15 min)"}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full h-11 rounded-full bg-black text-white font-semibold text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isDe ? "Wird autorisiert..." : "Authorizing..."}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isDe
                        ? "In die Zentrale einloggen"
                        : "Sign into Operations Hub"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setErrorMessage("");
                    setOtp("");
                  }}
                  className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-black font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    {isDe ? "Zurück zu Passwort" : "Back to password"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-black font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isResending ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {isDe ? "Code erneut senden" : "Resend code"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Operational Security Badges */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Convex Cloud Live
            </span>
            <span>Regional-Admin DE</span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-zinc-400 mt-6 leading-relaxed">
          {isDe
            ? "© 2026 Zackisch Operations. Alle Rechte vorbehalten. Nur für autorisiertes Personal."
            : "© 2026 Zackisch Operations. All rights reserved. Authorized personnel only."}
        </p>
      </div>
    </div>
  );
}
