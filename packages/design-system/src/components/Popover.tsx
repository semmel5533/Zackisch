import React from "react";
import { Popover as BasePopover, Tooltip as BaseTooltip } from "@base-ui/react";
import { cn } from "../utils/cn";

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Close: BasePopover.Close,
  Popup: function PopoverPopup({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BasePopover.Popup>) {
    return (
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8}>
          <BasePopover.Popup
            className={cn(
              "z-50 min-w-[200px] rounded-2xl bg-white border border-[#D6DED7] p-4 shadow-lg text-sm text-[#1A2721] focus:outline-none animate-in fade-in-0 zoom-in-95",
              className
            )}
            {...props}
          >
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    );
  },
};

export const Tooltip = {
  Provider: BaseTooltip.Provider,
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Popup: function TooltipPopup({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseTooltip.Popup>) {
    return (
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={6}>
          <BaseTooltip.Popup
            className={cn(
              "z-50 rounded-lg bg-[#192C25] text-white px-2.5 py-1 text-[11px] font-medium shadow-md animate-in fade-in-0",
              className
            )}
            {...props}
          >
            {children}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    );
  },
};
