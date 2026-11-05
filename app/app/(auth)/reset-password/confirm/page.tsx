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
import { Button } from "@/components/ui/button";
import {
  Card,
  Banner,
  Divider,
  Spinner,
  PasswordField,
} from "@/components/ui/surfaces";
import { useTranslation } from "@/lib/i18n";
import { Check, X, ArrowLeft } from "@phosphor-icons/react";
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

  const passwordReqs = [
    { ok: passwordValue.length >= 8, label: t("passwordReqLength" as any) },
    { ok: /[A-Z]/.test(passwordValue), label: t("passwordReqUppercase" as any) },
    { ok: /[a-z]/.test(passwordValue), label: t("passwordReqLowercase" as any) },
    {
      ok:
        /[0-9]/.test(passwordValue) ||
        /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
      label: t("passwordReqNumberOrSpecial" as any),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("resetPasswordTitle")}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("resetPasswordSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {state.error && (
          <Banner
            status="error"
            title={t(state.error as any)}
          />
        )}

        <div className="flex flex-col gap-2">
          <PasswordField
            label={t("newPasswordLabel")}
            value={passwordValue}
            onChange={(val) => {
              setPasswordValue(val);
              setFieldErrors((errs) => ({ ...errs, password: "" }));
            }}
            required
            autoComplete="new-password"
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            error={fieldErrors.password || null}
          />

          <ul className="flex flex-col gap-1 text-xs">
            {passwordReqs.map((req) => (
              <li
                key={req.label}
                className={`flex items-center gap-1.5 ${
                  req.ok
                    ? "text-[var(--zk-text)] font-medium"
                    : "text-[var(--zk-text-secondary)]"
                }`}
              >
                {req.ok ? (
                  <Check size={14} weight="bold" aria-hidden="true" />
                ) : (
                  <X size={14} weight="bold" aria-hidden="true" />
                )}
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <PasswordField
          label={t("confirmPassword")}
          value={confirmPasswordValue}
          onChange={(val) => {
            setConfirmPasswordValue(val);
            setFieldErrors((errs) => ({ ...errs, confirmPassword: "" }));
          }}
          required
          autoComplete="new-password"
          showLabel={t("showPassword")}
          hideLabel={t("hidePassword")}
          error={fieldErrors.confirmPassword || null}
        />

        <Button
          variant="primary"
          size="md"
          type="submit"
          fullWidth
          loading={isPending}
        >
          {t("changePassword")}
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
  );
}

function InvalidLinkState({ locale }: { locale: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="size-12 rounded-full bg-[var(--zk-error-bg)] text-[var(--zk-error-text)] flex items-center justify-center">
        <X size={24} weight="bold" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-[var(--zk-text)]">{t("invalidLink")}</h2>
      <p className="text-sm text-[var(--zk-text-secondary)]">{t("invalidLinkDesc")}</p>
      <Link
        href="/reset-password"
        className="zk-button zk-button-primary zk-button-md zk-full-width"
      >
        {t("requestNewLink")}
      </Link>
    </div>
  );
}

function SuccessState({ locale, t }: { locale: string; t: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--zk-text)]">
          {t("passwordChangedSuccess" as any)}
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)]">
          {t("passwordChangedDesc")}
        </p>
      </div>
      <Link
        href="/sign-in"
        className="zk-button zk-button-primary zk-button-md zk-full-width"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        <span>{t("signIn")}</span>
      </Link>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Card className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <img
          src="https://zackisch.com/brand/logo/lockups/wordmark--transparent--standard.svg"
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
        <ResetPasswordConfirmForm />
      </Suspense>
    </Card>
  );
}
