import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCardLink } from "@/components/ToolCardLink";
import { SEOHead } from "@/components/SEOHead";
import { categorySeoCopy } from "@/lib/category-seo";
import { buildCategoryJsonLd, buildCategoryMetadata } from "@/lib/seo";
import { routes } from "@/lib/internal-links";
import { getToolsForCategory, isToolCategory, toolCategories } from "@/lib/tools";
import { toolCategoryKeys } from "@/tools";
import type { ToolCategory } from "@/tools";

export const dynamic = "force-static";

export function generateStaticParams() {
  return toolCategoryKeys.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!isToolCategory(category)) {
    return {};
  }

  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = await params;

  if (!isToolCategory(categoryParam)) {
    notFound();
  }

  const category = categoryParam as ToolCategory;
  const meta = toolCategories[category];
  const copy = categorySeoCopy[category];
  const categoryTools = getToolsForCategory(category);

  return (
    <div className="page-fade">
      <SEOHead jsonLd={buildCategoryJsonLd(category)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: routes.toolsIndex },
          { label: meta.title },
        ]}
      />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {meta.title}
        </p>
        <h1 className="text-foreground mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          {copy.headline}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-8 sm:text-lg">
          {copy.intro}
        </p>
      </section>

      <section className="surface-card mt-8 rounded-3xl p-6 sm:p-8">
        <h2 className="text-foreground text-2xl font-bold">
          {categoryTools.length} tools in this category
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {categoryTools.map((tool) => (
            <li key={tool.slug}>
              <ToolCardLink
                href={routes.tool(tool.slug)}
                slug={tool.slug}
                title={tool.title}
                description={tool.description}
                eyebrow={tool.keywordCluster.primary}
                className="border-border hover:border-border-strong hover:bg-background-soft block rounded-2xl border p-5"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
