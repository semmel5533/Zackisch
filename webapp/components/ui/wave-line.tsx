"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface WaveLineProps {
  className?: string;
  strokeWidth?: number;
}

export function WaveLine({ className, strokeWidth = 2.25 }: WaveLineProps) {
  const rawId = useId();
  const patternId = `wave-line-${rawId.replace(/:/g, "")}`;

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
