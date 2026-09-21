"use client";

import { numericText } from "@/lib/numeric-text";
import { useEffect } from "react";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { QrCodeShowcase } from "./QrCodeShowcase";
import { WaveLine } from "./WaveLine";
import { ProductDemo } from "./ProductDemo";
import { AnimatedBenefitStat } from "./AnimatedBenefitStat";
import { SiteFooter } from "./SiteFooter";

export function MainPage() {
  const { t } = useTranslation();
  const steps = ["setupFirst", "setupSecond", "setupThird"] as const;

  useEffect(() => {
    const handleScrollTarget = () => {
      let targetId: string | null = null;
      try {
        targetId = sessionStorage.getItem("zakkig_scroll_target");
      } catch {
        // ignore
      }
      if (!targetId && window.location.hash) {
        targetId = window.location.hash.slice(1);
      }
      if (!targetId) return;

      const el = document.getElementById(targetId);
      if (el) {
        try {
          sessionStorage.removeItem("zakkig_scroll_target");
        } catch {
          // ignore
        }
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        const top = el.getBoundingClientRect().top + window.pageYOffset - 32;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    handleScrollTarget();
    const timer = setTimeout(handleScrollTarget, 100);
    const timer2 = setTimeout(handleScrollTarget, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);
  const questions = [
    "faqApp",
    "faqDevices",
    "faqPickup",
    "faqPayment",
    "faqPos",
    "faqPayout",
    "faqContract",
  ] as const;

  return (
    <main id="content" className="marketing">
      <div className="w-full relative bg-[#e7e7e7] bg-[url('/hero-stone-bg.webp')] bg-cover bg-top -mt-[var(--header-height)] pt-[var(--header-height)] border-b border-[var(--site-line)] overflow-hidden">
        <section className="hero page-width">
          <h1 className="hero-heading">
            <span className="hero-left">{t("heroLeft")}</span>
            <span className="hero-right">{t("heroRight")}</span>
          </h1>
          <div className="hero-qr">
            <QrCodeShowcase />
          </div>
          <div className="hero-copy">
            <p className="whitespace-pre-line">{t("heroSummary")}</p>
            <RegisterCta />
          </div>
        </section>
      </div>

      <section className="section page-width flow-section">
        <div className="section-heading">
          <h2 id="ablauf">{t("flowTitle")}</h2>
        </div>
        <div className="flow-grid">
          {(["Scan", "Pay", "Kitchen"] as const).map((step, index) => (
            <article
              className={`flex flex-col items-center w-full ${
                step === "Kitchen"
                  ? "col-span-full max-w-[800px] mx-auto"
                  : step === "Scan"
                    ? "max-w-[260px] mx-auto md:max-w-[230px] md:justify-self-start md:mx-0"
                    : "max-w-[260px] mx-auto md:max-w-[230px] md:justify-self-end md:mx-0"
              }`}
              key={step}
            >
              <ProductDemo screen={step} />
              <div
                className={`flex items-start gap-3 mt-6 md:mt-8 shrink-0 w-full ${
                  step === "Kitchen"
                    ? "max-w-[340px] md:max-w-[520px] mx-auto"
                    : "max-w-[250px] md:w-[255px] mx-auto"
                }`}
              >
                <span className="step-number shrink-0" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="flex flex-col items-start text-left">
                  <h3 className="text-left">{t(`flow${step}`)}</h3>
                  <p className="text-sm text-[var(--site-muted)] mt-1.5 text-left text-balance">
                    {t(`flow${step}Text`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section page-width benefits-section">
        <div>
          <h2>{t("benefitTitle")}</h2>
          <p className="section-copy">{t("benefitService")}</p>
        </div>
        <div className="benefit-evidence">
          <p className="caption">{t("benefitPrefix")}</p>
          <AnimatedBenefitStat target={30} unit="%" />
          <h3>{t("benefitMetric")}</h3>
          <a
            href={t("benefitSourceUrl")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("benefitSource")}
          </a>
        </div>
      </section>

      <section className="section setup-section">
        <div className="page-width setup-grid">
          <div>
            <h2>{t("setupTitle")}</h2>
            <p className="section-copy">{t("setupNote")}</p>
          </div>
          <ol className="setup-list">
            {steps.map((step, index) => (
              <li key={step}>
                <span className="step-number">{index + 1}</span>
                <h3>{t(step)}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section page-width pricing-section">
        <div className="flex flex-col items-center text-center justify-center">
          <h2 id="kosten">{t("feeTitle")}</h2>
          <p className="section-copy">{t("feePromise")}</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center self-center">
          <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-black">
              {t("feeNoSetup")}
            </p>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-black">
              {t("feeNoMonthly")}
            </p>
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col items-center text-center">
            <p className="text-base sm:text-lg font-medium text-black">
              <span className="font-inter tabular-nums">{t("feeNumber")}</span>
              <span>{t("feeUnit")}</span>
              {" "}
              <span>{t("feeLabel")}</span>
            </p>
            <p className="text-xs text-[var(--site-muted)] mt-1.5 text-center">
              {t("feeNote")}
            </p>
          </div>
        </div>
      </section>

      <section className="section page-width faq-section">
        <h2 id="faq">{t("faqTitle")}</h2>
        <div className="faq-list">
          {questions.map((question) => (
            <details key={question}>
              <summary>
                {t(question)}
                <Plus aria-hidden="true" />
              </summary>
              <p>{numericText(t(`${question}Answer`))}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter variant="full" />
    </main>
  );
}
