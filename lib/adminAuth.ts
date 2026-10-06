import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "giriraj_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// No fallback: if ADMIN_PASSWORD isn't configured, admin login is
// disabled rather than silently accepting a guessable default.
function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sign(value: string, password: string): string {
  return createHmac("sha256", password).update(value).digest("hex");
}

export function checkPassword(password: unknown): boolean {
  const expected = getPassword();
  if (!expected || typeof password !== "string") return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminCookie(): Promise<void> {
  const password = getPassword();
  if (!password) return;
  const store = await cookies();
  store.set(COOKIE_NAME, sign("admin", password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const password = getPassword();
  if (!token || !password) return false;

  const expected = sign("admin", password);
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(tokenBuf, expectedBuf);
}
