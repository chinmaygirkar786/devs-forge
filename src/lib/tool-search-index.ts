import { toolCategories, tools } from "@/lib/tools";

export type ToolSearchEntry = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  categoryTitle: string;
};

/** Minimal palette/search payload — import from server parents only. */
export const toolSearchIndex: ToolSearchEntry[] = tools.map((tool) => ({
  slug: tool.slug,
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords,
  categoryTitle: toolCategories[tool.category].title,
}));
