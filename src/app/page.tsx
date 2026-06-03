import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { HomeDeferredSections } from "@/components/HomeDeferredSections";
import { HomeHeroVisual } from "@/components/HomeHeroVisual";
import { SearchShortcutPhrase } from "@/components/SearchShortcutHint";
import { SEOHead } from "@/components/SEOHead";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";
import { isMacUserAgent } from "@/lib/platform";
import { siteConfig } from "@/lib/site";
import { routes } from "@/lib/internal-links";
import { getToolsByCategory, tools } from "@/lib/tools";

export const metadata: Metadata = buildHomeMetadata();

export default async function Home() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMac = isMacUserAgent(userAgent);
  const categories = getToolsByCategory();
  const searchableTools = tools.map(
    ({ slug, title, description, keywords, seoLinkLabel, keywordCluster }) => ({
      slug,
      title: seoLinkLabel,
      cardTitle: title,
      description,
      keywords: [keywordCluster.primary, ...keywords],
    }),
  );

  return (
    <div className="page-fade">
      <SEOHead jsonLd={buildHomeJsonLd()} />

      <section
        className="home-hero relative left-1/2 -mt-8 -ml-[50vw] w-screen max-w-[100vw] overflow-x-clip border-b border-border/60 pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16"
        aria-labelledby="home-hero-title"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="home-hero__layout">
            <div className="home-hero__content min-w-0">
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Free online developer tools
            </p>
            <h1
              id="home-hero-title"
              className="text-foreground mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
            >
              {siteConfig.heroTitle}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-3xl text-base leading-8 sm:text-lg">
              {siteConfig.heroDescription}
            </p>

            <div className="mt-8">
              <Link
                href={routes.toolsIndex}
                prefetch
                className="bg-foreground text-background inline-flex rounded-full px-5 py-3 text-sm font-semibold"
              >
                Browse all tools
              </Link>
            </div>
            </div>

            <div className="home-hero__visual min-w-0" aria-hidden>
              <HomeHeroVisual />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14 space-y-10 sm:mt-16 lg:mt-20">
        <HomeDeferredSections explorerTools={searchableTools} />

      <section id="categories" className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            Browse by category
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Developer tools categories
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            Explore free browser-based developer tools grouped by formatting, conversion,
            generators, and utilities—each category links to every tool in that workflow.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category.key} className="surface-card rounded-3xl p-6">
              <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
                {category.title}
              </p>
              <h3 className="text-foreground mt-3 text-2xl font-bold">
                <Link
                  href={routes.category(category.key)}
                  prefetch={false}
                  className="hover:text-primary"
                >
                  {category.tools.length} tools
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
                    className="text-foreground hover:text-primary flex items-center gap-2"
                  >
                    <span
                      className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      aria-hidden
                    />
                    <span className="font-medium">{tool.seoLinkLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            Why {siteConfig.name}
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-black tracking-tight">
            A single hub for the coding utilities you reach for every day.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            {siteConfig.name} exists to help you format, decode, convert, and generate data without
            switching tabs, creating accounts, or uploading sensitive payloads to a server. Each
            tool is built for a specific developer task you already do regularly.
          </p>
          <p className="text-muted-foreground mt-4 text-base leading-8">
            From JSON and JWT workflows to regex checks, timestamps, colors, and markup—open the
            tool you need, get a clear result, copy it, and move on.
          </p>
        </div>

        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            Workflow ready
          </p>
          <div className="mt-4 space-y-4">
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="text-foreground font-semibold">Copy-first UX</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Every tool includes instant output and copy-to-clipboard support for low-friction
                workflows.
              </p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="text-foreground font-semibold">Command palette</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                <SearchShortcutPhrase template="open-anywhere" isMac={isMac} />
              </p>
            </div>
            <div className="surface-muted rounded-2xl p-4">
              <h3 className="text-foreground font-semibold">Privacy first</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Inputs stay on your device. No account, no uploads, and no backend required to use
                the tools.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
