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
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { InputGroup } from "@astryxdesign/core/InputGroup";
import { Banner } from "@astryxdesign/core/Banner";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/input-otp";
import { useTranslation } from "@/lib/i18n";
import { isDisposableEmail } from "@/lib/disposable-domains";
import {
  Eye,
  EyeSlash,
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

        <VStack gap={1}>
          <Heading level={1}>{t("verifyEmail")}</Heading>
          <Text color="secondary">
            {t("verifyEmailDesc", { email: state.email || "" })}
          </Text>
        </VStack>

        <form onSubmit={handleVerifyOtp} noValidate>
          <VStack gap={4}>
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

            <VStack gap={2} align="center">
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
            </VStack>

            <OtpValidityTimer
              expiresAt={otpExpiresAt}
              onExpired={setIsExpired}
            />

            <HStack gap={2} vAlign="center" wrap="wrap">
              <Button
                label={
                  isLockedOut || isExpired
                    ? t("requestNewCodeNow")
                    : countdown > 0
                      ? t("resendIn", { time: countdown })
                      : t("resendCode")
                }
                variant={isLockedOut || isExpired ? "primary" : "secondary"}
                size="md"
                isDisabled={countdown > 0 && !isLockedOut && !isExpired}
                onClick={handleResendOtp}
              />
              {!isLockedOut && !isExpired && (
                <Button
                  label={t("confirm")}
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
      </VStack>
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        <VStack gap={1}>
          <Heading level={1}>{t("signUp")}</Heading>
          <Text color="secondary">{t("signUpDescription")}</Text>
        </VStack>

        {/* Progress indicator */}
        <HStack gap={2} vAlign="center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: s <= step ? 2 : 1,
                height: 4,
                borderRadius: 2,
                backgroundColor:
                  s <= step ? "currentColor" : "var(--neutral-300, #d4d4d4)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </HStack>

        <form onSubmit={handleSubmit} noValidate>
          <VStack gap={4}>
            {state.error && (
              <Banner
                status="error"
                title={t(state.error as any)}
              />
            )}

            {/* Step 1: Restaurant Name & Name */}
            {step === 1 && (
              <>
                <TextInput
                  label={t("restaurantName")}
                  size="lg"
                  value={restaurantName}
                  onChange={(val) => {
                    setRestaurantName(val);
                    setFieldErrors((errs) => ({ ...errs, restaurantName: "" }));
                  }}
                  placeholder={t("businessPlaceholder")}
                  isRequired
                  width="100%"
                  status={fieldErrors.restaurantName ? { type: "error", message: fieldErrors.restaurantName } : undefined}
                />

                <TextInput
                  label={t("name")}
                  size="lg"
                  value={name}
                  onChange={(val) => setName(val)}
                  placeholder={t("namePlaceholder")}
                  width="100%"
                />
              </>
            )}

            {/* Step 2: Email & Password */}
            {step === 2 && (
              <>
                <TextInput
                  label={t("email")}
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(val) => {
                    setEmail(val);
                    setFieldErrors((errs) => ({ ...errs, email: "" }));
                  }}
                  placeholder={t("emailPlaceholder")}
                  isRequired
                  width="100%"
                  autoComplete="email"
                  status={fieldErrors.email ? { type: "error", message: fieldErrors.email } : undefined}
                />

                <VStack gap={1} width="100%">
                  <InputGroup
                    label={t("password")}
                    isRequired
                    size="lg"
                    status={fieldErrors.password ? { type: "error", message: fieldErrors.password } : undefined}
                  >
                    <TextInput
                      label={t("password")}
                      isLabelHidden
                      size="lg"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(val) => {
                        setPassword(val);
                        setFieldErrors((errs) => ({ ...errs, password: "" }));
                      }}
                      isRequired
                      autoComplete="new-password"
                    />
                    <Button
                      label={
                        showPassword ? t("hidePassword") : t("showPassword")
                      }
                      isIconOnly
                      variant="ghost"
                      size="lg"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={
                        <Icon
                          icon={showPassword ? EyeSlash : Eye}
                          size="md"
                        />
                      }
                    />
                  </InputGroup>
                </VStack>

                {/* Password Requirements */}
                <VStack gap={1}>
                  <HStack gap={2} vAlign="center">
                    <Icon
                      icon={password.length >= 8 ? Check : X}
                      size="sm"
                    />
                    <Text
                      size="sm"
                      color={password.length >= 8 ? "primary" : "secondary"}
                    >
                      {t("passwordReqLength" as any)}
                    </Text>
                  </HStack>

                  <HStack gap={2} vAlign="center">
                    <Icon
                      icon={/[A-Z]/.test(password) ? Check : X}
                      size="sm"
                    />
                    <Text
                      size="sm"
                      color={/[A-Z]/.test(password) ? "primary" : "secondary"}
                    >
                      {t("passwordReqUppercase" as any)}
                    </Text>
                  </HStack>

                  <HStack gap={2} vAlign="center">
                    <Icon
                      icon={/[a-z]/.test(password) ? Check : X}
                      size="sm"
                    />
                    <Text
                      size="sm"
                      color={/[a-z]/.test(password) ? "primary" : "secondary"}
                    >
                      {t("passwordReqLowercase" as any)}
                    </Text>
                  </HStack>

                  <HStack gap={2} vAlign="center">
                    <Icon
                      icon={
                        /[0-9]/.test(password) ||
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? Check
                          : X
                      }
                      size="sm"
                    />
                    <Text
                      size="sm"
                      color={
                        /[0-9]/.test(password) ||
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "primary"
                          : "secondary"
                      }
                    >
                      {t("passwordReqNumberOrSpecial" as any)}
                    </Text>
                  </HStack>
                </VStack>
              </>
            )}

            {/* Step 3: Confirm Password & Terms */}
            {step === 3 && (
              <>
                <VStack gap={1} width="100%">
                  <InputGroup
                    label={t("confirmPassword")}
                    isRequired
                    size="lg"
                    status={fieldErrors.confirmPassword ? { type: "error", message: fieldErrors.confirmPassword } : undefined}
                  >
                    <TextInput
                      label={t("confirmPassword")}
                      isLabelHidden
                      size="lg"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(val) => {
                        setConfirmPassword(val);
                        setFieldErrors((errs) => ({
                          ...errs,
                          confirmPassword: "",
                        }));
                      }}
                      isRequired
                      autoComplete="new-password"
                    />
                    <Button
                      label={
                        showConfirmPassword
                           ? t("hidePassword")
                          : t("showPassword")
                      }
                      isIconOnly
                      variant="ghost"
                      size="lg"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      icon={
                        <Icon
                          icon={showConfirmPassword ? EyeSlash : Eye}
                          size="md"
                        />
                      }
                    />
                  </InputGroup>
                </VStack>

                <VStack gap={1}>
                  <CheckboxInput
                    label={t("agreeToTerms")}
                    value={termsAccepted}
                    onChange={(checked) => {
                      setTermsAccepted(checked);
                      setFieldErrors((errs) => ({ ...errs, terms: "" }));
                    }}
                    isRequired
                  />
                  <Text size="sm" color="secondary">
                    {t("termsAgreementPrefix")}
                    <a
                      href={t("termsUrl")}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      {t("termsAndConditions")}
                    </a>
                    {t("termsAgreementMiddle")}
                    <a
                      href={t("privacyUrl")}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      {t("privacyPolicy")}
                    </a>
                    {t("termsAgreementSuffix")}
                  </Text>
                  {fieldErrors.terms && (
                    <Banner status="error" title={fieldErrors.terms} />
                  )}
                </VStack>
              </>
            )}

            {/* Navigation Buttons */}
            <HStack gap={3} vAlign="center">
              {step > 1 && (
                <Button
                  label={t("back")}
                  variant="secondary"
                  size="lg"
                  onClick={handleBack}
                  isDisabled={isPending || isCheckingEmail}
                  icon={<Icon icon={ArrowLeft} size="md" />}
                />
              )}

              {step < 3 ? (
                <Button
                  label={t("next")}
                  variant="primary"
                  size="lg"
                  type="button"
                  isLoading={isCheckingEmail}
                  isDisabled={isCheckingEmail}
                  onClick={handleNext}
                  icon={<Icon icon={ArrowRight} size="md" />}
                />
              ) : (
                <Button
                  label={t("signUp")}
                  variant="primary"
                  size="lg"
                  type="submit"
                  isLoading={isPending}
                  isDisabled={isPending}
                  onClick={(e: any) => handleSubmit(e)}
                  icon={<Icon icon={UserPlus} size="md" />}
                />
              )}
            </HStack>
          </VStack>
        </form>

        <Divider />

        <HStack justify="center" vAlign="center" gap={1}>
          <Text color="secondary">{t("hasAccount")}</Text>
          <Link href="/sign-in" style={{ fontWeight: 600 }}>
            {t("signIn")}
          </Link>
        </HStack>
      </VStack>
    </Card>
  );
}
