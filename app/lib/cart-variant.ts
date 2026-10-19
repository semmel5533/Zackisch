import type { OrderCustomization } from "./types";

/** Preserve every selection: a truncated display string is not a variant identity. */
export function cartVariantId(menuItemId: string, selections: readonly OrderCustomization[]): string {
  const choices = selections.map(selection => JSON.stringify([
    selection.stepName ?? selection.step ?? "",
    selection.optionName ?? selection.choice ?? selection.name ?? "",
    selection.extraPrice ?? 0,
  ])).sort();
  return JSON.stringify([menuItemId, choices]);
}
