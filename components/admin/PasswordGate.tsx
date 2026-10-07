"use client";

import { useState, type FormEvent } from "react";

/**
 * Generic password form. Delegates the actual check to `onUnlock` — it
 * doesn't know or store the real password itself, so it's reusable for any
 * password-gated area, not just /admin, and never ships the password to the
 * client bundle.
 */
export function PasswordGate({
  onUnlock,
  title = "Restricted Area",
  description = "Enter the password to continue.",
}: {
  onUnlock: (password: string) => Promise<string | null>;
  title?: string;
  description?: string;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const problem = await onUnlock(value).catch(() => "Could not reach the server. Try again.");
    setSubmitting(false);
    setError(problem);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-32">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-md border border-border bg-card p-8 text-center shadow-warm"
      >
        <p className="font-heading text-2xl text-text">{title}</p>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="Password"
          autoFocus
          className={`mt-6 w-full rounded-md border bg-bg px-4 py-3 text-center text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent ${
            error ? "border-red-400" : "border-border"
          }`}
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-brand py-3 text-sm text-white transition-colors hover:bg-brand-secondary disabled:opacity-50"
        >
          {submitting ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
