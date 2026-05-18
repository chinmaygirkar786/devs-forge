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
import { formatHtml, minifyHtml } from "@/lib/tool-helpers";

const sampleHtml = `<section><h1>Devs Forge</h1><p>Fast online coding utilities.</p><ul><li>JSON</li><li>JWT</li><li>Regex</li></ul></section>`;
const htmlModeOptions = [
  { label: "Format HTML", value: "format" },
  { label: "Minify HTML", value: "minify" },
] as const;

export default function HtmlFormatterTool() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [input, setInput] = useState(sampleHtml);

  const result = useMemo(() => {
    try {
      return {
        output: mode === "format" ? formatHtml(input) : minifyHtml(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unable to transform HTML.",
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
      <SectionCard
        title="Source HTML"
        description="Beautify markup for readability or minify it for lighter embeds and snippets."
      >
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...htmlModeOptions]}
          onChange={(value) => setMode(value as "format" | "minify")}
        />

        <div className="mt-4">
          <FieldLabel label="HTML input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleHtml)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Transformed output"
        description="Copy the result directly into templates, CMS snippets, or component markup."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Output" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="HTML transformed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
