import type { ToolKeywordCluster } from "@/tools/types";

export function buildToolKeywords(cluster: ToolKeywordCluster): string[] {
  return [cluster.primary, ...cluster.secondary, ...cluster.longTail];
}
