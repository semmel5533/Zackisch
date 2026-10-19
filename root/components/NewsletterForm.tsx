"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button, Input } from "@zackisch/design-system";
import { newsletterResult, type NewsletterResult } from "@/lib/newsletter";
import { useTranslation } from "@/lib/i18n";

const CONVEX_SITE_URL =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  "https://silent-narwhal-392.eu-west-1.convex.site";

type SubmissionState = "idle" | "loading" | NewsletterResult;

export function NewsletterForm({ showHeader = true }: { showHeader?: boolean }) {
  const { t, locale } = useTranslation();
  const id = useId();
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const hasError = state === "invalid_email" || state === "error";
  const succeeded = state === "pending" || state === "already_confirmed";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setState("loading");
    try {
      const response = await fetch(`${CONVEX_SITE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), regionId: "de", locale, source: "website_footer" }),
      });
      const data: unknown = await response.json();
      const result = newsletterResult(response.ok, data);
      setState(result);
      if (result === "pending" || result === "already_confirmed") setEmail("");
    } catch {
      setState("error");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <div className="w-full max-w-lg">
      {showHeader && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold">{t("newsletterSectionTitle")}</h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{t("newsletterSectionDesc")}</p>
        </div>
      )}
      {!succeeded && (
        <form onSubmit={handleSubmit} aria-busy={state === "loading"}>
          <label htmlFor={id} className="mb-2 block text-sm font-medium">{t("newsletterEmailLabel")}</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              disabled={state === "loading"}
              hasError={hasError}
              aria-describedby={`${id}-notice${hasError ? ` ${id}-status` : ""}`}
              onChange={event => { setEmail(event.target.value); if (hasError) setState("idle"); }}
              className="min-w-0 flex-1 rounded-lg text-base"
            />
            <Button type="submit" busy={state === "loading"} busyText={t("newsletterSubmitting")} className="shrink-0 rounded-lg">
              {t("newsletterSubmit")}
            </Button>
          </div>
          <p id={`${id}-notice`} className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("newsletterConsentNote")} {" "}
            <a href={t("privacyUrl")} className="underline underline-offset-4">{t("privacyLink")}</a>
          </p>
        </form>
      )}
      <p id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm leading-relaxed">
        {state === "pending" ? t("newsletterPending") : state === "already_confirmed" ? t("newsletterAlreadyConfirmed") : state === "invalid_email" ? t("newsletterInvalidEmail") : state === "error" ? t("newsletterError") : ""}
      </p>
    </div>
  );
}
