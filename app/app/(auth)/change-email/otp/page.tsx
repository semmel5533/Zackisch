"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  confirmEmailChangeOtpAction,
  sendEmailChangeOtpAction,
} from "@/actions/settings-actions";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Banner } from "@astryxdesign/core/Banner";
import { Divider } from "@astryxdesign/core/Divider";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Icon } from "@astryxdesign/core/Icon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/input-otp";
import { useTranslation } from "@/lib/i18n";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "@/components/common/toast";

function ChangeEmailOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otpExpiresAt, setOtpExpiresAt] = useState(
    () => Date.now() + 30 * 60 * 1000,
  );
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const submitOtp = async (code: string) => {
    if (!userId || !token || !email || isExpired) return;
    setIsVerifying(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("token", token);
    formData.append("email", email);
    formData.append("otp", code);

    const res = await confirmEmailChangeOtpAction({}, formData);
    setIsVerifying(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      toast.success(t("emailChangedSuccess" as any));
      router.push("/");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitOtp(otp);
  };

  const handleResendOtp = async () => {
    if ((countdown > 0 && !isExpired) || !userId || !token || !email) return;
    setCountdown(60);
    setOtp("");
    setError("");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("token", token);
    formData.append("newEmail", email);

    const res = await sendEmailChangeOtpAction({}, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setOtpExpiresAt(Date.now() + 30 * 60 * 1000);
      setIsExpired(false);
      toast.success(t("newOtpSent" as any));
    }
  };

  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("verifyEmail" as any)}
        </Heading>
        <Text color="secondary">
          {t("verifyEmailDesc" as any, { email: email || "" })}
        </Text>
      </VStack>

      <form onSubmit={handleVerifyOtp} noValidate>
        <VStack gap={4}>
          <VStack gap={2} align="center">
            <InputOTP
              maxLength={6}
              value={otp}
              aria-invalid={!!error}
              aria-describedby={error ? "otp-error" : undefined}
              onChange={(val) => {
                if (isExpired) return;
                setOtp(val);
                setError("");
                if (val.length === 6) {
                  submitOtp(val);
                }
              }}
              disabled={isVerifying || isExpired}
              autoFocus={!isExpired}
            >
              <InputOTPGroup className="w-full flex gap-2">
                <InputOTPSlot
                  index={0}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 flex-1 text-2xl rounded-xl border-border bg-background text-foreground font-inter tabular-nums"
                />
              </InputOTPGroup>
            </InputOTP>
          </VStack>

          {error && (
            <Banner
              status="error"
              title={error}
            />
          )}

          <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />

          <HStack gap={2} vAlign="center" wrap="wrap">
            <Button
              label={
                isExpired
                  ? t("requestNewCodeNow" as any)
                  : countdown > 0
                    ? t("resendIn", { time: countdown })
                    : t("resendCode" as any)
              }
              variant={isExpired ? "primary" : "secondary"}
              size="md"
              isDisabled={countdown > 0 && !isExpired}
              onClick={handleResendOtp}
            />
            {!isExpired && (
              <Button
                label={t("confirm" as any)}
                variant="primary"
                size="md"
                type="submit"
                isLoading={isVerifying}
                isDisabled={isVerifying || otp.length < 6}
                icon={<Icon icon={PaperPlaneRight} size="sm" />}
                onClick={(e: any) => handleVerifyOtp(e)}
              />
            )}
          </HStack>
        </VStack>
      </form>

      <Divider />

      <HStack justify="center" vAlign="center" gap={1}>
        <Text color="secondary">{t("changedMind" as any)}</Text>
        <Link href="/dashboard" style={{ fontWeight: 600 }}>
          {t("backToDashboard" as any)}
        </Link>
      </HStack>
    </VStack>
  );
}

export default function ChangeEmailOtpPage() {
  return (
    <Card variant="default" padding={6} elevation="med" width="100%">
      <VStack gap={6}>
        <HStack justify="between" vAlign="center">
          <img
            src="/combination_mark.svg"
            alt="Zackisch"
            style={{ height: 28, width: "auto" }}
          />
          <RegionLanguageSwitcher />
        </HStack>

        <Divider />

        <Suspense
          fallback={
            <VStack gap={4} align="center" padding={6}>
              <Spinner size="md" />
            </VStack>
          }
        >
          <ChangeEmailOtpForm />
        </Suspense>
      </VStack>
    </Card>
  );
}
