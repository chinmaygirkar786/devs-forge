import type { ToolSlug } from "@/tools/slugs";
import type { ToolSeoBlock } from "@/tools/types";

export const toolSeoContent = {
  "json-formatter": {
    seoIntro:
      "Use this JSON formatter when you need to validate API responses, compare payloads, or share readable configuration with your team.",
    useCases: [
      "Pretty-print JSON from network tabs before pasting into tickets or docs.",
      "Validate configuration files before deploying to staging.",
      "Fix trailing commas and syntax issues highlighted by the parser.",
    ],
    faqs: [
      {
        question: "Does this JSON formatter send my data to a server?",
        answer:
          "No. Parsing and formatting happen entirely in your browser. Your JSON never leaves your device.",
      },
      {
        question: "Can I format minified JSON from an API response?",
        answer:
          "Yes. Paste compact JSON and the tool will expand it with consistent indentation for easier reading.",
      },
      {
        question: "What happens if my JSON is invalid?",
        answer:
          "The tool surfaces a syntax error so you can locate and fix malformed structure before formatting.",
      },
    ],
  },
  "jwt-decoder": {
    seoIntro:
      "Decode JWT access tokens and ID tokens locally to inspect claims, expiration, and issuer details during auth debugging.",
    useCases: [
      "Verify exp and iat claims when debugging session timeouts.",
      "Inspect roles and subject IDs without opening a separate CLI.",
      "Review header algorithm values before trusting a token.",
    ],
    faqs: [
      {
        question: "Is it safe to paste production JWTs here?",
        answer:
          "Decoding runs locally with no network calls, but avoid sharing sensitive tokens on shared machines. This tool does not verify signatures.",
      },
      {
        question: "Can this tool validate JWT signatures?",
        answer:
          "No. It decodes header and payload segments only. Use your identity provider or backend to verify signatures.",
      },
      {
        question: "What JWT formats are supported?",
        answer:
          "Standard three-segment JWT strings (header.payload.signature) using Base64url encoding.",
      },
    ],
  },
  "regex-tester": {
    seoIntro:
      "Test regular expressions against sample text and review matches before adding patterns to production code or validation rules.",
    useCases: [
      "Prototype regex for log parsing and input validation.",
      "Compare global and case-insensitive flag behavior on real samples.",
      "Learn common tokens with plain-English explanations.",
    ],
    faqs: [
      {
        question: "Which regex flavor does this tester use?",
        answer:
          "It uses JavaScript regular expressions, matching the same behavior as RegExp in browsers and Node.js.",
      },
      {
        question: "Can I test capture groups?",
        answer:
          "Yes. Matches show grouped captures when your pattern defines them.",
      },
      {
        question: "Why does my pattern fail?",
        answer:
          "Invalid syntax or unsupported features will surface as errors. Simplify the pattern and add tokens incrementally.",
      },
    ],
  },
  "base64-encoder": {
    seoIntro:
      "Encode and decode Base64 strings with UTF-8 support for API debugging, token inspection, and data conversion workflows.",
    useCases: [
      "Decode Base64 payloads embedded in JWT segments or config.",
      "Encode credentials or binary-safe text for transport.",
      "Switch between encode and decode without leaving the browser.",
    ],
    faqs: [
      {
        question: "Does this support Unicode text?",
        answer:
          "Yes. The tool encodes and decodes UTF-8 text safely before applying Base64 conversion.",
      },
      {
        question: "Is URL-safe Base64 supported?",
        answer:
          "The decoder tolerates common URL-safe variants by normalizing characters before decoding.",
      },
      {
        question: "Where is my input processed?",
        answer:
          "All conversion runs locally in your browser. Nothing is uploaded to a server.",
      },
    ],
  },
  "uuid-generator": {
    seoIntro:
      "Generate UUID v4 values for test fixtures, database seeds, and local development without installing extra packages.",
    useCases: [
      "Create batches of IDs for mock APIs and seed scripts.",
      "Copy a single UUID into environment variables or forms.",
      "Refresh lists quickly when you need unique values.",
    ],
    faqs: [
      {
        question: "What UUID version is generated?",
        answer: "This tool generates random UUID version 4 (v4) identifiers.",
      },
      {
        question: "How random are the UUIDs?",
        answer:
          "UUIDs use the browser crypto API for cryptographically strong random values when available.",
      },
      {
        question: "Can I generate multiple UUIDs at once?",
        answer:
          "Yes. Choose a count and copy the full list for fixtures or test data.",
      },
    ],
  },
  "color-palette-generator": {
    seoIntro:
      "Build a full color scale from a single brand hex for design systems, dashboards, and Tailwind-style token ramps.",
    useCases: [
      "Generate 50–900 shades from a primary brand color.",
      "Copy hex values into CSS variables or design tools.",
      "Explore random palettes for UI concepts.",
    ],
    faqs: [
      {
        question: "What shades does the palette include?",
        answer:
          "The generator produces a scale from 50 through 900, similar to common UI framework palettes.",
      },
      {
        question: "Can I copy individual swatches?",
        answer: "Yes. Click a swatch to copy its hex value to the clipboard.",
      },
      {
        question: "Does this check color contrast?",
        answer:
          "Swatch labels use contrast-aware text colors for readability on each background.",
      },
    ],
  },
  "gradient-generator": {
    seoIntro:
      "Create CSS linear gradients with live preview and copy-ready code for heroes, buttons, and backgrounds.",
    useCases: [
      "Prototype hero section backgrounds with two brand colors.",
      "Adjust angle and stops before committing CSS.",
      "Copy gradient declarations into component styles.",
    ],
    faqs: [
      {
        question: "What CSS output is generated?",
        answer:
          "The tool outputs a linear-gradient declaration you can paste into stylesheets or CSS modules.",
      },
      {
        question: "Can I change the gradient angle?",
        answer:
          "Yes. Adjust the angle control and the preview updates instantly.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No. The generator runs entirely in your browser with instant preview.",
      },
    ],
  },
  "markdown-previewer": {
    seoIntro:
      "Write Markdown and preview rendered output side by side before publishing README files, docs, or changelog entries.",
    useCases: [
      "Preview README sections with headers, lists, and code blocks.",
      "Validate formatting before pushing documentation.",
      "Draft release notes with live rendered output.",
    ],
    faqs: [
      {
        question: "What Markdown features are supported?",
        answer:
          "Common Markdown syntax including headings, lists, emphasis, links, and fenced code blocks.",
      },
      {
        question: "Is my Markdown uploaded anywhere?",
        answer: "No. Rendering happens locally in your browser.",
      },
      {
        question: "Can I copy the rendered HTML?",
        answer:
          "The tool focuses on preview. Copy the Markdown source and use your site's renderer for final HTML export.",
      },
    ],
  },
  "url-encoder": {
    seoIntro:
      "Encode and decode URL components, query strings, and path segments for API requests and redirect debugging.",
    useCases: [
      "Encode query parameters before sending test requests.",
      "Decode percent-encoded redirect URLs from logs.",
      "Fix broken links caused by unescaped characters.",
    ],
    faqs: [
      {
        question: "What encoding standard is used?",
        answer:
          "The tool uses standard percent-encoding compatible with encodeURIComponent and decodeURIComponent.",
      },
      {
        question: "Can I decode a full URL?",
        answer:
          "Yes. Paste an encoded string and switch to decode mode for readable output.",
      },
      {
        question: "Is data sent to a server?",
        answer: "No. Encoding and decoding run locally in your browser.",
      },
    ],
  },
  "html-formatter": {
    seoIntro:
      "Beautify or minify HTML markup for templates, email snippets, and embed codes with local-only processing.",
    useCases: [
      "Indent nested HTML for code reviews and documentation.",
      "Minify widgets before embedding in production pages.",
      "Clean up copied markup from CMS or email builders.",
    ],
    faqs: [
      {
        question: "Does formatting change my HTML semantics?",
        answer:
          "Formatting adds whitespace between tags for readability. Minifying removes extra whitespace without changing structure.",
      },
      {
        question: "Can I minify HTML for production?",
        answer:
          "Yes. Switch to minify mode to produce a compact single-line snippet.",
      },
      {
        question: "Are attributes with special characters supported?",
        answer:
          "Yes. The formatter respects quoted attribute values when indenting tags.",
      },
    ],
  },
  "timestamp-converter": {
    seoIntro:
      "Convert Unix epoch timestamps to readable dates and back—useful for JWT exp claims, logs, and API debugging.",
    useCases: [
      "Decode exp and iat values from JWT payloads.",
      "Convert log timestamps to local time zones.",
      "Generate epoch values for test fixtures.",
    ],
    faqs: [
      {
        question: "Does this support seconds and milliseconds?",
        answer:
          "Yes. The tool detects whether your value is in seconds or milliseconds automatically.",
      },
      {
        question: "What date formats can I enter?",
        answer:
          "You can paste Unix numbers or human-readable date strings supported by the browser Date parser.",
      },
      {
        question: "Is timezone handled?",
        answer:
          "Output includes localized formatting based on your browser timezone settings.",
      },
    ],
  },
  "json-to-typescript": {
    seoIntro:
      "Turn sample JSON API responses into TypeScript interfaces to bootstrap typings for frontend and backend projects.",
    useCases: [
      "Generate interfaces from example API payloads.",
      "Scaffold nested types for documentation and mocks.",
      "Iterate quickly before refining optional fields manually.",
    ],
    faqs: [
      {
        question: "Are generated types production-ready?",
        answer:
          "They are a strong starting point. Review optional fields, unions, and naming before committing to your codebase.",
      },
      {
        question: "Does it handle nested objects and arrays?",
        answer:
          "Yes. The generator infers nested structures and creates separate interfaces where needed.",
      },
      {
        question: "Is my JSON uploaded?",
        answer: "No. Type generation runs entirely in your browser.",
      },
    ],
  },
} satisfies Record<ToolSlug, ToolSeoBlock>;
