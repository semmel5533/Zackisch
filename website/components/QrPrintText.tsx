"use client";

import { useEffect, useRef, useState } from "react";

/** Scale each printed line to the same width, like the webapp's QR print view. */
export function QrPrintText({ text }: { text: string }) {
  const ref = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState("0 -76 600 80");
  const label = text.toUpperCase();

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !ref.current) return;
      const box = ref.current.getBBox();
      const context = document.createElement("canvas").getContext("2d");
      if (!context) return;
      context.font = `700 100px ${getComputedStyle(ref.current).fontFamily}`;
      const metrics = context.measureText(label);
      const ascent = metrics.actualBoundingBoxAscent;
      const height = ascent + metrics.actualBoundingBoxDescent;
      setViewBox(`${box.x} ${-ascent} ${box.width} ${height}`);
    };
    document.fonts.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [label]);

  return (
    <svg viewBox={viewBox} className="block w-full overflow-visible">
      <text
        ref={ref}
        x="0"
        y="0"
        fill="currentColor"
        className="text-[100px] font-bold"
      >
        {label.split(/(\d+)/).map((part, index) => (
          <tspan
            key={`${index}-${part}`}
            className={
              /^\d+$/.test(part) ? "font-inter tabular-nums" : undefined
            }
          >
            {part}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
