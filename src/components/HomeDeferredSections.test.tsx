import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HomeDeferredSections } from "@/components/HomeDeferredSections";
import type { CategoryExplorerCategory } from "@/components/CategoryExplorer";

const categories: CategoryExplorerCategory[] = [
  {
    key: "formatting",
    title: "Formatting",
    description: "Format and validate data",
    tools: [
      {
        slug: "json-formatter",
        label: "JSON Formatter",
        title: "JSON Formatter",
        searchText: "json formatter format json",
      },
    ],
  },
];

describe("HomeDeferredSections", () => {
  const scrollIntoView = vi.fn();
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    scrollIntoView.mockReset();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    cleanup();
    Element.prototype.scrollIntoView = originalScrollIntoView;
    window.history.replaceState(null, "", "/");
  });

  it("always mounts a stable #categories hash target", () => {
    render(<HomeDeferredSections categories={categories} />);

    expect(document.getElementById("categories")).toBeInTheDocument();
  });

  it("force-loads the category explorer when the hash is #categories", async () => {
    window.history.replaceState(null, "", "/#categories");

    render(<HomeDeferredSections categories={categories} />);
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(screen.getByText("Developer tools categories")).toBeInTheDocument();
      expect(screen.getByText("JSON Formatter")).toBeInTheDocument();
    });
  });

  it("scrolls to #categories when the hash targets it", async () => {
    window.history.replaceState(null, "", "/#categories");
    render(<HomeDeferredSections categories={categories} />);
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalled();
    });
  });
});
