"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  EnvelopeSimple,
  LockSimple,
  Key,
  ArrowRight,
  ArrowLeft,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { AppShell } from "@astryxdesign/core/AppShell";
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Badge } from "@astryxdesign/core/Badge";
import { Banner } from "@astryxdesign/core/Banner";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Divider } from "@astryxdesign/core/Divider";
import { useAdmin } from "@/lib/admin-context";
import { RegionLanguageSwitcher } from "./RegionLanguageSwitcher";
import { toast } from "@/components/common/toast";

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
      setErrorMessage(err.message || (isDe ? "Verbindungsfehler." : "Network error."));
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
        err.message || (isDe ? "Fehler bei der Bestätigung." : "Verification error.")
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
            (isDe ? "Code konnte nicht erneut gesendet werden." : "Could not resend code.")
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isDe ? "Verbindungsfehler beim erneuten Senden." : "Network error during resend.")
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AppShell
      height="fill"
      variant="wash"
      topNav={
        <TopNav
          label="Team Dashboard Sign-In Navigation"
          heading={
            <TopNavHeading
              logo={
                <img
                  src="/icon.svg"
                  alt="Zackisch"
                  className="h-6 w-6 rounded-sm"
                />
              }
              heading="Zackisch Team Dashboard"
              subheading="internal.zackisch.com"
            />
          }
          endContent={<RegionLanguageSwitcher />}
        />
      }
    >
      <Layout height="fill">
        <LayoutContent>
          <VStack gap={6} hAlign="center" vAlign="center" minHeight="100%" padding={6}>
            <Card width={420} padding={6} elevation="low">
              <VStack gap={4}>
                <VStack gap={1.5} hAlign="center">
                  <Badge
                    variant="neutral"
                    icon={<Icon icon={ShieldCheck} size="xsm" />}
                    label={
                      step === "credentials"
                        ? isDe
                          ? "1. Passwort"
                          : "1. Password"
                        : isDe
                          ? "2. E-Mail-Code"
                          : "2. Email OTP"
                    }
                  />
                  <Heading level={2} justify="center">
                    {step === "credentials"
                      ? "Zackisch Team Dashboard"
                      : isDe
                        ? "Zwei-Faktor-Bestätigung"
                        : "Two-Factor Verification"}
                  </Heading>
                  <Text type="supporting" justify="center">
                    {step === "credentials"
                      ? isDe
                        ? "Interne Oberfläche für Mitarbeiter und Administratoren. Passwort und E-Mail-Einmalkennwort erforderlich."
                        : "Internal interface for staff and administrators. Password and email verification code required."
                      : isDe
                        ? `Wir haben einen 6-stelligen Sicherheitscode an ${email} gesendet.`
                        : `We sent a 6-digit security code to ${email}.`}
                  </Text>
                </VStack>

                {errorMessage ? (
                  <Banner
                    status="error"
                    title={isDe ? "Anmeldung fehlgeschlagen" : "Authentication error"}
                    description={errorMessage}
                    collapsible={false}
                  />
                ) : null}

                {step === "credentials" ? (
                  <form onSubmit={handleRequestOtp}>
                    <VStack gap={3}>
                      <TextInput
                        type="email"
                        size="lg"
                        label={isDe ? "E-Mail-Adresse" : "Email Address"}
                        value={email}
                        onChange={(val) => setEmail(val)}
                        placeholder="selim@zackisch.com"
                        startIcon={EnvelopeSimple}
                        isRequired
                        width="100%"
                      />

                      <TextInput
                        type="password"
                        size="lg"
                        label={isDe ? "Administrator-Passwort" : "Password"}
                        value={password}
                        onChange={(val) => setPassword(val)}
                        placeholder="••••••••••••"
                        startIcon={LockSimple}
                        isRequired
                        width="100%"
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        width="100%"
                        isLoading={isSubmitting}
                        endContent={<Icon icon={ArrowRight} size="sm" />}
                        label={
                          isDe ? "Sicherheitscode anfordern" : "Request Security Code"
                        }
                      />
                    </VStack>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <VStack gap={3}>
                      <TextInput
                        type="text"
                        size="lg"
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
                        onChange={(val) => setOtp(val.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        startIcon={Key}
                        hasAutoFocus
                        isRequired
                        width="100%"
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        width="100%"
                        isLoading={isSubmitting}
                        isDisabled={otp.length !== 6}
                        endContent={<Icon icon={ArrowRight} size="sm" />}
                        label={
                          isDe
                            ? "Im Team Dashboard einloggen"
                            : "Sign into Team Dashboard"
                        }
                      />

                      <Divider />

                      <HStack justify="between" vAlign="center" gap={2}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Icon icon={ArrowLeft} size="sm" />}
                          label={isDe ? "Zurück zu Passwort" : "Back to password"}
                          onClick={() => {
                            setStep("credentials");
                            setErrorMessage("");
                            setOtp("");
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={isResending}
                          icon={<Icon icon={ArrowsClockwise} size="sm" />}
                          label={isDe ? "Code erneut senden" : "Resend code"}
                          onClick={handleResendOtp}
                        />
                      </HStack>
                    </VStack>
                  </form>
                )}

                <Divider />

                <HStack justify="between" vAlign="center">
                  <HStack gap={1.5} vAlign="center">
                    <StatusDot variant="success" label="Convex Cloud Live" isPulsing />
                    <Text type="supporting">Convex Cloud Live</Text>
                  </HStack>
                  <Text type="supporting">Regional-Admin DE</Text>
                </HStack>
              </VStack>
            </Card>

            <Text type="supporting" justify="center">
              {isDe
                ? "© 2026 Zackisch Team Dashboard. Alle Rechte vorbehalten. Nur für autorisiertes Personal."
                : "© 2026 Zackisch Team Dashboard. All rights reserved. Authorized personnel only."}
            </Text>
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
