"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import {
  signInAction,
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
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
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
    <Card variant="default" padding={6}>
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
          <Heading level={1}>
            {t("verifyLogin")}
          </Heading>
          <Text color="secondary">
            {t("verifyLoginDesc", { email: state.email || "" })}
          </Text>
        </VStack>

        <form onSubmit={handleVerifyOtp} noValidate>
          <VStack gap={4}>
            {isLockedOut && (
              <Text weight="semibold" color="secondary">
                {t("otpLockedOut")}
              </Text>
            )}

            {!isLockedOut &&
              attemptsRemaining !== null &&
              attemptsRemaining < 5 && (
                <Text weight="semibold" color="secondary">
                  {attemptsRemaining === 1
                    ? t("otpRemainingAttemptsOne")
                    : t("otpRemainingAttempts", { count: attemptsRemaining })}
                </Text>
              )}

            <VStack gap={2} align="center">
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
            </VStack>

            {otpError && (
              <Text id="sign-in-otp-error" weight="semibold">
                {otpError}
              </Text>
            )}

            <OtpValidityTimer expiresAt={otpExpiresAt} onExpired={setIsExpired} />

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
  const [showPassword, setShowPassword] = useState(false);
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
    <Card variant="default" padding={6}>
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
          <Heading level={1}>
            {t("signIn")}
          </Heading>
          <Text color="secondary">
            {t("signInDescription")}
          </Text>
        </VStack>

        <form onSubmit={handleSubmit} noValidate>
          <VStack gap={4}>
            <TextInput
              label={t("email")}
              type="email"
              value={email}
              onChange={(val) => {
                setEmail(val);
                setFieldErrors((errs) => ({ ...errs, email: "" }));
              }}
              placeholder={t("emailPlaceholder")}
              isRequired
            />
            {fieldErrors.email && (
              <Text color="secondary" weight="semibold">
                {fieldErrors.email}
              </Text>
            )}

            <VStack gap={1}>
              <HStack justify="between" vAlign="center">
                <Text weight="semibold">{t("password")}</Text>
                <Link
                  href="/reset-password"
                  style={{ textDecoration: "none" }}
                >
                  <Text color="secondary">
                    {t("forgotPassword")}
                  </Text>
                </Link>
              </HStack>
              <HStack gap={2} vAlign="center">
                <TextInput
                  label={t("password")}
                  isLabelHidden
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(val) => {
                    setPassword(val);
                    setFieldErrors((errs) => ({ ...errs, password: "" }));
                  }}
                  isRequired
                />
                <Button
                  label={showPassword ? t("hidePassword") : t("showPassword")}
                  variant="ghost"
                  size="md"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={
                    <Icon
                      icon={showPassword ? EyeSlash : Eye}
                      size="sm"
                    />
                  }
                />
              </HStack>
              {fieldErrors.password && (
                <Text color="secondary" weight="semibold">
                  {fieldErrors.password}
                </Text>
              )}
            </VStack>

            {state.error && (
              <Text color="secondary" weight="semibold">
                {t(state.error as any)}
              </Text>
            )}

            <Button
              label={t("signIn")}
              variant="primary"
              size="md"
              type="submit"
              isLoading={isPending}
              icon={<Icon icon={SignIn} size="sm" />}
              onClick={(e: any) => handleSubmit(e)}
            />
          </VStack>
        </form>

        <Divider />

        <HStack justify="center" vAlign="center" gap={1}>
          <Text color="secondary">{t("noAccount")}</Text>
          <Link href="/sign-up" style={{ fontWeight: 600 }}>
            {t("signUp")}
          </Link>
        </HStack>
      </VStack>
    </Card>
  );
}
