"use client";

import { useRef, useState } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { useOverrides } from "@/components/OverridesProvider";
import { useSaveStatus } from "@/components/SaveStatusToast";
import { convertToWebp } from "@/lib/convertToWebp";
import type { ExtraSlot } from "@/lib/content";

/**
 * The photos an admin has added to a section, plus add/remove actions.
 * Starts from the server-loaded list and updates instantly on change, so
 * the admin sees new photos without reloading. Visitors get the saved list.
 */
export function useAddedPhotos(section: string) {
  const { slots: saved } = useOverrides();
  const { notify } = useSaveStatus();
  const [slots, setSlots] = useState<ExtraSlot[]>(saved[section] ?? []);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const add = async (file: File, label?: string) => {
    setBusy(true);
    notify("saving", "Adding photo…");
    try {
      const webp = await convertToWebp(file);
      const form = new FormData();
      form.append("section", section);
      form.append("file", webp);
      if (label) form.append("label", label);
      const res = await fetch("/api/admin/slots", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "add failed");
      setSlots((prev) => [...prev, data.slot]);
      setUrls((prev) => ({ ...prev, [data.slot.id]: data.url }));
      notify("saved", "Photo added — live for everyone now");
    } catch (err) {
      notify("error", err instanceof Error && err.message !== "add failed" ? err.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const before = slots;
    setSlots((prev) => prev.filter((s) => s.id !== id));
    notify("saving", "Removing photo…");
    try {
      const res = await fetch("/api/admin/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, id }),
      });
      if (!res.ok) throw new Error();
      notify("saved", "Photo removed");
    } catch {
      setSlots(before);
      notify("error");
    }
  };

  /** Photo URL for a slot added during this visit (before a reload). */
  const urlFor = (id: string) => urls[id];

  return { slots, add, remove, busy, urlFor };
}

/**
 * An "+ Add photo" tile, shown only in admin mode. Accepts several files at
 * once. With `categories`, the admin picks which category the photos go in.
 */
export function AddPhotoTile({
  onAdd,
  busy,
  categories,
  className = "",
  compact = false,
}: {
  onAdd: (file: File, label?: string) => Promise<void>;
  busy: boolean;
  categories?: string[];
  className?: string;
  compact?: boolean;
}) {
  const { isAdmin } = useAdminMode();
  const input = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(categories?.[0] ?? "");
  if (!isAdmin) return null;

  const pick = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) await onAdd(file, category || undefined);
    }
    if (input.current) input.current.value = "";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-accent/60 bg-accent/5 p-4 text-center ${className}`}
    >
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="flex flex-col items-center gap-1 text-accent disabled:opacity-50"
      >
        <span className={compact ? "text-2xl leading-none" : "text-4xl leading-none"}>+</span>
        <span className="text-[11px] uppercase tracking-widest2">{busy ? "Uploading…" : "Add photo"}</span>
      </button>
      {categories && categories.length > 0 && (
        <label className="text-[11px] text-text-secondary">
          Category{" "}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="ml-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] text-text"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      {!compact && <span className="text-[10px] text-muted">You can choose several photos at once</span>}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  );
}
