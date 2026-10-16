import React from "react";
import { Radio as BaseRadio, RadioGroup as BaseRadioGroup } from "@base-ui/react";
import { cn } from "../utils/cn";

export const RadioGroup = BaseRadioGroup;

export interface RadioProps
  extends React.ComponentProps<typeof BaseRadio.Root> {
  label?: React.ReactNode;
}

export function Radio({ className, label, id, ...props }: RadioProps) {
  const radioId = id || React.useId();
  return (
    <div className="inline-flex items-center gap-2.5">
      <BaseRadio.Root
        id={radioId}
        className={cn(
          "size-5 rounded-full border border-[#D6DED7] bg-white transition-colors duration-150 flex items-center justify-center cursor-pointer data-[checked]:border-[#173C2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E66B5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <BaseRadio.Indicator className="size-2.5 rounded-full bg-[#173C2B]" />
      </BaseRadio.Root>
      {label && (
        <label
          htmlFor={radioId}
          className="text-xs font-semibold text-[#1A2721] cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
