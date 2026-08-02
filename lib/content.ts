import { head, put } from "@vercel/blob";

const TEXT_PATHNAME = "overrides/text.json";
const IMAGES_PATHNAME = "overrides/images.json";

export type TextOverrides = Record<string, string>;
/** null means explicitly emptied (blank container), missing key means "use the default". */
export type ImageOverrides = Record<string, string | null>;

async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  try {
    const { url } = await head(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN });
    // Cache-bust with a query param — the blob's own CDN cache-control
    // (min 60s) would otherwise serve a stale JSON for up to a minute
    // after a save, even though this fetch itself uses cache: "no-store".
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function getTextOverrides(): Promise<TextOverrides> {
  return readJson<TextOverrides>(TEXT_PATHNAME, {});
}

export async function getImageOverrides(): Promise<ImageOverrides> {
  return readJson<ImageOverrides>(IMAGES_PATHNAME, {});
}

export async function setTextOverride(id: string, value: string): Promise<void> {
  const current = await getTextOverrides();
  current[id] = value;
  await writeJson(TEXT_PATHNAME, current);
}

export async function clearTextOverride(id: string): Promise<void> {
  const current = await getTextOverrides();
  delete current[id];
  await writeJson(TEXT_PATHNAME, current);
}

export async function clearAllTextOverrides(): Promise<void> {
  await writeJson(TEXT_PATHNAME, {});
}

export async function setImageOverride(id: string, url: string): Promise<void> {
  const current = await getImageOverrides();
  current[id] = url;
  await writeJson(IMAGES_PATHNAME, current);
}

export async function setImageOverrideEmpty(id: string): Promise<void> {
  const current = await getImageOverrides();
  current[id] = null;
  await writeJson(IMAGES_PATHNAME, current);
}

export async function clearAllImageOverrides(): Promise<void> {
  await writeJson(IMAGES_PATHNAME, {});
}
