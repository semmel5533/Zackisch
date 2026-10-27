"use client";

import { useState, useId } from "react";
import { Input } from "@base-ui/react/input";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  Eye,
  EyeSlash,
  WarningCircle,
  CheckCircle,
  Info,
} from "@phosphor-icons/react";
import { Button } from "./button";

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  width,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted";
  padding?: "none" | "sm" | "md" | "lg" | number;
  elevation?: "none" | "low" | "medium" | "high";
  width?: string;
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
      style={width ? { width } : undefined}
      className={`zk-card zk-card-${variant} zk-card-pad-${padClass} ${className}`}
    >
      {children}
    </div>
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

export function Spinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = size === "sm" ? 16 : size === "lg" ? 32 : 24;
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: px, height: px }}
      className={`zk-spinner ${className}`}
    />
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete = "current-password",
  showLabel,
  hideLabel,
  rightHeader,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
  showLabel: string;
  hideLabel: string;
  rightHeader?: React.ReactNode;
  required?: boolean;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="zk-field">
      <div className="flex items-center justify-between gap-2">
        <label className="zk-label" htmlFor={id}>
          {label}
        </label>
        {rightHeader}
      </div>
      <div className="zk-password-group">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onValueChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="zk-input zk-password-input"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          iconOnly
          className="zk-password-toggle"
          aria-label={visible ? hideLabel : showLabel}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? (
            <EyeSlash size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </Button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="zk-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SwitchField({
  label,
  description,
  checked,
  onChange,
  onCheckedChange,
  disabled,
  hideLabel,
  className = "",
  "aria-label": ariaLabel,
}: {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const id = useId();
  const handleToggle = (next: boolean) => {
    onChange?.(next);
    onCheckedChange?.(next);
  };
  return (
    <div className={`zk-switch-row ${className}`}>
      {!hideLabel && (label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label htmlFor={id} className="zk-label cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-[var(--zk-text-secondary)]">
              {description}
            </span>
          )}
        </div>
      )}
      <BaseSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={disabled}
        aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
        className="zk-switch"
      >
        <BaseSwitch.Thumb className="zk-switch-thumb" />
      </BaseSwitch.Root>
    </div>
  );
}

export function Tabs({
  value,
  onValueChange,
  items,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (val: string) => void;
  items: { value: string; label: React.ReactNode; badge?: React.ReactNode }[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <BaseTabs.Root
      value={value}
      onValueChange={(val) => onValueChange(String(val))}
      className={`zk-tabs ${className}`}
    >
      <BaseTabs.List className="zk-tabs-list">
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            className="zk-tab-trigger"
          >
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge !== null && (
              <span className="zk-tab-badge">{item.badge}</span>
            )}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  );
}

export { BaseTabs };
