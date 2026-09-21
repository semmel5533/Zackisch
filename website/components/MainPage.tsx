"use client";

import { numericText } from "@/lib/numeric-text";
import { useState } from "react";
import Link from "next/link";
import { Check, Globe, Plus } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { QrCodeShowcase } from "./QrCodeShowcase";
import { RegionLanguageModal } from "./RegionLanguageModal";
import { WaveLine } from "./WaveLine";
import { ProductDemo } from "./ProductDemo";
import { AnimatedBenefitStat } from "./AnimatedBenefitStat";

export function MainPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = ["setupFirst", "setupSecond", "setupThird"] as const;
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

      <footer className="site-footer">
        <div className="page-width footer-container">
          <div className="footer-closing-title text-left">
            <h2>{t("closingTitle")}</h2>
          </div>
          <div className="footer-closing-cta flex items-center">
            <RegisterCta />
          </div>
          <div className="footer-contact flex flex-col items-end text-right justify-self-end gap-2 pt-2 max-md:pt-0">
            <h3 className="text-2xl font-medium m-0 leading-[1.1]">{t("contactLabel")}</h3>
            <a
              className="inline-block text-[clamp(24px,3.8vw,46px)] max-md:text-[clamp(26px,7.8vw,36px)] tracking-tight leading-[1.1] text-right"
              href={t("contactUrl")}
            >
              <span className="link-label">{t("contactEmail")}</span>
            </a>
          </div>
          <div className="footer-mars justify-self-end flex justify-end">
            <a
              className="inline-flex items-center justify-end gap-1.5 text-[13px] text-[var(--site-muted)] whitespace-nowrap"
              href={t("marsUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{t("supportedBy")}</span>
              <img
                src="/mars_full.svg"
                width="180"
                height="58"
                alt={t("marsLogoAlt")}
                className="w-[150px] shrink-0 h-auto block"
              />
            </a>
          </div>
          <div className="footer-mascot justify-self-start flex items-end mt-[clamp(64px,8vw,120px)] mb-[-110px]">
            <img
              className="closing-mascot w-[clamp(290px,26vw,380px)] h-auto object-contain block"
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width="420"
              height="420"
            />
          </div>
          <div className="footer-bottom flex flex-col items-end self-end gap-3 py-7 max-md:pt-4 max-md:pb-0">
            <nav
              className="flex gap-6 max-md:gap-5 text-[13px] font-bold uppercase tracking-[0.08em] max-md:w-full max-md:justify-end max-md:flex-nowrap"
              aria-label={t("footerNavigation")}
            >
              {(["legal", "privacy", "gtc"] as const).map((key) => (
                <Link
                  key={key}
                  href={t(`${key}Url`)}
                  className="min-h-[44px] flex items-center max-md:justify-end max-md:text-right max-md:whitespace-nowrap"
                >
                  <span className="link-label">{t(`${key}Link`)}</span>
                </Link>
              ))}
            </nav>
            <button
              className="inline-flex items-center gap-2.5 min-h-[44px] text-[13px] font-bold uppercase tracking-[0.08em] leading-none bg-transparent border-0 text-inherit cursor-pointer transition-opacity duration-150 hover:opacity-80"
              onClick={() => setIsModalOpen(true)}
            >
              <Globe size={20} aria-hidden="true" />
              <span>{t("regionDisplay")}</span>
            </button>
          </div>
        </div>
      </footer>
      {isModalOpen && (
        <RegionLanguageModal isOpen onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}
