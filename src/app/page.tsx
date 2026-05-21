import type { Metadata } from "next";
import Link from "next/link";

import { HomeDeferredSections } from "@/components/HomeDeferredSections";
import { ToolCardLink } from "@/components/ToolCardLink";
import { ToolIcon } from "@/components/ToolIcon";
import { SEOHead } from "@/components/SEOHead";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { routes } from "@/lib/internal-links";
import { getPopularTools, getToolsByCategory, tools } from "@/lib/tools";

export const metadata: Metadata = buildHomeMetadata();

export default function Home() {
  const categories = getToolsByCategory();
  const popularTools = getPopularTools(6);
  const searchableTools = tools.map(({ slug, title, description, keywords }) => ({
    slug,
    title,
    description,
    keywords,
  }));

  return (
    <div className="page-fade space-y-10">
      <SEOHead jsonLd={buildHomeJsonLd()} />

      <section className="surface-card overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Free online developer tools
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {siteConfig.heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {siteConfig.heroDescription}
            </p>
            <ul className="mt-5 flex max-w-3xl flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {siteConfig.heroHighlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={routes.toolsIndex}
                className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                Browse all tools
              </Link>
              <Link
                href={routes.tool("json-formatter")}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground"
              >
                JSON Formatter
              </Link>
              <button
                type="button"
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground"
              >
                Press Ctrl + K to search
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {popularTools.slice(0, 4).map((tool) => (
              <ToolCardLink
                key={tool.slug}
                href={routes.tool(tool.slug)}
                slug={tool.slug}
                title={tool.title}
                description={tool.description}
                className="surface-muted rounded-3xl p-5 transition-[border-color,background-color] hover:border-border-strong"
              />
            ))}
          </div>
        </div>
      </section>

      <HomeDeferredSections explorerTools={searchableTools} />

      <section id="categories" className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Browse by category
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Developer tools categories
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Explore free browser-based developer tools grouped by formatting,
            conversion, generators, and utilities—each category links to every tool
            in that workflow.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category.key} className="surface-card rounded-3xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {category.title}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-foreground">
                <Link
                  href={routes.category(category.key)}
                  className="hover:text-primary"
                >
                  {category.tools.length} tools
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {category.description}
              </p>
              <div className="mt-5 space-y-3 text-sm">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={routes.tool(tool.slug)}
                    className="flex items-center gap-3 text-foreground hover:text-primary"
                  >
                    <ToolIcon slug={tool.slug} size="sm" />
                    <span className="font-medium">{tool.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Full directory
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              All developer tools
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Every free online coding utility on {siteConfig.name}, with direct links
              for faster navigation and stronger internal discovery.
            </p>
          </div>
          <Link
            href={routes.toolsIndex}
            className="shrink-0 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:text-primary"
          >
            View full tools index
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCardLink
              key={tool.slug}
              href={routes.tool(tool.slug)}
              slug={tool.slug}
              title={tool.title}
              description={tool.description}
              className="surface-muted rounded-3xl p-5 transition-[border-color,background-color] hover:border-border-strong"
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Why {siteConfig.name}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
            A single hub for the coding utilities you reach for every day.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            {siteConfig.name} exists to help you format, decode, convert, and generate
            data without switching tabs, creating accounts, or uploading sensitive
            payloads to a server. Each tool is built for a specific developer task you
            already do regularly.
          </p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            From JSON and JWT workflows to regex checks, timestamps, colors, and
            markup—open the tool you need, get a clear result, copy it, and move on.
          </p>
        </div>

        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Workflow ready
          </p>
          <div className="mt-4 space-y-4">
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="font-semibold text-foreground">Copy-first UX</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Every tool includes instant output and copy-to-clipboard support for
                low-friction workflows.
              </p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="font-semibold text-foreground">Command palette</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Open tool search anywhere with Ctrl + K for fast navigation.
              </p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="font-semibold text-foreground">Privacy first</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Inputs stay on your device. No account, no uploads, and no backend
                required to use the tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
