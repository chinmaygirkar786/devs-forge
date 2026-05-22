import type { ToolSeoBlock } from "@/tools/types";

export const queryStringParserSeo: ToolSeoBlock = {
  seoIntro:
    "Parse URL query strings into keys and values, then rebuild encoded query strings for API debugging—without leaving the browser.",
  contentSections: [
    {
      heading: "Query strings in API workflows",
      paragraphs: [
        "Redirects, search endpoints, and OAuth callbacks pack state into query parameters. A query string parser online turns opaque URLs into tables you can scan, then rebuilds percent-encoded output for tests.",
      ],
    },
    {
      heading: "How parsing differs from URL encoder",
      paragraphs: [
        "The URL encoder tool transforms entire strings. This parser splits parameters so you can inspect each key and value, then copy a rebuilt query string.",
      ],
    },
  ],
  useCases: [
    "Inspect redirect URLs from authentication flows.",
    "Debug search API filters and pagination params.",
    "Compare staging vs production query parameters.",
    "Rebuild query strings after editing values.",
    "Document webhook callback parameters.",
    "Pair with JWT decoder when debugging tokens in URLs.",
  ],
  faqs: [
    {
      question: "Can I paste a full URL?",
      answer: "Yes. The tool extracts the query portion automatically.",
    },
    {
      question: "Are duplicate keys supported?",
      answer: "URLSearchParams preserves multiple values per key where present.",
    },
    {
      question: "Is data uploaded?",
      answer: "No. Parsing is local.",
    },
    {
      question: "How is encoding handled on rebuild?",
      answer: "Rebuilt strings use standard percent-encoding via URLSearchParams.",
    },
    {
      question: "Does this replace URL encoder?",
      answer: "Use URL encoder for whole-string encode/decode; use this tool for structured parameter editing.",
    },
    {
      question: "What about hash fragments?",
      answer: "Hash fragments are ignored; only the query string is parsed.",
    },
  ],
  internalLinkSlugs: [
    "url-encoder",
    "base64-encoder",
    "jwt-decoder",
    "json-formatter",
    "regex-tester",
    "html-formatter",
  ],
};
