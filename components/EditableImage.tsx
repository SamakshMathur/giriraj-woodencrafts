"use client";

import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { getOverrideUrl, setOverride } from "@/lib/imageStore";

/**
 * Drop-in replacement for a `fill`-style next/image usage — same parent
 * requirements (a sized, position:relative ancestor). Automatically shows
 * any admin-uploaded override, and — only while admin mode is on — an
 * overlay to replace the image by clicking or dragging a file onto it.
 */
export function EditableImage({
  id,
  src,
  alt,
  className = "",
}: {
  id: string;
  /** Omit when there's no default photo yet (e.g. a slot waiting on real content). */
  src?: string;
  alt: string;
  className?: string;
}) {
  const { isAdmin } = useAdminMode();
  const [overrideUrl, setOverrideUrlState] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let currentUrl: string | null = null;

    getOverrideUrl(id).then((url) => {
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      currentUrl = url;
      setOverrideUrlState(url);
    });

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [id]);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    await setOverride(id, file);
    const url = await getOverrideUrl(id);
    setOverrideUrlState((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const effectiveSrc = overrideUrl ?? src;

  return (
    <>
      {effectiveSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={effectiveSrc}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-secondary/10">
          <span className="font-display text-[10px] uppercase tracking-widest2 text-muted">
            No Image
          </span>
        </div>
      )}
      {isAdmin && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center gap-1.5 text-center text-[11px] uppercase tracking-widest2 text-white transition-opacity duration-200 ${
            effectiveSrc ? "opacity-0 hover:opacity-100" : "opacity-100"
          } ${dragOver ? "bg-black/75 opacity-100" : "bg-black/60"}`}
        >
          <span className="rounded-full border border-white/40 bg-black/40 px-3 py-1.5">
            {dragOver
              ? "Drop to replace"
              : effectiveSrc
              ? "Click or drop to replace"
              : "Click or drop to add image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onInputChange}
          />
        </label>
      )}
    </>
  );
}
