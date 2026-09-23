"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedBenefitStatProps {
  target?: number;
  unit?: string;
}

export function AnimatedBenefitStat({
  target = 30,
  unit = "%",
}: AnimatedBenefitStatProps) {
  const [value, setValue] = useState(0);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const duration = 2200; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic curve: 1 - (1 - progress)^3
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(easeOutProgress * target);

            setValue(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return (
    <p ref={containerRef} className="my-2 text-center text-[clamp(88px,10vw,140px)] font-medium leading-none tracking-[-.04em]">
      <span className="font-inter tabular-nums">{value}</span>
      <span>{unit ? ` ${unit}` : ""}</span>
    </p>
  );
}
