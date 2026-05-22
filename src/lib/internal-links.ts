import { toolCategories } from "@/tools/categories";
import type { ToolCategory, ToolDefinition } from "@/tools/types";

export const routes = {
  home: "/",
  toolsIndex: "/tools",
  about: "/about",
  category: (category: ToolCategory) => `/tools/category/${category}`,
  tool: (slug: string) => `/tools/${slug}`,
} as const;

export type InternalLinkKind =
  | "related"
  | "categoryHub"
  | "categoryPeer"
  | "toolsIndex"
  | "popular";

export type InternalLink = {
  href: string;
  label: string;
  description?: string;
  kind: InternalLinkKind;
};

export function toolToLink(
  tool: ToolDefinition,
  kind: InternalLinkKind = "related",
): InternalLink {
  return {
    href: routes.tool(tool.slug),
    label: tool.seoLinkLabel,
    description: tool.description,
    kind,
  };
}

export function getCategoryHubLink(category: ToolCategory): InternalLink {
  const meta = toolCategories[category];

  return {
    href: routes.category(category),
    label: meta.title,
    description: meta.description,
    kind: "categoryHub",
  };
}

export function getToolsIndexLink(): InternalLink {
  return {
    href: routes.toolsIndex,
    label: "All tools",
    kind: "toolsIndex",
  };
}

export type ToolInternalLinks = {
  related: InternalLink[];
  categoryHub: InternalLink;
  categoryPeers: InternalLink[];
  toolsIndex: InternalLink;
};

export function getInternalLinksForTool(
  slug: string,
  allTools: ToolDefinition[],
  options?: { categoryPeerLimit?: number },
): ToolInternalLinks | null {
  const current = allTools.find((tool) => tool.slug === slug);

  if (!current) {
    return null;
  }

  const categoryPeerLimit = options?.categoryPeerLimit ?? 4;
  const relatedSlugSet = new Set(current.relatedSlugs);

  const related = current.relatedSlugs
    .map((relatedSlug) => allTools.find((tool) => tool.slug === relatedSlug))
    .filter((tool): tool is ToolDefinition => Boolean(tool))
    .map((tool) => toolToLink(tool, "related"));

  const categoryPeers = allTools
    .filter(
      (tool) =>
        tool.slug !== slug &&
        tool.category === current.category &&
        !relatedSlugSet.has(tool.slug),
    )
    .slice(0, categoryPeerLimit)
    .map((tool) => toolToLink(tool, "categoryPeer"));

  return {
    related,
    categoryHub: getCategoryHubLink(current.category),
    categoryPeers,
    toolsIndex: getToolsIndexLink(),
  };
}

export function getRelatedToolsFromRegistry(
  slug: string,
  allTools: ToolDefinition[],
  limit = 3,
): ToolDefinition[] {
  const current = allTools.find((tool) => tool.slug === slug);

  if (!current) {
    return [];
  }

  const explicit = current.relatedSlugs
    .map((relatedSlug) => allTools.find((tool) => tool.slug === relatedSlug))
    .filter((tool): tool is ToolDefinition => Boolean(tool));

  const fallback = allTools.filter(
    (tool) =>
      tool.slug !== slug &&
      tool.category === current.category &&
      !current.relatedSlugs.includes(tool.slug),
  );

  return [...explicit, ...fallback].slice(0, limit);
}
