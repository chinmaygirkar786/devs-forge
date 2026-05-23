import { getRelatedToolsFromRegistry, routes } from "@/lib/internal-links";
import { toolCategories, toolCategoryKeys, tools } from "@/tools";

export { toolCategories, toolCategoryKeys, toolSlugs, tools } from "@/tools";
export type {
  ToolCategory,
  ToolDefinition,
  ToolExample,
  ToolFaq,
  ToolKeywordCluster,
  ToolSeed,
  ToolSeoBlock,
} from "@/tools";

export {
  routes,
  toolToLink,
  getInternalLinksForTool,
  getEffectiveRelatedCluster,
  getRelatedClusterForSlug,
} from "@/lib/internal-links";
export type { InternalLink, InternalLinkKind, ToolInternalLinks, RelatedClusterId } from "@/lib/internal-links";
export {
  getRelatedClusterLabel,
  getNearestClusterForSlug,
  toolRelatedClusters,
} from "@/tools/related-clusters";

export function getAllTools() {
  return tools;
}

export function getPopularTools(limit = 6) {
  return tools.filter((tool) => tool.popular).slice(0, limit);
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(slug: string, limit = 3) {
  return getRelatedToolsFromRegistry(slug, tools, limit);
}

export function getToolsByCategory() {
  return toolCategoryKeys.map((key) => ({
    key,
    ...toolCategories[key],
    tools: tools.filter((tool) => tool.category === key),
  }));
}

export function getToolsForCategory(category: keyof typeof toolCategories) {
  return tools.filter((tool) => tool.category === category);
}

export function isToolCategory(value: string): value is keyof typeof toolCategories {
  return value in toolCategories;
}

export function getToolHref(slug: string) {
  return routes.tool(slug);
}

export function getCategoryHref(category: keyof typeof toolCategories) {
  return routes.category(category);
}
