import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";
import { getToolBySlug, toolSlugs } from "@/lib/tools";

export const dynamic = "force-static";

export function generateStaticParams() {
  return toolSlugs.map((slug) => ({ slug }));
}

export const alt = "Developer tool preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px",
          background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.28), transparent 24%), radial-gradient(circle at top right, rgba(6,182,212,0.22), transparent 18%), #111827",
          color: "#E5E7EB",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "24px",
            color: "#A5B4FC",
          }}
        >
          <div>{siteConfig.name}</div>
          <div>{tool?.keywordCluster.primary ?? "Developer utility"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.05 }}>
            {tool?.title ?? "Developer Tool"}
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.4, color: "#CBD5E1" }}>
            {tool?.description ??
              "Fast online utility built for modern developer workflows."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            fontSize: "20px",
          }}
        >
          {(tool?.keywordCluster.secondary ?? []).slice(0, 3).map((keyword) => (
            <div
              key={keyword}
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                color: "#E0E7FF",
              }}
            >
              {keyword}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
