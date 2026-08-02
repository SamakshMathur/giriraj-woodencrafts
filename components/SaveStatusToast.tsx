"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type StatusKind = "saving" | "saved" | "error";
type Status = { kind: StatusKind; message: string } | null;

type SaveStatusContextValue = {
  notify: (kind: StatusKind, message?: string) => void;
};

const SaveStatusContext = createContext<SaveStatusContextValue | null>(null);

const DEFAULT_MESSAGE: Record<StatusKind, string> = {
  saving: "Saving…",
  saved: "Saved — live for everyone now",
  error: "Failed to save — try again",
};

/**
 * A single, unmissable confirmation for every admin save — text or image.
 * Without this, a silently-failed save would look identical to a
 * successful one, since neither EditableText nor EditableImage show
 * anything on their own.
 */
export function SaveStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((kind: StatusKind, message?: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus({ kind, message: message ?? DEFAULT_MESSAGE[kind] });
    if (kind !== "saving") {
      timeoutRef.current = setTimeout(() => setStatus(null), kind === "error" ? 5000 : 2000);
    }
  }, []);

  return (
    <SaveStatusContext.Provider value={{ notify }}>
      {children}
      {status && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-warm transition-all duration-300 ${
            status.kind === "error"
              ? "bg-red-500"
              : status.kind === "saved"
              ? "bg-accent-2"
              : "bg-brand-secondary"
          }`}
        >
          {status.kind === "saving" && "⏳ "}
          {status.kind === "saved" && "✓ "}
          {status.kind === "error" && "⚠ "}
          {status.message}
        </div>
      )}
    </SaveStatusContext.Provider>
  );
}

export function useSaveStatus() {
  const ctx = useContext(SaveStatusContext);
  if (!ctx) throw new Error("useSaveStatus must be used within SaveStatusProvider");
  return ctx;
}
