"use client";

import { useState, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { useOverrides } from "@/components/OverridesProvider";
import { useSaveStatus } from "@/components/SaveStatusToast";
import { convertToWebp } from "@/lib/convertToWebp";

type ImageState = { kind: "none" } | { kind: "image"; url: string } | { kind: "empty" };

function resolveInitialState(raw: string | null | undefined): ImageState {
  if (raw === undefined) return { kind: "none" };
  if (raw === null) return { kind: "empty" };
  return { kind: "image", url: raw };
}

/**
 * Drop-in replacement for a `fill`-style next/image usage — same parent
 * requirements (a sized, position:relative ancestor). Its current image
 * comes from the server-fetched overrides map (see OverridesProvider), so
 * every visitor sees the latest uploaded photo on first paint. While admin
 * mode is on, an overlay lets you replace it (click or drag a file onto it)
 * or remove it entirely via the small × button.
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
  const { images } = useOverrides();
  const { notify } = useSaveStatus();
  const [state, setState] = useState<ImageState>(() => resolveInitialState(images[id]));
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    notify("saving", "Uploading…");
    try {
      const webpFile = await convertToWebp(file);
      const form = new FormData();
      form.append("id", id);
      form.append("file", webpFile);
      const res = await fetch("/api/admin/image", { method: "POST", body: form });
      if (!res.ok) throw new Error("upload failed");
      const data = await res.json();
      setState({ kind: "image", url: data.url });
      notify("saved");
    } catch {
      notify("error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ kind: "empty" });
    notify("saving", "Removing…");
    try {
      const res = await fetch("/api/admin/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("remove failed");
      notify("saved", "Removed — live for everyone now");
    } catch {
      notify("error");
    }
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

  const effectiveSrc = state.kind === "image" ? state.url : state.kind === "empty" ? undefined : src;

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
            {uploading
              ? "Uploading…"
              : dragOver
              ? "Drop to replace"
              : effectiveSrc
              ? "Click or drop to replace"
              : "Click or drop to add image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={onInputChange}
          />
          {effectiveSrc && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              aria-label="Remove image"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm leading-none text-white transition-colors hover:bg-red-500/90"
            >
              &times;
            </button>
          )}
        </label>
      )}
    </>
  );
}
