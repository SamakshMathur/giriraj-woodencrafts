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

// MongoDB's findOneAndUpdate is atomic per document, so two simultaneous
// admin edits to the same id are serialized by the database itself, with
// no application-level locking needed.

// Reads degrade to "no overrides" on a DB outage instead of crashing the
// page: a connectivity hiccup should show default content, not a 500.
// Writes (below) deliberately do NOT catch errors: a failed save must
// surface as a failure to the admin, not silently pretend to succeed.
async function readOverrides(): Promise<{ text: TextOverrides; images: ImageOverrides }> {
  const db = await getDb();
  const [textDocs, imageDocs] = await Promise.all([
    db.collection<TextDoc>(TEXT_COLLECTION).find().toArray(),
    db.collection<ImageDoc>(IMAGE_COLLECTION).find().toArray(),
  ]);
  const text: TextOverrides = {};
  for (const doc of textDocs) text[doc._id] = doc.value;
  const images: ImageOverrides = {};
  for (const doc of imageDocs) images[doc._id] = doc.fileId ? imageUrl(doc.fileId) : null;
  return { text, images };
}

// Every page reads the overrides, and on Cloudflare a database round trip
// costs one to two seconds, so the result is kept in memory for a short
// time. Visitors see an admin edit within OVERRIDES_TTL_MS; the admin's own
// pages always read fresh (see app/template.tsx). Only plain data is
// cached, never a database connection.
const OVERRIDES_TTL_MS = 60_000;
const FAILURE_TTL_MS = 15_000;
let overridesCache: { value: { text: TextOverrides; images: ImageOverrides }; expiresAt: number } | null =
  null;

export async function getOverrides({ fresh = false } = {}): Promise<{
  text: TextOverrides;
  images: ImageOverrides;
}> {
  const now = Date.now();
  if (!fresh && overridesCache && overridesCache.expiresAt > now) return overridesCache.value;
  try {
    const value = await readOverrides();
    overridesCache = { value, expiresAt: now + OVERRIDES_TTL_MS };
    return value;
  } catch (err) {
    console.error("Could not load overrides, showing defaults:", err);
    // Remember the failure briefly so an outage doesn't make every page
    // wait for the database timeout.
    const value = overridesCache?.value ?? { text: {}, images: {} };
    overridesCache = { value, expiresAt: now + FAILURE_TTL_MS };
    return value;
  }
}

/** Called after any admin write so this instance serves the change at once. */
function invalidateOverrides(): void {
  overridesCache = null;
}

export async function setTextOverride(id: string, value: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<TextDoc>(TEXT_COLLECTION)
    .updateOne({ _id: id }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
  invalidateOverrides();
}

export async function clearTextOverride(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteOne({ _id: id });
  invalidateOverrides();
}

export async function clearAllTextOverrides(): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteMany({});
  invalidateOverrides();
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

  invalidateOverrides();
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
  invalidateOverrides();
}

export async function clearAllImageOverrides(): Promise<void> {
  const db = await getDb();
  const docs = await db
    .collection<ImageDoc>(IMAGE_COLLECTION)
    .find({ fileId: { $ne: null } })
    .toArray();
  await Promise.all(docs.map((d) => (d.fileId ? deleteImage(d.fileId) : Promise.resolve())));
  await db.collection<ImageDoc>(IMAGE_COLLECTION).deleteMany({});
  invalidateOverrides();
}
