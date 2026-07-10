"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

// Accessible in-window dialog: focus-trapped, Escape/backdrop to close,
// scroll-locked, animated (fade+rise), reduced-motion friendly via CSS.
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement as HTMLElement;
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = "hidden";
    // The overlay carries data-lenis-prevent, so Lenis ignores wheel/touch over
    // it entirely: the background stays put while the dialog scrolls natively.
    // (We deliberately do NOT call lenis.stop() — that froze the dialog too.)

    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
    focusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      style.overflow = prev;
      lastActive.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      data-lenis-prevent
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="modal-panel"
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close"
          aria-label="إغلاق"
        >
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1rem, 4vw, 2.5rem);
          background: oklch(0.24 0.02 30 / 0.5);
          backdrop-filter: blur(3px);
          animation: overlay-in 0.25s ease both;
        }
        .modal-panel {
          position: relative;
          width: 100%;
          max-width: 52rem;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 1.4rem;
          box-shadow: 0 30px 80px oklch(0.3 0.05 30 / 0.35);
          animation: panel-in 0.32s var(--ease-out-quart) both;
        }
        .modal-close {
          position: sticky;
          top: 0.9rem;
          float: inline-start;
          margin: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 999px;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          color: var(--ink);
          z-index: 2;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .modal-close:hover {
          background: var(--red-600);
          color: white;
          transform: rotate(90deg);
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-panel {
            animation: none;
          }
          .modal-close:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
