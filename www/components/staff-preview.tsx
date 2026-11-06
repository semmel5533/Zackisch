"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function StaffPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = matchMedia(
      "(min-width: 800px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    function update() {
      frame = 0;
      if (!element) return;
      if (!motion.matches) {
        element.style.removeProperty("transform");
        return;
      }
      // Layout position ignores the transform, avoiding feedback into progress.
      const top = element.offsetTop - window.scrollY;
      const progress = Math.max(
        0,
        Math.min(1, (innerHeight * 0.95 - top) / (innerHeight * 0.6)),
      );
      element.style.transform = `scale(${0.88 + 0.12 * progress})`;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <div className="staff-preview" ref={ref}>
      {children}
    </div>
  );
}
