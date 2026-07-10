"use client";

import type { ReactNode } from "react";

// Infinite auto-scrolling row (à la Stripe's customer logos). Content is
// duplicated so the loop is seamless; hovering pauses it. Under
// prefers-reduced-motion the animation stops and the row becomes swipe-scrollable.
export default function Marquee({
  children,
  speed = 42,
  reverse = false,
  fade = true,
  className = "",
}: {
  children: ReactNode;
  speed?: number; // seconds per loop
  reverse?: boolean;
  fade?: boolean;
  className?: string;
}) {
  return (
    <div className={`mq ${fade ? "mq-fade" : ""} ${className}`}>
      <div className="mq-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        <div className="mq-group">{children}</div>
        <div className="mq-group" aria-hidden="true">{children}</div>
      </div>

      <style jsx>{`
        .mq {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .mq-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
          mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
        }
        .mq-track {
          display: flex;
          width: max-content;
          animation-name: mq-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .mq:hover .mq-track {
          animation-play-state: paused;
        }
        .mq-group {
          display: flex;
          gap: 1.25rem;
          padding-inline-end: 1.25rem;
          flex: none;
        }
        @keyframes mq-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mq {
            overflow-x: auto;
            scrollbar-width: none;
          }
          .mq-track {
            animation: none;
          }
          .mq-group[aria-hidden="true"] {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
