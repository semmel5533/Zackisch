"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { WebsiteLink } from "./section-navigation";
import { formatCopy } from "./website-home";
import {
  Globe,
  Check,
  Plus,
  X,
  List,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import type { Copy, Locale } from "@/lib/content";

export function Faq({ items }: { items: Copy["faqs"] }) {
  return (
    <Accordion.Root className="faq-list">
      {items.map((item) => (
        <Accordion.Item key={item.question} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              <span>{formatCopy(item.question)}</span>
              <Plus aria-hidden="true" size={20} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="faq-panel">
            <p>{formatCopy(item.answer)}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export function MobileNavigation({
  copy,
  links,
  locale,
  slug,
  helpHref,
  loginHref,
}: {
  copy: Copy;
  locale: Locale;
  slug: string;
  links: { href: string; label: string }[];
  helpHref: string;
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);
  const pendingNavigation = useRef<(() => void) | null>(null);
  const followingSection = useRef(false);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1250px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) followingSection.current = false;
        setOpen(isOpen);
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          const follow = pendingNavigation.current;
          pendingNavigation.current = null;
          if (follow) requestAnimationFrame(follow);
        }
      }}
    >
      <Dialog.Trigger
        className="button button-secondary mobile-menu"
        aria-label={copy.menu}
      >
        <List size={24} aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup
          className="mobile-navigation"
          finalFocus={() => !followingSection.current}
        >
          <Dialog.Title className="visually-hidden">
            {copy.navigation}
          </Dialog.Title>
          <Dialog.Close
            className="dialog-icon-close drawer-close"
            aria-label={copy.close}
          >
            <X size={24} aria-hidden />
          </Dialog.Close>
          <nav aria-label={copy.navLabel}>
            {links.map((link) => (
              <WebsiteLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                deferNavigation={(follow) => {
                  followingSection.current = true;
                  pendingNavigation.current = follow;
                  setOpen(false);
                }}
              >
                {link.label}
              </WebsiteLink>
            ))}
          </nav>
          <div className="mobile-actions">
            <WebsiteLink
              className="button button-secondary mobile-help"
              href={helpHref}
              onClick={() => setOpen(false)}
            >
              {copy.nav[3]}
            </WebsiteLink>
            <RegionLanguage
              copy={copy}
              locale={locale}
              slug={slug}
              onSelect={() => setOpen(false)}
            />
            <WebsiteLink
              className="button button-primary mobile-login"
              href={loginHref}
              onClick={() => setOpen(false)}
            >
              {copy.login}
            </WebsiteLink>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PrivacySettings({ copy }: { copy: Copy }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-button">
        {copy.privacySettings}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup">
          <Dialog.Title className="dialog-title">
            {copy.privacyTitle}
          </Dialog.Title>
          <Dialog.Description>{copy.privacyText}</Dialog.Description>
          <Dialog.Close className="button button-primary">
            {copy.dismiss}
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const regions = [
  { locale: "de-de", country: "Deutschland", language: "Deutsch", lang: "de" },
  { locale: "de-en", country: "Germany", language: "English", lang: "en" },
] as const;

export function RegionLanguage({
  copy,
  locale,
  slug = "",
  onSelect,
}: {
  onSelect?: () => void;
  copy: Copy;
  locale: Locale;
  slug?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = regions.find((option) => option.locale === locale)!;
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="region-trigger"
        aria-label={`${copy.localeTitle}: ${selected.country}`}
      >
        <Globe size={20} aria-hidden />
        <span className="region-country">{selected.country}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop locale-backdrop" />
        <Dialog.Popup className="dialog-popup locale-dialog">
          <div className="locale-dialog-heading">
            <Dialog.Title className="dialog-title">
              {copy.localeTitle}
            </Dialog.Title>
            <Dialog.Close
              className="dialog-icon-close"
              aria-label={copy.dismiss}
            >
              <X size={24} aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Description>{copy.localeDescription}</Dialog.Description>
          <nav className="locale-options" aria-label={copy.localeTitle}>
            {regions.map((option) => (
              <Link
                key={option.locale}
                onClick={() => {
                  setOpen(false);
                  onSelect?.();
                }}
                href={`/${option.locale}${slug ? `/${slug}` : ""}`}
                hrefLang={`${option.lang}-DE`}
                lang={option.lang}
                className="locale-option page-link"
                aria-current={locale === option.locale ? "page" : undefined}
              >
                <span className="region-label">
                  <span>{option.country}</span>
                  <span>{option.language}</span>
                </span>
                {locale === option.locale ? (
                  <Check size={20} aria-hidden />
                ) : (
                  <ArrowUpRight
                    className="navigation-arrow"
                    size={18}
                    aria-hidden
                  />
                )}
              </Link>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
