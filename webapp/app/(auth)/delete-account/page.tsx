"use client";

import { useActionState, startTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { RegionLanguageSwitcher } from "@/components/region-language-dialog";
import { confirmAccountDeletionAction } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { X, CircleNotch, ArrowLeft, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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
    <div className="flex flex-col items-center justify-center py-8 text-center text-foreground">
      <X className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">{t("invalidToken" as any)}</h2>
      <p className="text-muted-foreground mt-2">
        {t("invalidLinkDeleteAccountDesc" as any)}
      </p>
      <div className="mt-6">
        <Link href="/dashboard">
          <Button type="button">{t("backToDashboard" as any)}</Button>
        </Link>
      </div>
    </div>
  );
}

function SuccessState({ t }: { t: any }) {
  return (
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl">
          {t("accountDeletedSuccess" as any)}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("accountDeletedDesc" as any)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <Link href="/" className="w-full">
            <Button type="button" className="w-full gap-2 text-base">
              <ArrowLeft className="w-5 h-5" weight="bold" />
              {t("backHome" as any)}
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}

function DeleteConfirmFormContent({ t, error, isPending, handleSubmit }: any) {
  return (
    <>
      <CardHeader className="flex-col items-start gap-1 pt-4">
        <CardTitle className="text-2xl">
          {t("deleteAccountConfirmTitle" as any)}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("deleteAccountConfirmDesc" as any)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="flex flex-col gap-4"
        >
          {error && (
            <p
              role="alert"
              className="w-full text-left text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            variant="destructive"
            className="w-full gap-2 mt-4 text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                {t("deletingAccount" as any)}
              </>
            ) : (
              <>
                <Trash className="w-5 h-5" weight="bold" />
                {t("deleteAccountConfirmButton" as any)}
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

export default function DeleteAccountConfirmPage() {
  const { t } = useTranslation();

  return (
    <Card className="w-full bg-card text-card-foreground border-border shadow-sm rounded-[24px]">
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <Link href={t("homepageUrl" as any)} target="_blank" rel="noreferrer">
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
              <CircleNotch className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        }
      >
        <DeleteAccountConfirmForm />
      </Suspense>
    </Card>
  );
}
