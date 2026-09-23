"use client";

import { useActionState, useState, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { resetPasswordAction } from "@/actions/auth-actions";
import { useTranslation } from "@/lib/i18n";
import { PaperPlaneRight, CircleNotch, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    {},
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (state.success) {
      toast.success(t("resetPasswordSent"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const errors: Record<string, string> = {};
    if (!email) {
      errors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("emailInvalid");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById("email")?.focus();
      return;
    }

    setFieldErrors({});
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className="w-full bg-card text-card-foreground border border-border rounded-[24px] shadow-sm">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center">
          <Image
            src="https://www.zakkig.com/full.svg"
            alt="zakkig"
            width={120}
            height={40}
            priority
            loading="eager"
            className="w-auto h-8 select-none"
          />
        </div>
        <RegionLanguageSwitcher variant="outline" />
      </div>
      {state.success ? (
        <>
          <CardHeader className="flex-col items-start gap-1 pt-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {t("resetPasswordLinkSent" as any)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("resetPasswordSent")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Link href="/sign-in" className="w-full">
                <Button type="button" className="w-full gap-2 text-base">
                  <ArrowLeft className="w-5 h-5" weight="bold" />
                  {t("backToSignIn")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="flex-col items-start gap-1 pt-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {t("resetPassword")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("resetPasswordDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className={`text-sm font-semibold ${fieldErrors.email ? "text-destructive" : "text-foreground"}`}
                >
                  {t("email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  maxLength={100}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  onChange={() =>
                    setFieldErrors((errors) => ({ ...errors, email: "" }))
                  }
                  className={
                    fieldErrors.email ? "border-destructive" : undefined
                  }
                />
                {fieldErrors.email && (
                  <span
                    id="email-error"
                    role="alert"
                    className="w-full text-left text-sm font-medium text-destructive"
                  >
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              {state.error && (
                <p
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {t(state.error as any)}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 mt-2 text-base"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <CircleNotch
                      className="w-5 h-5 animate-spin"
                      weight="bold"
                    />
                    {t("sendingResetLink")}
                  </>
                ) : (
                  <>
                    <PaperPlaneRight className="w-5 h-5" weight="bold" />
                    {t("sendLink")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </>
      )}

      {!state.success && (
        <>
          <CardFooter className="justify-center pb-6 bg-transparent border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t("rememberedAccount")}{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {t("signIn")}
              </Link>
            </p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
