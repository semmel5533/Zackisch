import React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react";
import { cn } from "../utils/cn";

export interface CheckboxProps
  extends React.ComponentProps<typeof BaseCheckbox.Root> {
  label?: React.ReactNode;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const checkboxId = id || React.useId();
  return (
    <div className="inline-flex items-center gap-2.5">
      <BaseCheckbox.Root
        id={checkboxId}
        className={cn(
          "size-5 rounded-md border border-[#D6DED7] bg-white transition-colors duration-150 flex items-center justify-center cursor-pointer data-[checked]:bg-[#173C2B] data-[checked]:border-[#173C2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E66B5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <BaseCheckbox.Indicator className="text-white">
          <svg
            className="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className="text-xs font-semibold text-[#1A2721] cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
