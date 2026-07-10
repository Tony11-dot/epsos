import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session-cookie";

// ─────────────────────────────────────────────────────────────────────────
// Password auth with a signed (HMAC-SHA256) session cookie.
// No database: a valid password mints a signed token; pages/API verify the
// signature and expiry. Secret + password come from env.
// ─────────────────────────────────────────────────────────────────────────

export { SESSION_COOKIE };
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || "epsos-dev-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Create a signed token: base64url(exp).sig */
export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(String(exp)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify a token's signature and expiry (Edge/runtime-safe: pure crypto). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(Buffer.from(payload, "base64url").toString("utf8"));
  return Number.isFinite(exp) && exp * 1000 > Date.now();
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "epsos2024";
  const a = Buffer.from(input || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
