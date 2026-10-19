"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegionLanguageModal } from "./RegionLanguageModal";
import { WaveLine } from "./WaveLine";

export function SiteFooter({
  variant = "full",
}: {
  variant?: "full" | "minimal";
}) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === "minimal") {
    return (
      <>
        <footer className="relative overflow-hidden bg-background pt-6 text-foreground sm:pt-8">
          <WaveLine className="w-[calc(100%-2*var(--site-gutter))] text-black max-w-[1200px] mx-auto mb-6" />
          <div className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="footer-mascot self-start md:self-auto flex items-end mb-[-85px] max-md:mb-[-65px] order-2 md:order-1">
              <img
                className="block h-auto w-[clamp(210px,18vw,270px)] object-contain brightness-0 max-md:w-[clamp(190px,46vw,240px)]"
                src="/brand_mark.svg"
                alt=""
                aria-hidden="true"
                width="420"
                height="420"
              />
            </div>
            <div className="footer-bottom flex flex-col items-end self-end gap-3 pb-7 max-md:pt-4 max-md:pb-0 order-1 md:order-2">
              <nav
                className="flex gap-6 max-md:gap-5 text-[13px] font-bold uppercase tracking-[0.08em] max-md:w-full max-md:justify-end max-md:flex-nowrap"
                aria-label={t("footerNavigation")}
              >
                {(
                  [
                    "legal",
                    "privacy",
                    "gtc",
                    "dataProcessing",
                    "accessibility",
                  ] as const
                ).map((key) => (
                  <Link
                    key={key}
                    href={t(`${key}Url`)}
                    className="group relative flex min-h-11 items-center max-md:justify-end max-md:whitespace-nowrap max-md:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    <span className="link-label relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
                      {t(`${key}Link`)}
                    </span>
                  </Link>
                ))}
                <a
                  href={t("supportUrl")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex min-h-11 items-center max-md:justify-end max-md:whitespace-nowrap max-md:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  <span className="link-label relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
                    {t("supportLink")}
                  </span>
                </a>
              </nav>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2.5 border-0 bg-transparent text-[13px] font-semibold leading-none text-inherit transition-opacity duration-150 hover:opacity-80 motion-reduce:transition-none cursor-pointer"
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
      </>
    );
  }

  const productLinks = [
    { href: t("flowUrl"), label: t("navFlow") },
    { href: t("pricingUrl"), label: t("navPricing") },
    { href: t("faqUrl"), label: t("navFaq") },
    { href: t("registerUrl"), label: t("registerCta"), external: true },
  ];
  const legalLinks = [
    { href: t("legalUrl"), label: t("legalLink") },
    { href: t("privacyUrl"), label: t("privacyLink") },
    { href: t("gtcUrl"), label: t("gtcLink") },
    { href: t("dataProcessingUrl"), label: t("dataProcessingLink") },
    { href: t("accessibilityUrl"), label: t("accessibilityLink") },
  ];

  return (
    <>
      <footer className="relative overflow-hidden bg-background text-foreground">
        <WaveLine className="w-[calc(100%-2*var(--site-gutter))] text-black max-w-[1200px] mx-auto mb-10 sm:mb-14" />
        <div className="mx-auto grid w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
          <div>
            <Link href={t("homeUrl")} className="inline-block" aria-label={t("logoAlt")}>
              <img src="/combination_mark.svg" width="122" height="40" alt={t("logoAlt")} loading="lazy" className="h-auto w-[122px]" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{t("footerTagline")}</p>
            <button
              type="button"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-[13px] font-semibold transition-colors hover:bg-muted motion-reduce:transition-none"
              onClick={() => setIsModalOpen(true)}
            >
              <Globe size={16} aria-hidden="true" />
              <span>{t("regionDisplay")}</span>
            </button>
          </div>
          <nav aria-label={t("footerProductTitle")}>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("footerProductTitle")}</h2>
            <ul className="mt-4 space-y-1">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-9 items-center gap-1 text-[15px] hover:underline hover:underline-offset-4">
                    {link.label}
                    {link.external && <ArrowUpRight size={14} aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("footerLegalTitle")}>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("footerLegalTitle")}</h2>
            <ul className="mt-4 space-y-1">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex min-h-9 items-center text-[15px] hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("footerHelpTitle")}>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("footerHelpTitle")}</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={t("supportUrl")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-[15px] hover:underline hover:underline-offset-4">
                  {t("supportLink")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={t("contactUrl")} className="inline-flex min-h-9 items-center text-[15px] hover:underline hover:underline-offset-4">
                  {t("contactEmail")}
                </a>
              </li>
              <li>
                <a href={t("marsUrl")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-[15px] text-muted-foreground hover:text-foreground">
                  {t("supportedBy")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex-wrap items-center justify-between gap-3 py-5 text-[13px] text-muted-foreground">
            <p>© {new Date().getFullYear()} Zackisch · {t("footerRights")}</p>
            <p className="tabular-nums">{t("feeRowBase")} · {t("feeRowTips")}</p>
          </div>
        </div>
      </footer>
      {isModalOpen && (
        <RegionLanguageModal isOpen onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
