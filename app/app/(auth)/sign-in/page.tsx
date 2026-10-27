"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  signInAction,
  verifyOtpAction,
  resendOtpAction,
} from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Card, Banner, Divider, PasswordField } from "@/components/ui/surfaces";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/input-otp";
import { useTranslation } from "@/lib/i18n";
import { SignIn, PaperPlaneRight } from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "@/components/common/toast";

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

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("verifyLogin")}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("verifyLoginDesc", { email: state.email || "" })}
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} noValidate className="flex flex-col gap-4">
        {isLockedOut && (
          <Banner status="error" title={t("otpLockedOut")} />
        )}

        {!isLockedOut &&
          attemptsRemaining !== null &&
          attemptsRemaining < 5 && (
            <Banner
              status="warning"
              title={
                attemptsRemaining === 1
                  ? t("otpRemainingAttemptsOne")
                  : t("otpRemainingAttempts", { count: attemptsRemaining })
              }
            />
          )}

        {otpError && (
          <Banner status="error" title={otpError} />
        )}

        <div className="flex flex-col items-center gap-2">
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
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 flex-1 text-2xl rounded-xl border-[var(--zk-border-strong)] text-[var(--zk-text)] font-inter tabular-nums"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={isLockedOut || isExpired ? "primary" : "secondary"}
            size="md"
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
              variant="primary"
              size="md"
              type="submit"
              loading={isVerifying}
              disabled={isVerifying || otp.length < 6}
            >
              <PaperPlaneRight size={16} weight="bold" aria-hidden="true" />
              <span>{t("confirm")}</span>
            </Button>
          )}
        </div>
      </form>
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = t("emailRequired");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      errors.email = t("emailInvalid");
    }

    if (!password) {
      errors.password = t("passwordRequired");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      const formData = new FormData();
      formData.set("email", email.trim());
      formData.set("password", password);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

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

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("signIn")}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("signInDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {state.error && (
          <Banner
            status="error"
            title={t(state.error as any)}
          />
        )}

        <TextField
          label={t("email")}
          type="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            setFieldErrors((errs) => ({ ...errs, email: "" }));
          }}
          placeholder={t("emailPlaceholder")}
          required
          autoComplete="email"
          error={fieldErrors.email || null}
        />

        <PasswordField
          label={t("password")}
          value={password}
          onChange={(val) => {
            setPassword(val);
            setFieldErrors((errs) => ({ ...errs, password: "" }));
          }}
          required
          autoComplete="current-password"
          showLabel={t("showPassword")}
          hideLabel={t("hidePassword")}
          error={fieldErrors.password || null}
          rightHeader={
            <Link
              href="/reset-password"
              className="text-xs font-medium text-[var(--zk-text-secondary)] hover:text-[var(--zk-text)] underline-offset-4 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          }
        />

        <Button
          variant="primary"
          size="lg"
          type="submit"
          fullWidth
          loading={isPending}
        >
          <SignIn size={18} weight="bold" aria-hidden="true" />
          <span>{t("signIn")}</span>
        </Button>
      </form>

      <Divider />

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <span className="text-[var(--zk-text-secondary)]">{t("noAccount")}</span>
        <Link
          href="/sign-up"
          className="font-semibold text-[var(--zk-text)] underline underline-offset-4 hover:opacity-80"
        >
          {t("signUp")}
        </Link>
      </div>
    </Card>
  );
}
