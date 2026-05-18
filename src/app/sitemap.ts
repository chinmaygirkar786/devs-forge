import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { toolCategoryKeys, tools } from "@/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolCategoryKeys.map((category) => ({
      url: absoluteUrl(`/tools/category/${category}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...tools.map((tool) => ({
      url: absoluteUrl(`/tools/${tool.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
