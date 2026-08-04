"use client";

import { createContext, useContext } from "react";
import type { TextOverrides, ImageOverrides } from "@/lib/content";

type OverridesContextValue = {
  text: TextOverrides;
  images: ImageOverrides;
};

const OverridesContext = createContext<OverridesContextValue>({ text: {}, images: {} });

/**
 * Holds the site's current text/image overrides, fetched server-side fresh
 * on every navigation (see app/template.tsx — a template, not a layout, so
 * this re-fetches on client-side route changes too, not just hard reloads)
 * so the first paint always shows live content with no flash of stale copy.
 */
export function OverridesProvider({
  text,
  images,
  children,
}: {
  text: TextOverrides;
  images: ImageOverrides;
  children: React.ReactNode;
}) {
  return (
    <OverridesContext.Provider value={{ text, images }}>{children}</OverridesContext.Provider>
  );
}

export function useOverrides() {
  return useContext(OverridesContext);
}
