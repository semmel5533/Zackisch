"use client";
import { useId } from "react";
import { Input } from "@base-ui/react/input";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "@phosphor-icons/react";
export function TextField({
  label,
  value,
  onChange,
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
  onChange: (value: string) => void;
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
  return (
    <div className="zk-field">
      <label className="zk-label" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className="zk-input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
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
export function CheckboxField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="zk-checkbox-label">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
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
