"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isAuthenticated,
  sessionCookieOptions,
} from "@/lib/auth";
import { saveContent } from "@/lib/store";
import { storeImage } from "@/lib/upload";
import type { SiteContent } from "@/lib/types";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    return { error: "كلمة المرور غير صحيحة. حاول مرة أخرى." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveContentAction(
  content: SiteContent
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { ok: false, error: "غير مصرّح" };
  try {
    await saveContent(content);
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "تعذّر الحفظ" };
  }
}

export async function uploadImageAction(
  formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!(await isAuthenticated())) return { ok: false, error: "غير مصرّح" };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "لم يتم اختيار ملف" };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "الملف يجب أن يكون صورة" };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "حجم الصورة يتجاوز 8 ميغابايت" };
  }
  try {
    const { url } = await storeImage(file);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "تعذّر الرفع" };
  }
}
