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
          "w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-[#1A2721] placeholder:text-[#6C7B73] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1E66B5] focus:border-[#1E66B5] disabled:cursor-not-allowed disabled:bg-[#F7F5EF] disabled:text-[#8D9B92]",
          hasError ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#D6DED7]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
