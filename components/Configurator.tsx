"use client";

import { useState } from "react";
import { useSaveStatus } from "@/components/SaveStatusToast";
import { convertToWebp } from "@/lib/convertToWebp";

const STEPS: { key: string; label: string; options: string[] }[] = [
  { key: "size", label: "Choose Size", options: ["Compact", "Standard", "Grand"] },
  { key: "polishing", label: "Choose Polishing", options: ["Matte", "Glossy", "Satin", "Gold Leaf"] },
  { key: "storage", label: "Choose Storage", options: ["None", "Single Drawer", "Double Drawer"] },
  { key: "lighting", label: "Choose Lighting", options: ["None", "Warm LED", "Diya-style LED"] },
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
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      if (email.trim()) form.append("email", email.trim());
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
      <div className="order-2 flex flex-col rounded-2xl bg-brand-secondary/10 p-8 shadow-warm-sm md:order-1">
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
              artisans will match it to your configuration.
            </p>

            <label className="relative mt-6 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-card text-center transition-colors duration-300 hover:border-accent">
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
              className="mt-4 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name*"
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number*"
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="mt-3 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {formError && <p className="mt-2 text-xs text-red-500">{formError}</p>}

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
              className={`rounded-xl border px-4 py-6 text-sm transition-all duration-300 ease-reverent hover:-translate-y-0.5 hover:shadow-warm-sm ${
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
            className="mt-10 w-full rounded-full bg-brand py-4 text-sm text-white transition-colors hover:bg-brand-secondary disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {submitting ? "Sending…" : "Get Quote"}
          </button>
        )}
      </div>
    </div>
  );
}
