import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { withErrorHandling } from "@/lib/api";
import { addImageSlot, getOverrides, removeImageSlot } from "@/lib/content";
import { validateImageFile } from "@/lib/images";

// Sections that accept added photos. Each maps to a list of extra slots
// shown after the built-in photos.
const SECTION = /^(gallery|about-workshop|product-[a-z0-9-]{1,40})$/;
const MAX_SLOTS_PER_SECTION = 200;

/** Add a photo to a section. multipart: section, file, optional label. */
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const section = form?.get("section");
  const file = form?.get("file");
  const label = form?.get("label");
  if (typeof section !== "string" || !SECTION.test(section) || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "section and file are required" }, { status: 400 });
  }
  const problem = validateImageFile(file);
  if (problem) {
    return NextResponse.json({ ok: false, error: problem }, { status: 400 });
  }
  const { slots } = await getOverrides({ fresh: true });
  if ((slots[section]?.length ?? 0) >= MAX_SLOTS_PER_SECTION) {
    return NextResponse.json({ ok: false, error: "This section already has the maximum number of photos." }, { status: 400 });
  }
  const { slot, url } = await addImageSlot(
    section,
    file,
    file.type,
    typeof label === "string" && label.trim() ? label.trim().slice(0, 60) : undefined
  );
  return NextResponse.json({ ok: true, slot, url });
});

/** Remove an added photo. JSON: { section, id } */
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const section = body?.section;
  const id = body?.id;
  if (typeof section !== "string" || !SECTION.test(section) || typeof id !== "string" || !id.startsWith(`${section}-extra-`)) {
    return NextResponse.json({ ok: false, error: "section and id are required" }, { status: 400 });
  }
  await removeImageSlot(section, id);
  return NextResponse.json({ ok: true });
});
