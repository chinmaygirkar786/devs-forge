import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import type { ToolDefinition } from "@/tools";

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}

export function buildHomeMetadata(): Metadata {
  const title = `${siteConfig.heroTitle} | ${siteConfig.name}`;
  const description =
    "Free developer tools online for formatting JSON and HTML, decoding JWTs, testing regex, converting timestamps, generating UUIDs, and more.";

  return {
    title,
    description,
    keywords: [
      "free developer tools online",
      "online coding utilities",
      "developer productivity tools",
      "browser based developer tools",
      "json formatter online",
      "regex tester online",
    ],
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/"),
      type: "website",
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.socialHandle,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export function buildToolMetadata(tool: ToolDefinition): Metadata {
  const title = `${tool.name} Online | ${siteConfig.shortName}`;
  const description = `${tool.description} Use this ${tool.keywordCluster.primary} workflow to solve ${tool.keywordCluster.secondary[0]} and related developer tasks quickly.`;
  const url = absoluteUrl(`/tools/${tool.slug}`);

  return {
    title,
    description,
    keywords: [
      tool.keywordCluster.primary,
      ...tool.keywordCluster.secondary,
      ...tool.keywordCluster.longTail,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(`/tools/${tool.slug}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: `${tool.name} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.socialHandle,
      images: [absoluteUrl(`/tools/${tool.slug}/opengraph-image`)],
    },
  };
}

export function buildHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/tools/{toolSlug}`,
      "query-input": "required name=toolSlug",
    },
  };
}

export function buildToolJsonLd(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.description,
    keywords: [
      tool.keywordCluster.primary,
      ...tool.keywordCluster.secondary,
      ...tool.keywordCluster.longTail,
    ].join(", "),
    url: absoluteUrl(`/tools/${tool.slug}`),
  };
}
