"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ReactElement, ReactNode } from "react";
import { Button } from "./button";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel: string;
  trigger?: ReactElement;
  children: ReactNode;
  footer?: ReactNode;
  sheet?: boolean;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  trigger,
  children,
  footer,
  sheet,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Backdrop className="zk-modal-backdrop" />
        <Dialog.Popup className={`zk-modal ${sheet ? "zk-modal-sheet" : ""}`}>
          <header className="zk-modal-header">
            <div>
              <Dialog.Title className="zk-modal-title">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="zk-supporting">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              render={
                <Button variant="ghost" iconOnly aria-label={closeLabel} />
              }
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="zk-modal-body">{children}</div>
          {footer && <footer className="zk-modal-footer">{footer}</footer>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
