import React, { useId, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface CompoundFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  helperAction?: React.ReactNode;
  isRequired?: boolean;
}

export interface FieldContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Field = forwardRef<HTMLInputElement, CompoundFieldProps & FieldContainerProps>(
  (
    {
      id,
      label,
      hint,
      error,
      helperAction,
      required,
      isRequired,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy =
      [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;

    const isReq = required || isRequired;

    // If used as compound input field with a label prop
    if (label) {
      return (
        <div className={cn("grid gap-1.5 w-full", className)}>
          <label className="text-xs font-semibold text-[#161616] select-none" htmlFor={inputId}>
            {label}
            {isReq && (
              <span className="text-[#B42318] ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          <input
            {...props}
            id={inputId}
            ref={ref}
            required={isReq}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describedBy}
            className="w-full h-11 px-3.5 rounded-xl border border-[#C4C4C4] bg-white text-sm text-[#161616] placeholder:text-[#6A6A6A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2359CE] focus:border-[#2359CE] disabled:cursor-not-allowed disabled:bg-[#F7F7F7] disabled:text-[#959595]"
          />
          {hint && (
            <small className="text-xs text-[#525252] leading-normal" id={hintId}>
              {hint}
            </small>
          )}
          {error && (
            <p role="alert" className="text-xs font-medium text-[#B42318] leading-tight" id={errorId}>
              {error}
            </p>
          )}
          {helperAction}
        </div>
      );
    }

    // Default container behavior when used with subcomponents
    return (
      <div className={cn("space-y-1.5 w-full", className)} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }
);

Field.displayName = "Field";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

export function Label({ className, isRequired, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold text-[#161616] select-none",
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
    <p className={cn("text-xs text-[#525252] leading-normal", className)} {...props}>
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
