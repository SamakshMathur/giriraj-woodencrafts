import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getFileInfo, openDownloadStream, ALLOWED_IMAGE_TYPES } from "@/lib/images";
import { withErrorHandling } from "@/lib/api";

// Uploaded images live in MongoDB (GridFS) and are served here. Each file id
// is permanent once uploaded (edits create a new id), so browsers may cache
// a photo for a year.
//
// On Cloudflare, each photo is also stored in Cloudflare's edge cache for a
// day, so repeat views skip the database entirely (a database round trip
// from a Worker costs one to two seconds).
export const dynamic = "force-dynamic";

const EDGE_CACHE_SECONDS = 60 * 60 * 24;

function edgeCache(): Cache | null {
  const store = (globalThis as { caches?: { default?: Cache } }).caches;
  return store?.default ?? null;
}

function imageHeaders(contentType: string, maxAge: string): HeadersInit {
  return {
    "Content-Type": contentType,
    "Cache-Control": maxAge,
    // Never let a browser treat an upload as a page or script, whatever
    // its declared type.
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  };
}

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    if (!ObjectId.isValid(id) || !/^[0-9a-f]{24}$/i.test(id)) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }

    const cache = edgeCache();
    const cacheKey = new Request(new URL(req.url).origin + `/api/images/${id}`);
    const cached = cache ? await cache.match(cacheKey) : undefined;
    if (cached) {
      const body = await cached.arrayBuffer();
      const type = cached.headers.get("Content-Type") || "application/octet-stream";
      return new NextResponse(body, { headers: imageHeaders(type, "public, max-age=31536000, immutable") });
    }

    const fileId = new ObjectId(id);
    const info = await getFileInfo(fileId);
    if (!info) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const stream = await openDownloadStream(fileId);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    const buffer = new Uint8Array(Buffer.concat(chunks));

    const declared = (info.metadata as { contentType?: string } | undefined)?.contentType;
    // Older uploads, or anything outside the photo allowlist, is sent as a
    // plain download rather than displayed.
    const contentType = declared && ALLOWED_IMAGE_TYPES.has(declared) ? declared : "application/octet-stream";

    if (cache) {
      await cache.put(
        cacheKey,
        new Response(buffer.slice(), { headers: imageHeaders(contentType, `public, max-age=${EDGE_CACHE_SECONDS}`) })
      );
    }

    return new NextResponse(buffer, { headers: imageHeaders(contentType, "public, max-age=31536000, immutable") });
  }
);

