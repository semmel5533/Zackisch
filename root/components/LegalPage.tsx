import { legalTranslator, type LegalKind } from "@/lib/legal";
import { numericText } from "@/lib/numeric-text";
import Link from "next/link";
import { parseLocale } from "@/lib/regions";
import { ArrowLeft } from "@phosphor-icons/react";
import { PrivacyDocument } from "./privacy/PrivacyDocument";
import { GtcDocument } from "./gtc/GtcDocument";
import { DataProcessingDocument } from "./data-processing/DataProcessingDocument";
import { AccessibilityDocument } from "./accessibility/AccessibilityDocument";
import { SiteFooter } from "./SiteFooter";

export function LegalPage({ locale, kind }: { locale: string; kind: LegalKind }) {
  const t = legalTranslator(locale);
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height,104px))] justify-between bg-white text-[#161616]">
      <main id="content" className="mx-auto w-[calc(100%-2*clamp(20px,4vw,64px))] max-w-[1200px] flex-1 pt-10 pb-16">
        <Link
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-[#525252] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] rounded-md transition-colors py-2"
          href={t("homeUrl")}
        >
          <ArrowLeft size={14} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span>{t("backHome")}</span>
        </Link>
        <article className="max-w-[760px] pt-8 text-[15px] leading-[1.8] text-[#383838] [overflow-wrap:anywhere] [&_h1]:mb-8 [&_h1]:text-[clamp(32px,4vw,48px)] [&_h1]:font-semibold [&_h1]:leading-[1.15] [&_h1]:tracking-[-.03em] [&_h1]:text-[#0A0A0A] [&_h1]:font-brand [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:text-[#0A0A0A] [&_h2]:font-brand [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0A0A0A] [&_h3]:font-brand [&_p]:my-3.5 [&_p]:whitespace-pre-line [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1.5 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-[#161616] hover:[&_a]:text-[#525252]">
          <h1>{t(`${kind}Title`)}</h1>
          {kind === "legal" && (
            <>
              <p>{numericText(t("legalBasis"))}</p>
              <p>
                {t("legalName")}
                <br />
                {numericText(t("legalAddress"))}
              </p>
              <p>
                <strong>{t("legalRepresented")}</strong>
                <br />
                {t("legalName")}
              </p>
              <h2>{t("legalContact")}</h2>
              <p>
                {t("legalPhoneLabel")}{" "}
                <a href={t("legalPhoneUrl")}>{numericText(t("legalPhone"))}</a>
                <br />
                {t("legalEmailLabel")}{" "}
                <a href={t("contactUrl")}>{t("contactEmail")}</a>
              </p>
              <h2>{t("legalDisputeTitle")}</h2>
              <p>{t("legalDispute")}</p>
            </>
          )}
          {kind === "privacy" && (
            <>
              <p>{numericText(t("privacyDate"))}</p>
              <PrivacyDocument locale={parseLocale(locale).lang} />
            </>
          )}
          {kind === "gtc" && (
            <>
              <p>{numericText(t("gtcDate"))}</p>
              <GtcDocument locale={parseLocale(locale).lang} />
            </>
          )}
          {kind === "dataProcessing" && (
            <>
              <p>{numericText(t("dataProcessingDate"))}</p>
              <DataProcessingDocument locale={parseLocale(locale).lang} />
            </>
          )}
          {kind === "accessibility" && (
            <>
              <p>{numericText(t("accessibilityDate"))}</p>
              <AccessibilityDocument locale={parseLocale(locale).lang} />
            </>
          )}
        </article>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
