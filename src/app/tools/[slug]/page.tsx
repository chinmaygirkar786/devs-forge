import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SEOHead } from "@/components/SEOHead";
import { ToolLayout } from "@/components/ToolLayout";
import { ToolPageClient } from "@/components/ToolPageClient";
import { buildToolPageJsonLd, getToolMetadataBySlug } from "@/lib/seo";
import { getRelatedTools, getToolBySlug, toolSlugs } from "@/lib/tools";

export const dynamic = "force-static";

export function generateStaticParams() {
  return toolSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  return getToolMetadataBySlug(slug) ?? {};
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <SEOHead jsonLd={buildToolPageJsonLd(tool)} />
      <ToolLayout tool={tool} relatedTools={getRelatedTools(slug)}>
        <ToolPageClient
          slug={slug}
          usageMeta={{ title: tool.title, category: tool.category }}
        />
      </ToolLayout>
    </>
  );
}
