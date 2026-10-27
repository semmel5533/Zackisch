"use client";

import { useId } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { WarningCircle, CheckCircle, Info } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  href?: string;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  iconOnly,
  href,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const normalizedVariant = variant === "danger" ? "destructive" : variant;
  const classes = `zk-button zk-button-${normalizedVariant} zk-button-${size} ${fullWidth ? "zk-full-width" : ""} ${iconOnly ? "zk-icon-button" : ""} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <BaseButton
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {children}
    </BaseButton>
  );
}

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted";
  padding?: "none" | "sm" | "md" | "lg" | number;
  onClick?: () => void;
}) {
  const padClass =
    typeof padding === "number"
      ? padding === 0
        ? "none"
        : padding <= 3
          ? "sm"
          : padding === 4
            ? "md"
            : "lg"
      : padding;
  return (
    <div
      onClick={onClick}
      className={`zk-card zk-card-${variant} zk-card-pad-${padClass} ${onClick ? "cursor-pointer hover:border-[var(--zk-border-strong)] transition-colors" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  label,
  icon,
  variant = "neutral",
  className = "",
}: {
  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "neutral" | "info" | "success" | "warning" | "error";
  className?: string;
}) {
  return (
    <span className={`zk-badge zk-badge-${variant} ${className}`}>
      {icon}
      {children ?? label}
    </span>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`zk-divider ${className}`} />;
}

export function Banner({
  status = "info",
  title,
  description,
  children,
  className = "",
}: {
  status?: "info" | "success" | "warning" | "error";
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={`zk-banner zk-banner-${status} ${className}`}
    >
      <span className="zk-banner-icon" aria-hidden="true">
        {status === "error" || status === "warning" ? (
          <WarningCircle size={18} weight="bold" />
        ) : status === "success" ? (
          <CheckCircle size={18} weight="bold" />
        ) : (
          <Info size={18} weight="bold" />
        )}
      </span>
      <div className="zk-banner-content">
        {title && <div className="zk-banner-title">{title}</div>}
        {description && <div className="zk-banner-desc">{description}</div>}
        {children}
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  readOnly,
  hideLabel,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "search";
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  hideLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className="zk-field">
      <label className={hideLabel ? "sr-only" : "zk-label"} htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className="zk-input"
      />
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="zk-field">
      <label className="zk-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="zk-textarea"
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  const id = useId();
  return (
    <div className="zk-field">
      <label className="zk-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="zk-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
