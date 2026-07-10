"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// Seamless, gap-free infinite marquee. It measures one copy of the content and
// the container, then renders enough copies to always overflow the viewport,
// shifting by exactly one copy's width so the last item sits flush against the
// first — no empty spots regardless of how few items there are.
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
  const [copies, setCopies] = useState(2);
  const [unitWidth, setUnitWidth] = useState(0);

  const measure = useCallback(() => {
    const unit = unitRef.current;
    const container = containerRef.current;
    if (!unit || !container) return;
    const w = unit.scrollWidth;
    if (!w) return;
    const containerW = container.clientWidth;
    // enough copies that (copies-1) sets already fill the container → the shift
    // of one set width always keeps content on screen. +1 extra as safety margin.
    const needed = Math.max(3, Math.ceil(containerW / w) + 2);
    setUnitWidth(w);
    setCopies(needed);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, children]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    if (unitRef.current) ro.observe(unitRef.current);

    // Re-measure once fonts/late layout settle, so copy count is never short.
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

  const duration = unitWidth > 0 ? unitWidth / pxPerSecond : 30;

  return (
    <div ref={containerRef} className={`mq ${fade ? "mq-fade" : ""} ${className}`}>
      <div
        className="mq-track"
        style={
          {
            ["--mq-w"]: `${unitWidth}px`,
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: unitWidth > 0 ? "running" : "paused",
          } as React.CSSProperties
        }
      >
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
          overflow: hidden;
          /* Left-align the (wider-than-container) track so it overflows to the
             right, where scrolling copies fill in. RTL would right-align it and
             open a gap on the right. Card groups are set back to RTL below. */
          direction: ltr;
        }
        .mq-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }
        .mq-track {
          display: flex;
          width: max-content;
          /* Lay the copies left→right so, as content scrolls left, the next copy
             fills the incoming (right) edge. Without this, RTL right-aligns the
             track and a gap opens on the right. Cards keep their own RTL below. */
          direction: ltr;
          animation-name: mq-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .mq:hover .mq-track {
          animation-play-state: paused !important;
        }
        .mq-group {
          display: flex;
          direction: rtl; /* card order + text stay right-to-left */
          gap: 1.25rem;
          padding-inline-end: 1.25rem; /* keep the seam gap equal to the item gap */
          flex: none;
        }
        @keyframes mq-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-1 * var(--mq-w))); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mq {
            overflow-x: auto;
            scrollbar-width: none;
          }
          .mq-track {
            animation: none;
          }
          .mq-group:not(:first-child) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
