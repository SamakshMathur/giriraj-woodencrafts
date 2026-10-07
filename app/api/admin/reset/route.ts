import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { withErrorHandling } from "@/lib/api";
import { clearAllTextOverrides, clearAllImageOverrides } from "@/lib/content";

export const POST = withErrorHandling(async () => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await clearAllTextOverrides();
  await clearAllImageOverrides();
  return NextResponse.json({ ok: true });
});
