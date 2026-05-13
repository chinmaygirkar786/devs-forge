"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  getThemePreferenceServerSnapshot,
  getThemePreferenceSnapshot,
  resolveThemePreference,
  setThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const options: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreferenceSnapshot,
    getThemePreferenceServerSnapshot,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (nextPreference: ThemePreference) => {
      const resolved = resolveThemePreference(nextPreference);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.dataset.theme = resolved;
    };

    apply(preference);

    const listener = () => {
      if (preference === "system") {
        apply("system");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [preference]);

  function onChange(nextPreference: ThemePreference) {
    setThemePreference(nextPreference);
  }

  return (
    <div className="surface-muted inline-flex rounded-full p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold",
            preference === option.value
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
