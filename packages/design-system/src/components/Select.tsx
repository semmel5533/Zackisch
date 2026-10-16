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
            "w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white text-sm text-[#1A2721] transition-colors duration-150 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E66B5] focus:border-[#1E66B5] disabled:cursor-not-allowed disabled:bg-[#F7F5EF] disabled:text-[#8D9B92]",
            hasError ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#D6DED7]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#53665B]">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
          "w-full h-11 px-3.5 rounded-xl border border-[#D6DED7] bg-white text-sm text-[#1A2721] flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E66B5]",
          className
        )}
        {...props}
      >
        {children}
        <BaseSelect.Icon className="text-[#53665B]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              "z-50 min-w-[var(--anchor-width)] max-h-60 overflow-y-auto rounded-2xl bg-white border border-[#D6DED7] p-1.5 shadow-lg text-sm text-[#1A2721] focus:outline-none",
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
          "px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors duration-150 data-[highlighted]:bg-[#F7F5EF] data-[selected]:bg-[#DCEFE5] data-[selected]:text-[#173C2B] data-[selected]:font-semibold flex items-center justify-between outline-none",
          className
        )}
        {...props}
      >
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
        <BaseSelect.ItemIndicator>
          <svg className="w-3.5 h-3.5 text-[#173C2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    );
  },
};
