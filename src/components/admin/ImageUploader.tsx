"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { uploadImageAction } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";

export default function ImageUploader({
  value,
  onChange,
  label = "الصورة",
  shape = "rect",
  ratio = "4 / 3",
  showAlt = true,
}: {
  value: ImageRef | undefined;
  onChange: (v: ImageRef) => void;
  label?: string;
  shape?: "rect" | "circle";
  ratio?: string;
  showAlt?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = value?.url;

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImageAction(fd);
      if (res.ok && res.url) {
        onChange({ url: res.url, alt: value?.alt || "" });
      } else {
        setError(res.error || "تعذّر الرفع");
      }
    } catch {
      setError("تعذّر الرفع");
    } finally {
      setBusy(false);
    }
  }

  const isCircle = shape === "circle";

  return (
    <div className="flex flex-col gap-2">
      <span className="admin-field-label">{label}</span>
      <div className="flex items-start gap-4">
        <div
          className={`relative shrink-0 overflow-hidden border border-line-strong bg-paper-3 ${
            isCircle ? "rounded-full" : "rounded-xl"
          }`}
          style={isCircle ? { width: 84, height: 84 } : { width: 132, aspectRatio: ratio }}
        >
          {url ? (
            <Image src={url} alt={value?.alt || ""} fill sizes="132px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <Icon name="image" size={26} />
            </div>
          )}
          {busy ? (
            <div className="absolute inset-0 grid place-items-center bg-[var(--paper)]/70 text-xs font-medium text-ink">
              جارٍ الرفع…
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-ghost px-3.5 py-2 text-sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <Icon name="image" size={16} />
              {url ? "استبدال" : "رفع صورة"}
            </button>
            {url ? (
              <button
                type="button"
                className="icon-btn"
                title="إزالة الصورة"
                onClick={() => onChange({ url: "", alt: value?.alt || "" })}
              >
                <Icon name="trash" size={16} />
              </button>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          {showAlt ? (
            <input
              type="text"
              className="admin-input text-sm"
              placeholder="وصف الصورة (للوصول)"
              value={value?.alt || ""}
              onChange={(e) => onChange({ url: url || "", alt: e.target.value })}
            />
          ) : null}
          {error ? <span className="text-xs text-red-700">{error}</span> : null}
          {!url ? (
            <span className="text-xs text-muted">بدون صورة سيظهر بديل مُصمّم بألوان العلامة.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
