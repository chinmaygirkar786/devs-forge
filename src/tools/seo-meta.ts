import type { ToolSlug } from "@/tools/slugs";

export type ToolSerpMeta = {
  metaTitle: string;
  metaDescription: string;
  pageHeading: string;
  seoLinkLabel: string;
};

export const toolSerpMeta: Record<ToolSlug, ToolSerpMeta> = {
  "json-formatter": {
    metaTitle: "JSON Formatter Online – Free Validator & Pretty Print",
    metaDescription:
      "Free json formatter online to validate syntax, pretty-print API responses, and fix malformed JSON in your browser. No upload or account required.",
    pageHeading: "JSON Formatter Online",
    seoLinkLabel: "JSON formatter online",
  },
  "jwt-decoder": {
    metaTitle: "JWT Decoder Online – Inspect Token Claims Locally",
    metaDescription:
      "Free jwt decoder online to read header and payload claims, check expiration, and debug bearer tokens in your browser with no upload required.",
    pageHeading: "JWT Decoder Online",
    seoLinkLabel: "JWT decoder online",
  },
  "regex-tester": {
    metaTitle: "Regex Tester Online – Test Patterns & Match Groups",
    metaDescription:
      "Free regex tester online to debug patterns, view matches and capture groups, and get plain-English token hints. Runs locally with no upload.",
    pageHeading: "Regex Tester Online",
    seoLinkLabel: "Regex tester online",
  },
  "base64-encoder": {
    metaTitle: "Base64 Encoder Online – Encode & Decode UTF-8 Text",
    metaDescription:
      "Free base64 encoder online to encode or decode strings with UTF-8 support for API payloads and tokens. Browser-based, no upload required.",
    pageHeading: "Base64 Encoder Online",
    seoLinkLabel: "Base64 encoder online",
  },
  "uuid-generator": {
    metaTitle: "UUID Generator Online – Create UUID v4 Values",
    metaDescription:
      "Free uuid generator online to create UUID v4 IDs in batches for tests, fixtures, and seed data. Generated locally in your browser.",
    pageHeading: "UUID Generator Online",
    seoLinkLabel: "UUID generator online",
  },
  "color-palette-generator": {
    metaTitle: "Color Palette Generator – UI Shades from One Hex",
    metaDescription:
      "Free color palette generator to build balanced UI ramps from a base hex for design systems and dashboards. Copy swatches in your browser.",
    pageHeading: "Color Palette Generator",
    seoLinkLabel: "Color palette generator",
  },
  "gradient-generator": {
    metaTitle: "CSS Gradient Generator – Linear Gradients with Live Preview",
    metaDescription:
      "Free gradient generator CSS tool to build linear gradients, adjust angle and stops, and copy ready-to-use CSS. Preview updates instantly in browser.",
    pageHeading: "CSS Gradient Generator",
    seoLinkLabel: "Gradient generator CSS",
  },
  "markdown-previewer": {
    metaTitle: "Markdown Previewer Online – Live Rendered Preview",
    metaDescription:
      "Free markdown previewer online to write Markdown and preview rendered output side by side before publishing README or docs. No upload required.",
    pageHeading: "Markdown Previewer Online",
    seoLinkLabel: "Markdown previewer online",
  },
  "url-encoder": {
    metaTitle: "URL Encoder Decoder Online – Encode Query Strings",
    metaDescription:
      "Free url encoder decoder online to percent-encode or decode URLs, query strings, and path values for API and redirect workflows. Runs in browser.",
    pageHeading: "URL Encoder Decoder Online",
    seoLinkLabel: "URL encoder decoder online",
  },
  "html-formatter": {
    metaTitle: "HTML Formatter Online – Beautify & Minify Markup",
    metaDescription:
      "Free html formatter online to beautify messy HTML or minify snippets for embeds and production. Format html safely in your browser, no upload.",
    pageHeading: "HTML Formatter Online",
    seoLinkLabel: "HTML formatter online",
  },
  "xml-formatter": {
    metaTitle: "XML Formatter Online – Free Validator & Pretty Print",
    metaDescription:
      "Free xml formatter online to validate syntax, pretty-print RSS and SOAP XML, and minify documents in your browser. No upload or account required.",
    pageHeading: "XML Formatter Online",
    seoLinkLabel: "XML formatter online",
  },
  "yaml-formatter": {
    metaTitle: "YAML Formatter Online – Validate & Pretty Print Config",
    metaDescription:
      "Free yaml formatter online to validate Kubernetes, Compose, and CI YAML with pretty-print or minify modes. Runs locally in your browser, no upload.",
    pageHeading: "YAML Formatter Online",
    seoLinkLabel: "YAML formatter online",
  },
  "css-formatter": {
    metaTitle: "CSS Formatter Online – Beautify & Minify Styles",
    metaDescription:
      "Free css formatter online to beautify or minify CSS snippets for components and email templates. Browser-based with no upload required.",
    pageHeading: "CSS Formatter Online",
    seoLinkLabel: "CSS formatter online",
  },
  "case-converter": {
    metaTitle: "Case Converter Online – camelCase, snake_case & More",
    metaDescription:
      "Free case converter online for camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. Convert identifiers locally with no upload.",
    pageHeading: "Case Converter Online",
    seoLinkLabel: "Case converter online",
  },
  "hash-generator": {
    metaTitle: "Hash Generator Online – SHA-256 & SHA-512 Hex",
    metaDescription:
      "Free hash generator online for SHA-256, SHA-384, SHA-512, and SHA-1 digests from text. Web Crypto runs locally in your browser, no upload.",
    pageHeading: "Hash Generator Online",
    seoLinkLabel: "Hash generator online",
  },
  "cron-parser": {
    metaTitle: "Cron Expression Parser – Human-Readable Schedule",
    metaDescription:
      "Free cron parser online to explain standard five-field cron expressions in plain English. Debug crontab and CI schedules in your browser.",
    pageHeading: "Cron Expression Parser",
    seoLinkLabel: "Cron expression parser",
  },
  "query-string-parser": {
    metaTitle: "Query String Parser – Decode URL Parameters",
    metaDescription:
      "Free query string parser online to split URL parameters into a table and rebuild encoded query strings. Local browser parsing, no upload.",
    pageHeading: "Query String Parser",
    seoLinkLabel: "Query string parser",
  },
  "timestamp-converter": {
    metaTitle: "Timestamp Converter Online – Unix to Date & Back",
    metaDescription:
      "Free timestamp converter online to turn Unix seconds or milliseconds into readable dates and parse dates back to epoch. Browser-based, no upload.",
    pageHeading: "Timestamp Converter Online",
    seoLinkLabel: "Timestamp converter online",
  },
  "json-to-typescript": {
    metaTitle: "JSON to TypeScript Interface Generator – Free Online",
    metaDescription:
      "Free json to typescript interface generator to infer nested types from sample API JSON. Create interfaces in your browser with no upload required.",
    pageHeading: "JSON to TypeScript Generator",
    seoLinkLabel: "JSON to TypeScript interface generator",
  },
  "linkedin-post-formatter": {
    metaTitle: "LinkedIn Post Formatter – Bold, Italic & Unicode Text",
    metaDescription:
      "Free linkedin post formatter online to apply bold, italic, underline, and strikethrough with Unicode. Copy and paste into LinkedIn—no Word required.",
    pageHeading: "LinkedIn Post Formatter",
    seoLinkLabel: "LinkedIn post formatter",
  },
};
