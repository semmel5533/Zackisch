export function WaveLine({ repeat }: { repeat?: boolean }) {
  if (repeat) {
    return (
      <svg aria-hidden="true" className="wave-line-pattern">
        <defs>
          <pattern
            id="wave-pattern"
            width="12"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 4Q3 0 6 4T12 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="8" fill="url(#wave-pattern)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 72 8" aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M0 4Q3 0 6 4T12 4T18 4T24 4T30 4T36 4T42 4T48 4T54 4T60 4T66 4T72 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
