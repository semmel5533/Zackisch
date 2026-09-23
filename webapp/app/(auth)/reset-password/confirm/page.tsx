"use client";

import {
  useActionState,
  useState,
  startTransition,
  useEffect,
  Suspense,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { cn } from "@/lib/utils";
import { confirmPasswordResetAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import {
  Eye,
  EyeSlash,
  Check,
  X,
  CircleNotch,
  ArrowLeft,
} from "@phosphor-icons/react";
import { toast } from "sonner";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password) {
      errors.password = t("passwordRequired");
    } else {
      const hasLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumberOrSpecial =
        /[0-9]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasLength || !hasUpperCase || !hasLowerCase || !hasNumberOrSpecial) {
        errors.password = t("passwordInvalid" as any);
      }
    }

    if (password !== confirmPassword)
      errors.confirmPassword = t("passwordMismatch");

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document
        .getElementById(errors.password ? "password" : "confirmPassword")
        ?.focus();
    } else {
      setFieldErrors({});
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
    <PasswordResetFormContent
      locale={locale}
      t={t}
      fieldErrors={fieldErrors}
      setFieldErrors={setFieldErrors}
      serverError={state.error}
      passwordValue={passwordValue}
      setPasswordValue={setPasswordValue}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  );
}

function InvalidLinkState({ locale }: { locale: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <X className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">{t("invalidLink")}</h2>
      <p className="text-muted-foreground mt-2">{t("invalidLinkDesc")}</p>
      <Button
        type="button"
        onClick={() => (window.location.href = "/reset-password")}
        className="mt-6"
      >
        {t("requestNewLink")}
      </Button>
    </div>
  );
}

function SuccessState({ locale, t }: { locale: string; t: any }) {
  return (
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("passwordChangedSuccess" as any)}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("passwordChangedDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <Link href="/sign-in" className="w-full">
            <Button type="button" className="w-full gap-2 text-base">
              <ArrowLeft className="w-5 h-5" weight="bold" />
              {t("signIn")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}

// react-doctor-ignore react-doctor/prefer-explicit-variants
function PasswordResetFormContent({
  locale,
  t,
  fieldErrors,
  setFieldErrors,
  serverError,
  passwordValue,
  setPasswordValue,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isPending,
  handleSubmit,
}: any) {
  return (
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("resetPasswordTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("resetPasswordSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className={`text-sm font-semibold ${fieldErrors.password ? "text-destructive" : "text-foreground"}`}
              >
                {t("newPasswordLabel")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordValue}
                  onChange={(e: any) => {
                    setPasswordValue(e.target.value);
                    setFieldErrors((errors: Record<string, string>) => ({
                      ...errors,
                      password: "",
                    }));
                  }}
                  maxLength={100}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  className={
                    fieldErrors.password ? "border-destructive pr-10" : "pr-10"
                  }
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? t("hidePassword") : t("showPassword")}
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeSlash
                      className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                      weight="bold"
                    />
                  ) : (
                    <Eye
                      className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                      weight="bold"
                    />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <div className="flex items-start gap-2 text-xs mt-1">
                  {passwordValue.length >= 8 ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      passwordValue.length >= 8
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqLength" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs mt-1">
                  {/[A-Z]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[A-Z]/.test(passwordValue)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqUppercase" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs mt-1">
                  {/[a-z]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[a-z]/.test(passwordValue)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {t("passwordReqLowercase" as any)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs mt-1">
                  {/[0-9]/.test(passwordValue) ||
                  /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) ? (
                    <Check
                      className="text-emerald-500 shrink-0 mt-0.5"
                      weight="bold"
                    />
                  ) : (
                    <X
                      className="text-destructive shrink-0 mt-0.5"
                      weight="bold"
                    />
                  )}
                  <span
                    className={
                      /[0-9]/.test(passwordValue) ||
                      /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
                        ? "text-foreground font-medium leading-tight"
                        : "text-muted-foreground leading-tight"
                    }
                  >
                    {t("passwordReqNumberOrSpecial" as any)}
                  </span>
                </div>
              </div>

              {fieldErrors.password && (
                <span
                  id="password-error"
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label
                htmlFor="confirmPassword"
                className={`text-sm font-semibold ${fieldErrors.confirmPassword ? "text-destructive" : "text-foreground"}`}
              >
                {t("confirmPassword")}{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  maxLength={100}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={
                    fieldErrors.confirmPassword
                      ? "confirmPassword-error"
                      : undefined
                  }
                  onChange={() =>
                    setFieldErrors((errors: Record<string, string>) => ({
                      ...errors,
                      confirmPassword: "",
                    }))
                  }
                  className={
                    fieldErrors.confirmPassword
                      ? "border-destructive pr-10"
                      : "pr-10"
                  }
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  aria-label={
                    showConfirmPassword ? t("hidePassword") : t("showPassword")
                  }
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <EyeSlash
                      className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                      weight="bold"
                    />
                  ) : (
                    <Eye
                      className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                      weight="bold"
                    />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span
                  id="confirmPassword-error"
                  role="alert"
                  className="w-full text-left text-sm font-medium text-destructive"
                >
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {serverError && (
            <p
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {t(serverError as any)}
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
                {t("saving")}
              </>
            ) : (
              t("changePassword")
            )}
          </Button>
        </form>
      </CardContent>

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
  );
}

export default function ResetPasswordConfirmPage() {
  const { t, locale } = useTranslation();

  return (
    <Card className="w-full bg-card text-card-foreground border border-border rounded-[24px] shadow-sm">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <Link href={t("homepageUrl")} target="_blank" rel="noreferrer">
          <Image
            src="https://www.zakkig.com/full.svg"
            alt="zakkig"
            width={120}
            height={40}
            priority
            loading="eager"
            className="w-auto h-8 hover:opacity-80 transition-opacity"
          />
        </Link>
        <RegionLanguageSwitcher variant="outline" />
      </div>

      <Suspense
        fallback={
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              Loading...
            </div>
          </CardContent>
        }
      >
        <ResetPasswordConfirmForm />
      </Suspense>
    </Card>
  );
}
