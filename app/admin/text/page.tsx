"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { PasswordGate } from "@/components/admin/PasswordGate";
import { useOverrides } from "@/components/OverridesProvider";
import { useSaveStatus } from "@/components/SaveStatusToast";
import { TEXT_REGISTRY, type RegistryItem } from "@/lib/textRegistry";

/**
 * Edits every piece of site text that can't be clicked on the page itself:
 * form hints, dropdown choices, menu names, photo labels, WhatsApp messages
 * and the browser tab title. Everything else is edited in place.
 */
export default function OtherTextPage() {
  const { isAdmin, loading, unlock } = useAdminMode();

  if (loading) return <div className="min-h-screen bg-bg" />;
  if (!isAdmin) {
    return <PasswordGate onUnlock={unlock} title="Giriraj Admin" description="Enter the admin password to continue." />;
  }

  const groups = Array.from(new Set(TEXT_REGISTRY.map((item) => item.group)));

  return (
    <section className="bg-bg px-6 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-xs uppercase tracking-widest2 text-muted hover:text-accent">
          ← Admin
        </Link>
        <h1 className="mt-4 font-heading text-4xl text-text">All other text</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Text on the site that can&rsquo;t be clicked to edit: form hints, dropdown choices, menu names, labels
          on product photos, pre-filled WhatsApp messages and the browser tab title. Everything else, such as
          headings, paragraphs, buttons and spec labels, is edited by clicking it on the page while in admin mode.
        </p>

        {groups.map((group) => (
          <div key={group} className="mt-12">
            <h2 className="border-b border-border pb-3 text-xs uppercase tracking-widest2 text-accent">{group}</h2>
            <div className="divide-y divide-border">
              {TEXT_REGISTRY.filter((item) => item.group === group).map((item) => (
                <TextRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TextRow({ item }: { item: RegistryItem }) {
  const { text } = useOverrides();
  const { notify } = useSaveStatus();
  const saved = text[item.id];
  const [value, setValue] = useState(saved ?? item.default);
  const [current, setCurrent] = useState(saved ?? item.default);
  const [busy, setBusy] = useState(false);
  const changed = value !== current;
  const isEdited = current !== item.default;
  const long = item.default.length > 60;

  const save = async () => {
    if (!value.trim()) {
      notify("error", "Text can't be empty. Use “Restore original” instead.");
      return;
    }
    setBusy(true);
    notify("saving");
    try {
      const res = await fetch("/api/admin/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, value }),
      });
      if (!res.ok) throw new Error();
      setCurrent(value);
      notify("saved");
    } catch {
      notify("error");
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    notify("saving", "Restoring…");
    try {
      const res = await fetch("/api/admin/text", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) throw new Error();
      setValue(item.default);
      setCurrent(item.default);
      notify("saved", "Original restored");
    } catch {
      notify("error");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="py-5">
      <label htmlFor={`t-${item.id}`} className="block text-sm font-medium text-text">
        {item.label}
        {isEdited && <span className="ml-2 text-xs font-normal text-accent">edited</span>}
      </label>
      {item.hint && <p className="mt-1 text-xs text-muted">{item.hint}</p>}
      <div className="mt-2">
        {long ? (
          <textarea id={`t-${item.id}`} rows={2} value={value} onChange={(e) => setValue(e.target.value)} className={field} />
        ) : (
          <input id={`t-${item.id}`} value={value} onChange={(e) => setValue(e.target.value)} className={field} />
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!changed || busy}
          className="rounded-md bg-brand px-4 py-1.5 text-xs text-white transition-colors hover:bg-brand-secondary disabled:opacity-40"
        >
          Save
        </button>
        {isEdited && (
          <button
            type="button"
            onClick={restore}
            disabled={busy}
            className="rounded-md border border-border px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent hover:text-text disabled:opacity-40"
          >
            Restore original
          </button>
        )}
        {isEdited && <span className="text-xs text-muted">Original: {item.default}</span>}
      </div>
    </div>
  );
}
