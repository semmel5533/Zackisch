"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { X } from "@phosphor-icons/react";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogCloseButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { t } = useTranslation();
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0",
            className,
          )}
          {...props}
        />
      }
    >
      <X className="w-4 h-4" weight="bold" />
      <span className="sr-only">{t("close")}</span>
    </DialogPrimitive.Close>
  );
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-150 ease-out motion-reduce:transition-none motion-reduce:animate-none data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex flex-col w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-[20px] sm:rounded-[24px] bg-background text-foreground border border-border shadow-dialog overflow-hidden p-0 text-sm outline-none transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:animate-none data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 sm:top-5 sm:right-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer z-20"
                size="icon-sm"
              />
            }
          >
            <X className="w-4 h-4" weight="bold" />
            <span className="sr-only">{t("close")}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "px-5 sm:px-6 py-4 sm:py-5 border-b border-border bg-background shrink-0 text-left flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "px-5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 flex-1 overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "px-5 sm:px-6 py-3.5 sm:py-4 border-t border-border bg-background shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-11 rounded-full border-border text-foreground hover:bg-muted font-semibold cursor-pointer"
            />
          }
        >
          {t("close")}
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl font-bold tracking-tight text-foreground leading-tight",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-xs text-muted-foreground font-normal leading-relaxed mt-0.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
