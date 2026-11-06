"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Check, Plus, X, List } from "@phosphor-icons/react";
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
              {item.question}
              <Plus aria-hidden="true" size={20} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="faq-panel">
            <p>{item.answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export function MobileNavigation({
  copy,
  links,
}: {
  copy: Copy;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="button button-secondary mobile-menu"
        aria-label={copy.menu}
      >
        <List size={24} aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup mobile-navigation">
          <Dialog.Title className="dialog-title">
            {copy.navigation}
          </Dialog.Title>
          <nav aria-label={copy.navLabel}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Dialog.Close className="button button-secondary">
            {copy.close}
          </Dialog.Close>
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
}: {
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
        <Dialog.Backdrop className="dialog-backdrop" />
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
                onClick={() => setOpen(false)}
                href={`/${option.locale}${slug ? `/${slug}` : ""}`}
                hrefLang={`${option.lang}-DE`}
                lang={option.lang}
                className="locale-option"
                aria-current={locale === option.locale ? "page" : undefined}
              >
                <span className="region-label">
                  <span>{option.country}</span>
                  <span>{option.language}</span>
                </span>
                {locale === option.locale && <Check size={20} aria-hidden />}
              </Link>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
