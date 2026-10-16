import React from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import { cn } from "../utils/cn";

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Portal: BaseDialog.Portal,
  Backdrop: function DialogBackdrop({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDialog.Backdrop>) {
    return (
      <BaseDialog.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0",
          className
        )}
        {...props}
      />
    );
  },
  Popup: function DialogPopup({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseDialog.Popup>) {
    return (
      <BaseDialog.Portal>
        <Dialog.Backdrop />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <BaseDialog.Popup
            className={cn(
              "w-full max-w-lg bg-white rounded-3xl border border-[#D6DED7] shadow-xl p-6 sm:p-8 space-y-5 transition-all duration-200 animate-in fade-in-0 zoom-in-95",
              className
            )}
            {...props}
          >
            {children}
          </BaseDialog.Popup>
        </div>
      </BaseDialog.Portal>
    );
  },
  Title: function DialogTitle({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDialog.Title>) {
    return (
      <BaseDialog.Title
        className={cn(
          "text-lg sm:text-xl font-bold text-[#1A2721] tracking-tight leading-snug",
          className
        )}
        {...props}
      />
    );
  },
  Description: function DialogDescription({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDialog.Description>) {
    return (
      <BaseDialog.Description
        className={cn("text-xs text-[#53665B] leading-relaxed", className)}
        {...props}
      />
    );
  },
};
