"use client";

import posthog from "posthog-js";
import { useMemo, useRef, useState } from "react";

import { ToolCardLink } from "@/components/ToolCardLink";
import { routes } from "@/lib/internal-links";

type HomeExplorerTool = {
  slug: string;
  title: string;
  cardTitle?: string;
  description: string;
  keywords: string[];
};

type HomeExplorerProps = {
  tools: HomeExplorerTool[];
};

export function HomeExplorer({ tools }: HomeExplorerProps) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tools;
    }

    return tools.filter((tool) =>
      [tool.title, tool.cardTitle, tool.description, ...tool.keywords]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, tools]);

  return (
    <section className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Free developer tools online
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Search online coding utilities by task, keyword, or workflow.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            This hub is built for developers who need fast browser-based tools for
            formatting, decoding, generating, and converting data without any setup.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <input
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              if (nextQuery.trim().length >= 2) {
                debounceRef.current = setTimeout(() => {
                  posthog.capture("home_explorer_searched", {
                    query: nextQuery.trim(),
                    results_count: tools.filter((tool) =>
                      [tool.title, tool.cardTitle, tool.description, ...tool.keywords]
                        .filter((v): v is string => Boolean(v))
                        .join(" ")
                        .toLowerCase()
                        .includes(nextQuery.trim().toLowerCase()),
                    ).length,
                  });
                }, 600);
              }
            }}
            placeholder="Search JSON, JWT, regex, UUID, markdown, gradients..."
            className="w-full rounded-[1.75rem] border border-border bg-background px-5 py-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCardLink
            key={tool.slug}
            href={routes.tool(tool.slug)}
            slug={tool.slug}
            title={tool.title}
            tooltip={tool.cardTitle}
            description={tool.description}
            className="surface-muted rounded-3xl p-5"
            interactive
          />
        ))}
      </div>
    </section>
  );
}
