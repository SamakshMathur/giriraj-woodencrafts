/**
 * Converts any uploaded image file to WebP in the browser (canvas-based),
 * so every admin-uploaded photo is stored in a small, modern format
 * regardless of what format it came in as (PNG, JPEG, HEIC, etc.).
 * Falls back to the original file if conversion isn't possible.
 */
export async function convertToWebp(file: File, quality = 0.82): Promise<File> {
  if (file.type === "image/webp") return file;
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0);
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
