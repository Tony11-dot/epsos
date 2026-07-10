"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

// Scroll-reveal wrapper. Adds `.is-in` when the element enters the viewport.
// Under prefers-reduced-motion the CSS forces the visible state, so this is a
// no-op there. `delay` staggers grouped items.
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  once = true,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  once?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-in");
          }
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal ${className}`}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
