"use client";

import { useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { getTextOverride, setTextOverride } from "@/lib/textStore";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Drop-in replacement for static copy — renders exactly like plain text for
 * everyone. While admin mode is on, clicking it swaps in a text field; the
 * edit is saved on blur/Enter and persisted (localStorage) from then on.
 */
export function EditableText({
  id,
  defaultValue,
  as = "span",
  className = "",
  multiline = false,
}: {
  id: string;
  defaultValue: string;
  as?: Tag;
  className?: string;
  multiline?: boolean;
}) {
  const { isAdmin } = useAdminMode();
  const [value, setValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultValue);

  useEffect(() => {
    const stored = getTextOverride(id);
    if (stored !== null) setValue(stored);
  }, [id]);

  const save = () => {
    const next = draft.trim() === "" ? value : draft;
    setValue(next);
    setTextOverride(id, next);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      save();
    }
  };

  const Element = as;

  if (!isAdmin) {
    return <Element className={className}>{value}</Element>;
  }

  // Stops clicks from bubbling to a wrapping <Link>/<a> (e.g. product cards)
  // so entering edit mode never also triggers navigation.
  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (editing) {
    const fieldClassName = `${className} block w-full resize-none rounded-md border border-dashed border-accent !bg-card !text-text px-2 py-1 outline-none`;
    return multiline ? (
      <textarea
        autoFocus
        rows={3}
        value={draft}
        onClick={stop}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        className={fieldClassName}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onClick={stop}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        className={fieldClassName}
      />
    );
  }

  return (
    <Element
      onClick={(e: MouseEvent) => {
        stop(e);
        setDraft(value);
        setEditing(true);
      }}
      title="Click to edit"
      className={`${className} cursor-text rounded-sm outline-dashed outline-1 outline-transparent transition-[outline] hover:outline-accent/50`}
    >
      {value}
    </Element>
  );
}
