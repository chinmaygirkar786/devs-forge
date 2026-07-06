"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
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

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
  iconClass?: string;
}> = [
  { value: "light", label: "Light", icon: Sun, iconClass: "theme-toggle-icon--sun" },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
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
    <div
      role="group"
      aria-label="Color theme"
      className="theme-toggle surface-muted shrink-0 rounded-full p-1"
    >
      <span aria-hidden className="theme-toggle-indicator" data-active={preference} />
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = preference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className="theme-toggle-option whitespace-nowrap"
          >
            <Icon
              className={cn("theme-toggle-icon", option.iconClass)}
              strokeWidth={2.25}
              aria-hidden
            />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
