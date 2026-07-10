"use client";

import { useEffect, useRef } from "react";

// Hand-drawn red marking-pen underline that draws itself on when revealed.
// Two slightly offset strokes read like a real double pen-stroke.
export default function HeroUnderline({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={`underline-draw ${className}`}
      viewBox="0 0 360 40"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M6 26C64 14 140 12 210 16C268 19 320 22 352 18"
        stroke="var(--red-600)"
        strokeWidth="7"
        strokeLinecap="round"
        style={{ ["--dash" as string]: 380 }}
      />
      <path
        d="M18 33C96 26 186 27 268 29C300 30 330 30 346 31"
        stroke="var(--accent-strong)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
        style={{ ["--dash" as string]: 360, transitionDelay: "0.5s" }}
      />
    </svg>
  );
}
