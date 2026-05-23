import type { ToolSeoBlock } from "@/tools/types";

export const caseConverterSeo: ToolSeoBlock = {
  seoIntro:
    "Convert identifiers between camelCase, snake_case, kebab-case, and more for APIs, databases, and env vars—instantly in the browser.",
  contentSections: [
    {
      heading: "Naming conventions in everyday development",
      paragraphs: [
        "JavaScript favors camelCase while SQL and Python often use snake_case. URLs and CSS variables lean on kebab-case. A case converter online removes manual retyping when mapping fields across layers.",
      ],
    },
    {
      heading: "How tokenization works",
      paragraphs: [
        "The tool splits input on spaces, underscores, hyphens, and camelCase boundaries, then rebuilds the target style. Paste any mixed identifier to normalize it.",
      ],
    },
  ],
  useCases: [
    "Map database columns to TypeScript properties.",
    "Convert env var names between CONSTANT_CASE and camelCase.",
    "Generate kebab-case slugs from product titles.",
    "Normalize OpenAPI field names for clients.",
    "Prepare test fixture keys across languages.",
    "Fix inconsistent naming in copied JSON samples.",
  ],
  faqs: [
    {
      question: "Can I convert phrases with spaces?",
      answer: "Yes. Words are detected from spaces and punctuation.",
    },
    {
      question: "Does order of words change?",
      answer: "Word order is preserved; only casing and separators change.",
    },
    {
      question: "Is upload required?",
      answer: "No. Conversion is local.",
    },
    {
      question: "What about acronyms?",
      answer: "Acronyms are treated as words; review output for API-specific rules.",
    },
    {
      question: "Can I batch convert many lines?",
      answer: "Paste one identifier at a time for predictable results.",
    },
    {
      question: "Related tools?",
      answer: "Pair with JSON formatter or JSON to TypeScript when scaffolding types.",
    },
  ],
  internalLinkSlugs: [
    "json-formatter",
    "json-to-typescript",
    "url-encoder",
    "regex-tester",
    "uuid-generator",
    "base64-encoder",
  ],
};
