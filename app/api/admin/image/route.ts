import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { withErrorHandling } from "@/lib/api";
import { setImageOverride, setImageOverrideEmpty } from "@/lib/content";
import { validateImageFile } from "@/lib/images";

export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const id = form?.get("id");
  const file = form?.get("file");

  if (typeof id !== "string" || !id || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "id and file are required" }, { status: 400 });
  }
  const problem = validateImageFile(file);
  if (problem) {
    return NextResponse.json({ ok: false, error: problem }, { status: 400 });
  }

  const url = await setImageOverride(id, file, file.type);
  return NextResponse.json({ ok: true, url });
});

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  }

  await setImageOverrideEmpty(id);
  return NextResponse.json({ ok: true });
});
