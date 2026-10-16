import React from "react";
import { cn } from "../utils/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  detail?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  detail,
  description,
  action,
  icon,
  className,
  ...props
}: EmptyStateProps) {
  const text = detail ?? description;
  return (
    <div
      role="status"
      className={cn(
        "rounded-2xl border border-[#E0E0E0] bg-white p-8 text-center max-w-lg mx-auto shadow-xs",
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 inline-flex items-center justify-center text-[#525252]">{icon}</div>}
      <h3 className="text-lg font-semibold text-[#161616] tracking-tight">{title}</h3>
      {text && (
        <p className="mt-2 text-sm text-[#525252] leading-relaxed max-w-sm mx-auto">
          {text}
        </p>
      )}
      {action && <div className="mt-6 flex items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
