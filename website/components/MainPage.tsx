"use client";

import { numericText } from "@/lib/numeric-text";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { QrCodeShowcase } from "./QrCodeShowcase";
import { ProductDemo } from "./ProductDemo";
import { AnimatedBenefitStat } from "./AnimatedBenefitStat";
import { SiteFooter } from "./SiteFooter";
import { NewsletterForm } from "./NewsletterForm";

export function MainPage() {
  const { t } = useTranslation();
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
    <main id="content">
      <div className="w-full relative bg-[#e7e7e7] bg-[url('/hero-stone-bg.webp')] bg-cover bg-top -mt-[var(--header-height)] pt-[var(--header-height)] border-b border-[var(--site-line)] overflow-hidden">
        <section className="mx-auto grid min-h-[calc(100svh-var(--header-height))] w-[calc(100%-2*var(--site-gutter))] max-w-[1320px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] content-center items-center justify-center gap-x-12 gap-y-10 py-[clamp(32px,5vh,64px)] [grid-template-areas:'left-word_qr_right-word'_'copy_copy_copy'] max-[1024px]:grid-cols-1 max-[1024px]:justify-items-center max-[1024px]:gap-8 max-[1024px]:py-[clamp(16px,3vh,48px)] max-[1024px]:[grid-template-areas:'heading'_'qr'_'copy'] max-[600px]:gap-8 max-[600px]:py-[clamp(20px,3.5vh,40px)]">
          <h1 className="contents max-[1024px]:flex max-[1024px]:items-baseline max-[1024px]:justify-center max-[1024px]:gap-[.35em] max-[1024px]:whitespace-nowrap max-[1024px]:[grid-area:heading]">
            <span className="justify-self-end text-right text-[clamp(52px,6.2vw,96px)] font-semibold leading-none tracking-[-.04em] text-balance [grid-area:left-word] max-[1024px]:justify-self-center max-[1024px]:text-center max-[1024px]:text-[clamp(30px,6.8vw,48px)] max-[1024px]:leading-[1.1] max-[600px]:text-[clamp(28px,8.2vw,44px)]">{t("heroLeft")}</span>
            <span className="justify-self-start text-left text-[clamp(52px,6.2vw,96px)] font-semibold leading-none tracking-[-.04em] text-balance [grid-area:right-word] max-[1024px]:justify-self-center max-[1024px]:text-center max-[1024px]:text-[clamp(30px,6.8vw,48px)] max-[1024px]:leading-[1.1] max-[600px]:text-[clamp(28px,8.2vw,44px)]">{t("heroRight")}</span>
          </h1>
          <div className="flex justify-center [grid-area:qr] max-[1024px]:my-3 max-[600px]:my-3.5">
            <QrCodeShowcase />
          </div>
          <div className="mx-auto flex max-w-[44ch] flex-col items-center gap-5 text-center [grid-area:copy] max-[1024px]:max-w-[36ch]">
            <p className="whitespace-pre-line text-lg leading-normal max-[600px]:text-[15px]">{t("heroSummary")}</p>
            <RegisterCta />
          </div>
        </section>
      </div>

      <section className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] py-[clamp(72px,9vw,128px)]">
        <div className="mb-14 flex justify-center text-center max-[900px]:mb-10">
          <h2 id="ablauf" className="scroll-mt-8 whitespace-pre-line text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("flowTitle")}</h2>
        </div>
        <div className="mx-auto grid max-w-[800px] grid-cols-2 items-start gap-x-12 gap-y-[clamp(56px,7vw,84px)] max-[900px]:gap-x-9 max-[900px]:gap-y-12 max-[680px]:grid-cols-1 max-[680px]:gap-y-14">
          {(["Scan", "Pay", "Kitchen"] as const).map((step, index) => (
            <article
              className={`flex w-full min-w-0 flex-col items-center ${
                step === "Kitchen"
                  ? "col-span-full mx-auto max-w-[800px] max-[680px]:col-span-1"
                  : step === "Scan"
                    ? "max-w-[290px] mx-auto md:max-w-[285px] md:justify-self-start md:mx-0"
                    : "max-w-[290px] mx-auto md:max-w-[285px] md:justify-self-end md:mx-0"
              }`}
              key={step}
            >
              <ProductDemo screen={step} />
              <div
                className={`flex items-start justify-center mt-6 md:mt-8 shrink-0 w-full ${
                  step === "Kitchen"
                    ? "max-w-[800px] mx-auto"
                    : "max-w-[285px] max-[600px]:max-w-[270px] mx-auto"
                }`}
              >
                <div className="flex items-start gap-3 w-fit text-left">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-inter text-sm font-semibold text-primary-foreground tabular-nums" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div
                    className={`flex flex-col items-start text-left w-fit ${
                      step === "Kitchen"
                        ? "max-w-[215px] md:max-w-[420px]"
                        : "max-w-[215px]"
                    }`}
                  >
                    <h3 className="text-left text-lg font-semibold leading-[1.4] tracking-[-.02em]">{t(`flow${step}`)}</h3>
                    <p className="mt-1.5 text-left text-sm leading-relaxed text-muted-foreground">
                      {t(`flow${step}Text`)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] mx-auto border-t border-border" />

      <section className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] py-[clamp(72px,9vw,128px)]">
        <div className="grid grid-cols-2 gap-24 max-[1100px]:gap-12 max-[600px]:grid-cols-1 max-[600px]:gap-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="whitespace-pre-line text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("setupTitle")}</h2>
            <p className="mx-auto mt-6 max-w-[38ch] text-[15px] leading-relaxed text-muted-foreground">{t("setupNote")}</p>
          </div>
          <ol className="flex w-full max-w-[340px] flex-col items-start self-center mx-auto">
            {steps.map((step, index) => (
              <li key={step} className="flex w-full items-center gap-4 border-b border-border py-7 text-left first:pt-0 last:border-0 last:pb-0">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-inter text-sm font-semibold text-primary-foreground tabular-nums">{index + 1}</span>
                <h3 className="text-lg font-semibold leading-[1.4] tracking-[-.02em] text-balance">{t(step)}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="w-full relative bg-[#e7e7e7] bg-[url('/hero-stone-bg.webp')] bg-cover bg-center border-y border-[var(--site-line)] overflow-hidden">
        <section className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] grid grid-cols-2 gap-24 py-[clamp(72px,9vw,128px)] max-[1100px]:gap-12 max-[600px]:grid-cols-1 max-[600px]:gap-10">
          <div className="flex flex-col items-start justify-center text-left">
            <h2 className="whitespace-pre-line text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("benefitTitle")}</h2>
            <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-black/75">{t("benefitService")}</p>
          </div>
          <div className="flex flex-col items-start justify-center text-left self-center">
            <p className="text-[15px] text-black/75">{t("benefitPrefix")}</p>
            <AnimatedBenefitStat target={30} unit="%" className="text-left" />
            <h3 className="text-lg font-semibold leading-[1.4] tracking-[-.02em]">{t("benefitMetric")}</h3>
            <a
              href={t("benefitSourceUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-start text-left text-[15px] text-black/75 transition-colors hover:text-foreground underline underline-offset-4 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("benefitSource")}
            </a>
          </div>
        </section>

        <div className="w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] mx-auto border-t border-black/20" />

        <section className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] grid grid-cols-2 gap-24 py-[clamp(72px,9vw,128px)] max-[1100px]:gap-12 max-[600px]:grid-cols-1 max-[600px]:gap-10">
          <div className="flex flex-col items-start justify-center text-left">
            <h2 id="kosten" className="scroll-mt-8 whitespace-pre-line text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("feeTitle")}</h2>
            <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-black/75">{t("feePromise")}</p>
          </div>
          <div className="flex flex-col items-start justify-center text-left self-center">
            <div className="flex flex-col items-start text-left gap-1.5 sm:gap-2">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("feeNoSetup")}
              </p>
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("feeNoMonthly")}
              </p>
            </div>
            <div className="mt-5 sm:mt-6 flex flex-col items-start text-left">
              <p className="text-base font-medium sm:text-lg">
                <span className="font-inter tabular-nums">{t("feeNumber")}</span>
                <span>{t("feeUnit")}</span>
                {" "}
                <span>{t("feeLabel")}</span>
              </p>
              <p className="mt-1.5 text-left text-[15px] text-black/75">
                {t("feeNote")}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] grid grid-cols-2 gap-24 py-[clamp(72px,9vw,128px)] max-[1100px]:gap-12 max-[600px]:grid-cols-1 max-[600px]:gap-10">
        <h2 id="faq" className="scroll-mt-8 text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("faqTitle")}</h2>
        <div>
          {questions.map((question) => (
            <details key={question} className="group border-b border-border first:border-t">
              <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                {t(question)}
                <Plus size={18} aria-hidden="true" className="shrink-0 transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none" />
              </summary>
              <p className="pr-[30px] pb-6 text-sm leading-relaxed text-muted-foreground">{numericText(t(`${question}Answer`))}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border bg-background py-14 sm:py-18">
        <div className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-[520px]">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {t("newsletterSectionTitle")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("newsletterSectionDesc")}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <NewsletterForm showHeader={false} />
          </div>
        </div>
      </section>

      <SiteFooter variant="full" />
    </main>
  );
}
