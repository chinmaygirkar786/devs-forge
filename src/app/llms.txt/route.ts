import { NextResponse } from "next/server";

import { routes } from "@/lib/internal-links";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getToolsByCategory } from "@/lib/tools";

export const dynamic = "force-static";

/** llms.txt following the https://llmstxt.org/ spec (H1, blockquote, markdown link lists). */
function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push(
    `${siteConfig.name} is a hub of fast, browser-based developer utilities for formatting, ` +
      `decoding, converting, and generating code and data. Every tool runs locally in the ` +
      `browser with no signup and no uploads. Each tool page includes a description, common ` +
      `use cases, and FAQs.`,
  );
  lines.push("");

  lines.push("## Main pages");
  lines.push("");
  lines.push(
    `- [Home](${absoluteUrl(routes.home)}): Overview of the available developer tools.`,
  );
  lines.push(
    `- [All tools](${absoluteUrl(routes.toolsIndex)}): Full directory of tools grouped by category.`,
  );
  lines.push(`- [About](${absoluteUrl(routes.about)}): What ${siteConfig.name} is and how it works.`);
  lines.push("");

  for (const category of getToolsByCategory()) {
    if (category.tools.length === 0) {
      continue;
    }

    lines.push(`## ${category.title}`);
    lines.push("");

    for (const tool of category.tools) {
      lines.push(`- [${tool.seoLinkLabel}](${absoluteUrl(routes.tool(tool.slug))}): ${tool.description}`);
    }

    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Complete list of indexable URLs on the site.`,
  );
  lines.push("");

  return lines.join("\n");
}

export async function GET() {
  return new NextResponse(buildLlmsTxt(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
