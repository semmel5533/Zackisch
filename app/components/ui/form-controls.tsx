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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  type?: "text" | "email";
  placeholder?: string;
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
        className="zk-input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="guest-option-error">
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
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="zk-checkbox-label">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
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
