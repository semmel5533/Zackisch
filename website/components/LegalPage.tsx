import { legalTranslator, type LegalKind } from "@/lib/legal";
import { numericText } from "@/lib/numeric-text";
import Link from "next/link";
import { parseLocale } from "@/lib/regions";
import { PrivacyDocument } from "./privacy/PrivacyDocument";
import { SiteFooter } from "./SiteFooter";

export function LegalPage({ locale, kind }: { locale: string; kind: LegalKind }) {
  const t = legalTranslator(locale);
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height,104px))] justify-between">
      <main id="content" className="legal-page page-width flex-1">
        <Link
          className="legal-back inline-flex items-center min-h-[44px] text-[13px] font-bold uppercase tracking-[0.08em]"
          href={t("homeUrl")}
        >
          <span className="link-label">{t("backHome")}</span>
        </Link>
        <article className="legal-copy">
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
              <p>{t("gtcPending")}</p>
              <p>
                {t("gtcContact")}
                <br />
                <a href={t("contactUrl")}>{t("contactEmail")}</a>
              </p>
            </>
          )}
        </article>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
