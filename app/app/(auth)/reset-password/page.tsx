"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { resetPasswordAction } from "@/actions/auth-actions";
import { useTranslation } from "@/lib/i18n";
import { PaperPlaneRight, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Card, Banner, Divider } from "@/components/ui/surfaces";

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

      {state.success ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
              {t("resetPasswordLinkSent" as any)}
            </h1>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              {t("resetPasswordSent")}
            </p>
          </div>

          <Link
            href="/sign-in"
            className="zk-button zk-button-primary zk-button-md zk-full-width"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            <span>{t("backToSignIn")}</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
              {t("resetPassword")}
            </h1>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              {t("resetPasswordDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {state.error && (
              <Banner
                status="error"
                title={t(state.error as any)}
              />
            )}

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

            <Button
              variant="primary"
              size="md"
              type="submit"
              fullWidth
              loading={isPending}
            >
              <PaperPlaneRight size={16} weight="bold" aria-hidden="true" />
              <span>{t("sendLink")}</span>
            </Button>
          </form>

          <Divider />

          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span className="text-[var(--zk-text-secondary)]">{t("rememberedAccount")}</span>
            <Link
              href="/sign-in"
              className="font-semibold text-[var(--zk-text)] underline underline-offset-4 hover:opacity-80"
            >
              {t("signIn")}
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
