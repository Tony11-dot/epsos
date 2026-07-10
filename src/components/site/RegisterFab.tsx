"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

// Floating "register now" action. Anchors to #register (Lenis smooth-scrolls
// a[href^="#"]). Hides while the registration section itself is in view so it
// never covers the form, and stays out of the way at the very top.
export default function RegisterFab({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("register");
    const hero = document.getElementById("top");

    let registerIn = false;
    let pastHero = false;
    const update = () => setVisible(pastHero && !registerIn);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target.id === "register") registerIn = e.isIntersecting;
          if (e.target.id === "top") pastHero = !e.isIntersecting;
        }
        update();
      },
      { threshold: 0.12 }
    );
    if (target) io.observe(target);
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <a href="#register" className="reg-fab" data-visible={visible} aria-label={label}>
      <span className="reg-fab-pulse" aria-hidden="true" />
      <span className="reg-fab-icon" aria-hidden="true">
        <Icon name="pen" size={20} />
      </span>
      <span className="reg-fab-label">{label}</span>

      <style jsx>{`
        .reg-fab {
          position: fixed;
          inset-inline-start: clamp(1rem, 3vw, 2.2rem);
          bottom: clamp(1rem, 3vw, 2.2rem);
          z-index: 45;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          padding: 1.05rem 1.7rem;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--red-500), var(--red-700));
          color: white;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 0.01em;
          box-shadow: 0 14px 34px color-mix(in oklch, var(--red-600) 50%, transparent),
            0 0 0 1px color-mix(in oklch, var(--red-600) 22%, transparent);
          opacity: 0;
          transform: translateY(24px) scale(0.9);
          pointer-events: none;
          transition: opacity 0.45s var(--ease-out-quart), transform 0.45s var(--ease-out-quart);
        }
        .reg-fab[data-visible="true"] {
          opacity: 1;
          transform: none;
          pointer-events: auto;
          animation: fab-breathe 2.6s ease-in-out infinite;
        }
        /* Expanding attention ring */
        .reg-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--red-500);
          z-index: -1;
        }
        .reg-fab[data-visible="true"] .reg-fab-pulse {
          animation: fab-ring 2.6s ease-out infinite;
        }
        .reg-fab:hover {
          transform: translateY(-3px) scale(1.03);
          animation: none;
          box-shadow: 0 20px 48px color-mix(in oklch, var(--red-600) 60%, transparent);
        }
        .reg-fab-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          background: oklch(1 0 0 / 0.22);
          animation: fab-wiggle 2.6s ease-in-out infinite;
        }
        /* Shimmer sweep across the label */
        .reg-fab-label {
          position: relative;
          background: linear-gradient(
            100deg,
            white 30%,
            var(--accent) 50%,
            white 70%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fab-shine 3.2s linear infinite;
        }
        @keyframes fab-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes fab-ring {
          0% { opacity: 0.55; transform: scale(1); }
          70%, 100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes fab-wiggle {
          0%, 88%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-12deg); }
          96% { transform: rotate(12deg); }
        }
        @keyframes fab-shine {
          from { background-position: 200% 0; }
          to { background-position: -60% 0; }
        }
        @media (max-width: 480px) {
          .reg-fab-label { display: none; }
          .reg-fab { padding: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reg-fab,
          .reg-fab[data-visible="true"],
          .reg-fab-icon,
          .reg-fab-label,
          .reg-fab[data-visible="true"] .reg-fab-pulse {
            animation: none;
          }
          .reg-fab-label {
            -webkit-text-fill-color: white;
          }
          .reg-fab { transition: opacity 0.2s linear; transform: none; }
          .reg-fab[data-visible="true"] { transform: none; }
          .reg-fab:hover { transform: none; }
        }
      `}</style>
    </a>
  );
}
