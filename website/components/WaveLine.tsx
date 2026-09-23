import { useId } from "react";
import { cn } from "@/lib/utils";

export interface WaveLineProps {
  repeat?: boolean;
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
        className={cn(
          "h-full overflow-hidden text-foreground flex justify-center items-stretch",
          className,
        )}
        aria-hidden="true"
      >
        <svg
          className="h-full w-3 overflow-hidden text-current"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
              width="12"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 6 0 Q 1.5 4, 6 8 T 6 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            </pattern>
          </defs>
          <rect width="12" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden text-foreground flex items-center",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="w-full h-3 overflow-hidden text-current"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
            width="16"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 6 Q 4 1.5, 8 6 T 16 6"
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
