"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SiteContent } from "@/lib/types";
import { submitRegistrationAction } from "@/app/register-actions";
import SectionHead from "./SectionHead";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { Rings } from "@/components/BrandShapes";

type Courses = { id: string; title: string }[];
type Status = "empty" | "valid" | "invalid";

const emptyForm = { firstName: "", lastName: "", phone: "", city: "", email: "", course: "" };

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Register({
  registration,
  courses,
  division = "إبسوس",
}: {
  registration: SiteContent["registration"];
  courses: Courses;
  division?: string;
}) {
  const L = registration.labels;
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onPick = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      if (title) setForm((f) => ({ ...f, course: title }));
      firstFieldRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("epsos:register-course", onPick as EventListener);
    return () => window.removeEventListener("epsos:register-course", onPick as EventListener);
  }, []);

  // Per-field validity powers both the completion bar and the field checks.
  const status = useMemo<Record<keyof typeof form, Status>>(() => {
    const digits = form.phone.replace(/[^\d]/g, "");
    return {
      firstName: form.firstName.trim() ? "valid" : "empty",
      lastName: form.lastName.trim() ? "valid" : "empty",
      phone: !form.phone.trim() ? "empty" : digits.length >= 7 ? "valid" : "invalid",
      city: form.city ? "valid" : "empty",
      email: !form.email.trim() ? "empty" : emailOk(form.email.trim()) ? "valid" : "invalid",
      course: form.course ? "valid" : "empty",
    };
  }, [form]);

  const keys = Object.keys(status) as (keyof typeof form)[];
  const completed = keys.filter((k) => status[k] === "valid").length;
  const percent = Math.round((completed / keys.length) * 100);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitRegistrationAction({ ...form, division });
    setSubmitting(false);
    if (res.ok) setDone(true);
    else setError(res.error || "تعذّر الإرسال. حاول مرة أخرى.");
  }

  return (
    <section id="register" className="section relative overflow-hidden" style={{ background: "var(--paper-2)" }}>
      <Rings className="pointer-events-none absolute -left-24 top-10 opacity-40" size={260} stroke="var(--red-100)" />
      <div className="container-x relative">
        <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Narrative */}
          <div>
            <SectionHead kicker={registration.kicker} title={registration.title} intro={registration.intro} />
            <ul className="mt-8 flex flex-col gap-3.5">
              {["متابعة فرديّة لكل طالب", "مجموعات صغيرة وأماكن محدودة", "فريق يتواصل معك لاختيار الأنسب"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink-soft">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--red-600)", color: "white" }}>
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <Reveal delay={80}>
            <div className="relative rounded-3xl border border-line bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-8">
              {done ? (
                <SuccessState
                  title={registration.successTitle}
                  body={registration.successBody}
                  onReset={() => {
                    setForm({ ...emptyForm });
                    setDone(false);
                  }}
                />
              ) : (
                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                  {/* Gamified progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">اكتمال النموذج</span>
                      <span className="num font-bold text-red-700">{percent}٪</span>
                    </div>
                    <div className="reg-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                      <div className="reg-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <RegField id="reg-first" label={L.firstName} required status={status.firstName}>
                      <input id="reg-first" ref={firstFieldRef} className="reg-control" data-filled={status.firstName === "valid"}
                        value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" required />
                    </RegField>
                    <RegField id="reg-last" label={L.lastName} status={status.lastName}>
                      <input id="reg-last" className="reg-control" data-filled={status.lastName === "valid"}
                        value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
                    </RegField>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <RegField id="reg-phone" label={L.phone} required status={status.phone}>
                      <input id="reg-phone" type="tel" dir="ltr" inputMode="tel" className="reg-control text-right"
                        data-filled={status.phone === "valid"} aria-invalid={status.phone === "invalid"}
                        value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" required />
                    </RegField>
                    <RegField id="reg-city" label={L.city} status={status.city}>
                      <div className="reg-select-wrap">
                        <select id="reg-city" className="reg-control reg-select" data-filled={status.city === "valid"}
                          value={form.city} onChange={(e) => set("city", e.target.value)}>
                          <option value="">{L.cityPlaceholder}</option>
                          {registration.cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <span className="reg-chevron"><Icon name="down" size={18} /></span>
                      </div>
                    </RegField>
                  </div>

                  <RegField id="reg-email" label={L.email} status={status.email}>
                    <input id="reg-email" type="email" dir="ltr" className="reg-control text-right"
                      data-filled={status.email === "valid"} aria-invalid={status.email === "invalid"}
                      value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                  </RegField>

                  <RegField id="reg-course" label={L.course} status={status.course}>
                    <div className="reg-select-wrap">
                      <select id="reg-course" className="reg-control reg-select" data-filled={status.course === "valid"}
                        value={form.course} onChange={(e) => set("course", e.target.value)}>
                        <option value="">{L.coursePlaceholder}</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                      <span className="reg-chevron"><Icon name="down" size={18} /></span>
                    </div>
                  </RegField>

                  {error ? (
                    <p role="alert" className="rounded-xl px-3.5 py-2.5 text-sm"
                      style={{ background: "var(--red-50)", color: "var(--red-800)", border: "1px solid var(--red-100)" }}>
                      {error}
                    </p>
                  ) : null}

                  <button type="submit" disabled={submitting} className="btn btn-primary mt-1 w-full py-3.5 text-[1.02rem] disabled:opacity-70">
                    {submitting ? "جارٍ الإرسال…" : L.submit}
                    {!submitting && <Icon name="arrow" size={18} />}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-muted">{registration.consentNote}</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RegField({
  id,
  label,
  required,
  status,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  status: Status;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label htmlFor={id} className="reg-label !mb-0">
          {label} {required ? <span style={{ color: "var(--red-600)" }}>*</span> : null}
        </label>
        {status === "valid" ? (
          <span className="reg-check" aria-hidden="true">
            <Icon name="check" size={12} />
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SuccessState({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="reg-success-badge mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--red-600)", color: "white" }}>
        <Icon name="check" size={32} />
      </span>
      <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-ink-soft">{body}</p>
      <button type="button" onClick={onReset} className="btn btn-ghost mt-6 text-sm">
        إرسال طلب آخر
      </button>
    </div>
  );
}
