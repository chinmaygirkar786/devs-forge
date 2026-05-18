import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at top left, rgba(79,70,229,0.22), transparent 24%), radial-gradient(circle at top right, rgba(6,182,212,0.22), transparent 18%), #0b1220",
          color: "#E5E7EB",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "64px",
              width: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {siteConfig.logoMark}
          </div>
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#A5B4FC",
            }}
          >
            {siteConfig.domain}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.1 }}>
            {siteConfig.heroTitle}
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.5, color: "#CBD5E1" }}>
            Fast browser-based utilities for JSON, JWT, regex, HTML, timestamps,
            colors, Markdown, and more.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
