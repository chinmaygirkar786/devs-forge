import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCardLink } from "@/components/ToolCardLink";
import { SEOHead } from "@/components/SEOHead";
import { buildToolsIndexJsonLd, buildToolsIndexMetadata } from "@/lib/seo";
import { routes } from "@/lib/internal-links";
import { getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = buildToolsIndexMetadata();

export default function ToolsIndexPage() {
  const categories = getToolsByCategory();

  return (
    <div className="page-fade">
      <SEOHead jsonLd={buildToolsIndexJsonLd()} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All tools" }]} />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
          Developer utilities
        </p>
        <h1 className="text-foreground mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Free online developer tools
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-8 sm:text-lg">
          Browse browser-based utilities for formatting JSON and HTML, decoding JWTs, testing regex,
          converting timestamps, generating UUIDs, and more. Every tool runs locally with no signup
          and no uploads.
        </p>
      </section>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category.key} className="surface-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
                  {category.title}
                </p>
                <h2 className="text-foreground mt-3 text-2xl font-bold">
                  {category.tools.length} tools
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-7">
                  {category.description}
                </p>
              </div>
              <Link
                href={routes.category(category.key)}
                className="text-primary text-sm font-semibold hover:underline"
              >
                View category
              </Link>
            </div>

            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.tools.map((tool) => (
                <li key={tool.slug}>
                  <ToolCardLink
                    href={routes.tool(tool.slug)}
                    slug={tool.slug}
                    title={tool.title}
                    description={tool.description}
                    eyebrow={tool.keywordCluster.primary}
                    className="border-border hover:border-border-strong hover:bg-background-soft block rounded-2xl border p-4"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
