import type { CustomizationStep } from "./types";

type LegacyStep = CustomizationStep & {
  minSelect?: number;
  maxSelect?: number;
  required?: boolean;
  type?: string;
};

/** Presentation normalization only. Checkout independently reconstructs all prices on the server. */
export function parseGuestCustomizations(
  serialized: string,
): CustomizationStep[] | null {
  try {
    const raw: unknown = JSON.parse(serialized || "[]");
    if (!Array.isArray(raw)) return null;
    const names = new Set<string>();
    return raw
      .map((value: unknown) => {
        if (!value || typeof value !== "object")
          throw new Error("Invalid group");
        const step = value as LegacyStep;
        if (
          typeof step.name !== "string" ||
          !step.name ||
          names.has(step.name) ||
          !Array.isArray(step.options)
        )
          throw new Error("Invalid group");
        names.add(step.name);
        const min =
          step.minSelections ??
          step.minSelect ??
          (step.required ? 1 : step.type === "singleChoice" ? 1 : 0);
        const max =
          step.maxSelections ??
          step.maxSelect ??
          (step.type === "singleChoice"
            ? 1
            : step.required && min === 1 && !step.maxSelect
              ? 1
              : 99);
        const included = step.includedCount ?? 0;
        if (
          ![min, max, included].every(
            (n) => Number.isSafeInteger(n) && n >= 0,
          ) ||
          max < min
        )
          throw new Error("Invalid limits");
        const optionNames = new Set<string>();
        const options = step.options.map((option) => {
          if (
            !option ||
            typeof option.name !== "string" ||
            !option.name ||
            optionNames.has(option.name)
          )
            throw new Error("Invalid option");
          optionNames.add(option.name);
          const price =
            option.extraPrice ??
            (option as unknown as { price?: number }).price ??
            0;
          if (!Number.isSafeInteger(price) || price < 0)
            throw new Error("Invalid price");
          return { ...option, extraPrice: price };
        });
        return {
          ...step,
          minSelections: min,
          maxSelections: max,
          includedCount: included,
          options,
        };
      })
      .filter((step) => step.available !== false);
  } catch {
    return null;
  }
}

export function priceGuestSelections(
  steps: CustomizationStep[],
  selections: Record<string, string[]>,
) {
  return steps.flatMap((step) =>
    step.options
      .filter(
        (option) =>
          option.available !== false &&
          selections[step.name]?.includes(option.name),
      )
      .sort((a, b) => a.extraPrice - b.extraPrice)
      .map((option, index) => ({
        stepName: step.name,
        optionName: option.name,
        extraPrice: index < step.includedCount ? 0 : option.extraPrice,
      })),
  );
}
