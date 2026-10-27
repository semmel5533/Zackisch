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
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Card, Banner, Divider, Spinner } from "@/components/ui/surfaces";
import { useTranslation } from "@/lib/i18n";
import { X, EnvelopeSimple } from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("newEmailAddress" as any)}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("newEmailAddressDesc" as any)}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {state.error && (
          <Banner
            status="error"
            title={state.error}
          />
        )}

        <TextField
          label={t("email")}
          type="email"
          value={newEmail}
          onChange={(val) => {
            setNewEmail(val);
            setFieldError("");
          }}
          placeholder={t("emailPlaceholder")}
          required
          autoComplete="email"
          error={fieldError || null}
        />

        <Button
          variant="primary"
          size="md"
          type="submit"
          fullWidth
          loading={isPending}
        >
          <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
          <span>{t("requestVerificationCode" as any)}</span>
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

function InvalidLinkState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="size-12 rounded-full bg-[var(--zk-error-bg)] text-[var(--zk-error-text)] flex items-center justify-center">
        <X size={24} weight="bold" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-[var(--zk-text)]">{t("invalidToken" as any)}</h2>
      <p className="text-sm text-[var(--zk-text-secondary)]">
        {t("invalidLinkEmailChangeDesc" as any)}
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

export default function ChangeEmailConfirmPage() {
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
        <ChangeEmailConfirmForm />
      </Suspense>
    </Card>
  );
}
