"use server";

import { recordRegistration, type Registration } from "@/lib/registrations";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
  course: string;
  division?: string;
}

export interface RegisterResult {
  ok: boolean;
  error?: string;
}

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function submitRegistrationAction(input: RegisterInput): Promise<RegisterResult> {
  const firstName = clean(input.firstName, 80);
  const lastName = clean(input.lastName, 80);
  const phone = clean(input.phone, 40);
  const city = clean(input.city, 80);
  const email = clean(input.email, 160);
  const course = clean(input.course, 160);

  // Required: name + phone. Others optional.
  if (!firstName) return { ok: false, error: "الرجاء إدخال الاسم." };
  if (!phone || phone.replace(/[^\d]/g, "").length < 7) {
    return { ok: false, error: "الرجاء إدخال رقم هاتف صحيح." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "البريد الإلكتروني غير صحيح." };
  }

  const row: Registration = {
    firstName,
    lastName,
    phone,
    city,
    email,
    course,
    division: clean(input.division, 40) || "إبسوس",
    submittedAt: new Date().toISOString(),
  };

  const res = await recordRegistration(row);
  if (!res.ok) {
    return { ok: false, error: "تعذّر إرسال الطلب حاليًا. حاول مرة أخرى بعد قليل." };
  }
  return { ok: true };
}
