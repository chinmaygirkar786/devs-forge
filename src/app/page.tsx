import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import Link from "next/link";

import { HomeDeferredSections } from "@/components/HomeDeferredSections";
import { DeferredReveal } from "@/components/DeferredReveal";
import { HeroPopularToolsSkeleton, WorkflowSectionSkeleton } from "@/components/home-skeletons";
import { SearchShortcutPhrase } from "@/components/SearchShortcutHint";
import { SEOHead } from "@/components/SEOHead";
import { ToolCardLink } from "@/components/ToolCardLink";
import { routes } from "@/lib/internal-links";
import { isMacUserAgent } from "@/lib/platform";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getPopularTools, getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = buildHomeMetadata();

export default async function Home() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMac = isMacUserAgent(userAgent);
  const popularTools = getPopularTools(6);
  const categories = getToolsByCategory().map((category) => ({
    key: category.key,
    title: category.title,
    description: category.description,
    tools: category.tools.map((tool) => ({
      slug: tool.slug,
      label: tool.seoLinkLabel,
      title: tool.title,
      searchText: [tool.title, tool.description, tool.keywordCluster.primary, ...tool.keywords]
        .join(" ")
        .toLowerCase(),
    })),
  }));

  return (
    <div className="page-fade space-y-10">
      <SEOHead jsonLd={buildHomeJsonLd()} />

      <section className="surface-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(90deg,transparent_0%,transparent_35%,black_70%)] select-none"
        >
          <Image
            src="/hero-illustration.png"
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="opacity-[0.06] mix-blend-multiply dark:opacity-[0.1] dark:mix-blend-soft-light dark:invert"
            style={{ objectFit: "cover", objectPosition: "right center" }}
          />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-center">
          <div>
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Free online developer tools
            </p>
            <h1 className="text-foreground mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {siteConfig.heroTitle}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-3xl text-base leading-8 sm:text-lg">
              {siteConfig.heroDescription}
            </p>
            <ul className="text-muted-foreground mt-5 flex max-w-3xl flex-wrap gap-x-4 gap-y-2 text-sm">
              {siteConfig.heroHighlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-2">
                  <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

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

          <DeferredReveal fallback={<HeroPopularToolsSkeleton />} rootMargin="0px">
            <div className="grid gap-4">
              {popularTools.slice(0, 4).map((tool) => (
                <ToolCardLink
                  key={tool.slug}
                  href={routes.tool(tool.slug)}
                  slug={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  className="surface-muted rounded-3xl p-5"
                  interactive
                />
              ))}
            </div>
          </DeferredReveal>
        </div>
      </section>

      <HomeDeferredSections categories={categories} />

      <DeferredReveal fallback={<WorkflowSectionSkeleton />}>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="surface-card rounded-[2rem] p-6 sm:p-8">
            <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
              Why {siteConfig.name}
            </p>
            <h2 className="text-foreground mt-3 text-3xl font-black tracking-tight">
              A single hub for the coding utilities you reach for every day.
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-8">
              {siteConfig.name} exists to help you format, decode, convert, and generate data
              without switching tabs, creating accounts, or uploading sensitive payloads to a
              server. Each tool is built for a specific developer task you already do regularly.
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
      </DeferredReveal>
    </div>
  );
}
