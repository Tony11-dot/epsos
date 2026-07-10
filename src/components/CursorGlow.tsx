"use client";

import { useEffect, useRef } from "react";

// A soft red aura that trails the cursor across the whole page. Smoothly
// eased (lerp), painted above content but pointer-transparent so it never
// blocks interaction. Disabled for touch/coarse pointers and reduced motion.
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const loop = () => {
      x += (targetX - x) * 0.14;
      y += (targetY - y) * 0.14;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "34rem",
        height: "34rem",
        borderRadius: "999px",
        pointerEvents: "none",
        zIndex: 30,
        opacity: 0,
        transition: "opacity 0.4s ease",
        // A luminous warm-red core: bright enough to read as a lighter disc on
        // the deep-red sections, warm enough to stay visible on near-white paper.
        background:
          "radial-gradient(circle, oklch(0.78 0.19 38 / 0.32) 0%, oklch(0.74 0.2 34 / 0.14) 38%, transparent 70%)",
        willChange: "transform, opacity",
      }}
    />
  );
}
