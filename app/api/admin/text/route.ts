import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { setTextOverride, clearTextOverride } from "@/lib/content";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, value } = body ?? {};
  if (typeof id !== "string" || !id || typeof value !== "string") {
    return NextResponse.json({ ok: false, error: "id and value are required" }, { status: 400 });
  }

  await setTextOverride(id, value);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  }

  await clearTextOverride(id);
  return NextResponse.json({ ok: true });
}
