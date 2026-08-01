"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  getThemePreferenceServerSnapshot,
  getThemePreferenceSnapshot,
  resolveThemePreference,
  setThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "light", label: "Light", icon: Sun },
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

  function onChange(nextPreference: string) {
    if (nextPreference) {
      setThemePreference(nextPreference as ThemePreference);
    }
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={preference}
      onValueChange={onChange}
      aria-label="Color theme"
      className="border-border shrink-0 rounded-full border p-0.5"
    >
      {options.map((option) => {
        const Icon = option.icon;

        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1.5 rounded-full border-none px-3 text-xs font-semibold whitespace-nowrap"
          >
            <Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
            <span className="hidden sm:inline">{option.label}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
