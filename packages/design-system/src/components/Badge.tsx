import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold text-xs rounded-full px-2.5 py-0.5 select-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F0EFEA] text-[#1A2721] border border-[#D6DED7]",
        positive: "bg-[#DCEFE5] text-[#173C2B] border border-[#B2DEC8]",
        attention: "bg-[#FFF7EB] text-[#885200] border border-[#F5D699]",
        negative: "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]",
        info: "bg-[#EBF3FF] text-[#1E66B5] border border-[#BFDBFE]",
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

export const alertVariants = cva(
  "p-4 rounded-2xl border text-sm flex items-start gap-3 w-full",
  {
    variants: {
      variant: {
        info: "bg-[#F7F5EF] border-[#D6DED7] text-[#1A2721]",
        positive: "bg-[#EBF7EE] border-[#A6D5B8] text-[#17643B]",
        attention: "bg-[#FFF7EB] border-[#F5D699] text-[#885200]",
        negative: "bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]",
      },
    },
    defaultVariants: {
      variant: "info",
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
        {title && <h4 className="font-bold text-sm leading-snug">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-95">{children}</div>
      </div>
    </div>
  );
}
