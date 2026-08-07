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
