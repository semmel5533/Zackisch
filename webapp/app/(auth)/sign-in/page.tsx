"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  signInAction,
  verifyOtpAction,
  resendOtpAction,
} from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslation } from "@/lib/i18n";
import {
  Eye,
  EyeSlash,
  SignIn,
  CircleNotch,
  PaperPlaneRight,
} from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "sonner";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, {});

  if (state.requiresOtp) {
    return <OtpForm state={state} />;
  }

  return (
    <SignInForm state={state} formAction={formAction} isPending={isPending} />
  );
}

function OtpForm({ state }: { state: any }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null,
  );
  const [otpExpiresAt, setOtpExpiresAt] = useState(
    () => Date.now() + 30 * 60 * 1000,
  );
  const [isExpired, setIsExpired] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const submitOtp = async (code: string) => {
    if (!state.userId || isLockedOut || isExpired) return;
    setIsVerifying(true);
    const res = await verifyOtpAction(state.userId, code);
    setIsVerifying(false);

    if (res?.isLockedOut) {
      setIsLockedOut(true);
      setAttemptsRemaining(0);
      setCountdown(0);
      setOtp("");
      return;
    }

    if (res?.error) {
      if (typeof res.attemptsRemaining === "number") {
        setAttemptsRemaining(res.attemptsRemaining);
      } else {
        setOtpError(t(res.error as any));
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitOtp(otp);
  };

  const handleResendOtp = async () => {
    if (
      (countdown > 0 && !isLockedOut && !isExpired) ||
      !state.userId ||
      !state.email
    )
      return;
    setIsLockedOut(false);
    setAttemptsRemaining(null);
    setCountdown(60);
    setOtp("");
    setOtpError("");
    const res = await resendOtpAction(state.userId, state.email);
    if (res?.success) {
      setOtpExpiresAt(Date.now() + 30 * 60 * 1000);
      setIsExpired(false);
      toast.success(t("codeSent"));
    }
  };

  return (
    <Card className="w-full bg-card text-card-foreground border border-border rounded-[24px] shadow-sm">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center">
          <Image
            src="https://www.zakkig.com/full.svg"
            alt="zakkig"
            width={120}
            height={40}
            priority
            className="w-auto h-8 select-none"
          />
        </div>
        <RegionLanguageSwitcher variant="outline" />
      </div>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("verifyLogin")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("verifyLoginDesc", { email: state.email || "" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleVerifyOtp}
          noValidate
          className="flex flex-col gap-4"
        >
          {isLockedOut && (
            <p className="w-full text-left text-sm font-medium text-destructive">
              {t("otpLockedOut")}
            </p>
          )}

          {!isLockedOut &&
            attemptsRemaining !== null &&
            attemptsRemaining < 5 && (
              <p className="w-full text-left text-sm font-medium text-destructive">
                {attemptsRemaining === 1
                  ? t("otpRemainingAttemptsOne")
                  : t("otpRemainingAttempts", { count: attemptsRemaining })}
              </p>
            )}

          <div className="flex flex-col items-center justify-center py-2 w-full">
            <div className="w-full">
              <InputOTP
                maxLength={6}
                value={otp}
                aria-invalid={!!otpError}
                aria-describedby={otpError ? "sign-in-otp-error" : undefined}
                onChange={(val) => {
                  if (isLockedOut || isExpired) return;
                  setOtp(val);
                  setOtpError("");
                  if (val.length === 6) {
                    submitOtp(val);
                  }
                }}
                disabled={isVerifying || isLockedOut || isExpired}
                autoFocus={!isLockedOut && !isExpired}
              >
                <InputOTPGroup className="w-full flex gap-2">
                  <InputOTPSlot
                    index={0}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-14 flex-1 text-2xl rounded-xl border-border text-foreground font-inter tabular-nums"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          {otpError && (
            <p
              id="sign-in-otp-error"
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {otpError}
            </p>
          )}
          <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              type="button"
              variant={isLockedOut || isExpired ? "default" : "outline"}
              className={`w-full ${isLockedOut || isExpired ? "sm:w-full font-semibold" : "sm:w-1/2 font-semibold"} h-11 rounded-full transition-all`}
              disabled={countdown > 0 && !isLockedOut && !isExpired}
              onClick={handleResendOtp}
            >
              {isLockedOut || isExpired
                ? t("requestNewCodeNow")
                : countdown > 0
                  ? t("resendIn", { time: countdown })
                  : t("resendCode")}
            </Button>
            {!isLockedOut && !isExpired && (
              <Button
                type="submit"
                className="w-full sm:w-1/2 gap-2 h-11 rounded-full bg-primary text-primary-foreground hover:bg-neutral-800 font-semibold disabled:opacity-40 active:scale-[0.98] transition-all"
                disabled={isVerifying || otp.length < 6}
              >
                {isVerifying ? (
                  <>
                    <CircleNotch
                      className="w-5 h-5 animate-spin"
                      weight="bold"
                    />
                    {t("verifying")}
                  </>
                ) : (
                  <>
                    <PaperPlaneRight className="w-5 h-5" weight="bold" />
                    {t("confirm")}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SignInForm({
  state,
  formAction,
  isPending,
}: {
  state: any;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    if (!formData.get("email")) {
      errors.email = t("emailRequired");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email") as string)
    ) {
      errors.email = t("emailInvalid");
    }

    if (!formData.get("password")) {
      errors.password = t("passwordRequired");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(errors.email ? "email" : "password")?.focus();
    } else {
      setFieldErrors({});
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  return (
    <Card className="w-full bg-card text-card-foreground border border-border rounded-[24px] shadow-sm">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center">
          <Image
            src="https://www.zakkig.com/full.svg"
            alt="zakkig"
            width={120}
            height={40}
            priority
            loading="eager"
            className="w-auto h-8 select-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <RegionLanguageSwitcher variant="outline" />
        </div>
      </div>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("signIn")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("signInDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className={`text-sm font-semibold ${fieldErrors.email ? "text-destructive" : "text-foreground"}`}
            >
              {t("email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              maxLength={100}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onChange={() =>
                setFieldErrors((errors) => ({ ...errors, email: "" }))
              }
              className={fieldErrors.email ? "border-destructive" : undefined}
            />
            {fieldErrors.email && (
              <span
                id="email-error"
                role="alert"
                className="w-full text-left text-sm font-medium text-destructive"
              >
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className={`text-sm font-semibold ${fieldErrors.password ? "text-destructive" : "text-foreground"}`}
              >
                {t("password")}
              </label>
              <Link
                href="/reset-password"
                className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                maxLength={100}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                onChange={() =>
                  setFieldErrors((errors) => ({ ...errors, password: "" }))
                }
                className={
                  fieldErrors.password ? "border-destructive pr-10" : "pr-10"
                }
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t("hidePassword") : t("showPassword")}
                aria-label={
                  showPassword ? t("hidePassword") : t("showPassword")
                }
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeSlash
                    className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                    weight="bold"
                  />
                ) : (
                  <Eye
                    className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                    weight="bold"
                  />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span
                id="password-error"
                role="alert"
                className="w-full text-left text-sm font-medium text-destructive"
              >
                {fieldErrors.password}
              </span>
            )}
          </div>

          {state.error && (
            <p
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {t(state.error as any)}
            </p>
          )}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                {t("signingIn")}
              </>
            ) : (
              <>
                <SignIn className="w-5 h-5" weight="bold" />
                {t("signIn")}
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6 bg-transparent border-t border-border">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
