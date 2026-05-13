import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SEOHead } from "@/components/SEOHead";
import { ToolLayout } from "@/components/ToolLayout";
import { ToolPageClient } from "@/components/ToolPageClient";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getRelatedTools, getToolBySlug, tools } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
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

  return buildToolMetadata(tool);
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
      <SEOHead jsonLd={buildToolJsonLd(tool)} />
      <ToolLayout tool={tool} relatedTools={getRelatedTools(slug)}>
        <ToolPageClient slug={slug} />
      </ToolLayout>
    </>
  );
}
