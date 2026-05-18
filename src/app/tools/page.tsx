import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import {
  buildToolsIndexJsonLd,
  buildToolsIndexMetadata,
} from "@/lib/seo";
import { getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = buildToolsIndexMetadata();

export default function ToolsIndexPage() {
  const categories = getToolsByCategory();

  return (
    <div className="page-fade">
      <SEOHead jsonLd={buildToolsIndexJsonLd()} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "All tools" },
        ]}
      />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Developer utilities
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Free online developer tools
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          Browse browser-based utilities for formatting JSON and HTML, decoding JWTs,
          testing regex, converting timestamps, generating UUIDs, and more. Every tool
          runs locally with no signup and no uploads.
        </p>
      </section>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category.key} className="surface-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {category.title}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-foreground">
                  {category.tools.length} tools
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <Link
                href={`/tools/category/${category.key}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View category
              </Link>
            </div>

            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="block rounded-2xl border border-border p-4 hover:border-border-strong hover:bg-background-soft"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {tool.keywordCluster.primary}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
