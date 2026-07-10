// Deliberate brand marks — concentric rings, discs, thin lines in red/yellow.
// Used to fill negative space with intent (not decorative AI-slop blobs).
// All are aria-hidden and pointer-events-none.

export function Rings({
  className = "",
  size = 220,
  stroke = "var(--red-300)",
}: {
  className?: string;
  size?: number;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <circle cx="110" cy="110" r="30" />
        <circle cx="110" cy="110" r="58" />
        <circle cx="110" cy="110" r="86" opacity="0.7" />
        <circle cx="110" cy="110" r="108" opacity="0.4" />
      </g>
    </svg>
  );
}

export function Disc({
  className = "",
  size = 120,
  color = "var(--accent)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "999px",
        background: color,
        pointerEvents: "none",
      }}
    />
  );
}

// A short hand-drawn red tick/line, echoing a marking-pen stroke.
export function PenTick({
  className = "",
  width = 84,
  color = "var(--red-600)",
}: {
  className?: string;
  width?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={width * 0.42}
      viewBox="0 0 84 36"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <path
        d="M4 20C10 27 16 30 22 27C29 23 24 12 30 12C37 12 40 30 52 28C66 26 70 8 80 4"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A small plus/cross — echoes a marked-correct tick and adds rhythm to space.
export function Plus({
  className = "",
  size = 22,
  color = "var(--accent)",
  stroke = 3,
}: {
  className?: string;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <path d="M12 4V20M4 12H20" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

// A thin rounded-square outline, tilted — a quiet geometric counterpoint to the rings.
export function Frame({
  className = "",
  size = 90,
  stroke = "var(--red-200)",
}: {
  className?: string;
  size?: number;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <rect x="8" y="8" width="74" height="74" rx="18" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

// Faint dotted grid used behind some sections (like ruled paper margins).
export function DotField({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(var(--line-strong) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        opacity: 0.5,
      }}
    />
  );
}
