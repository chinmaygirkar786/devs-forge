export type ThemePreference = "light" | "dark" | "system";

export const themeStorageKey = "developer-tools-theme";
const themePreferenceEventName = "theme-preference-updated";

export const themeScript = `
(() => {
  const storageKey = "${themeStorageKey}";
  const root = document.documentElement;
  const stored = window.localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = stored === "light" || stored === "dark"
    ? stored
    : systemPrefersDark
      ? "dark"
      : "light";

  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
})();
`;

export function getThemePreferenceSnapshot(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(themeStorageKey);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

export function getThemePreferenceServerSnapshot(): ThemePreference {
  return "system";
}

export function subscribeToThemePreference(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === themeStorageKey) {
      onStoreChange();
    }
  };

  window.addEventListener(themePreferenceEventName, handleCustomChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(themePreferenceEventName, handleCustomChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function setThemePreference(nextPreference: ThemePreference) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(themeStorageKey, nextPreference);
  window.dispatchEvent(new Event(themePreferenceEventName));
}

export function resolveThemePreference(preference: ThemePreference) {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return preference;
}
