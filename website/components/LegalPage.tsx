import { legalTranslator, type LegalKind } from "@/lib/legal";
import { numericText } from "@/lib/numeric-text";
import Link from "next/link";
import { parseLocale } from "@/lib/regions";
import { PrivacyDocument } from "./privacy/PrivacyDocument";

export function LegalPage({ locale, kind }: { locale: string; kind: LegalKind }) {
  const t = legalTranslator(locale);
  return (
    <main id="content" className="legal-page page-width">
      <Link className="legal-back" href={t("homeUrl")}>
        {t("backHome")}
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
      <nav className="legal-footer" aria-label={t("footerNavigation")}>
        {(["legal", "privacy", "gtc"] as const).map((key) => (
          <Link key={key} href={t(`${key}Url`)}>
            {t(`${key}Link`)}
          </Link>
        ))}
      </nav>
    </main>
  );
}
