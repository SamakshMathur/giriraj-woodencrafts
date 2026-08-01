const DB_NAME = "giriraj-admin";
const DB_VERSION = 1;
const STORE_NAME = "image-overrides";

/** Sentinel stored instead of a Blob to mean "explicitly cleared — show no
 *  image at all", as opposed to "no entry" which falls back to the default. */
const EMPTY_MARKER = "__EMPTY__";

export type OverrideState =
  | { kind: "none" }
  | { kind: "image"; url: string }
  | { kind: "empty" };

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function put(id: string, value: Blob | string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(value, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

/** Replace (or set) the override image for a given editable-image id. */
export async function setOverride(id: string, file: File): Promise<void> {
  await put(id, file);
}

/** Explicitly blank the slot — shows an empty container even if a default photo exists. */
export async function setEmpty(id: string): Promise<void> {
  await put(id, EMPTY_MARKER);
}

/** Remove the stored entry entirely, reverting it back to its default image. */
export async function clearOverride(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Remove every stored override/empty marker. */
export async function clearAllOverrides(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * The current state for an id: an uploaded image (with a blob: URL the
 * caller owns and must revoke), explicitly emptied, or no entry at all
 * (meaning "use the default").
 */
export async function getOverrideState(id: string): Promise<OverrideState> {
  if (typeof indexedDB === "undefined") return { kind: "none" };
  const db = await openDB();
  const raw = await new Promise<Blob | string | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (raw === undefined) return { kind: "none" };
  if (raw === EMPTY_MARKER) return { kind: "empty" };
  if (raw instanceof Blob) return { kind: "image", url: URL.createObjectURL(raw) };
  return { kind: "none" };
}

/** Every id that currently has a stored entry (override or empty marker). */
export async function listOverrideIds(): Promise<string[]> {
  if (typeof indexedDB === "undefined") return [];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}
