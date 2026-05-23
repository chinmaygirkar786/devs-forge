const DEFAULT_SITE_URL = "https://devs-forge.com";

function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production" && !fromEnv) {
    console.warn(
      `[seo] NEXT_PUBLIC_SITE_URL is not set. Canonical URLs and sitemap will use ${DEFAULT_SITE_URL}. Set this in your host environment for production.`,
    );
  }

  if (process.env.SEO_STRICT_SITE_URL === "true" && fromEnv && fromEnv !== DEFAULT_SITE_URL) {
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
  heroTitle: "Free Developer Tools Online for Everyday Work",
  heroDescription:
    "Free developer tools online for formatting JSON and HTML, decoding JWTs, testing regex, converting timestamps, generating UUIDs, and more. All browser-based coding utilities run locally in your browser.",
  heroHighlights: [
    "JSON formatter and HTML formatter",
    "JWT decoder and regex tester",
    "Base64 encoder and UUID generator",
    "Color palette, timestamp, and Markdown tools",
  ],
  navigation: [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/#categories", label: "Categories" },
  ],
};
