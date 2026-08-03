"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { PasswordGate } from "@/components/admin/PasswordGate";
import { useSaveStatus } from "@/components/SaveStatusToast";
import type { Submission } from "@/lib/submissions";

const STEP_LABELS: Record<string, string> = {
  size: "Size",
  polishing: "Polishing",
  storage: "Storage",
  lighting: "Lighting",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SubmissionsPage() {
  const { isAdmin, loading, unlock } = useAdminMode();
  const { notify } = useSaveStatus();
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/submissions");
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (loading) {
    return <div className="min-h-screen bg-bg" />;
  }

  if (!isAdmin) {
    return (
      <PasswordGate
        onUnlock={unlock}
        title="Giriraj Admin"
        description="Enter the admin password to continue."
      />
    );
  }

  const toggleStatus = async (s: Submission) => {
    setBusyId(s.id);
    const nextStatus = s.status === "new" ? "contacted" : "new";
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      setSubmissions((prev) =>
        prev ? prev.map((x) => (x.id === s.id ? { ...x, status: nextStatus } : x)) : prev
      );
      notify("saved", nextStatus === "contacted" ? "Marked as contacted" : "Marked as new");
    } catch {
      notify("error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (s: Submission) => {
    if (!window.confirm(`Delete the request from ${s.name}? This can't be undone.`)) return;
    setBusyId(s.id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id }),
      });
      if (!res.ok) throw new Error();
      setSubmissions((prev) => (prev ? prev.filter((x) => x.id !== s.id) : prev));
      notify("saved", "Deleted");
    } catch {
      notify("error");
    } finally {
      setBusyId(null);
    }
  };

  const newCount = submissions?.filter((s) => s.status === "new").length ?? 0;

  return (
    <div className="min-h-screen bg-bg px-6 py-32 md:px-10">
      <div className="mx-auto max-w-content">
        <Link href="/admin" className="text-xs uppercase tracking-widest2 text-accent">
          &larr; Back to Admin
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl text-text">Custom Design Requests</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {submissions === null
                ? "Loading…"
                : `${submissions.length} total, ${newCount} new`}
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-full border border-border px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent hover:text-text"
          >
            Refresh
          </button>
        </div>

        {submissions !== null && submissions.length === 0 && (
          <p className="mt-16 text-sm text-text-secondary">
            No custom design requests yet. They&rsquo;ll show up here as soon as a
            visitor submits one from the Customization page.
          </p>
        )}

        <div className="mt-10 space-y-6">
          {submissions?.map((s) => (
            <div
              key={s.id}
              className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-warm-sm sm:grid-cols-[160px_1fr]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-secondary/10">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.imageUrl}
                    alt={`Design reference from ${s.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-[10px] uppercase tracking-widest2 text-muted">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-xl text-text">{s.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {s.phone}
                      {s.email && <> &middot; {s.email}</>}
                    </p>
                    <p className="mt-1 text-xs text-muted">{formatDate(s.createdAt)}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs uppercase tracking-widest2 ${
                      s.status === "new"
                        ? "bg-accent text-brand-secondary"
                        : "bg-accent-2/20 text-accent-2"
                    }`}
                  >
                    {s.status === "new" ? "New" : "Contacted"}
                  </span>
                </div>

                {Object.keys(s.selections).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(s.selections).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                      >
                        {STEP_LABELS[key] ?? key}: <span className="text-text">{value}</span>
                      </span>
                    ))}
                  </div>
                )}

                {s.note && (
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                    &ldquo;{s.note}&rdquo;
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/91${s.phone.replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-brand px-5 py-2 text-xs text-white transition-colors hover:bg-brand-secondary"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => toggleStatus(s)}
                    disabled={busyId === s.id}
                    className="rounded-full border border-accent px-5 py-2 text-xs text-text transition-colors hover:bg-accent hover:text-brand-secondary disabled:opacity-50"
                  >
                    Mark as {s.status === "new" ? "Contacted" : "New"}
                  </button>
                  <button
                    onClick={() => remove(s)}
                    disabled={busyId === s.id}
                    className="rounded-full border border-border px-5 py-2 text-xs text-text-secondary transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
