import { toolCategories, toolSlugs, tools } from "@/tools";

export { toolCategories, toolSlugs, tools } from "@/tools";
export type { ToolCategory, ToolDefinition, ToolExample } from "@/tools";

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
  return Object.entries(toolCategories).map(([key, value]) => ({
    key,
    ...value,
    tools: tools.filter((tool) => tool.category === key),
  }));
}
