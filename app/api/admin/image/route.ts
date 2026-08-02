import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/adminAuth";
import { setImageOverride, setImageOverrideEmpty } from "@/lib/content";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const id = form?.get("id");
  const file = form?.get("file");

  if (typeof id !== "string" || !id || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "id and file are required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "file must be an image" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ ok: false, error: "file is too large (max 8MB)" }, { status: 400 });
  }

  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "-");
  const extension = file.type === "image/webp" ? "webp" : file.type.split("/")[1] || "bin";
  const pathname = `images/${safeId}.${extension}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  await setImageOverride(id, blob.url);
  return NextResponse.json({ ok: true, url: blob.url });
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

  await setImageOverrideEmpty(id);
  return NextResponse.json({ ok: true });
}
