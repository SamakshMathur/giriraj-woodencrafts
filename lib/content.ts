import { del, list, put } from "@vercel/blob";

const IMAGES_PREFIX = "images/";
const TEXT_PREFIX = "overrides/text/";

export type TextOverrides = Record<string, string>;
/** null means explicitly emptied (blank container), missing key means "use the default". */
export type ImageOverrides = Record<string, string | null>;

const token = () => process.env.BLOB_READ_WRITE_TOKEN;

function safeIdOf(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "-");
}

// Every edit (image upload, image removal, text change) is written to its
// own uniquely-timestamped blob under "{prefix}{id}-{13-digit-ms}.{ext}" —
// never a shared file that two requests could read-modify-write at once.
// "Current value for id X" is just "the entry with the largest timestamp
// among all blobs whose id is X", found by listing. Two edits to DIFFERENT
// ids never touch each other's data at all (different pathnames), and two
// concurrent edits to the SAME id just produce two independent blobs, with
// "latest timestamp wins" being well-defined and lossless — no compare-
// and-swap, no etags, nothing to race. Two prior fix attempts based on
// optimistic concurrency (ifMatch/etags) on a single shared JSON blob both
// broke under real concurrent writes; this design has no shared mutable
// state for a race to happen to.
const ENTRY_PATTERN = /^(.+)-(\d{13})\.([a-zA-Z]+)$/;

type Entry = { id: string; timestamp: number; ext: string; url: string };

function parseEntries(prefix: string, blobs: { pathname: string; url: string }[]): Entry[] {
  const entries: Entry[] = [];
  for (const blob of blobs) {
    if (!blob.pathname.startsWith(prefix)) continue;
    const match = blob.pathname.slice(prefix.length).match(ENTRY_PATTERN);
    if (!match) continue;
    entries.push({ id: match[1], timestamp: Number(match[2]), ext: match[3], url: blob.url });
  }
  return entries;
}

function latestPerId(entries: Entry[]): Map<string, Entry> {
  const latest = new Map<string, Entry>();
  for (const entry of entries) {
    const current = latest.get(entry.id);
    if (!current || entry.timestamp > current.timestamp) {
      latest.set(entry.id, entry);
    }
  }
  return latest;
}

async function listAll(prefix: string): Promise<{ pathname: string; url: string }[]> {
  const blobs: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, cursor, token: token() });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return blobs;
}

/**
 * Deletes this id's entries strictly older than the one at `keepPathname`
 * — never "everything except my own write". If a concurrent write to the
 * same id lands a newer entry in between, this must leave it alone:
 * deleting "everything but mine" would race two concurrent uploads into
 * deleting each other's newest blob and leaving nothing behind (observed
 * directly — two simultaneous uploads to the same id resolved every entry
 * away). Comparing by timestamp instead means both cleanup calls
 * independently agree on which single entry is newest, regardless of
 * interleaving.
 */
async function cleanupOldEntries(prefix: string, id: string, keepPathname: string): Promise<void> {
  const keepMatch = keepPathname.slice(prefix.length).match(ENTRY_PATTERN);
  if (!keepMatch) return;
  const keepTimestamp = Number(keepMatch[2]);

  const blobs = await listAll(`${prefix}${id}-`);
  const entries = parseEntries(prefix, blobs);
  const toDelete = entries.filter((e) => e.timestamp < keepTimestamp).map((e) => e.url);
  if (toDelete.length > 0) {
    await del(toDelete, { token: token() }).catch(() => {});
  }
}

export async function getImageOverrides(): Promise<ImageOverrides> {
  const blobs = await listAll(IMAGES_PREFIX);
  const latest = latestPerId(parseEntries(IMAGES_PREFIX, blobs));
  const result: ImageOverrides = {};
  for (const [id, entry] of latest) {
    result[id] = entry.ext === "removed" ? null : entry.url;
  }
  return result;
}

/**
 * Records that `id` now points at `pathname` (a blob already uploaded by
 * the caller with a unique pathname under images/). Cleans up that id's
 * older entries so storage doesn't grow unbounded.
 */
export async function setImageOverride(id: string, pathname: string): Promise<void> {
  await cleanupOldEntries(IMAGES_PREFIX, safeIdOf(id), pathname);
}

export async function setImageOverrideEmpty(id: string): Promise<void> {
  const safeId = safeIdOf(id);
  // Vercel Blob's `put` rejects an empty-string body ("body is required"),
  // so the marker needs at least one byte — its content is never read.
  const blob = await put(`${IMAGES_PREFIX}${safeId}-${Date.now()}.removed`, "1", {
    access: "public",
    addRandomSuffix: false,
    token: token(),
  });
  await cleanupOldEntries(IMAGES_PREFIX, safeId, blob.pathname);
}

export async function clearAllImageOverrides(): Promise<void> {
  const blobs = await listAll(IMAGES_PREFIX);
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url), { token: token() }).catch(() => {});
  }
}

export async function getTextOverrides(): Promise<TextOverrides> {
  const blobs = await listAll(TEXT_PREFIX);
  const latest = latestPerId(parseEntries(TEXT_PREFIX, blobs));
  const result: TextOverrides = {};
  await Promise.all(
    Array.from(latest.entries()).map(async ([id, entry]) => {
      try {
        const res = await fetch(entry.url, { cache: "no-store" });
        if (res.ok) result[id] = await res.text();
      } catch {
        // skip this id on failure — falls back to the default at render time
      }
    })
  );
  return result;
}

export async function setTextOverride(id: string, value: string): Promise<void> {
  const safeId = safeIdOf(id);
  const blob = await put(`${TEXT_PREFIX}${safeId}-${Date.now()}.txt`, value, {
    access: "public",
    addRandomSuffix: false,
    contentType: "text/plain; charset=utf-8",
    token: token(),
  });
  await cleanupOldEntries(TEXT_PREFIX, safeId, blob.pathname);
}

export async function clearTextOverride(id: string): Promise<void> {
  const safeId = safeIdOf(id);
  const blobs = await listAll(`${TEXT_PREFIX}${safeId}-`);
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url), { token: token() }).catch(() => {});
  }
}

export async function clearAllTextOverrides(): Promise<void> {
  const blobs = await listAll(TEXT_PREFIX);
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url), { token: token() }).catch(() => {});
  }
}
