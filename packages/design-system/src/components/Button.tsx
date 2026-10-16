import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold text-sm transition-colors duration-150 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E66B5] focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-[#173C2B] text-white hover:bg-[#245740] shadow-xs",
        secondary: "bg-white text-[#1A2721] border border-[#D6DED7] hover:bg-[#F7F5EF] shadow-xs",
        outline: "bg-transparent text-[#1A2721] border border-[#D6DED7] hover:bg-[#F7F5EF]",
        ghost: "bg-transparent text-[#1A2721] hover:bg-[#F7F5EF]",
        destructive: "bg-[#B42318] text-white hover:bg-[#911C13] shadow-xs",
        link: "bg-transparent text-[#173C2B] hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-full gap-1.5",
        default: "h-11 px-5 text-sm rounded-full gap-2",
        lg: "h-12 px-6 text-base rounded-full gap-2.5",
        icon: "size-10 rounded-full p-0 flex items-center justify-center",
        iconSm: "size-8 rounded-full p-0 flex items-center justify-center",
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
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
