import Link from "next/link";

import type { ToolDefinition } from "@/lib/tools";
import { toolCategories } from "@/lib/tools";

type ToolLayoutProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  children: React.ReactNode;
};

export function ToolLayout({ tool, relatedTools, children }: ToolLayoutProps) {
  return (
    <div className="page-fade">
      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap text-primary">
            {toolCategories[tool.category].title}
          </span>
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-accent">
            {tool.keywordCluster.primary}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          {tool.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          {tool.description}
        </p>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">{children}</div>

        <div className="space-y-8">
          <section className="surface-card rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Related tools
            </p>
            <div className="mt-4 space-y-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="block rounded-2xl border border-border p-4 hover:border-border-strong hover:bg-background-soft"
                >
                  <p className="font-semibold text-foreground">{relatedTool.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="surface-card rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-foreground">How it works</h2>
          <ol className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
            {tool.howItWorks.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-foreground">Examples</h2>
          <div className="mt-5 space-y-4">
            {tool.examples.map((example) => (
              <div key={example.title} className="surface-muted rounded-2xl p-4">
                <h3 className="font-semibold text-foreground">{example.title}</h3>
                {example.input ? (
                  <div className="mt-3 overflow-hidden rounded-2xl bg-background px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap text-muted-foreground">
                    {example.input}
                  </div>
                ) : null}
                {example.output ? (
                  <div className="mt-3 overflow-hidden rounded-2xl bg-background px-4 py-3 font-mono text-xs leading-6 break-all whitespace-pre-wrap text-muted-foreground">
                    {example.output}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
