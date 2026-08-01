import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolIcon } from "@/components/ToolIcon";
import { routes } from "@/lib/internal-links";
import type { ToolDefinition } from "@/lib/tools";
import { toolCategories } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const tags = Array.from(
    new Set([tool.keywordCluster.primary, ...tool.keywordCluster.secondary]),
  ).slice(0, 6);

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

      <section className="surface-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ToolIcon slug={tool.slug} size="md" />
          <div className="min-w-0 flex-1">
            <Badge asChild variant="secondary" className="tracking-[0.14em] uppercase">
              <Link href={routes.category(tool.category)}>
                {toolCategories[tool.category].title}
              </Link>
            </Badge>

            <h1 className="text-foreground mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              {tool.pageHeading}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-7">
              {tool.description}
            </p>

            {tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
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

        {tool.contentSections.length > 0 ? (
          <article className="content-deferred surface-card mt-8 rounded-2xl p-6 sm:p-8">
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
          <section className="surface-card rounded-2xl p-6 sm:p-8">
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

          <section className="surface-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-foreground text-2xl font-bold">Examples</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tool.examples.map((example) => (
                <div key={example.title} className="surface-muted rounded-xl p-4">
                  <h3 className="text-foreground font-semibold">{example.title}</h3>
                  {example.input ? (
                    <div className="bg-background text-muted-foreground mt-2 overflow-hidden rounded-xl px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap">
                      {example.input}
                    </div>
                  ) : null}
                  {example.output ? (
                    <div className="bg-background text-muted-foreground mt-2 overflow-hidden rounded-xl px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap">
                      {example.output}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="content-deferred surface-card mt-8 rounded-2xl p-6">
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

        <section className="content-deferred surface-card mt-8 rounded-2xl p-6">
          <h2 className="text-foreground text-2xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-3">
            {tool.faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-foreground text-base font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-7">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
