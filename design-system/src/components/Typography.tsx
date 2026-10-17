import React from "react";
import { cn } from "../utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({
  level = 2,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as const;
  return (
    <Component
      className={cn(
        "font-semibold text-[#161616] tracking-tight",
        level === 1 && "text-3xl sm:text-5xl leading-[1.1] font-brand tracking-tight",
        level === 2 && "text-2xl sm:text-3xl leading-snug font-brand tracking-tight",
        level === 3 && "text-xl sm:text-2xl leading-snug",
        level === 4 && "text-lg sm:text-xl leading-normal",
        level === 5 && "text-base font-semibold leading-normal",
        level === 6 && "text-xs font-semibold leading-normal uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "base" | "large" | "small" | "muted" | "brand" | "strong";
}

export function Text({
  variant = "base",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(
        variant === "large" && "text-base sm:text-lg text-[#161616] leading-relaxed",
        variant === "base" && "text-sm text-[#161616] leading-normal",
        variant === "small" && "text-xs text-[#161616] leading-normal",
        variant === "muted" && "text-xs text-[#525252] leading-normal",
        variant === "brand" && "text-sm text-[#161616] font-semibold",
        variant === "strong" && "text-sm text-[#0A0A0A] font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
