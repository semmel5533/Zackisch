"use client";

import React, { useId } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { WarningCircle, CheckCircle, Info, X } from "@phosphor-icons/react";
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

export function StatusDot({
  variant = "neutral",
  label,
}: {
  variant?: "neutral" | "success" | "warning" | "error" | "info";
  label?: string;
}) {
  const colorClass =
    variant === "success"
      ? "bg-[var(--zk-success-text)]"
      : variant === "warning"
        ? "bg-[var(--zk-warning-text)]"
        : variant === "error"
          ? "bg-[var(--zk-error-text)]"
          : variant === "info"
            ? "bg-[var(--zk-link)]"
            : "bg-[var(--zk-text-secondary)]";
  return (
    <span
      className={`inline-block size-2.5 rounded-full shrink-0 ${colorClass}`}
      aria-label={label}
      title={label}
    />
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`zk-divider ${className}`} />;
}

export function Spinner({
  size = "md",
  label = "Laden...",
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const dim = size === "sm" ? 16 : size === "lg" ? 32 : 24;
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-2 text-sm text-[var(--zk-text-secondary)]"
    >
      <span
        className="zk-spinner"
        style={{ width: dim, height: dim }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
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
  description,
  error,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "search" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  hideLabel?: boolean;
  description?: string;
  error?: string;
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
        aria-invalid={error ? "true" : undefined}
        className="zk-input"
      />
      {description && <p className="zk-supporting !mt-1">{description}</p>}
      {error && <p className="zk-field-error">{error}</p>}
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
  hideLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hideLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className="zk-field">
      <label className={hideLabel ? "sr-only" : "zk-label"} htmlFor={id}>
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
  disabled,
  hideLabel,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`zk-field ${className}`}>
      <label className={hideLabel ? "sr-only" : "zk-label"} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
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

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="zk-checkbox-label text-sm text-[var(--zk-text)]">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-[var(--zk-border-strong)] accent-[var(--zk-action)]"
      />
      <span>{label}</span>
    </label>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="zk-switch-row">
      <span className="zk-label">{label}</span>
      <BaseSwitch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
        className="zk-switch"
      >
        <BaseSwitch.Thumb className="zk-switch-thumb" />
      </BaseSwitch.Root>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: React.ReactNode; disabled?: boolean }[];
}) {
  return (
    <div role="radiogroup" aria-label={label} className="zk-tabs-list">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={`zk-tab-trigger ${selected ? "bg-[var(--zk-surface)] text-[var(--zk-text)] shadow-xs" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs({
  value,
  onChange,
  items,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: React.ReactNode; badge?: React.ReactNode }[];
  children?: React.ReactNode;
}) {
  return (
    <BaseTabs.Root
      value={value}
      onValueChange={(val) => onChange(String(val))}
      className="zk-tabs"
    >
      <BaseTabs.List className="zk-tabs-list">
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} value={item.value} className="zk-tab-trigger">
            <span>{item.label}</span>
            {item.badge !== undefined && <span className="zk-tab-badge">{item.badge}</span>}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  );
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel = "Schließen",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel?: string;
}) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="zk-modal-backdrop" />
        <BaseDialog.Popup className="zk-modal zk-modal-sheet">
          <div className="zk-modal-header">
            <div>
              <BaseDialog.Title className="zk-modal-title">{title}</BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="zk-supporting">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close
              aria-label={closeLabel}
              className="zk-button zk-button-ghost zk-icon-button"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </BaseDialog.Close>
          </div>
          <div className="zk-modal-body">{children}</div>
          {footer && <div className="zk-modal-footer">{footer}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
