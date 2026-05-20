const DEFAULT_SITE_URL = "https://devs-forge.com";

function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production" && !fromEnv) {
    console.warn(
      `[seo] NEXT_PUBLIC_SITE_URL is not set. Canonical URLs and sitemap will use ${DEFAULT_SITE_URL}. Set this in your host environment for production.`,
    );
  }

  if (
    process.env.SEO_STRICT_SITE_URL === "true" &&
    fromEnv &&
    fromEnv !== DEFAULT_SITE_URL
  ) {
    console.warn(
      `[seo] NEXT_PUBLIC_SITE_URL (${fromEnv}) differs from expected production domain (${DEFAULT_SITE_URL}).`,
    );
  }

  return fromEnv ?? DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: "Devs Forge",
  shortName: "Devs Forge",
  domain: "devs-forge.com",
  logoMark: "DF",
  description:
    "Fast, free developer tools for formatting, decoding, generating, and converting code and data directly in your browser.",
  url: resolveSiteUrl(),
  creator: "Devs Forge",
  socialHandle: "@devsforge",
  heroTitle: "Developer Tools Built for Everyday Work",
  heroDescription:
    "Use instant online utilities for JSON, JWTs, regex, timestamps, HTML, Markdown, colors, UUIDs, URLs, and more without leaving your workflow.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/#categories", label: "Categories" },
  ],
};
