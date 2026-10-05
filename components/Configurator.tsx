"use client";

import { useState } from "react";
import { useSaveStatus } from "@/components/SaveStatusToast";
import { convertToWebp } from "@/lib/convertToWebp";

const WHATSAPP_NUMBER = "918290583377";

const STEPS: { key: string; label: string; options: string[] }[] = [
  { key: "size", label: "Choose Size", options: ["Compact", "Standard", "Grand"] },
  { key: "polishing", label: "Choose Polishing", options: ["PU", "Melamine", "Deco", "Golden Leaf"] },
  { key: "storage", label: "Choose Storage", options: ["None", "Drawers", "Plates", "Single Box"] },
];

export function Configurator() {
  const { notify } = useSaveStatus();

  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [designNote, setDesignNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [whatsAppNotice, setWhatsAppNotice] = useState<string | null>(null);

  const step = STEPS[activeStep];

  const choose = (option: string) => {
    setSelections((prev) => ({ ...prev, [step.key]: option }));
    if (activeStep < STEPS.length - 1) {
      setActiveStep((i) => i + 1);
    }
  };

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignFile(file);
    setDesignPreview(URL.createObjectURL(file));
  };

  /**
   * WhatsApp links can carry text but not files. So the photo is saved to
   * the site first (it also lands in Admin > Submissions), and the message
   * opened in WhatsApp carries a link to it plus the visitor's selections.
   */
  const handleSendWhatsApp = async () => {
    // Name and phone are required so the team can still call back if the
    // visitor closes WhatsApp without pressing send.
    if (!name.trim() || !phone.trim()) {
      setFormError("Please add your name and phone number so we can reach you.");
      return;
    }
    setFormError(null);
    setWhatsAppNotice(null);
    setSendingWhatsApp(true);

    // Opened right away, inside the click, so pop-up blockers allow it.
    // It's pointed at WhatsApp once the photo has finished uploading.
    const waWindow = window.open("", "_blank");

    let designLink: string | undefined;
    let uploadFailed = false;
    try {
      const form = new FormData();
      form.append("via", "whatsapp");
      if (name.trim()) form.append("name", name.trim());
      if (phone.trim()) form.append("phone", phone.trim());
      if (designNote.trim()) form.append("note", designNote.trim());
      form.append("selections", JSON.stringify(selections));
      if (designFile) {
        const webpFile = await convertToWebp(designFile);
        form.append("file", webpFile);
      }
      const res = await fetch("/api/submissions", { method: "POST", body: form });
      if (!res.ok) throw new Error("upload failed");
      const data: { imageUrl?: string } = await res.json();
      if (data.imageUrl) designLink = new URL(data.imageUrl, window.location.origin).toString();
    } catch {
      uploadFailed = true;
    }

    const lines = ["Hello Giriraj Woodencrafts, I'd like a custom mandir."];
    const chosen = STEPS.filter((s) => selections[s.key]).map(
      (s) => `${s.label.replace("Choose ", "")}: ${selections[s.key]}`
    );
    if (chosen.length) lines.push("", ...chosen);
    if (designNote.trim()) lines.push("", `My idea: ${designNote.trim()}`);
    if (designLink) lines.push("", `My reference design: ${designLink}`);
    else if (designFile) lines.push("", "I'll attach my reference photo in this chat.");
    if (name.trim()) lines.push("", `Name: ${name.trim()}`);

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    if (waWindow && !waWindow.closed) {
      waWindow.location.href = waUrl;
    } else {
      window.location.href = waUrl;
    }

    setWhatsAppNotice(
      uploadFailed && designFile
        ? "WhatsApp is open with your details. Your photo didn't upload, so please attach it in the chat."
        : "WhatsApp is open with your design ready. Just press send."
    );
    setSendingWhatsApp(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setFormError("Please add your name and phone number so we can reach you.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    notify("saving", "Sending your request…");

    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("phone", phone.trim());
      if (designNote.trim()) form.append("note", designNote.trim());
      form.append("selections", JSON.stringify(selections));
      if (designFile) {
        const webpFile = await convertToWebp(designFile);
        form.append("file", webpFile);
      }

      const res = await fetch("/api/submissions", { method: "POST", body: form });
      if (!res.ok) throw new Error("submit failed");

      notify("saved", "Request sent — we'll be in touch soon");
      setSubmitted(true);
    } catch {
      notify("error", "Couldn't send your request — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Paste your own design */}
      <div className="order-2 flex flex-col rounded-md bg-brand-secondary/10 p-8 shadow-warm-sm md:order-1">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <span className="text-3xl text-accent">✓</span>
            <p className="mt-4 font-heading text-2xl text-text">Request Sent</p>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Thank you, {name}. We&rsquo;ve received your custom mandir request and
              will reach out on {phone} soon.
            </p>
          </div>
        ) : (
          <>
            <p className="font-display text-xs uppercase tracking-widest2 text-muted">
              Paste Your Own Design
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Upload a reference image or describe the design you have in mind — our
              artisans will match it to your configuration. Send it straight to us on
              WhatsApp, or pick your options and request a quote.
            </p>

            <label className="relative mt-6 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-card text-center transition-colors duration-300 hover:border-accent">
              {designPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={designPreview}
                  alt="Uploaded design reference"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <span className="text-2xl text-accent">+</span>
                  <span className="mt-2 px-6 text-xs text-muted">
                    Click to upload a photo or sketch
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleDesignUpload}
                className="hidden"
              />
            </label>
            {designFile && (
              <p className="mt-2 text-xs text-text-secondary">{designFile.name}</p>
            )}

            <textarea
              value={designNote}
              onChange={(e) => setDesignNote(e.target.value)}
              placeholder="Or describe your own design idea here..."
              rows={3}
              className="mt-4 w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name*"
                className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone / WhatsApp number*"
                className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {formError && <p className="mt-2 text-xs text-red-500">{formError}</p>}

            <div className="mt-5">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={sendingWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-sm font-medium text-[#0b3d20] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
                </svg>
                {sendingWhatsApp ? "Preparing…" : "Send on WhatsApp"}
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              {whatsAppNotice ??
                "Opens WhatsApp with your design ready to send. We also keep a copy so our team can call you back."}
            </p>

            <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-text-secondary">
              {Object.keys(selections).length === 0 && (
                <p className="text-muted">Your selections will appear here</p>
              )}
              {STEPS.filter((s) => selections[s.key]).map((s) => (
                <p key={s.key}>
                  <span className="text-muted">{s.label.replace("Choose ", "")}: </span>
                  <span className="text-text">{selections[s.key]}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Steps */}
      <div className="order-1 md:order-2">
        <div className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveStep(i)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 ${
                i === activeStep
                  ? "border-accent bg-accent text-brand-secondary"
                  : selections[s.key]
                  ? "border-accent-2/50 text-accent-2"
                  : "border-border text-muted"
              }`}
            >
              {i + 1}. {s.label.replace("Choose ", "")}
            </button>
          ))}
        </div>

        <h3 className="font-heading text-3xl text-text">{step.label}</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {step.options.map((option) => (
            <button
              key={option}
              onClick={() => choose(option)}
              className={`rounded-md border px-4 py-6 text-sm transition-all duration-300 ease-reverent hover:-translate-y-0.5 hover:shadow-warm-sm ${
                selections[step.key] === option
                  ? "border-accent bg-card text-text"
                  : "border-border bg-card text-text-secondary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {activeStep === STEPS.length - 1 && !submitted && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-10 w-full rounded-full bg-brand py-4 text-sm text-white transition-all hover:bg-brand-secondary hover:shadow-[0_0_24px_rgba(198,156,69,0.4)] disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {submitting ? "Sending…" : "Get Quote"}
          </button>
        )}
      </div>
    </div>
  );
}
