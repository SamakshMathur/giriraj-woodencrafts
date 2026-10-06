import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setAdminCookie } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (!checkPassword(password)) {
    // Slows down automated password guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
