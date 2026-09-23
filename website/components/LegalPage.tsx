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
      <main id="content" className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex-1 pt-12 pb-16">
        <Link
          className="group relative inline-flex min-h-11 items-center text-[13px] font-bold tracking-[.08em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          href={t("homeUrl")}
        >
          <span className="link-label relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
            {t("backHome")}
          </span>
        </Link>
        <article className="max-w-[760px] pt-8 text-[15px] leading-[1.8] [overflow-wrap:anywhere] [&_h1]:mb-10 [&_h1]:text-[clamp(32px,5vw,52px)] [&_h1]:font-semibold [&_h1]:leading-[1.15] [&_h1]:tracking-[-.035em] [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-4 [&_p]:whitespace-pre-line [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2 [&_a]:underline [&_a]:underline-offset-4">
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
