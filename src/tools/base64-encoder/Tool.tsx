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
import { decodeBase64, encodeBase64 } from "@/lib/tool-helpers";

const sampleText = "developer-tools-hub";
const modeOptions = [
  { label: "Encode text", value: "encode" },
  { label: "Decode Base64", value: "decode" },
] as const;

export default function Base64EncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(sampleText);

  const result = useMemo(() => {
    try {
      const output = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      return { output, error: "" };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unable to transform input.",
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
        title="Transform Base64"
        description="Switch between encode and decode mode for API payloads, secrets, and text snippets."
      >
        <FieldLabel label="Mode" />
        <DropdownField
          value={mode}
          options={[...modeOptions]}
          onChange={(value) => setMode(value as "encode" | "decode")}
        />

        <div className="mt-4">
          <FieldLabel label="Input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleText)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Output"
        description="Output updates instantly so you can copy the transformed value into your workflow."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label={mode === "encode" ? "Encoded output" : "Decoded text"} />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="Transformation completed successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
