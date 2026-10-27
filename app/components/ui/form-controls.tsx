"use client";

import { useId } from "react";
import { Input } from "@base-ui/react/input";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "@phosphor-icons/react";

export function TextField({
  label,
  value,
  onChange,
  onValueChange,
  onBlur,
  error,
  type = "text",
  placeholder,
  autoComplete,
  required,
  disabled,
  readOnly,
  description,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  type?: "text" | "email" | "password" | "number" | "url" | "tel";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  description?: string;
}) {
  const id = useId();
  const handleChange = (next: string) => {
    onChange?.(next);
    onValueChange?.(next);
  };
  return (
    <div className="zk-field">
      <label className="zk-label" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onValueChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className="zk-input"
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : description ? `${id}-desc` : undefined
        }
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-[var(--zk-text-secondary)]">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="zk-field-error guest-option-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  onValueChange,
  error,
  placeholder,
  rows = 3,
  maxLength,
  required,
  disabled,
  description,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}) {
  const id = useId();
  const handleChange = (next: string) => {
    onChange?.(next);
    onValueChange?.(next);
  };
  return (
    <div className="zk-field">
      <label className="zk-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        className="zk-textarea"
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : description ? `${id}-desc` : undefined
        }
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-[var(--zk-text-secondary)]">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="zk-field-error guest-option-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
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
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="zk-select"
        aria-invalid={!!error}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="zk-field-error guest-option-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  onCheckedChange,
  disabled,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const handleToggle = (next: boolean) => {
    onChange?.(next);
    onCheckedChange?.(next);
  };
  return (
    <label className="zk-checkbox-label">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={disabled}
        className="guest-option-checkbox"
      >
        <Checkbox.Indicator>
          <Check size={16} aria-hidden="true" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>{label}</span>
    </label>
  );
}
