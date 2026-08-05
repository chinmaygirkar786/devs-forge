import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { CategoryExplorer, type CategoryExplorerCategory } from "@/components/CategoryExplorer";

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
        searchText: "json formatter format json validate json online",
      },
    ],
  },
  {
    key: "generators",
    title: "Generators",
    description: "Generate common developer artifacts",
    tools: [
      {
        slug: "uuid-generator",
        label: "UUID Generator",
        title: "UUID Generator",
        searchText: "uuid generator generate uuid online",
      },
    ],
  },
];

describe("CategoryExplorer", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows every category and tool when there is no search query", () => {
    render(<CategoryExplorer categories={categories} />);

    expect(screen.getByText("JSON Formatter")).toBeInTheDocument();
    expect(screen.getByText("UUID Generator")).toBeInTheDocument();
  });

  it("filters tools within categories and hides empty categories", async () => {
    const user = userEvent.setup();
    render(<CategoryExplorer categories={categories} />);

    await user.type(screen.getByLabelText("Search developer tools"), "uuid");

    expect(screen.queryByText("JSON Formatter")).not.toBeInTheDocument();
    expect(screen.getByText("UUID Generator")).toBeInTheDocument();
    expect(screen.getByText(/1 tool match/)).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches the search query", async () => {
    const user = userEvent.setup();
    render(<CategoryExplorer categories={categories} />);

    await user.type(screen.getByLabelText("Search developer tools"), "nonexistent-tool-xyz");

    expect(screen.getByText(/No tools matched/)).toBeInTheDocument();
  });
});
