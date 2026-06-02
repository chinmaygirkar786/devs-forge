"use client";

import { useMemo, useState } from "react";

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

const HOME_EXPLORER_IDLE_LIMIT = 6;

export function HomeExplorer({ tools }: HomeExplorerProps) {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tools.slice(0, HOME_EXPLORER_IDLE_LIMIT);
    }

    return tools.filter((tool) =>
      [tool.title, tool.cardTitle, tool.description, ...tool.keywords]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, tools]);

  const isSearching = query.trim().length > 0;

  return (
    <section className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Free developer tools online
          </p>
          <h2 className="text-foreground mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Search online coding utilities by task, keyword, or workflow.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            This hub is built for developers who need fast browser-based tools for formatting,
            decoding, generating, and converting data without any setup.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search JSON, JWT, regex, UUID, markdown, gradients..."
            className="border-border bg-background focus:border-primary focus:ring-primary-soft w-full rounded-[1.75rem] border px-5 py-4 text-base outline-none focus:ring-2"
          />
        </div>
      </div>

      {!isSearching ? (
        <p className="text-muted-foreground mt-4 text-sm">
          Showing {HOME_EXPLORER_IDLE_LIMIT} popular tools — search above to browse all{" "}
          {tools.length} utilities.
        </p>
      ) : null}

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
