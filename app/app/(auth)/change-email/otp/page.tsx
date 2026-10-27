"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  confirmEmailChangeOtpAction,
  sendEmailChangeOtpAction,
} from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Card, Banner, Divider, Spinner } from "@/components/ui/surfaces";
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("verifyEmail" as any)}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("verifyEmailDesc" as any, { email: email || "" })}
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
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
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 flex-1 text-2xl rounded-xl border-[var(--zk-border-strong)] bg-[var(--zk-surface)] text-[var(--zk-text)] font-inter tabular-nums"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <Banner
            status="error"
            title={error}
          />
        )}

        <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={isExpired ? "primary" : "secondary"}
            size="md"
            disabled={countdown > 0 && !isExpired}
            onClick={handleResendOtp}
          >
            {isExpired
              ? t("requestNewCodeNow" as any)
              : countdown > 0
                ? t("resendIn", { time: countdown })
                : t("resendCode" as any)}
          </Button>
          {!isExpired && (
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={isVerifying}
              disabled={isVerifying || otp.length < 6}
            >
              <PaperPlaneRight size={16} weight="bold" aria-hidden="true" />
              <span>{t("confirm" as any)}</span>
            </Button>
          )}
        </div>
      </form>

      <Divider />

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <span className="text-[var(--zk-text-secondary)]">{t("changedMind" as any)}</span>
        <Link
          href="/dashboard"
          className="font-semibold text-[var(--zk-text)] underline underline-offset-4 hover:opacity-80"
        >
          {t("backToDashboard" as any)}
        </Link>
      </div>
    </div>
  );
}

export default function ChangeEmailOtpPage() {
  return (
    <Card className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <img
          src="/combination_mark.svg"
          alt="Zackisch"
          style={{ height: 28, width: "auto" }}
        />
        <RegionLanguageSwitcher />
      </div>

      <Divider />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-6">
            <Spinner size="md" />
          </div>
        }
      >
        <ChangeEmailOtpForm />
      </Suspense>
    </Card>
  );
}
