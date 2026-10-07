import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "giriraj_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 30; // 30 days

// No fallback: if ADMIN_PASSWORD isn't configured, admin login is
// disabled rather than silently accepting a guessable default.
function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sign(value: string, password: string): string {
  return createHmac("sha256", password).update(`giriraj-admin:${value}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(password: unknown): boolean {
  const expected = getPassword();
  if (!expected || typeof password !== "string") return false;
  return safeEqual(password, expected);
}

/**
 * The session cookie is "<expiry>.<signature>". The signature is keyed by
 * the admin password, so changing ADMIN_PASSWORD logs every admin out, and
 * the expiry inside it means a copied cookie stops working after 30 days.
 */
export async function setAdminCookie(): Promise<void> {
  const password = getPassword();
  if (!password) return;
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const store = await cookies();
  store.set(COOKIE_NAME, `${expires}.${sign(String(expires), password)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminRequest(): Promise<boolean> {
  const password = getPassword();
  if (!password) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(expires, password));
}
