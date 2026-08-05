import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/ThemeToggle";
import { themeStorageKey } from "@/lib/theme";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it("defaults to the system preference being selected", () => {
    render(<ThemeToggle />);

    expect(screen.getByRole("radio", { name: "System" })).toHaveAttribute("aria-checked", "true");
  });

  it("cycles through light, dark, and system preferences on click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: "Light" }));
    expect(window.localStorage.getItem(themeStorageKey)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(window.localStorage.getItem(themeStorageKey)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(screen.getByRole("radio", { name: "System" }));
    expect(window.localStorage.getItem(themeStorageKey)).toBe("system");
  });
});
