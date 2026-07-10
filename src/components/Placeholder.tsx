import Image from "next/image";
import type { ImageRef } from "@/lib/types";

// Graceful branded fallbacks when a photo hasn't been uploaded yet.
// A cover gets a red paper gradient + rings; an avatar gets initials on brand.

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second) || "إ";
}

export function CoverImage({
  image,
  className = "",
  sizes = "(max-width: 768px) 100vw, 400px",
  ratio = "4 / 3",
  label,
}: {
  image?: ImageRef;
  className?: string;
  sizes?: string;
  ratio?: string;
  label?: string;
}) {
  const has = image?.url;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {has ? (
        <Image
          src={image!.url}
          alt={image!.alt || label || ""}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(140deg, var(--red-600), var(--red-800))",
          }}
        >
          <svg
            viewBox="0 0 200 150"
            className="absolute inset-0 h-full w-full opacity-30"
            aria-hidden="true"
          >
            <g fill="none" stroke="white" strokeWidth="1.2">
              <circle cx="150" cy="40" r="26" />
              <circle cx="150" cy="40" r="46" opacity="0.6" />
              <circle cx="40" cy="120" r="18" />
              <circle cx="40" cy="120" r="34" opacity="0.5" />
            </g>
          </svg>
          {label ? (
            <span className="relative font-display text-white/90 text-lg px-4 text-center">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function Avatar({
  image,
  name,
  size = 72,
  className = "",
}: {
  image?: ImageRef;
  name: string;
  size?: number;
  className?: string;
}) {
  const has = image?.url;
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {has ? (
        <Image
          src={image!.url}
          alt={image!.alt || name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display"
          style={{
            background: "linear-gradient(150deg, var(--red-500), var(--red-700))",
            color: "white",
            fontSize: size * 0.36,
          }}
          aria-label={name}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}
