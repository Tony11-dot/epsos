"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// Seamless, gap-free infinite marquee that is ALSO hand-scrollable.
// It measures one copy of the content, renders enough copies to always overflow,
// and drives the motion by nudging the container's own scrollLeft each frame.
// Because it's a real scroll container, the user can swipe / drag / wheel through
// it at any time, and the auto-cycle keeps running and coexists with that.
//
// NOTE: Safari rounds scrollLeft to whole integers, so reading it back and adding
// a sub-pixel delta each frame loses the fraction and the marquee never moves.
// We therefore keep the intended position as a float accumulator (posRef) and set
// scrollLeft from it; when the user scrolls, we adopt their position and continue.
export default function Marquee({
  children,
  pxPerSecond = 46,
  reverse = false,
  fade = true,
  className = "",
}: {
  children: ReactNode;
  pxPerSecond?: number;
  reverse?: boolean;
  fade?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);
  const unitWidthRef = useRef(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(0);
  const [copies, setCopies] = useState(4);

  const measure = useCallback(() => {
    const unit = unitRef.current;
    const container = containerRef.current;
    if (!unit || !container) return;
    const w = unit.scrollWidth;
    if (!w) return;
    const containerW = container.clientWidth;
    // Enough copies to fill the viewport plus a full copy of wrap buffer on each
    // side, so the one-copy shift used for looping is never visible.
    const needed = Math.max(4, Math.ceil(containerW / w) + 3);
    unitWidthRef.current = w;
    setCopies(needed);
    // Start in the middle band so there's room to loop both ways immediately.
    if (container.scrollLeft < w) {
      container.scrollLeft = w;
      posRef.current = w;
    }
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, children]);

  // Re-seat the scroll position after the copy count (re)renders.
  useEffect(() => {
    const c = containerRef.current;
    const w = unitWidthRef.current;
    if (c && w && c.scrollLeft < w) {
      c.scrollLeft = w;
      posRef.current = w;
    }
  }, [copies]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    if (unitRef.current) ro.observe(unitRef.current);

    const onLoad = () => measure();
    window.addEventListener("load", onLoad);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => measure()).catch(() => {});
    }
    const t = window.setTimeout(measure, 400);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, [measure]);

  // Auto-cycle loop. Always runs; coexists with wheel/trackpad scrolling (we
  // adopt the user's position); only yields to an in-progress touch drag.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = 0;
    let expected = -1; // the (rounded) value we last wrote, to detect user scroll
    const dir = reverse ? -1 : 1;

    const step = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp long frame gaps
      last = now;

      const w = unitWidthRef.current;
      const max = c.scrollWidth - c.clientWidth;
      if (w && max > w) {
        const actual = c.scrollLeft;
        if (pausedRef.current || reduce) {
          // Let the user own the scroll; stay in sync so we resume from here.
          posRef.current = actual;
          expected = actual;
        } else {
          if (expected < 0) posRef.current = actual; // first frame
          // If the user wheeled/dragged since our last write, adopt their spot.
          else if (Math.abs(actual - expected) > 2) posRef.current = actual;

          posRef.current += dir * pxPerSecond * dt;

          // Keep within the seamless middle band; a one-copy shift is invisible.
          if (posRef.current < w) posRef.current += w;
          else if (posRef.current > max - w) posRef.current -= w;

          c.scrollLeft = posRef.current;
          expected = c.scrollLeft; // read back the rounded value we actually got
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Only an active touch drag pauses the cycle (so it doesn't fight the finger
    // or its momentum); it resumes shortly after the finger lifts. Wheel/trackpad
    // scrolling on desktop is NOT paused — it coexists with the running cycle.
    const pause = () => {
      pausedRef.current = true;
      window.clearTimeout(resumeTimer.current);
    };
    const resumeSoon = () => {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        pausedRef.current = false;
      }, 600);
    };

    c.addEventListener("touchstart", pause, { passive: true });
    c.addEventListener("touchend", resumeSoon, { passive: true });
    c.addEventListener("touchcancel", resumeSoon, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer.current);
      c.removeEventListener("touchstart", pause);
      c.removeEventListener("touchend", resumeSoon);
      c.removeEventListener("touchcancel", resumeSoon);
    };
  }, [pxPerSecond, reverse]);

  return (
    <div ref={containerRef} className={`mq ${fade ? "mq-fade" : ""} ${className}`}>
      <div className="mq-track">
        {Array.from({ length: copies }, (_, i) => (
          <div className="mq-group" key={i} ref={i === 0 ? unitRef : undefined} aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mq {
          position: relative;
          width: 100%;
          /* Real horizontal scroll container: swipe / drag / wheel all work. */
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          cursor: grab;
          /* Left-align the (wider-than-container) track so scrollLeft is a normal
             0→right value. Card groups are set back to RTL below. */
          direction: ltr;
        }
        .mq::-webkit-scrollbar {
          display: none;
        }
        .mq:active {
          cursor: grabbing;
        }
        .mq-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }
        .mq-track {
          display: flex;
          width: max-content;
          direction: ltr;
        }
        .mq-group {
          display: flex;
          direction: rtl; /* card order + text stay right-to-left */
          gap: 1.25rem;
          padding-inline-end: 1.25rem; /* keep the seam gap equal to the item gap */
          flex: none;
        }
      `}</style>
    </div>
  );
}
