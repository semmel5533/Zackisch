export const DIETARY_LABELS = ["vegan", "vegetarian", "halal"] as const;
export type DietaryLabel = (typeof DIETARY_LABELS)[number];

export const DIETARY_LABEL_KEYS = {
  vegan: "dietaryVegan",
  vegetarian: "dietaryVegetarian",
  halal: "dietaryHalal",
} as const;

export function parseDietaryLabels(values: readonly unknown[]): DietaryLabel[] {
  if (values.length > DIETARY_LABELS.length || values.some(value => !DIETARY_LABELS.includes(value as DietaryLabel))) {
    throw new Error("INVALID_DIETARY_LABELS");
  }
  return [...new Set(values as DietaryLabel[])];
}
