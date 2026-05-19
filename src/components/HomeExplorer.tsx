"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";
import { routes } from "@/lib/internal-links";
import { toolCategories } from "@/lib/tools";

type HomeExplorerTool = {
  slug: string;
  title: string;
  description: string;
  category: keyof typeof toolCategories;
  keywords: string[];
};

type HomeExplorerProps = {
  tools: HomeExplorerTool[];
};

export function HomeExplorer({ tools }: HomeExplorerProps) {
  const [query, setQuery] = useState("");
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tools;
    }

    return tools.filter((tool) =>
      [tool.title, tool.description, ...tool.keywords]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, tools]);

  return (
    <div className="space-y-10">
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search JSON, JWT, regex, UUID, markdown, gradients..."
              className="w-full rounded-[1.75rem] border border-border bg-background px-5 py-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={routes.tool(tool.slug)}
              className="surface-muted transform-gpu will-change-transform rounded-3xl p-5 transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:border-border-strong hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {toolCategories[tool.category].title}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {recent.length ? (
        <section className="surface-card rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-foreground">Recently used</h3>
            <p className="text-sm text-muted-foreground">
              Stored locally on this device only.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {recent.map((entry) => (
              <Link
                key={entry.slug}
                href={routes.tool(entry.slug)}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground hover:border-border-strong"
              >
                {entry.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
