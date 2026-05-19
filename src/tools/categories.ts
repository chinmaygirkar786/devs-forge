import type { ToolCategory } from "@/tools/types";

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

export const toolCategoryKeys = Object.keys(toolCategories) as ToolCategory[];
