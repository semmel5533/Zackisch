"use client";

import { useActionState, startTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { confirmAccountDeletionAction } from "@/actions/settings-actions";
import { useTranslation } from "@/lib/i18n";
import { X, ArrowLeft, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Icon } from "@astryxdesign/core/Icon";

function DeleteAccountConfirmForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const boundAction = confirmAccountDeletionAction.bind(
    null,
    userId || "",
    token || "",
  );

  const formAction = async () => {
    return await boundAction();
  };

  const [state, dispatch, isPending] = useActionState<
    { success?: boolean; error?: string },
    void
  >(formAction, {});
  const { t } = useTranslation();

  useEffect(() => {
    if (state.success) {
      toast.success(t("accountDeletedSuccess" as any));
    }
  }, [state, t]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      dispatch();
    });
  };

  if (!userId || !token) {
    return <InvalidLinkState />;
  }

  if (state.success) {
    return <SuccessState t={t} />;
  }

  return (
    <DeleteConfirmFormContent
      t={t}
      error={state.error}
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  );
}

function InvalidLinkState() {
  const { t } = useTranslation();
  return (
    <VStack gap={4} align="center">
      <Icon icon={X} size="lg" color="error" />
      <Heading level={2}>{t("invalidToken" as any)}</Heading>
      <Text color="secondary">
        {t("invalidLinkDeleteAccountDesc" as any)}
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

function SuccessState({ t }: { t: any }) {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("accountDeletedSuccess" as any)}
        </Heading>
        <Text color="secondary">
          {t("accountDeletedDesc" as any)}
        </Text>
      </VStack>
      <Button
        label={t("backHome" as any)}
        variant="primary"
        size="md"
        href="/"
        icon={<Icon icon={ArrowLeft} size="sm" />}
      />
    </VStack>
  );
}

function DeleteConfirmFormContent({ t, error, isPending, handleSubmit }: any) {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Heading level={1}>
          {t("deleteAccountConfirmTitle" as any)}
        </Heading>
        <Text color="secondary">
          {t("deleteAccountConfirmDesc" as any)}
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          {error && (
            <Text color="secondary" weight="semibold">
              {error}
            </Text>
          )}
          <Button
            label={t("deleteAccountConfirmButton" as any)}
            variant="destructive"
            size="md"
            type="submit"
            isLoading={isPending}
            icon={<Icon icon={Trash} size="sm" />}
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

export default function DeleteAccountConfirmPage() {
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
          <DeleteAccountConfirmForm />
        </Suspense>
      </VStack>
    </Card>
  );
}
