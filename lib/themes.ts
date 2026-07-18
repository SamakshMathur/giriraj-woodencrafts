export type ThemeName = "royal-walnut" | "divine-marble" | "midnight-sanctum";

export const THEMES: { id: ThemeName; label: string; description: string }[] = [
  {
    id: "royal-walnut",
    label: "Royal Walnut",
    description: "Polished teak, marble, warm temple light — the flagship theme.",
  },
  {
    id: "divine-marble",
    label: "Divine Marble",
    description: "White marble temples, minimal and airy.",
  },
  {
    id: "midnight-sanctum",
    label: "Midnight Sanctum",
    description: "Carved wood lit only by diyas — the dark mode.",
  },
];

export const DEFAULT_THEME: ThemeName = "royal-walnut";
