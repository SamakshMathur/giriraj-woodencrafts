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

// Every page reads the overrides. Loading them from MongoDB is costly on
// Cloudflare: a fresh Worker instance must open a connection and log in,
// and the login's password hashing alone can push a visit past the free
// plan's 10 ms CPU limit (Error 1102). So they are cached in two layers:
//   1. this instance's memory, for OVERRIDES_TTL_MS;
//   2. Cloudflare's shared edge cache, so a brand-new instance can serve a
//      page without touching the database at all.
// Visitors see an admin edit within about a minute. Admins always read
// fresh (see app/template.tsx), and each fresh read also refreshes the
// shared copy. Only plain data is cached, never a database connection.
const OVERRIDES_TTL_MS = 60_000;
const FAILURE_TTL_MS = 15_000;
const SHARED_CACHE_KEY = "https://girirajwoodencrafts.com/__cache/overrides-v1";

type Overrides = { text: TextOverrides; images: ImageOverrides };
let overridesCache: { value: Overrides; expiresAt: number } | null = null;

function sharedCache(): Cache | null {
  const store = (globalThis as { caches?: { default?: Cache } }).caches;
  return store?.default ?? null;
}

async function readSharedCache(): Promise<Overrides | null> {
  try {
    const hit = await sharedCache()?.match(SHARED_CACHE_KEY);
    return hit ? ((await hit.json()) as Overrides) : null;
  } catch {
    return null;
  }
}

async function writeSharedCache(value: Overrides): Promise<void> {
  try {
    await sharedCache()?.put(
      SHARED_CACHE_KEY,
      new Response(JSON.stringify(value), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${OVERRIDES_TTL_MS / 1000}`,
        },
      })
    );
  } catch {
    // The shared cache is an optimisation; failing to write it is harmless.
  }
}

export async function getOverrides({ fresh = false } = {}): Promise<Overrides> {
  const now = Date.now();
  if (!fresh) {
    if (overridesCache && overridesCache.expiresAt > now) return overridesCache.value;
    const shared = await readSharedCache();
    if (shared) {
      overridesCache = { value: shared, expiresAt: now + OVERRIDES_TTL_MS };
      return shared;
    }
  }
  try {
    const value = await readOverrides();
    overridesCache = { value, expiresAt: now + OVERRIDES_TTL_MS };
    await writeSharedCache(value);
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

/**
 * Called after any admin write: drops both cached copies so the next page
 * load in this data centre reads the change from the database.
 */
async function invalidateOverrides(): Promise<void> {
  overridesCache = null;
  try {
    await sharedCache()?.delete(SHARED_CACHE_KEY);
  } catch {
    // Harmless: the shared copy expires within a minute anyway.
  }
}

export async function setTextOverride(id: string, value: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<TextDoc>(TEXT_COLLECTION)
    .updateOne({ _id: id }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
  await invalidateOverrides();
}

export async function clearTextOverride(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteOne({ _id: id });
  await invalidateOverrides();
}

export async function clearAllTextOverrides(): Promise<void> {
  const db = await getDb();
  await db.collection<TextDoc>(TEXT_COLLECTION).deleteMany({});
  await invalidateOverrides();
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

  await invalidateOverrides();
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
  await invalidateOverrides();
}

export async function clearAllImageOverrides(): Promise<void> {
  const db = await getDb();
  const docs = await db
    .collection<ImageDoc>(IMAGE_COLLECTION)
    .find({ fileId: { $ne: null } })
    .toArray();
  await Promise.all(docs.map((d) => (d.fileId ? deleteImage(d.fileId) : Promise.resolve())));
  await db.collection<ImageDoc>(IMAGE_COLLECTION).deleteMany({});
  await invalidateOverrides();
}
