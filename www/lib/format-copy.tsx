import { type ReactNode } from "react";

const NOWRAP_PATTERN =
  /(zzgl\.\s+Zahlungsanbietergebühren\.?|plus payment provider fees\.?|Schlange am Tresen|queues at the counter|\bQR codes?[\p{P}]*|\b\d+(?:[.,]\d+)?\s*(?:%|€)[\p{P}]*|\b[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+[\p{P}]*)/gu;

export function formatCopy(text: string): ReactNode {
  const parts = text.split(NOWRAP_PATTERN);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
