import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getFileInfo, openDownloadStream } from "@/lib/images";

// Images are served here instead of from a dedicated CDN (that's the
// trade-off of moving off Vercel Blob for now — see conversation). Each
// fileId is permanent/immutable once uploaded (edits create a *new*
// fileId, never overwrite an existing one), so a long, immutable
// Cache-Control is safe and lets browsers/edge caches avoid re-hitting
// this route on repeat views.
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let fileId: ObjectId;
  try {
    fileId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const info = await getFileInfo(fileId);
  if (!info) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const stream = await openDownloadStream(fileId);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  const buffer = Buffer.concat(chunks);

  const contentType =
    (info.metadata as { contentType?: string } | undefined)?.contentType ||
    "application/octet-stream";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
