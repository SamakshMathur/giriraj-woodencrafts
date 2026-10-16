/**
 * The business contact details shown on the site, as displayed text.
 * Each one is editable in admin mode (footer and Contact page), and every
 * link on the site is built from the edited text, so changing a number or
 * email in admin updates both what visitors read and where links go.
 */
export const CONTACT_DEFAULTS = {
  "contact-whatsapp": "+91 82905 83377",
  "contact-phone": "+91 88528 20399",
  "contact-email": "girirajwoodencrafts@gmail.com",
  "contact-instagram": "girirajwoodencrafts",
} as const;

export type ContactId = keyof typeof CONTACT_DEFAULTS;

/** International number without "+" for wa.me links. Assumes India (+91) for 10-digit numbers. */
export function phoneDigits(display: string): string {
  const digits = display.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

/** The business WhatsApp number, in international format without "+". */
export const WHATSAPP_NUMBER = phoneDigits(CONTACT_DEFAULTS["contact-whatsapp"]);

export function whatsAppLink(message?: string, number: string = WHATSAPP_NUMBER): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(display: string): string {
  return `tel:+${phoneDigits(display)}`;
}

export function mailLink(email: string): string {
  return `mailto:${email.trim()}`;
}

export function instagramLink(handle: string): string {
  return `https://www.instagram.com/${handle.trim().replace(/^@/, "")}`;
}

/** Contact details resolved against saved admin edits (for server components). */
export function resolveContact(text: Record<string, string>) {
  const get = (id: ContactId) => text[id] ?? CONTACT_DEFAULTS[id];
  const whatsapp = get("contact-whatsapp");
  return {
    whatsapp,
    whatsappNumber: phoneDigits(whatsapp),
    phone: get("contact-phone"),
    email: get("contact-email"),
    instagram: get("contact-instagram"),
  };
}

/**
 * Opens a blank tab synchronously, inside the click handler, so pop-up
 * blockers allow it. Call this before any `await`, then pass the result
 * to `sendToWhatsApp` once the message is ready.
 */
export function openPendingWindow(): Window | null {
  return window.open("", "_blank");
}

/** Points the pending tab at WhatsApp, or falls back to this tab if it was blocked. */
export function sendToWhatsApp(pending: Window | null, message: string, number: string = WHATSAPP_NUMBER): void {
  const url = whatsAppLink(message, number);
  if (pending && !pending.closed) {
    pending.location.href = url;
  } else {
    window.location.href = url;
  }
}
