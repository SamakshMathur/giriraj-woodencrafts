/**
 * Converts any uploaded image file to WebP in the browser (canvas-based),
 * so every admin-uploaded photo is stored in a small, modern format
 * regardless of what format it came in as (PNG, JPEG, HEIC, etc.).
 * Falls back to the original file if conversion isn't possible.
 */
// Longest side, in pixels. Phone photos are often 4000px+ and several MB,
// and Vercel rejects request bodies over about 4.5MB, so big photos are
// scaled down before upload. 2400px is still sharp on large screens.
const MAX_DIMENSION = 2400;

export async function convertToWebp(file: File, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    // Already a small-enough WebP: keep it as-is.
    if (file.type === "image/webp" && scale === 1 && file.size < 3 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return file;

    const webpName = file.name.replace(/\.[^./\\]+$/, "") + ".webp";
    return new File([blob], webpName, { type: "image/webp" });
  } catch {
    // Some formats (e.g. certain HEIC variants) aren't decodable by the
    // browser's canvas — keep the original rather than fail the upload.
    return file;
  }
}
