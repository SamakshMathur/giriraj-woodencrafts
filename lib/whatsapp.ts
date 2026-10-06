/** The business WhatsApp number, in international format without "+". */
export const WHATSAPP_NUMBER = "918290583377";

export function whatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
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
export function sendToWhatsApp(pending: Window | null, message: string): void {
  const url = whatsAppLink(message);
  if (pending && !pending.closed) {
    pending.location.href = url;
  } else {
    window.location.href = url;
  }
}
