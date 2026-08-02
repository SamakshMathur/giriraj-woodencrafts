"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminMode } from "@/components/AdminModeProvider";
import { PasswordGate } from "@/components/admin/PasswordGate";

const EDITABLE_PAGES = [
  { href: "/", label: "Home", note: "Hero, showcase, categories, craftsmanship journey, gallery preview" },
  { href: "/products", label: "Products", note: "Product card photos" },
  { href: "/products/shreeji", label: "Product Detail", note: "Hero image + gallery grid (any product)" },
  { href: "/customization", label: "Customization", note: "Header text" },
  { href: "/craft", label: "Our Craft", note: "Process stage photos" },
  { href: "/gallery", label: "Gallery", note: "Full masonry gallery" },
  { href: "/about", label: "About", note: "Story photo, factory grid, values" },
  { href: "/contact", label: "Contact", note: "Header text" },
];

export default function AdminPage() {
  const { isAdmin, loading, unlock, logout } = useAdminMode();
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

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

  const handleResetAll = async () => {
    setResetting(true);
    await fetch("/api/admin/reset", { method: "POST" }).catch(() => {});
    setResetting(false);
    setResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-32 md:px-10">
      <div className="mx-auto max-w-content">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-widest2 text-accent">
              Admin
            </p>
            <h1 className="mt-3 font-heading text-4xl text-text">
              Edit Mode is On
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              Browse the site using the links below. Every photo now shows a
              &ldquo;click or drop to replace&rdquo; overlay on hover — click
              it to browse your computer, or drag an image file straight onto
              it. Headings, subtext, and other copy get a dashed outline on
              hover — click directly on the words to edit them. Changes save
              to the live site immediately — every visitor sees them.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-border px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent hover:text-text"
          >
            Turn off edit mode
          </button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EDITABLE_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-border bg-card p-6 shadow-warm-sm transition-transform duration-300 ease-reverent hover:-translate-y-0.5"
            >
              <p className="font-heading text-xl text-text">{page.label}</p>
              <p className="mt-2 text-sm text-text-secondary">{page.note}</p>
              <p className="mt-4 text-xs uppercase tracking-widest2 text-accent">
                Open &rarr;
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-text">Reset</p>
          <p className="mt-2 max-w-xl text-sm text-text-secondary">
            Removes every image and text edit you&rsquo;ve made, reverting the
            whole live site back to its defaults for everyone.
          </p>
          <button
            onClick={handleResetAll}
            disabled={resetting}
            className="mt-4 rounded-full border border-accent px-6 py-2.5 text-sm text-text transition-colors hover:bg-accent hover:text-brand-secondary disabled:opacity-50"
          >
            {resetDone ? "Done — reloading…" : resetting ? "Resetting…" : "Reset everything to default"}
          </button>
        </div>
      </div>
    </div>
  );
}
