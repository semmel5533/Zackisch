"use client";

import {
  useActionState,
  startTransition,
  useEffect,
  Suspense,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { isDisposableEmail } from "@/lib/disposable-domains";
import { sendEmailChangeOtpAction } from "@/actions/settings-actions";
import { resolveBrandAsset } from "@zackisch/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import {
  X,
  CircleNotch,
  ArrowLeft,
  EnvelopeSimple,
} from "@phosphor-icons/react";
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
      // Redirect to OTP page with userId, email and token
      router.push(
        `/change-email/otp?userId=${state.userId}&email=${encodeURIComponent(state.email as string)}&token=${state.token}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);

  const [fieldError, setFieldError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("newEmail") as string;

    setFieldError("");

    if (!email) {
      setFieldError(t("emailRequired" as any));
      document.getElementById("newEmail")?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(t("emailInvalid" as any));
      document.getElementById("newEmail")?.focus();
      return;
    }

    if (isDisposableEmail(email)) {
      setFieldError(t("disposableEmail" as any));
      document.getElementById("newEmail")?.focus();
      return;
    }

    startTransition(() => {
      dispatch(formData);
    });
  };

  if (!userId || !token) {
    return <InvalidLinkState />;
  }

  return (
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("newEmailAddress" as any)}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("newEmailAddressDesc" as any)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="newEmail"
              className="text-sm font-medium text-foreground"
            >
              {t("email")}
            </label>
            <Input
              id="newEmail"
              name="newEmail"
              type="email"
              placeholder={t("emailPlaceholder")}
              disabled={isPending}
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? "newEmail-error" : undefined}
              onChange={() => setFieldError("")}
              className={fieldError ? "border-destructive" : undefined}
            />
            {fieldError && (
              <span
                id="newEmail-error"
                role="alert"
                className="text-sm font-medium text-destructive text-left w-full"
              >
                {fieldError}
              </span>
            )}
          </div>

          {state.error && (
            <p
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full gap-2 mt-4 text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                {t("pleaseWait" as any)}
              </>
            ) : (
              <>
                <EnvelopeSimple className="w-5 h-5" weight="bold" />
                {t("requestVerificationCode" as any)}
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6 bg-transparent border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          {t("changedMind" as any)}{" "}
          <Link
            href="/dashboard"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("backToDashboard" as any)}
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

function InvalidLinkState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-foreground">
      <X className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">{t("invalidToken" as any)}</h2>
      <p className="text-muted-foreground mt-2">
        {t("invalidLinkEmailChangeDesc" as any)}
      </p>
      <div className="mt-6">
        <Link href="/dashboard">
          <Button type="button">{t("backToDashboard" as any)}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ChangeEmailConfirmPage() {
  const { t } = useTranslation();

  return (
    <Card className="w-full bg-card text-card-foreground border-border shadow-sm rounded-[24px]">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center">
          <Image
            src={resolveBrandAsset("combinationMarkSvg", { site: "app" })}
            alt="Zackisch"
            width={120}
            height={40}
            priority
            unoptimized
            loading="eager"
            style={{ width: "auto" }}
            className="w-auto h-8 select-none"
          />
        </div>
        <RegionLanguageSwitcher variant="outline" />
      </div>

      <Suspense
        fallback={
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              <CircleNotch className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        }
      >
        <ChangeEmailConfirmForm />
      </Suspense>
    </Card>
  );
}
