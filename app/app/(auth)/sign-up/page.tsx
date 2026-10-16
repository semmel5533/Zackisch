"use client";

import {
  useActionState,
  useState,
  startTransition,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { useRegionStore } from "@/store/region-store";
import { cn } from "@/lib/utils";
import {
  signUpAction,
  checkEmailExistsAction,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/lib/i18n";
import { isDisposableEmail } from "@/lib/disposable-domains";
import {
  Eye,
  EyeSlash,
  Check,
  X,
  UserPlus,
  CircleNotch,
  PaperPlaneRight,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react";
import { OtpValidityTimer } from "@/components/auth/otp-validity-timer";
import { toast } from "sonner";

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
    const res = await verifyOtpAction(state.userId, code, state.pendingOrgData);
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
            src="/combination_mark.svg"
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
          {t("verifyEmail")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("verifyEmailDesc", { email: state.email || "" })}
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
              id="sign-up-otp-error"
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Wizard State
  const [step, setStep] = useState(1);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNext = async () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!fd.get("restaurantName"))
        errors.restaurantName = t("restaurantNameRequired" as any);
    } else if (step === 2) {
      const email = fd.get("email") as string;
      if (!email) {
        errors.email = t("emailRequired");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = t("emailInvalid");
      } else if (isDisposableEmail(email)) {
        errors.email = t("disposableEmail" as any);
      }

      const password = fd.get("password") as string;
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
        const res = await checkEmailExistsAction(email);
        setIsCheckingEmail(false);
        if (res.exists) {
          errors.email = t("authErrorUserExists" as any);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(Object.keys(errors)[0])?.focus();
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

    const formData = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword)
      errors.confirmPassword = t("passwordMismatch");
    if (!formData.get("terms")) errors.terms = t("termsRequired");

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(Object.keys(errors)[0])?.focus();
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
            src="/combination_mark.svg"
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
          {t("signUp")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("signUpDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress Bar (Dynamic Segments) */}
        <div className="flex w-full gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s <= step ? "flex-[2] bg-primary" : "flex-1 bg-muted",
              )}
            />
          ))}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <input type="hidden" name="region" value={region} />
          {/* Step 1: Business & Name */}
          <div className={cn("flex-col gap-5", step === 1 ? "flex" : "hidden")}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="restaurantName"
                className={`text-sm font-semibold ${fieldErrors.restaurantName ? "text-destructive" : "text-foreground"}`}
              >
                {t("restaurantName")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="restaurantName"
                name="restaurantName"
                type="text"
                placeholder={t("businessPlaceholder")}
                autoComplete="organization"
                maxLength={80}
                aria-invalid={!!fieldErrors.restaurantName}
                aria-describedby={
                  fieldErrors.restaurantName
                    ? "restaurantName-error"
                    : undefined
                }
                onChange={() =>
                  setFieldErrors((errors) => ({
                    ...errors,
                    restaurantName: "",
                  }))
                }
                className={
                  fieldErrors.restaurantName ? "border-destructive" : undefined
                }
              />
              {fieldErrors.restaurantName && (
                <span
                  id="restaurantName-error"
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {fieldErrors.restaurantName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-foreground"
              >
                {t("name")}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t("namePlaceholder")}
                autoComplete="name"
                maxLength={80}
              />
            </div>
          </div>

          {/* Step 2: Email & Password */}
          <div className={cn("flex-col gap-5", step === 2 ? "flex" : "hidden")}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className={`text-sm font-semibold ${fieldErrors.email ? "text-destructive" : "text-foreground"}`}
              >
                {t("email")} <span className="text-destructive">*</span>
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
              <label
                htmlFor="password"
                className={`text-sm font-semibold ${fieldErrors.password ? "text-destructive" : "text-foreground"}`}
              >
                {t("password")} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordValue}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                    setFieldErrors((errors) => ({ ...errors, password: "" }));
                  }}
                  maxLength={100}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                <div className="flex items-start gap-2 text-xs">
                  {passwordValue.length >= 8 ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      passwordValue.length >= 8
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqLength" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  {/[A-Z]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[A-Z]/.test(passwordValue)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqUppercase" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  {/[a-z]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[a-z]/.test(passwordValue)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqLowercase" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  {/[0-9]/.test(passwordValue) ||
                  /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[0-9]/.test(passwordValue) ||
                      /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
                        ? "text-foreground font-medium leading-tight"
                        : "text-muted-foreground leading-tight"
                    }
                  >
                    {t("passwordReqNumberOrSpecial" as any)}
                  </span>
                </div>
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
          </div>

          {/* Step 3: Confirm Password & Terms */}
          <div className={cn("flex-col gap-5", step === 3 ? "flex" : "hidden")}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className={`text-sm font-semibold ${fieldErrors.confirmPassword ? "text-destructive" : "text-foreground"}`}
              >
                {t("confirmPassword")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={100}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={
                    fieldErrors.confirmPassword
                      ? "confirmPassword-error"
                      : undefined
                  }
                  onChange={() =>
                    setFieldErrors((errors) => ({
                      ...errors,
                      confirmPassword: "",
                    }))
                  }
                  className={
                    fieldErrors.confirmPassword
                      ? "border-destructive pr-10"
                      : "pr-10"
                  }
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  aria-label={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? (
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
              {fieldErrors.confirmPassword && (
                <span
                  id="confirmPassword-error"
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 my-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  name="terms"
                  value="true"
                  aria-invalid={!!fieldErrors.terms}
                  aria-describedby={
                    fieldErrors.terms ? "terms-error" : undefined
                  }
                  onCheckedChange={() =>
                    setFieldErrors((errors) => ({ ...errors, terms: "" }))
                  }
                  className={`mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${fieldErrors.terms ? "border-destructive" : ""}`}
                />
                <div className="grid gap-1.5 leading-tight">
                  <label
                    htmlFor="terms"
                    className={cn(
                      "text-sm font-medium cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      fieldErrors.terms
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {t("agreeToTerms")}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {t("termsAgreementPrefix")}
                    <a
                      href={t("termsUrl")}
                      className="underline hover:text-foreground"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("termsAndConditions")}
                    </a>
                    {t("termsAgreementMiddle")}
                    <a
                      href={t("privacyUrl")}
                      className="underline hover:text-foreground"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("privacyPolicy")}
                    </a>
                    {t("termsAgreementSuffix")}
                  </p>
                </div>
              </div>
              {fieldErrors.terms && (
                <p
                  id="terms-error"
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {fieldErrors.terms}
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <p
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {t(state.error as any)}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 gap-2 text-base"
                disabled={isPending || isCheckingEmail}
              >
                <ArrowLeft className="w-5 h-5" weight="bold" />
                {t("back")}
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="submit"
                className={cn(
                  "gap-2 text-base",
                  step === 1 ? "w-full" : "flex-1",
                )}
                disabled={isCheckingEmail}
              >
                {isCheckingEmail ? (
                  <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" weight="bold" />
                    {t("next")}
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 gap-2 text-base"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <CircleNotch
                      className="w-5 h-5 animate-spin"
                      weight="bold"
                    />
                    {t("signingUp")}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" weight="bold" />
                    {t("signUp")}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6 bg-transparent border-t border-border">
        <p className="text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
