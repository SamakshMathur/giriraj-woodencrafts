import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { deleteImage, imageUrl, uploadImage } from "./images";

const TEXT_COLLECTION = "textOverrides";
const IMAGE_COLLECTION = "imageOverrides";

export type TextOverrides = Record<string, string>;
/** null means explicitly emptied (blank container), missing key means "use the default". */
export type ImageOverrides = Record<string, string | null>;

type TextDoc = { _id: string; value: string; updatedAt: Date };
type ImageDoc = { _id: string; fileId: ObjectId | null; updatedAt: Date };

// Previously this was hand-rolled on top of Vercel Blob: first a single
// shared JSON file with no concurrency control at all (the original
// "removed images reappear" bug), then two attempts at optimistic
// concurrency via etags that both broke under genuine concurrent writes,
// then a from-scratch per-id-timestamped-file scheme that finally got
// concurrency right but still depended on Vercel Blob's storage quotas
// (which is what actually broke uploads — see conversation). MongoDB's
// findOneAndUpdate is atomic per-document natively, so the entire
// concurrency problem this file used to work around simply doesn't exist
// here — two simultaneous writes to the same id are serialized by the
// database itself, not by application code.

// Reads degrade to "no overrides" on a DB outage instead of crashing the
// page — a transient connectivity hiccup (including at `next build` time,
// when Next.js prerenders a static /_not-found fallback that still goes
// through this same template) should show default content, not a 500.
// Writes (below) deliberately do NOT catch errors: a failed save must
// surface as a failure to the admin, not silently pretend to succeed.
export async function getTextOverrides(): Promise<TextOverrides> {
  try {
    const db = await getDb();
    const docs = await db.collection<TextDoc>(TEXT_COLLECTION).find().toArray();
    const result: TextOverrides = {};
    for (const doc of docs) result[doc._id] = doc.value;
    return result;
  } catch {
    return {};
  }
}

export async function getImageOverrides(): Promise<ImageOverrides> {
  try {
    const db = await getDb();
    const docs = await db.collection<ImageDoc>(IMAGE_COLLECTION).find().toArray();
    const result: ImageOverrides = {};
    for (const doc of docs) result[doc._id] = doc.fileId ? imageUrl(doc.fileId) : null;
    return result;
  } catch {
    return {};
  }
}

export async function setTextOverride(id: string, value: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<TextDoc>(TEXT_COLLECTION)
    .updateOne({ _id: id }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
}

export async function clearTextOverride(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteOne({ _id: id });
}

export async function clearAllTextOverrides(): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteMany({});
}

/**
 * Uploads `file` to GridFS and atomically points `id` at it, deleting
 * whatever this id previously pointed at (a prior image or a "removed"
 * marker). Returns the servable URL.
 */
export async function setImageOverride(
  id: string,
  file: File,
  contentType: string
): Promise<string> {
  const fileId = await uploadImage(file, id, contentType);

  const db = await getDb();
  const previous = await db
    .collection<ImageDoc>(IMAGE_COLLECTION)
    .findOneAndUpdate(
      { _id: id },
      { $set: { fileId, updatedAt: new Date() } },
      { upsert: true, returnDocument: "before" }
    );

  if (previous?.fileId) {
    await deleteImage(previous.fileId);
  }

  return imageUrl(fileId);
}

export async function setImageOverrideEmpty(id: string): Promise<void> {
  const db = await getDb();
  const previous = await db
    .collection<ImageDoc>(IMAGE_COLLECTION)
    .findOneAndUpdate(
      { _id: id },
      { $set: { fileId: null, updatedAt: new Date() } },
      { upsert: true, returnDocument: "before" }
    );

  if (previous?.fileId) {
    await deleteImage(previous.fileId);
  }
}

export async function clearAllImageOverrides(): Promise<void> {
  const db = await getDb();
  const docs = await db
    .collection<ImageDoc>(IMAGE_COLLECTION)
    .find({ fileId: { $ne: null } })
    .toArray();
  await Promise.all(docs.map((d) => (d.fileId ? deleteImage(d.fileId) : Promise.resolve())));
  await db.collection<ImageDoc>(IMAGE_COLLECTION).deleteMany({});
}
