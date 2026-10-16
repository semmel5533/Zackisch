import React, { forwardRef } from "react";
import { cn } from "../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", hasError, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError ? true : undefined}
        className={cn(
          "w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-[#161616] placeholder:text-[#6A6A6A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2359CE] focus:border-[#2359CE] disabled:cursor-not-allowed disabled:bg-[#F7F7F7] disabled:text-[#959595]",
          hasError ? "border-[#B42318] focus:ring-[#B42318] focus:border-[#B42318]" : "border-[#C4C4C4]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
