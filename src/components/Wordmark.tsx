import Image from "next/image";
import type { SiteContent } from "@/lib/types";

// The brand mark — the same concentric-ring glyph as the browser-tab favicon,
// so the header and the tab read as one identity. Replaced entirely when a
// custom logo is uploaded in the admin.
export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(150deg, var(--red-500), var(--red-700))",
        boxShadow: "0 4px 12px color-mix(in oklch, var(--red-600) 28%, transparent)",
      }}
    >
      <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="8.2" stroke="white" strokeWidth="1.7" opacity="0.65" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
      </svg>
    </span>
  );
}

export default function Wordmark({
  brand,
  variant = "dark",
  showLatin = true,
}: {
  brand: SiteContent["brand"];
  variant?: "dark" | "light";
  showLatin?: boolean;
}) {
  const color = variant === "light" ? "white" : "var(--ink)";

  if (brand.logo?.url) {
    return (
      <span className="inline-flex items-center" style={{ height: 52 }}>
        <Image
          src={brand.logo.url}
          alt={brand.logo.alt || brand.name}
          width={190}
          height={52}
          className="h-[52px] w-auto object-contain"
          priority
        />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 select-none" aria-label={brand.name}>
      <BrandMark />
      <span className="inline-flex flex-col leading-none">
        <span className="font-display font-bold" style={{ color, fontSize: "1.85rem" }}>
          {brand.name}
        </span>
        {showLatin ? (
          <span
            className="mt-1 text-[0.66rem] font-semibold tracking-[0.3em] uppercase"
            style={{ color: variant === "light" ? "rgba(255,255,255,.65)" : "var(--muted)" }}
          >
            {brand.latin}
          </span>
        ) : null}
      </span>
    </span>
  );
}
