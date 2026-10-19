"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { resetPasswordAction } from "@/actions/auth-actions";
import { useTranslation } from "@/lib/i18n";
import { PaperPlaneRight, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    {},
  );
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (state.success) {
      toast.success(t("resetPasswordSent"));
    }
  }, [state, t]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = t("emailInvalid");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const formData = new FormData();
    formData.set("email", email.trim());
    startTransition(() => {
      formAction(formData);
    });
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

        {state.success ? (
          <VStack gap={4}>
            <VStack gap={1}>
              <Heading level={1}>
                {t("resetPasswordLinkSent" as any)}
              </Heading>
              <Text color="secondary">
                {t("resetPasswordSent")}
              </Text>
            </VStack>

            <Button
              label={t("backToSignIn")}
              variant="primary"
              size="md"
              href="/sign-in"
              icon={<Icon icon={ArrowLeft} size="sm" />}
            />
          </VStack>
        ) : (
          <VStack gap={4}>
            <VStack gap={1}>
              <Heading level={1}>
                {t("resetPassword")}
              </Heading>
              <Text color="secondary">
                {t("resetPasswordDescription")}
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

                {state.error && (
                  <Text color="secondary" weight="semibold">
                    {t(state.error as any)}
                  </Text>
                )}

                <Button
                  label={t("sendLink")}
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isPending}
                  icon={<Icon icon={PaperPlaneRight} size="sm" />}
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
        )}
      </VStack>
    </Card>
  );
}
