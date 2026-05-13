"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  InputField,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import { jsonToTypeScript } from "@/lib/tool-helpers";

const sampleJson = `{"id":"usr_1","name":"Ava","roles":["admin"],"profile":{"timezone":"UTC","active":true}}`;

export default function JsonToTypeScriptTool() {
  const [rootName, setRootName] = useState("UserResponse");
  const [input, setInput] = useState(sampleJson);

  const result = useMemo(() => {
    try {
      return {
        output: jsonToTypeScript(input, rootName),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unable to infer types.",
      };
    }
  }, [input, rootName]);

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
        title="Source JSON"
        description="Paste a representative payload to infer nested interfaces and array types."
      >
        <FieldLabel label="Root interface name" />
        <InputField value={rootName} onChange={(event) => setRootName(event.target.value)} />

        <div className="mt-4">
          <FieldLabel label="JSON input" />
          <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleJson)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="TypeScript interfaces"
        description="Use the generated output as a starting point for API client and frontend typings."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Generated code" />
          <CopyButton value={result.output} />
        </div>
        <TextareaField value={result.output} readOnly spellCheck={false} />
        <div className="mt-4">
          {result.error ? (
            <StatusBanner tone="danger" text={result.error} />
          ) : (
            <StatusBanner tone="success" text="Interfaces generated successfully." />
          )}
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
