// ─────────────────────────────────────────────────────────────────────────
// Derive a full colour ramp from a single OKLCH seed.
// The admin edits ONE brand colour; the entire red scale (50→950) is
// generated here and injected as CSS variables. No dependency on CSS
// relative-colour syntax, so it renders identically everywhere.
// ─────────────────────────────────────────────────────────────────────────

export interface Oklch {
  l: number; // 0..1
  c: number; // 0..~0.37
  h: number; // 0..360
}

/** Parse "oklch(0.55 0.21 27)" | "oklch(55% 0.21 27)" | hex → Oklch. */
export function parseColor(input: string): Oklch {
  const s = (input || "").trim();
  const m = s.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (m) {
    let l = parseFloat(m[1]);
    if (m[1].includes("%")) l /= 100;
    return { l, c: parseFloat(m[2]), h: parseFloat(m[3]) };
  }
  if (s.startsWith("#")) return rgbToOklch(hexToRgb(s));
  // Sensible red fallback.
  return { l: 0.577, c: 0.214, h: 27 };
}

export function formatOklch({ l, c, h }: Oklch, alpha = 1): string {
  const L = clamp(l, 0, 1).toFixed(4);
  const C = Math.max(0, c).toFixed(4);
  const H = ((h % 360) + 360) % 360;
  return alpha < 1
    ? `oklch(${L} ${C} ${H.toFixed(2)} / ${alpha})`
    : `oklch(${L} ${C} ${H.toFixed(2)})`;
}

// Ramp targets: fixed lightness per step, chroma as a multiple of the seed's
// chroma so the ramp keeps the brand's saturation and hue.
const STEPS: Record<number, { l: number; cMul: number }> = {
  50: { l: 0.971, cMul: 0.18 },
  100: { l: 0.936, cMul: 0.34 },
  200: { l: 0.885, cMul: 0.58 },
  300: { l: 0.81, cMul: 0.82 },
  400: { l: 0.712, cMul: 0.98 },
  500: { l: 0.637, cMul: 1.02 },
  600: { l: 0.577, cMul: 1.0 },
  700: { l: 0.505, cMul: 0.9 },
  800: { l: 0.444, cMul: 0.78 },
  900: { l: 0.398, cMul: 0.66 },
  950: { l: 0.26, cMul: 0.5 },
};

export function ramp(seed: Oklch): Record<number, string> {
  const out: Record<number, string> = {};
  for (const key of Object.keys(STEPS)) {
    const step = Number(key);
    const { l, cMul } = STEPS[step];
    out[step] = formatOklch({ l, c: seed.c * cMul, h: seed.h });
  }
  return out;
}

/**
 * Build the block of CSS custom properties injected on <html>.
 * Includes the derived red ramp plus the yellow accent + its soft tints.
 */
export function brandCssVars(brandColor: string, accentColor: string): string {
  const seed = parseColor(brandColor);
  const r = ramp(seed);
  const accent = parseColor(accentColor);

  const lines: string[] = [];
  lines.push(`--brand: ${formatOklch(seed)};`);
  for (const step of Object.keys(r)) lines.push(`--red-${step}: ${r[Number(step)]};`);

  // Yellow accent + supporting tints derived from the accent seed.
  lines.push(`--accent: ${formatOklch(accent)};`);
  lines.push(`--accent-strong: ${formatOklch({ l: Math.max(0.5, accent.l - 0.12), c: accent.c * 1.02, h: accent.h })};`);
  lines.push(`--accent-soft: ${formatOklch({ l: 0.94, c: accent.c * 0.4, h: accent.h })};`);
  lines.push(`--accent-line: ${formatOklch({ l: 0.86, c: accent.c * 0.6, h: accent.h })};`);

  return `:root{${lines.join("")}}`;
}

/** OKLCH → #rrggbb (gamut-clamped). Used only to seed the native colour input. */
export function oklchToHex(input: string | Oklch): string {
  const { l, c, h } = typeof input === "string" ? parseColor(input) : input;
  const hr = (h * Math.PI) / 180;
  const a = Math.cos(hr) * c;
  const b = Math.sin(hr) * c;
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;
  let r = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  let bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;
  const gamma = (v: number) => {
    v = clamp(v, 0, 1);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  r = gamma(r);
  g = gamma(g);
  bl = gamma(bl);
  const hex = (v: number) => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(bl)}`;
}

// ── tiny colour math (hex → oklch) ─────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const Bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(A * A + Bb * Bb);
  let H = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}
