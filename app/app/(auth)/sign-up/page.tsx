"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { useRegionStore } from "@/store/region-store";
import {
  signUpAction,
  checkEmailExistsAction,
  verifyOtpAction,
  resendOtpAction,
} from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { TextField, CheckboxField } from "@/components/ui/form-controls";
import { Card, Banner, Divider, PasswordField } from "@/components/ui/surfaces";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/input-otp";
import { useTranslation } from "@/lib/i18n";
import { isDisposableEmail } from "@/lib/disposable-domains";
import {
  Check,
  X,
  UserPlus,
  PaperPlaneRight,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "@/components/common/toast";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  if (state.requiresOtp) {
    return <OtpForm state={state} />;
  }

  return (
    <SignUpForm state={state} formAction={formAction} isPending={isPending} />
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
    const res = await verifyOtpAction(
      state.userId,
      code,
      state.pendingBusinessData,
    );
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
          src="https://zackisch.com/brand/logo/lockups/wordmark--transparent--standard.svg"
          alt="Zackisch"
          style={{ height: 28, width: "auto" }}
        />
        <RegionLanguageSwitcher />
      </div>

      <Divider />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("verifyEmail")}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("verifyEmailDesc", { email: state.email || "" })}
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
            aria-describedby={otpError ? "sign-up-otp-error" : undefined}
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

        <OtpValidityTimer
          expiresAt={otpExpiresAt}
          onExpired={setIsExpired}
        />

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

function SignUpForm({
  state,
  formAction,
  isPending,
}: {
  state: any;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  const { region } = useRegionStore();

  const [step, setStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleNext = async () => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!restaurantName.trim()) {
        errors.restaurantName = t("restaurantNameRequired" as any);
      }
    } else if (step === 2) {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        errors.email = t("emailRequired");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = t("emailInvalid");
      } else if (isDisposableEmail(trimmedEmail)) {
        errors.email = t("disposableEmail" as any);
      }

      if (!password) {
        errors.password = t("passwordRequired");
      } else {
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumberOrSpecial =
          /[0-9]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (
          !hasLength ||
          !hasUpperCase ||
          !hasLowerCase ||
          !hasNumberOrSpecial
        ) {
          errors.password = t("passwordInvalid" as any);
        }
      }

      if (Object.keys(errors).length === 0) {
        setIsCheckingEmail(true);
        const res = await checkEmailExistsAction(trimmedEmail);
        setIsCheckingEmail(false);
        if (res?.exists) {
          errors.email = t("authErrorUserExists" as any);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step < 3) {
      handleNext();
      return;
    }

    const errors: Record<string, string> = {};

    if (password !== confirmPassword) {
      errors.confirmPassword = t("passwordMismatch");
    }
    if (!termsAccepted) {
      errors.terms = t("termsRequired");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      const formData = new FormData();
      formData.set("restaurantName", restaurantName.trim());
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("password", password);
      formData.set("confirmPassword", confirmPassword);
      formData.set("terms", "true");
      formData.set("region", region);

      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const passwordReqs = [
    { ok: password.length >= 8, label: t("passwordReqLength" as any) },
    { ok: /[A-Z]/.test(password), label: t("passwordReqUppercase" as any) },
    { ok: /[a-z]/.test(password), label: t("passwordReqLowercase" as any) },
    {
      ok:
        /[0-9]/.test(password) ||
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
      label: t("passwordReqNumberOrSpecial" as any),
    },
  ];

  return (
    <Card className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <img
          src="https://zackisch.com/brand/logo/lockups/wordmark--transparent--standard.svg"
          alt="Zackisch"
          style={{ height: 28, width: "auto" }}
        />
        <RegionLanguageSwitcher />
      </div>

      <Divider />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("signUp")}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("signUpDescription")}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: s <= step ? 2 : 1,
              height: 4,
              borderRadius: 2,
              backgroundColor:
                s <= step ? "var(--zk-text)" : "var(--zk-border-strong)",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {state.error && (
          <Banner
            status="error"
            title={t(state.error as any)}
          />
        )}

        {/* Step 1: Restaurant Name & Name */}
        {step === 1 && (
          <>
            <TextField
              label={t("restaurantName")}
              value={restaurantName}
              onChange={(val) => {
                setRestaurantName(val);
                setFieldErrors((errs) => ({ ...errs, restaurantName: "" }));
              }}
              placeholder={t("businessPlaceholder")}
              required
              error={fieldErrors.restaurantName || null}
            />

            <TextField
              label={t("name")}
              value={name}
              onChange={(val) => setName(val)}
              placeholder={t("namePlaceholder")}
            />
          </>
        )}

        {/* Step 2: Email & Password */}
        {step === 2 && (
          <>
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
              autoComplete="new-password"
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
              error={fieldErrors.password || null}
            />

            <ul className="flex flex-col gap-1.5 text-xs">
              {passwordReqs.map((req) => (
                <li
                  key={req.label}
                  className={`flex items-center gap-2 ${
                    req.ok
                      ? "text-[var(--zk-text)] font-medium"
                      : "text-[var(--zk-text-secondary)]"
                  }`}
                >
                  {req.ok ? (
                    <Check size={14} weight="bold" aria-hidden="true" />
                  ) : (
                    <X size={14} weight="bold" aria-hidden="true" />
                  )}
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Step 3: Confirm Password & Terms */}
        {step === 3 && (
          <>
            <PasswordField
              label={t("confirmPassword")}
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                setFieldErrors((errs) => ({
                  ...errs,
                  confirmPassword: "",
                }));
              }}
              required
              autoComplete="new-password"
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
              error={fieldErrors.confirmPassword || null}
            />

            <div className="flex flex-col gap-1.5">
              <CheckboxField
                label={t("agreeToTerms")}
                checked={termsAccepted}
                onChange={(checked) => {
                  setTermsAccepted(checked);
                  setFieldErrors((errs) => ({ ...errs, terms: "" }));
                }}
              />
              <p className="text-xs text-[var(--zk-text-secondary)] leading-relaxed">
                {t("termsAgreementPrefix")}
                <a
                  href={t("termsUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 text-[var(--zk-text)] font-medium"
                >
                  {t("termsAndConditions")}
                </a>
                {t("termsAgreementMiddle")}
                <a
                  href={t("privacyUrl")}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 text-[var(--zk-text)] font-medium"
                >
                  {t("privacyPolicy")}
                </a>
                {t("termsAgreementSuffix")}
              </p>
              {fieldErrors.terms && (
                <Banner status="error" title={fieldErrors.terms} />
              )}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-1">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleBack}
              disabled={isPending || isCheckingEmail}
            >
              <ArrowLeft size={18} weight="bold" aria-hidden="true" />
              <span>{t("back")}</span>
            </Button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              type="button"
              fullWidth={step === 1}
              className="flex-1"
              loading={isCheckingEmail}
              disabled={isCheckingEmail}
              onClick={handleNext}
            >
              <span>{t("next")}</span>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="flex-1"
              loading={isPending}
              disabled={isPending}
            >
              <UserPlus size={18} weight="bold" aria-hidden="true" />
              <span>{t("signUp")}</span>
            </Button>
          )}
        </div>
      </form>

      <Divider />

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <span className="text-[var(--zk-text-secondary)]">{t("hasAccount")}</span>
        <Link
          href="/sign-in"
          className="font-semibold text-[var(--zk-text)] underline underline-offset-4 hover:opacity-80"
        >
          {t("signIn")}
        </Link>
      </div>
    </Card>
  );
}
