"use client";

import {
  Accordion,
  buttonVariants,
  resolveMediaAsset,
} from "@zackisch/design-system";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  DeviceTablet,
  Pause,
  QrCode,
  Receipt,
} from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { SiteFooter } from "./SiteFooter";
import { NewsletterForm } from "./NewsletterForm";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const questions = [
  "faqApp",
  "faqDevices",
  "faqPickup",
  "faqMenu",
  "faqUnavailable",
  "faqOptions",
  "faqPayment",
  "faqTips",
  "faqStart",
  "faqPos",
  "faqPayout",
  "faqContract",
  "faqCosts",
] as const;

const container =
  "mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px]";
const eyebrow =
  "text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const h2 =
  "font-poppins text-3xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-4xl";
const lead = "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg";

export function MainPage() {
  const { t, locale } = useTranslation();
  const shot = (name: "scan" | "pay" | "kitchen") =>
    `/product/${locale}-${name}.webp`;

  return (
    <main id="content" className="bg-background text-foreground">
      {/* 1 — Hero: one promise, one primary action (Hick), product proof beside copy (Proximity) */}
      <section className={cn(container, "grid items-center gap-12 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-16")}>
        <Reveal>
          <p className={eyebrow}>{t("heroEyebrow")}</p>
          <h1 className="mt-4 font-poppins text-4xl font-semibold leading-[1.06] tracking-tight text-balance sm:text-5xl xl:text-[4.25rem]">
            {t("heroHeading")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("heroSummary")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <RegisterCta size="lg" className="min-h-12 rounded-full px-7" />
            <a
              href={t("flowUrl")}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-12 rounded-full px-7",
              })}
            >
              {t("navFlow")}
              <ArrowRight size={16} aria-hidden="true" className="shrink-0" />
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[t("heroTrust1"), t("heroTrust2"), t("heroTrust3")].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check size={16} weight="bold" aria-hidden="true" className="text-foreground" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{t("guestAccessNote")}</p>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <figure className="col-span-1">
              <div className="phone-frame overflow-hidden rounded-[28px] bg-white">
                <img
                  src={shot("scan")}
                  alt={t("flowShot1Alt")}
                  width={600}
                  height={1200}
                  fetchPriority="high"
                  className="aspect-[9/16] w-full object-cover object-top"
                />
              </div>
            </figure>
            <div className="flex flex-col gap-4">
              <figure className="overflow-hidden rounded-[20px] border border-border">
                <img
                  src={resolveMediaAsset("guestPhoneTable", { site: "root" })}
                  alt={t("heroPhotoAlt")}
                  width={800}
                  height={600}
                  fetchPriority="high"
                  className="aspect-[4/3] w-full object-cover"
                />
              </figure>
              <div className="rounded-[20px] border border-border bg-card p-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                  <QrCode size={14} aria-hidden="true" />
                  {t("heroCardTable")}
                </p>
                <p className="mt-3 text-sm font-medium leading-snug">{t("heroCardOrder")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("guestAccessNote")}</p>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-muted-foreground">
            {t("heroDemoCaption")} · {t("illustrativePhoto")}
          </figcaption>
        </Reveal>
      </section>

      {/* 2 — Proof strip: three calm reasons, no invented metrics (Miller chunking) */}
      <section className="border-y border-border bg-muted/60">
        <div className={cn(container, "py-12 sm:py-14")}>
          <Reveal>
            <h2 className="max-w-3xl font-poppins text-2xl font-semibold leading-snug tracking-tight text-balance sm:text-3xl">
              {t("proofTitle")}
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {(
              [
                { icon: Receipt, title: "proof1Title", desc: "proof1Desc" },
                { icon: DeviceTablet, title: "proof2Title", desc: "proof2Desc" },
                { icon: Pause, title: "proof3Title", desc: "proof3Desc" },
              ] as const
            ).map(({ icon: Icon, title, desc }, i) => (
              <Reveal as="li" key={title} delay={i * 90}>
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-poppins text-lg font-semibold">{t(title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(desc)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — Flow: headline → explanation → real screens → one CTA (PayPal section rhythm) */}
      <section id="ablauf" className={cn(container, "scroll-mt-24 py-14 sm:py-20")}>
        <Reveal>
          <p className={eyebrow}>{t("flowEyebrow")}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:gap-16">
            <h2 className={h2}>{t("flowSubTitle")}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{t("flowSubDesc")}</p>
          </div>
        </Reveal>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {(
            [
              { role: "flowStep1Role", title: "flowStep1Title", desc: "flowStep1Desc", img: shot("scan"), alt: "flowShot1Alt" },
              { role: "flowStep2Role", title: "flowStep2Title", desc: "flowStep2Desc", img: shot("pay"), alt: "flowShot2Alt" },
              { role: "flowStep3Role", title: "flowStep3Title", desc: "flowStep3Desc", img: shot("kitchen"), alt: "flowShot3Alt" },
              { role: "flowStep4Role", title: "flowStep4Title", desc: "flowStep4Desc", img: null, alt: null },
            ] as const
          ).map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className="flex flex-col border-t-2 border-foreground pt-5">
              <p className="text-[13px] font-medium text-muted-foreground">{t(step.role)}</p>
              <h3 className="mt-2 font-poppins text-lg font-semibold">{t(step.title)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(step.desc)}</p>
              {step.img ? (
                <div className="phone-frame mt-5 overflow-hidden rounded-[20px] bg-white">
                  <img
                    src={step.img}
                    alt={t(step.alt)}
                    width={500}
                    height={900}
                    loading="lazy"
                    className="aspect-[9/14] w-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-[20px] border border-border bg-muted/60 p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Receipt size={18} aria-hidden="true" />
                    {t("flowStep4Title")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check size={15} weight="bold" aria-hidden="true" className="text-[#12744B]" />
                      {t("posCheck1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} weight="bold" aria-hidden="true" className="text-[#12744B]" />
                      {t("posCheck2")}
                    </li>
                  </ul>
                </div>
              )}
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 4 — POS band: dark inverse module, honest fiscal boundary */}
      <section className="band-inverse" data-dark-surface>
        <div className={cn(container, "grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16")}>
          <Reveal>
            <figure className="overflow-hidden rounded-[20px]">
              <img
                src={resolveMediaAsset("posCounter", { site: "root" })}
                alt={t("posPhotoAlt")}
                width={1200}
                height={900}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
            <p className="mt-3 text-xs text-white/60">{t("illustrativePhoto")}</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
              {t("posEyebrow")}
            </p>
            <h2 className="mt-4 font-poppins text-3xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-4xl">
              {t("posSepTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">{t("posSepText")}</p>
            <ul className="mt-6 space-y-3 text-[15px] text-white/85">
              {[t("posCheck1"), t("posCheck2"), t("posCheck3")].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={17} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">{t("posSepNote")}</p>
            <a
              href={t("supportUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-medium text-white underline underline-offset-4"
            >
              {t("supportLink")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* 5 — Setup: numbered editorial list beside real interior (Tesler: who does what) */}
      <section className={cn(container, "grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16")}>
        <Reveal>
          <p className={eyebrow}>{t("setupEyebrow")}</p>
          <h2 className="mt-4 font-poppins text-3xl font-semibold leading-[1.15] tracking-tight text-balance sm:text-4xl">
            {t("setupTitle")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{t("setupNote")}</p>
          <ol className="mt-8 divide-y divide-border border-y border-border">
            {(["setupFirst", "setupSecond", "setupThird"] as const).map((step, index) => (
              <li key={step} className="flex gap-5 py-5">
                <span className="font-poppins text-lg font-semibold tabular-nums" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="text-[15px] leading-relaxed">{t(step)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{t("setupStepNote")}</p>
          <RegisterCta className="mt-7 rounded-full" />
        </Reveal>
        <Reveal delay={100}>
          <figure className="overflow-hidden rounded-[20px] border border-border">
            <img
              src={resolveMediaAsset("restaurantInterior", { site: "root" })}
              alt={t("interiorPhotoAlt")}
              width={1200}
              height={900}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
          <p className="mt-3 text-xs text-muted-foreground">{t("illustrativePhoto")}</p>
        </Reveal>
      </section>

      {/* 6 — Pricing: one big number (Von Restorff), truth table below */}
      <section id="preise" className="band-warm border-y border-[#e9e6e2]">
        <div className={cn(container, "grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16")}>
          <Reveal>
            <p className={eyebrow}>{t("feeEyebrow")}</p>
            <h2 id="kosten" className={cn(h2, "mt-4 scroll-mt-24")}>
              {t("feeTitle")}
            </h2>
            <p className={lead}>{t("feePromise")}</p>
            <p className="mt-6 font-poppins text-7xl font-semibold tracking-tight tabular-nums sm:text-8xl">
              {t("feeNumber")}
              <span className="text-4xl align-top">{t("feeUnit")}</span>
            </p>
            <p className="mt-2 text-lg font-medium">{t("feeLabel")}</p>
          </Reveal>
          <Reveal delay={100} className="lg:pt-14">
            <dl className="divide-y divide-[#e9e6e2] border-y border-[#e9e6e2] bg-white/60">
              {(
                [
                  ["feeRowBase", true],
                  ["feeRowTips", false],
                  ["feeRowVat", false],
                  ["feeRowProvider", false],
                ] as const
              ).map(([key, strong]) => (
                <div key={key} className="flex items-start gap-3 px-5 py-4">
                  <Check
                    size={17}
                    weight="bold"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[#12744B]"
                  />
                  <dt className={strong ? "text-[15px] font-semibold" : "text-[15px] text-foreground/90"}>
                    {t(key)}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("feeNote")}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-medium">
              <li>{t("feeNoSetup")}</li>
              <li>{t("feeNoMonthly")}</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 7 — FAQ */}
      <section id="faq" className={cn(container, "grid scroll-mt-24 gap-8 py-14 sm:py-20 lg:grid-cols-3 lg:gap-16")}>
        <Reveal>
          <p className={eyebrow}>{t("faqEyebrow")}</p>
          <h2 className={cn(h2, "mt-4")}>{t("faqTitle")}</h2>
        </Reveal>
        <Reveal delay={80} className="lg:col-span-2">
          <Accordion.Root>
            {questions.map((question) => (
              <Accordion.Item key={question} value={question}>
                <Accordion.Trigger className="min-h-11 gap-5 rounded-sm text-left text-base">
                  {t(question)}
                </Accordion.Trigger>
                <Accordion.Panel className="text-[15px] leading-relaxed motion-reduce:transition-none">
                  {t(`${question}Answer`)}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </section>

      {/* 8 — Closing (Peak-End): what happens next, no pressure */}
      <section className="band-inverse" data-dark-surface>
        <div className={cn(container, "py-14 text-center sm:py-20")}>
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-poppins text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              {t("closingTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">{t("closingSub")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <RegisterCta
                variant="inverse"
                size="lg"
                className="min-h-12 rounded-full border-white/40 px-7 text-white hover:bg-white/10"
              />
              <a
                href={t("supportUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-7 text-[15px] font-medium text-white/85 underline underline-offset-4 hover:text-white"
              >
                {t("contactLabel")} {t("supportLink")}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <p className="mt-5 text-sm text-white/55">{t("closingNote")}</p>
          </Reveal>
        </div>
      </section>

      {/* 9 — Newsletter */}
      <section className="border-b border-border">
        <div className={cn(container, "grid gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16")}>
          <Reveal>
            <h2 className="font-poppins text-2xl font-semibold tracking-tight">{t("newsletterSectionTitle")}</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {t("newsletterSectionDesc")}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <NewsletterForm showHeader={false} />
          </Reveal>
        </div>
      </section>

      <SiteFooter variant="full" />
    </main>
  );
}
