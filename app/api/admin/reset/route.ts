import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { clearAllTextOverrides, clearAllImageOverrides } from "@/lib/content";

export async function POST() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await clearAllTextOverrides();
  await clearAllImageOverrides();
  return NextResponse.json({ ok: true });
}
