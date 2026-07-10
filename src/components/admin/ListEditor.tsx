"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";

// Generic ordered-list editor: add, remove, move up/down, collapse.
// `renderItem` edits a single item via the provided `update` patcher.
export default function ListEditor<T>({
  items,
  onChange,
  makeNew,
  itemTitle,
  itemSubtitle,
  renderItem,
  addLabel = "إضافة عنصر",
  emptyLabel = "لا توجد عناصر بعد.",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  itemTitle: (item: T, index: number) => string;
  itemSubtitle?: (item: T, index: number) => string;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel?: string;
  emptyLabel?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function updateAt(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
    setOpenIndex(j);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  }
  function add() {
    onChange([...items, makeNew()]);
    setOpenIndex(items.length);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">
          {emptyLabel}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={index} className="admin-card overflow-hidden">
                <div className="flex items-center gap-2 p-3">
                  <span className="text-muted" aria-hidden="true">
                    <Icon name="grip" size={18} />
                  </span>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-start"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold text-ink">
                        {itemTitle(item, index) || `عنصر ${index + 1}`}
                      </span>
                      {itemSubtitle ? (
                        <span className="truncate text-xs text-muted">{itemSubtitle(item, index)}</span>
                      ) : null}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="icon-btn"
                      title="تحريك لأعلى"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <Icon name="up" size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      title="تحريك لأسفل"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <Icon name="down" size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      title="حذف"
                      onClick={() => remove(index)}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      title={open ? "طيّ" : "تحرير"}
                      onClick={() => setOpenIndex(open ? null : index)}
                    >
                      <Icon name={open ? "up" : "pen"} size={16} />
                    </button>
                  </div>
                </div>

                {open ? (
                  <div className="border-t border-line bg-paper-2 p-4">
                    {renderItem(item, index, (patch) => updateAt(index, patch))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="btn btn-ghost self-start px-4 py-2 text-sm" onClick={add}>
        <Icon name="plus" size={16} />
        {addLabel}
      </button>
    </div>
  );
}
