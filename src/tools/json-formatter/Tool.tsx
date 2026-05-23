"use client";

import posthog from "posthog-js";
import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  DropdownField,
  Field,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { formatJson } from "@/lib/tool-helpers";

const sampleJson = `{"name":"Developer Tools Hub","tools":["json","jwt","regex"],"premium":true}`;
const indentOptions = [
  { label: "2 spaces", value: "2" },
  { label: "4 spaces", value: "4" },
] as const;

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
        className="relative z-20 overflow-visible"
        title="Input JSON"
        description="Paste a JSON payload, then use Ctrl + Shift + C to copy formatted output or Ctrl + Backspace to clear."
      >
        <Field label="Raw JSON" hint="Client-side only">
          <TextareaField
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </Field>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-44">
            <FieldLabel label="Indent" />
            <DropdownField
              value={space}
              options={[...indentOptions]}
              onChange={setSpace}
              placeholder="Indent"
            />
          </div>
          <ActionButton
            className="self-end"
            variant="ghost"
            onClick={() => {
              setInput(sampleJson);
              posthog.capture("tool_example_loaded", { tool_slug: "json-formatter" });
            }}
          >
            Load example
          </ActionButton>
          <ActionButton
            className="self-end"
            variant="ghost"
            onClick={() => {
              setInput("");
              posthog.capture("tool_input_cleared", { tool_slug: "json-formatter" });
            }}
          >
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Formatted output"
        description="Syntax is validated before formatting so you can spot malformed payloads quickly."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-foreground text-sm font-semibold">Pretty JSON</span>
          <CopyButton value={result.output} />
        </div>
        <TextareaField
          value={result.output}
          readOnly
          spellCheck={false}
          aria-label="Pretty JSON output"
        />
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
