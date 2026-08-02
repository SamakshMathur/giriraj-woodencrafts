import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "giriraj_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "1234";
}

function sign(value: string): string {
  return createHmac("sha256", getPassword()).update(value).digest("hex");
}

export function checkPassword(password: string): boolean {
  return typeof password === "string" && password === getPassword();
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sign("admin"), {
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
  if (!token) return false;

  const expected = sign("admin");
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(tokenBuf, expectedBuf);
}
