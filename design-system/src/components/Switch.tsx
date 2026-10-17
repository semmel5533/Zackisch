import React from "react";
import { Switch as BaseSwitch } from "@base-ui/react";
import { cn } from "../utils/cn";

export interface SwitchProps
  extends React.ComponentProps<typeof BaseSwitch.Root> {
  label?: React.ReactNode;
}

export function Switch({ className, label, id, ...props }: SwitchProps) {
  const switchId = id || React.useId();
  return (
    <div className="inline-flex items-center gap-2.5">
      <BaseSwitch.Root
        id={switchId}
        className={cn(
          "w-11 h-6 rounded-full border border-transparent bg-[#C4C4C4] transition-colors duration-200 cursor-pointer p-0.5 inline-flex items-center data-[checked]:bg-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <BaseSwitch.Thumb className="size-5 rounded-full bg-white shadow-xs transition-transform duration-200 data-[checked]:translate-x-5" />
      </BaseSwitch.Root>
      {label && (
        <label
          htmlFor={switchId}
          className="text-xs font-semibold text-[#161616] cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
