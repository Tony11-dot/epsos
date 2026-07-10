"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import { saveContentAction, logoutAction } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import {
  IdentityEditor,
  NavEditor,
  HeroEditor,
  AboutEditor,
  CoursesEditor,
  NewsEditor,
  MentorsEditor,
  HonorEditor,
  ControlEditor,
  ControlSiteIdentityEditor,
  ControlSiteRegistrationEditor,
  ControlSiteFooterEditor,
  AppEditor,
  ContactEditor,
  RegistrationEditor,
  FooterEditor,
  type Patch,
} from "./sections";

type Editor = (p: { c: SiteContent; patch: Patch }) => React.ReactNode;

const SECTIONS: { key: string; label: string; icon: string; Comp: Editor }[] = [
  { key: "identity", label: "الهوية والألوان", icon: "palette", Comp: IdentityEditor },
  { key: "nav", label: "التنقّل", icon: "layers", Comp: NavEditor },
  { key: "hero", label: "الواجهة الرئيسية", icon: "home", Comp: HeroEditor },
  { key: "about", label: "من نحن", icon: "shield", Comp: AboutEditor },
  { key: "courses", label: "الدورات", icon: "book", Comp: CoursesEditor },
  { key: "news", label: "الأخبار", icon: "news", Comp: NewsEditor },
  { key: "mentors", label: "المحاضرون", icon: "users", Comp: MentorsEditor },
  { key: "honor", label: "لوحة الأوائل", icon: "medal", Comp: HonorEditor },
  { key: "control", label: "كونترول (تمهيد)", icon: "blocks", Comp: ControlEditor },
  { key: "controlSiteId", label: "موقع كونترول — الهوية", icon: "palette", Comp: ControlSiteIdentityEditor },
  { key: "controlSiteReg", label: "موقع كونترول — التسجيل", icon: "pen", Comp: ControlSiteRegistrationEditor },
  { key: "controlSiteFoot", label: "موقع كونترول — التذييل", icon: "gear", Comp: ControlSiteFooterEditor },
  { key: "app", label: "تطبيقنا", icon: "eye", Comp: AppEditor },
  { key: "registration", label: "التسجيل والنموذج", icon: "pen", Comp: RegistrationEditor },
  { key: "contact", label: "التواصل", icon: "contact", Comp: ContactEditor },
  { key: "footer", label: "التذييل", icon: "gear", Comp: FooterEditor },
];

export default function AdminApp({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  // Last-saved snapshot — "revert" restores this.
  const [baseline, setBaseline] = useState<SiteContent>(initial);
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"saved" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patch = useCallback<Patch>((fn) => {
    setContent((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
    setDirty(true);
    setFlash(null);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    const res = await saveContentAction(content);
    setSaving(false);
    if (res.ok) {
      setBaseline(content);
      setDirty(false);
      setFlash("saved");
      setTimeout(() => setFlash(null), 2500);
    } else {
      setError(res.error || "تعذّر الحفظ");
    }
  }, [content]);

  const revert = useCallback(() => {
    if (!dirty) return;
    if (!window.confirm("التراجع عن كل التغييرات غير المحفوظة والعودة لآخر نسخة محفوظة؟")) return;
    setContent(structuredClone(baseline));
    setDirty(false);
    setError(null);
    setFlash(null);
  }, [dirty, baseline]);

  // Warn on navigating away with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, saving, save]);

  const active = SECTIONS.find((s) => s.key === activeKey) ?? SECTIONS[0];
  const ActiveComp = active.Comp;

  return (
    <div className="flex min-h-dvh bg-paper-2">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col border-l border-line bg-paper lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="font-display text-2xl font-bold text-ink">إبسوس</span>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--red-600)" }} />
          <span className="mr-auto rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            الإدارة
          </span>
        </div>
        <div className="hairline mx-4" />
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {SECTIONS.map((s) => {
              const isActive = s.key === activeKey;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setActiveKey(s.key)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[0.95rem] transition-colors"
                    style={{
                      background: isActive ? "var(--red-600)" : "transparent",
                      color: isActive ? "white" : "var(--ink-soft)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    <Icon name={s.icon} size={19} />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hairline mx-4" />
        <div className="flex flex-col gap-2 p-4">
          <a href="/" target="_blank" className="btn btn-ghost justify-start px-3 py-2 text-sm">
            <Icon name="eye" size={17} /> عرض الموقع
          </a>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-ghost w-full justify-start px-3 py-2 text-sm">
              <Icon name="logout" size={17} /> تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-[var(--paper)]/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
            {/* Mobile section switcher */}
            <div className="lg:hidden">
              <select
                value={activeKey}
                onChange={(e) => setActiveKey(e.target.value)}
                className="admin-input py-2 text-sm"
                aria-label="القسم"
              >
                {SECTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden items-center gap-2.5 lg:flex">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "var(--red-50)", color: "var(--red-700)" }}
              >
                <Icon name={active.icon} size={19} />
              </span>
              <h1 className="font-display text-lg font-bold text-ink">{active.label}</h1>
            </div>

            <div className="mr-auto flex items-center gap-3">
              <span className="text-sm" style={{ color: dirty ? "var(--red-700)" : "var(--muted)" }}>
                {saving
                  ? "جارٍ الحفظ…"
                  : flash === "saved"
                    ? "تم الحفظ ✓"
                    : dirty
                      ? "تغييرات غير محفوظة"
                      : "كل التغييرات محفوظة"}
              </span>
              <button
                type="button"
                onClick={revert}
                disabled={!dirty || saving}
                className="btn btn-ghost px-4 py-2.5 text-sm disabled:opacity-40"
                title="التراجع عن التغييرات غير المحفوظة"
              >
                <Icon name="arrowRight" size={16} />
                تراجع
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!dirty || saving}
                className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
              >
                <Icon name="save" size={17} />
                حفظ
              </button>
            </div>
          </div>
          {error ? (
            <p className="px-4 pb-3 text-sm text-red-700 sm:px-8" role="alert">
              {error}
            </p>
          ) : null}
        </header>

        {/* Mobile logout / view bar */}
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2 lg:hidden">
          <a href="/" target="_blank" className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
            <Icon name="eye" size={16} /> عرض الموقع
          </a>
          <form action={logoutAction}>
            <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <Icon name="logout" size={16} /> خروج
            </button>
          </form>
        </div>

        {/* Panel */}
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-5">
            <ActiveComp c={content} patch={patch} />
          </div>
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
