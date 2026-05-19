import type { MetadataRoute } from "next";

import { routes } from "@/lib/internal-links";
import { absoluteUrl } from "@/lib/seo";
import { toolCategoryKeys, tools } from "@/tools";

/** Indexable content routes only (excludes OG images, icons, and API routes). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(routes.home),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(routes.toolsIndex),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(routes.about),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = toolCategoryKeys.map((category) => ({
    url: absoluteUrl(routes.category(category)),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(routes.tool(tool.slug)),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
