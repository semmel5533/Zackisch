"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
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
        <footer className="relative overflow-hidden bg-background pt-6 text-foreground border-t border-border sm:pt-8">
          <WaveLine className="w-full text-foreground/30 max-w-[1200px] mx-auto mb-6" />
          <div className="mx-auto w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="footer-mascot justify-self-start flex items-end mb-[-85px] max-md:mb-[-65px] order-2 md:order-1">
              <img
                className="block h-auto w-[clamp(210px,18vw,270px)] object-contain brightness-0 max-md:w-[clamp(190px,46vw,240px)]"
                src="/icon.svg"
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
                {(["legal", "privacy", "gtc"] as const).map((key) => (
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

  return (
    <>
      <footer className="relative overflow-hidden bg-background pt-16 text-foreground border-t border-border sm:pt-20">
        <WaveLine className="w-full text-foreground/30 max-w-[1200px] mx-auto mb-10 sm:mb-14" />
        <div className="mx-auto grid w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] grid-cols-[1.15fr_.85fr] grid-rows-[auto_auto_1fr_auto] items-start gap-x-12 gap-y-7 [grid-template-areas:'title_.'_'cta_contact'_'mascot_mars'_'mascot_bottom'] max-[900px]:grid-cols-1 max-[900px]:grid-rows-none max-[900px]:gap-8 max-[900px]:[grid-template-areas:'title'_'cta'_'contact'_'mars'_'bottom'_'mascot']">
          <div className="text-left [grid-area:title]">
            <h2 className="whitespace-pre-line text-[clamp(32px,4vw,52px)] font-semibold leading-[1.17] tracking-[-.035em] text-balance">{t("closingTitle")}</h2>
          </div>
          <div className="flex items-center [grid-area:cta]">
            <RegisterCta />
          </div>
          <div className="flex flex-col items-end justify-self-end gap-2 pt-2 text-right [grid-area:contact] max-md:pt-0">
            <h3 className="m-0 text-2xl font-medium leading-[1.1]">{t("contactLabel")}</h3>
            <a
              className="inline-block text-right text-[clamp(24px,3.8vw,46px)] leading-[1.1] tracking-tight hover:underline hover:underline-offset-4 max-md:text-[clamp(26px,7.8vw,36px)]"
              href={t("contactUrl")}
            >
              <span className="link-label">{t("contactEmail")}</span>
            </a>
          </div>
          <div className="flex justify-end justify-self-end [grid-area:mars]">
            <a
              className="group inline-flex items-center justify-end gap-1.5 text-[13px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
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
              <ArrowUpRight
                size={14}
                className="shrink-0"
                aria-hidden="true"
              />
            </a>
          </div>
          <div className="flex items-end justify-self-start mt-[clamp(48px,6vw,96px)] mb-[-95px] [grid-area:mascot] max-md:mt-6 max-md:mb-[-65px]">
            <img
              className="block h-auto w-[clamp(260px,22vw,330px)] object-contain brightness-0 max-md:w-[clamp(200px,48vw,260px)]"
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width="420"
              height="420"
            />
          </div>
          <div className="flex flex-col items-end self-end gap-3 py-7 [grid-area:bottom] max-md:pt-4 max-md:pb-0">
            <nav
              className="flex gap-6 max-md:gap-5 text-[13px] font-bold uppercase tracking-[0.08em] max-md:w-full max-md:justify-end max-md:flex-nowrap"
              aria-label={t("footerNavigation")}
            >
              {(["legal", "privacy", "gtc"] as const).map((key) => (
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
