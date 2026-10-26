"use client";

import { useId, useMemo, useRef, useState, type Ref } from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Check } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/price";
import { useTranslation } from "@/lib/i18n";
import { DIETARY_LABEL_KEYS } from "@/lib/dietary-labels";
import {
  parseGuestCustomizations,
  priceGuestSelections,
} from "@/lib/guest-customizations";
import type { MenuItem, CustomizationStep } from "@/lib/types";

interface CustomizationModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (
    item: MenuItem,
    selections: { stepName: string; optionName: string; extraPrice: number }[],
    totalPrice: number,
  ) => void;
}

export function CustomizationModal(props: CustomizationModalProps) {
  if (!props.item || !props.open) return null;
  return (
    <CustomizationContent key={props.item._id} {...props} item={props.item} />
  );
}

function CustomizationContent({
  item,
  open,
  onOpenChange,
  onAddToCart,
}: CustomizationModalProps & { item: MenuItem }) {
  const { t } = useTranslation();
  const steps = useMemo(
    () => parseGuestCustomizations(item.customizations),
    [item.customizations],
  );
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [invalid, setInvalid] = useState<string[]>([]);
  const groups = useRef<Record<string, HTMLFieldSetElement | null>>({});
  const priced = priceGuestSelections(steps ?? [], selections);
  const total =
    item.price + priced.reduce((sum, option) => sum + option.extraPrice, 0);

  function add() {
    if (!steps || !item.available) return;
    const incomplete = steps
      .filter((step) => {
        const count = (selections[step.name] ?? []).length;
        return count < step.minSelections || count > step.maxSelections;
      })
      .map((step) => step.name);
    setInvalid(incomplete);
    if (incomplete.length) {
      const group = groups.current[incomplete[0]];
      group?.focus({ preventScroll: true });
      group?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      return;
    }
    onAddToCart(item, priced, total);
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={item.name}
      closeLabel={t("close")}
      sheet
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!steps || !item.available}
          onClick={add}
        >
          {t("addToCart")} · <Price cents={total} />
        </Button>
      }
    >
      <div className="guest-customizations">
        {item.description && <p>{item.description}</p>}
        <Price cents={item.price} />
        {!!item.dietaryLabels?.length && (
          <p className="zk-supporting">
            {item.dietaryLabels
              .map((label) => t(DIETARY_LABEL_KEYS[label]))
              .join(" · ")}
          </p>
        )}
        {!steps && (
          <p role="alert" className="guest-option-error">
            {t("customizationUnavailable")}
          </p>
        )}
        {steps?.map((step) => (
          <CustomizationGroup
            key={step.name}
            step={step}
            selected={selections[step.name] ?? []}
            isInvalid={invalid.includes(step.name)}
            groupRef={(node) => {
              groups.current[step.name] = node;
            }}
            change={(next) => {
              setSelections((prev) => ({ ...prev, [step.name]: next }));
              if (next.length >= step.minSelections)
                setInvalid((prev) => prev.filter((name) => name !== step.name));
            }}
          />
        ))}
      </div>
    </Modal>
  );
}

function CustomizationGroup({
  step,
  selected,
  isInvalid,
  groupRef,
  change,
}: {
  step: CustomizationStep;
  selected: string[];
  isInvalid: boolean;
  groupRef: Ref<HTMLFieldSetElement>;
  change: (next: string[]) => void;
}) {
  const { t } = useTranslation();
  const hint =
    step.minSelections === step.maxSelections && step.minSelections > 0
      ? t("chooseExactly", { count: step.minSelections })
      : step.minSelections > 0
        ? t("chooseBetween", {
            min: step.minSelections,
            max: step.maxSelections,
          })
        : t("chooseUpTo", {
            max: Math.min(step.maxSelections, step.options.length),
          });
  const labelId = useId();
  const hintId = `${labelId}-hint`;
  const options = step.options.map((option) => {
    const checked = selected.includes(option.name);
    const disabled =
      option.available === false ||
      (!checked &&
        step.maxSelections !== 1 &&
        selected.length >= step.maxSelections);
    return (
      <label
        key={option.name}
        className="guest-option"
        data-disabled={disabled || undefined}
      >
        {step.maxSelections === 1 ? (
          <Radio.Root
            value={option.name}
            disabled={disabled}
            className="zk-radio"
          >
            <Radio.Indicator className="zk-radio-dot" />
          </Radio.Root>
        ) : (
          <Checkbox.Root
            checked={checked}
            disabled={disabled}
            onCheckedChange={(value) =>
              change(
                value
                  ? [...selected, option.name]
                  : selected.filter((name) => name !== option.name),
              )
            }
            className="guest-option-checkbox"
          >
            <Checkbox.Indicator>
              <Check size={16} aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        )}
        <span className="guest-option-name">
          {option.name}
          {option.available === false && <small>{t("unavailable")}</small>}
        </span>
        {option.extraPrice > 0 && (
          <Price cents={option.extraPrice} prefix="+" />
        )}
      </label>
    );
  });
  return (
    <fieldset
      key={step.name}
      tabIndex={-1}
      ref={groupRef}
      className="guest-option-group"
      aria-describedby={hintId}
      aria-invalid={isInvalid || undefined}
    >
      <legend id={labelId}>{step.name}</legend>
      <p id={hintId} className="zk-supporting">
        {hint}
      </p>
      {step.includedCount > 0 && (
        <p className="zk-supporting">
          {t("includedFirst", { count: step.includedCount })}
        </p>
      )}
      {isInvalid && (
        <p role="alert" className="guest-option-error">
          {t("customizationRequired")}
        </p>
      )}
      {step.maxSelections === 1 ? (
        <RadioGroup
          value={selected[0] ?? ""}
          onValueChange={(value) => change([value])}
          aria-labelledby={labelId}
          aria-describedby={hintId}
          className="guest-option-list"
        >
          {options}
        </RadioGroup>
      ) : (
        <div className="guest-option-list">{options}</div>
      )}
      {step.maxSelections === 1 &&
        step.minSelections === 0 &&
        selected.length > 0 && (
          <Button variant="ghost" onClick={() => change([])}>
            {t("clearSelection")}
          </Button>
        )}
    </fieldset>
  );
}
