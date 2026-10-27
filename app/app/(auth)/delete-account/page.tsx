"use client";

import { useActionState, startTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { confirmAccountDeletionAction } from "@/actions/settings-actions";
import { useTranslation } from "@/lib/i18n";
import { X, ArrowLeft, Trash } from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { Card, Banner, Divider, Spinner } from "@/components/ui/surfaces";

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
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="size-12 rounded-full bg-[var(--zk-error-bg)] text-[var(--zk-error-text)] flex items-center justify-center">
        <X size={24} weight="bold" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-[var(--zk-text)]">{t("invalidToken" as any)}</h2>
      <p className="text-sm text-[var(--zk-text-secondary)]">
        {t("invalidLinkDeleteAccountDesc" as any)}
      </p>
      <Link
        href="/dashboard"
        className="zk-button zk-button-primary zk-button-md zk-full-width"
      >
        {t("backToDashboard" as any)}
      </Link>
    </div>
  );
}

function SuccessState({ t }: { t: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("accountDeletedSuccess" as any)}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("accountDeletedDesc" as any)}
        </p>
      </div>
      <Link
        href="/"
        className="zk-button zk-button-primary zk-button-md zk-full-width"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        <span>{t("backHome" as any)}</span>
      </Link>
    </div>
  );
}

function DeleteConfirmFormContent({ t, error, isPending, handleSubmit }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("deleteAccountConfirmTitle" as any)}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("deleteAccountConfirmDesc" as any)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <Banner
            status="error"
            title={error}
          />
        )}
        <Button
          variant="destructive"
          size="md"
          type="submit"
          fullWidth
          loading={isPending}
        >
          <Trash size={16} weight="bold" aria-hidden="true" />
          <span>{t("deleteAccountConfirmButton" as any)}</span>
        </Button>
      </form>

      <Divider />

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <span className="text-[var(--zk-text-secondary)]">{t("changedMind" as any)}</span>
        <Link
          href="/dashboard"
          className="font-semibold text-[var(--zk-text)] underline underline-offset-4 hover:opacity-80"
        >
          {t("backToDashboard" as any)}
        </Link>
      </div>
    </div>
  );
}

export default function DeleteAccountConfirmPage() {
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

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-6">
            <Spinner size="md" />
          </div>
        }
      >
        <DeleteAccountConfirmForm />
      </Suspense>
    </Card>
  );
}
