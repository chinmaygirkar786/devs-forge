import type { ToolSlug } from "@/tools/slugs";
import type { ToolSeoBlock } from "@/tools/types";
import { base64EncoderSeo } from "@/tools/seo/base64-encoder";
import { jsonFormatterSeo } from "@/tools/seo/json-formatter";
import { jwtDecoderSeo } from "@/tools/seo/jwt-decoder";
import { regexTesterSeo } from "@/tools/seo/regex-tester";
import { uuidGeneratorSeo } from "@/tools/seo/uuid-generator";
import { caseConverterSeo } from "@/tools/seo/case-converter";
import { cronParserSeo } from "@/tools/seo/cron-parser";
import { cssFormatterSeo } from "@/tools/seo/css-formatter";
import { hashGeneratorSeo } from "@/tools/seo/hash-generator";
import { queryStringParserSeo } from "@/tools/seo/query-string-parser";
import { xmlFormatterSeo } from "@/tools/seo/xml-formatter";
import { yamlFormatterSeo } from "@/tools/seo/yaml-formatter";

const defaultSeoFields: Pick<ToolSeoBlock, "contentSections" | "internalLinkSlugs"> = {
  contentSections: [],
  internalLinkSlugs: undefined,
};

export const toolSeoContent: Record<ToolSlug, ToolSeoBlock> = {
  "json-formatter": jsonFormatterSeo,
  "jwt-decoder": jwtDecoderSeo,
  "regex-tester": regexTesterSeo,
  "base64-encoder": base64EncoderSeo,
  "uuid-generator": uuidGeneratorSeo,
  "color-palette-generator": {
    ...defaultSeoFields,
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
        answer: "Swatch labels use contrast-aware text colors for readability on each background.",
      },
    ],
  },
  "gradient-generator": {
    ...defaultSeoFields,
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
        answer: "Yes. Adjust the angle control and the preview updates instantly.",
      },
      {
        question: "Do I need to install anything?",
        answer: "No. The generator runs entirely in your browser with instant preview.",
      },
    ],
  },
  "markdown-previewer": {
    ...defaultSeoFields,
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
    ...defaultSeoFields,
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
        answer: "Yes. Paste an encoded string and switch to decode mode for readable output.",
      },
      {
        question: "Is data sent to a server?",
        answer: "No. Encoding and decoding run locally in your browser.",
      },
    ],
  },
  "html-formatter": {
    ...defaultSeoFields,
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
        answer: "Yes. Switch to minify mode to produce a compact single-line snippet.",
      },
      {
        question: "Are attributes with special characters supported?",
        answer: "Yes. The formatter respects quoted attribute values when indenting tags.",
      },
    ],
  },
  "xml-formatter": xmlFormatterSeo,
  "yaml-formatter": yamlFormatterSeo,
  "css-formatter": cssFormatterSeo,
  "case-converter": caseConverterSeo,
  "hash-generator": hashGeneratorSeo,
  "cron-parser": cronParserSeo,
  "query-string-parser": queryStringParserSeo,
  "timestamp-converter": {
    ...defaultSeoFields,
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
        answer: "Output includes localized formatting based on your browser timezone settings.",
      },
    ],
  },
  "json-to-typescript": {
    ...defaultSeoFields,
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
};
