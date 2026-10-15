"use client";

import { useState, startTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  confirmEmailChangeOtpAction,
  sendEmailChangeOtpAction,
} from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslation } from "@/lib/i18n";
import { CircleNotch, PaperPlaneRight } from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "sonner";

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
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("verifyEmail" as any)}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("verifyEmailDesc" as any, { email: email || "" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleVerifyOtp}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center justify-center gap-4 py-4 w-full">
            <div className="w-full">
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
            </div>
          </div>
          {error && (
            <p
              id="otp-error"
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}
          <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              type="button"
              variant={isExpired ? "default" : "outline"}
              className={`w-full ${isExpired ? "sm:w-full" : "sm:w-1/2"}`}
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
                type="submit"
                className="w-full sm:w-1/2 gap-2"
                disabled={isVerifying || otp.length < 6}
              >
                {isVerifying ? (
                  <>
                    <CircleNotch
                      className="w-5 h-5 animate-spin"
                      weight="bold"
                    />
                    {t("verifying" as any)}
                  </>
                ) : (
                  <>
                    <PaperPlaneRight className="w-5 h-5" weight="bold" />
                    {t("confirm" as any)}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6 bg-transparent border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          {t("changedMind" as any)}{" "}
          <Link
            href="/dashboard"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("backToDashboard" as any)}
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

export default function ChangeEmailOtpPage() {
  const { t } = useTranslation();

  return (
    <Card className="w-full bg-card text-card-foreground border border-border rounded-[24px] shadow-sm">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center">
          <Image
            src="/combination_mark.svg"
            alt="zakkig"
            width={120}
            height={40}
            priority
            loading="eager"
            className="w-auto h-8 select-none"
          />
        </div>
        <RegionLanguageSwitcher variant="outline" />
      </div>

      <Suspense
        fallback={
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              <CircleNotch className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        }
      >
        <ChangeEmailOtpForm />
      </Suspense>
    </Card>
  );
}
