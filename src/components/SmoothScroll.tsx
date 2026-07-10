"use client";

import { useEffect } from "react";

// Lenis smooth scroll — disabled entirely under prefers-reduced-motion.
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let lenis: import("lenis").default | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      // Expose so overlays (modals) can pause scroll while open.
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // In-page anchor links route through Lenis for a smooth glide.
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis?.scrollTo(el as HTMLElement, { offset: -84 });
        history.replaceState(null, "", id);
      };
      document.addEventListener("click", onClick);
      (lenis as unknown as { _onClick?: typeof onClick })._onClick = onClick;
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      const onClick = (lenis as unknown as { _onClick?: EventListener } | null)?._onClick;
      if (onClick) document.removeEventListener("click", onClick);
      (window as unknown as { __lenis?: unknown }).__lenis = undefined;
      lenis?.destroy();
    };
  }, []);

  return null;
}
