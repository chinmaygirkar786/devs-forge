"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { routes } from "@/lib/internal-links";
import type { ToolCategory } from "@/lib/tools";

export type CategoryExplorerTool = {
  slug: string;
  label: string;
  title: string;
  searchText: string;
};

export type CategoryExplorerCategory = {
  key: ToolCategory;
  title: string;
  description: string;
  tools: CategoryExplorerTool[];
};

type CategoryExplorerProps = {
  categories: CategoryExplorerCategory[];
};

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        tools: category.tools.filter((tool) => tool.searchText.includes(normalizedQuery)),
      }))
      .filter((category) => category.tools.length > 0);
  }, [categories, normalizedQuery]);

  const totalMatches = filteredCategories.reduce((sum, category) => sum + category.tools.length, 0);

  return (
    <section id="categories" className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Browse by category
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Developer tools categories
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            Explore free browser-based developer tools grouped by formatting, conversion,
            generators, and utilities—or search to jump straight to the tool you need.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search JSON, JWT, regex, UUID, markdown..."
            className="h-11 rounded-full pl-10"
            aria-label="Search developer tools"
          />
        </div>
      </div>

      {normalizedQuery ? (
        <p className="text-muted-foreground text-sm" role="status" aria-live="polite">
          {totalMatches} tool{totalMatches === 1 ? "" : "s"} match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : null}

      {filteredCategories.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCategories.map((category) => (
            <div key={category.key} className="surface-card rounded-2xl p-6">
              <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
                {category.title}
              </p>
              <h3 className="text-foreground mt-3 text-2xl font-bold">
                <Link
                  href={routes.category(category.key)}
                  prefetch={false}
                  className="hover:text-foreground/70"
                >
                  {category.tools.length} tool{category.tools.length === 1 ? "" : "s"}
                </Link>
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-7">{category.description}</p>
              <div className="mt-5 space-y-3 text-sm">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={routes.tool(tool.slug)}
                    prefetch={false}
                    title={tool.title}
                    className="text-foreground hover:text-foreground/70 flex items-center gap-2"
                  >
                    <span className="bg-foreground h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                    <span className="font-medium">{tool.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground surface-card rounded-2xl p-8 text-center text-sm">
          No tools matched &ldquo;{query.trim()}&rdquo;. Try JSON, regex, base64, UUID, or
          timestamp.
        </p>
      )}
    </section>
  );
}
