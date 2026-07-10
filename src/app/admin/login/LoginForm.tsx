"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";
import { Icon } from "@/components/Icon";
import { Rings, Disc } from "@/components/BrandShapes";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <Rings className="pointer-events-none absolute -top-24 right-[-80px] opacity-50 spin-slow" size={320} stroke="var(--red-100)" />
      <Rings className="pointer-events-none absolute bottom-[-90px] left-[-70px] opacity-40" size={260} stroke="var(--red-100)" />
      <Disc className="pointer-events-none absolute left-[16%] top-[18%] float-soft" size={12} color="var(--accent)" />

      <div className="relative w-full max-w-[26rem]">
        <div className="mb-7 text-center">
          <span className="relative inline-flex items-center gap-2">
            <span className="font-display text-3xl font-bold text-ink">إبسوس</span>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--red-600)" }} />
          </span>
          <p className="mt-2 text-sm text-muted">لوحة التحكم — الدخول للمشرفين</p>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: "var(--red-50)", color: "var(--red-700)" }}
            >
              <Icon name="shield" size={22} />
            </span>
            <div>
              <h1 className="font-display text-lg font-bold text-ink">تسجيل الدخول</h1>
              <p className="text-sm text-muted">أدخل كلمة المرور للمتابعة</p>
            </div>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">كلمة المرور</span>
              <input
                type="password"
                name="password"
                autoFocus
                required
                autoComplete="current-password"
                className="admin-input"
                placeholder="••••••••"
              />
            </label>

            {state.error ? (
              <p
                role="alert"
                className="rounded-xl px-3 py-2.5 text-sm"
                style={{ background: "var(--red-50)", color: "var(--red-800)", border: "1px solid var(--red-100)" }}
              >
                {state.error}
              </p>
            ) : null}

            <button type="submit" disabled={pending} className="btn btn-primary mt-1 w-full disabled:opacity-70">
              {pending ? "جارٍ الدخول…" : "دخول"}
              {!pending && <Icon name="arrow" size={18} />}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          محميّة بجلسة موقّعة — الخروج التلقائي بعد ٧ أيام.
        </p>
      </div>
    </main>
  );
}
