import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolIcon } from "@/components/ToolIcon";
import { routes, toolToLink } from "@/lib/internal-links";
import type { ToolDefinition } from "@/lib/tools";
import { getEffectiveRelatedCluster, getRelatedClusterLabel, getToolBySlug, toolCategories } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const relatedClusterId = getEffectiveRelatedCluster(tool.slug);
  const relatedClusterLabel = relatedClusterId ? getRelatedClusterLabel(relatedClusterId) : null;

  const featuredLinks = tool.internalLinkSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((related): related is ToolDefinition => Boolean(related))
    .slice(0, 6);

  return (
    <div className="page-fade">
      <Breadcrumbs
        items={[
          { label: "Home", href: routes.home },
          { label: "Tools", href: routes.toolsIndex },
          {
            label: toolCategories[tool.category].title,
            href: routes.category(tool.category),
          },
          { label: tool.title },
        ]}
      />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <ToolIcon slug={tool.slug} size="lg" className="shadow-primary/10 shadow-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <Link
                href={routes.category(tool.category)}
                className="bg-primary-soft text-primary inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] whitespace-nowrap uppercase hover:opacity-90"
              >
                {toolCategories[tool.category].title}
              </Link>
            </div>

            <h1 className="text-foreground mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {tool.pageHeading}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm font-medium">{tool.title}</p>
            <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-8 sm:text-lg">
              {tool.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="tool-workspace-heading">
        <h2 id="tool-workspace-heading" className="sr-only">
          {tool.pageHeading} workspace
        </h2>
        {children}
      </section>

      <div className="content-deferred mt-8">
        <p className="text-muted-foreground max-w-3xl text-base leading-8">{tool.seoIntro}</p>

        {featuredLinks.length > 0 ? (
          <section className="surface-card mt-8 rounded-3xl p-6">
            <h2 className="text-foreground text-2xl font-bold">Related developer tools</h2>
            {relatedClusterLabel ? (
              <p className="text-primary mt-2 text-sm font-semibold">{relatedClusterLabel}</p>
            ) : null}
            <p className="text-muted-foreground mt-3 text-sm leading-7">
              Continue your workflow with these free utilities on{" "}
              {toolCategories[tool.category].title.toLowerCase()} and adjacent tasks—all
              browser-based, no upload required.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {featuredLinks.map((related) => {
                const link = toolToLink(related, "related");

                return (
                  <li key={related.slug}>
                    <Link
                      href={link.href}
                      className="border-border hover:border-border-strong hover:bg-background-soft flex gap-3 rounded-2xl border p-4"
                    >
                      <ToolIcon slug={related.slug} size="sm" />
                      <span className="min-w-0">
                        <span className="text-foreground block font-semibold">{link.label}</span>
                        <span className="text-muted-foreground mt-1 block text-sm leading-6">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-muted-foreground mt-5 text-sm">
              <Link
                href={routes.toolsIndex}
                className="text-primary font-semibold hover:opacity-90"
              >
                Browse all developer tools →
              </Link>
            </p>
          </section>
        ) : null}

        {tool.contentSections.length > 0 ? (
          <article className="content-deferred surface-card mt-8 rounded-3xl p-6 sm:p-8">
            {tool.contentSections.map((section) => (
              <section key={section.heading} className="mt-10 first:mt-0">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-muted-foreground mt-4 text-base leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </article>
        ) : null}

        <div className="content-deferred mt-8 space-y-6">
          <section className="surface-card rounded-3xl p-6 sm:p-8">
            <h2 className="text-foreground text-2xl font-bold">How it works</h2>
            <ol
              className={`text-muted-foreground mt-4 grid gap-4 text-sm leading-6 ${
                tool.howItWorks.length <= 3
                  ? "md:grid-cols-3"
                  : tool.howItWorks.length === 4
                    ? "sm:grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {tool.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="bg-primary-soft text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-3xl p-6 sm:p-8">
            <h2 className="text-foreground text-2xl font-bold">Examples</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tool.examples.map((example) => (
                <div key={example.title} className="surface-muted rounded-2xl p-4">
                  <h3 className="text-foreground font-semibold">{example.title}</h3>
                  {example.input ? (
                    <div className="bg-background text-muted-foreground mt-2 overflow-hidden rounded-2xl px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap">
                      {example.input}
                    </div>
                  ) : null}
                  {example.output ? (
                    <div className="bg-background text-muted-foreground mt-2 overflow-hidden rounded-2xl px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap">
                      {example.output}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="content-deferred surface-card mt-8 rounded-3xl p-6">
          <h2 className="text-foreground text-2xl font-bold">When to use this tool</h2>
          <ul className="text-muted-foreground mt-5 space-y-3 text-sm leading-7">
            {tool.useCases.map((useCase) => (
              <li key={useCase} className="flex gap-3">
                <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="content-deferred surface-card mt-8 rounded-3xl p-6">
          <h2 className="text-foreground text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-5 space-y-6">
            {tool.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-foreground text-base font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
