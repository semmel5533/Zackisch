"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { RegisterCta } from "./RegisterCta";
import { RegionLanguageModal } from "./RegionLanguageModal";

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
        <footer className="site-footer">
          <div className="page-width flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pt-10 md:pt-14">
            <div className="footer-mascot justify-self-start flex items-end mt-8 md:mt-16 mb-[-110px] order-2 md:order-1">
              <img
                className="closing-mascot w-[clamp(260px,24vw,360px)] h-auto object-contain block"
                src="/icon.svg"
                alt=""
                aria-hidden="true"
                width="420"
                height="420"
              />
            </div>
            <div className="footer-bottom flex flex-col items-end self-end gap-3 py-7 max-md:pt-4 max-md:pb-0 order-1 md:order-2">
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
                type="button"
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
      </>
    );
  }

  return (
    <>
      <footer className="site-footer">
        <div className="page-width footer-container">
          <div className="footer-closing-title text-left">
            <h2>{t("closingTitle")}</h2>
          </div>
          <div className="footer-closing-cta flex items-center">
            <RegisterCta />
          </div>
          <div className="footer-contact flex flex-col items-end text-right justify-self-end gap-2 pt-2 max-md:pt-0">
            <h3 className="contact-label text-2xl font-medium m-0 leading-[1.1]">{t("contactLabel")}</h3>
            <a
              className="inline-block text-[clamp(24px,3.8vw,46px)] max-md:text-[clamp(26px,7.8vw,36px)] tracking-tight leading-[1.1] text-right"
              href={t("contactUrl")}
            >
              <span className="link-label">{t("contactEmail")}</span>
            </a>
          </div>
          <div className="footer-mars justify-self-end flex justify-end">
            <a
              className="inline-flex items-center justify-end gap-1.5 text-[13px] text-[var(--site-muted)] whitespace-nowrap group hover:text-white transition-colors"
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
              type="button"
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
    </>
  );
}
