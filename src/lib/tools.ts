import {
  toolCategories,
  toolCategoryKeys,
  toolSlugs,
  tools,
} from "@/tools";

export {
  toolCategories,
  toolCategoryKeys,
  toolSlugs,
  tools,
} from "@/tools";
export type { ToolCategory, ToolDefinition, ToolExample, ToolFaq } from "@/tools";

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
  const current = getToolBySlug(slug);
  if (!current) {
    return [];
  }

  const explicit = current.relatedSlugs
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const fallback = tools.filter(
    (tool) =>
      tool.slug !== slug &&
      tool.category === current.category &&
      !current.relatedSlugs.includes(tool.slug),
  );

  return [...explicit, ...fallback].slice(0, limit);
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
