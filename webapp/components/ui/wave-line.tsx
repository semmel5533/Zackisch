"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface WaveLineProps {
  className?: string;
  strokeWidth?: number;
  orientation?: "horizontal" | "vertical";
}

export function WaveLine({
  className,
  strokeWidth = 2.25,
  orientation = "horizontal",
}: WaveLineProps) {
  const rawId = useId();
  const patternId = `wave-line-${rawId.replace(/:/g, "")}`;

  if (orientation === "vertical") {
    return (
      <div
        className={cn("h-full overflow-hidden text-foreground flex justify-center items-stretch", className)}
        aria-hidden="true"
      >
        <svg className="h-full w-2.5 overflow-hidden text-current" preserveAspectRatio="none">
          <defs>
            <pattern
              id={patternId}
              width="10"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 5 0 Q 2 3, 5 6 T 5 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            </pattern>
          </defs>
          <rect width="10" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn("w-full overflow-hidden text-foreground flex items-center", className)}
      aria-hidden="true"
    >
      <svg className="w-full h-2.5 overflow-hidden text-current" preserveAspectRatio="none">
        <defs>
          <pattern
            id={patternId}
            width="12"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 5 Q 3 2, 6 5 T 12 5"
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="10" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
