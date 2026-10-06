"use client";

import { useState } from "react";
import { openPendingWindow, sendToWhatsApp } from "@/lib/whatsapp";

const INTERESTS = [
  "Requesting a Quote",
  "Video Consultation",
  "Booking a Showroom Visit",
  "Bulk / Temple Setup Order",
];

const fieldClass =
  "w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent";

/**
 * Saves the enquiry (it shows up in Admin > Submissions) and opens WhatsApp
 * with the details ready to send, same as the Customization page.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone number so we can reach you.");
      return;
    }
    setError(null);
    setSending(true);
    const pending = openPendingWindow();

    try {
      const form = new FormData();
      form.append("via", "whatsapp");
      form.append("name", name.trim());
      form.append("phone", phone.trim());
      if (message.trim()) form.append("note", message.trim());
      form.append("selections", JSON.stringify(interest ? { interest } : {}));
      await fetch("/api/submissions", { method: "POST", body: form });
    } catch {
      // WhatsApp still opens below, so the enquiry isn't lost.
    }

    const lines = ["Hello Giriraj Woodencrafts, I have an enquiry."];
    if (interest) lines.push("", `I'm interested in: ${interest}`);
    if (message.trim()) lines.push("", message.trim());
    lines.push("", `Name: ${name.trim()}`, `Phone: ${phone.trim()}`);
    sendToWhatsApp(pending, lines.join("\n"));

    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start justify-center rounded-md border border-border bg-card p-8">
        <span className="text-3xl text-accent">✓</span>
        <p className="mt-4 font-heading text-2xl text-text">Thank you, {name.trim()}</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          WhatsApp has opened with your enquiry. Press send there and our team will reply shortly.
          We&rsquo;ve also kept a copy, so we can call you on {phone.trim()} if needed.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-accent underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Full name</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name*"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="sr-only">Phone or WhatsApp number</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone / WhatsApp Number*"
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">What are you interested in?</span>
        <select value={interest} onChange={(e) => setInterest(e.target.value)} className={fieldClass}>
          <option value="">I&apos;m interested in&hellip;</option>
          {INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Your message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your space and vision"
          rows={5}
          className={fieldClass}
        />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-md bg-brand px-10 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-secondary disabled:opacity-60 sm:w-auto"
      >
        {sending ? "Sending…" : "Send Enquiry on WhatsApp"}
      </button>
      <p className="text-xs text-muted">
        Opens WhatsApp with your enquiry ready to send. We also keep a copy so our team can call you back.
      </p>
    </form>
  );
}
