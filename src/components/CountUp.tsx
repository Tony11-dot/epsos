"use client";

import { useEffect, useRef, useState } from "react";

// Counts from 0 → value when scrolled into view. Respects reduced motion
// (jumps straight to the final value). Uses Western digits via the `.num`
// (Rubik, tabular) class on the parent; here we localise to Arabic if asked.
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
  arabicDigits = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  arabicDigits?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            io.unobserve(e.target);
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(Math.round(value * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const formatted = display.toLocaleString(arabicDigits ? "ar-EG" : "en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
