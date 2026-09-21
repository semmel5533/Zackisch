"use client";

import { numericText } from "@/lib/numeric-text";
import { useState } from "react";
import Link from "next/link";
import { Globe, Plus } from "@phosphor-icons/react";
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
          <p>{t("heroSummary")}</p>
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
              className={`flow-step flow-${step.toLowerCase()}`}
              key={step}
            >
              <ProductDemo screen={step} />
              <div className="flow-caption">
                <span className="step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{t(`flow${step}`)}</h3>
                  <p>{t(`flow${step}Text`)}</p>
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
        <div>
          <h2 id="kosten">{t("feeTitle")}</h2>
          <p className="section-copy">{t("feePromise")}</p>
          <div className="fee-promises">
            <p>{t("feeNoSetup")}</p>
            <p>{t("feeNoMonthly")}</p>
          </div>
        </div>
        <div className="fee">
          <div className="fee-value">
            <span className="font-inter tabular-nums">{t("feeNumber")}</span>
            <span>{t("feeUnit")}</span>
          </div>
          <h3>{t("feeLabel")}</h3>
          <p>{t("feeNote")}</p>
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
          <div className="footer-closing">
            <h2>{t("closingTitle")}</h2>
            <RegisterCta />
          </div>
          <div className="footer-contact">
            <h3 className="contact-label">{t("contactLabel")}</h3>
            <a className="contact-link" href={t("contactUrl")}>
              <span className="link-label">{t("contactEmail")}</span>
            </a>
          </div>
          <div className="footer-mars">
            <a
              className="mars-support"
              href={t("marsUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/mars_full.svg"
                width="180"
                height="58"
                alt={t("marsLogoAlt")}
              />
            </a>
          </div>
          <div className="footer-mascot">
            <img
              className="closing-mascot"
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width="420"
              height="420"
            />
          </div>
          <div className="footer-bottom">
            <nav aria-label={t("footerNavigation")}>
              {(["legal", "privacy", "gtc"] as const).map((key) => (
                <Link key={key} href={t(`${key}Url`)}>
                  <span className="link-label">{t(`${key}Link`)}</span>
                </Link>
              ))}
            </nav>
            <button
              className="region-control"
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
