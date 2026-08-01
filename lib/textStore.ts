const PREFIX = "giriraj-text:";

/** The stored override for an id, or null if it hasn't been edited. */
export function getTextOverride(id: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PREFIX + id);
}

export function setTextOverride(id: string, value: string): void {
  window.localStorage.setItem(PREFIX + id, value);
}

export function clearTextOverride(id: string): void {
  window.localStorage.removeItem(PREFIX + id);
}

/** Remove every stored text override. */
export function clearAllTextOverrides(): void {
  if (typeof window === "undefined") return;
  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith(PREFIX)) window.localStorage.removeItem(key);
  }
}

/** Every id that currently has a stored text override. */
export function listTextOverrideIds(): string[] {
  if (typeof window === "undefined") return [];
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .map((key) => key.slice(PREFIX.length));
}
