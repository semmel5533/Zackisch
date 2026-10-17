import React, { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "../utils/cn";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  "aria-label": string;
  size?: "sm" | "default" | "lg";
}

/**
 * Accessible Icon Button
 * Enforces `aria-label` for screen reader accessibility and minimum 44px touch target.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "default", "aria-label": ariaLabel, children, ...props }, ref) => {
    const sizeMap = {
      sm: "iconSm" as const,
      default: "icon" as const,
      lg: "icon" as const,
    };

    return (
      <Button
        ref={ref}
        size={sizeMap[size]}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn("shrink-0", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
