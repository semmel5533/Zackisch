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
          "w-full min-h-[96px] p-3.5 rounded-xl border bg-white text-sm text-[#1A2721] placeholder:text-[#6C7B73] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1E66B5] focus:border-[#1E66B5] disabled:cursor-not-allowed disabled:bg-[#F7F5EF] disabled:text-[#8D9B92]",
          hasError ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#D6DED7]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
