"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { useId } from "react";

type ChoiceGroupProps<Value extends string> = {
  label: string;
  value: Value;
  onChange: (value: Value) => void;
  options: readonly { value: Value; label: string; disabled?: boolean }[];
};

export function ChoiceGroup<Value extends string>({
  label,
  value,
  onChange,
  options,
}: ChoiceGroupProps<Value>) {
  const id = useId();
  return (
    <div className="zk-field">
      <span id={id} className="zk-label">
        {label}
      </span>
      <RadioGroup
        className="zk-choices"
        aria-labelledby={id}
        value={value}
        onValueChange={onChange}
      >
        {options.map((option) => (
          <label className="zk-choice" key={option.value}>
            <Radio.Root
              value={option.value}
              disabled={option.disabled}
              className="zk-radio"
            >
              <Radio.Indicator className="zk-radio-dot" />
            </Radio.Root>
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
