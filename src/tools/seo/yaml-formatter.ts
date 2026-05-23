import type { ToolSeoBlock } from "@/tools/types";

export const yamlFormatterSeo: ToolSeoBlock = {
  seoIntro:
    "Format and validate YAML for Kubernetes, Docker Compose, GitHub Actions, and application config—processed locally with no upload.",
  contentSections: [
    {
      heading: "Why a YAML formatter online matters",
      paragraphs: [
        "YAML drives modern infrastructure and CI configuration. A single indentation mistake can break deployments. This yaml formatter online validates structure, then pretty-prints with consistent spacing so you can review keys and nested blocks quickly.",
        "Because parsing happens in the browser, secrets in manifests stay on your machine during ad hoc edits.",
      ],
    },
    {
      heading: "Formatting vs minifying YAML",
      paragraphs: [
        "Format mode expands documents with readable indentation. Minify mode compacts whitespace while preserving data. Both paths parse first so invalid YAML fails fast with a clear error.",
      ],
    },
  ],
  useCases: [
    "Pretty-print Kubernetes manifests before code review.",
    "Validate docker-compose files copied from documentation.",
    "Format GitHub Actions workflow snippets.",
    "Minify YAML samples for compact README examples.",
    "Fix indentation drift in Ansible playbooks.",
    "Compare staging and production config after formatting both.",
  ],
  faqs: [
    {
      question: "Is my YAML uploaded?",
      answer: "No. Parsing and formatting run entirely in your browser.",
    },
    {
      question: "Does this support multi-document YAML?",
      answer: "Paste one document at a time for clearest validation feedback.",
    },
    {
      question: "Can I change indentation width?",
      answer: "Yes. Choose two or four spaces when formatting.",
    },
    {
      question: "What if parsing fails?",
      answer: "The tool surfaces parser errors so you can fix syntax before output is shown.",
    },
    {
      question: "How is this different from JSON formatter?",
      answer:
        "Use JSON formatter for JSON payloads. This tool targets YAML-specific syntax and indentation rules.",
    },
    {
      question: "Can I minify YAML for transport?",
      answer: "Yes. Switch to minify mode after validating structure.",
    },
  ],
  internalLinkSlugs: [
    "json-formatter",
    "xml-formatter",
    "html-formatter",
    "json-to-typescript",
    "timestamp-converter",
    "url-encoder",
  ],
};
