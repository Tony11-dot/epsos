"use client";

import type { ReactNode } from "react";

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="admin-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className="admin-input num"
      value={Number.isFinite(value) ? value : ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="admin-textarea"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Multi-paragraph / multi-line list editor backed by a string[]: one line per item.
export function LinesArea({
  value,
  onChange,
  rows = 4,
  hint,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        className="admin-textarea"
        rows={rows}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
      <span className="text-xs text-muted">{hint ?? "كل سطر يُعرض كعنصر مستقل."}</span>
    </div>
  );
}
