import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolIcon } from "@/components/ToolIcon";
import { routes, toolToLink } from "@/lib/internal-links";
import type { ToolDefinition } from "@/lib/tools";
import { getToolBySlug, toolCategories } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  children: React.ReactNode;
};

export function ToolLayout({ tool, relatedTools, children }: ToolLayoutProps) {
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
          <ToolIcon slug={tool.slug} size="lg" className="shadow-sm shadow-primary/10" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <Link
                href={routes.category(tool.category)}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap text-primary hover:opacity-90"
              >
                {toolCategories[tool.category].title}
              </Link>
              <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-accent">
                {tool.keywordCluster.primary}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {tool.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {tool.description}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              {tool.seoIntro}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">{children}</div>

        <div className="space-y-8">
          <section className="surface-card rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Related tools
            </p>
            <div className="mt-4 space-y-3">
              {relatedTools.map((relatedTool) => {
                const link = toolToLink(relatedTool, "related");

                return (
                  <Link
                    key={relatedTool.slug}
                    href={link.href}
                    className="flex gap-3 rounded-2xl border border-border p-4 hover:border-border-strong hover:bg-background-soft"
                  >
                    <ToolIcon slug={relatedTool.slug} size="sm" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{link.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {tool.contentSections.length > 0 ? (
        <article className="surface-card mt-8 rounded-3xl p-6 sm:p-8">
          {tool.contentSections.map((section) => (
            <section key={section.heading} className="mt-10 first:mt-0">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-4 text-base leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      ) : null}

      {featuredLinks.length > 0 ? (
        <section className="surface-card mt-8 rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-foreground">Related developer tools</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Continue your workflow with these free utilities on {toolCategories[tool.category].title.toLowerCase()}{" "}
            and adjacent tasks—all browser-based, no upload required.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredLinks.map((related) => {
              const link = toolToLink(related, "related");

              return (
                <li key={related.slug}>
                  <Link
                    href={link.href}
                    className="flex gap-3 rounded-2xl border border-border p-4 hover:border-border-strong hover:bg-background-soft"
                  >
                    <ToolIcon slug={related.slug} size="sm" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{link.label}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            <Link href={routes.toolsIndex} className="font-semibold text-primary hover:opacity-90">
              Browse all developer tools →
            </Link>
          </p>
        </section>
      ) : null}

      <div className="mt-8 space-y-6">
        <section className="surface-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-foreground">How it works</h2>
          <ol
            className={`mt-4 grid gap-4 text-sm leading-6 text-muted-foreground ${
              tool.howItWorks.length <= 3
                ? "md:grid-cols-3"
                : tool.howItWorks.length === 4
                  ? "sm:grid-cols-2"
                  : "grid-cols-1"
            }`}
          >
            {tool.howItWorks.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-foreground">Examples</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tool.examples.map((example) => (
              <div key={example.title} className="surface-muted rounded-2xl p-4">
                <h3 className="font-semibold text-foreground">{example.title}</h3>
                {example.input ? (
                  <div className="mt-2 overflow-hidden rounded-2xl bg-background px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap text-muted-foreground">
                    {example.input}
                  </div>
                ) : null}
                {example.output ? (
                  <div className="mt-2 overflow-hidden rounded-2xl bg-background px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap text-muted-foreground">
                    {example.output}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card mt-8 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-foreground">When to use this tool</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
          {tool.useCases.map((useCase) => (
            <li key={useCase} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card mt-8 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-foreground">Frequently asked questions</h2>
        <div className="mt-5 space-y-6">
          {tool.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
