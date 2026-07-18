"use client";

import { THEMES } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
          aria-pressed={theme === t.id}
          className={`h-6 w-6 rounded-full border transition-transform duration-300 ease-reverent ${
            theme === t.id ? "scale-110 border-accent" : "border-transparent opacity-60 hover:opacity-100"
          }`}
          style={{
            background:
              t.id === "royal-walnut"
                ? "linear-gradient(135deg, #5A3926, #C69C45)"
                : t.id === "divine-marble"
                ? "linear-gradient(135deg, #BDA68B, #D3A64F)"
                : "linear-gradient(135deg, #111111, #D4AF37)",
          }}
        />
      ))}
    </div>
  );
}
