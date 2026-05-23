import type { ToolSlug } from "@/tools/slugs";

export type RelatedClusterId = "json" | "encoding" | "security";

export type RelatedCluster = {
  id: RelatedClusterId;
  label: string;
  slugs: readonly ToolSlug[];
};

export const toolRelatedClusters: readonly RelatedCluster[] = [
  {
    id: "json",
    label: "JSON & structured data",
    slugs: ["json-formatter", "json-to-typescript", "yaml-formatter", "xml-formatter"],
  },
  {
    id: "encoding",
    label: "Encoding & URLs",
    slugs: ["base64-encoder", "url-encoder", "query-string-parser"],
  },
  {
    id: "security",
    label: "Security & crypto",
    slugs: ["jwt-decoder", "hash-generator", "uuid-generator"],
  },
] as const;

const clusterById = new Map<RelatedClusterId, RelatedCluster>(
  toolRelatedClusters.map((cluster) => [cluster.id, cluster]),
);

const clusterBySlug = new Map<ToolSlug, RelatedClusterId>();

for (const cluster of toolRelatedClusters) {
  for (const slug of cluster.slugs) {
    clusterBySlug.set(slug, cluster.id);
  }
}

/** Tools outside the three clusters — nearest cluster for cross-cluster related links. */
const nearestClusterBySlug: Partial<Record<ToolSlug, RelatedClusterId>> = {
  "html-formatter": "json",
  "css-formatter": "json",
  "markdown-previewer": "json",
  "color-palette-generator": "json",
  "gradient-generator": "json",
  "regex-tester": "security",
  "timestamp-converter": "encoding",
  "cron-parser": "encoding",
};

export function getRelatedClusterForSlug(slug: string): RelatedClusterId | null {
  return clusterBySlug.get(slug as ToolSlug) ?? null;
}

export function getNearestClusterForSlug(slug: string): RelatedClusterId | null {
  if (getRelatedClusterForSlug(slug)) {
    return null;
  }

  return nearestClusterBySlug[slug as ToolSlug] ?? null;
}

export function getEffectiveRelatedCluster(slug: string): RelatedClusterId | null {
  return getRelatedClusterForSlug(slug) ?? getNearestClusterForSlug(slug);
}

export function getRelatedClusterLabel(clusterId: RelatedClusterId): string {
  return clusterById.get(clusterId)?.label ?? clusterId;
}

export function getClusterSlugs(clusterId: RelatedClusterId, excludeSlug?: string): ToolSlug[] {
  const cluster = clusterById.get(clusterId);

  if (!cluster) {
    return [];
  }

  return cluster.slugs.filter((slug) => slug !== excludeSlug);
}

export function getAllClusterSlugs(): ToolSlug[] {
  return toolRelatedClusters.flatMap((cluster) => [...cluster.slugs]);
}

export function getNearestClusterSlugMap(): Readonly<Partial<Record<ToolSlug, RelatedClusterId>>> {
  return nearestClusterBySlug;
}
