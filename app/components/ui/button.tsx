"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  iconOnly,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const normalizedVariant = variant === "danger" ? "destructive" : variant;
  return (
    <BaseButton
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`zk-button zk-button-${normalizedVariant} zk-button-${size} ${fullWidth ? "zk-full-width" : ""} ${iconOnly ? "zk-icon-button" : ""} ${className}`}
    >
      {children}
    </BaseButton>
  );
}
