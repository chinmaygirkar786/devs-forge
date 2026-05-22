import { toolCategories, tools } from "@/lib/tools";

export type ToolSearchEntry = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  categoryTitle: string;
  primaryKeyword: string;
};

/** Minimal palette/search payload — import from server parents only. */
export const toolSearchIndex: ToolSearchEntry[] = tools.map((tool) => ({
  slug: tool.slug,
  title: tool.seoLinkLabel,
  description: tool.description,
  keywords: tool.keywords,
  categoryTitle: toolCategories[tool.category].title,
  primaryKeyword: tool.keywordCluster.primary,
}));
