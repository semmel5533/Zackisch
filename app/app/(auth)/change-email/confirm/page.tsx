"use client";

import {
  useActionState,
  startTransition,
  useEffect,
  Suspense,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { isDisposableEmail } from "@/lib/disposable-domains";
import { sendEmailChangeOtpAction } from "@/actions/settings-actions";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Divider } from "@astryxdesign/core/Divider";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Icon } from "@astryxdesign/core/Icon";
import { useTranslation } from "@/lib/i18n";
import { X, EnvelopeSimple } from "@phosphor-icons/react";
import { toast } from "sonner";

function ChangeEmailConfirmForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [state, dispatch, isPending] = useActionState<
    {
      success?: boolean;
      error?: string;
      email?: string;
      userId?: string;
      token?: string;
    },
    FormData
  >(sendEmailChangeOtpAction, {});
  const { t } = useTranslation();

  useEffect(() => {
    if (state.success) {
      toast.success(t("emailChangeConfirmSent" as any));
      router.push(
        `/change-email/otp?userId=${state.userId}&email=${encodeURIComponent(state.email as string)}&token=${state.token}`,
      );
    }
  }, [state, router, t]);

  const [newEmail, setNewEmail] = useState("");
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError("");

    if (!newEmail.trim()) {
      setFieldError(t("emailRequired" as any));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setFieldError(t("emailInvalid" as any));
      return;
    }

    if (isDisposableEmail(newEmail.trim())) {
      setFieldError(t("disposableEmail" as any));
      return;
    }

    const formData = new FormData();
    formData.set("userId", userId || "");
    formData.set("token", token || "");
    formData.set("newEmail", newEmail.trim());

    startTransition(() => {
      dispatch(formData);
    });
  };

  if (!userId || !token) {
    return <InvalidLinkState />;
  }

  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("newEmailAddress" as any)}
        </Heading>
        <Text color="secondary">
          {t("newEmailAddressDesc" as any)}
        </Text>
      </VStack>

      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={4}>
          <TextInput
            label={t("email")}
            type="email"
            value={newEmail}
            onChange={(val) => {
              setNewEmail(val);
              setFieldError("");
            }}
            placeholder={t("emailPlaceholder")}
            isRequired
          />
          {fieldError && (
            <Text color="secondary" weight="semibold">
              {fieldError}
            </Text>
          )}

          {state.error && (
            <Text color="secondary" weight="semibold">
              {state.error}
            </Text>
          )}

          <Button
            label={t("requestVerificationCode" as any)}
            variant="primary"
            size="md"
            type="submit"
            isLoading={isPending}
            icon={<Icon icon={EnvelopeSimple} size="sm" />}
            onClick={(e: any) => handleSubmit(e)}
          />
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

function InvalidLinkState() {
  const { t } = useTranslation();
  return (
    <VStack gap={4} align="center">
      <Icon icon={X} size="lg" color="error" />
      <Heading level={2}>{t("invalidToken" as any)}</Heading>
      <Text color="secondary">
        {t("invalidLinkEmailChangeDesc" as any)}
      </Text>
      <Button
        label={t("backToDashboard" as any)}
        variant="primary"
        size="md"
        href="/dashboard"
      />
    </VStack>
  );
}

export default function ChangeEmailConfirmPage() {
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

        <Suspense
          fallback={
            <VStack gap={4} align="center" padding={6}>
              <Spinner size="md" />
            </VStack>
          }
        >
          <ChangeEmailConfirmForm />
        </Suspense>
      </VStack>
    </Card>
  );
}
