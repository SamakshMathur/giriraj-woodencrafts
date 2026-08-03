import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { addSubmission } from "@/lib/submissions";

// Public endpoint — any site visitor can submit a custom design request.
// No admin auth here on purpose, but inputs are validated/capped below.

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 200;
const MAX_PHONE_LENGTH = 40;

function clip(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const name = clip(form.get("name"), MAX_NAME_LENGTH);
  const phone = clip(form.get("phone"), MAX_PHONE_LENGTH);
  const email = clip(form.get("email"), MAX_NAME_LENGTH);
  const note = clip(form.get("note"), MAX_TEXT_LENGTH);
  const selectionsRaw = clip(form.get("selections"), MAX_TEXT_LENGTH);
  const file = form.get("file");

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
  }

  let selections: Record<string, string> = {};
  if (selectionsRaw) {
    try {
      const parsed = JSON.parse(selectionsRaw);
      if (parsed && typeof parsed === "object") {
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof key === "string" && typeof value === "string") {
            selections[key] = value.slice(0, 100);
          }
        }
      }
    } catch {
      selections = {};
    }
  }

  let imageUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "File must be an image" }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ ok: false, error: "Image is too large (max 8MB)" }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const extension = file.type === "image/webp" ? "webp" : file.type.split("/")[1] || "bin";
    const blob = await put(`submissions/${id}.${extension}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    imageUrl = blob.url;
  }

  const submission = await addSubmission({
    name,
    phone,
    email: email || undefined,
    selections,
    note: note || undefined,
    imageUrl,
  });

  return NextResponse.json({ ok: true, id: submission.id });
}
