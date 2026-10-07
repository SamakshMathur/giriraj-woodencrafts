import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "./db";

// Shared GridFS plumbing used by both admin content overrides
// (lib/content.ts) and customer design-request submissions
// (lib/submissions.ts) — every uploaded image, regardless of source,
// lives in this one bucket and is served through app/api/images/[id].
const BUCKET_NAME = "images";

async function getImagesBucket(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

/**
 * Photo formats accepted for upload. Deliberately excludes SVG: an SVG can
 * contain scripts, which would run on this site's own domain if someone
 * opened the uploaded file directly.
 */
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
]);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

/** Returns an error message if the file isn't an acceptable photo, else null. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Please upload a photo (JPG, PNG, WebP, GIF, AVIF or HEIC).";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "This photo is too large. Please use one under 8MB.";
  }
  return null;
}

export function imageUrl(fileId: ObjectId): string {
  return `/api/images/${fileId.toHexString()}`;
}

/** Uploads a File's bytes to GridFS and returns its new, unique ObjectId. */
export async function uploadImage(
  file: File,
  filename: string,
  contentType: string
): Promise<ObjectId> {
  const bucket = await getImagesBucket();
  const buffer = Buffer.from(await file.arrayBuffer());
  // This driver version dropped the old top-level `contentType` upload
  // option — it now lives in `metadata`, read back in getFileInfo below.
  const uploadStream = bucket.openUploadStream(filename, { metadata: { contentType } });
  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(buffer);
  });
  return uploadStream.id as ObjectId;
}

export async function deleteImage(fileId: ObjectId): Promise<void> {
  const bucket = await getImagesBucket();
  await bucket.delete(fileId).catch(() => {});
}

export async function openDownloadStream(fileId: ObjectId) {
  const bucket = await getImagesBucket();
  return bucket.openDownloadStream(fileId);
}

export async function getFileInfo(fileId: ObjectId) {
  const db = await getDb();
  return db.collection(`${BUCKET_NAME}.files`).findOne({ _id: fileId });
}
