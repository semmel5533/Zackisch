"use client";

import { numericText } from "@/lib/numeric-text";
import { useState } from "react";
import Link from "next/link";
import { Globe, Plus } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { QrCodeShowcase } from "./QrCodeShowcase";
import { RegionLanguageModal } from "./RegionLanguageModal";
import { ProductDemo } from "./ProductDemo";

export function MainPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = ["setupFirst", "setupSecond", "setupThird"] as const;
  const questions = ["faqApp", "faqDevices", "faqPos", "faqCosts"] as const;

  return (
    <main id="content" className="marketing">
      <section className="hero page-width">
        <h1 className="hero-title">
          <span className="hero-word">{t("heroFirst")}</span>
          <span>{t("heroLast")}</span>
        </h1>
        <div className="hero-qr">
          <QrCodeShowcase />
        </div>
        <div className="hero-copy">
          <p>{t("heroSummary")}</p>
          <RegisterCta />
        </div>
      </section>

      <section id="ablauf" className="section page-width flow-section">
        <div className="section-heading">
          <h2>{t("flowTitle")}</h2>
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
          <p className="benefit-stat">{numericText(t("benefitNumber"))}</p>
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

      <section id="kosten" className="section page-width pricing-section">
        <div>
          <h2>{t("feeTitle")}</h2>
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

      <section id="faq" className="section page-width faq-section">
        <h2>{t("faqTitle")}</h2>
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
        <div className="page-width">
          <div className="closing">
            <img
              className="closing-mascot"
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width="360"
              height="360"
            />
            <div>
              <h2>{t("closingTitle")}</h2>
              <RegisterCta />
            </div>
          </div>
          <div className="contact-row">
            <div>
              <h3 className="contact-label">{t("contactLabel")}</h3>
              <a className="contact-link" href={t("contactUrl")}>
                {t("contactEmail")}
              </a>
            </div>
            <a
              className="mars-support"
              href={t("marsUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/mars_full.svg"
                width="160"
                height="52"
                alt={t("marsLogoAlt")}
              />
              <span>{t("supportedBy")}</span>
            </a>
          </div>
          <div className="footer-bottom">
            <Link href={t("homeUrl")}>
              <img src="/full.svg" width="110" height="36" alt={t("logoAlt")} />
            </Link>
            <nav aria-label={t("footerNavigation")}>
              {(["legal", "privacy", "gtc"] as const).map((key) => (
                <Link key={key} href={t(`${key}Url`)}>
                  {t(`${key}Link`)}
                </Link>
              ))}
            </nav>
            <button
              className="region-control"
              onClick={() => setIsModalOpen(true)}
            >
              <Globe size={20} aria-hidden="true" />
              {t("regionDisplay")}
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
