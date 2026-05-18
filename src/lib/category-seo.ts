import type { ToolCategory } from "@/tools";

export const categorySeoCopy: Record<
  ToolCategory,
  { headline: string; intro: string }
> = {
  formatting: {
    headline: "Formatting tools for JSON, HTML, and Markdown",
    intro:
      "Clean up structured data and markup before you debug, document, or ship. These browser-based formatters help you pretty-print JSON API responses, beautify HTML snippets for embeds, and preview Markdown without leaving your editor workflow. Everything runs locally so payloads and content never leave your device.",
  },
  conversion: {
    headline: "Conversion tools for URLs, Base64, and timestamps",
    intro:
      "Move between common developer encodings and time formats in seconds. Encode query strings, decode Base64 payloads, and convert Unix timestamps while debugging APIs or auth flows. Each converter uses native browser APIs for predictable results with zero server uploads.",
  },
  generators: {
    headline: "Generators for UUIDs, colors, gradients, and TypeScript types",
    intro:
      "Create identifiers, design tokens, CSS gradients, and TypeScript interfaces from sample data. These generators are built for everyday scaffolding—fixture IDs, theme ramps, hero backgrounds, and API typings—without installing CLI tools or extensions.",
  },
  utilities: {
    headline: "Developer utilities for JWT, regex, and daily debugging",
    intro:
      "Inspect tokens, test regular expressions, and validate patterns during development. Utilities on this page focus on quick inspection tasks that come up constantly when working with authentication, log parsing, and string matching.",
  },
};
