"use client";

import { parseColor, formatOklch, oklchToHex, ramp } from "@/lib/color";

// One-click brand-colour picker. The whole red ramp derives from this single
// value; a live preview shows the generated scale.
export default function ColorField({
  value,
  onChange,
  label,
  hint,
  showRamp = true,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  hint?: string;
  showRamp?: boolean;
}) {
  const hex = oklchToHex(value);
  const scale = showRamp ? ramp(parseColor(value)) : null;

  return (
    <div className="flex flex-col gap-3">
      <span className="admin-field-label">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <label
          className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-line-strong"
          style={{ background: value }}
          title="اختر اللون"
        >
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(formatOklch(parseColor(e.target.value)))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          dir="ltr"
          className="admin-input num max-w-[16rem] text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>

      {scale ? (
        <div className="flex overflow-hidden rounded-lg border border-line" aria-hidden="true">
          {Object.keys(scale).map((k) => (
            <span key={k} className="h-7 flex-1" style={{ background: scale[Number(k)] }} title={k} />
          ))}
        </div>
      ) : null}

      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}
