"use client";

import { useState, type FormEvent } from "react";

/**
 * Generic password form. Doesn't know or care what it's protecting or how
 * the "unlocked" state should persist — the caller decides that (e.g. by
 * only rendering this when some auth flag is false, and flipping that flag
 * in onUnlock). Reusable for any password-gated area, not just /admin.
 */
export function PasswordGate({
  password,
  onUnlock,
  title = "Restricted Area",
  description = "Enter the password to continue.",
}: {
  password: string;
  onUnlock: () => void;
  title?: string;
  description?: string;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === password) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-32">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-warm"
      >
        <p className="font-heading text-2xl text-text">{title}</p>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className={`mt-6 w-full rounded-xl border bg-bg px-4 py-3 text-center text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent ${
            error ? "border-red-400" : "border-border"
          }`}
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">Incorrect password. Try again.</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-brand py-3 text-sm text-white transition-colors hover:bg-brand-secondary"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
