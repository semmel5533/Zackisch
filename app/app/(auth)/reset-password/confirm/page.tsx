"use client";

import {
  useActionState,
  useState,
  startTransition,
  useEffect,
  Suspense,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { confirmPasswordResetAction } from "@/actions/auth-actions";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { InputGroup } from "@astryxdesign/core/InputGroup";
import { Banner } from "@astryxdesign/core/Banner";
import { Divider } from "@astryxdesign/core/Divider";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Icon } from "@astryxdesign/core/Icon";
import { useTranslation } from "@/lib/i18n";
import {
  Eye,
  EyeSlash,
  Check,
  X,
  ArrowLeft,
} from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";

function ResetPasswordConfirmForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const boundAction = confirmPasswordResetAction.bind(
    null,
    userId || "",
    secret || "",
  );
  const [state, formAction, isPending] = useActionState(boundAction, {});

  const { t, locale } = useTranslation();

  useEffect(() => {
    if (state.success) {
      toast.success(t("passwordChangedSuccess" as any));
    }
  }, [state, t]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!passwordValue) {
      errors.password = t("passwordRequired");
    } else {
      const hasLength = passwordValue.length >= 8;
      const hasUpperCase = /[A-Z]/.test(passwordValue);
      const hasLowerCase = /[a-z]/.test(passwordValue);
      const hasNumberOrSpecial =
        /[0-9]/.test(passwordValue) || /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

      if (!hasLength || !hasUpperCase || !hasLowerCase || !hasNumberOrSpecial) {
        errors.password = t("passwordInvalid" as any);
      }
    }

    if (passwordValue !== confirmPasswordValue)
      errors.confirmPassword = t("passwordMismatch");

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      const formData = new FormData();
      formData.set("password", passwordValue);
      formData.set("confirmPassword", confirmPasswordValue);
      startTransition(() => {
        formAction(formData as any);
      });
    }
  };

  if (!userId || !secret) {
    return <InvalidLinkState locale={locale} />;
  }

  if (state.success) {
    return <SuccessState locale={locale} t={t} />;
  }

  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("resetPasswordTitle")}
        </Heading>
        <Text color="secondary">
          {t("resetPasswordSubtitle")}
        </Text>
      </VStack>

      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={4}>
          {state.error && (
            <Banner
              status="error"
              title={t(state.error as any)}
            />
          )}

          <VStack gap={1} width="100%">
            <InputGroup
              label={t("newPasswordLabel")}
              isRequired
              status={fieldErrors.password ? { type: "error", message: fieldErrors.password } : undefined}
            >
              <TextInput
                label={t("newPasswordLabel")}
                isLabelHidden
                type={showPassword ? "text" : "password"}
                value={passwordValue}
                onChange={(val) => {
                  setPasswordValue(val);
                  setFieldErrors((errs) => ({ ...errs, password: "" }));
                }}
                isRequired
                autoComplete="new-password"
              />
              <Button
                label={showPassword ? t("hidePassword") : t("showPassword")}
                isIconOnly
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
            </InputGroup>

            <VStack gap={1}>
              <HStack gap={1} vAlign="center">
                <Icon
                  icon={passwordValue.length >= 8 ? Check : X}
                  size="sm"
                  color={passwordValue.length >= 8 ? "accent" : "secondary"}
                />
                <Text color="secondary">{t("passwordReqLength" as any)}</Text>
              </HStack>
              <HStack gap={1} vAlign="center">
                <Icon
                  icon={/[A-Z]/.test(passwordValue) ? Check : X}
                  size="sm"
                  color={/[A-Z]/.test(passwordValue) ? "accent" : "secondary"}
                />
                <Text color="secondary">{t("passwordReqUppercase" as any)}</Text>
              </HStack>
              <HStack gap={1} vAlign="center">
                <Icon
                  icon={/[a-z]/.test(passwordValue) ? Check : X}
                  size="sm"
                  color={/[a-z]/.test(passwordValue) ? "accent" : "secondary"}
                />
                <Text color="secondary">{t("passwordReqLowercase" as any)}</Text>
              </HStack>
              <HStack gap={1} vAlign="center">
                <Icon
                  icon={
                    /[0-9]/.test(passwordValue) ||
                    /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
                      ? Check
                      : X
                  }
                  size="sm"
                  color={
                    /[0-9]/.test(passwordValue) ||
                    /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
                      ? "accent"
                      : "secondary"
                  }
                />
                <Text color="secondary">{t("passwordReqNumberOrSpecial" as any)}</Text>
              </HStack>
            </VStack>
          </VStack>

          <VStack gap={1} width="100%">
            <InputGroup
              label={t("confirmPassword")}
              isRequired
              status={fieldErrors.confirmPassword ? { type: "error", message: fieldErrors.confirmPassword } : undefined}
            >
              <TextInput
                label={t("confirmPassword")}
                isLabelHidden
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPasswordValue}
                onChange={(val) => {
                  setConfirmPasswordValue(val);
                  setFieldErrors((errs) => ({ ...errs, confirmPassword: "" }));
                }}
                isRequired
                autoComplete="new-password"
              />
              <Button
                label={
                  showConfirmPassword ? t("hidePassword") : t("showPassword")
                }
                isIconOnly
                variant="ghost"
                size="md"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                icon={
                  <Icon
                    icon={showConfirmPassword ? EyeSlash : Eye}
                    size="sm"
                  />
                }
              />
            </InputGroup>
          </VStack>

          <Button
            label={t("changePassword")}
            variant="primary"
            size="md"
            type="submit"
            isLoading={isPending}
            onClick={(e: any) => handleSubmit(e)}
          />
        </VStack>
      </form>

      <Divider />

      <HStack justify="center" vAlign="center" gap={1}>
        <Text color="secondary">{t("rememberedAccount")}</Text>
        <Link href="/sign-in" style={{ fontWeight: 600 }}>
          {t("signIn")}
        </Link>
      </HStack>
    </VStack>
  );
}

function InvalidLinkState({ locale }: { locale: string }) {
  const { t } = useTranslation();
  return (
    <VStack gap={4} align="center">
      <Icon icon={X} size="lg" color="error" />
      <Heading level={2}>{t("invalidLink")}</Heading>
      <Text color="secondary">{t("invalidLinkDesc")}</Text>
      <Button
        label={t("requestNewLink")}
        variant="primary"
        size="md"
        href="/reset-password"
      />
    </VStack>
  );
}

function SuccessState({ locale, t }: { locale: string; t: any }) {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("passwordChangedSuccess" as any)}
        </Heading>
        <Text color="secondary">
          {t("passwordChangedDesc")}
        </Text>
      </VStack>
      <Button
        label={t("signIn")}
        variant="primary"
        size="md"
        href="/sign-in"
        icon={<Icon icon={ArrowLeft} size="sm" />}
      />
    </VStack>
  );
}

export default function ResetPasswordConfirmPage() {
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
          <ResetPasswordConfirmForm />
        </Suspense>
      </VStack>
    </Card>
  );
}
