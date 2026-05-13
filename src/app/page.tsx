import type { Metadata } from "next";
import Link from "next/link";

import { HomeExplorer } from "@/components/HomeExplorer";
import { SEOHead } from "@/components/SEOHead";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getPopularTools, getToolsByCategory, tools } from "@/lib/tools";

export const metadata: Metadata = buildHomeMetadata();

export default function Home() {
  const categories = getToolsByCategory();
  const popularTools = getPopularTools(6);
  const searchableTools = tools.map(
    ({ slug, name, description, category, keywordCluster }) => ({
      slug,
      name,
      description,
      category,
      keywordCluster: {
        primary: keywordCluster.primary,
        secondary: keywordCluster.secondary,
      },
    }),
  );

  return (
    <div className="page-fade space-y-10">
      <SEOHead jsonLd={buildHomeJsonLd()} />

      <section className="surface-card overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              SEO-first developer productivity suite
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {siteConfig.heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Use premium-feeling online coding utilities for JSON formatting, JWT
              decoding, regex testing, Base64 conversion, UUID generation, color
              systems, timestamps, Markdown preview, and more. Every tool runs
              locally in your browser for speed, privacy, and zero setup.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/json-formatter"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                Start with JSON Formatter
              </Link>
              <button
                type="button"
                className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground"
              >
                Press Ctrl + K to search
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {popularTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="surface-muted transform-gpu will-change-transform rounded-3xl p-5 transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:border-border-strong hover:shadow-lg hover:shadow-primary/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {tool.keywordCluster.primary}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeExplorer tools={searchableTools} />

      <section id="categories" className="grid gap-6 xl:grid-cols-4">
        {categories.map((category) => (
          <div key={category.key} className="surface-card rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {category.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">
              {category.tools.length} tools
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-5 space-y-3 text-sm">
              {category.tools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="block text-foreground hover:text-primary"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="popular-tools" className="surface-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Popular tools
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
              High-intent online developer utilities that rank and convert.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            These tools target evergreen searches like JSON formatter online, JWT
            decoder online, regex tester online, and UUID generator online while
            staying fast enough for daily use.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="transform-gpu will-change-transform rounded-3xl border border-border bg-background px-5 py-5 transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:border-border-strong hover:bg-background-soft hover:shadow-lg hover:shadow-primary/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {tool.keywordCluster.primary}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Built for performance
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
            Lightweight, browser-only utilities for everyday engineering work.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Developer Tools Hub is designed as a product, not a generic tool dump. The
            site uses static generation wherever possible, tight internal linking,
            compact client bundles, and local-only interactions to help deliver fast
            Core Web Vitals and a premium SaaS feel.
          </p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Whether you need a free developer tools online workflow for formatting API
            payloads, decoding tokens, testing regex patterns, or generating color
            systems, the goal is the same: solve the task immediately and move back to
            shipping.
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
              <h3 className="font-semibold text-foreground">Monetization ready</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Contextual affiliate placements are wired without cluttering the
                product experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
