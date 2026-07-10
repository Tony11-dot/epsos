"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import Wordmark from "@/components/Wordmark";
import { Icon } from "@/components/Icon";

export default function Nav({ brand, nav }: { brand: SiteContent["brand"]; nav: SiteContent["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "oklch(0.992 0.003 90 / 0.82)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav className="container-x flex h-[86px] items-center justify-between gap-4">
        <a href="#top" className="shrink-0" aria-label={brand.name}>
          <Wordmark brand={brand} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.links.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                className="relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-ink-soft transition-colors hover:text-red-700"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={nav.ctaHref} className="btn btn-primary hidden text-[0.92rem] sm:inline-flex">
            {nav.ctaLabel}
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink lg:hidden"
            aria-label="القائمة"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "layers"} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="lg:hidden"
        style={{
          maxHeight: open ? "80vh" : 0,
          overflow: "hidden",
          transition: "max-height 0.4s var(--ease-out-quart)",
          background: "var(--paper)",
          borderBottom: open ? "1px solid var(--line)" : "none",
        }}
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {nav.links.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-lg font-medium text-ink hover:bg-red-50 hover:text-red-700"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href={nav.ctaHref} onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {nav.ctaLabel}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
