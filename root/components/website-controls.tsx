"use client";

import { useState } from "react";
import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import type { Copy } from "@/lib/content";

export function Faq({ items }: { items: Copy["faqs"] }) {
  return (
    <Accordion.Root className="faq-list">
      {items.map((item) => (
        <Accordion.Item key={item.question} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              {item.question}
              <span aria-hidden="true">+</span>
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
      <Dialog.Trigger className="button button-secondary mobile-menu">
        {copy.menu}
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
