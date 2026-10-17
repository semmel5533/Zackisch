import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold text-xs rounded-full px-2.5 py-0.5 select-none transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-[#F2F2F2] text-[#161616] border-[#E0E0E0]",
        neutral: "bg-[#F2F2F2] text-[#161616] border-[#E0E0E0]",
        positive: "bg-[#EAF7F0] text-[#12744B] border-[#A3D9BD]",
        success: "bg-[#EAF7F0] text-[#12744B] border-[#A3D9BD]",
        attention: "bg-[#FFF6E5] text-[#8B5D08] border-[#F5D699]",
        warning: "bg-[#FFF6E5] text-[#8B5D08] border-[#F5D699]",
        negative: "bg-[#FFF1EF] text-[#B42318] border-[#FECDCA]",
        danger: "bg-[#FFF1EF] text-[#B42318] border-[#FECDCA]",
        critical: "bg-[#FFF1EF] text-[#B42318] border-[#FECDCA]",
        info: "bg-[#EDF4FF] text-[#225CB0] border-[#BFDBFE]",
        pending: "bg-[#FFF6E5] text-[#8B5D08] border-[#F5D699]",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5",
        default: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {children}
    </span>
  );
}

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}

/**
 * StatusBadge with visible non-color bullet indicator for accessibility
 */
export function StatusBadge({ tone = "neutral", className, children, ...props }: StatusBadgeProps) {
  const toneToVariant = {
    neutral: "neutral" as const,
    success: "positive" as const,
    warning: "attention" as const,
    danger: "negative" as const,
    info: "info" as const,
  };

  return (
    <span
      className={cn(badgeVariants({ variant: toneToVariant[tone], className }))}
      data-tone={tone}
      {...props}
    >
      <span aria-hidden="true" className="text-[8px] leading-none">●</span>
      <span>{children}</span>
    </span>
  );
}

export const alertVariants = cva(
  "p-4 rounded-2xl border text-sm flex items-start gap-3 w-full",
  {
    variants: {
      variant: {
        neutral: "bg-[#F2F2F2] border-[#E0E0E0] text-[#161616]",
        info: "bg-[#EDF4FF] border-[#BFDBFE] text-[#161616]",
        positive: "bg-[#EAF7F0] border-[#A3D9BD] text-[#161616]",
        attention: "bg-[#FFF6E5] border-[#F5D699] text-[#161616]",
        negative: "bg-[#FFF1EF] border-[#FECDCA] text-[#161616]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  title?: string;
}

export function Alert({
  className,
  variant,
  icon,
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role={variant === "negative" ? "alert" : "status"}
      className={cn(alertVariants({ variant, className }))}
      {...props}
    >
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="space-y-1 w-full">
        {title && <h4 className="font-semibold text-sm leading-snug text-[#0A0A0A]">{title}</h4>}
        <div className="text-xs leading-relaxed text-[#525252]">{children}</div>
      </div>
    </div>
  );
}
