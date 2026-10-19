import { v } from "convex/values";
import { DIETARY_LABELS } from "../lib/dietary-labels";

export const dietaryLabelsValidator = v.array(v.union(
  v.literal(DIETARY_LABELS[0]), v.literal(DIETARY_LABELS[1]), v.literal(DIETARY_LABELS[2]),
));
