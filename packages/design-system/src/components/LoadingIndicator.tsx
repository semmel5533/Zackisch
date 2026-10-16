import React from "react";
import { cn } from "../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[#E8EFE9]",
        className
      )}
      {...props}
    />
  );
}

export interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  label?: string;
}

export function LoadingIndicator({
  size = "default",
  label = "Wird geladen...",
  className,
  ...props
}: LoadingIndicatorProps) {
  const sizeClass = size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6";
  return (
    <div
      role="status"
      className={cn("inline-flex items-center gap-2.5 text-[#53665B]", className)}
      {...props}
    >
      <svg
        className={cn("animate-spin text-[#173C2B]", sizeClass)}
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
      {label && <span className="text-xs font-semibold">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
