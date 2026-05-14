"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  SectionCard,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";

const sampleMarkdown = `# Developer Tools Hub

Ship faster with **browser-based developer utilities**.

## Includes

- JSON Formatter
- JWT Decoder
- Regex Tester
- Timestamp Converter

\`\`\`ts
const status = "production-ready";
\`\`\`
`;

export default function MarkdownPreviewerTool() {
  const [input, setInput] = useState(sampleMarkdown);

  useToolShortcuts({
    onCopy: () => {
      if (input) {
        void navigator.clipboard.writeText(input);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="Markdown editor"
        description="Write Markdown on the left and preview rendered output instantly on the right."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Markdown input" />
          <CopyButton value={input} label="Copy markdown" />
        </div>
        <TextareaField
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="ghost"
            onClick={() => setInput(sampleMarkdown)}
          >
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Rendered preview"
        description="Use this to validate README content, docs sections, or release notes before publishing."
      >
        <div className="prose-output min-h-[220px] rounded-3xl border border-border bg-background px-5 py-4">
          <ReactMarkdown>
            {input || "Start typing Markdown to preview it here."}
          </ReactMarkdown>
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
