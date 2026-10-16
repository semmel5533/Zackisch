import React, { forwardRef } from "react";
import { cn } from "../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError ? true : undefined}
        className={cn(
          "w-full min-h-[96px] p-3.5 rounded-xl border bg-white text-sm text-[#161616] placeholder:text-[#6A6A6A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2359CE] focus:border-[#2359CE] disabled:cursor-not-allowed disabled:bg-[#F7F7F7] disabled:text-[#959595]",
          hasError ? "border-[#B42318] focus:ring-[#B42318] focus:border-[#B42318]" : "border-[#C4C4C4]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
