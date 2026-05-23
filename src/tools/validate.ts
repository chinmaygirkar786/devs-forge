import { assertToolLoadersRegistered } from "@/lib/load-tool-module";
import { toolCategoryKeys } from "@/tools/categories";
import type { ToolDefinition, ToolSeoBlock } from "@/tools/types";

export function validateInternalLinks(tools: ToolDefinition[]) {
  const slugSet = new Set(tools.map((tool) => tool.slug));

  for (const tool of tools) {
    for (const relatedSlug of tool.relatedSlugs) {
      if (relatedSlug === tool.slug) {
        throw new Error(`[tool registry] "${tool.slug}" lists itself in relatedSlugs.`);
      }

      if (!slugSet.has(relatedSlug)) {
        throw new Error(
          `[tool registry] "${tool.slug}" references unknown related slug "${relatedSlug}".`,
        );
      }
    }
  }
}

function warnAsymmetricRelatedLinks(tools: ToolDefinition[]) {
  const relatedBySlug = new Map(tools.map((tool) => [tool.slug, new Set(tool.relatedSlugs)]));

  for (const tool of tools) {
    for (const relatedSlug of tool.relatedSlugs) {
      const reverse = relatedBySlug.get(relatedSlug);
      if (reverse && !reverse.has(tool.slug)) {
        console.warn(
          `[tool registry] "${tool.slug}" lists "${relatedSlug}" in relatedSlugs, but "${relatedSlug}" does not list "${tool.slug}".`,
        );
      }
    }
  }
}

export function assertToolRegistry(
  tools: ToolDefinition[],
  seoContent: Record<string, ToolSeoBlock>,
) {
  const slugs = tools.map((tool) => tool.slug);
  const slugSet = new Set(slugs);

  if (slugSet.size !== slugs.length) {
    throw new Error("[tool registry] Duplicate tool slugs detected.");
  }

  const seoKeys = Object.keys(seoContent);

  for (const tool of tools) {
    if (!(tool.slug in seoContent)) {
      throw new Error(`[tool registry] Missing seo content for slug "${tool.slug}".`);
    }

    if (!tool.title.trim()) {
      throw new Error(`[tool registry] "${tool.slug}" is missing a title.`);
    }

    if (!tool.description.trim()) {
      throw new Error(`[tool registry] "${tool.slug}" is missing a description.`);
    }

    if (!toolCategoryKeys.includes(tool.category)) {
      throw new Error(`[tool registry] "${tool.slug}" has invalid category "${tool.category}".`);
    }

    if (tool.keywords.length < 3) {
      throw new Error(`[tool registry] "${tool.slug}" must have at least 3 keywords.`);
    }
  }

  for (const key of seoKeys) {
    if (!slugSet.has(key)) {
      throw new Error(`[tool registry] Orphan seo content key "${key}" has no matching tool seed.`);
    }
  }

  validateInternalLinks(tools);
  warnAsymmetricRelatedLinks(tools);
  assertToolLoadersRegistered(slugs);
}
