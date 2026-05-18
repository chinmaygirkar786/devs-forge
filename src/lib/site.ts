export const siteConfig = {
  name: "Devs Forge",
  shortName: "Devs Forge",
  domain: "devs-forge.com",
  logoMark: "DF",
  description:
    "Fast, free developer tools for formatting, decoding, generating, and converting code and data directly in your browser.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://devs-forge.com",
  creator: "Devs Forge",
  socialHandle: "@devsforge",
  heroTitle: "Developer Tools Built for Everyday Work",
  heroDescription:
    "Use instant online utilities for JSON, JWTs, regex, timestamps, HTML, Markdown, colors, UUIDs, URLs, and more without leaving your workflow.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/#popular-tools", label: "Popular Tools" },
    { href: "/#categories", label: "Categories" },
  ],
};
