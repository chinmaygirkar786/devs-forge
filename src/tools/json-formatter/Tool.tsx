"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  SectionCard,
  SelectField,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { formatJson } from "@/lib/tool-helpers";

const sampleJson = `{"name":"Developer Tools Hub","tools":["json","jwt","regex"],"premium":true}`;

export default function JsonFormatterTool() {
  const [input, setInput] = useState(sampleJson);
  const [space, setSpace] = useState("2");

  const result = useMemo(() => {
    try {
      return {
        output: formatJson(input, Number(space)),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid JSON.",
      };
    }
  }, [input, space]);

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
        title="Input JSON"
        description="Paste a JSON payload, then use Ctrl + Shift + C to copy formatted output or Ctrl + Backspace to clear."
      >
        <FieldLabel label="Raw JSON" hint="Client-side only" />
        <TextareaField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="w-32">
            <FieldLabel label="Indent" />
            <SelectField value={space} onChange={(event) => setSpace(event.target.value)}>
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </SelectField>
          </div>
          <ActionButton variant="ghost" onClick={() => setInput(sampleJson)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Formatted output"
        description="Syntax is validated before formatting so you can spot malformed payloads quickly."
      >
        <div className="flex items-center justify-between gap-3">
          <FieldLabel label="Pretty JSON" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="JSON is valid and formatted." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
