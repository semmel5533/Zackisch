import React from "react";
import { cn } from "../utils/cn";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Field({ className, children, ...props }: FieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)} {...props}>
      {children}
    </div>
  );
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

export function Label({ className, isRequired, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold text-[#1A2721] select-none",
        className
      )}
      {...props}
    >
      {children}
      {isRequired && <span className="text-[#B42318] ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export interface FieldDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FieldDescription({
  className,
  children,
  ...props
}: FieldDescriptionProps) {
  return (
    <p className={cn("text-xs text-[#53665B] leading-normal", className)} {...props}>
      {children}
    </p>
  );
}

export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn("text-xs font-medium text-[#B42318] leading-tight", className)}
      {...props}
    >
      {children}
    </p>
  );
}
