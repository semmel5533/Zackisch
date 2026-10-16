import React, { forwardRef } from "react";
import { Select as BaseSelect } from "@base-ui/react";
import { cn } from "../utils/cn";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, hasError, disabled, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError ? true : undefined}
          className={cn(
            "w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white text-sm text-[#161616] transition-colors duration-150 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2359CE] focus:border-[#2359CE] disabled:cursor-not-allowed disabled:bg-[#F7F7F7] disabled:text-[#959595]",
            hasError ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#C4C4C4]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#525252]">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

NativeSelect.displayName = "NativeSelect";

export const Select = {
  Root: BaseSelect.Root,
  Trigger: function SelectTrigger({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseSelect.Trigger>) {
    return (
      <BaseSelect.Trigger
        className={cn(
          "w-full h-11 px-3.5 rounded-xl border border-[#C4C4C4] bg-white text-sm text-[#161616] flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE]",
          className
        )}
        {...props}
      >
        {children}
        <BaseSelect.Icon className="text-[#525252]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
    );
  },
  Value: BaseSelect.Value,
  Popup: function SelectPopup({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseSelect.Popup>) {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4}>
          <BaseSelect.Popup
            className={cn(
              "z-50 min-w-[var(--anchor-width)] max-h-60 overflow-y-auto rounded-2xl bg-white border border-[#E0E0E0] p-1.5 shadow-lg text-sm text-[#161616] focus:outline-none",
              className
            )}
            {...props}
          >
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
  Item: function SelectItem({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseSelect.Item>) {
    return (
      <BaseSelect.Item
        className={cn(
          "px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors duration-150 data-[highlighted]:bg-[#F2F2F2] data-[selected]:bg-[#161616] data-[selected]:text-white data-[selected]:font-semibold flex items-center justify-between outline-none",
          className
        )}
        {...props}
      >
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
        <BaseSelect.ItemIndicator>
          <svg className="w-3.5 h-3.5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    );
  },
};
