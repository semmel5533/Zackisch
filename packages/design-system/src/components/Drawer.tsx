import React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react";
import { cn } from "../utils/cn";

export const Drawer = {
  Root: BaseDrawer.Root,
  Trigger: BaseDrawer.Trigger,
  Close: BaseDrawer.Close,
  Backdrop: function DrawerBackdrop({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDrawer.Backdrop>) {
    return (
      <BaseDrawer.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0",
          className
        )}
        {...props}
      />
    );
  },
  Popup: function DrawerPopup({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseDrawer.Popup>) {
    return (
      <BaseDrawer.Portal>
        <Drawer.Backdrop />
        <BaseDrawer.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[90vh] bg-white rounded-t-3xl border-t border-[#E0E0E0] shadow-2xl p-6 sm:p-8 space-y-5 overflow-y-auto animate-in slide-in-from-bottom duration-200",
            className
          )}
          {...props}
        >
          <div className="mx-auto w-12 h-1.5 rounded-full bg-[#E0E0E0] mb-2" />
          {children}
        </BaseDrawer.Popup>
      </BaseDrawer.Portal>
    );
  },
  Title: function DrawerTitle({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDrawer.Title>) {
    return (
      <BaseDrawer.Title
        className={cn(
          "text-lg sm:text-xl font-semibold text-[#161616] tracking-tight leading-snug",
          className
        )}
        {...props}
      />
    );
  },
  Description: function DrawerDescription({
    className,
    ...props
  }: React.ComponentProps<typeof BaseDrawer.Description>) {
    return (
      <BaseDrawer.Description
        className={cn("text-xs sm:text-sm text-[#525252] leading-relaxed", className)}
        {...props}
      />
    );
  },
};
