"use client";

import { createContext, useContext } from "react";
import type { TextOverrides, ImageOverrides, ImageSlots } from "@/lib/content";
import { registryDefault } from "@/lib/textRegistry";
import { resolveContact } from "@/lib/whatsapp";

type OverridesContextValue = {
  text: TextOverrides;
  images: ImageOverrides;
  slots: ImageSlots;
};

const OverridesContext = createContext<OverridesContextValue>({ text: {}, images: {}, slots: {} });

/**
 * Holds the site's current text/image overrides, fetched server-side fresh
 * on every navigation (see app/template.tsx — a template, not a layout, so
 * this re-fetches on client-side route changes too, not just hard reloads)
 * so the first paint always shows live content with no flash of stale copy.
 */
export function OverridesProvider({
  text,
  images,
  slots,
  children,
}: {
  text: TextOverrides;
  images: ImageOverrides;
  slots: ImageSlots;
  children: React.ReactNode;
}) {
  return (
    <OverridesContext.Provider value={{ text, images, slots }}>{children}</OverridesContext.Provider>
  );
}

export function useOverrides() {
  return useContext(OverridesContext);
}

/**
 * The current text for an id: the admin's saved edit if there is one,
 * otherwise the built-in default. For text that can't be wrapped in an
 * EditableText (placeholders, dropdown choices, WhatsApp messages).
 */
export function useText(id: string, fallback: string): string {
  return useContext(OverridesContext).text[id] ?? fallback;
}

/** useText for an entry in lib/textRegistry.ts (Admin > All other text). */
export function useRegistryText(id: string): string {
  return useText(id, registryDefault(id));
}

/** The business contact details with any admin edits applied. */
export function useContact() {
  return resolveContact(useContext(OverridesContext).text);
}
