import { useId } from "react";

interface WaveLineProps {
  repeat?: boolean;
  className?: string;
  strokeWidth?: number;
}

export function WaveLine({ repeat, className, strokeWidth = 2.25 }: WaveLineProps) {
  const rawId = useId();
  const patternId = `wave-line-${rawId.replace(/:/g, "")}`;

  if (repeat || className?.includes("w-full")) {
    return (
      <div
        className={`w-full overflow-hidden text-foreground flex items-center ${className || ""}`}
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

  return (
    <svg viewBox="0 0 72 8" aria-hidden="true" preserveAspectRatio="none" className={className}>
      <path
        d="M0 4Q3 0 6 4T12 4T18 4T24 4T30 4T36 4T42 4T48 4T54 4T60 4T66 4T72 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
