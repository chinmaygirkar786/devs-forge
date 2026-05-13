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

const sampleUrl = "https://example.com/callback?tab=team members&redirect=/dashboard";
const urlModeOptions = [
  { label: "Encode", value: "encode" },
  { label: "Decode", value: "decode" },
] as const;

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(sampleUrl);

  const result = useMemo(() => {
    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unable to transform URL.",
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
        title="URL string"
        description="Encode query strings, redirect targets, and URL fragments safely."
      >
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...urlModeOptions]}
          onChange={(value) => setMode(value as "encode" | "decode")}
        />

        <div className="mt-4">
          <FieldLabel label="Input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleUrl)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Encoded output"
        description="Keep special characters safe for browser routing, redirects, or API calls."
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
            <StatusBanner tone="success" text="URL transformation completed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
