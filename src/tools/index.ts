import { buildToolKeywords } from "@/tools/keywords";
import { toolSerpMeta } from "@/tools/seo-meta";
import { toolSeoContent } from "@/tools/seo-content";
import type { ToolSlug } from "@/tools/slugs";
import type { ToolDefinition, ToolSeed } from "@/tools/types";
import { assertToolRegistry } from "@/tools/validate";

export type {
  ToolCategory,
  ToolContentSection,
  ToolDefinition,
  ToolExample,
  ToolFaq,
  ToolKeywordCluster,
  ToolSeed,
  ToolSeoBlock,
} from "@/tools/types";

export { toolCategories, toolCategoryKeys } from "@/tools/categories";
export { toolSlugList, isToolSlug } from "@/tools/slugs";
export type { ToolSlug } from "@/tools/slugs";
export { buildToolKeywords } from "@/tools/keywords";

const toolSeeds: ToolSeed[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
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
        output: `{
  "name": "Ava",
  "roles": ["admin", "editor"],
  "active": true
}`,
      },
      {
        title: "Validate nested configuration JSON",
        input: '{"id":42,"settings":{"theme":"dark","notifications":true}}',
      },
      {
        title: "Catch invalid JSON before deployment",
        input: '{"status":"ok","items":[1,2,3,]}',
      },
      {
        title: "Pretty-print a webhook payload",
        input: '{"event":"order.created","id":"ord_9f2","total":129.5}',
      },
    ],
    relatedSlugs: [
      "json-to-typescript",
      "xml-formatter",
      "html-formatter",
      "base64-encoder",
      "jwt-decoder",
      "regex-tester",
      "url-encoder",
    ],
    affiliateContext: ["backend", "api", "hosting"],
    loadComponent: () => import("@/tools/json-formatter/Tool"),
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder / Inspector",
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
      {
        title: "Review OAuth scope and audience fields",
        input:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQIjoiYXBpLmV4YW1wbGUuY29tIiwic2NvcGUiOiJyZWFkIHdyaXRlIiwiZXhwIjoxNzE1NjIzMjAwfQ.signature",
      },
      {
        title: "Compare header algorithm values",
        input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature",
      },
    ],
    relatedSlugs: [
      "base64-encoder",
      "json-formatter",
      "timestamp-converter",
      "regex-tester",
      "uuid-generator",
    ],
    affiliateContext: ["ai-coding", "api", "backend"],
    loadComponent: () => import("@/tools/jwt-decoder/Tool"),
  },
  {
    slug: "regex-tester",
    title: "Regex Tester with Explanation",
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
        input: "Pattern: [A-Z]{2,}-\\d+  |  Sample: Fix API-1024 timeout",
      },
      {
        title: "Validate email-like text",
        input: "Pattern: ^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$  |  Sample: dev@example.com",
      },
      {
        title: "Extract semver from a release tag",
        input: "Pattern: v?(\\d+\\.\\d+\\.\\d+)  |  Sample: release/v2.4.1",
      },
      {
        title: "Find UUIDs inside log lines",
        input:
          "Pattern: [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}  |  Sample: user=550e8400-e29b-41d4-a716-446655440000",
      },
    ],
    relatedSlugs: [
      "url-encoder",
      "json-formatter",
      "html-formatter",
      "base64-encoder",
      "jwt-decoder",
    ],
    affiliateContext: ["ai-coding", "frontend", "backend"],
    loadComponent: () => import("@/tools/regex-tester/Tool"),
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
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
        output: "ZGV2ZWxvcGVyOnN1cGVyLXNlY3JldC10b2tlbg==",
      },
      {
        title: "Decode a Base64 JSON attachment",
        input: "eyJuYW1lIjoiQXZhIiwicm9sZSI6ImFkbWluIn0=",
        output: '{"name":"Ava","role":"admin"}',
      },
      {
        title: "Encode Unicode text safely",
        input: "Hello 世界 🚀",
      },
      {
        title: "Decode a URL-safe Base64 sample",
        input: "dGV4dC13aXRoLWh5cGhlbnM",
      },
    ],
    relatedSlugs: [
      "jwt-decoder",
      "json-formatter",
      "xml-formatter",
      "url-encoder",
      "json-to-typescript",
      "regex-tester",
    ],
    affiliateContext: ["api", "backend", "productivity"],
    loadComponent: () => import("@/tools/base64-encoder/Tool"),
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4 values in batches for seeds, fixtures, IDs, and test data.",
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
        output: "550e8400-e29b-41d4-a716-446655440000",
      },
      {
        title: "Generate a batch for seed scripts",
        output:
          "f47ac10b-58cc-4372-a567-0e02b2c3d479\n6ba7b810-9dad-11d1-80b4-00c04fd430c8\n6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      },
      {
        title: "Mock a user id in API examples",
        output: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      },
      {
        title: "Correlation id for tracing docs",
        output: "2ff7bde8-7c28-4f3f-b3b1-9f4e6d0a8c21",
      },
    ],
    relatedSlugs: [
      "timestamp-converter",
      "json-to-typescript",
      "json-formatter",
      "jwt-decoder",
      "base64-encoder",
      "color-palette-generator",
    ],
    affiliateContext: ["ai-coding", "backend", "productivity"],
    loadComponent: () => import("@/tools/uuid-generator/Tool"),
  },
  {
    slug: "color-palette-generator",
    title: "Color Palette Generator",
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
    title: "Gradient Generator",
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
    title: "Markdown Previewer",
    description: "Write Markdown and preview rendered output side by side with clean typography.",
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
        input: "# Devs Forge\n\n- Fast\n- Browser-only\n- Free tools",
      },
    ],
    relatedSlugs: ["html-formatter", "xml-formatter", "json-formatter", "gradient-generator"],
    affiliateContext: ["frontend", "productivity", "design"],
    loadComponent: () => import("@/tools/markdown-previewer/Tool"),
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
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
    relatedSlugs: [
      "query-string-parser",
      "regex-tester",
      "base64-encoder",
      "json-formatter",
      "html-formatter",
      "xml-formatter",
    ],
    affiliateContext: ["api", "backend", "frontend"],
    loadComponent: () => import("@/tools/url-encoder/Tool"),
  },
  {
    slug: "html-formatter",
    title: "HTML Formatter / Minifier",
    description: "Beautify messy HTML or minify markup for compact embeds and production snippets.",
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
    relatedSlugs: [
      "css-formatter",
      "markdown-previewer",
      "json-formatter",
      "xml-formatter",
      "url-encoder",
      "regex-tester",
    ],
    affiliateContext: ["frontend", "hosting", "design"],
    loadComponent: () => import("@/tools/html-formatter/Tool"),
  },
  {
    slug: "xml-formatter",
    title: "XML Formatter / Minifier",
    description:
      "Pretty-print or minify XML for RSS feeds, SOAP envelopes, Android layouts, and config files—validated locally in your browser.",
    category: "formatting",
    popular: true,
    keywordCluster: {
      primary: "xml formatter online",
      secondary: [
        "pretty print xml",
        "xml validator",
        "format xml",
        "xml beautifier",
        "minify xml online",
      ],
      longTail: [
        "format soap xml envelope online",
        "pretty print rss feed xml",
        "validate android layout xml in browser",
      ],
    },
    howItWorks: [
      "Paste XML and choose format or minify—the parser validates structure before transforming output.",
      "Formatting indents nested elements for readability; minifying removes extra whitespace between tags.",
      "Processing uses the browser DOMParser locally, so payloads never leave your device.",
    ],
    examples: [
      {
        title: "Pretty-print a minified RSS feed",
        input:
          '<?xml version="1.0"?><rss version="2.0"><channel><title>Devs Forge</title><item><title>JSON Formatter</title></item></channel></rss>',
        output: `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Devs Forge</title>
    <item>
      <title>JSON Formatter</title>
    </item>
  </channel>
</rss>`,
      },
      {
        title: "Format a SOAP envelope",
        input:
          '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetUser><id>42</id></GetUser></soap:Body></soap:Envelope>',
      },
      {
        title: "Catch an unclosed tag before deploy",
        input: "<root><item>open</root>",
      },
      {
        title: "Indent Android-style layout XML",
        input:
          '<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:orientation="vertical"><TextView android:text="Hello"/></LinearLayout>',
      },
    ],
    relatedSlugs: [
      "json-formatter",
      "html-formatter",
      "markdown-previewer",
      "base64-encoder",
      "url-encoder",
    ],
    affiliateContext: ["api", "backend", "hosting"],
    loadComponent: () => import("@/tools/xml-formatter/Tool"),
  },
  {
    slug: "yaml-formatter",
    title: "YAML Formatter / Minifier",
    description:
      "Format and validate YAML for Kubernetes, Docker Compose, and CI pipelines with local parsing and copy-ready output.",
    category: "formatting",
    popular: true,
    keywordCluster: {
      primary: "yaml formatter online",
      secondary: [
        "yaml validator",
        "pretty print yaml",
        "format yaml",
        "yaml beautifier",
        "minify yaml online",
      ],
      longTail: [
        "format kubernetes yaml manifest online",
        "validate docker compose yaml in browser",
        "pretty print github actions workflow yaml",
      ],
    },
    howItWorks: [
      "Paste YAML and choose format or minify—the parser validates structure before output updates.",
      "Format expands nested maps into indented block style for readability.",
      "Minify uses flow style ({ key: value }) on nested structures to reduce whitespace while keeping top-level keys separate.",
    ],
    examples: [
      {
        title: "Format compact Kubernetes YAML",
        input:
          'apiVersion: v1\nkind: ConfigMap\nmetadata: { name: app-config }\ndata: { DEBUG: "true", RETRIES: 3 }',
        output: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DEBUG: "true"
  RETRIES: 3`,
      },
      {
        title: "Validate docker-compose services block",
        input: 'services:\n  web:\n    image: nginx:latest\n    ports:\n      - "8080:80"',
      },
      {
        title: "Catch bad indentation",
        input: "root:\n  child:\n   bad-indent: 1",
      },
      {
        title: "Minify CI workflow snippet",
        input: "name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest",
      },
    ],
    relatedSlugs: [
      "json-formatter",
      "xml-formatter",
      "html-formatter",
      "json-to-typescript",
      "timestamp-converter",
    ],
    affiliateContext: ["backend", "api", "hosting"],
    loadComponent: () => import("@/tools/yaml-formatter/Tool"),
  },
  {
    slug: "css-formatter",
    title: "CSS Formatter / Minifier",
    description:
      "Beautify or minify CSS rules for components, email templates, and quick style debugging in the browser.",
    category: "formatting",
    popular: false,
    keywordCluster: {
      primary: "css formatter online",
      secondary: [
        "css beautifier",
        "css minifier",
        "format css",
        "pretty print css",
        "minify css online",
      ],
      longTail: [
        "beautify copied chrome devtools css",
        "minify email template css snippet",
        "format component css module online",
      ],
    },
    howItWorks: [
      "Paste CSS and pick format or minify to transform output instantly.",
      "Formatting splits selectors and declarations onto readable lines.",
      "Processing is local—styles never upload to a server.",
    ],
    examples: [
      {
        title: "Format a card component rule",
        input: ".card{display:flex;gap:1rem;padding:1.5rem;border-radius:1rem;}",
      },
      {
        title: "Minify hero section CSS",
        input: ".hero { padding: 4rem 2rem; background: #111; color: #fff; }",
      },
      {
        title: "Format media query block",
        input: "@media (min-width:768px){.grid{grid-template-columns:repeat(2,1fr);}}",
      },
      {
        title: "Clean utility classes",
        input: ".btn-primary{background:#4f46e5;color:#fff;border-radius:999px;}",
      },
    ],
    relatedSlugs: [
      "html-formatter",
      "gradient-generator",
      "color-palette-generator",
      "markdown-previewer",
    ],
    affiliateContext: ["frontend", "design", "hosting"],
    loadComponent: () => import("@/tools/css-formatter/Tool"),
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert identifiers between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE for APIs and configs.",
    category: "conversion",
    popular: true,
    keywordCluster: {
      primary: "case converter online",
      secondary: [
        "camelCase converter",
        "snake_case converter",
        "kebab-case converter",
        "pascal case converter",
        "convert variable name case",
      ],
      longTail: [
        "convert api field names to camelCase",
        "turn database column to snake_case online",
        "generate kebab-case slug from title",
      ],
    },
    howItWorks: [
      "Paste any identifier or phrase and pick the target naming convention.",
      "The converter tokenizes words from spaces, underscores, hyphens, and camelCase boundaries.",
      "Output updates instantly with no network requests.",
    ],
    examples: [
      { title: "snake_case to camelCase", input: "user_profile_id", output: "userProfileId" },
      { title: "Phrase to kebab-case", input: "Order Line Item", output: "order-line-item" },
      { title: "camelCase to CONSTANT_CASE", input: "maxRetryCount", output: "MAX_RETRY_COUNT" },
      {
        title: "Mixed input to PascalCase",
        input: "http_response_code",
        output: "HttpResponseCode",
      },
    ],
    relatedSlugs: [
      "json-formatter",
      "json-to-typescript",
      "url-encoder",
      "regex-tester",
      "uuid-generator",
    ],
    affiliateContext: ["backend", "frontend", "api"],
    loadComponent: () => import("@/tools/case-converter/Tool"),
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description:
      "Generate SHA-256, SHA-384, SHA-512, and SHA-1 hex digests from text using Web Crypto in your browser.",
    category: "utilities",
    popular: true,
    keywordCluster: {
      primary: "hash generator online",
      secondary: [
        "sha256 generator",
        "sha512 hash online",
        "text to sha256",
        "checksum generator",
        "sha hash calculator",
      ],
      longTail: [
        "generate sha256 checksum for string online",
        "compute sha512 digest in browser",
        "hash text locally without upload",
      ],
    },
    howItWorks: [
      "Enter plain text and select a SHA algorithm.",
      "Web Crypto computes the digest locally and shows lowercase hex output.",
      "Copy the hash into scripts, tickets, or comparison notes.",
    ],
    examples: [
      { title: "SHA-256 of a short string", input: "developer-tools-hub" },
      { title: "SHA-512 for cache key material", input: "cache:user:42:preferences" },
      { title: "SHA-384 sample", input: "webhook-payload-v3" },
      { title: "SHA-1 legacy checksum", input: "legacy-integration-token" },
    ],
    relatedSlugs: [
      "base64-encoder",
      "jwt-decoder",
      "uuid-generator",
      "json-formatter",
      "regex-tester",
    ],
    affiliateContext: ["api", "backend", "productivity"],
    loadComponent: () => import("@/tools/hash-generator/Tool"),
  },
  {
    slug: "cron-parser",
    title: "Cron Expression Parser",
    description:
      "Explain standard five-field cron expressions in plain English for crontab, workers, and CI schedules.",
    category: "utilities",
    popular: false,
    keywordCluster: {
      primary: "cron expression parser",
      secondary: [
        "cron parser online",
        "cron to english",
        "explain cron schedule",
        "crontab translator",
        "cron syntax helper",
      ],
      longTail: [
        "what does 0 star slash 6 star star star mean",
        "explain github actions cron schedule",
        "decode crontab line online",
      ],
    },
    howItWorks: [
      "Paste a five-field cron expression such as `0 */6 * * *`.",
      "The parser validates syntax and returns a human-readable schedule description.",
      "Use the explanation when reviewing jobs without modifying server crontabs here.",
    ],
    examples: [
      { title: "Every six hours", input: "0 */6 * * *" },
      { title: "Weekday mornings", input: "15 2 * * 1-5" },
      { title: "Weekly Sunday job", input: "0 0 * * 0" },
      { title: "Every minute (demo)", input: "* * * * *" },
    ],
    relatedSlugs: ["timestamp-converter", "yaml-formatter", "json-formatter", "regex-tester"],
    affiliateContext: ["backend", "api", "productivity"],
    loadComponent: () => import("@/tools/cron-parser/Tool"),
  },
  {
    slug: "query-string-parser",
    title: "Query String Parser",
    description:
      "Parse URL query parameters into a table and rebuild percent-encoded query strings for API debugging.",
    category: "utilities",
    popular: false,
    keywordCluster: {
      primary: "query string parser",
      secondary: [
        "url query parser",
        "parse url parameters",
        "decode query string",
        "url parameter decoder",
        "query param parser online",
      ],
      longTail: [
        "parse oauth redirect query parameters",
        "split url search params into table",
        "rebuild encoded query string online",
      ],
    },
    howItWorks: [
      "Paste a full URL or raw query string starting with `?`.",
      "Keys and values appear in a table with decoding applied by URLSearchParams.",
      "Copy the rebuilt query string after inspecting or mentally editing values.",
    ],
    examples: [
      {
        title: "Search API URL",
        input: "https://api.example.com/search?q=dev+tools&page=2&sort=desc",
      },
      { title: "OAuth-style callback", input: "?code=abc123&state=csrf-token-9" },
      { title: "Pagination params", input: "?limit=50&offset=100&fields=id,name" },
      { title: "Tracking query", input: "?utm_source=newsletter&utm_campaign=launch" },
    ],
    relatedSlugs: [
      "url-encoder",
      "base64-encoder",
      "jwt-decoder",
      "json-formatter",
      "html-formatter",
    ],
    affiliateContext: ["api", "frontend", "backend"],
    loadComponent: () => import("@/tools/query-string-parser/Tool"),
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
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
    relatedSlugs: [
      "jwt-decoder",
      "uuid-generator",
      "json-formatter",
      "json-to-typescript",
      "base64-encoder",
    ],
    affiliateContext: ["api", "backend", "productivity"],
    loadComponent: () => import("@/tools/timestamp-converter/Tool"),
  },
  {
    slug: "json-to-typescript",
    title: "JSON to TypeScript Interface Generator",
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
    relatedSlugs: ["json-formatter", "uuid-generator", "base64-encoder", "timestamp-converter"],
    affiliateContext: ["ai-coding", "backend", "frontend"],
    loadComponent: () => import("@/tools/json-to-typescript/Tool"),
  },
];

const assembledTools: ToolDefinition[] = toolSeeds.map((seed) => {
  const seo = toolSeoContent[seed.slug as ToolSlug];
  const serp = toolSerpMeta[seed.slug as ToolSlug];

  return {
    ...seed,
    ...seo,
    ...serp,
    contentSections: seo.contentSections ?? [],
    internalLinkSlugs: seo.internalLinkSlugs ?? seed.relatedSlugs,
    keywords: buildToolKeywords(seed.keywordCluster),
  };
});

assertToolRegistry(assembledTools, toolSeoContent);

export const tools = assembledTools;

export const toolSlugs = tools.map((tool) => tool.slug);
