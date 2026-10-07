import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setAdminCookie } from "@/lib/adminAuth";
import { clientIp, tooManyRequests } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rateLimit";

const ATTEMPTS_PER_WINDOW = 10;
const WINDOW_SECONDS = 15 * 60;

export async function POST(req: NextRequest) {
  // Cap login attempts per visitor to stop password guessing. If the
  // database is unreachable the check is skipped rather than locking the
  // admin out (nothing in admin works without the database anyway).
  try {
    const { allowed } = await consumeRateLimit(`login:${clientIp(req)}`, ATTEMPTS_PER_WINDOW, WINDOW_SECONDS);
    if (!allowed) {
      return tooManyRequests("Too many login attempts. Please wait 15 minutes and try again.");
    }
  } catch (err) {
    console.error("Login rate limit unavailable:", err);
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (!checkPassword(password)) {
    // Also slows down automated password guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
