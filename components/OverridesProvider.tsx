"use client";

import { createContext, useContext } from "react";
import type { TextOverrides, ImageOverrides } from "@/lib/content";

type OverridesContextValue = {
  text: TextOverrides;
  images: ImageOverrides;
};

const OverridesContext = createContext<OverridesContextValue>({ text: {}, images: {} });

/**
 * Holds the site's current text/image overrides, fetched server-side once
 * per request (see app/layout.tsx) so the first paint already shows live
 * content — no flash of default copy before a client fetch resolves.
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
