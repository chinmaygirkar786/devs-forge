import type { Metadata } from "next";

import { getToolBySlug } from "@/lib/tools";
import { siteConfig } from "@/lib/site";
import type { ToolCategory, ToolDefinition } from "@/tools";
import { toolCategories, tools } from "@/tools";

const indexableRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
};

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}

function absoluteTitle(title: string): Metadata["title"] {
  return { absolute: title };
}

export function buildHomeMetadata(): Metadata {
  const title = `${siteConfig.heroTitle} | ${siteConfig.name}`;
  const description =
    "Free developer tools online for formatting JSON and HTML, decoding JWTs, testing regex, converting timestamps, generating UUIDs, and more. All utilities run locally in your browser.";

  return {
    title: absoluteTitle(title),
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

export function buildToolPageTitle(tool: ToolDefinition) {
  const primary = tool.keywordCluster.primary;
  const short =
    primary.charAt(0).toUpperCase() + primary.slice(1);
  return `${short} – ${tool.name}`;
}

export function buildToolPageDescription(tool: ToolDefinition) {
  const secondary = tool.keywordCluster.secondary.slice(0, 2).join(", ");
  return `${tool.description} Free ${tool.keywordCluster.primary} for ${secondary}, and related tasks. Runs in your browser with no upload required.`;
}

export function buildToolMetadata(tool: ToolDefinition): Metadata {
  const title = tool.metaTitle ?? buildToolPageTitle(tool);
  const description = tool.metaDescription ?? buildToolPageDescription(tool);
  const url = absoluteUrl(`/tools/${tool.slug}`);

  return {
    title: absoluteTitle(`${title} | ${siteConfig.name}`),
    description,
    robots: indexableRobots,
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

export function buildToolsIndexMetadata(): Metadata {
  const title = `Free Online Developer Tools | ${siteConfig.name}`;
  const description =
    "Browse free browser-based developer tools for JSON, JWT, regex, Base64, UUIDs, HTML, timestamps, colors, Markdown, and more. No signup required.";

  return {
    title: absoluteTitle(title),
    description,
    alternates: {
      canonical: absoluteUrl("/tools"),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/tools"),
      type: "website",
      siteName: siteConfig.name,
    },
  };
}

export function buildCategoryMetadata(category: ToolCategory): Metadata {
  const meta = toolCategories[category];
  const title = `${meta.title} | ${siteConfig.name}`;
  const description = `${meta.description} Explore free online ${category} utilities on ${siteConfig.name}.`;

  return {
    title: absoluteTitle(title),
    description,
    alternates: {
      canonical: absoluteUrl(`/tools/category/${category}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/tools/category/${category}`),
      type: "website",
      siteName: siteConfig.name,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/opengraph-image"),
  };
}

export function buildHomeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    buildOrganizationJsonLd(),
  ];
}

export function buildToolsIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Online Developer Tools",
    description:
      "A collection of browser-based developer utilities on Devs Forge.",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(`/tools/${tool.slug}`),
    })),
  };
}

export function buildCategoryJsonLd(category: ToolCategory) {
  const meta = toolCategories[category];
  const categoryTools = tools.filter((tool) => tool.category === category);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    description: meta.description,
    numberOfItems: categoryTools.length,
    itemListElement: categoryTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(`/tools/${tool.slug}`),
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildToolBreadcrumbJsonLd(tool: ToolDefinition) {
  return buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    {
      name: toolCategories[tool.category].title,
      path: `/tools/category/${tool.category}`,
    },
    { name: tool.name, path: `/tools/${tool.slug}` },
  ]);
}

export function buildFaqJsonLd(tool: ToolDefinition) {
  if (!tool.faqs?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildToolJsonLd(tool: ToolDefinition) {
  const schemas: Record<string, unknown>[] = [
    {
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
      url: absoluteUrl(`/tools/${tool.slug}`),
    },
    buildToolBreadcrumbJsonLd(tool),
  ];

  const faqSchema = buildFaqJsonLd(tool);
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  return schemas;
}

export function buildToolPageJsonLd(tool: ToolDefinition) {
  return buildToolJsonLd(tool);
}

export function getToolMetadataBySlug(slug: string): Metadata | null {
  const tool = getToolBySlug(slug);
  return tool ? buildToolMetadata(tool) : null;
}
