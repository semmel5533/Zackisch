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
        "font-bold text-[#1A2721] tracking-tight",
        level === 1 && "text-2xl sm:text-4xl leading-tight font-brand",
        level === 2 && "text-xl sm:text-2xl leading-snug font-brand",
        level === 3 && "text-lg sm:text-xl leading-snug",
        level === 4 && "text-base sm:text-lg leading-normal",
        level === 5 && "text-sm font-semibold leading-normal",
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
  variant?: "base" | "large" | "small" | "muted" | "brand";
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
        variant === "large" && "text-base sm:text-lg text-[#1A2721] leading-relaxed",
        variant === "base" && "text-sm text-[#1A2721] leading-normal",
        variant === "small" && "text-xs text-[#1A2721] leading-normal",
        variant === "muted" && "text-xs text-[#53665B] leading-normal",
        variant === "brand" && "text-sm text-[#173C2B] font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
