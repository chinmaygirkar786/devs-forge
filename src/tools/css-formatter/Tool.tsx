"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  DropdownField,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { formatCss, minifyCss } from "@/lib/tool-helpers";

const sampleCss = `.card{display:flex;flex-direction:column;gap:1rem;padding:1.5rem;border-radius:1rem;background:#fff}`;

const cssModeOptions = [
  { label: "Format CSS", value: "format" },
  { label: "Minify CSS", value: "minify" },
] as const;

export default function CssFormatterTool() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [input, setInput] = useState(sampleCss);

  const result = useMemo(() => {
    try {
      return {
        output: mode === "format" ? formatCss(input) : minifyCss(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unable to transform CSS.",
      };
    }
  }, [input, mode]);

  useToolShortcuts({
    onCopy: () => {
      if (result.output) {
        void navigator.clipboard.writeText(result.output);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard title="Source CSS" description="Beautify or minify stylesheets and snippets.">
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...cssModeOptions]}
          onChange={(value) => setMode(value as "format" | "minify")}
        />

        <div className="mt-4">
          <FieldLabel label="CSS input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleCss)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Output"
        description="Paste into components, emails, or design handoff docs."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Result" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="CSS transformed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
