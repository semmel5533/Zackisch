import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold text-sm transition-colors duration-150 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE] focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-[#161616] text-white hover:bg-[#252525] active:bg-[#0A0A0A] border border-[#161616] shadow-xs",
        secondary: "bg-white text-[#161616] border border-[#C4C4C4] hover:bg-[#F2F2F2] active:bg-[#EAEAEA] shadow-xs",
        outline: "bg-transparent text-[#161616] border border-[#C4C4C4] hover:bg-[#F2F2F2]",
        ghost: "bg-transparent text-[#161616] hover:bg-[#F2F2F2] active:bg-[#EAEAEA]",
        tertiary: "bg-transparent text-[#161616] hover:bg-[#F2F2F2] active:bg-[#EAEAEA]",
        destructive: "bg-[#B42318] text-white hover:bg-[#982016] border border-[#B42318] shadow-xs",
        link: "bg-transparent text-[#161616] hover:underline underline-offset-4 p-0 h-auto active:scale-100",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-full gap-1.5 min-h-[36px]",
        default: "h-11 px-5 text-sm rounded-full gap-2 min-h-[44px]",
        md: "h-11 px-5 text-sm rounded-full gap-2 min-h-[44px]",
        lg: "h-12 px-6 text-base rounded-full gap-2.5 min-h-[48px]",
        icon: "size-11 rounded-full p-0 flex items-center justify-center min-h-[44px] min-w-[44px]",
        iconSm: "size-9 rounded-full p-0 flex items-center justify-center min-h-[36px] min-w-[36px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  busy?: boolean;
  busyText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, busy, busyText, children, disabled, type = "button", ...props }, ref) => {
    const isBusy = Boolean(isLoading || busy);
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isBusy ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{busyText ?? children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
