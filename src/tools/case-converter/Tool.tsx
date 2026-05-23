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
import { type CaseStyle, convertCase } from "@/lib/tool-helpers";

const sampleInput = "user_profile_id";

const caseOptions = [
  { label: "camelCase", value: "camelCase" },
  { label: "PascalCase", value: "PascalCase" },
  { label: "snake_case", value: "snake_case" },
  { label: "kebab-case", value: "kebab-case" },
  { label: "CONSTANT_CASE", value: "CONSTANT_CASE" },
  { label: "lower case", value: "lower case" },
  { label: "UPPER CASE", value: "UPPER CASE" },
] as const;

export default function CaseConverterTool() {
  const [style, setStyle] = useState<CaseStyle>("camelCase");
  const [input, setInput] = useState(sampleInput);

  const output = useMemo(() => convertCase(input, style), [input, style]);

  useToolShortcuts({
    onCopy: () => {
      if (output) {
        void navigator.clipboard.writeText(output);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="Identifier input"
        description="Convert API field names, env vars, and constants between naming conventions."
      >
        <FieldLabel label="Target style" />
        <DropdownField
          value={style}
          options={[...caseOptions]}
          onChange={(value) => setStyle(value as CaseStyle)}
        />

        <div className="mt-4">
          <FieldLabel label="Input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleInput)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Converted output"
        description="Copy into code, OpenAPI schemas, or database migrations."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Result" />
          <CopyButton value={output} />
        </div>
        <TextareaField value={output} readOnly spellCheck={false} />
        <div className="mt-4">
          <StatusBanner
            tone={output ? "success" : "neutral"}
            text={output ? "Case converted successfully." : "Enter text to convert."}
          />
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
