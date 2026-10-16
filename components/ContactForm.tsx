"use client";

import { useState } from "react";
import { openPendingWindow, sendToWhatsApp } from "@/lib/whatsapp";
import { EditableText } from "@/components/EditableText";
import { useContact, useRegistryText } from "@/components/OverridesProvider";

// The dropdown choices are edited on Admin > All other text.
const INTEREST_IDS = ["contact-form-interest-1", "contact-form-interest-2", "contact-form-interest-3", "contact-form-interest-4"];

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

  const contact = useContact();
  const t = {
    namePlaceholder: useRegistryText("contact-form-name-placeholder"),
    phonePlaceholder: useRegistryText("contact-form-phone-placeholder"),
    interestPrompt: useRegistryText("contact-form-interest-placeholder"),
    interests: [
      useRegistryText(INTEREST_IDS[0]),
      useRegistryText(INTEREST_IDS[1]),
      useRegistryText(INTEREST_IDS[2]),
      useRegistryText(INTEREST_IDS[3]),
    ],
    messagePlaceholder: useRegistryText("contact-form-message-placeholder"),
    errorRequired: useRegistryText("contact-form-error-required"),
    sending: useRegistryText("contact-form-sending"),
    intro: useRegistryText("whatsapp-msg-contact-intro"),
    interestLabel: useRegistryText("whatsapp-label-interest"),
    nameLabel: useRegistryText("whatsapp-label-name"),
    phoneLabel: useRegistryText("whatsapp-label-phone"),
    thanksTitle: useRegistryText("contact-thanks-title"),
    thanksBody: useRegistryText("contact-thanks-body"),
    thanksAgain: useRegistryText("contact-thanks-again"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(t.errorRequired);
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

    const lines = [t.intro];
    if (interest) lines.push("", `${t.interestLabel} ${interest}`);
    if (message.trim()) lines.push("", message.trim());
    lines.push("", `${t.nameLabel} ${name.trim()}`, `${t.phoneLabel} ${phone.trim()}`);
    sendToWhatsApp(pending, lines.join("\n"), contact.whatsappNumber);

    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start justify-center rounded-md border border-border bg-card p-8">
        <span className="text-3xl text-accent">✓</span>
        <p className="mt-4 font-heading text-2xl text-text">{t.thanksTitle.replace("{name}", name.trim())}</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          {t.thanksBody.replace("{phone}", phone.trim())}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-accent underline-offset-4 hover:underline"
        >
          {t.thanksAgain}
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
            placeholder={t.namePlaceholder}
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
            placeholder={t.phonePlaceholder}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">What are you interested in?</span>
        <select value={interest} onChange={(e) => setInterest(e.target.value)} className={fieldClass}>
          <option value="">{t.interestPrompt}</option>
          {t.interests.map((option, i) => (
            <option key={INTEREST_IDS[i]} value={option}>
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
          placeholder={t.messagePlaceholder}
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
        {sending ? t.sending : <EditableText id="contact-form-button" defaultValue="Send Enquiry on WhatsApp" as="span" />}
      </button>
      <EditableText
        id="contact-form-footnote"
        defaultValue="Opens WhatsApp with your enquiry ready to send. We also keep a copy so our team can call you back."
        as="p"
        multiline
        className="text-xs text-muted"
      />
    </form>
  );
}
