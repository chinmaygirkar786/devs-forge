import type { ComponentType } from "react";

import type { AffiliateContext } from "@/lib/affiliate";

export type ToolCategory =
  | "formatting"
  | "conversion"
  | "generators"
  | "utilities";

export type ToolExample = {
  title: string;
  input?: string;
  output?: string;
};

export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  popular?: boolean;
  keywordCluster: {
    primary: string;
    secondary: string[];
    longTail: string[];
  };
  howItWorks: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
  affiliateContext: AffiliateContext[];
  loadComponent: () => Promise<{ default: ComponentType }>;
};

export const toolCategories: Record<
  ToolCategory,
  { title: string; description: string }
> = {
  formatting: {
    title: "Formatting Tools",
    description:
      "Clean up code, content, and markup for faster debugging and readable output.",
  },
  conversion: {
    title: "Conversion Tools",
    description:
      "Convert between common developer formats instantly without leaving the browser.",
  },
  generators: {
    title: "Generators",
    description:
      "Generate IDs, palettes, gradients, and interfaces for day-to-day development work.",
  },
  utilities: {
    title: "Developer Utilities",
    description:
      "Inspect tokens, validate patterns, and work through developer workflows faster.",
  },
};

export const tools: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    description:
      "Format raw JSON, validate syntax, and pretty-print structured data instantly in your browser.",
    category: "formatting",
    popular: true,
    keywordCluster: {
      primary: "json formatter online",
      secondary: [
        "format json",
        "json validator tool",
        "json pretty print",
        "json beautifier",
        "validate json online",
      ],
      longTail: [
        "format json payload online",
        "pretty print api response json",
        "fix invalid json structure online",
      ],
    },
    howItWorks: [
      "Paste JSON into the editor and the parser validates it in real time.",
      "Valid JSON is reformatted with consistent indentation for easier scanning and copying.",
      "Syntax errors are surfaced inline so you can fix malformed payloads quickly.",
    ],
    examples: [
      {
        title: "Format a compact API response",
        input: '{"name":"Ava","roles":["admin","editor"],"active":true}',
      },
      {
        title: "Validate a payload before debugging a request",
        input: '{"id":42,"settings":{"theme":"dark"}}',
      },
    ],
    relatedSlugs: ["json-to-typescript", "html-formatter", "base64-encoder"],
    affiliateContext: ["backend", "api", "hosting"],
    loadComponent: () => import("@/tools/json-formatter/Tool"),
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder / Inspector",
    description:
      "Decode JWT headers and payloads, inspect claims, and review token timestamps locally.",
    category: "utilities",
    popular: true,
    keywordCluster: {
      primary: "jwt decoder online",
      secondary: [
        "decode jwt token",
        "jwt payload viewer",
        "jwt inspector",
        "jwt token decoder",
        "read jwt claims online",
      ],
      longTail: [
        "decode bearer token payload online",
        "inspect jwt expiration and issuer",
        "view jwt header and claims locally",
      ],
    },
    howItWorks: [
      "Paste a JWT and the tool splits it into header, payload, and signature segments.",
      "The first two segments are base64url-decoded in the browser with no network requests.",
      "Standard claims like expiration and issuer are highlighted for faster inspection.",
    ],
    examples: [
      {
        title: "Inspect API authentication claims",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJEZXYgVXNlciIsImlhdCI6MTcxNTYxOTYwMCwiZXhwIjoxNzE1NjIzMjAwLCJpc3MiOiJkZXZlbG9wZXItdG9vbHMtaHViIn0.signature",
      },
    ],
    relatedSlugs: ["base64-encoder", "json-formatter", "timestamp-converter"],
    affiliateContext: ["ai-coding", "api", "backend"],
    loadComponent: () => import("@/tools/jwt-decoder/Tool"),
  },
  {
    slug: "regex-tester",
    name: "Regex Tester with Explanation",
    description:
      "Test regular expressions, review matches, and get a lightweight explanation of common regex tokens.",
    category: "utilities",
    popular: true,
    keywordCluster: {
      primary: "regex tester online",
      secondary: [
        "test regex pattern",
        "regex debugger",
        "regular expression tester",
        "regex match tool",
        "regex pattern checker",
      ],
      longTail: [
        "debug regex groups online",
        "test regex against sample text",
        "explain regex syntax in browser",
      ],
    },
    howItWorks: [
      "Enter a regex pattern, choose flags, and provide sample text to test against.",
      "The tool lists every match and capture group without sending your pattern anywhere.",
      "Common tokens are translated into plain English to make pattern review easier.",
    ],
    examples: [
      {
        title: "Capture issue keys from commit messages",
        input: "[A-Z]{2,}-\\d+",
      },
      {
        title: "Validate email-like text",
        input: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
    ],
    relatedSlugs: ["url-encoder", "json-formatter", "html-formatter"],
    affiliateContext: ["ai-coding", "frontend", "backend"],
    loadComponent: () => import("@/tools/regex-tester/Tool"),
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode plain text to Base64 or decode Base64 payloads instantly with UTF-8 support.",
    category: "conversion",
    popular: true,
    keywordCluster: {
      primary: "base64 encoder online",
      secondary: [
        "base64 decoder online",
        "encode base64",
        "decode base64 string",
        "base64 converter",
        "utf8 base64 tool",
      ],
      longTail: [
        "decode api payload from base64",
        "encode unicode text to base64 online",
        "base64 url safe decode tool",
      ],
    },
    howItWorks: [
      "Switch between encode and decode mode depending on your workflow.",
      "The tool handles UTF-8 text safely before converting to or from Base64.",
      "Use the copy action to move the transformed output into your app or request inspector.",
    ],
    examples: [
      {
        title: "Encode a credential string",
        input: "developer:super-secret-token",
      },
    ],
    relatedSlugs: ["jwt-decoder", "json-formatter", "url-encoder"],
    affiliateContext: ["api", "backend", "productivity"],
    loadComponent: () => import("@/tools/base64-encoder/Tool"),
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description:
      "Generate UUID v4 values in batches for seeds, fixtures, IDs, and test data.",
    category: "generators",
    popular: true,
    keywordCluster: {
      primary: "uuid generator online",
      secondary: [
        "generate uuid v4",
        "random uuid generator",
        "uuid v4 online",
        "create uuid",
        "guid generator",
      ],
      longTail: [
        "generate multiple uuid values online",
        "copy uuid v4 list for test data",
        "browser uuid generator for fixtures",
      ],
    },
    howItWorks: [
      "Select how many UUIDs you want and generate a fresh list instantly.",
      "UUIDs are created locally with the browser crypto API for reliable randomness.",
      "Copy a single UUID or the entire batch for use in tests and seed files.",
    ],
    examples: [
      {
        title: "Create fixture IDs for local development",
      },
    ],
    relatedSlugs: ["timestamp-converter", "json-to-typescript", "color-palette-generator"],
    affiliateContext: ["ai-coding", "backend", "productivity"],
    loadComponent: () => import("@/tools/uuid-generator/Tool"),
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    description:
      "Generate balanced color ramps from a base color for UI themes, design systems, and dashboards.",
    category: "generators",
    popular: true,
    keywordCluster: {
      primary: "color palette generator",
      secondary: [
        "ui color palette generator",
        "generate color shades",
        "tailwind color scale generator",
        "design palette creator",
        "hex palette generator",
      ],
      longTail: [
        "generate ui color shades from hex",
        "create design system palette online",
        "build accessible color ramp in browser",
      ],
    },
    howItWorks: [
      "Pick a base color and the generator creates lighter and darker variations.",
      "Every swatch is ready to copy as a hex value for CSS variables or design tools.",
      "Use the random action when you want quick visual inspiration for a new UI concept.",
    ],
    examples: [
      {
        title: "Create an indigo product palette",
        input: "#4F46E5",
      },
    ],
    relatedSlugs: ["gradient-generator", "markdown-previewer", "uuid-generator"],
    affiliateContext: ["design", "frontend", "productivity"],
    loadComponent: () => import("@/tools/color-palette-generator/Tool"),
  },
  {
    slug: "gradient-generator",
    name: "Gradient Generator",
    description:
      "Build CSS gradients with live previews, adjustable angles, and easy copy-to-clipboard output.",
    category: "generators",
    popular: false,
    keywordCluster: {
      primary: "gradient generator css",
      secondary: [
        "gradient generator",
        "css gradient builder",
        "linear gradient generator",
        "background gradient tool",
        "generate gradient css",
      ],
      longTail: [
        "build linear gradient for button background",
        "generate css gradient code online",
        "preview angle based gradient in browser",
      ],
    },
    howItWorks: [
      "Choose two colors and an angle to generate a CSS linear-gradient declaration.",
      "The preview updates instantly so you can compare direction and contrast changes.",
      "Copy the generated CSS into your stylesheet or component theme tokens.",
    ],
    examples: [
      {
        title: "Create a hero background gradient",
        input: "#4F46E5 to #06B6D4",
      },
    ],
    relatedSlugs: ["color-palette-generator", "markdown-previewer", "html-formatter"],
    affiliateContext: ["design", "frontend", "productivity"],
    loadComponent: () => import("@/tools/gradient-generator/Tool"),
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    description:
      "Write Markdown and preview rendered output side by side with clean typography.",
    category: "formatting",
    popular: false,
    keywordCluster: {
      primary: "markdown previewer online",
      secondary: [
        "markdown editor preview",
        "markdown renderer",
        "preview markdown live",
        "markdown to html preview",
        "online markdown tool",
      ],
      longTail: [
        "live markdown preview for readme",
        "render markdown documentation online",
        "preview markdown before publishing docs",
      ],
    },
    howItWorks: [
      "Type Markdown into the editor and review the rendered output instantly.",
      "Headers, lists, code blocks, and emphasis are converted locally in the browser.",
      "Use the output to validate README formatting before publishing docs or content.",
    ],
    examples: [
      {
        title: "Preview a README section",
        input: "# Developer Tools Hub\n\n- Fast\n- SEO-first\n- Browser-only",
      },
    ],
    relatedSlugs: ["html-formatter", "gradient-generator", "color-palette-generator"],
    affiliateContext: ["frontend", "productivity", "design"],
    loadComponent: () => import("@/tools/markdown-previewer/Tool"),
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode and decode URLs, query strings, and path values safely for browser and API workflows.",
    category: "conversion",
    popular: true,
    keywordCluster: {
      primary: "url encoder decoder online",
      secondary: [
        "url encode online",
        "decode url string",
        "query string encoder",
        "percent encode tool",
        "url decode tool",
      ],
      longTail: [
        "encode query params for api requests",
        "decode percent encoded url online",
        "convert url string to readable text",
      ],
    },
    howItWorks: [
      "Paste a raw or encoded string and switch modes between encode and decode.",
      "The utility uses native browser URL encoding behavior for predictable results.",
      "This is useful for query parameters, redirect values, and debugging request payloads.",
    ],
    examples: [
      {
        title: "Encode a redirect callback",
        input: "https://example.com/callback?tab=team members",
      },
    ],
    relatedSlugs: ["regex-tester", "base64-encoder", "json-formatter"],
    affiliateContext: ["api", "backend", "frontend"],
    loadComponent: () => import("@/tools/url-encoder/Tool"),
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter / Minifier",
    description:
      "Beautify messy HTML or minify markup for compact embeds and production snippets.",
    category: "formatting",
    popular: true,
    keywordCluster: {
      primary: "html formatter online",
      secondary: [
        "html beautifier",
        "html minifier",
        "format html",
        "minify html online",
        "pretty print html",
      ],
      longTail: [
        "format html email template online",
        "minify html snippet for embed code",
        "beautify raw html markup in browser",
      ],
    },
    howItWorks: [
      "Choose whether to format or minify your markup and the output updates instantly.",
      "Formatting adds indentation to nested tags for readability while minifying removes extra whitespace.",
      "Everything runs locally, which makes it safe for snippets that should never leave your browser.",
    ],
    examples: [
      {
        title: "Beautify a widget snippet",
        input: "<section><h1>Hello</h1><p>World</p></section>",
      },
    ],
    relatedSlugs: ["markdown-previewer", "json-formatter", "url-encoder"],
    affiliateContext: ["frontend", "hosting", "design"],
    loadComponent: () => import("@/tools/html-formatter/Tool"),
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and parse readable dates back to Unix values.",
    category: "conversion",
    popular: true,
    keywordCluster: {
      primary: "timestamp converter online",
      secondary: [
        "unix timestamp converter",
        "epoch converter",
        "unix to date online",
        "date to unix timestamp",
        "timestamp decoder",
      ],
      longTail: [
        "convert unix milliseconds to date",
        "turn readable date into epoch seconds",
        "inspect jwt exp timestamp online",
      ],
    },
    howItWorks: [
      "Enter either a Unix value or a human-readable date and the tool resolves both formats.",
      "Seconds and milliseconds are detected automatically to reduce formatting mistakes.",
      "The result includes ISO output and localized date formatting for quick debugging.",
    ],
    examples: [
      {
        title: "Inspect an expiration claim",
        input: "1715619600",
      },
    ],
    relatedSlugs: ["jwt-decoder", "uuid-generator", "json-formatter"],
    affiliateContext: ["api", "backend", "productivity"],
    loadComponent: () => import("@/tools/timestamp-converter/Tool"),
  },
  {
    slug: "json-to-typescript",
    name: "JSON to TypeScript Interface Generator",
    description:
      "Convert sample JSON into TypeScript interfaces for faster API typing and frontend scaffolding.",
    category: "generators",
    popular: true,
    keywordCluster: {
      primary: "json to typescript interface generator",
      secondary: [
        "json to typescript",
        "generate interface from json",
        "json to ts converter",
        "typescript interface generator",
        "api response to interface",
      ],
      longTail: [
        "convert api json to typescript interface",
        "generate nested ts types from json",
        "create interface from sample payload online",
      ],
    },
    howItWorks: [
      "Paste a representative JSON payload and the generator infers nested object and array types.",
      "A root interface name keeps output ready for direct use inside a TypeScript codebase.",
      "Use the result as a starting point, then refine optional fields and exact literal unions as needed.",
    ],
    examples: [
      {
        title: "Generate types from a user payload",
        input: '{"id":"usr_1","name":"Ava","roles":["admin"],"profile":{"timezone":"UTC"}}',
      },
    ],
    relatedSlugs: ["json-formatter", "uuid-generator", "base64-encoder"],
    affiliateContext: ["ai-coding", "backend", "frontend"],
    loadComponent: () => import("@/tools/json-to-typescript/Tool"),
  },
];

export const toolSlugs = tools.map((tool) => tool.slug);
